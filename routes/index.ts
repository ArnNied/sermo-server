import express, { NextFunction, Request, Response } from "express"

import pusher from "../core/pusher"

const router = express.Router()

/* GET home page. */
router.get("/", (req: Request, res: Response, next: NextFunction) => {
  res.json({
    status: "OK",
    description: "Henlo",
  })
})

// Ping
router.get("/ping", (req: Request, res: Response, next: NextFunction) => {
  res.json({
    status: "OK",
    description: "pong",
  })
})

export default router
