"use strict";

const themeToggle = document.getElementById("theme-toggle");
const navToggle = document.getElementById("nav-toggle");
const nav = document.getElementById("nav");
const root = document.documentElement;
const header = document.querySelector("header");

// Theme: saved or system preference
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

// Hamburger menu
if (navToggle && nav) {
  navToggle.addEventListener("click", () => {
    const open = header.classList.toggle("nav-open");
    navToggle.setAttribute("aria-expanded", open);
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      header.classList.remove("nav-open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });
}
