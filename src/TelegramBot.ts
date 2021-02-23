import { Telegraf } from "telegraf";
import { InlineKeyboardButton, InlineKeyboardMarkup } from "telegraf/typings/telegram-types";
import { configRule, Tweet } from "./types";

export default class TelegramBot extends Telegraf {
	config: configRule[];

	constructor(telegramBotToken: string, config: configRule[]) {
		super(telegramBotToken);
		this.config = config;
	}

	/** Matchea el 'tag' del tweet con config.json y devuelve el ID del canal de destino */
	getChannelID(tweet: Tweet) {
		const matches = this.config.filter(element => element.tag === tweet.matching_rules[0].tag);
		if (matches) { return matches[0].telegramChannelID; }
	};

	buildInlineKeyboard(tweet: any): InlineKeyboardMarkup {
		const { username } = tweet.includes.users[0];
		const { id: tweetID } = tweet.data;

		const inlineKeyboardButtons: InlineKeyboardButton[][] = [
			[
				{
					"text": "Abrir tweet",
					"url": `https://www.twitter.com/${username}/status/${tweetID}`
				},
				{
					"text": `Ver @${username} en Twitter`,
					"url": `https://www.twitter.com/${username}`
				}
			]
		];

		return { "inline_keyboard": inlineKeyboardButtons };
	};

	/** Construye un mensaje en base al texto del tweet */
	buildMessage(tweet: any): string {
		const datetime = new Date(tweet.data.created_at).toLocaleString("es-AR", { timeZone: "America/Argentina/Buenos_Aires" });
		const message = `${tweet.data.text}\n\n[@${tweet.includes.users[0].username}](https://www.twitter.com/${tweet.includes.users[0].username}) - ${datetime}`;

		return message;
	};

	async handleTweet(tweet: Tweet) {

		console.log("Tweet: ", tweet);

		if (!tweet || !tweet.includes || !tweet.includes.users) {
			throw new Error("Error con el tweet");
		}

		const channelID = this.getChannelID(tweet);
		if (!channelID) return
		const message = this.buildMessage(tweet);
		const inlineKeyboard = this.buildInlineKeyboard(tweet);

		this.telegram.sendMessage(
			channelID,
			message,
			{
				reply_markup: inlineKeyboard,
				parse_mode: "Markdown",
				// disable_web_page_preview: true
			}
		).catch(console.error);
	};
}