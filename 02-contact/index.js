// Працює у браузері. У Postman потрібно через додавання
// name, email та message у x-www-form-urlencoded у вкладці Body
import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { PORT } from "../config.js";

const app = express();

// Отримання шляху до поточного файлу та теки
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Middleware для обробки даних форми
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Маршрут для сторінки форми
app.get("/contact", (req, res) => {
  // Відправлення форми
  res.send(`
    <form action="/contact" method="POST">
      <label for="name">Name:</label>
      <input type="text" id="name" name="name" required>
      <br>
      <label for="email">Email:</label>
      <input type="email" id="email" name="email" required>
      <br>
      <label for="message">Message:</label>
      <textarea id="message" name="message" required></textarea>
      <br>
      <button type="submit">Send</button>
    </form>
  `);
});

// Маршрут для обробки даних форми
app.post("/contact", (req, res) => {
  const { name, email, message } = req.body;
  const filePath = path.join(__dirname, "contacts.txt");
  const log = `${new Date().toISOString()} Name: ${name}, Email: ${email}, Message: ${message}\n`;

  // Запис даних у файл
  fs.appendFile(filePath, log, (err) => {
    if (err) {
      console.error("Error writing to file", err);
      res.status(500).send("Internal Server Error");
    } else {
      res.send("Thank you for your message!");
    }
  });
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`Contact me at http://localhost:${PORT}/contact`);
});
