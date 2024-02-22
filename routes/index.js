var express = require('express');
var router = express.Router();
const adminRoutes = require('./api/admin');
const userRoutes = require('./api/user');

router.use("/admin", adminRoutes);
router.use("/user", userRoutes);

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
module.exports = router;
