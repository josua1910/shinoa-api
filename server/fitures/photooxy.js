const axios = require('axios');
const qs = require('qs');
const cheerio = require('cheerio');

module.exports = (teks, url) => {
    const data = qs.stringify({
        'text_1': teks,
        'text_2': teks,
        'login': 'OK' 
    });
    
    const config = {
      method: 'post',
      url,
      headers: { 
        'authority': 'photooxy.com', 
        'content-type': 'application/x-www-form-urlencoded', 
        'user-agent': 'Mozilla/5.0 (Windows NT 6.3; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.128 Safari/537.36', 
        'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,/;q=0.8,application/signed-exchange;v=b3;q=0.9',
      },
      data : data
    }
    
    return axios(config)
    .then(function (response) {
      let $ = cheerio.load(response.data)
      let res = ""
      $(".thumbnail").find("img").each(function() {
        let url = $(this).attr("src")
        res = `https://photooxy.com${url}`
      })
      return res
    })
}