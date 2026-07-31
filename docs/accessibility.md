# Accessibility

Target: WCAG 2.2 AA. Foundation includes semantic landmarks, English language,
skip link, visible focus, native controls, labeled forms, responsive layouts,
image-alt policy, accessible pagination, reduced-motion styles, and Axe tests.

Manual release audit must cover keyboard order/menu operation, skip-link target,
focus not obscured, 320px reflow, 200% text and 400% zoom, contrast, text spacing,
screen-reader landmarks/headings/forms/status, and content-authored rich text.
Automated tests detect only part of WCAG and are not conformance certification.

The mobile header exposes an explicitly named modal navigation dialog. Opening
it moves focus to Close and locks background scrolling; Tab stays within the
drawer, Escape closes it, and focus returns to the menu trigger. Its automated
browser coverage also verifies cleanup when a mobile viewport becomes desktop.
