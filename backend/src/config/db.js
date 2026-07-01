const mongoose = require('mongoose');
const { mongoUri } = require('./env');

async function connectDB() {
  mongoose.set('strictQuery', true);

  mongoose.connection.on('connected', () =>
    console.log(`[db] connected to database: ${mongoose.connection.name}`)
  );
  mongoose.connection.on('error', (err) =>
    console.error('[db] connection error:', err.message)
  );
  mongoose.connection.on('disconnected', () =>
    console.warn('[db] disconnected')
  );

  await mongoose.connect(mongoUri);
  return mongoose.connection;
}

module.exports = connectDB;
