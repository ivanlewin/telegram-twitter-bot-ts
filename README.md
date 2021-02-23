# telegram-twitter-bot-ts
An app to share tweets in real time to Telegram channels, made with TypeScript.

<hr>

[Ver README en español](./README.es.md)

## How it works
The app connects to the [Twitter Filtered Stream](https://developer.twitter.com/en/docs/twitter-api/tweets/filtered-stream/introduction), which allows to stream tweets in real time, and sends them to the specified Telegram channels.

## JavaScript (Node.js) environment set up
You will need to have [Node.js](https://nodejs.org/en/) installed to run this code. It has been developed and run on Node.js v14.15.4.

```bash
npm install
```

## Prerequisites
* Telegram:
  * [Make a Telegram bot](https://core.telegram.org/bots#6-botfather)
* Twitter:
  * Twitter Developer account: if you don’t have one already, [you can apply](https://developer.twitter.com/en/apply-for-access) for one.
  * A Project and an App created [in the dashboard](https://developer.twitter.com/en/portal/dashboard).


## Rules setup
The rules.json file (./src/rules.json) stores the list of _tweets to listen to_ and _Telegram channel to send them to_. You can take a look at [rules_sample.json](./src/rules_sample.json) to see how your file should look like.

```javascript
[ ¹
    {
        "filteredStreamRule": "(iphone OR ipad) has:media", ²
        "telegramChannelID": "-1000000000001", ³
        "tag": "tweets about iProducts containing media" ⁴
    },
    {
        "filteredStreamRule": "from:nytimes -is:retweet",
        "telegramChannelID": "-1000000000002",
        "tag": "organic tweets by the New York Times"
    }
]
```

1. Array of rules, see limits [here](https://developer.twitter.com/en/docs/twitter-api/tweets/filtered-stream/introduction).
2. [Filtered Stream Rule](https://developer.twitter.com/en/docs/twitter-api/tweets/filtered-stream/integrate/build-a-rule).
3. The ID of the Telegram channel where the messages should go. The Bot must be an admin with permission to post messages.
4. Unique tag with a custom name, used to identify each rule.

Don't forget to make your own rules.json file
```bash
touch ./src/rules.json
```

<br>

You will need to set the environment variables for your ```TWITTER_BEARER_TOKEN``` (taken from the [Developer Portal](https://developer.twitter.com/en/portal/dashboard)) and ```TELEGRAM_BOT_API_TOKEN``` (which you can get from [BotFather](https://core.telegram.org/bots#6-botfather)). You can set them via the console using the ```set``` command on Windows and ```export``` command on macOS and Linux.

For example:
```bash
set TWITTER_BEARER_TOKEN=AAAAAAAAAAAAAAAAAAAAAbcdeAAAAAAA...

set TELEGRAM_BOT_API_TOKEN=123456:ABC-DEF1234ghIkl...
```
```bash
export TWITTER_BEARER_TOKEN=AAAAAAAAAAAAAAAAAAAAAbcdeAAAAAAA...

export TELEGRAM_BOT_API_TOKEN=123456:ABC-DEF1234ghIkl...
```