const express = require("express");
const cors = require("cors");
const lockers = require("./routes/lockerRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Locker API server is running.",
    });
});

app.use("/lockers", lockers);

module.exports = app;