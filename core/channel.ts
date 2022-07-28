export type IChannel = {
  id: string
  connected: {
    [id: string]: {
      userId: string
      connectedSince: string
    }
  }
  created_at: string
}

export interface IChannelList {
  channels: {
    [id: string]: Channel
  }
  get(channelId: string): Channel
  add(channel: Channel): void
  remove(channelId: string): void
  has(channelId: string): boolean
}

export class Channel implements IChannel {
  id: string
  connected: {
    [id: string]: {
      userId: string
      connectedSince: string
    }
  }
  created_at: string

  constructor(id: string, created_at: string) {
    this.id = id
    this.connected = {}
    this.created_at = created_at
  }

  userConnect(userId: string): void {
    if (this.userExist(userId)) {
      return
    }

    this.connected[userId] = {
      userId,
      connectedSince: new Date().toUTCString(),
    }
  }

  userDisconnect(userId: string): void {
    if (!this.userExist(userId)) {
      return
    }

    delete this.connected[userId]
  }

  userExist(userId: string): boolean {
    return this.connected.hasOwnProperty(userId)
  }
}

class ChannelList {
  channels: {
    [id: string]: Channel
  }

  constructor() {
    this.channels = {}
  }

  get(channelId: string): Channel {
    return this.channels[channelId]
  }

  add(channel: Channel): void {
    this.channels[channel.id] = channel
  }

  remove(channelId: string): void {
    delete this.channels[channelId]
  }

  has(channelId: string): boolean {
    return this.channels.hasOwnProperty(channelId)
  }

  removeStaleUser(staleUserId: string[]): void {
    for (const channelId in this.channels) {
      if (!this.channels.hasOwnProperty(channelId)) {
        continue
      }

      const channel = this.channels[channelId]
      for (const userId in channel.connected) {
        if (!channel.connected.hasOwnProperty(userId)) {
          continue
        }

        if (staleUserId.includes(userId)) {
          channel.userDisconnect(userId)
        }
      }
    }
  }

  removeEmptyChannel(): void {
    for (const channelId in this.channels) {
      if (!this.channels.hasOwnProperty(channelId)) {
        continue
      }

      const channel = this.channels[channelId]
      if (Object.keys(channel.connected).length === 0) {
        this.remove(channelId)
      }
    }
  }
}

export const channelList: ChannelList = new ChannelList()
