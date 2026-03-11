require('dotenv').config()
const express = require('express')
const cors = require('cors')
const postRoutes = require('../server/routes/postRoutes')
const authRoutes = require('../server/routes/authRoutes')

const app = express()
const port = process.env.port || 4000

app.use(express.json())
app.use(cors())

app.use('/api/auth', authRoutes)
app.use('/api/posts', postRoutes)

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})