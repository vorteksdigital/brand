# WCAG audit skill interpretation

- Source: `wshobson/agents`, skill `wcag-audit-patterns`
- Installed/read: 2026-07-26
- Project rules: WCAG 2.2 AA; native semantics first; keyboard access; visible,
  unobscured focus; no colour-only state; responsive reflow; labeled controls;
  alt/decorative distinction; status announcements; reduced motion.
- Patterns: skip link and landmarks, logical headings, accessible pagination,
  form error association, adequate contrast and target sizing.
- Tests: Axe tags `wcag2a`, `wcag2aa`, `wcag21aa`, `wcag22aa`; manual keyboard,
  zoom/reflow, contrast, text spacing, screen-reader passes.
- Review: POUR checklist, language/title, names/roles/values, no traps, focus
  restoration, content-authored rich text.
- Compatibility: automated checks cover only part of conformance; no certification
  claim. Native HTML replaces skill's illustrative custom-widget ARIA where possible.
- Applied: skip link/main target, semantic template patterns, Media policy,
  Playwright Axe suite, documented manual gate.
