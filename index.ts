import express from 'express'

const app = express()
app.get('/', (_, res: express.Response<{ message: string }>) => {
  res.json({ message: "hello world" })
}).listen

const port = process.env.PORT || 5000
app.listen(port, () => {
  console.log(`listen on ${port}`)
})
