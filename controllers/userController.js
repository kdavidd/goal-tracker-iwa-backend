const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')
const User = require('../models/userModel')

const registerUser = asyncHandler(async (req, res) => {  // /api/users - get metoda
    const {name, email, password} = req.body

    if(!name || !email || !password) {
        res.status(400)
        throw new Error('Please input all needed data!')
    }

    //proveravamo da li korisnik vec postoji pomocu emaila
    const userExists = await User.findOne({email})
    if(userExists) {
        res.status(400)
        throw new Error('User already exists!')
    }

    //pravimo korisnika
    const user = await User.create({
        name,
        email,
        password,
    })

    if(user) {
        res.status(201).json({
            _id: user.id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id)
        })
    } else {
        res.status(400) 
        throw new Error('Invalid user data!')
    }

    

})

const loginUser = asyncHandler(async (req, res) => { // /api/users/login - post metoda
    const {email, password} = req.body
    const user = await User.findOne({email})

    //provera
    if(user && password === user.password) {
        res.json({
            _id: user.id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id)
        })
    } else {
        res.status(400)
        throw new Error('Invalid email or password!')
    }

    res.json({message: 'Login user'})
    
})
const getMe = asyncHandler(async (req, res) => { //api/users/me - get metoda
    res.status(200).json(req.user)
})

//Generisanje JWT tokena
const generateToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, {
        expiresIn: '30d',
    })
}

module.exports = {
    registerUser,
    loginUser,
    getMe,
}