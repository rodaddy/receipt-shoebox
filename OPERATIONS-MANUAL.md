# Receipt Shoebox — Operations Manual

The monthly ritual for the pile of receipts in your glovebox, your wallet, and
that drawer. Once a month: photograph the pile, drop them in, ask for the files.
The AI reads every receipt, asks which job it was for, and writes it all down
for you.

## The once-a-month routine

1. **Photograph the pile.** Snap a picture of each receipt with your phone —
   crumpled is fine, the AI reads them anyway. One photo per receipt.
2. **Drop them in.** Attach the photos to the chat (or, on a computer install,
   drop them into your `inbox/` folder) and say **"log these receipts."**
3. **Say which job.** The AI asks once — "is this pile the Islip patio, or a
   mix?" — and files the whole batch against that job. Anything that isn't for a
   customer it marks `overhead`. That one answer is what makes the job-costs
   file worth having.
4. **Answer any questions.** If a total or date is too blurry to read, the AI
   ASKS you — it never makes up a number. Money gets confirmed, not guessed.
5. **Ask for the files.** Say **"month-end export"** and you get two
   spreadsheet files (CSVs): one for your accountant, and one showing what each
   job cost you.

That's it: photograph the pile, drop them in, say which job, ask for the files.

## The part that pays for itself: what each job cost

Every receipt gets a job attached to it, so at the end of the month you can see
that the Islip patio ate $940 of materials against a $4,200 bid. Your accountant
never tells you that, and you can't get it out of a bank statement. Ask for
**"month-end export"** and it's the second file.

If you want to see spend against what you quoted, put your bid in `jobs.md`
next to the job — one number, once. Leave it blank and the file just shows what
you spent.

**Jobs that run past the end of a month.** Most jobs do. When one does, the file
adds a "job to date" number so you see what the whole job has cost you, not just
this month's slice — that is the number to hold up against your bid.

**How much it asks you about jobs is set once at setup**, from how much of your
money gets spent on a specific customer. A contractor buying materials all day
gets asked once per pile. An office that only occasionally mails something for a
client barely gets asked at all. If it asks too much or too little, that is one
word in your settings file and the AI will change it for you.

**Two locations, or a truck and a shop?** Add a standing job for each in
`jobs.md` (there is an example in that file) and you will see which side of the
business is eating the money instead of both landing in one pile.

**Labor isn't in here.** This tracks receipts, so it shows what a job COST in
materials and outside help, not what it made. It's the spend side, honestly
labeled — the AI won't tell you a job's profit, because from receipts alone it
would be wrong.

## What each thing you can say does

| Say | What happens |
| --- | --- |
| "log these receipts" (with photos) | The AI reads each photo, pulls the vendor, date, amount, how you paid, and a guessed category, asks once which job the pile is for, and writes each one into your monthly list. |
| "flag the weird ones" | The AI double-checks the month for duplicates, big-ticket items your accountant may want to depreciate, anything it couldn't read clearly, and money sitting in Uncategorized — and asks you about each before touching anything. |
| "month-end export" | The AI turns the month's list into two clean CSV files — one for your accountant, one showing spend per job — with your business name on them. |
| "month in review" | Three sentences on how this month compares: what moved most, what's trending, any new vendor, and an offer to add a bucket for whatever keeps landing in Uncategorized. |

## The one promise: it never guesses your money

If a receipt is smudged, torn, or cut off, the AI will **ask you** what the
total was — it will never invent a number to fill the blank. Every receipt is
logged with a little note saying whether it was read cleanly, or whether the AI
had to ask. A guessed *category* is fine (and it tells you when it guessed one,
so you can fix it) — but a guessed *dollar amount* never happens.

## When it stops and tells you no

This tool is allowed to refuse you, and that is the point. Four times it will
stop instead of producing something:

- **The total, date, vendor, or payment method can't be read.** It asks. If
  you're not around, it writes `NEEDS CONFIRMATION` in that spot and leaves the
  photo in your inbox until you fill it in.
- **The photo itself is unusable** — too dark, the bottom cut off, blurred. It
  refuses the photo and tells you what's wrong with it, and writes no row at
  all. Retake it and send it back. A made-up row looks logged, which is worse
  than nothing.
- **It can't tell which job a receipt belongs to** and you haven't answered. It
  writes `NEEDS JOB` rather than picking between two of your jobs.
- **You ask for the export while something is still unconfirmed.** It says so
  before it exports and lets you choose: hold the file, or send it with the gap
  clearly marked. It will not quietly ship a hole.

## Your categories, your call

The setup asked what your business does and gave you the matching list of
buckets — a trade business gets Job Materials, Subcontractors, Equipment
Repair, Permits; an office gets a different set. The live list is
`categories.md`, and **it's yours to edit freely:** rename buckets, add your
own, delete ones you don't use. The AI only ever sorts receipts into buckets it
finds in that file.

The other starter lists are in the `variants/` folder if your business changed
or the setup guessed wrong — copy the one you want over `categories.md`.

The AI also uses a bit of judgment rather than just matching store names: a
lumberyard run on a day you had a job open goes to job materials, not office
supplies; a repair shop is equipment repair, not fuel; and a big-ticket purchase
of something you will still own next year gets a note on the row saying your
accountant may want to depreciate it instead of writing it off this year. A big
bill for something you do NOT still own — an insurance premium, a year of
software, rent — gets no such note, because there is nothing to depreciate. It
always tells you what it decided so you can overrule it.

**One receipt with two kinds of thing on it** — food and cleaning supplies,
job materials and a wrench for the truck — goes in whichever bucket most of the
money is, with a note saying what else was on it. If it is a genuine half-and-
half, the AI asks whether you want it as one line or two.

**What else is in the photo.** If a customer's paperwork is sitting next to the
receipt when you take the picture, the AI reads the receipt and nothing else —
none of it goes in your records. It will mention it once so you know to clear
the desk.

## Where your records live

- **Computer install** (Claude Code / Codex): real files on your machine.
  - Your running list of expenses, your job list, and your category list live
    with the AI's skill (the AI always knows where — you don't have to track it).
  - Your **books folder** (the one the setup asked you to pick — by default a
    folder called `shoebox` in your Documents) is the one you open in Finder or
    File Explorer. Inside it:
    - `inbox/` — where you drop new receipt photos;
    - `inbox/processed/` — photos filed away by month after they're logged;
    - `exports/` — the CSV files land here, named by month: your accountant
      file (`expenses-2026-07.csv`) and your job costs
      (`job-costs-2026-07.csv`).
  - It all builds up month after month into a proper set of books.
- **Chat-app install**: you paste the photos into the chat, and the list and the
  CSVs come back to you right there — as downloads or as text you copy.

## When a receipt is too blurry to read

If a total is smudged and you're not around to answer, the AI logs the receipt
with the words `NEEDS CONFIRMATION` where the number should be, and **leaves that
photo in your `inbox/`** so it's easy to find. Next time you run "flag the weird
ones," it asks you for the missing number; once you give it, the row is
completed and the photo gets filed away with the others. Nothing is lost, and no
number is ever made up.

## Your business name on the file

The setup asked for your business name so it lands on the accountant file's
header and your monthly summaries. Change it any time by editing
`branding/brand.md`.

## When your files get big (after a year or so)

Everything keeps building up, which is what you want — but two things can be
tidied once they get large. Both are optional and entirely your call:

- **The expenses list, at year end.** Your running list holds every month. When
  a year finishes, you can tell the AI to start a fresh list for the new year and
  set the finished one aside — it renames the old one `expenses-2026.md` (or
  whichever year) and starts a clean `expenses.md` for the new one. Nothing is
  deleted; last year's book is just closed and kept.
- **The filed-away photos.** Once your accountant has the CSV for a month, you
  don't strictly need to keep that month's photos in `inbox/processed/` — you can
  zip them up as a backup, move them off to a drive, or delete them if you're
  comfortable. Your choice; the AI won't touch them unless you ask.

You never have to do any of this — the tool works fine if you leave it all in
place. It's here for the day the files feel heavy.

## The honest part

**This organizes your receipts — it doesn't do your taxes.** Your accountant
makes the final call on what's actually deductible and how each thing gets
categorized for the IRS. Think of this as the AI taking the repetitive receipt entry off your plate —
so you can stay focused on running the business and hand your accountant a clean
file instead of a shoebox. You still approve every unclear money value and keep
the final judgment.

## Reinstalling / moving platforms

Hand `installer.md` to the AI on the new platform and say "install receipt
shoebox." The installer adapts the package to whatever that platform needs —
you never repackage anything yourself.

## Uninstall

Computer install: delete the `shoebox` folder from `~/.claude/skills/` and/or
`~/.codex/skills/`. Chat app: remove the skill in Settings → Skills (or delete
the Project). Your ledger and CSV files are yours and stay put.

## Credits

Built in Rico's lab at rTech Digital Consulting.
