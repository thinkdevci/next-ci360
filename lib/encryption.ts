import { createCipheriv, createDecipheriv, randomBytes } from "crypto"

const ALGORITHM = "aes-256-gcm"

// Checked on use, not at import: the build must not need runtime secrets.
function getKey(): Buffer {
  const encryptionKey = process.env.ENCRYPTION_KEY
  if (!encryptionKey) {
    throw new Error("ENCRYPTION_KEY is required")
  }
  const key = Buffer.from(encryptionKey, "base64")
  if (key.length !== 32) {
    throw new Error("ENCRYPTION_KEY must be 32 bytes long")
  }
  return key
}

export function encryptKey(plaintext: string): {
  encrypted: string
  iv: string
} {
  const iv = randomBytes(16)
  const cipher = createCipheriv(ALGORITHM, getKey(), iv)

  let encrypted = cipher.update(plaintext, "utf8", "hex")
  encrypted += cipher.final("hex")

  const authTag = cipher.getAuthTag()
  const encryptedWithTag = encrypted + ":" + authTag.toString("hex")

  return {
    encrypted: encryptedWithTag,
    iv: iv.toString("hex"),
  }
}

export function decryptKey(encryptedData: string, ivHex: string): string {
  const [encrypted, authTagHex] = encryptedData.split(":")
  const iv = Buffer.from(ivHex, "hex")
  const authTag = Buffer.from(authTagHex, "hex")

  const decipher = createDecipheriv(ALGORITHM, getKey(), iv)
  decipher.setAuthTag(authTag)

  let decrypted = decipher.update(encrypted, "hex", "utf8")
  decrypted += decipher.final("utf8")

  return decrypted
}

export function maskKey(key: string): string {
  if (key.length <= 8) {
    return "*".repeat(key.length)
  }
  return key.slice(0, 4) + "*".repeat(key.length - 8) + key.slice(-4)
}
