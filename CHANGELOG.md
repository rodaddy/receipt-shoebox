# Changelog

All notable changes to Receipt Shoebox are recorded here. This file follows
Keep a Changelog and Semantic Versioning. The version here, the `VERSION` file,
and the `**Version:**` line in `installer.md` must always agree -- the §4.8
upgrade path compares them.

## [1.1.4] - 2026-08-17

Cross-family review (Opus + Terra) of the 1.1.3 ledger tooling. Every item below
closes a defect that was reproduced against the shipped script, not a file
reading. `node --test tests/shoebox-ledger.test.mjs` is 11 tests, 11 passing on
Node 24 as of this release; the suite no longer needs an env var to run.

### Fixed

- **The refusal contract could not be written.** `SKILL.md` and
  `process-receipts.md` require a partially-readable receipt to be logged with
  `NEEDS CONFIRMATION` / `NEEDS JOB` rather than a guessed value, but `add`
  rejected both and `verify` reported such a ledger as FAILED — so the kit's own
  sanctioned partial row was unreachable through the command the workflow
  mandates, and `flag-review.md`'s "replace NEEDS CONFIRMATION with the real
  number" step could never fire. `add --pending` now writes that row, accepting
  the two markers only in their own columns and only at confidence `asked`; a
  pending amount is excluded from the running total, and `verify` exits `0` and
  lists the row as awaiting the owner instead of calling the ledger broken.
  Without `--pending`, a `NEEDS ...` value is still refused outright.
- **`add` corrupted a later month's running total.** The `Running total:` lookup
  was unbounded, so a target month missing its own total silently rewrote the
  NEXT month's figure. The search is now bounded to the target month's section
  and a missing total fails with no mutation at all.
- **New months landed in insertion order, not date order.** A month created
  after a later one was spliced under the `---` marker regardless of date,
  inverting the newest-first rule `ledger/expenses.md` and `month-in-review.md`
  both depend on. Insertion is now by month key, and the file always ends with a
  trailing newline (previously absent when the `---` marker was missing).
- **`--allow-duplicate` waved through an unexplained double charge.** It now
  requires a `--note` recording why the repeat is a separate purchase, so the
  reason an accountant will ask for is in the ledger.
- **The documented test command failed as written.** `README.md` named
  `node --test tests/shoebox-ledger.test.mjs` as the mechanical receipt, but the
  suite asserted an undocumented `SHOEBOX_TEST_SCRATCH` env var and failed every
  test without it. Fixtures now default to `tests/scratch/` (gitignored) with
  the env var kept as an override.
- **Node floor corrected to 22.6.0** in `kit.json`, `README.md`,
  `installer.md`, and `process-receipts.md`, matching KIT-STANDARD §9.3. The
  previous `>=22.0.0` understated it.

## [1.1.3] - 2026-08-13

### Added

- Added `skills/shoebox/scripts/shoebox-ledger.mjs`, a dependency-free plain-Node
  helper that owns the repeatable ledger append, monthly-table creation, running
  total, duplicate refusal, and ledger verification. The AI still reads the
  receipt and makes category/job judgments; the script performs the mechanical
  write only.
- Added Node boundary tests covering a valid append, unresolved-money refusal
  with no mutation, duplicate refusal with no mutation, and a bad-running-total
  verification failure.

### Fixed

- Replaced the 3B install handoff's "fake receipt" instruction with the buyer's
  own receipt, matching the own-data verification rule used everywhere else.
- Made the upgrade copy sequence executable: after backing up the installed
  skill, rebuild it from the package, restore protected user data, and include
  the new `scripts/` folder in recursive copies and zip integrity checks.
- Declared Node 22.6.0+ in `kit.json` and beside the tier ladder, and removed the
  stale claim that the kit ships no scripts or runtime dependency. Bun, jq,
  Python, package installs,
  and build steps remain absent.
- Reframed buyer-facing copy so the tool takes repetitive receipt entry off the
  owner's plate while they keep approval and judgment; no headcount-reduction
  reading remains.

## [1.1.2] - 2026-08-12

Workout-lane rework. Three rounds, three invented Long Island buyers, the kit's
own workflows run literally on their data: a Deer Park plumbing outfit (trades
variant, 12 receipts), a Hauppauge insurance agency (professional-services
variant, deliberately bad inputs), and a Patchogue pizzeria with a food truck
(retail variant, upgrading over five months of existing history). Every item
below closes something the kit actually got wrong while producing a real
artifact, not a file review. **WRITTEN, not re-tested** -- the acceptance boxes
in `README.md` stay unchecked.

### Changed

- **The over-$2,500 capital note now needs a SHAPE, not just a number.** It fires
  only when there is still a physical thing the business owns afterwards. The
  bare threshold put "ask your accountant whether to depreciate" on a $2,940
  errors-and-omissions insurance premium in round 2 -- wrong, and wrong in front
  of an insurance professional. Premiums, annual contracts, rent, taxes,
  retainers, subcontractors, and consumed materials now get no capital note at
  any dollar figure; genuinely unsure asks one plain question instead.
- **The job-costs CSV header is now fixed in every install:** `Materials &
  Goods`, `Outside Labor`, `Other Job Costs`. `SKILL.md` and the export workflow
  previously both said "use the variant's names as the column headings" while
  showing a literal trades-only header -- unresolvable for the retail variant,
  which has three cost-of-goods buckets and no subcontractor bucket. A fixed
  mapping table now says which of the user's buckets feeds which column, per
  variant. The `overhead` row writes `0` in all three, never blank, and every
  row's three cost columns must foot to `Total Spend`.
- **`job tracking:` gained a third setting, `light`, and the installer now asks
  about spending behavior rather than industry.** The old question ("do you buy
  things for specific customers?") gets a yes from an insurance agency that
  mails one certificate a month, which then earns a job question whose answer is
  `overhead` eleven times out of twelve. `light` skips the batch question, writes
  `overhead` by default, and asks about a single receipt only when it is plainly
  for one named customer.
- **An upgrade never replaces a user-edited `categories.md` -- it offers to
  APPEND.** Round 3's buyer asked for the obvious third option ("keep mine, add
  what's missing") and the installer had no path for it, so the kit's one
  hand-maintained file was one answer away from losing its edits or silently
  withholding the new buckets. Additions land under `## Added by the upgrade`;
  nothing above is renamed, reworded, or removed, because ledger rows point at
  those bucket names.
- The flag pass's "unusually large for its own pattern" check now states that it
  does not run in the first month, instead of inventing a baseline from one
  month of receipts.
- `month-in-review.md` no longer lists every vendor as a first-time vendor in
  month one -- that is the whole ledger read back, which the same file bans. It
  names the three largest and says why.

### Added

- **The overhead test**, one mechanical question replacing a four-item list:
  would this money have been spent if that job did not exist? Worked both ways,
  with the permit trap called out explicitly -- a permit pulled for a customer's
  address is that job's cost, a fee to keep the business itself legal is
  overhead, same category bucket, different job cell. Crew food and shared-day
  spend resolve to `overhead` with a stated one-time offer to do it the other
  way. Round 1 had no disposition for crew coffee, fuel, permits, or the sub.
- **A mixed-receipt rule in `SKILL.md`** -- 80/20 to one bucket with a note, ask
  when it is genuinely split, two rows summing to the printed total when the user
  wants it split. Round 2 filed $236 of consumable paper as hardware because one
  Amazon receipt had four kinds of thing on it and the kit had one Category cell
  and no instruction. The only prior mention of this case lived in the retail
  variant, which three of four buyers never load.
- **"Read the receipt, not the desk it is lying on."** A photo taken on a working
  desk catches a policyholder, a client matter, a patient. The kit now reads the
  receipt and nothing else, never writes another person's name or account number
  anywhere, and says so once. Handling rule only -- it makes no claim about any
  privacy law and never tells the user which rule applies to them.
- **`Job to date` as a last column** on `job-costs-YYYY-MM.csv` whenever a job
  spans months, compared against the bid instead of the month's slice. A
  catering gig, a remodel, and a roof all cross a month boundary; the owner's
  question was never "what did it cost me in September."
- A **standing job** pattern in `ledger/jobs.md` for a business running two
  operations -- a shop and a truck, two locations -- so both do not collapse into
  one `overhead` pile.
- A `0.00` rule: a zero total is written only when the paper says zero, with a
  note saying so. An unreadable total is `NEEDS CONFIRMATION` and never `0` -- a
  zero meaning "I could not read it" is a guessed number in disguise, and it
  reaches the accountant unnoticed.
- `OPERATIONS-MANUAL.md` gained plain-language coverage of all of the above.

### Still open (stated, not closed)

- Unchanged from 1.1.1: **no acceptance run has ever used an actual
  photograph.** All three workout rounds ran on receipts described in text, for
  a kit whose core claim is vision on crumpled paper.
- The desk-in-frame rule was written against round 2's scenario and has never
  run against a real photo containing a real document.
- No `examples/` folder yet (KIT-STANDARD worked-example layer).
- The clean-room 3A / path / 3B / 3C boxes stay reopened: this release adds a
  third `job tracking:` value, a new export column, and a merge branch in the
  upgrade path, none of which any clean-room pass has covered.

## [1.1.1] - 2026-08-12

Kit-tribunal rework (`research/kits/2026-08-11_kit-quality-tribunal.md`,
§ receipt-shoebox). The tribunal's verdict was that the mechanics were
ship-grade but the kit transcribed rather than judged: four of fourteen rows in
its own dry run landed in `Other / Uncategorized`, and they were the four
biggest, most tax-consequential lines of the month. Everything below is
**WRITTEN, not re-tested** -- the acceptance boxes in `README.md` for these items
are unchecked on purpose.

### Added

- **Job costing -- the change that matters most.** A sixth field,
  `{{job or customer}}`, asked ONCE per batch rather than per receipt; a `Job`
  column in the ledger between `Category` and `Confidence`; `ledger/jobs.md`
  holding the user's own jobs, customers, bids, and open/closed status (ships
  empty); and a **second month-end export, `job-costs-YYYY-MM.csv`**, totalling
  spend per job with the recorded bid alongside. Spend that is not for a
  customer is `overhead` and is listed separately so it never inflates a job.
  The kit refuses to guess between two jobs: it writes `NEEDS JOB`.
- Four vertical category variants under `ledger/variants/` -- trades and field
  service (the default), professional services, retail and food, generic small
  business -- and installer **Section 4.5**, one question ("what does your
  business do?") that copies the right one into `ledger/categories.md`.
- A `workflows/month-in-review.md` pass: three sentences comparing the month to
  prior months (biggest mover, trend, thing to look at), first-time vendors,
  recurring charges, and a standing offer to add a bucket for anything that has
  landed in `Other / Uncategorized` three times. It refuses to invent a trend
  from one month and refuses to compute profit or margin, because labor is not
  in this ledger.
- A **named-refusals table** in `SKILL.md` and `README.md`, satisfying the
  KIT-STANDARD line-wide refusal criterion, including a NEW refusal: an unusable
  photo is refused outright with no row written, because a made-up row looks
  logged.
- `VERSION` and this `CHANGELOG.md`.
- `USER-CONFIG.md` keys `business type:` and `job tracking:`.

### Changed

- **Categorizing is now a judgment, not a lookup.** Six stated rules in
  `SKILL.md`: a supply house on a day with an open job defaults to job materials
  (COGS), a repair shop is never Vehicle & Fuel, any single item over $2,500
  carries a **capital-vs-expense note on the row instead of an "is this a typo?"
  flag**, crew food is separated from client meals, a first-time vendor is named
  out loud, and big money in `Other / Uncategorized` is treated as a defect. The
  AI states which rule it applied so the owner can overrule it.
- The flag pass grew from three checks to five: the over-$2,500 capital
  question and money parked in `Other / Uncategorized` are now first-class, and
  the old "unusually large -- real or a typo?" question is narrowed to amounts
  whose shape suggests a mis-read.
- The accountant CSV gained a `Job` column; the ledger table and the 3C
  condensation preserve-list were updated to match.
- `OPERATIONS-MANUAL.md` gained the job step, a "when it stops and tells you no"
  section, and the honest note that labor is not tracked so profit is not shown.
- Installer `**Version:**` corrected from `1.0` to the real version -- the
  changelog had said v1.1 since 2026-07-15 while the installer said 1.0, which
  broke the §4.8 upgrade comparison.
- The upgrade path now handles the new `Job` column without rewriting history:
  the column is added to the current month's table only, older months are left
  as they are, and a user-edited `categories.md` is preserved rather than
  replaced by a variant.

### Removed

- **Fixture-first verification, per the KIT-STANDARD line-wide ban.** The
  pre-filled Shell/Verizon example section is gone from `ledger/expenses.md`,
  which now ships empty with column documentation only, and `ledger/jobs.md`
  ships empty for the same reason. Installer Section 5 no longer runs on a
  shipped Staples receipt: it asks the buyer for a real receipt off their own
  desk, **waits**, and stops the install rather than substituting an example if
  they have none to hand. The smudged-gas honesty demo survives only as an
  optional follow-up AFTER a real receipt is logged.

### Still open (stated, not closed)

- **No acceptance run has ever used an actual photograph.** Every check to date,
  including v1.1's, used a receipt described in text, for a kit whose entire
  premise is vision on crumpled paper. Unchanged by this release.
- The v1.1 3A install, path-acceptance, and 3C condensation passes were reopened:
  they passed against a package with three workflows, no `jobs.md`, no
  `variants/`, and five fields, so they no longer cover what ships.
- No `examples/` folder yet (KIT-STANDARD worked-example layer). Deliberately
  not added in this pass: the same release bans fixture-first verification, and
  a worked-example layer needs to be built so it cannot become the first
  artifact a buyer sees. Next lane's call.

## [1.1] - 2026-07-15

### Added

- Version-aware upgrade path in `installer.md`: finds an existing Receipt
  Shoebox, reads its version, asks "keep all your data or skip?", backs up to
  `shoebox.backup-<version>`, and replaces only `SKILL.md` and `workflows/`.
- `START-HERE.md`, the per-device unzip-and-hand-off card (KIT-STANDARD §4.6).
- Untrusted-input hardening (KIT-STANDARD §4.7): receipt text is DATA, never
  instructions, in both `SKILL.md` and `process-receipts.md`.
- Negative-amount `refund` handling and a year-rollover/archive section in the
  operations manual.
- The full CSV escaping rule, stated once in `month-end-export.md`.

### Changed

- KIT-STANDARD §4.5 path model: `ledger/` moved INSIDE the installed skill
  folder and read skill-relative, ending the relative-path break; the
  user-facing `inbox/`, `inbox/processed/`, and `exports/` folders moved to a
  books folder whose path is recorded once in `USER-CONFIG.md`.
- Defined the `NEEDS CONFIRMATION` photo state: the photo stays in `inbox/`
  until its row is fully written.
- 3C now names the exact kit files to add as Project/Gem sources and PAUSEs
  until they are added, with a paste fallback for platform file caps.
