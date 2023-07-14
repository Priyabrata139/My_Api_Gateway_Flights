const express = require('express');

const {  InfoController } = require('../../controllers');
const { AuthRequestMiddlewares } = require('../../middlewares');

const userRoutes = require('./user-route');

const router = express.Router();

// router.use('/airplanes', airplaneRoutes);


// router.post('/signup',UserMiddlewares.validateCreateRequest, UserController.signup);

// router.post('/signin',UserMiddlewares.validateSinginRequest, UserController.signin);

router.get('/info',AuthRequestMiddlewares.checkAuth, InfoController.info);

router.use('/user',userRoutes);


module.exports = router;