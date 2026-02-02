"use strict";

const fs = require("node:fs");
const path = require("node:path");
const { describe, it } = require("node:test");
const assert = require("node:assert");

const ROOT = path.resolve(__dirname, "..");
const CONTENT_DIR = path.join(ROOT, "content");

function getMarkdownFiles() {
  if (!fs.existsSync(CONTENT_DIR)) {
    return [];
  }
  return fs.readdirSync(CONTENT_DIR).filter((f) => f.endsWith(".md"));
}

function parseFrontmatter(filePath) {
  const content = fs.readFileSync(filePath, "utf-8");
  const match = content.match(/^---\s*\n([\s\S]*?)\n---/);
  if (!match) return null;
  const block = match[1];
  const data = {};
  for (const line of block.split("\n")) {
    const colon = line.indexOf(":");
    if (colon === -1) continue;
    const key = line.slice(0, colon).trim();
    let value = line.slice(colon + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    data[key] = value;
  }
  return data;
}

describe("Content", () => {
  it("content directory exists", () => {
    assert.ok(fs.existsSync(CONTENT_DIR), "content/ directory must exist");
  });

  it("at least one markdown file exists", () => {
    const files = getMarkdownFiles();
    assert.ok(files.length > 0, "At least one .md file must exist in content/");
  });

  describe("Frontmatter", () => {
    const files = getMarkdownFiles();
    for (const file of files) {
      const filePath = path.join(CONTENT_DIR, file);
      describe(file, () => {
        it("has frontmatter block", () => {
          const content = fs.readFileSync(filePath, "utf-8");
          assert.ok(/^---\s*\n/.test(content), `${file} must start with --- frontmatter`);
          const close = content.indexOf("\n---", 4);
          assert.ok(close !== -1, `${file} must have closing --- for frontmatter`);
        });

        it("has required title", () => {
          const data = parseFrontmatter(filePath);
          assert.ok(data, "Frontmatter must be parseable");
          assert.ok("title" in data, `${file} frontmatter must have "title"`);
          assert.ok(
            String(data.title).trim().length > 0,
            `${file} title must be non-empty`
          );
        });

        it("has required description", () => {
          const data = parseFrontmatter(filePath);
          assert.ok(data, "Frontmatter must be parseable");
          assert.ok("description" in data, `${file} frontmatter must have "description"`);
          assert.ok(
            String(data.description).trim().length > 0,
            `${file} description must be non-empty`
          );
        });
      });
    }
  });

  it("internal anchor ids are kebab-case or allowed format", () => {
    for (const file of getMarkdownFiles()) {
      const filePath = path.join(CONTENT_DIR, file);
      const content = fs.readFileSync(filePath, "utf-8");
      const idMatches = content.matchAll(/id="([^"]+)"/g);
      for (const m of idMatches) {
        const id = m[1];
        assert.ok(
          /^[a-z0-9-]+$/.test(id),
          `id="${id}" in ${file} must be kebab-case (lowercase, hyphens only)`
        );
      }
    }
  });
});
