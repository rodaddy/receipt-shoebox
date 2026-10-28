# Receipt Shoebox — Installer

> You are reading the Receipt Shoebox installer.

**Version:** 1.1.4
**Created by:** Rico Rojas / rTech Digital Consulting
**Package contents:** `START-HERE.md` (read that first if you're the user),
this file, `kit.json`, `skills/shoebox/` — which holds `SKILL.md`, a `workflows/` folder
(four workflows), a plain-Node `scripts/` folder, a `USER-CONFIG.md`, and the starter `ledger/`
(`categories.md`, `expenses.md`, `jobs.md`, and the `variants/` folder of
alternate category lists) — and `OPERATIONS-MANUAL.md`

---

## What This File Does

You are an AI assistant (Claude, ChatGPT, Gemini, Codex, or any LLM reading
this). This file tells you how to:

1. Detect what runtime you are and what your host platform requires
2. **Transform this package into whatever your host needs** — never declare it
   incompatible
3. Confirm you can actually READ PHOTOS (this kit consumes receipt images), and
   record which of the user's AIs can
4. Install the Shoebox skill and its starter ledger
5. Ask ONE question about what the business does, to pick the right category list
6. Run a short branding interview
7. Verify the install by logging **a real receipt off the user's own desk** —
   never a shipped example

**Do not summarize this file. Do not explain what you are about to do. Begin
with Section 1 now.**

---

## Section 1: Installation Trigger

When the user shares this file or says "install receipt shoebox," begin
immediately. Greet them with one line: "Let's set up Receipt Shoebox — I'll
handle the setup and ask you a couple of quick questions. Takes about five
minutes." Then proceed to Section 2.

---

## Section 2: Detect Your Runtime

Determine which of these you are. Do not ask the user technical questions you
can answer yourself by testing your own capabilities.

| You are… | Signs | Go to |
| --- | --- | --- |
| **A coding agent with filesystem access** (Claude Code, Codex CLI, or similar) | you can run shell commands and write files to the user's disk | 3A |
| **A chat app that supports uploaded skills** (Claude app: web, desktop, mobile) | no filesystem access, but your platform accepts **zip uploads** as skills | 3B |
| **A chat app with projects/custom instructions but no skills feature** (ChatGPT Projects, Gemini Gems, or similar) | no filesystem, no skill uploads, but persistent instructions exist | 3C |
| **A plain chat session** — none of the above | no filesystem, no skills, no persistent instructions | 3D |

If genuinely unsure between two rows, ask ONE question: "Are we in the Claude
app, ChatGPT, or a terminal?" and map the answer to the closest row.

**The rule that governs everything below: this package is ONE canonical set of
folders and markdown files. If your host needs a different shape — a zip,
pasted instructions, anything — YOU produce that shape from the canonical
files, right now, yourself. "This package doesn't work here" is never the
answer. Adapt the package to the host.**

---

## Section 3A: Coding agent with filesystem access

1. Locate your skills directory: `~/.claude/skills/` (Claude Code),
   `~/.codex/skills/` (Codex CLI), or your platform's equivalent. Create it if
   missing.
2. **Collision check first — and if it's THIS kit, offer an upgrade.** Before
   copying anything, check whether a `shoebox` skill folder already exists in
   the skills directory.
   - **Same kit already installed (an upgrade).** If the existing `shoebox/` is
     a previous Receipt Shoebox, read the installed copy's version — from the
     `**Version:**` line of any `installer.md`/manual copied in beside it, or
     the README changelog if present; **if you can't determine it, treat the
     installed copy as older.** Then ask ONE question: *"You have v<old>; this
     is v<new> — upgrade keeping all your data, or skip?"* (If you couldn't
     read a version, say *"You have an earlier Receipt Shoebox; this is v1.0 —
     upgrade keeping all your data, or skip?"*)
     - **On upgrade:** first back up the old skill folder — rename the existing
       `shoebox/` to `shoebox.backup-<old-version>` (e.g. `shoebox.backup-1.0`;
       if the version is unknown, use `shoebox.backup-YYYYMMDD`). Then rebuild
       `shoebox/` from the package and restore the protected data listed below.
       Replace ONLY the kit-owned instruction and mechanical files: `SKILL.md`,
       everything under `workflows/`, `scripts/`, and the reference lists in
       `ledger/variants/`. **NEVER overwrite the user's own data.** The
       protected files/folders that carry over untouched are:
       `shoebox/USER-CONFIG.md`, the entire `shoebox/branding/` folder, and the
       user's own ledger files — `shoebox/ledger/expenses.md` (the running
       expense ledger), `shoebox/ledger/jobs.md` (their job list), and
       `shoebox/ledger/categories.md` (which they may have edited). The user's
       external books folder (the
       `inbox/`, `inbox/processed/`, `exports/` tree recorded as
       `books folder:` in `USER-CONFIG.md`) is outside the skill folder and is
       untouched by definition. Do NOT re-run the branding interview or re-seed
       the ledger: an upgrade keeps every logged receipt and category edit.
       - **Upgrading from a version before 1.1.1 — the new Job column.** Older
         ledgers have seven columns and no `Job`. Do NOT rewrite their history.
         Add the `Job` column to the header of the CURRENT month's table only,
         between `Category` and `Confidence`, leave older months exactly as they
         are, and say so in one line: "Added a Job column from this month
         forward — your older months stay as they were." Then create
         `ledger/jobs.md` if it is missing (empty, from this package) and copy in
         `ledger/variants/`. Ask the business-type question (Section 4.5) only
         if `business type:` is not already recorded in `USER-CONFIG.md`; if the
         user has clearly edited `categories.md` themselves, **keep their list and
         offer to ADD what is missing — never replace it.** Their edits are the
         one hand-maintained file in the kit and every ledger row points at a
         bucket name in it, so overwriting it orphans history. Say:

         > "You've added your own buckets to the category list, so I'm keeping
         > it exactly as it is. The new version adds a few buckets you don't
         > have — [name them]. Want me to add those to the bottom of your list
         > and leave everything else alone?"

         On yes: **append only.** Add the missing buckets at the end of their
         file under a line reading `## Added by the upgrade`, change nothing
         above it, rename nothing, and delete nothing — not even a bucket the
         new variant dropped, because rows in the ledger may still name it.
         On no: change the file not at all.

         Never merge by rewriting the file top to bottom, and never "tidy" their
         wording while you are in there. If you cannot tell whether they edited
         it, assume they did.
     - **On skip:** leave the installed kit exactly as-is and stop.
   - **A different, unrelated skill happens to be named `shoebox`.** Do NOT
     silently overwrite: tell the user it collides and ask "replace, keep yours,
     or back yours up first?" For "back up," rename the existing folder to
     `shoebox.backup-YYYYMMDD` before copying.
3. Copy `skills/shoebox/` into it **recursively — the ENTIRE folder, every
   nested file**: `SKILL.md`, `USER-CONFIG.md`, all four files under
   `workflows/` (`process-receipts.md`, `month-end-export.md`,
   `flag-review.md`, `month-in-review.md`), the `scripts/` folder with
   `shoebox-ledger.mjs`, and the whole `ledger/` folder (`categories.md`,
   `expenses.md`, `jobs.md`, and the `variants/` subfolder with its four
   category lists). Never copy just `SKILL.md`. **The ledger stays
   INSIDE the skill folder** — that is where the skill reads and writes it,
   skill-relative, and that is correct by construction. Do not move the ledger
   out to the books folder.
4. **Set up the user-facing books folder (photos in, exports out).** Ask the
   user where it should live (default: `~/Documents/shoebox/`). Create that
   folder and, inside it, create three subfolders:
   - `inbox/` — the user drops receipt photos here;
   - `inbox/processed/` — photos move to `inbox/processed/YYYY-MM/` once their
     row is written;
   - `exports/` — the month-end CSV files land here (both of them: the
     accountant file and the job-costs file).

   Copy `OPERATIONS-MANUAL.md` into the books folder too, so the manual survives
   after the unzipped package is deleted.
5. **Record the books folder path — ALWAYS, default or custom.** Open the
   installed `skills/shoebox/USER-CONFIG.md` and set the `books folder:` key to
   the path the user chose (write `~/Documents/shoebox/` even when they took the
   default). Every workflow reads this file to find `inbox/`, `inbox/processed/`,
   and `exports/`. The ledger, jobs, and categories are NOT in this file — they
   live in the skill folder and are read skill-relative.
6. Do the **Business-Type Question (Section 4.5)**, the **Image Capability check
   (Section 3.5)**, and the **Branding Interview (Section 4)**.
7. Confirm Node is available for the T1/T2 mechanical spine by running
   `node --version`; Receipt Shoebox requires Node 22.6.0 or newer. If Node is not
   available, do not tell the user to install a package manager: label this a T3
   manual-checklist install and state that ledger appends, duplicate refusal, and
   running-total verification are advisory instead of script-enforced.
8. Assert the install: confirm the `shoebox` folder exists with `SKILL.md` (its
   frontmatter `name:` is `shoebox`), `USER-CONFIG.md` (with filled-in
   `books folder:`, `business type:`, and `job tracking:` values), all four
   workflow files, `scripts/shoebox-ledger.mjs`, and `ledger/categories.md`,
   `ledger/expenses.md`, `ledger/jobs.md`, and `ledger/variants/` INSIDE the skill
   folder; and confirm
   the books folder holds `inbox/`, `inbox/processed/`, and `exports/`. Confirm
   `ledger/expenses.md` contains **no receipt rows** — it ships empty on
   purpose, and the first row in it must be the user's own. Then go to Section 5
   (Verify).

## Section 3B: Chat app with skill uploads (zip required)

Your platform accepts skills only as zip archives. The zip is not in this
package — **you create it:**

1. Using your code-execution / file-creation capability, create ONE zip of the
   `skills/shoebox/` folder. Exact layout:
   - the FIRST path entry in the archive must be `shoebox/` — nothing above it.
     NOT `skills/shoebox/`, NOT a wrapping package folder, NOT a bare `SKILL.md`
     at the root.
   - include the folder's ENTIRE contents recursively: `SKILL.md`,
     `USER-CONFIG.md`, all four files under `workflows/`, `scripts/shoebox-ledger.mjs`,
     and the `ledger/` folder (`categories.md`, `expenses.md`, `jobs.md`, and
     `variants/` with its four files). A zip missing `workflows/`, `scripts/`,
     `ledger/`, or `ledger/variants/` installs as a silently broken skill.
   - exclude OS junk: no `__MACOSX/`, no `.DS_Store`.
   - sanity-check the archive's listing against these rules before handing it
     over.
2. Give the user the zip as a downloadable file. If you built it but your
   platform cannot deliver files to the user, fall through to Section 3C — do
   not stop.
3. Tell the user the upload steps. Current Claude app labels: "Settings →
   Capabilities → turn ON Code execution and file creation (one-time), then
   Settings → Customize → Skills → upload this zip → toggle it on." Add: menu
   labels change between versions — look for the Skills and Capabilities
   sections in Settings. Code execution must stay ON after install (reading
   receipt photos and writing the CSV both use it).
4. If you cannot create zip files here at all, fall through to Section 3C and
   install the condensed form instead — do not stop.
5. There are no folders on the user's disk here, so the shipped
   `USER-CONFIG.md` already reads `books folder: chat only` — leave it. Receipts
   are pasted into the chat and the two CSVs come back as downloads or text; the
   ledger lives in the conversation, not on disk.
6. Do the **Business-Type Question (4.5)**, the **Image Capability check (3.5)**
   and the **Branding Interview (4)** now — they need no upload round trip.
7. **PAUSE here.** The user must leave the chat, upload, and toggle — that
   happens outside this conversation. Say: "Tell me when it's uploaded and
   toggled on, and we'll test it with one of your own receipts." Only when the
   user confirms, go to Section 5 (Verify).

## Section 3C: Projects / custom instructions, no skills feature

Your platform holds persistent instructions but not skill files. Condense the
package yourself:

1. **Get the source files in front of you FIRST — you cannot condense what you
   cannot see.** The user handed you only `installer.md`, so the rest of the kit
   is not yet visible to you. Before reading or condensing anything, tell the
   user in plain language exactly which files from the unzipped kit folder to add
   to the Project/Gem as sources, then STOP and wait for them to confirm the
   files are added. Name them fully, spelled out from the kit root:
   - `skills/shoebox/SKILL.md`
   - `skills/shoebox/workflows/process-receipts.md`
   - `skills/shoebox/workflows/month-end-export.md`
   - `skills/shoebox/workflows/flag-review.md`
   - `skills/shoebox/workflows/month-in-review.md`
   - `skills/shoebox/ledger/categories.md`
   - `skills/shoebox/ledger/jobs.md`
   - `OPERATIONS-MANUAL.md`
   Say: "Add those files to this Project/Gem as sources, then tell me when
   they're in and I'll read them and build your condensed instructions."
   **Fallback if the platform caps Project files** (free plans often cap around
   five): instead of adding files, ask the user to paste the contents of the
   listed files into the chat one at a time — same read-set, different transport.
   "I can't see those files" is never a dead end.
2. Only once the sources are in front of you (added or pasted), read the WHOLE
   package: `skills/shoebox/SKILL.md`, all four files under
   `skills/shoebox/workflows/`, `skills/shoebox/ledger/categories.md`,
   `skills/shoebox/ledger/jobs.md`, and `OPERATIONS-MANUAL.md`.
3. Write a single instruction document (~1–2 pages) that preserves, in priority
   order:
   1. **THE NEVER-GUESS-MONEY RULE** — first and loudest. When a total/date/
      vendor/payment is unclear, ASK; never invent a number. State confidence
      per receipt (`read clean` / `asked` / `best guess on category only`).
   2. **THE JOB QUESTION** — ask once per batch which job or customer the pile
      is for, offering the open jobs by name; `overhead` for anything that isn't
      for a customer; `NEEDS JOB` rather than a guess between two jobs.
   3. the six fields spelled out (`vendor name`, `purchase date`,
      `total amount in dollars`, `payment method`, `job or customer`,
      `expense category`);
   4. the four moves — process receipts → month-end export → flag review →
      month in review — with their trigger phrases;
   5. the append-only monthly-table ledger format (with the `Job` column between
      `Category` and `Confidence`) and the running total;
   6. **the categorizing judgment rules** — supply house on a day with an open
      job defaults to job materials; a repair shop is never Vehicle & Fuel; any
      single item over $2,500 carries a capital-vs-expense note rather than a
      "typo?" flag; a first-time vendor gets named out loud;
   7. both CSV column specs
      (`Date,Vendor,Amount,Payment Method,Category,Job,Notes` and the job-costs
      file), amounts as bare numbers;
   8. the flag-pass five checks (duplicates, over-$2,500 capital question,
      unusual-for-its-pattern, unreadable/incomplete, money parked in
      Uncategorized) that ASK before changing anything;
   9. the starter category list for the business type chosen in Section 4.5
      (the user can edit it);
   10. the honest disclaimer ("this organizes your receipts — it doesn't do your
      taxes; your accountant makes the final call").
   State plainly what a chat platform can't do (no saved inbox folder, no
   durable ledger file on disk) and that receipts are pasted as photos in the
   chat and the CSVs come back as downloads or pasted text.
4. Deliver it the way your platform allows: paste the FULL text inline for the
   user to copy if you cannot attach files. If the instruction field is too
   small, put the never-guess rule + the job question + six fields + four moves
   + the categorizing judgment rules + CSV specs in the field, and tell the user
   to post the rest as the first message in the Project.
5. Tell the user where it goes: ChatGPT → new Project → Instructions, name it
   "Receipt Shoebox." Gemini → new Gem → Instructions. Similar platforms → the
   closest persistent-instructions slot.
6. Do the **Business-Type Question (4.5)**, the **Image Capability check (3.5)**
   and the **Branding Interview (4)** now.
7. **PAUSE here.** The paste-and-save happens outside this conversation. Say:
   "Once it's saved, start a NEW chat inside the Project/Gem, grab a real
   receipt off your desk, and say 'log this receipt.'" Section 5 runs in that new
   chat, on their own paper. Do NOT demo on a made-up receipt in THIS chat —
   the first thing they see logged must be theirs.

## Section 3D: Plain chat session

No persistence exists here, so install into the conversation:

1. Read `skills/shoebox/SKILL.md`, the four workflow files, and
   `skills/shoebox/ledger/categories.md` (ask the user to paste any you cannot
   see).
2. Say: "I've loaded Receipt Shoebox for this conversation. For a permanent
   install, open this same file with the Claude app, a Claude Code or Codex
   terminal, or a ChatGPT Project and I'll install it there."
3. Do the **Business-Type Question (4.5)**, the **Image Capability check (3.5)**
   and a quick **Branding Interview (4)** in-conversation, then go to Section 5
   (Verify) in-conversation.

---

## Section 3.5: Image Capability Check (MANDATORY — this kit READS photos)

Unlike kits that *generate* pictures, Receipt Shoebox **consumes** them: its
whole job is reading receipt PHOTOS with vision. So the check here is the
reverse of the usual one — confirm the user's AI can actually SEE an image, and
tell the user plainly which of their AIs can do this job.

1. **Test yourself first.** Can you accept and read the contents of an uploaded
   image? Most current assistants can. Determine your own answer honestly:

   | Your AI | Can it read receipt photos? |
   | --- | --- |
   | Claude (app or Claude Code) | Yes — reads uploaded images with vision. |
   | ChatGPT / Codex (GPT-4o-class and later) | Yes — reads uploaded images. |
   | Gemini | Yes — reads uploaded images. |
   | A text-only model with no vision | No — it cannot see the photo. |

2. **Record it** in `branding/image-setup.md` (create the `branding/` folder if
   it doesn't exist yet): one line stating this AI CAN or CANNOT read receipt
   photos, and — if the user mentioned using more than one AI — which of theirs
   can. Example: `Vision lane: Claude Code reads receipt photos directly. User
   also has ChatGPT (also reads photos) as a backup.`

3. **Say it plainly to the user.** If you can read photos: "Good news — I can
   read your receipt photos directly, so this'll work." If you CANNOT (rare,
   text-only model): don't pretend. Tell them: "I can't see images in this
   setup. To use Receipt Shoebox you'll want to run it in Claude, ChatGPT, or
   Gemini, which can read photos. You can still type receipt details to me by
   hand." Ask ONE question only if genuinely unsure whether they have a
   vision-capable AI available.

Every time the skill runs, it assumes this vision lane. Never hardcode a
specific tool — read the recorded lane.

**One note on the reverse case (generating a report logo).** This kit's image
check is about READING photos, not making them. But if the branding step ever
records a native image-GENERATION lane for a printed-report logo, do not trust
the brand name: even on ChatGPT or Gemini, a Business/Enterprise/Edu workspace
can disable image generation, so verify the tool actually responds before
recording native generation and fall back to a designed SVG/CSS wordmark if it
doesn't.

---

## Section 4: Branding Interview (short — powers the export header)

Keep it brief; `brand.md` here mainly gives the accountant file a proper header
and the summaries the business's name. Ask, in plain language:

> "Last thing — what's the business name that should go on the accountant file?
> And if you have a logo or brand colors you want on any printed report, share
> them or tell me the colors. If not, just the name is fine."

Then create `branding/brand.md`:

- business name (required — used in the CSV banner and month-end summary);
- optional tagline;
- optional colors, fully spelled out (`primary color:`, `accent color:`);
- optional voice note (formal / friendly) for the summary wording;
- a pointer to the vision lane recorded in `branding/image-setup.md`.

If the user gives only a name, that's enough — record it and move on. If they
give nothing at all, use a plain placeholder like `Your Business` and tell them
they can edit `branding/brand.md` any time.

---

## Section 4.5: The Business-Type Question (ONE question — picks the categories)

This is the question that decides whether the kit is worth money to this
customer. An office-worker's category list applied to a landscaper puts his
four biggest, most tax-consequential expenses into `Other / Uncategorized`. Ask
it before the branding interview.

Ask exactly this, in plain language:

> "One question so I set up the right expense buckets: **what does your business
> do?** (For example: a trade or field service like landscaping, HVAC, or
> contracting; professional services like consulting or an office; retail or
> food; or something else.)"

Map their answer to one of the four lists in `skills/shoebox/ledger/variants/`
and **copy that variant's category list into `skills/shoebox/ledger/categories.md`**,
replacing what is there:

| Their answer sounds like | Copy this variant |
| --- | --- |
| landscaping, hardscape, HVAC, plumbing, electrical, roofing, remodeling, contracting, auto or truck shop, anything with trucks, crews, and materials | `variants/trades-and-field-service.md` (**default when unsure and they buy materials**) |
| consulting, agency, marketing, bookkeeping, law, insurance, architecture, anyone billing time | `variants/professional-services.md` |
| shop, boutique, cafe, restaurant, bakery, food truck, caterer, anyone buying inventory or ingredients | `variants/retail-and-food.md` |
| genuinely none of the above | `variants/generic-smb.md` |

Then record it in `skills/shoebox/USER-CONFIG.md`:

- set `business type:` to the variant you used;
- set `job tracking:` — **decide this from HOW MUCH of their money is spent on
  a customer's behalf, not from what industry they are in.** A trade buys
  materials for a job all day; an insurance agency mails a $14 certificate once
  a month and spends everything else on itself. Turning the job question on for
  the second one means asking a question whose answer is `overhead` eleven
  times out of twelve, which is how a good tool becomes an annoying one.

  Ask ONE plain question — always, do not infer it from the variant:

  > "When you spend money, how much of it is bought for one specific customer
  > or job? Most of it, a little of it, or basically none?"

  | Their answer | Set `job tracking:` | What happens |
  | --- | --- | --- |
  | most of it — materials, subs, permits per job (trades, contractors, caterers doing events) | `on` | The job question is asked once per pile; the job-costs file is produced. |
  | a little — the odd filing fee, courier, or certificate rebilled to a client (agencies, insurance, small offices) | `light` | No job question on a normal pile. Everything is `overhead` unless the user says otherwise, and the AI asks about a receipt ONLY when it is plainly for a named customer (a certified mailing, a filing fee, a courier). The job-costs file is produced only if any row that month carries a job. |
  | basically none — one location, nothing bought per customer | `off` | No job question ever. Every row reads `overhead`, no job-costs file, and the AI says so once rather than nagging. |

  When unsure between `on` and `light`, pick `light` — an under-asked question
  is a smaller sin than a question asked twelve times a month, and the user can
  change one word in `USER-CONFIG.md` to move it.

Say back what you did, in one line: "Set you up with the trades category list —
job materials, subcontractors, equipment repair, permits — and I'll ask which
job each pile is for. You can edit any of it in `categories.md`."

Do not ask a second question here. If they gave you enough in the branding step
or earlier in the conversation to answer it yourself, skip the question and just
say which list you picked and how to change it.

---

## Section 5: Verify (all paths) — on the user's OWN receipt, not a sample

Never end the install by listing what you did, and **never verify on a receipt
this kit made up.** The first thing this customer sees logged has to be their
own vendor, their own money, their own job. That is the whole difference between
a demo and a tool. (Coming from 3B: only run this after the user confirms the
skill is uploaded and toggled on; from 3C: run it in the new Project chat.)

1. Ask for one real receipt, right now:

   > "Last step — grab any receipt off your desk, out of your wallet, or out of
   > the truck. Photograph it and send it to me, or just read it out to me if
   > that's easier. One is enough."

2. **Wait for it.** This is a real stop. If they say they don't have one on
   them, ask for the most recent thing they bought for the business and take it
   read aloud ("Home Depot, Tuesday, forty-two-something, on the debit card").
   **Do not substitute an example receipt to keep the install moving.** If they
   genuinely cannot produce one, say plainly: "Then we'll finish the moment you
   have one — the setup is done, and the first receipt is the test. Say 'log
   this receipt' whenever you're ready," and stop there. An install verified on
   fake data is not verified.

3. Run the real process-receipts behavior on THEIR receipt:
   - pull the six fields;
   - ask the job question once — "was this for a job, or just running the
     business?" — and record the answer, adding the job to `ledger/jobs.md` if
     it is new;
   - categorize it from their own `ledger/categories.md` and SAY which rule you
     used and that the category is your guess;
   - mark the confidence honestly;
   - append it to this month's table in the ledger (or show the table as text on
     a chat install). This is the first row in the file — it should be theirs.

4. **If any part of their receipt is unreadable, let them watch you refuse.**
   Do not smooth it over: ask for the total, or say the photo is unusable and
   why. That is the kit's whole promise and this is the best moment to prove it.
   If their receipt happened to read perfectly, say what would have happened:
   "If that total had been smudged, I'd have asked you instead of guessing —
   money never gets guessed here."

5. Offer the export: "Say **month-end export** at the end of the month and you
   get two files — one for your accountant, and one showing what each job cost
   you." On a coding-agent install they land in the `exports/` folder in the
   books folder (e.g. `~/Documents/shoebox/exports/expenses-2026-07.csv` and
   `job-costs-2026-07.csv`), with card values like `Visa 1234` quoted per the
   CSV escaping rule.

6. **Only now, optionally, the honesty demo as a follow-up.** Their real receipt
   is logged, so a made-up example can no longer be the first thing they saw:
   "Want to see what happens on a bad one? Picture a gas receipt with the total
   smudged —" then show that you ASK rather than invent a number.

7. Point them to `OPERATIONS-MANUAL.md` for the once-a-month routine, and remind
   them: this organizes receipts, it doesn't do their taxes.

## Section 6: If Anything Fails

Diagnose and adapt — do not bounce the problem to the user or the vendor. State
what the host rejected, produce the alternative shape from the canonical files,
and continue. Only if you have exhausted every path in Section 3 may you tell
the user the one concrete step you need from them (e.g., "enable code execution
in Settings → Capabilities, then say 'continue install'").
