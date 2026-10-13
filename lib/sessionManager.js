const fs = require("fs");
const path = require("path");

const rootDir = path.join(__dirname, "..");
const sessionDir = path.join(rootDir, "session");

if (!fs.existsSync(sessionDir)) {
  fs.mkdirSync(sessionDir, { recursive: true });
}

const sessions = new Map();

function normalizeNumber(value) {
  if (!value) return "";
  return String(value)
    .replace(/\D/g, "")
    .replace(/^0+/, "");
}

function getSessionPath(number) {
  const safeNumber = normalizeNumber(number) || "default";
  const target = path.join(sessionDir, safeNumber);
  fs.mkdirSync(target, { recursive: true });
  return target;
}

function addSession(number, socket) {
  sessions.set(normalizeNumber(number), socket);
}

function removeSession(number) {
  sessions.delete(normalizeNumber(number));
}

function getSession(number) {
  return sessions.get(normalizeNumber(number));
}

module.exports = {
  normalizeNumber,
  getSessionPath,
  addSession,
  removeSession,
  getSession,
  sessions
};
