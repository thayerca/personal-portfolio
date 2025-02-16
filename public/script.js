const themeToggle = document.getElementById("theme-toggle");
const root = document.documentElement;

// Check saved theme or system preference
const currentTheme =
  localStorage.getItem("theme") ||
  (window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "mocha"
    : "latte");
root.setAttribute("data-theme", currentTheme);
themeToggle.innerText = currentTheme === "mocha" ? "☀️" : "🌙";

themeToggle.addEventListener("click", () => {
  const newTheme =
    root.getAttribute("data-theme") === "mocha" ? "latte" : "mocha";
  root.setAttribute("data-theme", newTheme);
  localStorage.setItem("theme", newTheme);
  themeToggle.innerText = newTheme === "mocha" ? "☀️" : "🌙";
});
