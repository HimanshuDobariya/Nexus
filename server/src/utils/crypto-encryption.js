import crypto from "crypto";
import { config } from "../config/env.config.js";

const algorithm = "aes-256-cbc";

const key = crypto.scryptSync(config.crypto_secret_key, "salt", 32);
const iv = Buffer.alloc(16, 0);

export function encrypt(text) {
  if (!text) return;
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");

  return encrypted;
}

export function decrypt(encryptedText) {
  if (!encryptedText) return;
  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  let decrypted = decipher.update(encryptedText, "hex", "utf8");
  decrypted += decipher.final("utf8");

  return decrypted;
}
