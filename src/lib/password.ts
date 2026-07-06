import bcrypt from "bcryptjs";

/**
 * Hashes a plaintext password using bcryptjs.
 * @param password The plaintext password.
 * @returns The hashed password string.
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(12);
  return bcrypt.hash(password, salt);
}

/**
 * Compares a plaintext password against a stored bcrypt hash.
 * @param password The plaintext password.
 * @param hash The stored password hash.
 * @returns True if they match, false otherwise.
 */
export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}
