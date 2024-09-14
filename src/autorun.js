const cron = require('node-cron');
const { fetchReferralData } = require('./api');
const {
  fetchTasks,
  startTask,
  claimTask,
  dailyCheckin,
  claimFarming,
  startFarming,
  fetchDiamond,
  claimDiamond,
} = require('./api');
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const moment = require('moment');
const { createTable } = require('./display');

async function handleAutomate(BEARERS) {
  console.log('');
  console.log(`Fetching data, please wait...\n`.yellow);

  const currentTime = new Date();
  console.log(`Current time: ${currentTime.toLocaleTimeString('en-GB')}`);

  const table = await createTable(BEARERS, fetchReferralData);
  console.log(table);
  console.log('');

  console.log('Running bot for the first time...\n'.cyan);
  await runCheckin(BEARERS);
  await runFarm(BEARERS);
  await runMine(BEARERS);
  await runTasks(BEARERS);
  console.log('Completed ✓\n'.green);

  cron.schedule('0 0-23 * * *', () => {
    const currentTime = new Date();
    console.log(`Fetching data, please wait...`.yellow);
    console.log('')
    console.log(`Current time: ${currentTime.toLocaleTimeString('en-GB')}`);
    createTable(BEARERS, fetchReferralData);
    console.log('')
  });

  cron.schedule('1 7 * * *', () => {
      console.log('Running Checkin and Task'.cyan);
      runCheckin(BEARERS);
  });

  cron.schedule('3 7,15,23 * * *', () => {
      console.log(`Running Farm`.cyan);
      runFarm(BEARERS);
  });

  cron.schedule('5 0-23 * * *', () => {
      console.log(`Running Mine`.cyan);
      runMine(BEARERS);
  });

  cron.schedule('10 7 * * 1,3,5', () => {
      console.log(`Running Mine`.cyan);
      runTasks(BEARERS);
  });
  
  console.log('Tasks scheduled. The bot will run automatically.'.green);
  console.log('Subscribe: https://t.me/NoDrops ☂\n'.green);
}

async function runCheckin(BEARERS) {
  for (const [index, BEARER] of BEARERS.entries()) {
    console.log(`Account ${index + 1}:`);

    const checkinData = await dailyCheckin(BEARER);

    if (checkinData.claimed) {
      console.log(`Daily check-in successful!`.green);
    } else {
      console.log(
        `✗ You've already done the daily check-in. Try again tomorrow!`.red
      );
    }

    console.log(`Total daily check-ins: ${checkinData.totalDays}`.green);
    console.log(`Daily reward: ${checkinData.dailyReward}`.green);
    console.log(`Balance after check-in: ${checkinData.balance}`.green);
    console.log('');
  }
}

async function runFarm(BEARERS) {
  for (const [index, BEARER] of BEARERS.entries()) {
    console.log(`Account ${index + 1}:`);
    
    const claimResult = await claimFarming(BEARER);
    if (claimResult) {
      console.log(`Farming rewards claimed successfully!`.green);
    } else {
      console.log(`✗ No farming rewards to claim.`.yellow);
    }

    const farm = await startFarming(BEARER);
    if (farm) {
      console.log(`New farming session started!`.green);
      console.log(
        `Start time: ${moment(farm.timings.start).format(
          'MMMM Do YYYY, h:mm:ss a'
        )}`.green
      );
      console.log(
        `End time: ${moment(farm.timings.finish).format(
          'MMMM Do YYYY, h:mm:ss a'
        )}`.green
      );
    } else {
      console.log(`✗ Failed to start new farming session.`.red);
      console.log('');
    }
  }
}


async function runMine(BEARERS) {
  for (const [index, BEARER] of BEARERS.entries()) {

    console.log(`Account ${index + 1}:`);

    try {
      const getDiamondo = await fetchDiamond(BEARER);

      if (getDiamondo.state === 'unavailable') {
        console.log(
          `✗ Your diamond is not available, please try again on ${moment(
            getDiamondo.timings.nextAt
          ).format('MMMM Do YYYY, h:mm:ss a')}`.red
        );
        console.log('');
      } else {
        console.log(`Please wait, we will crack the diamond...`.yellow);

        await delay(2500);

        await claimDiamond(BEARER, getDiamondo.diamondNumber);

        console.log(
          `Diamond has been cracked! You get ${getDiamondo.settings.totalReward} ◈!`
            .green
        );
        console.log('');
      }
    } catch (error) {
      console.log(
        `✗ Error cracking diamond: ${
          error.response.data ? error.response.data.message : error
        }`.red
      );
      console.log('');
    }
    await delay(500);
  } 
}

async function runTasks(BEARERS) {
  for (const [index, BEARER] of BEARERS.entries()) {
    console.log(`Account ${index + 1}:`);
    const tasks = await fetchTasks(BEARER);

    for (const item of tasks.tasks) {
      if (item.status === 'available') {
        console.log(`Starting '${item.slug}' task...`.yellow);

        const startedTask = await startTask(BEARER, item.id);

        if (startedTask.status === 'verifying') {
            console.log(`Task "${item.slug}" started!`.green);

            console.log(`Claiming ${item.slug} task...`.yellow);

            const claimedTask = await claimTask(BEARER, item.id);

            await delay(1000);

            if (claimedTask) {
              console.log(
              `Task "${item.slug}" claimed! Congrats!`.green
              );
            }
        }
      } else {
        console.log(`Claiming ${item.slug} task...`.yellow);

        const claimedTask = await claimTask(BEARER, item.id);

        await delay(1000);

        console.log('');

        if (claimedTask) {
          console.log(
            `Task "${item.slug}" claimed! Congrats!`.green
          );
          console.log('');
        }
      }
    }
  }
}

module.exports = {
  handleAutomate,
};
