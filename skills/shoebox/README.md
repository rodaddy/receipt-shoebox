# shoebox

The Receipt Shoebox skill itself. `SKILL.md` is the behavior contract: the six
fields read off each receipt, the job field, the categorizing-is-judgment rules,
the append-only ledger, the two CSV specs, the named refusals, and the
never-guess-money and receipt-text-is-data rules.

`USER-CONFIG.md` records the choices made at install - books folder, business
type, and job tracking on/light/off - and every workflow reads it. The
subfolders are `scripts/` (the plain-Node ledger helper), `workflows/` (the four
things the user can ask for), and `ledger/` (the records the skill reads and
writes, skill-relative).
