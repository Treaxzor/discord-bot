const path = require('path');
const { isAuthenticated, authenticate } = require('./auth');
const { Router } = require('express');
const webhookController = require('./controller/webhookController')
const apiController = require('./controller/apiController')

const router = new Router();

// authentication
router.post('/login', authenticate);

// webhooks
router.post('/webhook/paykickstart', webhookController.payKickStartWeHook);

// views

router.get("/api/v1/filter", isAuthenticated, apiController.filter);
router.post("/api/v1/add", isAuthenticated, apiController.add);
router.post("/api/v1/remove", isAuthenticated, apiController.remove);

router.get('*', (req, res, next) => {
  res.sendFile(path.resolve(`${__dirname}/../public/app.html`))
});

module.exports = router;