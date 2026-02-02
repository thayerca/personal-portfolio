"use strict";

const { execSync } = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");
const { describe, it } = require("node:test");
const assert = require("node:assert");

const ROOT = path.resolve(__dirname, "..");
const DIST_DIR = path.join(ROOT, "dist");

describe("Build", () => {
  it("runs without error", () => {
    assert.doesNotThrow(() => {
      execSync("node build.js", { cwd: ROOT, stdio: "pipe" });
    });
  });

  it("produces dist directory", () => {
    assert.ok(fs.existsSync(DIST_DIR), "dist/ must exist after build");
  });

  it("generates HTML for every markdown file in content/", () => {
    const contentDir = path.join(ROOT, "content");
    const mdFiles = fs.readdirSync(contentDir).filter((f) => f.endsWith(".md"));
    assert.ok(mdFiles.length > 0, "At least one .md file must exist in content/");

    for (const file of mdFiles) {
      const htmlFile = file.replace(/\.md$/, ".html");
      const htmlPath = path.join(DIST_DIR, htmlFile);
      assert.ok(fs.existsSync(htmlPath), `dist/${htmlFile} must exist for content/${file}`);
    }
  });

  it("output HTML is non-empty and has DOCTYPE", () => {
    const indexPath = path.join(DIST_DIR, "index.html");
    assert.ok(fs.existsSync(indexPath), "dist/index.html must exist");
    const html = fs.readFileSync(indexPath, "utf-8");
    assert.ok(html.length > 0, "index.html must not be empty");
    assert.ok(
      /<!DOCTYPE\s+html/i.test(html),
      "index.html must start with <!DOCTYPE html>"
    );
  });
});
