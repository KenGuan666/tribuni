# Tribuni

Tribuni is the easiest way to organize your governance delegate flow. Sign up today to receive vote alerts, proposal insights across 200+ projects.

Try it today: https://t.me/Tribuni_Bot with code POTATO
Read more: https://gov.optimism.io/t/tribuni-alpha-launch-telegram-mini-app-built-by-delegates-for-delegates/8568/13

Who is using Tribuni? See https://tribuni.vercel.app/metrics, https://tribuni.vercel.app/metrics/optimism

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

Then, run `pnpm run build`, `pnpm run dev`.

Last, visit browser URL from your browser.
Please manually substitute the test bot API key and ngrok URL. 

https://api.telegram.org/bot<TEST_BOT_API_KEY>/setWebhook?url=<YOUR_NGROK_HTTPS_URL>/api/v4/bot

https://t.me/Tribuni_Bot_Test is now linked to your local deployment.

#### Deploy
Run code formatter before pushing code
`pnpm prettier --write .`

Directly push to main branch
`git push`
