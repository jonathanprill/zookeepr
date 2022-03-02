//CREATION OF CODE MODULARIZATION

//Path, built into the Node.js, makes working with our file system a little more predictable
const path = require('path');

//start an instance of Router:
const router = require('express').Router();


//HTML PAGES IMPORTED FROM ZIP FILE
//   '/' brings us to the root route used to create a homepage for a server.
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/index.html'));
});

//HTML PAGES IMPORTED FROM ZIP FILE
router.get('/animals', (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/animals.html'));
});

//HTML PAGES IMPORTED FROM ZIP FILE
router.get('/zookeepers', (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/zookeepers.html'));
});

//a wildcard route to catch requests to routes that don't exist.. Should come last!
router.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/index.html'));
});


module.exports = router;