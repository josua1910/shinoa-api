const express = require("express")
const router = express.Router()
const { msg } = require("../config/msg")
const nulis = require("../fitures/nulis")
const fs = require("fs")
const axios = require("axios")
const FormData = require("form-data")
const data = new FormData()

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
  result
    .on("error", (e) => {
      return res.status(500).json({
        status: res.statusCode,
        error: msg()[500],
      })
    })
    .on("exit", () => {
      return fs.readFile(nulis.random, function (err, img) {
        if (err) {
          return res.status(500).json({
            status: res.statusCode,
            error: msg()[500],
          })
        }
        let encodedImage = new Buffer.from(img, "binary").toString("base64")
        data.append("image", encodedImage)

        let config = {
          method: "post",
          url: `https://api.imgbb.com/1/upload?expiration=120&key=${process.env.IMGBB_KEY}`,
          headers: {
            ...data.getHeaders(),
          },
          data: data,
        }

        return axios(config)
          .then(function (response) {
            let {
              data: { url },
            } = response.data
            res.status(200).json({
              status: res.statusCode,
              data: {
                url,
                info: "url ini akan expired dalam 2 menit!",
              },
            })
            fs.unlinkSync(nulis.random)
          })
          .catch(function (e) {
            fs.unlinkSync(nulis.random)
            return res.status(408).json({
              status: res.statusCode,
              error: msg()[408],
            })
          })
      })
    })
})

module.exports = router
