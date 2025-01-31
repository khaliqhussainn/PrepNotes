const { execSync } = require('child_process');
const path = require('path');

try {
  // Change directory to where schema.prisma is located
  process.chdir(path.join(__dirname));
  
  console.log('Running Prisma Generate...');
  
  // Run prisma generate using node_modules path
  execSync('cd .. && npx prisma generate', {
    stdio: 'inherit',
    env: {
      ...process.env,
      PRISMA_GENERATE_SKIP_AUTOINSTALL: "true"
    }
  });
  
  console.log('Prisma Client has been generated successfully.');
} catch (error) {
  console.error('Error generating Prisma Client:', error);
  process.exit(1);
}