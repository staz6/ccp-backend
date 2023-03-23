const crypto = require('crypto');

const generatePassword = () => {
  const length = 12; // The length of the password
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'; // The character set to use for the password
  let password = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = crypto.randomInt(0, chars.length); // Generate a random index into the character set
    password += chars.charAt(randomIndex); // Add the character at the random index to the password
  }
  return password;
};

module.exports = {
  generatePassword
}