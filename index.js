const { handleTasks } = require('./src/tasks');
const { handleAutomate } = require('./src/autorun');
const { displayHeader } = require('./src/display');
const readlineSync = require('readline-sync');
const fs = require('fs');

const BEARERS = JSON.parse(fs.readFileSync('bearers.json', 'utf-8'));

const runBot = async () => {
    displayHeader();

    const option = readlineSync.question(
      'Choose the script to run:\n1. Default by HappyCuanAirdrop\n2. Autorun by NoDrops\nEnter 1 or 2: '
    );
  
    if (option === '1') {
      await handleTasks(BEARERS);
    } else if (option === '2') {
        await handleAutomate(BEARERS);
    } else {
      console.log('Invalid option selected! Please restart.'.red);
      process.exit(1);
    }
  };
  
  runBot();