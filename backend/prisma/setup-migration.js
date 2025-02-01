const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

async function setupMigration() {
  try {
    console.log('🚀 Starting migration setup...');
    
    const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, 14);
    const migrationName = `${timestamp}_initial`;
    const migrationsDir = path.join(__dirname, 'migrations', migrationName);

    console.log('📝 Creating initial migration...');
    const migrationSQL = execSync(
      'npx prisma migrate diff --from-empty --to-schema=./schema.prisma --script',
      { encoding: 'utf8' }
    );

    console.log('📁 Creating migrations directory...');
    fs.mkdirSync(migrationsDir, { recursive: true });

    console.log('💾 Writing migration file...');
    fs.writeFileSync(
      path.join(migrationsDir, 'migration.sql'),
      migrationSQL
    );

    console.log('⚙️ Creating migration.toml...');
    fs.writeFileSync(
      path.join(migrationsDir, 'migration.toml'),
      '[migration]\nname = "initial"\n'
    );

    console.log('🔄 Resetting migration state...');
    execSync('npx prisma migrate reset --force', { stdio: 'inherit' });

    console.log('✨ Applying migration...');
    execSync('npx prisma migrate deploy', { stdio: 'inherit' });

    console.log('✅ Migration setup completed successfully!');
  } catch (error) {
    console.error('❌ Error during migration setup:', error.message);
    process.exit(1);
  }
}

setupMigration();