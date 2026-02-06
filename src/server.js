const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();
const app = express();

const connectDB = require("./config/db.config");
connectDB();

app.use(cors());



app.use(express.json());

app.use("/api", require("./routes/testRoutes"));
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/url", require("./routes/urlRoutes"));
app.use("/", require("./routes/urlRoutes"));




app.get("/", (req,res)=>{
    res.send("API running");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=> console.log(`Server running on ${PORT}`));
