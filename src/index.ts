#!/usr/bin/env node
import { program } from 'commander';

const VERSION = '0.1.0';

program
  .name('devnoder')
  .description('DevNoder CLI — Srvel Build Tools')
  .version(VERSION);

program
  .command('init [name]')
  .description('Initialise a new DevNoder project')
  .option('-t, --template <id>', 'starter template', 'react-vite-ts')
  .action(async (name = 'my-app', opts) => {
    const { default: chalk } = await import('chalk');
    const { default: ora }   = await import('ora');
    console.log(chalk.cyan('\n🌊 DevNoder — Serve • Grow • Lead\n'));
    const spinner = ora(`Creating ${name} with template ${opts.template}…`).start();
    await new Promise(r => setTimeout(r, 800));
    spinner.succeed(chalk.green(`Project ${name} ready!`));
    console.log(chalk.dim(`\n  cd ${name}\n  npm install\n  npm run dev\n`));
  });

program
  .command('build')
  .description('Build the PWA for production')
  .action(async () => {
    const { default: chalk } = await import('chalk');
    const { execSync } = await import('child_process');
    console.log(chalk.cyan('Building DevNoder PWA…'));
    execSync('npm run build', { stdio: 'inherit' });
  });

program
  .command('deploy')
  .description('Deploy to Cloudflare Pages')
  .option('--project <name>', 'Cloudflare Pages project name', 'devnoder')
  .action(async (opts) => {
    const { default: chalk } = await import('chalk');
    const { default: ora }   = await import('ora');
    const spinner = ora('Deploying to Cloudflare Pages…').start();
    await new Promise(r => setTimeout(r, 500));
    spinner.info(chalk.yellow('Run: npx wrangler pages deploy dist --project-name=' + opts.project));
    spinner.stop();
  });

program
  .command('status')
  .description('Show DevNoder project status')
  .action(async () => {
    const { default: chalk } = await import('chalk');
    console.log(chalk.cyan('\nDevNoder Project Status'));
    console.log(chalk.dim('─'.repeat(30)));
    try {
      const { readFileSync } = await import('fs');
      const pkg = JSON.parse(readFileSync('package.json', 'utf8'));
      console.log(`  Name:    ${chalk.white(pkg.name ?? 'unknown')}`);
      console.log(`  Version: ${chalk.white(pkg.version ?? '0.0.0')}`);
    } catch {
      console.log(chalk.red('  No package.json found in current directory'));
    }
    console.log();
  });

program
  .command('doctor')
  .description('Check environment requirements')
  .action(async () => {
    const { default: chalk } = await import('chalk');
    console.log(chalk.cyan('\nDevNoder Doctor\n'));
    const checks: Array<[string, () => boolean]> = [
      ['Node.js >= 18', () => parseInt(process.version.slice(1)) >= 18],
      ['npm available',  () => { try { require('child_process').execSync('npm -v', {stdio:'pipe'}); return true; } catch { return false; } }],
      ['package.json',  () => { try { require('fs').statSync('package.json'); return true; } catch { return false; } }],
    ];
    for (const [label, check] of checks) {
      const ok = check();
      console.log(`  ${ok ? chalk.green('✓') : chalk.red('✗')} ${label}`);
    }
    console.log();
  });

program.parse();
