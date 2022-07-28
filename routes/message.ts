import express, { NextFunction, Request, Response } from "express"

import { channelList } from "../core/channel"
import { userRequired } from "../core/middleware"
import pusher from "../core/pusher"
import { userList } from "../core/user"

const router = express.Router()

router.use((req: Request, res: Response, next: NextFunction) => {
  const data = req.body

  if (!data.channelId || !data.userId || !data.message) {
    res.status(400).json({
      status: "ERROR",
      description: '"channelId", "userId", and "message" fields are required',
    })
  } else if (!channelList.has(data.channelId)) {
    res.status(404).json({
      status: "ERROR",
      description: "Channel not found",
    })
  } else {
    next()
  }
})

router.use(userRequired)

// Send message to a channel
router.post("/send", (req: Request, res: Response, next: NextFunction) => {
  const data = req.body

  if (channelList.get(data.channelId).userExist(data.userId)) {
    userList.get(data.userId).setLastActive(new Date().toUTCString())
    pusher.trigger(`channel.${data.channelId}`, "message", data)
    res.status(201).json({
      status: "CREATED",
      description: "Message successfully sent",
      content: data.message,
    })
  } else {
    res.status(401).json({
      status: "UNAUTHORIZED",
      description: "User not connected to channel",
    })
  }
})

export default router
