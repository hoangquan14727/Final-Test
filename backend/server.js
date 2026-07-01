const app = require('./src/app');
const connectDB = require('./src/config/db');
const { port } = require('./src/config/env');

(async () => {
  try {
    await connectDB();
    app.listen(port, () =>
      console.log(`[server] listening on http://localhost:${port}`)
    );
  } catch (err) {
    console.error('[server] failed to start:', err);
    process.exit(1);
  }
})();
