import bcrypt from "bcryptjs";

const password = process.argv[2];
if (!password) {
  console.error("Uso: npx tsx scripts/hash-password.ts \"tu-contraseña\"");
  process.exit(1);
}

bcrypt.hash(password, 12).then((hash) => {
  // Next.js expands unescaped $NAME in .env files as a variable reference,
  // which mangles bcrypt hashes (they're full of $2b$, $12$, etc). Escaping
  // every $ here means what you paste just works.
  const escaped = hash.replaceAll("$", "\\$");
  console.log("\nCopia esto en .env como ADMIN_PASSWORD_HASH:\n");
  console.log(escaped);
  console.log();
});
