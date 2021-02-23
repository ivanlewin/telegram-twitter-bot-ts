import http from "http";
import { setFilteredStreamRules, streamConnect } from "./filteredStream";
import configRules from "./rules.json";
import TelegramBot from "./TelegramBot";

// Bearer token sacado del Twitter Developer Portal
const TWITTER_BEARER_TOKEN = process.env.TWITTER_BEARER_TOKEN;
if (!TWITTER_BEARER_TOKEN) { throw new Error("No se encontró el Bearer Token"); }

// API Token entregado por botfather
const TELEGRAM_BOT_API_TOKEN = process.env.TELEGRAM_BOT_API_TOKEN;
if (!TELEGRAM_BOT_API_TOKEN) { throw new Error("No se encontró el API Token de Telegram"); }
const telegramBot = new TelegramBot(TELEGRAM_BOT_API_TOKEN, configRules);

// Para obtener el ID de los canales donde está el bot
telegramBot.on("channel_post", ctx => console.log(`Canal: ${ctx.channelPost.chat.title}\nID: ${ctx.channelPost.chat.id}`)).launch();

(async () => {

	const currentRules = await setFilteredStreamRules(TWITTER_BEARER_TOKEN, false, true);
	console.log("Reglas actuales:", currentRules);

	// Conectar al stream
	const filteredStream = streamConnect(TWITTER_BEARER_TOKEN);
	console.log("Conectado al stream");

	// Esta lógica va a intentar reconectarse cuando se detecta una desconexión
	// Para evitar saturar la API se implementa un exponential backoff, así el tiempo de espera
	// aumenta cada vez que el cliente no se puede reconectar al stream.
	// Ver: https://github.com/twitterdev/Twitter-API-v2-sample-code/blob/master/Filtered-Stream/filtered_stream.js#L141
	let timeout = 20000;
	filteredStream.on("timeout", () => {
		console.warn("Error de conexión. Reintentando...");
		setTimeout(() => {
			timeout++;
			streamConnect(TWITTER_BEARER_TOKEN);
		}, 2 ** timeout);
		streamConnect(TWITTER_BEARER_TOKEN);
	});

	// Los tweets llegan como evento "data"
	filteredStream.on("data", data => {
		try {
			const tweet = JSON.parse(data);
			telegramBot.handleTweet(tweet);
		} catch (err) {
			// Ignoro heartbeat
			// Ver: https://developer.twitter.com/en/docs/twitter-api/tweets/filtered-stream/integrate/handling-disconnections
			if (data.toString("hex") === "0d0a") return;

			// Manejar los errores para mantener abierta la conexión
			console.error({ err, data });

			// Error de TooManyConnections. Puede pasar cuando nodemon se reinicia antes de que termine la conexión anterior
			// Ver: https://api.tswitter.com/2/problems/streaming-connection
			if (data.title === "ConnectionException") process.exit(-1);
		}
	});
})();

// Servidor necesario para correr en Heroku
if (process.env.NODE_ENV === "production") {
	const PORT = process.env.PORT || 80;
	http.createServer().listen(PORT);
}