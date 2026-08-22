import { useMemo, type ReactNode } from 'react';

/**
 * FormattedAIOutput — Parses AI generated markdown into clean, luxury styled typography.
 * Completely eliminates raw markdown artifacts:
 * - No raw #### or ### (rendered as clean styled headers)
 * - No raw *** or ** (rendered as clean bold/italic tags)
 * - No raw bullet asterisks (rendered as custom SVG/dot badges)
 * - No raw code backticks (rendered as styled cards)
 */

type BlockType =
  | { type: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'; content: string }
  | { type: 'song-section'; badge: string; isChorus: boolean; content: string[] }
  | { type: 'code'; code: string; lang?: string }
  | { type: 'quote'; lines: string[] }
  | { type: 'list'; ordered: boolean; items: string[] }
  | { type: 'table'; headers: string[]; rows: string[][] }
  | { type: 'paragraph'; lines: string[] };

export default function FormattedAIOutput({ text }: { text: string }) {
  const elements = useMemo(() => {
    if (!text || typeof text !== 'string') return null;

    // Normalize text & clean reasoning tags
    const normalized = text
      .replace(/<(think|thought)>[\s\S]*?(?:<\/\1>|$)/gi, '')
      .replace(/\r\n/g, '\n')
      .trim();

    if (!normalized) return null;

    const rawLines = normalized.split('\n');
    const blocks: BlockType[] = [];
    let i = 0;

    while (i < rawLines.length) {
      const line = rawLines[i];
      const trimmed = line.trim();

      // Empty line
      if (!trimmed) {
        i++;
        continue;
      }

      // 1. Code Block (```...```)
      if (trimmed.startsWith('```')) {
        const lang = trimmed.slice(3).trim();
        const codeLines: string[] = [];
        i++;
        while (i < rawLines.length && !rawLines[i].trim().startsWith('```')) {
          codeLines.push(rawLines[i]);
          i++;
        }
        if (i < rawLines.length) i++; // skip closing ```
        blocks.push({
          type: 'code',
          code: codeLines.join('\n'),
          lang: lang || undefined,
        });
        continue;
      }

      // 2. Heading (# Heading ... ###### Heading)
      const headingMatch = trimmed.match(/^(#{1,6})\s+(.+)$/);
      if (headingMatch) {
        const levelNum = headingMatch[1].length;
        const level = `h${Math.min(levelNum, 6)}` as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
        // Clean out any bold/italic markers inside heading
        const headingContent = cleanMarkdownHeader(headingMatch[2]);
        blocks.push({ type: level, content: headingContent });
        i++;
        continue;
      }

      // 3. Song / Audio Section (e.g. [Verse 1], [Chorus], *Verse 1:*, **Chorus:**, Hook:)
      const songMatch = trimmed.match(
        /^(\*{0,3}\[?(?:Verse|Chorus|Pre-Chorus|Bridge|Hook|Outro|Intro|Drop|Vamp|Track|Section)[^\]\n:]*\]?\*{0,3}:?)([\s\S]*)$/i
      );
      if (songMatch) {
        const badge = songMatch[1].replace(/[*\[\]:#]/g, '').trim();
        const isChorus = /chorus|hook/i.test(badge);
        const sectionLines: string[] = [];
        if (songMatch[2]?.trim()) {
          sectionLines.push(songMatch[2].trim());
        }
        i++;
        while (
          i < rawLines.length &&
          rawLines[i].trim() &&
          !rawLines[i].trim().match(/^(\*{0,3}\[?(?:Verse|Chorus|Pre-Chorus|Bridge|Hook|Outro|Intro|Drop|Vamp|Track|Section)[^\]\n:]*\]?\*{0,3}:?)/i) &&
          !rawLines[i].trim().match(/^#{1,6}\s+/) &&
          !rawLines[i].trim().startsWith('```')
        ) {
          sectionLines.push(rawLines[i].trim());
          i++;
        }
        blocks.push({
          type: 'song-section',
          badge,
          isChorus,
          content: sectionLines,
        });
        continue;
      }

      // 4. Blockquote (> ...)
      if (trimmed.startsWith('>')) {
        const quoteLines: string[] = [];
        while (i < rawLines.length && rawLines[i].trim().startsWith('>')) {
          quoteLines.push(rawLines[i].trim().replace(/^>\s*/, ''));
          i++;
        }
        blocks.push({ type: 'quote', lines: quoteLines });
        continue;
      }

      // 5. Table (| Col 1 | Col 2 |)
      if (trimmed.startsWith('|') && trimmed.endsWith('|') && trimmed.includes('|')) {
        const tableLines: string[] = [];
        while (
          i < rawLines.length &&
          rawLines[i].trim().startsWith('|') &&
          rawLines[i].trim().endsWith('|')
        ) {
          tableLines.push(rawLines[i].trim());
          i++;
        }
        if (tableLines.length >= 2) {
          const parsedHeaders = tableLines[0]
            .split('|')
            .filter((_, idx, arr) => idx > 0 && idx < arr.length - 1)
            .map((c) => c.trim());
          const dataLines = tableLines
            .slice(1)
            .filter((l) => !l.replace(/[\s\-|:]/g, '').length === false && !l.match(/^\|[\s\-:|]+\|$/));
          const rows = dataLines.map((row) =>
            row
              .split('|')
              .filter((_, idx, arr) => idx > 0 && idx < arr.length - 1)
              .map((c) => c.trim())
          );
          if (parsedHeaders.length > 0) {
            blocks.push({ type: 'table', headers: parsedHeaders, rows });
            continue;
          }
        }
      }

      // 6. List Items (bullet or numbered)
      const listMatch = trimmed.match(/^([•\-\*+]|\d+[\.\)])\s+(.+)$/);
      if (listMatch) {
        const isOrdered = /^\d+[\.\)]/.test(listMatch[1]);
        const items: string[] = [];

        while (i < rawLines.length) {
          const lTrim = rawLines[i].trim();
          const itemMatch = lTrim.match(/^([•\-\*+]|\d+[\.\)])\s+(.+)$/);
          if (itemMatch) {
            items.push(itemMatch[2]);
            i++;
          } else if (lTrim && !lTrim.match(/^#{1,6}\s+/) && !lTrim.startsWith('```') && !lTrim.startsWith('>')) {
            // Continuation line of previous list item
            if (items.length > 0) {
              items[items.length - 1] += ' ' + lTrim;
            } else {
              break;
            }
            i++;
          } else {
            break;
          }
        }

        blocks.push({ type: 'list', ordered: isOrdered, items });
        continue;
      }

      // 7. Regular Paragraph
      const pLines: string[] = [];
      while (
        i < rawLines.length &&
        rawLines[i].trim() &&
        !rawLines[i].trim().match(/^#{1,6}\s+/) &&
        !rawLines[i].trim().match(/^([•\-\*+]|\d+[\.\)])\s+/) &&
        !rawLines[i].trim().startsWith('```') &&
        !rawLines[i].trim().startsWith('>') &&
        !rawLines[i].trim().match(/^(\*{0,3}\[?(?:Verse|Chorus|Pre-Chorus|Bridge|Hook|Outro|Intro|Drop|Vamp|Track|Section)[^\]\n:]*\]?\*{0,3}:?)/i)
      ) {
        pLines.push(rawLines[i]);
        i++;
      }
      if (pLines.length > 0) {
        blocks.push({ type: 'paragraph', lines: pLines });
      }
    }

    return blocks.map((b, idx) => renderBlock(b, idx));
  }, [text]);

  return <div className="space-y-3 font-normal text-[#0a1633]">{elements}</div>;
}

/**
 * Strips raw markdown header wrappers e.g. ***Title*** or **Title** or trailing hashes
 */
function cleanMarkdownHeader(raw: string): string {
  let cleaned = raw.trim();
  // Strip trailing hashes e.g. ### Title ###
  cleaned = cleaned.replace(/\s+#+$/, '');
  // Strip surrounding bold/italic asterisks from headings so they don't look weird
  cleaned = cleaned.replace(/^(\*{1,3}|_{1,3})(.+?)(\1)$/, '$2');
  return cleaned.trim();
}

/**
 * Render individual semantic blocks into beautiful luxury components
 */
function renderBlock(block: BlockType, key: number): ReactNode {
  switch (block.type) {
    case 'h1':
    case 'h2':
      return (
        <div key={key} className="mt-6 mb-3 first:mt-0">
          <h3 className="serif text-2xl md:text-3xl font-bold tracking-tight text-[#0a1633]">
            {renderInline(block.content)}
          </h3>
          <div className="mt-1.5 h-0.5 w-12 bg-gradient-to-r from-[#2563eb] to-[#60a5fa] rounded-full" />
        </div>
      );

    case 'h3':
      return (
        <div key={key} className="mt-5 mb-2 first:mt-0 flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-[#2563eb] flex-shrink-0" />
          <h4 className="text-base md:text-lg font-bold text-[#0a1633] tracking-tight">
            {renderInline(block.content)}
          </h4>
        </div>
      );

    case 'h4':
    case 'h5':
    case 'h6':
      return (
        <h5
          key={key}
          className="text-xs md:text-sm font-semibold uppercase tracking-wider text-[#2563eb] mt-4 mb-1.5 first:mt-0"
        >
          {renderInline(block.content)}
        </h5>
      );

    case 'song-section':
      return (
        <div
          key={key}
          className={`my-3.5 rounded-2xl border p-4 transition-all ${
            block.isChorus
              ? 'border-[#2563eb]/25 bg-gradient-to-r from-blue-50/90 to-indigo-50/70 shadow-sm'
              : 'border-[#0a1633]/8 bg-white/70 shadow-xs'
          }`}
        >
          <span
            className={`inline-block rounded-lg px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider ${
              block.isChorus ? 'bg-[#2563eb] text-white shadow-sm' : 'bg-[#0a1633]/10 text-[#0a1633]'
            }`}
          >
            {block.badge}
          </span>
          {block.content.length > 0 && (
            <div className="mt-2.5 space-y-1 text-[15px] leading-relaxed text-[#0a1633]/90">
              {block.content.map((line, lIdx) => (
                <p key={lIdx}>{renderInline(line)}</p>
              ))}
            </div>
          )}
        </div>
      );

    case 'code':
      return (
        <div key={key} className="my-3 overflow-hidden rounded-2xl border border-[#0a1633]/10 bg-[#071127] shadow-md">
          {block.lang && (
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-1.5 text-[11px] font-mono text-blue-300">
              <span>{block.lang}</span>
              <span className="text-[10px] text-white/40">Code Block</span>
            </div>
          )}
          <pre className="overflow-x-auto p-4 text-xs font-mono text-blue-100 leading-relaxed">
            <code>{block.code}</code>
          </pre>
        </div>
      );

    case 'quote':
      return (
        <blockquote
          key={key}
          className="my-3 rounded-2xl border-l-4 border-[#2563eb] bg-blue-50/50 p-3.5 text-[14px] italic text-[#0a1633]/85"
        >
          {block.lines.map((l, lIdx) => (
            <p key={lIdx}>{renderInline(l)}</p>
          ))}
        </blockquote>
      );

    case 'table':
      return (
        <div key={key} className="my-4 overflow-x-auto rounded-2xl border border-[#0a1633]/10 shadow-sm">
          <table className="w-full text-left text-xs md:text-sm">
            <thead className="bg-[#0a1633]/5 text-[#0a1633] font-semibold border-b border-[#0a1633]/10">
              <tr>
                {block.headers.map((h, hIdx) => (
                  <th key={hIdx} className="px-3.5 py-2.5">
                    {renderInline(h)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#0a1633]/5">
              {block.rows.map((row, rIdx) => (
                <tr key={rIdx} className="hover:bg-blue-50/30 transition">
                  {row.map((cell, cIdx) => (
                    <td key={cIdx} className="px-3.5 py-2 text-[#0a1633]/85">
                      {renderInline(cell)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );

    case 'list':
      return (
        <ul key={key} className="my-2.5 space-y-2 pl-1">
          {block.items.map((item, idx) => (
            <li key={idx} className="flex items-start gap-2.5 text-[15px] leading-relaxed text-[#0a1633]/90">
              {block.ordered ? (
                <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-[#2563eb]/10 text-[11px] font-bold text-[#2563eb]">
                  {idx + 1}
                </span>
              ) : (
                <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#2563eb]" />
              )}
              <span className="flex-1">{renderInline(item)}</span>
            </li>
          ))}
        </ul>
      );

    case 'paragraph':
      return (
        <div key={key} className="my-2 space-y-1 text-[15px] leading-relaxed text-[#0a1633]/90">
          {block.lines.map((line, lIdx) => (
            <p key={lIdx}>{renderInline(line)}</p>
          ))}
        </div>
      );

    default:
      return null;
  }
}

/**
 * Parses inline formatting:
 * - ***bold italic*** -> <strong><em>...</em></strong>
 * - **bold** or __bold__ -> <strong>...</strong>
 * - *italic* or _italic_ -> <em>...</em>
 * - `code` -> <code>...</code>
 * - [text](url) -> <a>...</a>
 * - Strips any remaining unparsed #### or *** artifacts
 */
function renderInline(str: string): ReactNode {
  if (!str) return null;

  // Clean raw hashes that might be inline
  let cleaned = str.replace(/(?:^|\s)#{1,6}\s+/g, ' ');

  // Regex pattern matching:
  // 1) `code`
  // 2) ***bold italic*** or ___bold italic___
  // 3) **bold** or __bold__
  // 4) *italic* or _italic_
  // 5) [link text](url)
  const pattern = /(`[^`]+`|\*\*\*[^*]+\*\*\*|___[^_]+___|\*\*[^*]+\*\*|__[^_]+__|\*[^*]+\*|_[^_]+_|\[[^\]]+\]\([^)]+\))/g;

  const parts = cleaned.split(pattern);

  return parts.map((part, idx) => {
    if (!part) return null;

    // Inline Code: `code`
    if (part.startsWith('`') && part.endsWith('`') && part.length > 2) {
      return (
        <code
          key={idx}
          className="rounded bg-blue-50/80 px-1.5 py-0.5 text-[13px] font-mono text-[#2563eb] border border-blue-200/60"
        >
          {part.slice(1, -1)}
        </code>
      );
    }

    // Bold + Italic: ***text*** or ___text___
    if (
      (part.startsWith('***') && part.endsWith('***') && part.length > 6) ||
      (part.startsWith('___') && part.endsWith('___') && part.length > 6)
    ) {
      return (
        <strong key={idx} className="font-semibold text-[#0a1633]">
          <em>{part.slice(3, -3)}</em>
        </strong>
      );
    }

    // Bold: **text** or __text__
    if (
      (part.startsWith('**') && part.endsWith('**') && part.length > 4) ||
      (part.startsWith('__') && part.endsWith('__') && part.length > 4)
    ) {
      return (
        <strong key={idx} className="font-semibold text-[#0a1633]">
          {part.slice(2, -2)}
        </strong>
      );
    }

    // Italic: *text* or _text_
    if (
      (part.startsWith('*') && part.endsWith('*') && part.length > 2) ||
      (part.startsWith('_') && part.endsWith('_') && part.length > 2)
    ) {
      return (
        <em key={idx} className="italic text-[#0a1633]/85">
          {part.slice(1, -1)}
        </em>
      );
    }

    // Link: [text](url)
    const linkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (linkMatch) {
      return (
        <a
          key={idx}
          href={linkMatch[2]}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#2563eb] font-medium underline underline-offset-2 hover:text-[#1d4ed8]"
        >
          {linkMatch[1]}
        </a>
      );
    }

    // Plain text: strip any stray leftover *** or ### symbols that might have escaped
    const sanitized = part.replace(/\*{3,}/g, '').replace(/#{2,}/g, '');
    return <span key={idx}>{sanitized}</span>;
  });
}
