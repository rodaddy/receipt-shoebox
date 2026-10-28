# ledger

The records the skill reads and writes, resolved skill-relative so it always
finds them.

- `categories.md` - the LIVE bucket list, copied from a variant at install and
  editable by the user afterward.
- `expenses.md` - append-only monthly tables, newest on top. Ships EMPTY.
- `jobs.md` - the user's jobs and customers, bids, open or closed. Ships EMPTY.
- `variants/` - the four starter category lists the installer chooses from.

Nothing here ships pre-filled with fake data; the first rows are the buyer's own
receipts.
