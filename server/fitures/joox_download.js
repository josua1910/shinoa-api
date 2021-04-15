const axios = require("axios")

module.exports = async (teks) => {
    try {
        const q = encodeURIComponent(teks)
        const search = `http://api.joox.com/web-fcgi-bin/web_search?callback=mutiara&lang=id&country=id&type=0&search_input=${q}&pn=1&sin=0&ein=29&_=${Date.now()}`

        const configs = {
            method: 'get',
            url: search,
            headers: { 
                'User-Agent': 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:87.0) Gecko/20100101 Firefox/87.0', 
                'Accept': '*/*', 
                'Accept-Language': 'en-US,en;q=0.5', 
                'Origin': 'http://api.joox.com', 
                'Connection': 'keep-alive', 
            }
        }
        
        return axios(configs)
        .then(function (response) {
            let kikis = response.data.slice(8, response.data.length - 1)
            let json = JSON.parse(kikis)
            let id = json.itemlist[0].songid
            const detail = `http://api.joox.com/web-fcgi-bin/web_get_songinfo?songid=${id}&lang=id&country=id&from_type=null&channel_id=null&_=${Date.now()}`

            let config = {
                method: 'get',
                url: detail,
                headers: { 
                    'User-Agent': 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:87.0) Gecko/20100101 Firefox/87.0', 
                    'Accept': '*/*', 
                    'Accept-Language': 'en-US,en;q=0.5', 
                    'Origin': 'http://api.joox.com', 
                    'Connection': 'keep-alive', 
                    'X-Forwarded-For': '36.73.34.109',
                    'Cookie': process.env.JOOX_COOKIE
                }
            }
                
            return axios(config)
            .then(function (response) {
                let kikis = response.data.slice(18, response.data.length - 1)
                let json = JSON.parse(kikis)
                let size = JSON.parse(json.kbps_map)
                return {
                    thumb: json.album_url || json.imgSrc,
                    song: {
                        m4a: json.m4aUrl,
                        mp3: json.mp3Url,
                        mp3_size: `${size["128"] / 1000000} mb`,
                        m4a_size: `${size["96"] / 1000000} mb`,
                        durasi: `${Math.round(json.minterval / 60)} menit`
                    },
                    album: json.malbum,
                    title: json.msong,
                    artist: json.msinger,
                    uploadAt: json.public_time,
                    url: `https://www.joox.com/my-en/single/${json.encodeSongId}`
                }
            })
            .catch(function (error) {
            console.log(error)
            })
        })
        .catch(function (error) {
        console.log(error)
        })
    } catch (e) {
        return false
    }
}