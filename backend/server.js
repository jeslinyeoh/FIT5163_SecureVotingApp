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
    const password = req.body.password;
    

    bcrypt.hash(password.toString(), salt, (err,hash) => {
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
            req.body.username,
            hash,
        ]
        
        db.query(sql, values, (err,data) =>{
            if(err) return res.json(err);
            return res.json(data);
        })
    })
    
})

app.listen(8081,()=> {
    console.log("listening");
})