require('dotenv').config()
const express = require('express');
const app = express()
const jwt = require('jsonwebtoken')

/* Middleware */
app.use(express.json())

app.post('/login', (req, res) => {
    const { username } = req.body
    const user = { name: username }

    const accessToken = generateAccessToken(user)
    const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET)
    res.json({ accessToken, refreshToken })

})

function generateAccessToken(user) {
    return jwt.sign(user, process.env.SECRET_ACCESS_TOKEN, { expiresIn: "20s" })
}

const PORT = process.env.PORT || 3002
app.listen(PORT)