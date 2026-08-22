import type { Announcement } from '../components/ui/AnnouncementBanner';

/**
 * Single site-wide announcement. Set to `null` to hide the banner entirely.
 * Bump the `id` whenever the message changes — visitors who dismissed an
 * older announcement will see the new one since it's a different id.
 */
export const currentAnnouncement: Announcement | null = {
  id: 'ai-tools-launch-2026-01',
  message: 'New: free AI tools for prompts, lyrics, and brand names — no login required.',
  linkLabel: 'Try them',
  linkTo: '/tools',
  variant: 'default',
};
