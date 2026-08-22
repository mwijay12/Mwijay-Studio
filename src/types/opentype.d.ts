/**
 * Minimal ambient types for opentype.js.
 *
 * The package ships no bundled types and `@types/opentype.js` is not
 * published, so we declare only the small surface this project uses:
 * parsing a font buffer and turning a string into per-glyph vector paths.
 */
declare module 'opentype.js' {
  export interface BoundingBox {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
  }

  export interface Path {
    /** Serialised SVG path data. `decimals` controls precision. */
    toPathData(decimals?: number): string;
    getBoundingBox(): BoundingBox;
  }

  export interface Font {
    /** One Path per glyph, laid out from (x, y) at the given size. */
    getPaths(text: string, x: number, y: number, fontSize: number): Path[];
    getPath(text: string, x: number, y: number, fontSize: number): Path;
    unitsPerEm: number;
  }

  export function parse(buffer: ArrayBuffer): Font;
  export function load(url: string): Promise<Font>;
}
