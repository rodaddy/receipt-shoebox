# Expenses Ledger

Your permanent record of logged receipts -- **one table per month, newest at the
top.** Treat it like a paper book: the AI writes new rows in, it never erases
or reorders past ones. Corrections are added as notes, not rewrites.

**This file starts empty on purpose.** The first row in it will be your own
receipt, from your own desk, with your own vendor on it -- not a sample. If you
are reading this before your first run, that is what you should see.

Columns:
- **Date** -- the date on the receipt (`YYYY-MM-DD`).
- **Vendor** -- who you paid.
- **Amount** -- total charged, including tax and tip. A refund is negative.
- **Payment** -- how you paid (card last-four, cash, check).
- **Category** -- the plain-language bucket from `categories.md`.
- **Job** -- which job, customer, or project this was for, from `jobs.md`. Spend
  that is not for one customer is `overhead`.
- **Confidence** -- `read clean` (all clear), `asked` (AI asked because something
  was unclear), or `best guess on category only`. Money is never guessed.
- **Note** -- what it was for, or any caveat.

The row format, so you can read the file yourself:

```
| Date | Vendor | Amount | Payment | Category | Job | Confidence | Note |
| --- | --- | --- | --- | --- | --- | --- | --- |
```

---

<!-- The AI adds a new "## YYYY-MM - MonthName" section here on the first
     receipt of each month, above older months. Do not add example rows to this
     file: the buyer's first artifact must be built from their own paper. -->
