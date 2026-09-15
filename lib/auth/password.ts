import {
  pbkdf2,
  randomBytes,
  timingSafeEqual,
} from "node:crypto";

const ITERATIONS = 120_000;
const KEY_LENGTH = 64;
const DIGEST = "sha512";

function pbkdf2Async(
  password: string,
  salt: Buffer,
  iterations: number,
  keyLength: number
): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    pbkdf2(
      password,
      salt,
      iterations,
      keyLength,
      DIGEST,
      (error, derivedKey) => {
        if (error) {
          reject(error);
          return;
        }

        resolve(derivedKey);
      }
    );
  });
}

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(32);

  const derivedKey = await pbkdf2Async(
    password,
    salt,
    ITERATIONS,
    KEY_LENGTH
  );

  return [
    "pbkdf2",
    DIGEST,
    ITERATIONS,
    salt.toString("hex"),
    derivedKey.toString("hex"),
  ].join("$");
}

export async function verifyPassword(
  password: string,
  storedHash: string
): Promise<boolean> {
  try {
    const parts = storedHash.split("$");

    if (parts.length !== 5) {
      return false;
    }

    const [algorithm, digest, iterationsText, saltHex, hashHex] = parts;

    if (algorithm !== "pbkdf2" || digest !== DIGEST) {
      return false;
    }

    const iterations = Number(iterationsText);

    if (!Number.isFinite(iterations) || iterations <= 0) {
      return false;
    }

    const salt = Buffer.from(saltHex, "hex");
    const expectedHash = Buffer.from(hashHex, "hex");

    const actualHash = await pbkdf2Async(
      password,
      salt,
      iterations,
      expectedHash.length
    );

    if (actualHash.length !== expectedHash.length) {
      return false;
    }

    return timingSafeEqual(actualHash, expectedHash);
  } catch {
    return false;
  }
}