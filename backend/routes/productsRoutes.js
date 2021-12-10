const express = require('express')
const router = express.Router()
const db = require("../database")
const multer = require('multer')

const similarity = (product, filter) => {
    let sim = 0
    Object.keys(filter).forEach(key => {
        if(typeof(filter[key]) == 'object') {
            const value = filter[key]
            if(!(value.min && value.min > product[key]) && !(value.max && value.max < product[key])) {
                sim += 1
            } 
        }
        else {
            const value = filter[key].toString()
            const pvalue = (product[key] || '').toString()
            let found = 0
            const val_split = value.toLowerCase().split(' ')
            const pval_split = pvalue.toLowerCase().split(' ')
            val_split.forEach(word => {
                if(pval_split.indexOf(word) != -1) {
                    found++
                }
            })
            sim += found / (val_split.length || 1)
        }
    })
    return sim
}

router.post('/similar', async (req, res, next) => {
    try {
        const filter = req.body
        let laptops = await db.query(`
            SELECT l.*, COALESCE((SELECT AVG(ocjena) FROM recenzija WHERE artikal_id = l.id), 0) ocjena
            FROM laptop l
        `)
        laptops.forEach(l => l.similarity = similarity(l, filter))
        laptops.sort((a, b) => a.similarity == b.similarity ? 0 : (a.similarity > b.similarity ? -1 : 1))
        laptops = laptops.slice(0, 4)
        
        for(const laptop of laptops) {
            laptop.slike = await db.query(`
                SELECT id, defaultna
                FROM slike
                WHERE laptop_id = ?
                ORDER BY defaultna DESC, id ASC
            `, [laptop.id])
        }
        res.json(laptops)
    } 
    catch(ex) {
        next(ex)
    }
})

router.get('/min-max', async (req, res, next) => {
    try {
        const result = await db.query(`
            SELECT min(cijenaSaPopustom) minCijena, max(cijenaSaPopustom) maxCijena, min(memorija) minMemorija, max(memorija) maxMemorija, min(velicinaDiska) minVelicinaDiska, max(velicinaDiska) maxVelicinaDiska
            FROM laptop
        `)
        res.json(result[0])
    }
    catch(e) {
        console.log(e)
        next(e)
    }
})

router.get('/', async (req, res, next) => {
    try {
        const result = await db.query(`
            SELECT l.*, COALESCE((SELECT AVG(ocjena) FROM recenzija WHERE artikal_id = l.id), 0) ocjena
            FROM laptop l
        `)
        for(const laptop of result) {
            laptop.slike = await db.query(`
                SELECT id, defaultna
                FROM slike
                WHERE laptop_id = ?
                ORDER BY defaultna DESC, id ASC
            `, [laptop.id])
        }
        res.json(result)
    } 
    catch(ex) {
        next(ex)
    }
})

router.get('/:id', async (req, res, next) => { 
    try {
        const { id } = req.params
        const result = await db.query(`
            SELECT *, COALESCE((SELECT AVG(ocjena) FROM recenzija WHERE artikal_id = ?), 0) ocjena
            FROM laptop 
            WHERE id = ?
        `, 
        [
            id, id
        ])
        if(!result) {
            throw "Nema tog artikla"
        }
        else {
            result[0].slike = await db.query(`
                SELECT id, defaultna
                FROM slike
                WHERE laptop_id = ?
                ORDER BY defaultna DESC, id ASC
            `, [id])
            res.json(result[0])
        }
    } 
    catch(ex) {
        next(ex)
    }
})

router.post('/', async (req, res, next) => {
    try{
        const {
            sifra,
            proizvodjac, 
            model, 
            procesor, 
            graficka, 
            memorija, 
            velicinaDiska, 
            tipDiska, 
            portovi, 
            velicinaEkrana, 
            os, 
            cijena, 
            popust, 
            cijenaSaPopustom, 
            opis, 
            rezolucijaEkrana, 
            garancija,
            tipMemorije
        } = req.body
        const result = await db.query(`
            INSERT INTO laptop (
                sifra, 
                proizvodjac, 
                model, 
                procesor, 
                graficka, 
                memorija, 
                velicinaDiska, 
                tipDiska, 
                portovi, 
                velicinaEkrana, 
                os, 
                cijena, 
                popust, 
                cijenaSaPopustom, 
                opis, 
                rezolucijaEkrana, 
                garancija,
                tipMemorije)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, 
        [
            sifra,
            proizvodjac, 
            model, 
            procesor, 
            graficka, 
            memorija, 
            velicinaDiska, 
            tipDiska, 
            portovi, 
            velicinaEkrana, 
            os, 
            cijena, 
            popust, 
            cijenaSaPopustom, 
            opis, 
            rezolucijaEkrana, 
            garancija,
            tipMemorije
        ])
        if(result.affectedRows == 1) {
            res.send({
                id: result.insertId
            })
        }
        else {
            next({
                greska: "Nije uspjelo dodavanje artikla!"
            })
        }
    }
    catch(ex) {
        next(ex)
    }
})

const upload = multer({
    storage: multer.memoryStorage()
})
router.post('/files', upload.array('images', 20), async (req, res, next) => {
    console.log(req.body.removedImages)
    try {
        for(const file of req.files) {
            const res = await db.query(`
                INSERT INTO slike (
                    slika, laptop_id
                )
                VALUES (
                    ?, ?
                )
            `, [file.buffer, req.body.id])
        }
        for(const image of JSON.parse(req.body.removedImages)) {
            await db.query(`
                DELETE FROM slike
                WHERE id = ?
            `, [image.id])
        }
        res.json({ message: "OK" })
    }
    catch(error) {
        res.send(error)
    }
})

router.get('/image/:id', async (req, res, next) => {
    const r = await db.query(`
        SELECT slika "slika"
        FROM slike 
        WHERE id = ?
    `, [req.params.id]
    );
    if(r.length) {
        res.send(r[0].slika)
    }
    else {
        res.send('Ne postoji ta slika')
    }
})

router.put('/:id', async (req, res, next) => {
    try {
        const { id } = req.params
        const {
            sifra,
            proizvodjac, 
            model, 
            procesor, 
            graficka, 
            memorija, 
            velicinaDiska, 
            tipDiska, 
            portovi, 
            velicinaEkrana, 
            os, 
            cijena, 
            popust, 
            cijenaSaPopustom, 
            opis, 
            rezolucijaEkrana, 
            garancija,
            tipMemorije
        } = req.body
        const result = await db.query(`
            UPDATE laptop
            SET sifra = ?,
                proizvodjac = ?,
                model = ?,
                procesor = ?,
                graficka = ?,
                memorija = ?,
                velicinaDiska = ?,
                tipDiska = ?,
                portovi = ?,
                velicinaEkrana = ?,
                os = ?,
                cijena = ?,
                popust = ?,
                cijenaSaPopustom = ?,
                opis = ?,
                rezolucijaEkrana = ?,
                garancija = ?,
                tipMemorije = ?
            WHERE id = ?
        `,
        [
            sifra,
            proizvodjac, 
            model, 
            procesor, 
            graficka, 
            memorija, 
            velicinaDiska, 
            tipDiska, 
            portovi, 
            velicinaEkrana, 
            os, 
            cijena, 
            popust, 
            cijenaSaPopustom, 
            opis, 
            rezolucijaEkrana, 
            garancija,
            tipMemorije,
            id
        ])
        if(result.affectedRows == 1) {
            res.send({
                message: "OK"
            })
        }
        else {
            next({
                greska: "Nije uspjelo uređivanje artikla!"
            })
        }

    }
    catch(ex) {
        console.log(ex)
        next(ex)
    }
})

router.delete('/:id', async (req, res, next) => {
    try {
        const { id } = req.params
        const result = await db.query(`
            DELETE FROM laptop
            WHERE id = ?    
        `,
        [
            parseInt(id)
        ])
        if(result.affectedRows == 1) {
            res.send({
                message: "OK"
            })
        }
        else {
            next({
                greska: "Nije uspjelo brisanje artikla!"
            })
        }
    }
    catch(ex) {

    }
})


module.exports = router