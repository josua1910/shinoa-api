const routes = require("express").Router()
const { isLoggedIn } = require("../config/validation")
const path = require("path")
const ejs = require("ejs")

routes.get("/", isLoggedIn, async (req, res) => {
  const html = await ejs.renderFile(path.join(__dirname + "../../../client/sc_code/template_sbadmin/layout.ejs"), { url: process.env.BASE_URL, file: "./dokumentasi/index.ejs", title: "Dokumentasi" }, { async: true })
  return res.send(html)
})
routes.get("/tiktok", isLoggedIn, async (req, res) => {
  const html = await ejs.renderFile(path.join(__dirname + "../../../client/sc_code/template_sbadmin/layout.ejs"), { url: process.env.BASE_URL, file: "./dokumentasi/tiktok.ejs", title: "Tiktok example" }, { async: true })
  return res.send(html)
})
routes.get("/ig_dl", isLoggedIn, async (req, res) => {
  const html = await ejs.renderFile(path.join(__dirname + "../../../client/sc_code/template_sbadmin/layout.ejs"), { url: process.env.BASE_URL, file: "./dokumentasi/ig_dl.ejs", title: "Instagram example" }, { async: true })
  return res.send(html)
})
routes.get("/ig_stalk", isLoggedIn, async (req, res) => {
  const html = await ejs.renderFile(path.join(__dirname + "../../../client/sc_code/template_sbadmin/layout.ejs"), { url: process.env.BASE_URL, file: "./dokumentasi/ig_stalk.ejs", title: "Instagram example" }, { async: true })
  return res.send(html)
})
routes.get("/fb", isLoggedIn, async (req, res) => {
  const html = await ejs.renderFile(path.join(__dirname + "../../../client/sc_code/template_sbadmin/layout.ejs"), { url: process.env.BASE_URL, file: "./dokumentasi/fb.ejs", title: "Facebook example" }, { async: true })
  return res.send(html)
})
routes.get("/tebakgambar", isLoggedIn, async (req, res) => {
  const html = await ejs.renderFile(path.join(__dirname + "../../../client/sc_code/template_sbadmin/layout.ejs"), { url: process.env.BASE_URL, file: "./dokumentasi/tebak_gambar.ejs", title: "Tebak gambar example" }, { async: true })
  return res.send(html)
})

module.exports = routes
