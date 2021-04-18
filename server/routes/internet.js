const express = require("express")
const router = express.Router()
const { msg } = require("../config/msg")
const pin = require("../fitures/pinterest")

router.get("/pinterest", async (req, res) => {
    if (!req.query.q) {
        res.status(400).json({
            status: res.statusCode,
            error: msg('q')[400]
        })
    }
    let result = await pin(req.query.q)
    console.log(result)
    if (result) {
        res.status(200).json({
            status: res.statusCode,
            data: result
        })
    } else {
        res.status(500).json({
            status: res.statusCode,
            error: msg()[500]
        })
    }
})

module.exports = router
