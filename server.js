const express = require("express");
const mysql = require("mysql2");

const app = express();
app.use(express.json());

const dbUrl = process.env.MYSQL_URL;

// Parse Railway MySQL URL
const urlObj = new URL(dbUrl);

const db = mysql.createConnection({
    host: urlObj.hostname,
    user: urlObj.username,
    password: urlObj.password,
    database: urlObj.pathname.replace("/", ""),
    port: urlObj.port,
});

// Connect DB
db.connect((err) => {
    if (err) {
        console.log("DB CONNECTION FAILED:", err);
    } else {
        console.log("MySQL Connected Successfully!");
    }
});

// CREATE TABLES ROUTE
app.get("/create-tables", (req, res) => {
    const queries = [
        `CREATE TABLE IF NOT EXISTS range_table (
            range_id INT AUTO_INCREMENT PRIMARY KEY,
            range_start INT NOT NULL,
            range_end INT NOT NULL
        )`
    ];

    queries.forEach(query => {
        db.query(query, (err) => {
            if (err) console.log("Error:", err);
        });
    });

    res.send("All tables created successfully!");
});

// Get all ranges
app.get("/ranges", (req, res) => {
    const query = "SELECT * FROM range_table";
    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ error: "Database error" });
        res.json(results);
    });
});

// SERVER START
app.listen(3000, () => {
    console.log("Server running on PORT 3000");
});
