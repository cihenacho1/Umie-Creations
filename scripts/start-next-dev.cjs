'use strict';

/**
 * Clears stray Next/Node listeners on port 3000 before `next dev`, then starts the dev server.
 * A zombie process holding 3000 is a common cause of Internal Server Error + broken assets.
 */

const killPort = require('kill-port');
const { spawn } = require('child_process');
const path = require('path');

const cwd = path.join(__dirname, '..');
const nextBin = path.join(cwd, 'node_modules/next/dist/bin/next');
const extra = process.argv.slice(2);

killPort(3000)
  .catch(() => {})
  .finally(() => {
    spawn(process.execPath, [nextBin, 'dev', ...extra], {
      cwd,
      stdio: 'inherit',
      env: process.env,
    }).on('exit', (code) => process.exit(typeof code === 'number' ? code : 0));
  });
