const express = require('express');
const router = express.Router();

const condidatcontrollers = require('../controllers/condidat-controllers')
const {check}=require('express-validator');

router.post('/signup',

[
    check('name')
    .not()
    .isEmpty(),
    check('email')
    .normalizeEmail()
    .isEmail(),
    check('password')
    .isLength({min:8})
  
   

]
,condidatcontrollers.signup);



router.post('/login',condidatcontrollers.login); 

router.post('/addcondidature',
[
    check('idcondidat')
    .not()
    .isEmpty(),
   
    check('idannonce')
    .not()
    .isEmpty()
]
,condidatcontrollers.addcondidature)









module.exports = router;