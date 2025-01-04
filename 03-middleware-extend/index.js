import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { PORT } from "../config.js";

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Модифікуємо middleware, щоб він логував інформацію про відповідь
app.use((req, res, next) => {
  const filePath = path.join(__dirname, "logs.txt");
  const requestLog = `Request: ${new Date().toISOString()} ${req.ip}, ${
    req.method
  } - ${req.url}\n`;

  fs.appendFile(filePath, requestLog, (err) => {
    if (err) {
      console.error("Error writing to log file", err);
    }
  });

  // Збережемо оригінальний метод res.end
  const originalEnd = res.end;

  // Перевизначимо метод res.end
  res.end = function (...args) {
    const responseLog = `Response: ${res.statusCode} - ${
      res.statusMessage || "OK"
    }\n`;

    fs.appendFile(filePath, responseLog, (err) => {
      if (err) {
        console.error("Error writing to log file", err);
      }
    });

    // Викликаємо оригінальний метод res.end
    originalEnd.apply(res, args);
  };

  next();
});

app.get("/", (req, res) => {
  res.send("Hello Express!");
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
