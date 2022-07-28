import express, { NextFunction, Request, Response } from "express"

import { Channel, channelList } from "../core/channel"
import { userRequired } from "../core/middleware"

const router = express.Router()

// List all channel
router.get("/", (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({
    status: "OK",
    content: channelList.channels,
  })
})

router.use((req: Request, res: Response, next: NextFunction) => {
  const data = req.body

  if (!data.channelId || !data.userId) {
    res.status(400).json({
      status: "ERROR",
      description: '"channelId" and "userId" fields are required',
    })
  } else {
    next()
  }
})

router.use(userRequired)

// Conncct a user to a channel
router.post("/connect", (req: Request, res: Response, next: NextFunction) => {
  const data = req.body

  if (!channelList.has(data.channelId)) {
    channelList.add(new Channel(data.channelId, new Date().toUTCString()))
  }

  channelList.get(data.channelId).userConnect(data.userId)

  res.status(201).json({
    status: "OK",
    description: "User connected to channel",
    content: channelList.get(data.channelId),
  })
})

// Disconnect a user from a channel
router.post(
  "/disconnect",
  (req: Request, res: Response, next: NextFunction) => {
    const data = req.body

    if (channelList.has(data.channelId)) {
      channelList.get(data.channelId).userDisconnect(data.userId)

      if (Object.keys(channelList.get(data.channelId)).length === 0) {
        channelList.remove(data.channelId)
      }

      res.status(200).json({
        status: "OK",
        description: "User successfully disconnected",
        content: channelList.get(data.channelId),
      })
    } else {
      res.status(404).json({
        status: "ERROR",
        description: "Channel not found",
      })
    }
  }
)

export default router
