const express = require('express');
const router = express.Router();
const userscontrollers = require('../controllers/users-controllers');
const {check}=require('express-validator');

router.get('/',userscontrollers.getusers);
router.get('/:uid',userscontrollers.getuserbyid);

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
,userscontrollers.signup);


router.post('/login',userscontrollers.login);








module.exports = router;