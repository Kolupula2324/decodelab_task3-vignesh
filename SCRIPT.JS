const express = require("express");
const mysql = require("mysql2");

const app = express();
const PORT = 3000;

app.use(express.json());

// Database Connection
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "password",
    database: "studentdb"
});

db.connect((err) => {
    if (err) {
        console.log("Database Connection Failed");
        return;
    }
    console.log("Connected to MySQL Database");
});

// Create Table
db.query(`
CREATE TABLE IF NOT EXISTS students(
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL
)
`);

// Home Route
app.get("/", (req, res) => {
    res.send("Database Integration Project Running");
});

// CREATE
app.post("/students", (req, res) => {

    const { name, email } = req.body;

    if (!name || !email) {
        return res.status(400).json({
            message: "Name and Email are required"
        });
    }

    const sql =
        "INSERT INTO students(name,email) VALUES (?,?)";

    db.query(sql, [name, email], (err, result) => {

        if (err) {
            return res.status(500).json(err);
        }

        res.json({
            message: "Student Added Successfully",
            id: result.insertId
        });
    });
});

// READ ALL
app.get("/students", (req, res) => {

    db.query(
        "SELECT * FROM students",
        (err, results) => {

            if (err) {
                return res.status(500).json(err);
            }

            res.json(results);
        }
    );
});

// READ ONE
app.get("/students/:id", (req, res) => {

    db.query(
        "SELECT * FROM students WHERE id=?",
        [req.params.id],
        (err, results) => {

            if (err) {
                return res.status(500).json(err);
            }

            if (results.length === 0) {
                return res.status(404).json({
                    message: "Student Not Found"
                });
            }

            res.json(results[0]);
        }
    );
});

// UPDATE
app.put("/students/:id", (req, res) => {

    const { name, email } = req.body;

    db.query(
        "UPDATE students SET name=?, email=? WHERE id=?",
        [name, email, req.params.id],
        (err, result) => {

            if (err) {
                return res.status(500).json(err);
            }

            res.json({
                message: "Student Updated Successfully"
            });
        }
    );
});

// DELETE
app.delete("/students/:id", (req, res) => {

    db.query(
        "DELETE FROM students WHERE id=?",
        [req.params.id],
        (err, result) => {

            if (err) {
                return res.status(500).json(err);
            }

            res.json({
                message: "Student Deleted Successfully"
            });
        }
    );
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server Running on http://localhost:${PORT}`);
});