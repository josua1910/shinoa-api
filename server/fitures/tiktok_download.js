const axios = require('axios')
const cheerio = require('cheerio')
const fd = require('form-data')

module.exports = function (url) {
     return new Promise((resolve, reject) => {
          const activateCookie = 'https://musicallydown.com/?ref=more'
          const sendReq = 'https://musicallydown.com/download'
          axios.request({
               url: activateCookie,
               method: 'get',
               headers: {
                  'Host': 'musicallydown.com',
                  'User-Agent': 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:87.0) Gecko/20100101 Firefox/87.0',
                  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                  'Accept-Language': 'en-US,en;q=0.5',
                  'Connection': 'keep-alive',
                  'Cookie': process.env.COOKIE_TIKTOK.slice(0, process.env.COOKIE_TIKTOK.length - 13),
                  'Upgrade-Insecure-Requests': '1'
               }
          })
          .then(({ data }) => {
            const $ = cheerio.load(data)
            const link = $('form > div > div > input').eq(0).attr('name')
            const token = $('form > div > div > input').eq(1).attr('name')
            const tokenVal = $('form > div > div > input').eq(1).attr('value')
            
            const formData = new fd();
            formData.append(link, url);
            formData.append(token, tokenVal);
            formData.append('verify', '1');

            const config = {
            method: 'post',
            url: 'https://musicallydown.com/download',
            headers: { 
            'User-Agent': 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:87.0) Gecko/20100101 Firefox/87.0', 
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8', 
            'Accept-Language': 'en-US,en;q=0.5', 
            'Content-Type': `multipart/form-data; boundary=${formData.getBoundary()}`, 
            'Origin': 'https://musicallydown.com', 
            'Connection': 'keep-alive', 
            'Referer': 'https://musicallydown.com/?ref=more', 
            'Cookie': process.env.COOKIE_TIKTOK, 
            'Upgrade-Insecure-Requests': '1', 
            'TE': 'Trailers', 
            },
            data: formData
            };

            return axios(config)
            .then(function (response) {
                  const jq = cheerio.load(response.data)
                  const mp4 = jq('div[class="col s12 l8 left-align"] > a').eq(1).attr('href')
                  const thumb = jq('div[class="col s12 l4 center-align"] > video').attr('poster')
                  resolve({
                        mp4,
                        thumb,
                  })
            })
            .catch(function (error) {
                  console.log(error);
            });

          })
          .catch(reject)
     })
}