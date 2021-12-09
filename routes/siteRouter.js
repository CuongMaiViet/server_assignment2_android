const router = require('express').Router()
const siteCtrl = require('../controllers/siteCtrl')

router.post('/register', siteCtrl.registerNewSite)

router.put('/join/:id', siteCtrl.joinTheSite)
router.put('/update/:id', siteCtrl.updateNumberOfTested)
router.put('/notification/:id', siteCtrl.updateNotification)

router.get('/info/:id', siteCtrl.getAllInfoSite)
router.get('/',siteCtrl.getAllSites)
module.exports = router

