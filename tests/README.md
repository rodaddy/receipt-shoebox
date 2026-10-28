# tests

Holds `shoebox-ledger.test.mjs`, the functional test for the plain-Node ledger
helper in `skills/shoebox/scripts/shoebox-ledger.mjs` - append behavior,
duplicate refusal, and ledger verification.

Run it with plain Node 22.6.0 or newer from the kit root:
`node --test tests/shoebox-ledger.test.mjs`. No package install. Scratch files
land in `tests/scratch/`, overridable with `SHOEBOX_TEST_SCRATCH`. These tests
are development-side and are not part of what the buyer installs.
