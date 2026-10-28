# Flag Review — flag the weird ones (ask, never assume)

Runs when the user says "flag the weird ones", "flag review", "double-check
this month", or automatically as the last gate before a month-end export. It
sweeps one month and surfaces oddities as QUESTIONS. It never silently drops,
merges, or "corrects" a row.

## Before you sweep

1. Read `../SKILL.md` for the never-guess rule and the categorizing judgment
   rules.
2. Read the month's table from `../ledger/expenses.md` (skill-relative — the ledger
   lives inside the skill folder).
3. Read `../ledger/jobs.md` for open and closed jobs.
4. Read `../ledger/categories.md` for the buckets in play.

## Sweep for exactly five kinds of weird

### 1. Possible duplicates
Same vendor + same date + same amount appearing on two rows — usually the same
receipt photographed twice.

> "Rows 4 and 9 are both Shell, 2026-07-08, $52.10 — same fill-up twice, or two
> separate trips?"

### 2. Over $2,500 — the capital question, not a typo question
A large single purchase is usually real. The question worth money is whether it
gets written off this year or depreciated over several. Ask THAT, and write the
note onto the row.

> "The $3,880 Kubota track replacement on check 1042 — that's big enough that
> your accountant may want to depreciate it instead of expensing it this year.
> I've flagged the question on the row. Do you want it filed as Equipment
> Repair & Maintenance (a repair) or Equipment Purchase (a capital item)?"

Never state which treatment applies. Put the question in front of the owner.

### 3. Unusually large for its own pattern
An amount far above what this business normally spends at that vendor or in that
category, where the shape suggests a mis-read rather than a big purchase.

> "The $240 Dunkin charge is way off your usual $30 — real, or a decimal in the
> wrong place?"

**On the first month there is no pattern, so this check does not run.** Say so
in one line rather than inventing a baseline from twelve receipts — "First month,
so I've got nothing to compare amounts against yet; from next month I'll flag
anything that looks off for you." A "usual" built from one month is noise, and
flagging a normal charge as odd teaches the owner to ignore the flags.

### 4. Unreadable / incomplete
Any row carrying `NEEDS CONFIRMATION` or `NEEDS JOB`, a category logged as a
best guess the user may want to fix, or a photo you refused as unusable.

> "Row 7 (Costco, $310.55) still needs its total confirmed — what was it?"
> "Rows 11 and 12 (Home Depot, both 2026-07-19) say NEEDS JOB — Islip patio, or
> the Maple St roof?"
> "I filed the $88 Adobe charge under Software — right bucket, or move it?"

### 5. Money parked in `Other / Uncategorized`
Uncategorized spend above a rounding error is the kit failing, not the month
being odd. Name the rows, ask where they belong, and offer to add a bucket.

> "$412.88 of the month is sitting in Other / Uncategorized — the pavers and the
> mulch. Those look like materials for the Islip patio. Want me to file them as
> Job Materials and use that bucket for supply-house runs going forward?"

Also check whether any row landed on a job marked `closed` in `../ledger/jobs.md`
and ask before leaving it there.

## Ask, wait, then apply only approved fixes

1. Present all findings as one short numbered list of questions.
2. **Wait for the user's answers.** Do not assume.
3. Apply ONLY the corrections the user approves:
   - a confirmed duplicate → strike the extra row by adding a correction note
     (`removed — duplicate of row 4`), append-only style; don't silently delete
     history unless the user says to.
   - a confirmed typo → correct the single cell and note the change.
   - a confirmed amount → replace `NEEDS CONFIRMATION` with the real number,
     set confidence to `asked`. The row is now fully written, so on a
     coding-agent install move that receipt's photo from `inbox/` to
     `inbox/processed/YYYY-MM/` (under the books folder from `../USER-CONFIG.md`).
   - a category move → update the category cell. If the user asks for a bucket
     that does not exist yet, add it to `../ledger/categories.md` and say so.
   - a confirmed job → replace `NEEDS JOB` with the job name. If it is a job
     not yet in `../ledger/jobs.md`, append it there with `status: open` after
     confirming the spelling.
   - a capital-vs-expense answer → move the category if the user chose one, and
     leave the note on the row either way so the accountant sees the question.
4. Recompute the `Running total:` if any amount changed, then re-run
   `node scripts/shoebox-ledger.mjs verify --ledger ledger/expenses.md` from the
   installed `shoebox/` folder. Exit `0` is the receipt that the month still
   foots. Rows still carrying `NEEDS CONFIRMATION` or `NEEDS JOB` are listed by
   `verify` as awaiting the owner — that is not an error, it is the open list
   this pass exists to shrink.
5. Report what changed and confirm the month is clean and ready to export —
   including that every row now carries a job or `overhead`.

Nothing gets changed that the user didn't confirm. This pass exists so the
accountant never receives a guessed number.
