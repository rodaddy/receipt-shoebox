# Jobs

The list of jobs, customers, or projects your spending gets attached to. The AI
reads this file before asking "which job was this for?" so it can offer you the
open ones by name instead of making you spell them out every time.

**This file is yours to edit.** Add a job, close one, rename one -- the AI picks
up your edits on the next run.

## How a job gets here

The AI adds a job when you name one it has not seen before, and asks you to
confirm the spelling once. It never invents a job name and never quietly moves
spend from one job to another.

## Columns

- **Job** -- what you call it out loud. `Islip patio`, `14 Maple St roof`,
  `Reyes kitchen`. Whatever you would say on the phone.
- **Customer** -- who is paying, if that is a different name.
- **Status** -- `open` (spend can still land on it) or `closed` (finished; the
  AI asks before adding anything new to it).
- **Bid / contract amount** -- what you quoted, if you want the job-costs report
  to show materials against the bid. Optional; leave blank and the report just
  shows spend.
- **Started** and **Closed** -- dates, `YYYY-MM-DD`. Optional.
- **Note** -- anything you want to remember.

## Open jobs

| Job | Customer | Status | Bid / contract amount | Started | Closed | Note |
| --- | --- | --- | --- | --- | --- | --- |

<!-- The AI appends rows here as you name jobs. Nothing is pre-filled: this
     file starts empty on purpose, because these are your jobs, not examples. -->

## A standing job, for a second location or a second operation

If the business runs more than one thing -- a shop and a food truck, two
locations, a service side and a retail side -- you do not have to lump all of it
into `overhead` and lose the split. Add a **standing job** here: one row per
operation, `status: open`, no bid, no close date. Then spend for the truck goes
on the truck and spend for the shop goes on the shop, and the month-end job
costs show you which one is eating the money.

It would look like this -- **an illustration of the shape, not a job you have.**
Your real jobs go in the "Open jobs" table above; nothing in this section is
read as your data:

    | Food truck | (standing) | open |  |  |  | standing job, not a customer job |

Real customer jobs still work exactly as before alongside it. `overhead` then
means only what is genuinely shared across everything -- insurance, the
accountant, the phone bill.

## Overhead is not a job

Spend that is not for any one customer -- shop rent, insurance, your phone bill,
a subscription -- gets the job `overhead`. You do not need a row for it here;
`overhead` is always available. The job-costs report lists it separately at the
bottom so it never inflates a customer's numbers.
