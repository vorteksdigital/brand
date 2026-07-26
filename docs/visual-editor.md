# Visual editor

Payload Admin's official Live Preview is compatibility foundation. Pages and
Posts create signed `/next/preview` URLs; draft mode reads unpublished Local API
data; `@payloadcms/live-preview-react` refreshes rendering during autosave.
Admin supplies 375×667, 768×1024, and 1440×900 frames. Exit uses
`/next/exit-preview`.

Upstream `pemedia/payload-visual-editor` was fully inspected at commit
`8b24562` (2024-03-14), version 2.0.6, MIT. It peers on Payload 2, React 18, and
deprecated Payload internal imports; direct installation is unsafe with Payload
3/React 19. Local `packages/payload-visual-editor-compat` preserves attribution
and ports only route construction, incomplete-draft normalisation, and exact
origin validation. Official Payload owns document transport/UI, replacing
upstream wildcard `postMessage`.

Test Pages and Posts by signing in, opening a draft, selecting Live Preview,
editing title/block/media, waiting for autosave, switching all widths, and
exiting. Confirm incomplete relationships show safe empty states and preview
URLs have `noindex`. Stale preview: verify origin/env/cookies, regenerate
importmap, and restart.
