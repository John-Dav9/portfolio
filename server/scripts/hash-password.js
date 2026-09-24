// Usage: npm run hash-password -- "mon mot de passe"  → value for ADMIN_PASSWORD_HASH
import { hashPassword } from "../src/password.js";

const password = process.argv[2];
if (!password || password.length < 12) {
  console.error("Usage: npm run hash-password -- \"mot de passe d'au moins 12 caractères\"");
  process.exit(1);
}
console.log(await hashPassword(password));
