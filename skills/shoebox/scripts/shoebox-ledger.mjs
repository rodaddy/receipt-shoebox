#!/usr/bin/env node

import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const HEADER = "| Date | Vendor | Amount | Payment | Category | Job | Confidence | Note |";
const DIVIDER = "| --- | --- | --- | --- | --- | --- | --- | --- |";
const MONEY = /^-?(?:0|[1-9]\d*)\.\d{2}$/;
const DATE = /^\d{4}-\d{2}-\d{2}$/;
const MONTH_HEADING = /^## (\d{4})-(\d{2}) — /;
const CONFIDENCE = new Set(["read clean", "asked", "best guess on category only"]);

// The two sanctioned pending markers. SKILL.md's refusal contract REQUIRES a
// partially-readable receipt to be logged with these rather than a guessed
// value, so the script must be able to WRITE them and verify must not call
// them corruption. They are only accepted with --pending, and only in the
// column each one belongs to.
const PENDING_AMOUNT = "NEEDS CONFIRMATION";
const PENDING_JOB = "NEEDS JOB";

function fail(message, code = 1) {
  console.error(message);
  process.exitCode = code;
}

function usage() {
  console.log(`Receipt Shoebox ledger helper

Commands:
  node scripts/shoebox-ledger.mjs add --ledger <path> --date YYYY-MM-DD --vendor <name> --amount 47.99 --payment <method> --category <bucket> --job <name|overhead> --confidence <value> [--note <text>] [--pending] [--allow-duplicate --note <why>]
  node scripts/shoebox-ledger.mjs verify --ledger <path>

Pending rows:
  --pending allows --amount "${PENDING_AMOUNT}" and/or --job "${PENDING_JOB}"
  for a receipt the owner has not confirmed yet. Confidence must be "asked",
  a pending amount is excluded from the running total, and the photo stays in
  inbox/ until the value is confirmed. Nothing else may be a NEEDS value.

Duplicates:
  --allow-duplicate requires --note explaining why the repeat is a separate
  purchase, so the ledger carries the reason an accountant will ask for.

Exit codes: 0 pass, 1 input or ledger check failed, 3 harness error.`);
}

function parseArgs(argv) {
  const [command, ...rest] = argv;
  const values = {};
  for (let index = 0; index < rest.length; index += 1) {
    const token = rest[index];
    if (!token.startsWith("--")) throw new Error(`Unexpected argument: ${token}`);
    const key = token.slice(2);
    if (key === "allow-duplicate" || key === "pending") {
      values[key] = true;
      continue;
    }
    const value = rest[index + 1];
    if (value === undefined || value.startsWith("--")) throw new Error(`Missing value for --${key}`);
    values[key] = value;
    index += 1;
  }
  return { command, values };
}

function required(values, key) {
  const value = values[key]?.trim();
  if (!value) throw new Error(`Missing required --${key}`);
  return value;
}

function escapeCell(value) {
  return value.replaceAll("|", "\\|").replaceAll("\n", " ").trim();
}

function monthKey(date) {
  return date.slice(0, 7);
}

function monthHeading(date) {
  const parsed = new Date(`${date}T00:00:00Z`);
  if (Number.isNaN(parsed.valueOf()) || parsed.toISOString().slice(0, 10) !== date) {
    throw new Error(`Invalid calendar date: ${date}`);
  }
  const month = new Intl.DateTimeFormat("en-US", { month: "long", timeZone: "UTC" }).format(parsed);
  return `## ${monthKey(date)} — ${month}`;
}

function parseRow(line) {
  const cells = line.slice(1, -1).split(/(?<!\\)\|/).map((cell) => cell.trim().replaceAll("\\|", "|"));
  return cells.length === 8 ? cells : null;
}

function verifyLedger(contents) {
  const errors = [];
  const pending = [];
  const lines = contents.split("\n");
  let currentMonth = null;
  let total = 0;
  let sawTotal = false;

  const closeMonth = () => {
    if (currentMonth && !sawTotal) errors.push(`${currentMonth}: missing Running total`);
  };

  for (const line of lines) {
    if (MONTH_HEADING.test(line)) {
      closeMonth();
      currentMonth = line.slice(3);
      total = 0;
      sawTotal = false;
      continue;
    }
    if (!currentMonth || line === HEADER || line === DIVIDER) continue;
    if (line.startsWith("Running total: $")) {
      sawTotal = true;
      const stated = Number(line.slice("Running total: $".length));
      if (!Number.isFinite(stated) || Math.abs(stated - total) > 0.005) {
        errors.push(`${currentMonth}: running total does not match rows`);
      }
      continue;
    }
    if (!line.startsWith("| ")) continue;
    const row = parseRow(line);
    if (!row) {
      errors.push(`${currentMonth}: malformed row`);
      continue;
    }
    const [date, vendor, amount, payment, category, job, confidence] = row;
    if (!DATE.test(date)) errors.push(`${currentMonth}: invalid date ${date}`);
    if (!vendor) errors.push(`${currentMonth}: missing vendor`);
    const amountPending = amount === PENDING_AMOUNT;
    const jobPending = job === PENDING_JOB;
    if (!amountPending && !MONEY.test(amount)) errors.push(`${currentMonth}: invalid amount ${amount}`);
    if (!payment) errors.push(`${currentMonth}: missing payment`);
    if (!category) errors.push(`${currentMonth}: missing category`);
    if (!job) errors.push(`${currentMonth}: missing job`);
    if (!CONFIDENCE.has(confidence)) errors.push(`${currentMonth}: invalid confidence ${confidence}`);
    if (amountPending || jobPending) {
      if (confidence !== "asked") {
        errors.push(`${currentMonth}: ${date} ${vendor} is unconfirmed, so confidence must be "asked"`);
      }
      pending.push(
        `${currentMonth}: ${date} ${vendor} awaits ${
          amountPending && jobPending ? "an amount and a job" : amountPending ? "an amount" : "a job"
        }`,
      );
    }
    if (MONEY.test(amount)) total += Number(amount);
  }
  closeMonth();
  return { errors, pending };
}

// The running total for a month lives between that month's heading and the
// next `## ` heading. Searching past the next heading finds a LATER month's
// total and silently corrupts it, so the search is bounded and a missing
// total fails before anything is written.
function findMonthEnd(lines, headingIndex) {
  for (let index = headingIndex + 1; index < lines.length; index += 1) {
    if (lines[index].startsWith("## ")) return index;
  }
  return lines.length;
}

async function add(values) {
  const ledgerPath = path.resolve(required(values, "ledger"));
  const date = required(values, "date");
  const vendor = required(values, "vendor");
  const amount = required(values, "amount");
  const payment = required(values, "payment");
  const category = required(values, "category");
  const job = required(values, "job");
  const confidence = required(values, "confidence");
  const note = values.note ?? "";
  const pending = values.pending === true;

  if (!DATE.test(date)) throw new Error(`Invalid date format: ${date}`);
  monthHeading(date);
  if (!CONFIDENCE.has(confidence)) throw new Error(`Invalid confidence: ${confidence}`);

  const amountPending = amount === PENDING_AMOUNT;
  const jobPending = job === PENDING_JOB;

  if (amountPending || jobPending) {
    if (!pending) {
      throw new Error(
        `${amountPending ? PENDING_AMOUNT : PENDING_JOB} needs --pending. Use it only when the owner is not available to confirm, and never to skip asking.`,
      );
    }
    if (confidence !== "asked") {
      throw new Error(`A pending row must carry confidence "asked", not ${confidence}`);
    }
  } else if (pending) {
    throw new Error(
      `--pending was passed but nothing is pending; drop the flag or write "${PENDING_AMOUNT}" / "${PENDING_JOB}" in the unconfirmed cell.`,
    );
  }

  if (!amountPending && !MONEY.test(amount)) {
    throw new Error(`Amount must be a confirmed number with two decimals, not ${amount}`);
  }
  // Only the two sanctioned markers, only in their own column.
  for (const [key, value] of Object.entries({ vendor, payment, category, job })) {
    if (!/^NEEDS /i.test(value)) continue;
    if (key === "job" && value === PENDING_JOB) continue;
    throw new Error(`${key} is unresolved; STOP and confirm it before using this command`);
  }
  if (amountPending && amount !== PENDING_AMOUNT) {
    throw new Error(`Amount must be a confirmed number with two decimals, not ${amount}`);
  }

  let contents;
  try {
    contents = await readFile(ledgerPath, "utf8");
  } catch (error) {
    fail(`Cannot read ledger: ${error.message}`, 3);
    return;
  }

  const duplicate = contents.split("\n").some((line) => {
    const row = line.startsWith("| ") ? parseRow(line) : null;
    return row && row[0] === date && row[1] === vendor && row[2] === amount;
  });
  if (duplicate && !values["allow-duplicate"]) {
    throw new Error(`Possible duplicate: ${vendor}, ${date}, ${amount}. Confirm it is separate, then rerun with --allow-duplicate and a --note saying why.`);
  }
  if (duplicate && values["allow-duplicate"] && !note.trim()) {
    throw new Error(`--allow-duplicate needs a --note recording why this repeat of ${vendor} ${date} ${amount} is a separate purchase.`);
  }

  const heading = monthHeading(date);
  const rowAmount = amountPending ? PENDING_AMOUNT : amount;
  const row = `| ${[date, vendor, rowAmount, payment, category, job, confidence, note].map(escapeCell).join(" | ")} |`;
  const lines = contents.split("\n");
  const headingIndex = lines.indexOf(heading);

  if (headingIndex === -1) {
    const openingTotal = amountPending ? 0 : Number(amount);
    const block = `${heading}\n\n${HEADER}\n${DIVIDER}\n${row}\n\nRunning total: $${openingTotal.toFixed(2)}`;
    lines.splice(newMonthInsertIndex(lines, monthKey(date)), 0, "", block, "");
  } else {
    const monthEnd = findMonthEnd(lines, headingIndex);
    const headerIndex = lines.indexOf(HEADER, headingIndex);
    const dividerIndex = headerIndex === -1 ? -1 : lines.indexOf(DIVIDER, headerIndex);
    if (headerIndex === -1 || headerIndex > monthEnd || dividerIndex === -1 || dividerIndex > monthEnd) {
      throw new Error(`${heading}: table header is missing or malformed`);
    }
    let rowEnd = dividerIndex + 1;
    let total = 0;
    while (rowEnd < monthEnd && lines[rowEnd].startsWith("| ")) {
      const existing = parseRow(lines[rowEnd]);
      if (existing && MONEY.test(existing[2])) total += Number(existing[2]);
      rowEnd += 1;
    }
    const totalIndex = lines.findIndex(
      (line, index) => index > rowEnd && index < monthEnd && line.startsWith("Running total: $"),
    );
    if (totalIndex === -1) throw new Error(`${heading}: Running total line is missing`);
    lines.splice(rowEnd, 0, row);
    lines[totalIndex + 1] = `Running total: $${(total + (amountPending ? 0 : Number(amount))).toFixed(2)}`;
  }

  let output = lines.join("\n");
  if (!output.endsWith("\n")) output += "\n";

  try {
    await writeFile(ledgerPath, output, "utf8");
  } catch (error) {
    fail(`Cannot write ledger: ${error.message}`, 3);
    return;
  }
  console.log(
    amountPending || jobPending
      ? `Added ${vendor} ${rowAmount} to ${heading} as PENDING — confirm it in the flag pass and leave the photo in inbox/.`
      : `Added ${vendor} ${amount} to ${heading}.`,
  );
}

// Newest month at the TOP, per ledger/expenses.md. A month that predates every
// existing section goes below them; the first month of all goes just under the
// `---` marker, or at end of file when the marker is absent.
function newMonthInsertIndex(lines, key) {
  for (let index = 0; index < lines.length; index += 1) {
    const match = MONTH_HEADING.exec(lines[index]);
    if (!match) continue;
    if (`${match[1]}-${match[2]}` < key) return index;
  }
  const lastHeading = lines.reduce((last, line, index) => (MONTH_HEADING.test(line) ? index : last), -1);
  if (lastHeading !== -1) return lines.length;
  const marker = lines.findIndex((line) => line === "---");
  if (marker === -1) return lines.length;
  // Skip the ledger's placeholder comment block so the first month lands
  // BELOW it and every later month stays contiguous above it.
  let index = marker + 1;
  while (index < lines.length && lines[index].trim() === "") index += 1;
  if (lines[index]?.trimStart().startsWith("<!--")) {
    while (index < lines.length && !lines[index].includes("-->")) index += 1;
    return Math.min(index + 1, lines.length);
  }
  return marker + 1;
}

async function verify(values) {
  const ledgerPath = path.resolve(required(values, "ledger"));
  let contents;
  try {
    contents = await readFile(ledgerPath, "utf8");
  } catch (error) {
    fail(`Cannot read ledger: ${error.message}`, 3);
    return;
  }
  const { errors, pending } = verifyLedger(contents);
  if (errors.length) {
    for (const error of errors) console.error(error);
    process.exitCode = 1;
    return;
  }
  console.log("Ledger structure and running totals pass.");
  if (pending.length) {
    console.log(`${pending.length} row(s) await the owner's confirmation (not an error):`);
    for (const item of pending) console.log(`  ${item}`);
  }
}

try {
  const { command, values } = parseArgs(process.argv.slice(2));
  if (!command || command === "help" || command === "--help") usage();
  else if (command === "add") await add(values);
  else if (command === "verify") await verify(values);
  else throw new Error(`Unknown command: ${command}`);
} catch (error) {
  fail(error.message);
}
