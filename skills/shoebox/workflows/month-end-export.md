# Month-End Export — hand it to the accountant, and see your job costs

Runs when the user says "month-end export", "give me the accountant file",
"job costs", or "export July". Produces **two** CSV files for one month:
`expenses-YYYY-MM.csv` for the accountant, and `job-costs-YYYY-MM.csv` for the
owner.

## Before you export

1. Read `../SKILL.md` for both CSV column specs and the honest disclaimer.
2. Read the month's table from `../ledger/expenses.md` (skill-relative — the ledger
   lives inside the skill folder).
3. Read `../ledger/jobs.md` for job names, statuses, and any recorded bid or
   contract amounts.
4. Read `../USER-CONFIG.md` for the `books folder:` path — the CSVs are written
   under that folder's `exports/` subfolder (see "Where the files go" below) —
   and for `job tracking:`. If job tracking is `off`, produce the accountant
   file only and say so in one line. If it is `light`, produce the job-costs
   file only when at least one row this month carries a real job — if every row
   says `overhead`, skip that file silently rather than shipping a one-line CSV
   that says nothing.
5. Read `../branding/brand.md` for the business name (for the banner, not the CSV).
6. **Run the flag pass first if you haven't this cycle.** Nothing unconfirmed
   should ship. If any row still says `NEEDS CONFIRMATION` or `NEEDS JOB`, tell
   the user and ask whether to (a) hold the export until they confirm, or (b)
   export with that row clearly marked in Notes. Never silently ship a guessed
   number or a guessed job — there shouldn't be one, but if a gap remains it
   must be visible.

## Build file 1 — the accountant CSV

File name: `expenses-YYYY-MM.csv` (e.g. `expenses-2026-07.csv`).

First line is exactly this header, then one line per receipt:

```
Date,Vendor,Amount,Payment Method,Category,Job,Notes
```

Rules:
- `Amount` is a bare number — no `$` — so spreadsheets total it. A refund is
  negative (`-52.10`).
- `Job` carries the job name, `overhead`, or `NEEDS JOB`. Quote it if it
  contains a comma, per the escaping rule below.
- Carry confidence caveats into `Notes` (`category is a guess`,
  `NEEDS CONFIRMATION`, `refund`, and the over-$2,500 capital-vs-expense note)
  so the accountant sees them.
- Dates are `YYYY-MM-DD`.

## Build file 2 — the job-costs CSV (the one the owner actually reads)

File name: `job-costs-YYYY-MM.csv` (e.g. `job-costs-2026-07.csv`). One row per
job that had spend this month, `overhead` sorted last.

```
Job,Bid / Contract Amount,Total Spend,Materials & Goods,Outside Labor,Other Job Costs,Receipts,Notes
```

**That header line is fixed. Write it exactly as shown in every install, for
every variant, every month.** Do not rename a column after the loaded category
variant — the mapping from the user's buckets INTO these three columns is in
`../SKILL.md` under "The three cost columns", and it is a table, not a judgment.
Read it, apply it, and say in one line which of their buckets you fed into
`Materials & Goods` (e.g. "Materials & Goods is your Job Materials (COGS)
bucket").

Rules:
- Group the month's rows by the `Job` cell. Sum `Amount` per job — refunds are
  negative and therefore subtract, which is correct.
- `Bid / Contract Amount` comes from `../ledger/jobs.md`; leave it blank if the
  user never recorded one. Never estimate a bid.
- The `overhead` row writes `0` in all three cost columns, blank in
  `Bid / Contract Amount`, and `not a job — business costs` in `Notes`. Never
  leave a cost column blank on any row: a blank reads as missing data, a `0`
  reads as none.
- Every row's three cost columns must add up to its `Total Spend`. If they do
  not, a category is missing from the mapping — say so and put the difference in
  `Other Job Costs` rather than shipping a file that does not foot.
- `Receipts` is the count of rows that rolled into the job.
- `Notes` carries anything that makes the number soft: rows still unconfirmed,
  the job still open, spend running over the recorded bid.
- All numbers are bare, same as file 1. Same escaping rule applies to job names.
- Do not compute a profit or a margin, and do not tell the owner whether a job
  made money. Show spend against bid and let him read it — labor is not in this
  ledger, so any margin the kit calculated would be wrong.
- If a job's spend exceeds its recorded bid, say it plainly once in the chat:
  "Heads up — the Islip patio is at $4,410 of spend against a $4,200 bid."

### Jobs that cross a month boundary — give the job total, not just the month

This file is a MONTH's spend per job, and most jobs do not fit inside one month.
A remodel, a roof, a catering gig booked in one month and worked in the next
will land rows in two or three monthly tables, and the owner's real question is
never "what did the Ferraro boiler cost me in August" — it is **"what did the
Ferraro boiler cost me."**

So: **for any job whose rows appear in more than one month, add a `Job to date`
column** as the LAST column of `job-costs-YYYY-MM.csv`, and fill it with that
job's total spend across every month in `../ledger/expenses.md`, not just this
one. A job that exists only in this month gets the same number as `Total Spend`;
that is fine and costs nothing.

- Add the column only when at least one job actually spans months. A
  single-month file does not need it and adding it is noise.
- Compare `Job to date` against the bid, not `Total Spend` — that is the
  comparison that means something. Say it in the chat once: "The Ferraro
  boiler is at $2,043 to date against an $8,400 bid; $1,925 of that was
  August."
- **Still no profit and no margin**, to date or otherwise. Labor is not in this
  ledger. Spend against bid, and the owner reads it.
- If a job is `closed` in `../ledger/jobs.md` and a late row lands on it, the
  `Job to date` number is the one that changed — name it: "That $118 chafing
  dish return lands on the Ferrara wedding, which was closed. It's now $1,402
  to date."

## CSV escaping (the full rule — stated once here, referenced from SKILL.md)

CSV is comma-separated, so any comma or double-quote INSIDE a field would
otherwise break the columns. Apply this to every field, in order:

1. **Wrap a field in double quotes if it contains any of:** a comma (`,`), a
   double-quote (`"`), or a line break. Example: the vendor
   `Lowe's Home Center, #1234` becomes `"Lowe's Home Center, #1234"`.
2. **Double every double-quote that is inside a quoted field.** A `"` inside the
   text is written as `""`. Example: the note `12" monitor, on sale` becomes
   `"12"" monitor, on sale"` — wrapped because it has a comma, and the inner `"`
   doubled.
3. **Force text-like values to be quoted even without a comma,** so a spreadsheet
   doesn't reformat or mangle them. In particular, wrap the `Payment Method`
   card values like `Visa 1234` in quotes (`"Visa 1234"`) so Excel or Google
   Sheets treats them as text and doesn't turn `1234` into a number or a date.

A field with none of the above (a plain vendor, a bare amount, a `YYYY-MM-DD`
date) is written as-is, unquoted.

## Where the files go

File names: `expenses-YYYY-MM.csv` and `job-costs-YYYY-MM.csv`.

- **Coding-agent install:** write both into the `exports/` subfolder of the books
  folder recorded in `../USER-CONFIG.md` — e.g.
  `~/Documents/shoebox/exports/expenses-2026-07.csv` and
  `~/Documents/shoebox/exports/job-costs-2026-07.csv`. The installer creates
  `exports/`; if it is somehow missing, create it before writing.
- **Chat install** (`books folder: chat only`): deliver both CSVs as
  downloadable files if you can; otherwise paste each in its own code block for
  the user to copy into a `.csv`.

## Deliver with the banner and the disclaimer

In the chat message (not inside the CSVs), lead with a one-line banner from
`../branding/brand.md`, then the job lines, which are the part he reads:

> **{{business name}} — Expenses, July 2026 — 14 receipts, total $1,204.37**
>
> Two files: `expenses-2026-07.csv` for your accountant, and
> `job-costs-2026-07.csv` for you.
>
> Where it went this month:
> - Islip patio — $940.18 across 6 receipts, $680.88 of it materials
>   (bid on file: $4,200)
> - 14 Maple St roof — $196.40 across 2 receipts
> - overhead — $67.79

Then the files (or pasted CSVs), then the honest disclaimer, verbatim in spirit:

> This organizes your receipts — it doesn't do your taxes. Your accountant
> makes the final call on what's deductible and how it's categorized.

Close by noting anything still open (a held `NEEDS CONFIRMATION` or `NEEDS JOB`
row, a guessed category the user hasn't confirmed, an over-$2,500 row carrying
the capital-vs-expense question) so they can hand the file over cleanly, and
offer the next step: "Say **month in review** and I'll tell you how this month
compares to the ones before it."
