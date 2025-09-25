const express = require("express");
const pool = require("./db"); // Use the centralized database connection

const app = express();
                
const port = process.env.PORT || 5000;

app.use(express.json());


app.get('/' , (req , res) => {
    res.send("The Hospital management API is running");
})

app.get("/patients" , async(req , res) => {
    try{
        const result = await pool.query("SELECT * FROM patients");
        res.json(result.rows);
    }
    catch(error){
        console.log(error);
    }
})

app.get("/appointments", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT a.id, a.date, a.reason,
              p.name AS patient_name,
              d.name AS doctor_name, d.specialty
       FROM appointments a
       JOIN patients p ON a.patient_id = p.id
       JOIN doctors d ON a.doctor_id = d.id
       ORDER BY a.date ASC`
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});


app.get("/doctors" , async(req , res) => {
    try{
    const results = await pool.query("SELECT * FROM doctors");
    res.json(results.rows);
    }
    catch(error)
    {
        console.log(error);
    }
})

app.post("/appointments" , async(req , res) => {
    const {patient_id , doctor_id , date , reason} = req.body;
    try{
        const result = await pool.query("INSERT INTO appointments (patient_id , doctor_id , date , reason) VALUES ($1 , $2 , $3 , $4) RETURNING *",
        [patient_id , doctor_id , date , reason]);

        res.status(201).send("Appointment Added successfullty")
    }
    catch(error)
    {
            res.send(error);
    }
})


app.post("/patients", async (req, res) => {
  const { name, age, gender } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO patients (name, age, gender) VALUES ($1, $2, $3) RETURNING *",
      [name, age, gender]
    );
    res.status(201).send("Patient added successfully");
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

app.post("/doctors", async (req, res) => {
  const { name, specialty } = req.body;

  try {
    const result = await pool.query(
      "INSERT INTO doctors (name, specialty) VALUES ($1, $2) RETURNING *",
      [name, specialty]
    );
    res.status(201).send("Doctor added successfully");
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});


app.listen(port , ()=>{
    console.log(`server is listening on port ${port}`);  
})


