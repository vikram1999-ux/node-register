require('dotenv').config();
const express = require('express');
const path = require('path');
const hbs = require('hbs');
const bcrypt = require('bcryptjs')
const app = express();
require('./db/conn');
const Register = require('./models/registers');
const { json } = require('express');
const { log } = require('console');


const port = process.env.PORT || 3000;

const static_path = path.join(__dirname, '../public');

const template_path = path.join(__dirname, '../templates/views');

const partials_path = path.join(__dirname, '../templates/partials');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static(static_path));


app.set('view engine', 'hbs');

app.set('views', template_path)
hbs.registerPartials(partials_path)

console.log(process.env.SECRET)

app.get("/", (req, res) => {
    res.render('index');
});

app.get("/register", (req, res) => {
    res.render('register');
});

app.get("/logout", auth, async (req, res) => {
    try {

    } catch (error) {
        res.status(500).send(error)
    }
});


app.get("/login", (req, res) => {
    res.render('login');
});


// create a new user in our database
app.post("/register", async (req, res) => {
    try {

        const password = req.body.password;
        const cpassword = req.body.confirmpassword;

        if (password === cpassword) {

            const registerEmployee = new Register({
                firstname: req.bosy.firstname,
                lastname: req.bosy.lastname,
                email: req.body.email,
                gender: req.body.gender,
                phone: req.body.phone,
                age: req.body.age,
                password: password,
                confirmpassword: cpassword
            })

            const token = await registerEmployee.generateAuthToken();

            const registered = await registerEmployee.save();
            res.send(201).render('index');
        } else {
            res.send('password does not match please try again')
        }
    } catch (error) {
        res.status(400).send(error);
    }
});


// login check

app.post('/login', async (req, res) => {
    try {

        const email = req.body.email;
        const password = req.body.password;

        const useremail = await Register.findOne({ email: email });

        const isMatch = await bcrypt.compare(password, useremail.password)

        const token = await useremail.generateAuthToken();

        if (isMatch) {
            res.status(201).render('index')
        }
        else {
            res.send('invalid login details')
        }
    } catch (error) {
        res.status(400).send('invalid login details');
    }
})

// const bcrypt = require('bcryptjs');
// const securePassword = async (password) => {
//     const passwordHash = await bcrypt.hash(password, 10);
//     console.log(passwordHash)

//     const passwordmatch = await bcrypt.compare(password, passwordHash);
//     console.log(passwordmatch)


// }
// securePassword('vikram@123');

app.listen(port, () => {
    console.log(`server is running at port no. ${port}`);
})