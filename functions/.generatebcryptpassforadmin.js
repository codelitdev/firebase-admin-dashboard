// An IIFE to output bcrypt hashed code for a string
// =================================================
//
// Usage: ./generatebcryptpassforadmin.js <string_to_be_hashed>

const bcrypt = require("bcryptjs");

(() => {
  const saltRounds = process.argv[2];
  const username = process.argv[3];
  const password = process.argv[4];

  if (username && password) {
    const hash = bcrypt.hashSync(password, parseInt(saltRounds));
    // console.log(hash);
    //
    // console.log("\n!!!Do not forget to export it in Firebase config.!!!");
    // console.log("\n!!!And...do not replace single quotes with double ones!!!");

    console.log(
      `\nPlease run the following (mind the single quotes):\n\nfirebase functions:config:set users.${username}='${hash}'\n`
    );
  } else {
    throw new Error(
      "Provide proper input.\n\nUsage: yarn run passwdgen <username> <password>\n"
    );
  }
})();
