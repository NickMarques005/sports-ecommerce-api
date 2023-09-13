const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const jwt_mainKey = process.env.API_KEY;
const user = require('../models/user');

console.log(jwt_mainKey);

router.get('/userData', async (req,res) => {
    const authToken = req.headers.authorization?.split(' ')[1];
    if(!authToken) {
        return res.status(401).json({error: "Unauthorized"});
    }

    try{
        const decodedToken = jwt.verify(authToken, jwt_mainKey);
        const userId = decodedToken.user.id;
        const userData = await user.findById(userId);
        res.json({success:true, user: userData});
    } catch (err){
        res.status(401).json({error: "Invalid authToken"});
    }
})

module.exports = router;
