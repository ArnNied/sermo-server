import { userStaleAfter } from "../config"

export interface IUser {
  id: string
  username: string
  created_at: string
  lastActive: string

  setLastActive(time: string): string
}

export interface IUserList {
  users: {
    [id: string]: User
  }
  get(id: string): User
  add(user: User): void
  remove(id: string): void
  has(id: string): boolean
  removeStale(): string[]
}

export class User implements IUser {
  id: string
  username: string
  created_at: string
  lastActive: string

  constructor(id: string, username: string, created_at: string) {
    this.id = id
    this.username = username
    this.created_at = created_at
    this.lastActive = created_at
  }

  setLastActive(time: string): string {
    this.lastActive = time

    return this.lastActive
  }
}

class UserList implements IUserList {
  users: {
    [id: string]: User
  }

  constructor() {
    this.users = {}
  }

  get(id: string): User {
    return this.users[id]
  }

  add(user: User): void {
    this.users[user.id] = user
  }

  remove(id: string): void {
    delete this.users[id]
  }

  has(id: string): boolean {
    return this.users.hasOwnProperty(id)
  }

  removeStale(): string[] {
    const removed = []

    for (const id in this.users) {
      if (this.users.hasOwnProperty(id)) {
        const user = this.users[id]

        if (
          user.lastActive < new Date(Date.now() - userStaleAfter).toUTCString()
        ) {
          removed.push(id)
          this.remove(id)
        }
      }
    }

    return removed
  }
}

export const userList: UserList = new UserList()
