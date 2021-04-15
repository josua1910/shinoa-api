const { spawn } = require("child_process")
const path = require("path")
const dir = path.join(`${__dirname}/../../client/public/nulis`)
const random = `${dir}/${Math.floor(Math.random() * (1999 - 1111) + 1111)}.jpg`

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

module.exports.random = random
module.exports.proses = (nama, kelas, teks) => {
  return spawn("convert", [
    `${dir}/input.jpg`,
    "-font",
    `${dir}/font.ttf`,
    "-size",
    "1024x784",
    "-pointsize",
    "20",
    "-interline-spacing",
    "1",
    "-annotate",
    "+806+78",
    hari,
    "-font",
    `${dir}/font.ttf`,
    "-size",
    "1024x784",
    "-pointsize",
    "18",
    "-interline-spacing",
    "1",
    "-annotate",
    "+806+102",
    waktu,
    "-font",
    `${dir}/font.ttf`,
    "-size",
    "1024x784",
    "-pointsize",
    "18",
    "-interline-spacing",
    "1",
    "-annotate",
    "+360+100",
    nama,
    "-font",
    `${dir}/font.ttf`,
    "-size",
    "1024x784",
    "-pointsize",
    "18",
    "-interline-spacing",
    "1",
    "-annotate",
    "+360+120",
    kelas,
    "-font",
    `${dir}/font.ttf`,
    "-size",
    "1024x784",
    "-pointsize",
    "20",
    "-interline-spacing",
    "-7.5",
    "-annotate",
    "+344+142",
    teks,
    random,
  ])
}
