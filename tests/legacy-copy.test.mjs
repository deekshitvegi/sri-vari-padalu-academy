import assert from "node:assert/strict";
import test from "node:test";
import { defaultSiteContent } from "../app/data.ts";
import { upgradeDefaultCopy } from "../app/legacy-copy.ts";

function savedWithOldDefaults() {
  const saved = structuredClone(defaultSiteContent);
  saved.academy.tagline = "Grace. Rhythm. Devotion.";
  saved.home.heroTitle = "A school for";
  saved.pageHeroes.about.title = "Tradition is a living language.";
  saved.programs.find((program) => program.id === "kuchipudi").eyebrow = "Drama · Fluidity · Story";
  saved.navigation.find((item) => item.id === "nav-testimonials").label = "Stories";
  return saved;
}

test("text still matching an old default is upgraded to the current default", () => {
  const upgraded = upgradeDefaultCopy(savedWithOldDefaults(), defaultSiteContent);
  assert.equal(upgraded.academy.tagline, defaultSiteContent.academy.tagline);
  assert.equal(upgraded.home.heroTitle, defaultSiteContent.home.heroTitle);
  assert.equal(upgraded.pageHeroes.about.title, "About the academy");
  assert.equal(upgraded.programs.find((program) => program.id === "kuchipudi").eyebrow, "Classical dance-drama from Andhra Pradesh");
  assert.equal(upgraded.navigation.find((item) => item.id === "nav-testimonials").label, "How we teach");
});

test("the owner's own wording, images and missing items are left alone", () => {
  const saved = savedWithOldDefaults();
  saved.home.heroCopy = "Our own introduction.";
  saved.home.archiveImage = "/media/owner-upload";
  saved.programs = saved.programs.filter((program) => program.id !== "sangeetham");
  const upgraded = upgradeDefaultCopy(saved, defaultSiteContent);
  assert.equal(upgraded.home.heroCopy, "Our own introduction.");
  assert.equal(upgraded.home.archiveImage, "/media/owner-upload");
  assert.equal(upgraded.programs.length, 2);
  assert.equal(saved.academy.tagline, "Grace. Rhythm. Devotion.", "input is not mutated");
});
