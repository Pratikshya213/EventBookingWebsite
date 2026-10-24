import { randomBytes, scrypt, timingSafeEqual } from "node:crypto";

function deriveKey(password: string, salt: string) {
  return new Promise<Buffer>((resolve, reject) => {
    scrypt(password, salt, 64, (error, key) => {
      if (error) reject(error);
      else resolve(key);
    });
  });
}

export async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const key = await deriveKey(password, salt);
  return `${salt}:${key.toString("hex")}`;
}

export async function verifyPassword(password: string, storedHash: string) {
  const [salt, storedKeyHex] = storedHash.split(":");
  if (!salt || !storedKeyHex || !/^[0-9a-f]{128}$/i.test(storedKeyHex)) return false;

  const storedKey = Buffer.from(storedKeyHex, "hex");
  const candidateKey = await deriveKey(password, salt);
  return timingSafeEqual(candidateKey, storedKey);
}
