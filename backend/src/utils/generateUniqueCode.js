const Teacher = require('../models/teacher.model');
const ApiError = require('./ApiError');

function randomTenDigits() {
  let s = '';
  for (let i = 0; i < 10; i++) s += Math.floor(Math.random() * 10);
  return s;
}

async function generateUniqueCode({ session = null, maxRetries = 10 } = {}) {
  for (let i = 0; i < maxRetries; i++) {
    const code = randomTenDigits();
    const exists = await Teacher.exists({ code }).session(session);
    if (!exists) return code;
  }
  throw new ApiError(500, 'Could not generate a unique teacher code, please retry.');
}

module.exports = generateUniqueCode;
