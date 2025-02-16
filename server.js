const express = require("express");
const app = express();
const path = require("path");

app.use("/public", express.static(path.join(__dirname, "public")));
app.use(express.static("dist"));

app.listen(3000, () => console.log("Server running at http://localhost:3000"));
