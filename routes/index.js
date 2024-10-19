const passport = require('passport');

const router = require('express').Router();

router.use('/', require('./swagger'))

// router.get('/', (req, res) => { 
//     //#swagger.tags=['Hello World']
//     res.send('Hello World');
// });

router.use('/movies', require('./movies'));
router.use('/actors', require('./actors'));
router.use('/reviews', require('./reviews'));
router.use('/critics', require('./critics'));

/*
    #swagger.tags = ['Login/LogOut']
    #swagger.description = 'Login using github OAUTH 2'
*/
router.get('/login', passport.authenticate('github'), (req, res) => {});

/*
    #swagger.tags = ['Login/LogOut']
    #swagger.description = 'Logout'
*/
router.get('/logout', function(req, res, next) {
    req.logout(function(err) {
      if (err) { return next(err); }
      res.redirect('/');
    });
});  
    
module.exports = router;