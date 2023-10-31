const express = require("express")
const cors = require('cors');
const fileUpload = require("express-fileupload");
const PORT = 1987
require("./config/database")
const route = require("./Routers/userRout")
const router = require("./Routers/restaurantRout")

const app = express()
app.use(express.json())
app.use(cors({
    origin: "*"
}))
app.use(fileUpload({ 
    useTempFiles: true
}))
app.use('/uploads', express.static('uploads'));
app.use("/api", route)
app.use("/api", router)

app.get('/', (req, res)=>{
    res.send('Welcome to our online restaurant, Expect to see more..!')
})


app.listen(PORT, () => {
    console.log(`server is listening to Port ${PORT}`);
})