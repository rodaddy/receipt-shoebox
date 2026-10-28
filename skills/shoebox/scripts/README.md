# scripts

Holds the one deterministic helper this kit ships: `shoebox-ledger.mjs`. It owns
the repeatable mechanics - ledger append, duplicate refusal, running-total
update, and ledger verification - so the AI supplies only confirmed fields and
judgment.

Run it as `node scripts/shoebox-ledger.mjs ...`. Ordinary `.mjs` on plain Node
22.6.0 or newer; no package manager, build step, or `npm install`.
