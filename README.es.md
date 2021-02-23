# telegram-twitter-bot-ts
Una app para compartir tweets a canales de Telegram en tiempo real, hecha con TypeScript.

<hr>

[See README in English](./README.md)

## Funcionamiento
La app se conecta al [Filtered Stream de Twitter](https://developer.twitter.com/en/docs/twitter-api/tweets/filtered-stream/introduction), que permite recibir tweets en tiempo real y los reenvía a los canales de Telegram que deseemos.

## Configuración de JavaScript (Node.js)
Es necesario tener instalado [Node.js](https://nodejs.org/en/) para correr la app. La app se desarrolló y usó en la versión 14.15.4.

```bash
npm install
```

## Requisitos
* Telegram:
  * [Crear un bot de Telegram](https://core.telegram.org/bots#6-botfather)
* Twitter:
   * Una cuenta de Twitter Developer. Registrarse [acá](https://developer.twitter.com/en/apply-for-access).
   * Un Project y una App creados en el [Developer Portal](https://developer.twitter.com/en/portal/dashboard).

## Configuración de las reglas
El archivo rules.json (./src/rules.json) guarda la lista de _tweets que se quieren compartir_ y _canal de Telegram donde se los quiere compartir_. El archivo [rules_sample.json](./src/rules_sample.json) es un ejemplo de cómo debería ser el archivo rules.json.


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


1. Array, ver límites de reglas [acá](https://developer.twitter.com/en/docs/twitter-api/tweets/filtered-stream/introduction).
2. Regla del [Filtered Stream](https://developer.twitter.com/en/docs/twitter-api/tweets/filtered-stream/integrate/build-a-rule).
3. ID del canal de Telegram adonde se quieren enviar los tweets. El bot debe estar unido como administrador y tener el permiso para enviar mensajes.
4. Tag único para identificar cada regla.

<br>

Hay que setear las variables de entorno ```TWITTER_BEARER_TOKEN``` (sacada del [Developer Portal](https://developer.twitter.com/en/portal/dashboard)) y ```TELEGRAM_BOT_API_TOKEN``` (obtenida de [BotFather](https://core.telegram.org/bots#6-botfather)) con las *keys* de las respectivas plataformas. Se pueden setear por consola usando el comando ```set``` en Windows y ```export``` en macOS y Linux.  

Por ejemplo:
```bash
set TWITTER_BEARER_TOKEN=AAAAAAAAAAAAAAAAAAAAAbcdeAAAAAAA...

set TELEGRAM_BOT_API_TOKEN=123456:ABC-DEF1234ghIkl...
```
```bash
export TWITTER_BEARER_TOKEN=AAAAAAAAAAAAAAAAAAAAAbcdeAAAAAAA...

export TELEGRAM_BOT_API_TOKEN=123456:ABC-DEF1234ghIkl...
```