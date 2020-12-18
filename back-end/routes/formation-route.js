const express = require('express');
const router = express.Router();
const annoncescontrollers = require('../controllers/formations-controllers');
const {check}=require('express-validator');


router.get('/',annoncescontrollers.allannonces);

router.get('/:pid',annoncescontrollers.getannoncebyid); 


router.post('/',
[
    check('title')
    .not()
    .isEmpty(),
    check('description').isLength({min:20})
 

]
,annoncescontrollers.createannonce);




module.exports = router;