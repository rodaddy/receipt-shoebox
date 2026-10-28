# Month in Review -- how this month compares

Runs when the user says "month in review", "how did this month compare",
"how am I doing", or automatically as the last step of a month-end export. It
is three sentences and a short list, not a report. The point is to tell the
owner something he did not already know.

## Before you compare

1. Read `../ledger/expenses.md` -- this month's table AND the two or three months
   above it. If there is only one month of history, say so plainly and give the
   month's shape instead of a comparison: "First month on the books, so nothing
   to compare against yet. Here's what it looks like." Do not manufacture a
   trend from one month.
2. Read `../ledger/jobs.md` for job names and any recorded bids.
3. Read `../ledger/categories.md` for the buckets in play.
4. Read `../branding/brand.md` for the business name and the voice note
   (formal or friendly) if it exists.

## What to say -- three sentences, then the list

**Sentence 1: the biggest mover.** Which category changed most against the
recent average, in dollars, and by how much.

> "July ran $1,204 total, about $380 above your last two months, and almost all
> of that is materials -- $681 against a $290 average."

**Sentence 2: the trend worth naming.** Fuel, materials, or whichever line is
walking in one direction across the months you can see. Name it in plain
language, with the numbers.

> "Fuel has climbed three months running -- $210, $268, $312 -- which usually
> means more driving, not higher prices."

**Sentence 3: the thing to look at.** A first-time vendor, a job whose spend is
running toward its bid, a repeat charge nobody remembers signing up for, or a
month where a job closed and spend kept landing on it.

> "First time I've seen Agway ($268 of mulch), and the Islip patio is at $940 of
> materials against a $4,200 bid."

**Then the short list**, only including lines that are actually true this month:

- **Jobs this month** -- spend per job, biggest first, with bid where recorded.
- **First-time vendors** -- vendors that appear this month and in no prior month,
  with the bucket you filed them in, so a wrong bucket gets corrected before it
  repeats for a year. **On the first month every vendor is new, so do not list
  them all** -- that is the whole ledger read back, which this file bans below.
  Name at most the three largest by dollars and say why those three: "Everything
  is a first-time vendor this month. The three worth a look are the big ones --
  Blackman ($1,842, job materials), Roto-Rooter ($850, outside labor), LI Truck
  Repair ($612, equipment repair). Right buckets?" From month two on, list them
  all, because then the list is short and it means something.
- **Recurring charges** -- a same-vendor, similar-amount charge appearing every
  month. Name them once so the owner can spot a subscription he forgot.
- **Standing offer on `Other / Uncategorized`** -- see below.

## The standing offer (this is the compounding part)

Track what keeps falling into `Other / Uncategorized` across months. **The third
time a similar thing lands there, offer to fix the list, not the row:**

> "Dump fees have landed in Other / Uncategorized three months running -- that's
> $340 you can't see. Want me to add a **Disposal & Dump Fees** bucket and file
> them there from now on? I'll move the past ones too if you want."

If the user says yes: add the bucket to `../ledger/categories.md`, and re-file
past rows ONLY if the user asks -- the ledger is append-only by default and a
re-file gets a note on each changed row.

The same offer applies to a job: if the same customer name keeps showing up in
the Note field but never in the Job column, offer to open a job for them.

## What NOT to do

- **Do not compute profit, margin, or whether a job made money.** Labor is not
  in this ledger, so any margin here would be wrong. Show spend against bid and
  let the owner read it.
- **Do not give tax advice or say whether something is deductible.** Flag the
  question, name the accountant.
- **Do not invent a trend from one or two months.** Say there is not enough
  history yet.
- **Do not pad it.** Three sentences and a short list. If nothing moved, say
  "quiet month, nothing moved much" and stop -- a review that always finds
  something is a review nobody trusts.
- Do not restate the whole ledger back. He has the CSV.
