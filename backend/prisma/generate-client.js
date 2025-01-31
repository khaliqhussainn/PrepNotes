const { exec } = require('child_process');
const path = require('path');

// Run prisma generate
exec('npx prisma generate', {
  cwd: path.join(__dirname, '../'),
  env: process.env,
}, (error, stdout, stderr) => {
  if (error) {
    console.error(`Error: ${error}`);
    return;
  }
  console.log(`stdout: ${stdout}`);
  if (stderr) console.error(`stderr: ${stderr}`);
});