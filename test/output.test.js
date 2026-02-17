"use strict";

const fs = require("node:fs");
const path = require("node:path");
const { describe, it } = require("node:test");
const assert = require("node:assert");

const ROOT = path.resolve(__dirname, "..");
const DIST_DIR = path.join(ROOT, "dist");
const indexPath = path.join(DIST_DIR, "index.html");

// Lazy-load cheerio so tests fail fast if build failed
function loadCheerio() {
  try {
    return require("cheerio");
  } catch {
    throw new Error("cheerio required for output tests; run npm install");
  }
}

describe("Output HTML structure", () => {
  let $;

  it("loads dist/index.html", () => {
    assert.ok(fs.existsSync(indexPath), "dist/index.html must exist (run build first)");
    const html = fs.readFileSync(indexPath, "utf-8");
    const cheerio = loadCheerio();
    $ = cheerio.load(html);
  });

  it("has exactly one <html> with lang attribute", () => {
    const htmlEl = $("html");
    assert.strictEqual(htmlEl.length, 1, "Must have exactly one <html>");
    assert.ok(htmlEl.attr("lang"), "<html> must have lang attribute");
  });

  it("has a non-empty <title>", () => {
    const title = $("head title").text().trim();
    assert.ok(title.length > 0, "<title> must be non-empty");
  });

  it("has viewport meta tag", () => {
    const viewport = $('meta[name="viewport"]');
    assert.strictEqual(viewport.length, 1, "Must have exactly one viewport meta tag");
  });

  it("has exactly one <header>", () => {
    assert.strictEqual($("header").length, 1, "Must have exactly one <header>");
  });

  it("has exactly one <main>", () => {
    assert.strictEqual($("main").length, 1, "Must have exactly one <main>");
  });

  it("has exactly one <footer>", () => {
    assert.strictEqual($("footer").length, 1, "Must have exactly one <footer>");
  });

  it("has nav with required links", () => {
    const nav = $("header nav");
    assert.strictEqual(nav.length, 1, "Must have nav inside header");
    const requiredHrefs = [
      "#work-experience",
      "#community-impact",
      "#professional-contributions",
      "#contact",
    ];
    for (const href of requiredHrefs) {
      const link = nav.find(`a[href="${href}"]`);
      assert.strictEqual(link.length, 1, `Nav must contain exactly one link to ${href}`);
    }
  });

  it("every nav anchor has a matching id in the document", () => {
    const navLinks = $("header nav a[href^='#']");
    navLinks.each((_, el) => {
      const href = $(el).attr("href");
      const id = href.replace(/^#/, "");
      assert.ok(id.length > 0, `Nav link href must be #id, got ${href}`);
      const target = $(`#${id}`).length;
      assert.ok(target >= 1, `No element with id="${id}" found for nav link ${href}`);
    });
  });

  it("references stylesheet that exists in public/", () => {
    const link = $('link[rel="stylesheet"]').filter((_, el) => {
      const h = $(el).attr("href") || "";
      return h.includes("style.css") || h.endsWith("/style.css");
    });
    assert.ok(link.length >= 1, "Must reference a stylesheet (e.g. style.css)");
    const publicPath = path.join(ROOT, "public", "style.css");
    assert.ok(fs.existsSync(publicPath), "public/style.css must exist");
  });

  it("references script that exists in public/", () => {
    const script = $('script[src]').filter((_, el) => {
      const s = $(el).attr("src") || "";
      return s.includes("script.js") || s.endsWith("/script.js");
    });
    assert.ok(script.length >= 1, "Must reference script.js");
    const publicPath = path.join(ROOT, "public", "script.js");
    assert.ok(fs.existsSync(publicPath), "public/script.js must exist");
  });

  it("theme toggle button exists", () => {
    const btn = $("#theme-toggle");
    assert.strictEqual(btn.length, 1, "Must have #theme-toggle button");
  });

  it("external links use https", () => {
    const externalLinks = $('a[href^="http:"]');
    const httpLinks = [];
    externalLinks.each((_, el) => httpLinks.push($(el).attr("href")));
    assert.deepStrictEqual(
      httpLinks,
      [],
      "All external links must use https: (found: " + httpLinks.join(", ") + ")"
    );
  });

  it("has three-column layout for What I Do section", () => {
    const threeCols = $(".three-columns");
    assert.strictEqual(threeCols.length, 1, "Must have .three-columns container");
    const cards = threeCols.find(".column-card");
    assert.strictEqual(cards.length, 3, "Must have three column cards");
  });

  it("has contributions grid with thumbnails", () => {
    const grid = $(".contributions-grid");
    assert.strictEqual(grid.length, 1, "Must have .contributions-grid");
    const cards = grid.find(".contrib-card");
    assert.ok(cards.length >= 1, "Must have at least one contribution card");
    const thumbs = grid.find(".contrib-thumb");
    assert.strictEqual(thumbs.length, cards.length, "Each card must have a thumbnail");
  });
});
