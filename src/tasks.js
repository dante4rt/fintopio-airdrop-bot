const readlineSync = require('readline-sync');
const {
  fetchReferralData,
  claimFarming,
  startFarming,
  fetchTasks,
  startTask,
  claimTask,
  dailyCheckin,
  fetchDiamond,
  claimDiamond,
} = require('./api');
const { displayHeader, createTable } = require('./display');
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const moment = require('moment');

async function automaticFlow(BEARERS) {
  while (true) {
    try {
      console.log('📅 Auto daily check-in...'.yellow);
      await handleDailyCheckin(BEARERS);

      console.log('\n💎 Auto cracking diamond...'.yellow);
      await handleDiamond(BEARERS);

      console.log('\n🌱 Auto farming...'.yellow);
      await handleFarming(BEARERS);
    } catch (error) {
      console.log(`❌ Error in automatic flow: ${error.message}`.red);
    }

    console.log('\n⏳ Waiting 30 minutes before the next run...'.yellow);
    console.log(
      "📢 While waiting, don't forget to subscribe to https://t.me/HappyCuanAirdrop for the latest and best airdrops and bots!\n"
        .cyan
    );
    await delay(30 * 60 * 1000);
  }
}

async function oneTimeFlow(BEARERS) {
  try {
    const options = readlineSync.question(`
Choose an option:
1. 🚀 Auto complete all tasks
2. 🪐 Auto click asteroid
3. 📅 Auto daily check-in
4. 🌱 Auto farming
5. ❌ Exit

Enter 1, 2, 3, 4, or 5: `);

    if (options === '5') {
      console.log('👋 Exiting the bot. See you next time!'.cyan);
      console.log('Subscribe: https://t.me/HappyCuanAirdrop.'.green);
      process.exit(0);
    }

    if (options === '1') {
      await handleAllTasks(BEARERS);
    } else if (options === '2') {
      await handleDiamond(BEARERS);
    } else if (options === '3') {
      await handleDailyCheckin(BEARERS);
    } else if (options === '4') {
      await handleFarming(BEARERS);
    } else {
      console.log('Invalid option!'.red);
    }
  } catch (error) {
    console.log(`❌ Error: ${error.message}`.red);
  }
}

async function handleAllTasks(BEARERS) {
  for (const [index, BEARER] of BEARERS.entries()) {
    const tasks = await fetchTasks(BEARER);

    if (tasks) {
      console.log(`#️⃣ ${index + 1} Account:`);

      for (const item of tasks.tasks) {
        if (item.status === 'available') {
          console.log(`🚀 Starting '${item.slug}' task...`.yellow);

          const startedTask = await startTask(BEARER, item.id);

          if (startedTask.status === 'verifying') {
            console.log(`✔️ Task "${item.slug}" started!`.green);

            console.log(`🛠 Claiming ${item.slug} task...`.yellow);
            const claimedTask = await claimTask(BEARER, item.id);

            await delay(1000);

            if (claimedTask) {
              console.log(
                `✔️ Task "${item.slug}" claimed! Congrats! 🎉 `.green
              );
            }
          }
        } else {
          console.log(`🛠 Claiming ${item.slug} task...`.yellow);

          const claimedTask = await claimTask(BEARER, item.id);
          await delay(1000);

          if (claimedTask) {
            console.log(`✔️ Task "${item.slug}" claimed! Congrats! 🎉 `.green);
          }
        }
      }
    }
  }
}

async function handleDiamond(BEARERS) {
  for (const [index, BEARER] of BEARERS.entries()) {
    console.log(`#️⃣ ${index + 1} Account:`);

    try {
      const getDiamondo = await fetchDiamond(BEARER);

      if (getDiamondo.state === 'unavailable') {
        console.log(
          `❌ Your diamond is not available, please try again on ${moment(
            getDiamondo.timings.nextAt
          ).format('MMMM Do YYYY, h:mm:ss a')}`.red
        );
      } else {
        console.log(`Please wait, we will crack the diamond...`.yellow);
        await delay(1000);
        await claimDiamond(BEARER, getDiamondo.diamondNumber);

        console.log(
          `Diamond has been cracked! You get ${getDiamondo.settings.totalReward} 💎`
            .green
        );
      }
    } catch (error) {
      console.log(
        `❌ Error cracking diamond: ${
          error.response?.data ? error.response.data.message : error.message
        }`.red
      );
    }
    await delay(500);
  }
}

async function handleDailyCheckin(BEARERS) {
  for (const [index, BEARER] of BEARERS.entries()) {
    console.log(`#️⃣ ${index + 1} Account:`);

    const checkinData = await dailyCheckin(BEARER);

    if (checkinData.dailyReward) {
      console.log(`✔️ Daily check-in successful!`.green);
    } else {
      console.log(
        `📅 You've already done the daily check-in. Try again tomorrow!`.red
      );
    }

    console.log(`📅 Total daily check-ins: ${checkinData.totalDays}`.green);
    console.log(`💰 Daily reward: ${checkinData.dailyReward}`.green);
    console.log(`💵 Balance after check-in: ${checkinData.balance}`.green);
  }
}

async function handleFarming(BEARERS) {
  for (const [index, BEARER] of BEARERS.entries()) {
    console.log(`#️⃣ ${index + 1} Account:`);

    try {
      const farm = await claimFarming(BEARER);

      if (farm) {
        console.log(`🌱 Farming started!`.green);
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
      }
    } catch (error) {
      if (error.response?.data?.message.includes('not finished yet')) {
        console.log(
          `⚠️ Farming not finished yet, attempting to start new farming...`
            .yellow
        );

        const reFarm = await startFarming(BEARER);

        if (reFarm) {
          console.log(`🌱 Re-farming started!`.green);
          console.log(
            `🌱 Start time: ${moment(reFarm.timings.start).format(
              'MMMM Do YYYY, h:mm:ss a'
            )}`.green
          );
          console.log(
            `🌾 End time: ${moment(reFarm.timings.finish).format(
              'MMMM Do YYYY, h:mm:ss a'
            )}`.green
          );
        }
      } else {
        console.log(
          `❌ Error handling farming: ${
            error.response?.data?.message || error.message
          }`.red
        );
      }
    }
  }
}

async function handleTasks(BEARERS) {
  displayHeader();
  console.log(`🚀 Fetching data, please wait...\n`.yellow);

  const table = await createTable(BEARERS, fetchReferralData);
  console.log(table);

  const mode = process.argv[2] || readlineSync.question(
  'Do you want to run the bot one-time (1) or continuously (2)?\n\nEnter 1 or 2: '
  );

  if (mode === '1') {
    await oneTimeFlow(BEARERS);
  } else if (mode === '2') {
    console.log('Starting automatic flow...'.cyan);
    await automaticFlow(BEARERS);
  } else {
    console.log('Invalid option!'.red);
  }
}

module.exports = {
  handleTasks,
};
