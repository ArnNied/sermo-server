import path from "path"

import cookieParser from "cookie-parser"
import express, { Express, NextFunction, Request, Response } from "express"
import createError from "http-errors"
import logger from "morgan"

import { userRemoveStale } from "./core/middleware"
import channelRouter from "./routes/channel"
import indexRouter from "./routes/index"
import messageRouter from "./routes/message"
import userRouter from "./routes/users"

const debug = require("debug")("sermo-server:server")

const app: Express = express()
const port = process.env.PORT || 3000

app.use(logger("dev"))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, "public")))

app.use(userRemoveStale)

app.use("/", indexRouter)
app.use("/user", userRouter)
app.use("/message", messageRouter)
app.use("/channel", channelRouter)

// catch 404 and forward to error handler
app.use((req: Request, res: Response, next: NextFunction) => {
  next(createError(404))
})

// error handler
app.use((err: any, req: any, res: any, next: any) => {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get("env") === "development" ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.json({
    description: err.message,
    error: err,
  })
})

app.set("port", port)

const server = app.listen(app.get("port"), () => {
  debug("Express server listening on port " + port)
})
