import express, { Request } from 'express'
import { middleware, Client, WebhookRequestBody, WebhookEvent, MessageEvent, TextEventMessage, FollowEvent } from '@line/bot-sdk'

function loadEnv(name: string): string {
  const v = process.env[name]
  if (v === undefined) {
    throw new Error(`cannot load ${name} from env`)
  }

  return v
}

function handleMessageEvent(event: MessageEvent) {
  if (event.message.type !== "text") {
    return
  }

  return bot.replyMessage(event.replyToken, { type: "text", text: `echo: ${event.message.text}` })
}

async function handleFollowEvent(event: FollowEvent) {
  const profile = event.source.userId !== undefined ? await bot.getProfile(event.source.userId) : undefined
  const message = profile !== undefined ? `hello ${profile.displayName}` : "hello new user"

  return bot.replyMessage(event.replyToken, { type: "text", text: message })
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

  const replies = req.body.events.map((event) => {
    if (event.type === "message") {
      return handleMessageEvent(event)
    }
    if (event.type === "follow") {
      return handleFollowEvent(event)
    }
  })

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
