require('dotenv').config()
const express = require('express');
const app = express()
const jwt = require('jsonwebtoken')

/* Middleware */
app.use(express.json())
const posts = [{
        id: 1,
        username: "edward",
        author: "Edward",
        post: "It is great!"
    },
    {
        id: 2,
        username: "const",
        author: "Const",
        post: "It is nice!"
    }
]

app.get('/posts', authenticateToken, (req, res) => {
    res.json(posts.filter(post => post.username === req.user.name))
})


function authenticateToken(req, res, next) {
    const authHeader = req.header('authorization')
    const token = authHeader && authHeader.split(' ')[1]

    if (token == null) return res.sendStatus(401)
    jwt.verify(token, process.env.SECRET_ACCESS_TOKEN, (err, user) => {
        if (err) return res.sendStatus(403)
        req.user = user
        next()
    })
}
const PORT = process.env.PORT || 3001
app.listen(PORT)