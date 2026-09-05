# Taste
See [taste/taste.md](taste/taste.md)

## Cross-cutting workflow
- Writes in Bahasa Indonesia (code-switching with English technical terms — "session", "export", "fitur") and expects the agent to respond in the same language; when the user asks about tooling/product questions in Indonesian, replies in Indonesian rather than English. Confidence: 0.6
- Wants specs to be structured as a numbered issue list with a diagnosis section and self-contained patch files (`FIX-*.md`) — *"Diagnosisnya dulu, karena ini menjelaskan…"* — and to be run in a prescribed order through a thin agent instruction ("apply exactly, `npm run build`, fix only type errors"), with a short "verify after build" checklist; patches are also expected to note which already-shipped steps from earlier specs are now redundant (e.g., a config already applied). Confidence: 0.6

- Reports the code problems they diagnose and fixes themselves — including self-written regressions ("bug yang saya tulis sendiri", like the custom-cursor mount-order freeze and the Strict Mode double-mount intro skip) — with the root cause already analyzed, and expects the agent to apply the supplied fix and verify it empirically rather than re-diagnose. Confidence: 0.8

- Treats AI chat-session context as ephemeral and wants durable project state committed to the repo as a portable handoff document: when a chat session runs out or they switch tools (e.g., Arena AI for brainstorming vs. a code agent for building), the expected artifact is a single self-contained `docs/PATCHES.md`-style record — stack, current architecture, chronological patch history including discarded directions, verification status, environment quirks, open loops, tuning knobs, conventions, commands, and a paste-ready one-paragraph summary block for bootstrapping a fresh session — so any new session can continue without losing context. Confidence: 0.7
