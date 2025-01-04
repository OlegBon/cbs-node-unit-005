import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { PORT } from "../config.js";

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use((req, res, next) => {
  const filePath = path.join(__dirname, "logs.txt");
  const log = `${new Date().toISOString()} ${req.ip}, ${req.method} - ${
    req.url
  }\n`;

  fs.appendFile(filePath, log, (err) => {
    if (err) {
      console.error("Error writing to log file", err);
    }
  });

  next();
});

app.get("/", (req, res) => {
  res.send("Hello Express!");
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
