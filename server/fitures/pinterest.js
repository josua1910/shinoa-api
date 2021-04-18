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
        'Cookie': 'csrftoken=5ca1a364d4fcf7e8dcb416b8cffaa54f; _pinterest_sess=TWc9PSY0U1MxbzVkT1NQcEc3SWVEa3p4UTVpVWF1cGpNckRxMkhpSldEVVhHeEZ0dlFSN1R6MSsyZHlTazhFeTB3ZFpFMmI3TE1lUUNHRC94VmVmSVRKdHVDbWwxdWMzSGhlY1Q1YlEwM3VxZHpOdzJQbGxKWk42bFEzRFNDdlB2VnJZaVNkbWJwK2lPMkJMN3NOYkNOcGNTekdVSEVnemZoN0h5TkFHMXFYaGNNdGlkNmUzc1pocXhXb1luRjFKV2lpWkNBUDQzRTBBTHJZRWNKOUQ2NzlNZ01VNWRXZDRKSHIwZEloZTU1SzhQWTVxQUNFZi9MRm9uRlpuS3d6d3J6WEhlSTQ0T09tWWR1MEtqay9qOW5scDFpUWJCby8vRTRBZHF1czBDYTZXU1pDNUFsdEsyOG5ZY3NoWGNFVVg2ZytZTWluYlc3dFdCeGpyeXpvYktkTXJjS0Q0MHRtVEk2TWMrNlhNYllsS2kxbzRHMmNvOGRWdHRYUlFvWnVPa25MbGpqdFEzUlUzaUpwTzRSVU5oVFNOeVBYTHhHaTJ3L2pWZlFVbURlUWJaaGFXb2pPRkViUnlOSTBPSTFhUSthOGoxYjU4RjMrR3J3aDhCUmtOZndPV2MySmp2WklPamxoVEF1cklNNTBFS3EyRT0mWFY2MXZ1L2xDR2lQam5kdS9PelhTOVFzTkxVPQ==; _auth=1; g_state={"i_l":0}; disableUnauthGoogleOneTap=1; _b="AVf4peVvfAtL8J0r4F6md+1dvYDYPUFU+AzROoyUBlmhYDmFcf/Vjvw93eiAHHKIcpg="; cm_sub=none; bei=false; _routing_id="ac5c4f97-fa56-47d7-8dc4-1a59cc1925f3"; sessionFunnelEventLogged=1; _pinterest_referrer=https://www.google.com/; csrftoken=c78d8166cd328dac70bc04e53a1f03da; _pinterest_sess=TWc9PSZxL1ZadGtLajlNUXkwT042bWxVNnEwSG5nSXhxbERFSGhrVXIrR05vVGdEdE5JdXdWME0zdkQxL2M5YU9BNDVQOFFBbGtQWWNrb000elpPYUdPWTV5RWVBRVNwUzMvN21FV3NSRW5TQkpsQXFyQ0x1UzUrcm1ySnhkWm5IbFovWjdUZ0k4Q1h0TFdDQ2tENFgwano1NlE9PSZxM3Raelptb2M4UzRNeHhZYjFwbXZUeDcrRDg9; _auth=0; _routing_id="1a551902-e1d6-4669-afb8-feeeb5f3aac1"'
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
        let akhir
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
                    akhir = {
                    urlPin: `https://pinterest.com/pin/${result.id}`,
                    uploadAt: new Date(result.created_at).toLocaleDateString('id', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
                    uploadBy: `${result.pinner.full_name} (https://pinterest.com/${result.pinner.username})`,
                    media,
                    info: 'media akan dihapus otomatis dalam 2 menit!',
                    }
                    setTimeout(() => {
                        fs.unlinkSync(temp)
                    }, 120000)
                    resolve(akhir)
                })
            })
        } else {
            media = {
                img: result.images.orig,
            }
            akhir = {
                urlPin: `https://pinterest.com/pin/${result.id}`,
                uploadAt: new Date(result.created_at).toLocaleDateString('id', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
                uploadBy: `${result.pinner.full_name} (https://pinterest.com/${result.pinner.username})`,
                media
            }
            return akhir
        }
    })
    .catch(function (error) {
      console.log(error);
      return false
    });
}