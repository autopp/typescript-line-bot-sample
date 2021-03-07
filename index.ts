import express from 'express'
import line from '@line/bot-sdk'

function loadEnv(name: string): string {
  const v = process.env[name]
  if (v === undefined) {
    throw new Error(`cannot load ${name} from env`)
  }

  return v
}

const app = express()
app.get('/', (req, res) => {
  console.log(req.body)
  res.status(200)
})

const middleware = line.middleware({
  channelAccessToken: loadEnv('CHANNEL_ACCESS_TOKEN'),
  channelSecret: loadEnv('CHANNEL_SECRET'),
})
app.post('/webhook', middleware, )

const port = process.env.PORT || 5000
app.listen(port, () => {
  console.log(`listen on ${port}`)
})
