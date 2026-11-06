import assert from "node:assert/strict";
import test from "node:test";
import { classOptions, enquiryDraft } from "../app/class-options.ts";

const program = { name: "Kuchipudi" };
const schedules = [
  { id: "shared", days: "Saturday · Tuesday", sessions: [["Batch 1", "6:30 PM", "Kuchipudi"], ["Own Practice", "After class", "Kuchipudi"], ["Batch 2", "5:30 PM", "Bharatanatyam"]] },
  { id: "sunday", days: "Sunday", sessions: [["Batch 3", "9:30 AM", " kuchipudi "]] },
];
test("class choices preserve program and day, exclude independent practice, and use stable session IDs", () => {
  assert.deepEqual(classOptions(program, schedules, "Tuesday"), [{ id: "shared-0", days: "Saturday · Tuesday", level: "Batch 1", time: "6:30 PM" }]);
  assert.equal(classOptions(program, schedules).length, 2);
  assert.deepEqual(classOptions(program, schedules, "Monday"), []);
  assert.deepEqual(classOptions(undefined, schedules), []);
});
test("enquiry draft safely encodes user text and carries the actual selected class", () => {
  const details = { name: "A & B", phone: "+91 123", program: "Kuchipudi", experience: "Beginner", slot: "Tuesday · 6:30 PM", message: "Can I visit? &bcc=someone@example.com\nThank you" };
  const draft = new URL(enquiryDraft("academy@example.com", details));
  assert.equal(draft.searchParams.get("bcc"), null);
  assert.match(draft.searchParams.get("body"), /Tuesday · 6:30 PM/);
  assert.match(draft.searchParams.get("body"), /A & B/);
  assert.match(enquiryDraft("academy@example.com", { ...details, slot: "" }), /Please%20help%20me%20choose/);
});
