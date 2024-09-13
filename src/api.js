const axios = require('axios');
const BASE_URL = 'https://fintopio-tg.fintopio.com/api/';

async function fetchReferralData(token) {
  try {
    const { data } = await axios({
      url: BASE_URL + 'referrals/data',
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return data;
  } catch (error) {
    console.log(
      `❌ Error fetching referral data: ${error.response.data.message}`.red
    );
  }
}

async function fetchTasks(token) {
  try {
    const { data } = await axios({
      url: BASE_URL + 'hold/tasks',
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return data;
  } catch (error) {
    console.log(`❌ Error fetching tasks: ${error.response.data.message}`.red);
  }
}

async function startTask(token, id) {
  try {
    const { data } = await axios({
      url: BASE_URL + `hold/tasks/${id}/start`,
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: {},
    });

    return data;
  } catch (error) {
    if (
      error.response.data.message.includes('update task') ||
      error.response.data.message.includes('not found')
    ) {
      console.log(
        `⚠️ Task with ID "${id}" failed to start, please do it manually!`.red
      );
    } else {
      console.log(`❌ Error starting task: ${error.response.data.message}`.red);
    }
  }
}

async function claimTask(token, id) {
  try {
    const { data } = await axios({
      url: BASE_URL + `hold/tasks/${id}/claim`,
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: {},
    });

    return data;
  } catch (error) {
    if (
      error.response.data.message.includes('update task') ||
      error.response.data.message.includes('not found')
    ) {
      console.log(
        `⚠️ Task with ID "${id}" failed to claim, please do it manually!`.red
      );
    } else {
      console.log(`❌ Error claiming task: ${error.response.data.message}`.red);
    }
  }
}

async function dailyCheckin(token) {
  try {
    const { data } = await axios({
      url: BASE_URL + 'daily-checkins',
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: {},
    });

    return data;
  } catch (error) {
    console.log(`❌ Error during daily check-in: ${error}`);
  }
}

async function startFarming(token) {
  try {
    const { data } = await axios({
      url: BASE_URL + 'farming/farm',
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: {},
    });

    return data;
  } catch (error) {
    if (error.response.data.message.includes('already started')) {
      console.log(`⚠️ Farming already started, try again later!`.red);
    } else {
      console.log(`❌ Error starting farming: ${error}`);
    }
  }
}

async function claimFarming(token) {
  try {
    const { data } = await axios({
      url: BASE_URL + 'farming/claim',
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: {},
    });

    return data;
  } catch (error) {
    console.log(
      `❌ Error claiming farming: ${
        error.response.data ? error.response.data.message : error
      }`
    );
  }
}

async function fetchDiamond(token) {
  try {
    const { data } = await axios({
      url: BASE_URL + 'clicker/diamond/state',
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return data;
  } catch (error) {
    console.log(
      `❌ Error fetching diamond: ${error.response.data.message}`.red
    );
  }
}

async function claimDiamond(token, id) {
  try {
    const { data } = await axios({
      url: BASE_URL + 'clicker/diamond/complete',
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: {
        diamondNumber: id,
      },
    });

    return data;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  fetchReferralData,
  fetchTasks,
  startTask,
  claimTask,
  dailyCheckin,
  startFarming,
  claimFarming,
  fetchDiamond,
  claimDiamond,
};
