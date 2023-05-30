const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const validator = require("validator");

const app = express();
app.use(bodyParser.json());

const users = require("./user");

app.post("/register", (req, res) => {
  const { email, username, password } = req.body;

  const isEmailValid = validator.isEmail(email);
  if (!isEmailValid) {
    return res.status(404).send({ message: "Email is invalid" });
  }

  const userExists = users.some((u) => u.username === username);
  if (userExists) {
    return res.status(400).send({ message: "User already exists" });
  }

  const hashedPassword = bcrypt.hashSync(password, 10);

  const newUser = {
    id: users.length + 1,
    email,
    username,
    password: hashedPassword,
  };

  users.push(newUser);

  res.status(201).send({ message: "User registered successfully" });
});

app.get("/users", (req, res) => {
  res.status(201).send(users);
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
