# Agent instructions

Mandatory workflow:

`READ DOCS → INSPECT EXISTING CODE → IMPLEMENT → UPDATE DOCS → TEST → REVIEW DIFF → HANDOVER`

Every agent must:

1. Read `docs/README.md`, then documents relevant to the request.
2. Consult `docs/skills/` before implementation and read `.agents/skills/payload/SKILL.md` for Payload work.
3. Inspect existing code before creating duplicate utilities or components.
4. Update documentation when behaviour, architecture, schemas, scripts, or environment requirements change.
5. Run relevant commands from `docs/testing.md`; never claim an unrun check passed or conceal failures.
6. Never disable linting, strict TypeScript, accessibility rules, or tests to get a pass.
7. Never use `any`, `@ts-ignore`, skipped tests, or blanket ESLint disables without a documented technical reason.
8. Keep changes scoped; avoid unrelated refactors.
9. Prefer current official framework APIs and primary documentation.
10. Protect secrets. Never commit populated `.env` files.
11. Review documentation and `git diff` before handover.
