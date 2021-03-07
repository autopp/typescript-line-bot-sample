import express, { Request } from 'express'
import { middleware, Client, WebhookRequestBody, WebhookEvent, MessageEvent, TextEventMessage } from '@line/bot-sdk'

function loadEnv(name: string): string {
  const v = process.env[name]
  if (v === undefined) {
    throw new Error(`cannot load ${name} from env`)
  }

  return v
}

type TextMessageEvent = {
  message: TextEventMessage
} & MessageEvent

function isTextMessageEvent(event: WebhookEvent): event is TextMessageEvent {
  return event.type === "message" && event.message.type === "text"
}

const app = express()
app.get('/', (req, res) => {
  res.json({ message: 'hello' })
})

const lineConfig = {
  channelAccessToken: loadEnv('CHANNEL_ACCESS_TOKEN'),
  channelSecret: loadEnv('CHANNEL_SECRET'),
}
const bot = new Client(lineConfig)
const lineMiddleware = middleware(lineConfig)
app.post('/webhook', lineMiddleware, (req: Request<{}, {}, WebhookRequestBody>, res) => {
  console.log(req.body);
  res.sendStatus(200);

  req.body.events.filter
  const replies = req.body.events.filter(isTextMessageEvent).map((event) =>
    bot.replyMessage(event.replyToken, { type: "text", text: `echo: ${event.message.text}` })
  )

  Promise.allSettled(replies).then((results) => {
    results.forEach((r) => {
      console.log(r.status)
    })
  })
})

const port = process.env.PORT || 5000
app.listen(port, () => {
  console.log(`listen on ${port}`)
})
