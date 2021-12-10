const express = require('express')
const router = express.Router()
const db = require("../database")

router.get('/notifications', async (req, res) => {
    try {
        const result = await db.query(`
            SELECT * 
            FROM (
                SELECT l.*, p.vrijeme, p.tekst, p.postavio, l.id artikal_id, "Pitanje" vrsta
                FROM pitanje p
                JOIN laptop l
                ON p.artikal_id = l.id
                WHERE postavio NOT IN ('pc2go', 'admin') 
            UNION 
                SELECT l.*, r.vrijeme, r.tekst, r.postavio, l.id artikal_id, "Recenzija" vrsta
                FROM recenzija r
                JOIN laptop l 
                ON r.artikal_id = l.id 
            ) z
            ORDER BY vrijeme DESC
            LIMIT 20
        `)
        res.json(result)
    } 
    catch(ex) {
        next({
            greska: "Greška sa bazom podataka. Nije uspjelo dobavljanje pitanja"
        })
    }
})

router.get('/faq', async (req, res, next) => {
    try {
        const result = await db.query(`
            SELECT * 
            FROM faq
            ORDER BY pitanje
        `)
        res.json(result)
    }
    catch (ex) {
        console.log(ex)
        next(ex)
    }
})


router.get('/:idArtikla', async (req, res, next) => {
    try {
        const { idArtikla } = req.params
        const result = await db.query(`
            SELECT * 
            FROM pitanje
            WHERE artikal_id = ?
              AND babo_id is null
            ORDER BY vrijeme DESC
        `, [idArtikla])
        for(const item of result) {
            item.odgovori = await db.query(`
                SELECT * 
                FROM pitanje
                WHERE babo_id = ?
                ORDER BY vrijeme ASC
            `, [item.id])
        }
        res.json(result)
    } 
    catch(ex) {
        console.log(ex)
        next({
            greska: "Greška sa bazom podataka. Nije uspjelo dobavljanje pitanja"
        })
    }
})

router.post('/', async (req, res, next) => {
    try {
        const { tekst, babo_id, postavio, artikal_id } = req.body
        const result = await db.query(`
            INSERT INTO pitanje (
                tekst, vrijeme, babo_id, postavio, artikal_id
            )
            VALUES (
                ?, sysdate(), ?, ?, ?
            )
        `, [
            tekst, babo_id, postavio, artikal_id
        ])
        res.json(result)
    } 
    catch(ex) {
        console.log(ex)
        next({
            greska: "Nije uspjelo dodavanje pitanja"
        })
    }
})


router.delete('/:id', async (req, res, next) => {
    try {
        const result = await db.query(`
            DELETE FROM pitanje
            WHERE id = ?
        `, [
            req.params.id
        ])
        res.json({
            message: "Obrisano"
        })
    } 
    catch(ex) {
        next({
            greska: "Nije uspjelo brisanje pitanja"
        })
    }
})

router.post('/faq', async (req, res, next) => {
    try {
        const { pitanje, odgovor } = req.body
        const result = await db.query(`
        INSERT INTO faq (
            pitanje,
            odgovor
        )
        VALUES (?, ?)
        `,
            [
                pitanje,
                odgovor
            ])
        if (result.affectedRows == 1) {
            res.send({
                message: "OK"
            })
        }
        else {
            next({
                greska: "Nije uspjelo dodavanje pitanja!"
            })
        }

    }
    catch (ex) {
        next(ex)
    }
})

router.put('/faq/:id', async (req, res, next) => {
    try {
        const { id } = req.params
        const { pitanje, odgovor } = req.body
        const result = await db.query(`
            UPDATE faq
            SET pitanje = ?,
                odgovor = ?
            WHERE id = ?
        `,
            [
                pitanje,
                odgovor,
                parseInt(id)
            ])
        if (result.affectedRows == 1) {
            res.send({
                message: "OK"
            })
        }
        else {
            next({
                greska: "Nije uspjelo uređivanje pitanja!"
            })
        }

    }
    catch (ex) {
        next(ex)
    }
})

router.delete('/faq/:id', async (req, res, next) => {
    try {
        const { id } = req.params
        const result = await db.query(`
            DELETE FROM faq
            WHERE id = ?
        `,
            [
                parseInt(id)
            ])
        if (result.affectedRows == 1) {
            res.send({
                message: "OK"
            })
        }
        else {
            next({
                greska: "Nije uspjelo brisanje pitanja!"
            })
        }
    }
    catch (ex) {

    }
})

router.get('/review/:idArtikla', async (req, res) => {
    try {
        const { idArtikla } = req.params
        const result = await db.query(`
            SELECT * 
            FROM recenzija
            WHERE artikal_id = ?
              ORDER BY vrijeme DESC
        `, [
            idArtikla
        ])
        res.json(result)
    } 
    catch(ex) {
        next({
            greska: "Greška sa bazom podataka. Nije uspjelo dobavljanje recenzija"
        })
    }
})

router.post('/review', async (req, res, next) => {
    try {
        const { tekst, ocjena, postavio, artikal_id } = req.body
        const result = await db.query(`
            INSERT INTO recenzija (
                tekst, vrijeme, ocjena, postavio, artikal_id
            )
            VALUES (
                ?, sysdate(), ?, ?, ?
            )
        `, [
            tekst, ocjena, postavio, artikal_id
        ])
        res.json({
            message: "OK"
        })
    } 
    catch(ex) {
        next({
            greska: "Nije uspjelo dodavanje recenzije"
        })
    }
})


router.delete('/review/:id', async (req, res, next) => {
    try {
        const { id } = req.params
        const result = await db.query(`
            DELETE FROM recenzija
            WHERE id = ?
        `, [
            req.params.id
        ])
        res.json({
            message: "Obrisano"
        })
    } 
    catch(ex) {
        next({
            greska: "Nije uspjelo brisanje pitanja"
        })
    }
})

module.exports = router