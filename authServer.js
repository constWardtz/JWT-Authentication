require('dotenv').config()
const express = require('express');
const app = express()
const jwt = require('jsonwebtoken')

/* Middleware */
app.use(express.json())

let refreshTokens = []

app.post('/token', (req, res) => {
    const refreshToken = req.body.token
    if (refreshToken == null) return res.sendStatus(401)
    if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403)
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403)
        const accessToken = generateAccessToken({ name: user.name })
        res.json({ accessToken })
    })
})

app.post('/login', (req, res) => {
    const { username } = req.body
    const user = { name: username }

    const accessToken = generateAccessToken(user)
    const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET)
    refreshTokens.push(refreshToken)
    res.json({ accessToken, refreshToken })

})

function generateAccessToken(user) {
    return jwt.sign(user, process.env.SECRET_ACCESS_TOKEN, { expiresIn: "20s" })
}

const PORT = process.env.PORT || 3002
app.listen(PORT)