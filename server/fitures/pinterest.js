const axios = require('axios');
const cheerio = require('cheerio')
const { spawn } = require('child_process');
const fs = require('fs')
const path = require('path')

module.exports = (kueri) => {
    const config = {
      method: 'get',
      url: `https://id.pinterest.com/search/pins/?q=${kueri}&rs=typed&term_meta[]=${kueri}|typed`,
      headers: { 
        'User-Agent': 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:87.0) Gecko/20100101 Firefox/87.0', 
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8', 
        'Accept-Language': 'en-US,en;q=0.5', 
        'Upgrade-Insecure-Requests': '1', 
        'Connection': 'keep-alive', 
        'Cookie': process.env.PINTEREST_KUEH
      }
    };
    
    return axios(config)
    .then(async function (response) {
        let random = Math.floor(Math.random() * (2999 - 1111) + 1111)
        let $ = cheerio.load(response.data)
        let script = $('body script[id="initial-state"]')
        let json = JSON.parse(script.html())
        let result = json.resources.data.BaseSearchResource[`appliedProductFilters="---",article=null,auto_correction_disabled=false,corpus=null,customized_rerank_type=null,filters=null,query="${kueri}",query_pin_sigs=null,redux_normalize_feed=true,rs="typed",scope="pins",source_id=null,user=null`].data.results[Math.floor(Math.random() * 10)]
        let media
        if (result.videos != null && result.videos) {
            let lokasi = `${process.env.BASE_URL}/views/pin/${random}.mp4`
            let temp = path.join(__dirname + `/../../client/public/pin/${random}.mp4`)
            return new Promise((resolve, reject) => {
                spawn('ffmpeg', ['-i', result.videos.video_list.V_HLSV4.url, '-bsf:a', 'aac_adtstoasc', '-vcodec', 'copy', '-c', 'copy', '-crf', '50', temp]).on('error', reject).on('close', () => {
                    media = {
                    duration: `${Math.round(result.videos.video_list.V_HLSV4.duration / 1000)} detik`,
                    video: lokasi,
                    thumb: result.videos.video_list.V_HLSV4.thumbnail
                    }
                    setTimeout(() => {
                        fs.unlinkSync(temp)
                    }, 120000)
                    resolve({
                        urlPin: `https://pinterest.com/pin/${result.id}`,
                        uploadAt: new Date(result.created_at).toLocaleDateString('id', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
                        uploadBy: `${result.pinner.full_name} (https://pinterest.com/${result.pinner.username})`,
                        media,
                        info: 'media akan dihapus otomatis dalam 2 menit!'
                    })
                })
            })
        } else {
            media = {
                img: result.images.orig,
            }
            return {
                urlPin: `https://pinterest.com/pin/${result.id}`,
                uploadAt: new Date(result.created_at).toLocaleDateString('id', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
                uploadBy: `${result.pinner.full_name} (https://pinterest.com/${result.pinner.username})`,
                media
            }
        }
    })
    .catch(function (error) {
      console.log(error);
      return false
    });
}