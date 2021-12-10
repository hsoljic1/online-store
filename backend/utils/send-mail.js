const nodemailer = require('nodemailer')
const db = require('../database')

const MAIL = 'orders.pc2go@gmail.com'
const PASSWORD = 'laptopi123+'

const sendMail = async (toMail, data, orderId) => {
    let content = ''
    let total = 0
    const laptops = await db.query(`
        SELECT * 
        FROM laptop
    `)

    const { ime, prezime, broj_telefona, email, adresa, artikli } = data
    const items = artikli.map(a => {
        const laptop = laptops.find(x => x.id == a.id)
        return {
            naziv: laptop.proizvodjac + " " + laptop.model,
            ukupno: parseFloat(laptop.cijena) * parseFloat(a.kolicina),
            id: a.id,
            kolicina: a.kolicina
        }
    })
    content += `Zdravo ${ime}, <br> <br>
        hvala Vam za kupovinu u našoj prodavnici. U narednom periodu ćemo vam se javiti kako bi se dogovorili
        o načinu preuzimanja/dostave artikala. Ispod se nalaze podaci koje ste unijeli na našoj stranici kako bi još jednom
        mogli da ih provjerite. <br> <br>
    `
    content += `<div> Id narudžbe: ${orderId} </div>`
    content += `<div> Ime: ${ime} </div>`
    content += `<div> Prezime: ${prezime} </div>`
    content += `<div> Broj telefona: ${broj_telefona} </div>`
    content += `<div> Email: ${email} </div>`
    content += `<div> Adresa: ${adresa} </div>`
    content += `<br>`
    const ts = `style="border: 1px solid #ced2d8; border-collapse: collapse; text-align: center; padding: 0.375rem;"`
    content += `<table ${ts}>`
    content += `<tr>`
    content += `<th ${ts}> Naziv </th>`
    content += `<th ${ts}> Količina </th>`
    content += `<th ${ts}> Ukupno </th>`
    content += `</tr>`
    for(const item of items) {
        content += `<tr ${ts}>`
        content += `<td ${ts}>${item.naziv}</td>`
        content += `<td ${ts}>${item.kolicina}</td>`
        content += `<td ${ts}>${item.ukupno} KM</td>`
        content += `</tr>`
        total += item.ukupno
    }
    content += '</table>'
    content += `<div style="font-weight: 600; margin-top: 0.25rem;"> Ukupno: ${total} KM </div>`
    content += `<br> <br> Lijep pozdrav, <br> pc2go Tim.`
    return new Promise((resolve, reject) => {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: MAIL,
                pass: PASSWORD
            }
        });
        var mailOptions = {
            from: MAIL,
            to: toMail,
            subject: 'Potvrda narudžbe',
            html: content
        }
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                reject(error)
            } else {
                resolve(info)
            }
        })
    })
}

module.exports = sendMail