const cheerio = require("cheerio")
const axios = require("axios")

function unicodeToChar(text) {
  return text.replace(/\\u[\dA-F]{4}/gi, (match) => String.fromCharCode(parseInt(match.replace(/\\u/g, ""), 16)))
}

let fetchHTML = async (url) => {
  const { data } = await axios.get(url)
  return cheerio.load(data)
}

module.exports = async (link) => {
  try {
    const $ = await fetchHTML(link)
    let script = $("script").eq(3).html()
    let obj = unicodeToChar(script)
    let pre = obj.replace(/\\\//g, "/")
    let final = JSON.parse(pre.replace(/\\/g, ""))
    const {
      groups: { H, M, S },
    } = /T((?<H>[0-9]+)H)?((?<M>[0-9]+)M)?((?<S>[0-9]+)S)?/.exec(final.duration)

    const hours = parseInt(H)
    const minutes = parseInt(M)
    const seconds = parseInt(S)
    let durasi
    if (!isNaN(seconds)) {
      durasi = `${seconds / 60} Menit`
      if (!isNaN(minutes)) {
        durasi = `${seconds / 60 + minutes} Menit`
        if (!isNaN(hours)) {
          durasi = `${(hours * 3600 + minutes * 60 + seconds) / 60} Menit`
        }
      }
    }

    let kirim = {
      author: final.author,
      title: final.name,
      desc: final.description,
      thumb: final.thumbnailUrl,
      videoUrl: final.contentUrl,
      jumlah_comment: final.commentCount,
      kualitas: final.videoQuality,
      uploadAt: final.datePublished,
      durasi,
      size: final.contentSize,
    }
    return kirim
  } catch (e) {
    return false
  }
}
