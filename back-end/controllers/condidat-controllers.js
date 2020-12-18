const httpError = require('../models/http-error');


const condidat = require('../models/candidat')
const annonce = require('../models/formation')

const { validationResult } = require('express-validator');

const jwt = require('jsonwebtoken')






const signup = async (req, res, next) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
        return next
            (new httpError('invalid input passed ', 422));

    }

    const { name, email, password} = req.body;
    let existinguser;
    try {

        existinguser = await condidat.findOne({ email: email })

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


    const createdcondidat = new condidat({

        name,
        email,
        password,
        condidatures: []


    });

    try {
        await createdcondidat.save();
    } catch (err) {
        const error = new httpError('failed signup', 500);
        return next(error);
    }




    res.status(201).json({ condidat: createdcondidat.toObject({ getters: true }) });



}

const login = async (req, res, next) => {
    const { email, password } = req.body;

    let existinguser;
    try {

        existinguser = await condidat.findOne({ email: email })

    } catch (err) {
        const error = new httpError('problems!!!', 500);
        return next(error)
    }

    if (!existinguser || password !== existinguser.password) {
        const error = new httpError(
            'invalid logs',
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

    res.json({ userId: existinguser.id, email: existinguser.email, token: token })



}

const addcondidature = async (req, res, next) => {

    const error = validationResult(req);
    if (!error.isEmpty()) {
        return next(new httpError('invalid id ', 422));

    }
    const { idcondidat, idannonce } = req.body;

    let Condidat;
    try {

        Condidat = await condidat.findById(idcondidat)

    } catch (err) {
        const error = new httpError('problems!!', 500);
        return next(error)
    }

    let Annonce;

    try {

        Annonce = await annonce.findById(idannonce)

    } catch (err) {
        const error = new httpError('problems!!!', 500);
        return next(error)
    }

    let exist;
    try {
        exist = await Condidat.condidatures.findIndex(id =>id == idannonce)
    
        

    } catch{
        const error = new httpError('problems!!!!!!!!!!!!!', 500);
        return next(error)
    }

  

 

    if (exist !== -1) {
        const error = new httpError(
            'déjà postuler',
            422
        );
        return next(error);
    }

    



    try {
 
        Condidat.condidatures.push(Annonce);
        await Condidat.save();
        Annonce.condidats.push(Condidat);
        await Annonce.save();


    } catch (err) {
        const error = new httpError('failed condidature', 500);
        return next(error);
    }


    res.json({ Annonce: Annonce.Condidats, Condidat: Condidat.condidatures });


}





exports.signup = signup;
exports.login = login;
exports.addcondidature = addcondidature;
