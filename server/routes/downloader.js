const express = require("express")
const router = express.Router()
const { msg } = require("../config/msg")
const ig_dl = require("../fitures/ig_download")
const fb_dl = require("../fitures/fb_download")
const tiktok_download = require("../fitures/tiktok_download")

router.get("/ig", async (req, res) => {
  let result = await ig_dl(req.query.link)
  if (!req.query.link) {
    return res.status(400).json({
      status: res.statusCode,
      error: msg("link")[400],
    })
  }
  if (!result) {
    return res.status(400).json({
      status: res.statusCode,
      error: "Error, dikarenakan url tidak valid atau media tersebut berasal dari akun private!",
    })
  }
  let date = new Date(result.taken_at_timestamp * 1000)
  let rapihkan = {
    uploadBy: result.owner.username,
    full_name: result.owner.full_name,
    timeUpload: JSON.stringify(date).slice(1, 11),
    img: result.display_resources,
    is_video: result.is_video,
    video_url: result.video_url,
    is_audio: result.has_audio,
    view_count: result.video_view_count,
    play_count: result.video_play_count,
    jumlah_like: result.edge_media_preview_like.count,
    caption: result.edge_media_to_caption.edges[0].node.text,
  }
  return res.status(200).json({
    status: res.statusCode,
    data: rapihkan,
  })
})

router.get("/fb", async (req, res) => {
  if (!req.query.link) {
    return res.status(400).json({
      status: res.statusCode,
      error: msg("link")[400],
    })
  }
  if (req.query.link.match(/.*facebook\.com\/.*/g)) {
    let result = await fb_dl(req.query.link)
    if (!result) {
      return res.status(400).json({
        status: res.statusCode,
        error: "Error, dikarenakan hanya support url video dari facebook, silahkan lihat dokumentasi untuk melihat contohnya!",
      })
    }
    return res.status(200).json({
      status: res.statusCode,
      data: result,
    })
  } else {
    return res.statusCode(400).json({
      status: res.statusCode,
      error: "Link tidak valid!",
    })
  }
})

router.get("/tiktok", async (req, res) => {
  if (!req.query.link) {
    return res.status(400).json({
      status: res.statusCode,
      error: msg("link")[400],
    })
  }
  let result = await tiktok_download(req.query.link)
  if (!result) {
    return res.status(500).json({
      status: res.statusCode,
      error: "Error, dikarenakan server sedang maintance!",
    })
  }

  return res.status(200).json({
    status: res.statusCode,
    data: result,
  })
})

module.exports = router
