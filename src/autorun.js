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
  console.log('')
  console.log(`Fetching data, please wait...\n`.yellow);

  const currentTime = new Date();
  console.log(`Current time: ${currentTime.toLocaleTimeString('en-GB')}`);

  const table = await createTable(BEARERS, fetchReferralData);
  console.log(table);

  cron.schedule('0 7-23,0 * * *', () => {
    const currentTime = new Date();
    console.log(`Fetching data, please wait...`.yellow);
    console.log('')
    console.log(`Current time: ${currentTime.toLocaleTimeString('en-GB')}`);
    createTable(BEARERS, fetchReferralData);
    console.log('')
  });

  cron.schedule('1 7 * * *', () => {
      console.log('Running Checkin and Task'.cyan);
      runCheckinAndTask(BEARERS);
  });

  cron.schedule('3 7,15,23 * * *', () => {
      console.log(`Running Farm`.cyan);
      runFarm(BEARERS);
  });

  cron.schedule('5 8-23,0-7 * * *', () => {
      console.log(`Running Mine`.cyan);
      runMine(BEARERS);
  });
  
  console.log('');
  console.log('Tasks scheduled. The bot will run automatically at the specified times.'.cyan);
  console.log('Subscribe: https://t.me/NoDrops '.green);
  console.log('');
}

async function runCheckinAndTask(BEARERS) {
  for (const [index, BEARER] of BEARERS.entries()) {
    console.log(`Account ${index + 1}:`);

    const checkinData = await dailyCheckin(BEARER);

    if (checkinData.claimed) {
      console.log(`Daily check-in successful!`.green);
    } else {
      console.log(
        `You've already done the daily check-in. Try again tomorrow!`.red
      );
    }

    console.log(`Total daily check-ins: ${checkinData.totalDays}`.green);
    console.log(`Daily reward: ${checkinData.dailyReward}`.green);
    console.log(`Balance after check-in: ${checkinData.balance}`.green);
    console.log('');
  }

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

        if (claimedTask) {
          console.log(
            `Task "${item.slug}" claimed! Congrats!`.green
          );
        }
      }
    }
    
    const tableDaily = await createTable(BEARERS, fetchReferralData);
    console.log(tableDaily);

  }
}

async function runFarm(BEARERS) {
  for (const [index, BEARER] of BEARERS.entries()) {
    console.log(`Account ${index + 1}:`);
    
    const claimResult = await claimFarming(BEARER);
    if (claimResult) {
      console.log(`🎉 Farming rewards claimed successfully!`.green);
    } else {
      console.log(`No farming rewards to claim or claiming failed.`.yellow);
    }

    const farm = await startFarming(BEARER);
    if (farm) {
      console.log(`🌱 New farming session started!`.green);
      console.log(
        `🌱 Start time: ${moment(farm.timings.start).format(
          'MMMM Do YYYY, h:mm:ss a'
        )}`.green
      );
      console.log(
        `🌾 End time: ${moment(farm.timings.finish).format(
          'MMMM Do YYYY, h:mm:ss a'
        )}`.green
      );
    } else {
      console.log(`Failed to start new farming session.`.red);
    }
    
    console.log('');

    const tableFarm = await createTable(BEARERS, fetchReferralData);
    console.log(tableFarm);

  }
}


async function runMine(BEARERS) {
  for (const [index, BEARER] of BEARERS.entries()) {

    console.log(`Account ${index + 1}:`);

    try {
      const getDiamondo = await fetchDiamond(BEARER);

      if (getDiamondo.state === 'unavailable') {
        console.log(
          `Your diamond is not available, please try again on ${moment(
            getDiamondo.timings.nextAt
          ).format('MMMM Do YYYY, h:mm:ss a')}`.red
        );
      } else {
        console.log(`Please wait, we will crack the diamond...`.yellow);

        await delay(2500);

        await claimDiamond(BEARER, getDiamondo.diamondNumber);

        console.log(
          `Diamond has been cracked! You get ${getDiamondo.settings.totalReward} 💎`
            .green
        );
        console.log('');
      }
    } catch (error) {
      console.log(
        `Error cracking diamond: ${
          error.response.data ? error.response.data.message : error
        }`.red
      );
      console.log('');
    }

    await delay(500);

    const tableMine = await createTable(BEARERS, fetchReferralData);
    console.log(tableMine);

  } 
}

module.exports = {
  handleAutomate,
};
