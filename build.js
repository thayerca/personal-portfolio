const fs = require("fs-extra");
const path = require("path");
const matter = require("gray-matter");
const marked = require("marked");
const ejs = require("ejs");

// Define paths
const CONTENT_DIR = path.join(__dirname, "content");
const TEMPLATE_PATH = path.join(__dirname, "views", "template.ejs");
const DIST_DIR = path.join(__dirname, "dist");

// Ensure the output directory exists
fs.ensureDirSync(DIST_DIR);

// Load HTML template
const template = fs.readFileSync(TEMPLATE_PATH, "utf-8");

// Read all Markdown files
fs.readdirSync(CONTENT_DIR).forEach((file) => {
  if (path.extname(file) === ".md") {
    const filePath = path.join(CONTENT_DIR, file);
    const fileContent = fs.readFileSync(filePath, "utf-8");
    const { data, content } = matter(fileContent);
    const htmlContent = marked.parse(content); // Convert Markdown to HTML

    // Render EJS template with Markdown content
    ejs.renderFile(
      TEMPLATE_PATH,
      { title: data.title, content: htmlContent },
      (err, html) => {
        if (err) throw err;
        const outputFilePath = path.join(
          DIST_DIR,
          file.replace(".md", ".html"),
        );
        fs.writeFileSync(outputFilePath, html);
        console.log(`Generated: ${outputFilePath}`);
      },
    );
  }
});

console.log("Build complete!");
