const express = require('express')
const app = express()
const cors = require('cors')

const db = require("./database")

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors())

const offersRoutes = require('./routes/offersRoutes')
const orderRoutes = require('./routes/ordersRoutes')
const productRoutes = require('./routes/productsRoutes')
const questionRoutes = require('./routes/questionsRoutes')

app.use('/offers', offersRoutes)
app.use('/products', productRoutes)
app.use('/orders', orderRoutes)
app.use('/questions', questionRoutes)

app.get('/', async (req, res) => {

    res.send("pc2go")
})

app.listen(3001, () => {
    console.log("Pokrenuto na portu 3001")
})

app.use((error, req, res, next) => {
    console.log(error)
    res.status(401).send("Greskica")
})

module.exports = app;