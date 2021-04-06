const express = require("express")
const router = express.Router()
const { msg } = require("../config/msg")
const tebakGambar = require("../fitures/tebak_gambar")

router.get("/tebakGambar", async (req, res) => {
  let result = await tebakGambar()
  if (result) {
    return res.status(200).json({
      status: res.statusCode,
      data: result,
    })
  } else {
    return res.status(408).json({
      status: res.statusCode,
      error: msg(null, null)[408],
    })
  }
})

module.exports = router
