"use strict";

const fs = require("node:fs");
const path = require("node:path");
const { describe, it } = require("node:test");
const assert = require("node:assert");

const ROOT = path.resolve(__dirname, "..");
const PUBLIC_DIR = path.join(ROOT, "public");

describe("Assets", () => {
  it("public directory exists", () => {
    assert.ok(fs.existsSync(PUBLIC_DIR), "public/ directory must exist");
  });

  it("style.css exists", () => {
    const p = path.join(PUBLIC_DIR, "style.css");
    assert.ok(fs.existsSync(p), "public/style.css must exist");
  });

  it("script.js exists", () => {
    const p = path.join(PUBLIC_DIR, "script.js");
    assert.ok(fs.existsSync(p), "public/script.js must exist");
  });

  it("favicon.ico exists", () => {
    const p = path.join(PUBLIC_DIR, "favicon.ico");
    assert.ok(fs.existsSync(p), "public/favicon.ico must exist");
  });

  it("template exists and references only existing or external assets", () => {
    const templatePath = path.join(ROOT, "views", "template.ejs");
    assert.ok(fs.existsSync(templatePath), "views/template.ejs must exist");
    const template = fs.readFileSync(templatePath, "utf-8");
    const publicRefs = template.match(/\/public\/([^\s"'>]+)/g) || [];
    for (const ref of publicRefs) {
      const file = ref.replace(/^\/public\//, "").split(/[?#]/)[0];
      const filePath = path.join(PUBLIC_DIR, file);
      assert.ok(fs.existsSync(filePath), `Template references /public/${file} which must exist`);
    }
  });
});
