In order to run the chat, you need to use two different browsers (because the session storage use cookies so you need to different cookies environments).

```
npm install
node index.js
```

Go to http://localhost:3000 in both browser and set different usernames. 

When you send a message, send to the username that you used in the other browser.

The messages should be refreshed automatically. 

If you want to change the toxicity of a message, you can do using this request:

```
curl -X POST http://localhost:3000/evaluate \
  -H "Content-Type: application/json" \
  -d '{"messageId": 1, "toxicity": 0.7}'
```

This is going to be the route to be used for the AI to update the toxicity of a message.

If you want to get all the messages that were not evaluated yet, you can use:

```
GET http://localhost:3000/messages
```