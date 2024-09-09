const { handleTasks } = require('./src/tasks');
const fs = require('fs');

const BEARERS = JSON.parse(fs.readFileSync('bearers.json', 'utf-8'));

handleTasks(BEARERS);
