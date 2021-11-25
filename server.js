require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')

const app = express()
app.use(express.json())

const URI = process.env.MONGODB_URL
mongoose.connect(URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, err => {
    if (err) throw err;
    console.log('Connected to MongoDB.');
})

app.use('/user', require('./routes/userRouter'))
app.use('/site', require('./routes/siteRouter'))

app.get('/', (req, res) => {
    res.json({ msg: 'ON AIR!!!' })
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
    console.log('Server is running on port', PORT);
})