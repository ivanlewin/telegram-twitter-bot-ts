# telegram-twitter-bot-ts
An app to share tweets in real time to Telegram channels, made with TypeScript.

## Funcionamiento
La app se conecta al [Filtered Stream de Twitter](https://developer.twitter.com/en/docs/twitter-api/tweets/filtered-stream/introduction), que permite recibir tweets en tiempo real y los reenvía a los canales de Telegram que deseemos.

## Requisitos
* Telegram:
  * [Crear un bot de Telegram](https://core.telegram.org/bots#6-botfather)
* Twitter:
   * Una cuenta de Twitter Developer. Registrarse [acá](https://developer.twitter.com/en/apply-for-access).
   * Un Project y una App creados en el [Developer Portal](https://developer.twitter.com/en/portal/dashboard).

## Configuración
En el archivo [rules.json](./src/rules.json) se configuran las reglas para matchear tweets y los canales de Telegram a donde deseamos que se envíen esos mensajes.

```javascript
[ ¹
    {
        "filteredStreamRule": "from:twitterdev -is:retweet", ²
        "telegramChannelID": "-1000000000001", ³
        "tag": "twitterdev" ⁴
    }
]
```


1. Array, ver límites de reglas [acá](https://developer.twitter.com/en/docs/twitter-api/tweets/filtered-stream/introduction).
2. Regla del [Filtered Stream](https://developer.twitter.com/en/docs/twitter-api/tweets/filtered-stream/integrate/build-a-rule).
3. ID del canal de Telegram adonde se quieren enviar los tweets. El bot debe estar unido como administrador y tener el permiso para enviar mensajes.
4. Tag único para identificar cada regla.

<br>

Hay que setear las variables de entorno ```FEEDREADER_TWITTER_BEARER_TOKEN``` (sacada del [Developer Portal](https://developer.twitter.com/en/portal/dashboard)) y ```FEEDREADER_TELEGRAM_API_TOKEN``` (obtenida de [BotFather](https://core.telegram.org/bots#6-botfather)) con las *keys* de las respectivas plataformas. Se pueden setear por consola usando el comando ```set```.  

Por ejemplo:
```bash
set FEEDREADER_TWITTER_BEARER_TOKEN=AAAAAAAAAAAAAAAAAAAAAbcdeAAAAAAA...

set FEEDREADER_TELEGRAM_API_TOKEN=123456:ABC-DEF1234ghIkl...
```
