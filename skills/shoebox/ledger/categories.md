# Expense Categories

Plain-language buckets for sorting your receipts. These are NOT tax codes --
your accountant maps them to the real IRS lines. **This file is yours to
edit:** rename buckets, add your own, delete ones you never use. The AI reads
this file before sorting any receipt and only uses categories it finds here.

**Which list is this?** The installer asked you one question -- "what does your
business do?" -- and copied the matching starter list from `variants/` into this
file. The variants that ship with the kit are:

- `variants/trades-and-field-service.md` -- landscaping, hardscape, HVAC,
  plumbing, electrical, roofing, remodeling, auto and truck shops. **Default,
  and the one this kit is built for.**
- `variants/professional-services.md` -- consulting, agencies, bookkeepers,
  law and insurance offices, anyone billing time rather than materials.
- `variants/retail-and-food.md` -- shops, cafes, restaurants, food trucks,
  anyone buying inventory or ingredients to resell.
- `variants/generic-smb.md` -- the neutral office list, for a business that
  fits none of the above.

If your business changed, or the installer guessed wrong, open the variant you
want under `variants/` and copy its list over the one below. Nothing else in the
kit has to change.

## Starter categories -- trades and field service (default)

**Job-related spend (the money questions).**

- **Job Materials (COGS)** -- anything consumed on a customer's job: lumber,
  pavers, mulch, pipe, wire, fixtures, concrete, stone, sod, fasteners,
  disposal of job debris. This is cost of goods sold and it is usually the
  single largest deduction a trade business has. If a job is open, hardware and
  supply-house spend lands here by default.
- **Subcontractors** -- another company or person you paid to do part of a job
  (excavation, crane, tree work, electrician on your permit).
- **Small Tools & Consumables** -- blades, bits, gloves, tarps, string line,
  anything cheap that gets used up. Not equipment.
- **Equipment Repair & Maintenance** -- repairs and service on trucks,
  trailers, mowers, machines: a fender repair, a hydraulic hose, an oil change,
  a track replacement done as a repair. **A repair shop is never Vehicle &
  Fuel.**
- **Equipment Purchase (capital -- ask your accountant about depreciating)** --
  buying a machine, truck, trailer, or attachment outright. Large purchases
  usually get written off over several years instead of all at once, and that is
  your accountant's call, not this kit's.
- **Permits & Filing Fees** -- town and county permits, inspections, licenses,
  filing fees, dump tickets tied to a permit.
- **Crew Meals & Supplies** -- coffee and food for the crew, water, ice, job-site
  supplies. Kept separate from client meals because they are treated differently.

**Everything else.**

- **Vehicle & Fuel** -- fuel, tolls, parking, registration. Fuel only; repairs
  go to Equipment Repair & Maintenance.
- **Office Supplies** -- paper, pens, printer ink, folders, small office gear.
- **Software & Subscriptions** -- apps, hosting, domain names, scheduling and
  estimating tools, AI tools.
- **Marketing & Advertising** -- ads, truck lettering, yard signs, printing,
  business cards, sponsorships.
- **Professional Services** -- legal, accounting, consulting.
- **Utilities & Phone** -- internet, cell phone, electric on a shop or yard.
- **Rent & Facilities** -- shop rent, yard, storage.
- **Insurance** -- general liability, vehicle, workers comp.
- **Education & Training** -- licenses renewals, courses, certifications.
- **Bank & Merchant Fees** -- card processing fees, bank charges.
- **Client Meals** -- meals with a customer or a referral partner.
- **Other / Uncategorized** -- anything that does not fit yet. If a receipt
  keeps landing here, add a bucket above for it.

## How the AI uses this

- It picks the closest bucket from this list for each receipt, based on the
  vendor, what was bought, and whether a job was open that day. The full rules
  live in `../SKILL.md` under "Categorizing is a judgment, not a lookup."
- The category is the ONE thing the AI is allowed to guess -- it always tells
  you which it guessed so you can correct it.
- If nothing fits, it uses **Other / Uncategorized** and mentions it. If the
  same kind of thing lands there three times, the AI offers to add a bucket for
  it (see the month-in-review pass).
