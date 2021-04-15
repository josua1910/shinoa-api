const routes = require("express").Router()
const { isLoggedIn } = require("../config/validation")
const path = require("path")
const ejs = require("ejs")
const useragent = require('useragent');

routes.get("/", isLoggedIn, async (req, res) => {
  var agent = useragent.lookup(req.headers['user-agent']).toJSON();
  let options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  let memberSejak = new Date(req.user.created_at).toLocaleDateString('id', options)
  const ipClient = req.headers["x-forwarded-for"] || "You're hacker !"
  const html = await ejs.renderFile(path.join(__dirname + "../../../client/sc_code/template_sbadmin/layout.ejs"), { url: process.env.BASE_URL, file: "./dokumentasi/index.ejs", title: "Dokumentasi", user: req.user, ip: ipClient, memberSejak, agent }, { async: true })
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
routes.get("/nulis", isLoggedIn, async (req, res) => {
  const html = await ejs.renderFile(path.join(__dirname + "../../../client/sc_code/template_sbadmin/layout.ejs"), { url: process.env.BASE_URL, file: "./dokumentasi/nulis.ejs", title: "Mager nulis example" }, { async: true })
  return res.send(html)
})
routes.get("/photooxy", isLoggedIn, async (req, res) => {
  const html = await ejs.renderFile(path.join(__dirname + "../../../client/sc_code/template_sbadmin/layout.ejs"), { url: process.env.BASE_URL, file: "./dokumentasi/photooxy.ejs", title: "Photooxy example" }, { async: true })
  return res.send(html)
})
routes.get("/joox", isLoggedIn, async (req, res) => {
  const html = await ejs.renderFile(path.join(__dirname + "../../../client/sc_code/template_sbadmin/layout.ejs"), { url: process.env.BASE_URL, file: "./dokumentasi/joox_dl.ejs", title: "Joox example" }, { async: true })
  return res.send(html)
})

module.exports = routes
