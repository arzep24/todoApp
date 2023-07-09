const PORT = process.env.PORT ?? 8000;
const express = require("express");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require('bcrypt');
const pool = require("./db");
const jwt = require('jsonwebtoken');

BigInt.prototype.toJSON = function() { return this.toString() };
const app = express();

app.use(cors());
app.use(express.json());
app.get("/", async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();
  }
  catch(err){
    console.log(err);
  }
  finally {
    if(conn) return conn.end();
  }
});
// get all todos
app.get("/todos/:userEmail", async (req, res) => {
  let conn;
  const { userEmail } = req.params;
  try {
    conn  = await pool.getConnection();
    const todos = await conn.query(
      `SELECT * FROM todos WHERE user_email="${userEmail}"`,
      []
    );
    res.json(todos);
  } catch (err) {
    console.error(err);
  }
});

//create a new Todo
app.post("/todos", async (req, res) => {
  let conn;
  const { user_email, title, progress, date } = req.body;
  console.log(user_email, title, progress, date);
  const id = uuidv4();
  try {
    conn = await pool.getConnection();
    const newToDo = await conn.query(
      `INSERT INTO todos(id, user_email, title, progress, date) VALUES("${id}","${user_email}", "${title}", "${progress}", "${date}")` 
    );
    res.json(newToDo);
  } catch (err) {
    console.error(err);
  }finally {
    if(conn) return conn.end();
  }
});

// edit a todo 
app.put("/todos/:id", async (req, res) => {
  let conn;
  const { id } = req.params;
  const { user_email, title, progress, date } = req.body;
  try {
    conn = await pool.getConnection();
    const editToDo = await conn.query(
      `UPDATE todos SET user_email="${user_email}", title="${title}", progress="${progress}", date="${date}" WHERE id="${id}"`);
    res.json(JSON.stringify(editToDo));
  } catch (err) {
    console.error(err);
  }finally {
    if(conn) return conn.end();
  }
});

// delete a todo
app.delete("/todos/:id", async (req, res) => {
  let conn;
  const {id} = req.params;
  try {
    conn = await pool.getConnection();
    const deletedToDo = await conn.query(`DELETE FROM todos WHERE id="${id}"`);
  //Necesito convertir BigInt a string
    res.json(JSON.stringify(deletedToDo));
  } catch (err) {
    console.error(err);
  }finally {
    if(conn) return conn.end();
  }
});

//sign up
app.post("/signup", async (req, res) => {
  let conn;
  const {email, password} = req.body;
  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(password, salt);
  try {
    let conn = await pool.getConnection();
    const signup = await conn.query(`INSERT INTO users(email, hashed_password) VALUES("${email}", "${hashedPassword}")`);
    const token = jwt.sign({email},'secret', {expiresIn: '1hr'});
    res.json({email, token});

  }catch (err) {
    console.error(err)
    switch(err.code) {

      case "ER_DUP_ENTRY":
        res.json({detail: `The username: ${email} is not available`});
        break;
      default:
        res.json({detail: err.toString()});
    }
  }finally {
    if(conn) return conn.end();
  }});
// login
app.post("/login", async (req, res) => {
  let conn;
  const {email, password} = req.body;
  try {
    conn = await pool.getConnection();
    let users = await conn.query(`SELECT * FROM users WHERE email="${email}"`);
    if(!users.length){ throw new Error(`There is no user with the email: "${email}"`);}
    console.log(users);
    console.log(password);
    const success = await bcrypt.compare(password, users[0].hashed_password);
    if (success) {
      const token = jwt.sign({email},'secret', {expiresIn: '1hr'});
      res.json({email: users[0].email, token});
    } else {
      throw new Error(`Wrong Password.`);
    }
  } catch (err) {
    console.error(err);
    res.json({detail:err.toString()});
    console.log("No se pudo Iniciar Sesion.");
  } finally {
    if(conn) return conn.end();
  }
});
app.listen(PORT, () => console.log(`Server running on Port: ${PORT}`));
