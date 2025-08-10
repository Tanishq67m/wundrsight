const bcrypt = require("bcryptjs");

async function generateHash() {
  const password = "Passw0rd!";  // your desired new password
  const hash = await bcrypt.hash(password, 10);
  console.log("Hashed password:", hash);
}

generateHash();
