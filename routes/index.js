const router = require('express').Router();

// Import the route for /notes
const notesRouter = require('./notes');

router.use('/notes', notesRouter);

module.exports = router;
