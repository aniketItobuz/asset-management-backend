import express from "express"
import {connectToMongoDB} from './connection/db.js'
import { config } from "./config/config.js"
import rootRouter from './rootRouter.js'

connectToMongoDB()

const app = express()
const port = config.PORT


app.use(rootRouter)

app.listen(port, () => {
  console.log(`Server started at ${port}...`)
})