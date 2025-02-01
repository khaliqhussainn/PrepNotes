const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

async function generatePrismaClient() {
  try {
    const prismaDir = path.join(__dirname);
    process.chdir(prismaDir);
    
    console.log('🚀 Starting Prisma Client generation...');
    
    if (!fs.existsSync(path.join(prismaDir, 'schema.prisma'))) {
      throw new Error('schema.prisma not found in ' + prismaDir);
    }
    
    const generatedClientPath = path.join(prismaDir, 'generated', 'client');
    if (fs.existsSync(generatedClientPath)) {
      console.log('📦 Cleaning up existing generated client...');
      fs.rmSync(generatedClientPath, { recursive: true, force: true });
    }
    
    console.log('⚙️ Generating Prisma Client...');
    execSync('npx prisma generate', {
      stdio: 'inherit',
      env: {
        ...process.env,
        PRISMA_GENERATE_SKIP_AUTOINSTALL: "true",
        NODE_ENV: process.env.NODE_ENV || 'development'
      }
    });
    
    console.log('✅ Prisma Client has been generated successfully!');
  } catch (error) {
    console.error('❌ Error generating Prisma Client:', error.message);
    process.exit(1);
  }
}

generatePrismaClient();