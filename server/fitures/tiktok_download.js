const axios = require('axios')
const cheerio = require('cheerio')
const qs = require('qs')

module.exports = function TIKTOD(url) {
     return new Promise((resolve, reject) => {
          var BASEurl = 'https://ssstik.io'
          axios.request({
               url: BASEurl,
               method: 'get',
               headers: {
                    'cookie': process.env.COOKIE_TIKTOK,
                    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.90 Safari/537.36',
                    'sec-ch-ua': '"Google Chrome";v="89", "Chromium";v="89", ";Not A Brand";v="99"'
               }
          })
          .then(({ data }) => {
              const $ = cheerio.load(data)
              const urlPost = $('form[data-hx-target="#target"]').attr('data-hx-post')
              const tokenJSON = $('form[data-hx-target="#target"]').attr('include-vals')
              const tt = tokenJSON.replace(/'/g, '').replace('tt:', '').split(',')[0]
              const ts = tokenJSON.split('ts:')[1]
              var config = {
                    headers: {
                        'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
                        'cookie': process.env.COOKIE_TIKTOK,
                        'sec-ch-ua': '"Google Chrome";v="89", "Chromium";v="89", ";Not A Brand";v="99"',
                        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.90 Safari/537.36',
                    },
                    dataPost: {
                        'id': url,
                        'locale': 'en',
                        'tt': tt,
                        'ts': ts
                    }
              }
              axios.post(BASEurl + urlPost, qs.stringify(config.dataPost), { headers: config.headers })
                    .then((results) => {
                        data = results.data
                        const $ = cheerio.load(data)
                        const result = {
                              caption: $('div > p.maintext').text(),
                              thumb: $('div > img').attr('src'),
                              video: $('div > a.without_watermark_direct').attr('href'),
                              music: $('div > a.music').attr('href')
                        }
                        if ($('div > a.without_watermark_direct').attr('href') !== undefined) {
                              resolve(result)
                        } else {
                              reject({ message: 'Tautan ini telah terunduh sebelumnya' })
                        }
                    })
                    .catch(reject)
          })
          .catch(reject)
     })
}