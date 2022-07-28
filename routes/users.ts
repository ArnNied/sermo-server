import express, { NextFunction, Request, Response } from "express"

import { User, userList } from "../core/user"
import { generateId } from "../core/utils"

const router = express.Router()

router.use((req: Request, res: Response, next: NextFunction) => {
  const data = req.body

  if (!data.username) {
    res.status(400).json({
      status: "ERROR",
      description: '"username" field is required',
    })
  } else {
    next()
  }
})
// List all user
router.get("/", (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({
    status: "OK",
    description: "List of all user",
    content: userList.users,
  })
})

// Create a new user
router.post("/create", (req: Request, res: Response, next: NextFunction) => {
  const data = req.body

  let generatedId = generateId(16)

  while (userList.has(generatedId)) {
    generatedId = generateId(16)
  }

  const newUser = new User(generatedId, data.username, new Date().toUTCString())

  userList.add(newUser)

  res.status(201).json({
    status: "CREATED",
    description: "User successfully created",
    content: newUser,
  })
})

// Check if user is exist
router.post("/exist", (req: Request, res: Response, next: NextFunction) => {
  const data = req.body

  if (userList.has(data.userId)) {
    res.status(200).json({
      status: "OK",
      description: `User with username ${data.username} exist`,
      content: userList.get(data.userId),
    })
  } else {
    res.status(404).json({
      status: "ERROR",
      description: `User with username ${data.username} not found`,
    })
  }
})

export default router
