const path = require('path');
const { isAuthenticated, authenticate } = require('./auth');
const { Router } = require('express');
const fileUpload = require('express-fileupload');
const webhookController = require('./controller/webhookController')
const apiController = require('./controller/apiController')

const router = new Router();

// authentication
router.post('/login', authenticate);
router.get("/isauthenticated", isAuthenticated, (req, res) => res.send());

// webhooks
router.post('/webhook/paykickstart', webhookController.payKickStartWeHook);
router.post('/webhook/paypal', webhookController.paypal);

// views

router.get("/api/v1/filter", isAuthenticated, apiController.filter);
router.post("/api/v1/add", isAuthenticated, apiController.add);
router.post("/api/v1/unlink", isAuthenticated, apiController.unlink);
router.post("/api/v1/remove", isAuthenticated, apiController.remove);
// router.post("/api/v1/telegram/upload", isAuthenticated, fileUpload(), apiController.telegramUpload)
router.post("/api/v1/krypton/upload", isAuthenticated, fileUpload(), apiController.kryptonUpload)

router.get('*', (req, res, next) => {
  res.sendFile(path.resolve(`${__dirname}/../public/app.html`))
});

module.exports = router;