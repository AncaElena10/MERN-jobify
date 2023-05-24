const router = require('express').Router();
const rateLimiter = require('express-rate-limit');

const apiLimiter = rateLimiter.rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10,
    message: 'Too many requests from this IP Address, please try again after 15 minutes.',
})

const AppConstants = require('../../config/constants');
const authController = require('../../controllers/auth.controller');
const jobsController = require('../../controllers/jobs.controller');

const authMiddleware = require('../../middleware/app.middleware');

// user
// public APIs - do not require the token
router.post('/register', apiLimiter, authController.register);
router.post('/login', apiLimiter, authController.login);
// private APIs - require the token
router.patch('/updateUser', authMiddleware.auth, authController.update);
router.get('/user', authMiddleware.auth, authController.getOne);

// jobs
// private APIs - require the token
router.get(`${AppConstants.RouteKeys.jobs}/`, authMiddleware.auth, jobsController.getAll);
router.post(`${AppConstants.RouteKeys.jobs}/`, authMiddleware.auth, jobsController.create);
router.get(`${AppConstants.RouteKeys.jobs}/stats`, authMiddleware.auth, jobsController.getStats);
router.delete(`${AppConstants.RouteKeys.jobs}/:id`, authMiddleware.auth, jobsController.delete);
router.patch(`${AppConstants.RouteKeys.jobs}/:id`, authMiddleware.auth, jobsController.update);

module.exports = router;