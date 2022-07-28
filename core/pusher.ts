import Pusher from "pusher"

const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID || "your_pusher_app_id",
  key: process.env.PUSHER_KEY || "your_pusher_key",
  secret: process.env.PUSHER_SECRET || "your_pusher_secret",
  cluster: process.env.PUSHER_CLUSTER || "your_pusher_cluster",
  useTLS: true,
})

export default pusher
