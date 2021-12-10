const express = require('express')
const router = express.Router()
const db = require('../database')
const sendMail = require('../utils/send-mail')

router.get('/', async (req, res, next) => {
    try {
        let result = await db.query(`
            SELECT *
            FROM narudzba 
            ORDER BY vrijeme desc
        `)
        for(const narudzba of result) {
            narudzba.artikli = await db.query(`
                SELECT l.*, na.kolicina
                FROM narudzba_artikal na
                JOIN laptop l
                ON na.artikal_id = l.id
                WHERE narudzba_id = ?
            `, [narudzba.id])
            let suma = 0
            for(const a of narudzba.artikli) {
                suma += a.cijena * a.kolicina
            }
            narudzba.ukupno = suma
        }
        res.json(result)
    }
    catch(ex) {
        console.log(ex)
        next(ex)
    } 
})

router.get('/:id', async (req, res, next) => {
    try {
        const { id } = req.params
        const narudzba = await db.query(`
            SELECT *
            FROM narudzba
            WHERE id = ?
        `, [id])
        if(!narudzba.length) {
            res.status(400).json({
                greska: "Ne postoji narudzba sa id " + id
            })
        }
        else {
            narudzba[0].artikli = await db.query(`
                SELECT l.*, na.kolicina
                FROM narudzba_artikal na
                JOIN laptop l
                ON na.artikal_id = l.id
                WHERE narudzba_id = ?
            `, [id])
            res.json(narudzba[0])
        }
    }
    catch (exc) {
        console.log(exc)
        next({
            greska: "Greška sa bazom podataka"
        })
    }
})

router.post('/', async (req, res, next) => {
    try {
        let { ime, prezime, email, broj_telefona, adresa, artikli, odobrena } = req.body
        artikli = artikli.filter(a => a.kolicina)
        const narudzba = await db.query(`
            INSERT INTO narudzba(
                ime, prezime, email, broj_telefona, adresa, odobrena, vrijeme
            )
            VALUES (
                ?, ?, ?, ?, ?, ?, sysdate()
            )
        `, [ime, prezime, email, broj_telefona, adresa, 0])
        for(let i = 0; i < artikli.length; i++) {
            await db.query(`
                INSERT INTO narudzba_artikal (
                    narudzba_id, artikal_id, kolicina
                )
                VALUES (
                    ?, ?, ?
                )
            `, [narudzba.insertId, artikli[i].id, artikli[i].kolicina])
        }
        sendMail(email, req.body, narudzba.insertId)
        res.json({ id: narudzba.insertId })
    }
    catch(exc) {
        console.log(exc)
        next({
            greska: "Nije uspjelo dodavanje narudzbe"
        })
    }
})

router.put('/:id', async (req, res, next) => {
    try {
        const { id } = req.params
        const { odobrena } = req.body
        const result = await db.query(`
            UPDATE narudzba
            SET odobrena = ?
            WHERE id = ?
        `, [odobrena, id])
        res.json({ message: "OK" })
    }
    catch(exc) {
        console.log(exc)
        next({
            greska: "Nije uspio update narudzbe"
        })
    }
})

module.exports = router