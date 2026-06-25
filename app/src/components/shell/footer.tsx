/**
 * Footer — Server Component shell (YODY DS).
 *
 * Server-safe, no client state.
 *
 * YODY DS compliance:
 *  - No emoji. Token colors only.
 *  - Root carries `data-surface="app"`.
 *  - Be Vietnam Pro inherits from app surface.
 */

export function Footer() {
  return (
    <footer
      data-surface="app"
      className="border-t border-border bg-[var(--bg-warm)] px-6 py-10 text-center font-[family-name:var(--font-body)] text-[13px] leading-relaxed text-[var(--fg-3)] md:px-11"
    >
      © 2026 YODY · Tài liệu đào tạo nội bộ — chia sẻ tự do.
    </footer>
  );
}

export default Footer;