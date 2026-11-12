require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const mongoose = require('mongoose');

const baseUri = process.env.MONGODB_URI;

async function tryConnect(label, testUri) {
  const sanitized = testUri.replace(/:([^:@]+)@/, ':****@');
  console.log(`\n--- Attempting [${label}] ---`);
  console.log('URI:', sanitized);
  try {
    const conn = await mongoose.connect(testUri, { serverSelectionTimeoutMS: 8000 });
    console.log(`>>> SUCCESS with [${label}]!`);
    console.log('Host:', conn.connection.host);
    console.log('Database Name:', conn.connection.name);
    
    // Verify collections in 'fittrack'
    const collections = await conn.connection.db.listCollections().toArray();
    console.log('Collections in fittrack:', collections.map(c => c.name));

    await mongoose.disconnect();
    return true;
  } catch (err) {
    console.log(`Failed [${label}]:`, err.message);
    try { await mongoose.disconnect(); } catch(e) {}
    return false;
  }
}

async function run() {
  // Test 1: with authSource=admin
  let uriWithAdmin = baseUri;
  if (!uriWithAdmin.includes('authSource=')) {
    uriWithAdmin += (uriWithAdmin.includes('?') ? '&' : '?') + 'authSource=admin';
  }
  const ok1 = await tryConnect('authSource=admin', uriWithAdmin);
  if (ok1) return;

  // Test 2: lowercase username 'fittrack' with authSource=admin
  const uriLowerUser = uriWithAdmin.replace('//fitTrack:', '//fittrack:');
  const ok2 = await tryConnect('username=fittrack (lowercase) with authSource=admin', uriLowerUser);
  if (ok2) return;

  // Test 3: lowercase username 'fittrack' without authSource
  const ok3 = await tryConnect('username=fittrack (lowercase) original', baseUri.replace('//fitTrack:', '//fittrack:'));
  if (ok3) return;

  console.log('\nAll auth variants attempted.');
}

run();
