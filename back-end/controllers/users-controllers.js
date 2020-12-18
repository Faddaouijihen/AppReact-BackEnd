
const httpError = require('../models/http-error');

const user = require('../models/user');

const { validationResult } = require('express-validator');

const jwt = require('jsonwebtoken')




const getusers = async(req, res, next) => {
    let users;

    try{
        users = await user.find({},'-password');
    }catch (err){
        const error= new httpError(
            'fetching users failed',500
        );
        return next (error); 

    }

    res.json({users: users.map(user=>user.toObject({getters :true}))});

}

const getuserbyid = async(req, res, next) => {
    let User;
    const userid = req.params.uid;

    try{
        User = await user.findById(userid);
    }catch (err){
        const error= new httpError(
            'fetching users failed',500
        );
        return next (error); 

    }

    res.json({User: User.toObject({getters :true})});

}






const signup = async (req, res, next) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
        return next
        (new httpError('invalid input passed ', 422));

    }

    const { name, email, password } = req.body;
    let existinguser;
    try {

        existinguser = await user.findOne({ email: email })

    } catch (err) {
        const error = new httpError('problems!!!', 500);
        return next(error)
    }

    if (existinguser) {
        const error = new httpError(
            'user exist',
            422
        );
        return next(error);
    }

    const createduser = new user({

        name,
        email,
        password
    });

    try {
        await createduser.save();
    } catch (err) {
        const error = new httpError('failed signup', 500);
        return next(error);
    }

    res.status(201).json({ user: createduser.toObject({ getters: true }) });

}

const login = async (req, res, next) => {
    const { email, password } = req.body;

    let existinguser;
    try {

        existinguser = await user.findOne({ email: email })

    } catch (err) {
        const error = new httpError('problems!!!', 500);
        return next(error)
    }

    if (!existinguser || existinguser.password !== password) {
        const error = new httpError(
            'invalid logs',
            422
        );
        return next(error);
    }

    if (existinguser.blokage ==0) {
        const error = new httpError(
            "votre compte est bloquee par l'administrateur" ,
            422
        );
        return next(error);
    }


    let token;
    try {
        token = jwt.sign(
            { userId: existinguser.id, email: existinguser.email },
            'secret-thinks',
            { expiresIn: '1h' }
        );

    } catch (err) {
        const error = new httpError('failed signup try again later', 500);
        return next(error);

    }

    res.json({userId: existinguser.id, token:token })

}


exports.getusers = getusers;
exports.signup = signup;
exports.login = login;
exports.getuserbyid=getuserbyid;


