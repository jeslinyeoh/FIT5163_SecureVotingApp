const bcrypt = require('bcrypt');
const saltRounds = 10;

// Generate a fixed salt
bcrypt.genSalt(saltRounds, (err, salt) => {
    if (err) throw err;
    console.log("Generated Salt:", salt);
});