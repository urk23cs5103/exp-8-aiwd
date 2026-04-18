onst express = require("express");
const mysql = require("mysql");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

// MySQL connection
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",   // your MySQL password
    database: "eventdb"
});

db.connect(err => {
    if (err) throw err;
    console.log("MySQL Connected");
});

// Registration
app.post("/register", (req, res) => {

    let { regno, name, events } = req.body;

    if (!events) return res.send("Select at least one event");

    if (!Array.isArray(events)) events = [events];

    if (events.length > 3) {
        return res.send("You can select maximum 3 events only");
    }

    let eventList = events.join(", ");

    let sql = "INSERT INTO registrations VALUES (?, ?, ?)";

    db.query(sql, [regno, name, eventList], (err) => {
        if (err) {
            return res.send("Duplicate Register Number not allowed");
        }
        res.send("Registration Successful");
    });

});

// Search
app.get("/search", (req, res) => {

    let regno = req.query.regno;

    let sql = "SELECT * FROM registrations WHERE regno = ?";

    db.query(sql, [regno], (err, result) => {

        if (result.length === 0) {
            return res.send("No record found");
        }

        let user = result[0];

        res.send(`
            <h2>Details</h2>
            Register Number: ${user.regno}<br>
            Name: ${user.name}<br>
            Events: ${user.events}
        `);
    });

});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});
