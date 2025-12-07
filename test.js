import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

// ---- AYAR ----
const TEXT_TO_HASH = "pw1234"; // Buraya hashlemek istediğin metni yaz
const SALT_ROUNDS = 10;
// ---------------

async function run() {
  const pepper = process.env.PEPPER;
  const combined = TEXT_TO_HASH + pepper;

  const salt = await bcrypt.genSalt(SALT_ROUNDS);
  const hash = await bcrypt.hash(combined, salt);

  console.log("Orijinal Metin:", TEXT_TO_HASH);
  console.log("Üretilen Hash :", hash);
}

run();
