const express = require("express")
const cors = require("cors")
const bodyParser = require("body-parser")

const OpenAI = require('openai')
const dotenv = require('dotenv')
dotenv.config()
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

const app = express()
const port = 3000

app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.listen(port, () => {
  console.log(`Node server listening at http://localhost:${port}`)
})

app.post("/openai-api", async (req, res) => {
  const data = req.body
  let promptContext = `Help students learn web development.`
  const response = await openai.completions.create({
    model: "gpt-3.5-turbo-instruct",
    prompt: `${promptContext} ${data.queryPrompt} ?`,
    temperature: 0,
    max_tokens: 60,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
  })
  console.log(response.data)
  res.json(response.data)
})