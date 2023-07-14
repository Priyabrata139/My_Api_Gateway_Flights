const express = require('express');

const { UserController } = require('../../controllers');
const { UserMiddlewares } = require('../../middlewares');

// const airplaneRoutes = require('./airplane-routes');

const router = express.Router();

// router.use('/airplanes', airplaneRoutes);


router.post('/signup',UserMiddlewares.validateCreateRequest, UserController.signup);

router.post('/signin',UserMiddlewares.validateSinginRequest, UserController.signin);

module.exports = router;