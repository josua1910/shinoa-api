const express = require("express")
const router = express.Router()
const { msg } = require("../config/msg")
const nulis = require("../fitures/nulis")
const fs = require("fs")
const imgbb = require("imgbb-uploader");

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

  let months = ["- 1 -", "- 2 -", "- 3 -", "- 4 -", "- 5 -", "- 6 -", "- 7 -", "- 8 -", "- 9 -", "- 10 -", "- 11 -", "- 12 -"]
  let myDays = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"]
  let date = new Date()
  let day = date.getDate()
  let month = date.getMonth()
  let thisDay = date.getDay()
  thisDay = myDays[thisDay]
  let yy = date.getYear()
  let year = yy < 1000 ? yy + 1900 : yy
  const waktu = day + " " + months[month] + " " + year
  const hari = thisDay

  const panjangContent = req.query.teks.replace(/(\S+\s*){1,10}/g, "$&\n")
  const teks = panjangContent.split("\n").slice(0, 30).join("\n")

  let result = nulis.proses(waktu, hari, req.query.nama, req.query.kelas, teks)
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
