const express = require('express');
const especialidadeController = require("../controllers/especialidade.controller");

// express router
let router = express.Router();

// middleware for all routes related with tutorials
/* router.use((req, res, next) => {
    const start = Date.now();
    res.on("finish", () => { // finish event is emitted once the response is sent to the client
        const diffSeconds = (Date.now() - start) / 1000; // figure out how many seconds elapsed
        console.log(`${req.method} ${req.originalUrl} completed in ${diffSeconds} seconds`);
    });
    next()
}) */

router.route('/')
    .get(especialidadeController.findAll)


router.route('/:id')
    .get(especialidadeController.findOne)


router.all('*', function (req, res) {
    //send an predefined error message 
    res.status(400).json({ success: false, message: `The API does not recognize the request on ${req.method} ${req.originalUrl}` });
})

module.exports = router;