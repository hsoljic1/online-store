const express = require('express')
const router = express.Router()
const db = require("../database")


router.get('/bestOffers', async (req, res, next) => {
    try {
        const result = await db.query(`
            SELECT *
            FROM laptop
            ORDER BY popust DESC
            LIMIT 8
        `)
        res.json(result)
    }
    catch(ex) {
        next(ex)
    }
})

module.exports = router