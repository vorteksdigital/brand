# ADR 003: Visual editor compatibility

Status: accepted, 2026-07-26.

Do not install upstream 2.0.6: it supports Payload 2/React 18 and relies on
removed Admin internals. Use Payload 3 Live Preview for transport/UI and a small
MIT-attributed local compatibility boundary for upstream-required semantics.
No framework downgrade or forced peer resolution.
