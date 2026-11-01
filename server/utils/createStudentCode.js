const crypto = require('crypto');

function createStudentCode() {
  const suffix = crypto.randomBytes(3).toString('hex').toUpperCase();
  return `BN-${Date.now().toString().slice(-6)}-${suffix}`;
}

module.exports = createStudentCode;
