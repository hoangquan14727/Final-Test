const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const { EJSON } = require('bson');
const { mongoUri } = require('../src/config/env');

const MOCK_DIR = path.join(__dirname, '..', '..', 'mock-data');

const FILES = [
  { collection: 'users', file: 'school.users.json' },
  { collection: 'teacherpositions', file: 'school.teacherpositions.json' },
  { collection: 'teachers', file: 'school.teachers.json' },
];

function loadEjson(file) {
  const full = path.join(MOCK_DIR, file);
  if (!fs.existsSync(full)) {
    throw new Error(
      `Missing mock data file: ${full}\n` +
        `Download the 3 files from github.com/khoatranpc/WEB (branch mock-data-fullstack) into the mock-data/ folder.`
    );
  }
  const text = fs.readFileSync(full, 'utf8');
  const docs = EJSON.parse(text);
  if (!Array.isArray(docs)) {
    throw new Error(`Expected a JSON array in ${file}`);
  }
  return docs;
}

(async () => {
  try {
    await mongoose.connect(mongoUri);
    const db = mongoose.connection.db;
    console.log(`[seed] connected to database: ${mongoose.connection.name}`);

    for (const { collection, file } of FILES) {
      const docs = loadEjson(file);
      const col = db.collection(collection);
      await col.deleteMany({});
      if (docs.length) await col.insertMany(docs, { ordered: false });
      console.log(`[seed] ${collection}: inserted ${docs.length} documents`);
    }

    console.log('[seed] done.');
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('[seed] failed:', err.message);
    await mongoose.disconnect().catch(() => {});
    process.exit(1);
  }
})();
