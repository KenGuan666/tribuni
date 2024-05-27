# Tribuni

Tribuni simplifies crypto governance participation by aggregating high-signal information into a Telegram bot.

Try it today: https://t.me/Tribuni_Bot

### Developer Guide

#### Setup
Install [npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm), [pnpm](https://pnpm.io/installation), and [ngrok](https://ngrok.com/download). Set up an ngrok account.

Create an `.env.local` file under next-app folder. Copy content [here](https://www.notion.so/atlantropa/Tribuni-bot-env-local-file-content-223f1fd0ebf64f2caf5adf5fbdcb5862).

#### Build
```
cd next-app
pnpm install
pnpm run build
```

#### Test Locally
First, run `ngrok http 3000`. It creates an HTTPS proxy to your local 3000 port.

Update env vars `SERVER_URL` and `NEXT_PUBLIC_SERVER_URL` with the ngrok link.

Then, run `pnpm run dev`.

Last, visit brower URL from your browser.
Please manually substitute the test bot API key and ngrok URL. 

https://api.telegram.org/bot<TEST_BOT_API_KEY>/setWebhook?url=<YOUR_NGROK_HTTPS_URL>/api/v4/bot

https://t.me/Tribuni_Bot_Test is now linked to your local deployment.

#### Deploy
`git push`
