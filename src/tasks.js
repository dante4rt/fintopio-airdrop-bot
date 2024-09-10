const { fetchReferralData } = require('./api');
const {
  fetchTasks,
  startTask,
  claimTask,
  dailyCheckin,
  startFarming,
  fetchDiamond,
  claimDiamond,
} = require('./api');
const { displayHeader, displayOptions, createTable } = require('./display');
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const moment = require('moment');

async function handleTasks(BEARERS) {
  displayHeader();
  console.log(`🚀 Fetching data, please wait...\n`.yellow);

  try {
    const table = await createTable(BEARERS, fetchReferralData);
    console.log(table);

    const options = displayOptions();

    if (options === '5' || !options) {
      console.log('👋 Exiting the bot. See you next time!'.cyan);
      console.log('Subscribe: https://t.me/HappyCuanAirdrop.'.green);
      process.exit(0);
    }

    if (options === '1') {
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
                console.log(
                  `✔️ Task "${item.slug}" claimed! Congrats! 🎉 `.green
                );
              }
            }
          }

          console.log(`All tasks has been cleared! ;)`.green);
          console.log('');
        }
      }
    } else if (options === '2') {
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
            console.log('');
          }
        } catch (error) {
          console.log(
            `❌ Error cracking diamond: ${
              error.response.data ? error.response.data.message : error
            }`.red
          );
          console.log('');
        }

        await delay(500);
      }
    } else if (options === '3') {
      for (const [index, BEARER] of BEARERS.entries()) {
        console.log(`#️⃣ ${index + 1} Account:`);

        const checkinData = await dailyCheckin(BEARER);

        if (checkinData.claimed) {
          console.log(`✔️ Daily check-in successful!`.green);
        } else {
          console.log(
            `📅 You've already done the daily check-in. Try again tomorrow!`.red
          );
        }

        console.log(`📅 Total daily check-ins: ${checkinData.totalDays}`.green);
        console.log(`💰 Daily reward: ${checkinData.dailyReward}`.green);
        console.log(`💵 Balance after check-in: ${checkinData.balance}`.green);
        console.log('');
      }
    } else if (options === '4') {
      for (const [index, BEARER] of BEARERS.entries()) {
        console.log(`#️⃣ ${index + 1} Account:`);

        const farm = await startFarming(BEARER);

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
          console.log('');
        }
      }
    } else {
      console.log('Invalid option!'.red);
    }
  } catch (error) {
    console.log(`❌ Error: ${error}`.red);
  }
}

module.exports = {
  handleTasks,
};
