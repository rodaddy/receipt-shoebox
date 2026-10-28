import assert from "node:assert/strict";
import { mkdir, mkdtemp, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { spawnSync } from "node:child_process";
import test from "node:test";

const script = new URL("../skills/shoebox/scripts/shoebox-ledger.mjs", import.meta.url).pathname;
const ledgerTemplate = `# Expenses Ledger\n\n---\n\n<!-- rows land here -->\n`;

// Default to a scratch folder beside the tests so the command printed in
// README.md runs as written. SHOEBOX_TEST_SCRATCH still overrides it for a
// shared scratch volume; nothing here ever writes to /tmp.
const scratchRoot = process.env.SHOEBOX_TEST_SCRATCH
  ?? new URL("./scratch/", import.meta.url).pathname;

async function ledgerFixture() {
  await mkdir(scratchRoot, { recursive: true });
  const directory = await mkdtemp(path.join(scratchRoot, "shoebox-ledger-"));
  const ledger = path.join(directory, "expenses.md");
  await writeFile(ledger, ledgerTemplate, "utf8");
  return ledger;
}

function run(...args) {
  return spawnSync(process.execPath, [script, ...args], { encoding: "utf8" });
}

function addArgs(ledger, overrides = {}) {
  const values = {
    ledger,
    date: "2026-08-13",
    vendor: "Riverhead Building Supply",
    amount: "42.19",
    payment: "Visa 1234",
    category: "Job Materials (COGS)",
    job: "Islip patio",
    confidence: "best guess on category only",
    note: "confirmed from buyer receipt",
    ...overrides,
  };
  return Object.entries(values).flatMap(([key, value]) => [`--${key}`, value]);
}

test("add writes a canonical row and running total", async () => {
  const ledger = await ledgerFixture();
  const result = run("add", ...addArgs(ledger));
  assert.equal(result.status, 0, result.stderr);
  const contents = await readFile(ledger, "utf8");
  assert.match(contents, /## 2026-08 — August/);
  assert.match(contents, /\| 2026-08-13 \| Riverhead Building Supply \| 42\.19 /);
  assert.match(contents, /Running total: \$42\.19/);
  assert.ok(contents.endsWith("\n"), "ledger must end with a newline");
  assert.equal(run("verify", "--ledger", ledger).status, 0);
});

test("add refuses an unexplained unresolved value before mutation", async () => {
  const ledger = await ledgerFixture();
  const result = run("add", ...addArgs(ledger, { amount: "NEEDS CONFIRMATION" }));
  assert.equal(result.status, 1);
  assert.match(result.stderr, /needs --pending/);
  assert.equal(await readFile(ledger, "utf8"), ledgerTemplate);
});

test("add refuses a made-up money value outright", async () => {
  const ledger = await ledgerFixture();
  const result = run("add", ...addArgs(ledger, { amount: "about forty" }));
  assert.equal(result.status, 1);
  assert.match(result.stderr, /Amount must be a confirmed number/);
  assert.equal(await readFile(ledger, "utf8"), ledgerTemplate);
});

test("add refuses a possible duplicate before mutation", async () => {
  const ledger = await ledgerFixture();
  assert.equal(run("add", ...addArgs(ledger)).status, 0);
  const before = await readFile(ledger, "utf8");
  const duplicate = run("add", ...addArgs(ledger));
  assert.equal(duplicate.status, 1);
  assert.match(duplicate.stderr, /Possible duplicate/);
  assert.equal(await readFile(ledger, "utf8"), before);
});

test("--allow-duplicate demands a note recording why the repeat is separate", async () => {
  const ledger = await ledgerFixture();
  assert.equal(run("add", ...addArgs(ledger)).status, 0);
  const before = await readFile(ledger, "utf8");
  const noNote = run("add", ...addArgs(ledger, { note: " " }), "--allow-duplicate");
  assert.equal(noNote.status, 1);
  assert.match(noNote.stderr, /needs a --note/);
  assert.equal(await readFile(ledger, "utf8"), before);

  const withNote = run("add", ...addArgs(ledger, { note: "second fill-up, separate slip" }), "--allow-duplicate");
  assert.equal(withNote.status, 0, withNote.stderr);
  assert.match(await readFile(ledger, "utf8"), /second fill-up, separate slip/);
});

test("verify rejects a wrong running total", async () => {
  const ledger = await ledgerFixture();
  assert.equal(run("add", ...addArgs(ledger)).status, 0);
  const contents = (await readFile(ledger, "utf8")).replace("Running total: $42.19", "Running total: $99.99");
  await writeFile(ledger, contents, "utf8");
  const result = run("verify", "--ledger", ledger);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /running total does not match rows/);
});

test("a pending row is writable, excluded from the total, and passes verify", async () => {
  const ledger = await ledgerFixture();
  const result = run(
    "add",
    ...addArgs(ledger, {
      amount: "NEEDS CONFIRMATION",
      job: "NEEDS JOB",
      confidence: "asked",
      note: "total torn, owner not around",
    }),
    "--pending",
  );
  assert.equal(result.status, 0, result.stderr);
  const contents = await readFile(ledger, "utf8");
  assert.match(contents, /\| NEEDS CONFIRMATION \|/);
  assert.match(contents, /\| NEEDS JOB \|/);
  assert.match(contents, /Running total: \$0\.00/);

  const verified = run("verify", "--ledger", ledger);
  assert.equal(verified.status, 0, verified.stderr);
  assert.match(verified.stdout, /await the owner's confirmation/);
});

test("a pending row must carry confidence asked", async () => {
  const ledger = await ledgerFixture();
  const result = run(
    "add",
    ...addArgs(ledger, { amount: "NEEDS CONFIRMATION", confidence: "read clean" }),
    "--pending",
  );
  assert.equal(result.status, 1);
  assert.match(result.stderr, /confidence "asked"/);
  assert.equal(await readFile(ledger, "utf8"), ledgerTemplate);
});

test("--pending does not license a NEEDS value in any other column", async () => {
  const ledger = await ledgerFixture();
  const result = run(
    "add",
    ...addArgs(ledger, { category: "NEEDS BUCKET", confidence: "asked" }),
  );
  assert.equal(result.status, 1);
  assert.match(result.stderr, /category is unresolved/);
  assert.equal(await readFile(ledger, "utf8"), ledgerTemplate);
});

test("months stay newest-first regardless of the order they are added", async () => {
  const ledger = await ledgerFixture();
  assert.equal(run("add", ...addArgs(ledger, { date: "2026-08-13" })).status, 0);
  assert.equal(run("add", ...addArgs(ledger, { date: "2026-07-05", amount: "5.00" })).status, 0);
  assert.equal(run("add", ...addArgs(ledger, { date: "2026-09-01", amount: "7.00" })).status, 0);
  const contents = await readFile(ledger, "utf8");
  const order = [...contents.matchAll(/^## (\d{4}-\d{2}) — /gm)].map((match) => match[1]);
  assert.deepEqual(order, ["2026-09", "2026-08", "2026-07"]);
  assert.equal(run("verify", "--ledger", ledger).status, 0);
});

// Terra's P1: the target month has NO Running total but a LATER section below
// it does. An unbounded search finds the wrong month's total and silently
// rewrites it. The correct behaviour is to fail with no mutation at all.
test("a month missing its Running total fails without touching the month below it", async () => {
  const ledger = await ledgerFixture();
  const table = "| Date | Vendor | Amount | Payment | Category | Job | Confidence | Note |\n| --- | --- | --- | --- | --- | --- | --- | --- |";
  const damaged = [
    "# Expenses Ledger",
    "",
    "---",
    "",
    "## 2026-08 — August",
    "",
    table,
    "| 2026-08-01 | Shell | 50.00 | Visa | Fuel | overhead | read clean |  |",
    "",
    "## 2026-07 — July",
    "",
    table,
    "| 2026-07-05 | Lowes | 5.00 | Visa | Mat | overhead | read clean |  |",
    "",
    "Running total: $5.00",
    "",
  ].join("\n");
  await writeFile(ledger, damaged, "utf8");
  const result = run("add", ...addArgs(ledger, { date: "2026-08-14", amount: "3.00" }));
  assert.equal(result.status, 1);
  assert.match(result.stderr, /Running total line is missing/);
  assert.equal(await readFile(ledger, "utf8"), damaged, "July's total must be untouched");
});
