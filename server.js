const express = require("express")
const cors = require('cors');
const fileUpload = require("express-fileupload");
const PORT = 1987
require("./config/database")
const route = require("./Routers/userRout")

const app = express()
app.use(express.json())
app.use(cors({origin: "*"}));
app.use("/api", route)


app.listen(PORT, () => {
    console.log(`server is listening to Port ${PORT}`);
})