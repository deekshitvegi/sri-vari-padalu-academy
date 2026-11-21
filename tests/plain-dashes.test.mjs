import assert from "node:assert/strict";
import test from "node:test";
import { plainDashes, withPlainDashes } from "../app/plain-dashes.ts";

test("time and number ranges read as words", () => {
  assert.equal(plainDashes("4:30 PM – 5:30 PM"), "4:30 PM to 5:30 PM");
  assert.equal(plainDashes("10:30 AM—11:30 AM"), "10:30 AM to 11:30 AM");
  assert.equal(plainDashes("6:00 – 9:00 PM"), "6:00 to 9:00 PM");
  assert.equal(plainDashes("2024–25"), "2024 to 25");
});

test("asides and separators become commas, and edge dashes are dropped", () => {
  assert.equal(plainDashes("Classes for children — and adults"), "Classes for children, and adults");
  assert.equal(plainDashes("Bharatanatyam—the dance of Tamil Nadu"), "Bharatanatyam, the dance of Tamil Nadu");
  assert.equal(plainDashes("Annual Day – Ravindra Bharathi"), "Annual Day, Ravindra Bharathi");
  assert.equal(plainDashes("— Guru Smt. Nalla Rama Devi"), "Guru Smt. Nalla Rama Devi");
  assert.equal(plainDashes("Telugu–English"), "Telugu-English");
  assert.equal(plainDashes("No dashes here"), "No dashes here");
});

test("nested saved content is cleaned without touching other values", () => {
  const saved = { title: "Annual Day — 2025", published: true, count: 3, sessions: [["Batch 1", "4:30 PM – 5:30 PM", "Kuchipudi"]] };
  assert.deepEqual(withPlainDashes(saved), { title: "Annual Day, 2025", published: true, count: 3, sessions: [["Batch 1", "4:30 PM to 5:30 PM", "Kuchipudi"]] });
});
