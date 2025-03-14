const router = require("express").Router();
const systemController = require('../controllers/systemController');

router.get("/", systemController.getDashboard.bind(systemController));

module.exports = router;