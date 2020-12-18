const httpError = require('../models/http-error');
const mongoose = require('mongoose');


const { validationResult } = require('express-validator');

const annonce = require('../models/formation');
const user = require('../models/user');

const condidat = require('../models/candidat')
const nodemailer = require('nodemailer');
const Email = require('email-templates');




const getannoncebyid = async (req, res, next) => {

    const annonceid = req.params.pid;
    let Annonce;
    try {
        Annonce = await annonce.findById(annonceid);
    } catch (err) {
        const error = new httpError('problems!!!', 500);
        return next(error)
    }
    if (!Annonce) {

        const error = new httpError('could not find an annnonce for that id', 404);
        return next(error);

    }


    res.json({ Formation: Annonce.toObject({ getters: true }) });


}

const getannoncebyuserid = async (req, res, next) => {

    const userid = req.params.uid;

    let userwithannonce;
    try {
        userwithannonce = await user.findById(userid).populate('annonces');
    } catch (err) {
        const error = new httpError('problems!!!', 500);
        return next(error)
    }
    if (!userwithannonce || userwithannonce.length === 0) {

        const error = new httpError('could not find a annonce for that userid', 404);
        return next(error);

    }
    res.json({ Annonce: userwithannonce.toObject({ getters: true }) });


}

const allannonces = async (req, res, next) => {



    let userwithannonce;
    try {
        userwithannonce = await annonce.find();
    } catch (err) {
        const error = new httpError('problems!!!!!', 500);
        return next(error)
    }
    if (!userwithannonce || userwithannonce.length === 0) {

        const error = new httpError('could not find a annonce', 404);
        return next(error);

    }

    res.json({ Formation: userwithannonce.map(annonce => annonce.toObject({ getters: true })) });


}

const createannonce = async (req, res, next) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
        return next(new httpError('invalid input passed ', 422));

    }
    const { title, description} = req.body;


    const createdannonce = new annonce({
        title,
        description,
        condidats: []

    })

    try {
        await createdannonce.save();
    } catch (err) {
        const error = new httpError('failed', 500);
        return next(error);
    }




    res.status(201).json({ annonce: createdannonce })


}

const updateannonce = async (req, res, next) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
        return next(new httpError('invalid input passed ', 422));

    }
    const { title, description, salaire, typeContract, competence, experience } = req.body;
    const annonceid = req.params.pid;

    let Annonce;
    try {
        Annonce = await annonce.findById(annonceid);
    } catch (err) {
        const error = new httpError('problems!!!', 500);
        return next(error)
    }

    Annonce.title = title;
    Annonce.description = description;
    Annonce.salaire = salaire;
    Annonce.typeContract = typeContract;
    Annonce.competence = competence;
    Annonce.experience = experience;

    try {
        await Annonce.save();
    } catch (err) {
        const error = new httpError('failed', 500);
        return next(error);
    }

    res.status(200).json({ Annonce: Annonce.toObject({ getters: true }) });

}

const deleteannonce = async (req, res, next) => {

    const annonceid = req.params.pid;

    let Annonce;
    try {
        Annonce = await annonce.findById(annonceid).populate('creator');
    } catch (err) {
        const error = new httpError('problems!!!', 500);
        return next(error)
    }

    if (!Annonce) {
        const error = new httpError('could not find annonce for that id!!!', 404);
        return next(error)
    }

    try {
        const sess = await mongoose.startSession();
        sess.startTransaction();
        await Annonce.remove({ session: sess });
        Annonce.creator.annonces.pull(Annonce);
        await Annonce.creator.save({ session: sess });
        await sess.commitTransaction();
    } catch (err) {
        const error = new httpError('failed', 500);
        return next(error);
    }


    res.status(200).json({ message: 'deleted ' });



};


const getcondidats = async (req, res, next) => {

    const annonceid = req.params.aid;

    let condidature;
    try {
        condidature = await annonce.findById(annonceid).populate('condidats');
    } catch (err) {
        const error = new httpError('problems!!!', 500);
        return next(error)
    }
    if (!condidature || condidature.length === 0) {

        const error = new httpError('could not find ', 404);
        return next(error);

    }
    res.json({ Condidats: condidature.condidats.toObject({ getters: true }) });


}

const validerannonce = async (req, res, next) => {

    const annonceid = req.params.aid;

    let User;
    try {
        Annonce = await annonce.findById(annonceid);
    } catch (err) {
        const error = new httpError('problems!!!', 500);
        return next(error)
    }


    Annonce.validation = 1;




    try {
        await Annonce.save();
    } catch (err) {
        const error = new httpError('failed', 500);
        return next(error);
    }

    res.status(200).json({ Annonce: Annonce.toObject({ getters: true }) });

}


const getallannoncesadmin = async (req, res, next) => {

    let Annonce;
    try {
        Annonce = await annonce.find();
    } catch (err) {
        const error = new httpError('problems!!!!!!!!!!!!!!!!!!!!!!', 500);
        return next(error)
    }
    if (!Annonce || Annonce.length === 0) {

        const error = new httpError('could not find a annonce', 404);
        return next(error);

    }

    res.json({ Annonce: Annonce.map(annonce => annonce.toObject({ getters: true })) });


}


exports.getannoncebyid = getannoncebyid;
exports.getannoncebyuserid = getannoncebyuserid;
exports.createannonce = createannonce;
exports.updateannonce = updateannonce;
exports.deleteannonce = deleteannonce;
exports.allannonces = allannonces;
exports.getcondidats = getcondidats;
exports.validerannonce = validerannonce
exports.getallannoncesadmin = getallannoncesadmin