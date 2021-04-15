const express = require("express")
const router = express.Router()
const { msg } = require("../config/msg")
const nulis = require("../fitures/nulis")
const fs = require("fs")
const imgbb = require("imgbb-uploader");
let photooxy = require("../fitures/photooxy")

router.get("/photooxy", async (req, res) => {
  const tema = req.query.tema
  let url
  if (!tema) {
    return res.status(400).json({
      status: res.statusCode,
      error: "parameter tema tidak boleh kosong",
    })
  }
  if (!req.query.teks) {
    return res.status(400).json({
      status: res.statusCode,
      error: "parameter teks tidak boleh kosong",
    })
  }
  if (tema == "neon") {
    url = "https://photooxy.com/logo-and-text-effects/create-party-neon-text-effect-161.html"
  } else if (tema == "dark-metal") {
    url = "https://photooxy.com/other-design/create-dark-metal-text-with-special-logo-160.html"
  } else if (tema == "smoke") {
    url = "https://photooxy.com/logo-and-text-effects/smoke-typography-text-effect-170.html"
  } else if (tema == "coffee") {
    url = "https://photooxy.com/logo-and-text-effects/put-your-text-on-a-coffee-cup--174.html"
  } else if (tema == "scary-gate") {
    url = "https://photooxy.com/logo-and-text-effects/text-on-scary-cemetery-gate-172.html"
  } else if (tema == "wood") {
    url = "https://photooxy.com/logo-and-text-effects/carved-wood-effect-online-171.html"
  } else if (tema == "silk") {
    url = "https://photooxy.com/logo-and-text-effects/simple-text-on-the-silk-167.html"
  } else if (tema == "flower") {
    url = "https://photooxy.com/art-effects/flower-typography-text-effect-164.html"
  } else {
    return res.status(400).json({
      status: res.statusCode,
      error: `Tema dengan nama ${tema} tidak tersedia`
    })
  }
  const fetching = await photooxy(req.query.teks, url)
  console.log(fetching);
  return res.status(200).json({
    status: res.statusCode,
    data: {
      img: fetching
    }
  })

})

router.get("/nulis", async (req, res) => {
  if (!req.query.nama) {
    return res.status(400).json({
      status: res.statusCode,
      error: "parameter nama tidak boleh kosong",
    })
  }
  if (!req.query.kelas) {
    return res.status(400).json({
      status: res.statusCode,
      error: "parameter kelas tidak boleh kosong",
    })
  }
  if (!req.query.teks) {
    return res.status(400).json({
      status: res.statusCode,
      error: "parameter teks tidak boleh kosong",
    })
  }

  const panjangContent = req.query.teks.replace(/(\S+\s*){1,10}/g, "$&\n")
  const teks = panjangContent.split("\n").slice(0, 30).join("\n")

  let result = nulis.proses(req.query.nama, req.query.kelas, teks)
  let options = {
    apiKey: process.env.IMGBB_KEY,
    imagePath: nulis.random,
    expiration: 3600
  }
  result
    .on("error", (e) => {
      return res.status(500).json({
        status: res.statusCode,
        error: msg()[500],
      })
    })
    .on("exit", () => {
      return imgbb(options)
        .then((response) => {
          res.status(200).json({
            status: res.statusCode,
            data: {
              urlImg: response.url,
              info: "url ini akan expired dalam 2 menit!",
            },
          })
          fs.unlinkSync(nulis.random)
        })
        .catch((error) => {
          fs.unlinkSync(nulis.random)
          console.error(error)
        });
      })
})

module.exports = router
