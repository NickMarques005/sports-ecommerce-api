//---createUser.js---//

const express = require('express');
const router = express.Router();
const user = require('../models/user');
const { body, validationResult } = require('express-validator');


const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const jwt_mainKey = process.env.API_KEY;


//Post Method for User creation
router.post("/createuser",
    body('email').isEmail(),
    body('name').isLength({ min: 3 }),
    body('password', 'Incorrect Password').isLength({ min: 8 }),
    async (req, res) => {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const salt_generation = await bcrypt.genSalt(10);
        let hashedPassword = await bcrypt.hash(req.body.password, salt_generation)

        try {
            //Async Await arrow function to create User object containing all registration information
            await user.create({
                name: req.body.name,
                cep_location: req.body.cep_location,
                email: req.body.email,
                password: hashedPassword,
            });
            //If the info is captured correctly, will return the response in json -> {success: true}
            console.log("User account was successfully created.");
            res.json({ success: true });
        } catch (err) {
            //Else if  there is an error in the process, will return the response -> {success: false}
            console.log(err);
            res.json({ success: false });
        }
    }
);

//Post Method for Login
router.post("/loginuser",
    body('email').isEmail(),
    body('password', 'Incorrect Password').isLength({ min: 8 }),
    async (req, res) => {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        let email = req.body.email;
        let password = req.body.password;

        try {
            //Async Await arrow function to create User object containing all registration information
            let user_data = await user.findOne({ email });
            
            //If the info is captured correctly, will return the response in json -> {success: true}

            if (!user_data) {
                return res.status(400).json({ errors: "E-mail not found" })
            }

            const password_comparison = await bcrypt.compare(password, user_data.password);

            if (!password_comparison) {
                return res.status(400).json({ errors: "Wrong password" })
            }
            const data_authentication = {
                user: {
                    id: user_data.id
                }
            }

            const authToken = jwt.sign(data_authentication, jwt_mainKey);
            console.log("User Account found! User's data:\nEmail:", user_data.email, "\nPassword:", user_data.password, "\nName: ", user_data.name, "\nCEP: ", user_data.cep_location);
            res.json({ success: true, authToken: authToken});

        } catch (err) {
            //Else if  there is an error in the process, will return the response -> {success: false}
            console.log(err);
            res.json({ success: false });
        }
    }
);


module.exports = router;



