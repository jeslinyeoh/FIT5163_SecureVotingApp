const express = require('express');
const mysql = require('mysql')
const cors = require('cors')
const bcrypt = require('bcrypt');
const constantSalt = '$2b$10$p4bLZTdIw.5oXfLm8V1/Nu';

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
    const taxFileNumber = req.body.taxFileNumber;
    

    bcrypt.hash(username.toString(), constantSalt, (err,hashU) => {
        if(err){
            console.log(err);   
        }
        bcrypt.hash(password.toString(), constantSalt, (err,hashP) =>{
            if(err){
                console.log(err);   
            }
            bcrypt.hash(taxFileNumber.toString(), constantSalt, (err,hashT) =>{
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
                    hashT,
                    req.body.publicKey,
                    hashU,
                    hashP,
                ]
        
                db.query(sql, values, (err,data) =>{
                    if(err) return res.json(err);
                    return res.json(data);
                });
            });
        });
    });   
});

app.post('/login',(req,res)=>{

    const sql = "SELECT * FROM voter WHERE username = ?";
    
    const username = req.body.username;
    const password = req.body.password;
    //const isAuditor = req.body.isAuditor;

    bcrypt.hash(username.toString(), constantSalt, (err,hashU) => {
        if(err){
            console.log(err);   
        }

        console.log("Hashed Username (Login):", hashU);

        db.query(sql, [hashU], (err,data) =>{
            if(err) {
                return res.json(err);
            }

            if(data.length > 0){
                const hashedPassword = data[0].password;
                const isAuditor = data[0].isAuditor;

                //console.log("Role is",role);

                console.log("Stored Hashed Password (DB):", hashedPassword);
                bcrypt.compare(password, hashedPassword, (err, result) =>{
                    if (err){
                        return res.json({error: err });
                    }

                    if(result){
                        return res.json(isAuditor);
                        //return res.json();
                    }
                    else{
                        return res.json("Incorrect Password");
                    }
                });
            } else{
                return res.json("User not found");
            }    

            });
        });
    });

app.listen(8081,()=> {
    console.log("listening");
})