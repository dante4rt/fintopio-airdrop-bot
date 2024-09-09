require('colors');
const readlineSync = require('readline-sync');
const Table = require('cli-table3');

function displayHeader() {
  process.stdout.write('\x1Bc');
  console.log('========================================'.cyan);
  console.log('=       🚀 Fintopio Airdrop Bot 🚀     ='.cyan);
  console.log('=     Created by HappyCuanAirdrop      ='.cyan);
  console.log('=    https://t.me/HappyCuanAirdrop     ='.cyan);
  console.log('========================================'.cyan);
  console.log();
}

function displayOptions() {
  return readlineSync.question(
    '\nChoose an option:\n1. 🚀 Auto complete all tasks\n2. 🪐 Auto click asteroid\n3. 📅 Auto daily check-in\n4. 🌱 Auto farming\n5. ❌ Exit\n\nEnter 1, 2, 3, 4, or 5: '
  );
}

async function createTable(BEARERS, fetchReferralData) {
  const table = new Table({
    head: ['Number', 'Balance', 'Referral(s)', 'Level', 'Rank'],
    colWidths: [10, 15, 15, 10, 10],
  });

  let counter = 1;

  for (const BEARER of BEARERS) {
    const user = await fetchReferralData(BEARER);
    table.push([
      counter,
      user.balance,
      `${user.activations.used}/${user.activations.total}`,
      user.level.name,
      user.leaderboard.position,
    ]);
    counter++;
  }

  return table.toString();
}

module.exports = {
  displayHeader,
  displayOptions,
  createTable,
};
