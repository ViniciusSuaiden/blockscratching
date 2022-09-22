const express = require("express")
const path = require("path")
const app = express()

app.set('views', path.join(__dirname, 'views'))
app.set("view engine", "ejs")

app.use(express.static(path.join(__dirname, 'js')))

app.get("/", (req, res) => {
    res.render("index")
})

app.listen(8080, () => console.log('Client listening on port 80:8080'))