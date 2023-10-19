const express = require("express")
const PORT = 1987
require("./config/database")
const route = require("./Routers/userRout")

const app = express()
app.use(express.json())
app.use(route)


app.listen(PORT, () => {
    console.log(`server is listening to Port ${PORT}`);
})