# Receipt Shoebox — User Config

The installer fills this in during setup. Every workflow reads it to find the
user's photo folders and export location. Do not delete it.

There is exactly one config file (this one) and it lives inside the installed
`shoebox/` skill folder. The skill's own working files — the ledger
(`ledger/expenses.md`), the job list (`ledger/jobs.md`), and the category list
(`ledger/categories.md`) — live INSIDE this same skill folder and are always
read skill-relative. This file records the user-facing folders (where photos go
in and exports come out) and the two choices the installer made by asking.

## Keys (fully spelled out)

- **books folder:** `~/Documents/shoebox/`
- **business type:** `trades and field service`
- **job tracking:** `on`   <!-- on | light | off -->

**business type** records which starter category list was copied from
`ledger/variants/` into `ledger/categories.md` at install. Valid values:
`trades and field service`, `professional services`, `retail and food`,
`generic small business`. It is a record of what was chosen, not a switch — the
live list is always `ledger/categories.md`, and the user edits that file
directly.

**job tracking** is `on`, `light`, or `off`, and it is set from how much of this
business's money is spent on one customer's behalf — not from what industry it
is in.

- `on` — most spend is per job or per customer (trades, contractors, anyone
  buying materials for someone else's work). The job question is asked once per
  pile, every row carries a job or `overhead`, and the month-end export produces
  the second file, `job-costs-YYYY-MM.csv`.
- `light` — a little spend is per customer: the odd filing fee, courier,
  certified mailing, or disbursement rebilled to a client. Common for agencies,
  insurance offices, and small professional firms. **No job question is asked on
  a normal pile** — everything is `overhead` by default, and the AI asks about a
  single receipt only when it is plainly for a named customer. The job-costs
  file is produced only when at least one row that month carries a job.
- `off` — nothing is bought per customer (one location, nothing to attribute).
  The Job column still exists and reads `overhead` on every row, no job question
  is ever asked, and the job-costs file is skipped. The AI says so once rather
  than nagging.

The installer sets this from one question; the user can change this one word any
time.

The books folder is the user-facing folder the customer opens in Finder or File
Explorer. It holds:

- `inbox/` — the user drops receipt photos here.
- `inbox/processed/YYYY-MM/` — photos move here after their row is written.
- `exports/` — the month-end CSV files for the accountant land here.

The installer creates the books folder and these subfolders, and writes the
chosen path above (default or custom). If this file says `~/Documents/shoebox/`,
that is the default and it is correct — the value is always recorded, never left
blank.

## For a chat-app install (no filesystem)

On a chat-only platform there are no folders on disk. In that case this file
reads:

- **books folder:** `chat only — no folders; photos are pasted in, the CSVs come
  back as downloads or text`

and the workflows keep the ledger and both CSVs in the conversation instead of
on disk. `business type` and `job tracking` still apply and are still recorded.
