const express = require('express');
const mysql = require('mysql')
const cors = require('cors')
const bcrypt = require('bcrypt');
const salt = 10;

const app = express()
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: "localhost",
    user: 'root',
    password: '',
    database: 'secure_voting'
});

// Connect to MySQL
db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL');
});

app.post('/registrationForm',(req,res)=>{

    const sql = "INSERT INTO voter (firstName, lastName, dob, address, email, phoneNumber, taxFileNumber, publicKey, username, password) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    const username = req.body.username;
    const password = req.body.password;
    

    bcrypt.hash(username.toString(), salt, (err,hashU) => {
        if(err){
            console.log(err);   
        }
        bcrypt.hash(password.toString(), salt, (err,hashP) =>{
            if(err){
                console.log(err);   
            }
            const values = [
                req.body.firstName,
                req.body.lastName,
                req.body.dob,
                req.body.address,
                req.body.email,
                req.body.phoneNumber,
                req.body.taxFileNumber,
                req.body.publicKey,
                hashU,
                hashP,
            ]
        
            db.query(sql, values, (err,data) =>{
                if(err) return res.json(err);
                return res.json(data);
            })
        })
    })   
})

app.post('/login',(req,res)=>{

    const sql = "SELECT * FROM voter WHERE username = ? AND password = ?";
    
    db.query(sql, [req.body.username, req.body.password], (err,data) =>{
                if(err) {
                    return res.json(err);
                }
                if(data.length > 0){
                    return res.json("Success");
                }
                else{
                    return res.json("Failed");
                }

            })
    })

app.listen(8081,()=> {
    console.log("listening");
})