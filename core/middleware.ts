import { NextFunction, Request, Response } from "express"

import { channelList } from "./channel"
import { userList } from "./user"

export function userRequired(req: Request, res: Response, next: NextFunction) {
  const data = req.body

  if (!userList.has(data.userId)) {
    res.status(400).json({
      status: "ERROR",
      description: "User has not been created",
    })
  } else {
    next()
  }
}

export function userRemoveStale(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const staleUser = userList.removeStale()

  if (staleUser) {
    channelList.removeStaleUser(staleUser)
    channelList.removeEmptyChannel()
  }

  next()
}
