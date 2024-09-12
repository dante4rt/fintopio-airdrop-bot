# 🚀 Fintopio Airdrop Bot

This is an automated bot to help you complete tasks, check in daily, and participate in farming on the Fintopio platform. The bot interacts with Fintopio's API to automate your tasks and save time!

## Features

- ✅ Auto complete all tasks
- 💎 Auto click asteroid (diamond)
- 📅 Auto daily check-in
- 🌱 Auto farming (claim and start)
- 🔄 Autorun

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/eljaladz/fintopio-bot.git
   cd fintopio-bot
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `bearers.json` file in the project root directory. This file will contain the tokens used to authenticate with the Fintopio API.

### Format of `bearers.json`

The `bearers.json` file should be an array of strings, each string being a bearer token for one account:

```json
[
  "your_bearer_token_1",
  "your_bearer_token_2",
  "your_bearer_token_3"
]
```

### How to get your Bearer Token

1. Open the Fintopio Telegram Bot: [JOIN HERE](https://fintop.io/UzXNTxGw)
2. Right-click anywhere in the bot and select **Inspect** to open the browser's developer tools.
3. Navigate to the **Console** tab.
4. Paste the following code in the console:

   ```javascript
   console.log(localStorage.getItem(Object.keys(localStorage).find(k => k.startsWith('authToken_'))));
   ```

5. The console will print your bearer token. Copy this token and paste it into the `bearers.json` file.

## Running the Bot

After setting up the `bearers.json` file, you can run the bot with the following command:

```bash
npm start
```

Follow the instructions in the terminal to select your desired action.

Use [GNU screen](https://www.gnu.org/software/screen/) for a better experience when using 🔄 Autorun features. 

## Contributing

Feel free to submit issues or create pull requests to improve the bot.

## Donations

If you would like to support the development of this project, you can make a donation using the following addresses:

- **Solana**: `GLQMG8j23ookY8Af1uLUg4CQzuQYhXcx56rkpZkyiJvP`
- **EVM**: `0x960EDa0D16f4D70df60629117ad6e5F1E13B8F44`
- **BTC**: `bc1p9za9ctgwwvc7amdng8gvrjpwhnhnwaxzj3nfv07szqwrsrudfh6qvvxrj8`

- **EVM**: `0xfD1847bFAA92fb8c0d100b207d377490C5acd34c`
- **SOL**: `BBZjp11sJNvekXZEBhhYDro9gsyyhEKXXcfEEub5ubje`
- **TON**: `UQDoLQNF-nt9CFOHBs9mQqxH9YJKrZ6mFPbAeHH8Jo9xIGCb`

## License

This project is licensed under the MIT License.
