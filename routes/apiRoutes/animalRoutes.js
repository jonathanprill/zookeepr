//CREATING MODULARIZATION

//start an instance of Router:
const router = require('express').Router();

//our app functions are making calls to filterByQuery(), findById(), createNewAnimal(), and validateAnimal().
const { filterByQuery, findById, createNewAnimal, validateAnimal } = require('../../lib/animals');
//we also need to import the animals object that's in data/animals, because those^^ functions make use of it.
const { animals } = require('../../data/animals');

//creating a route that the front-end can request data from.Add the route just before app.listen()
//The second arg is a callback function that will execute every time that route is accessed with a GET request.
//changed app.get to router.get
router.get('/animals', (req, res) => {
    let results = animals;
    if (req.query) {
        results = filterByQuery(req.query, results);
    }
    res.json(results);
});

//new GET route SEARCH BY ID...A PARAM route must come after the other GET route
//.param is specific to a single property, often intended to retrieve a single record.
//changed app.get to router.get
router.get('/animals/:id', (req, res) => {
    const result = findById(req.params.id, animals);
    if (result) {
        res.json(result);
    } else {
        res.send(404);
    }
});

//RECEIVING DATA
//changed app.post to router.post
router.post('/animals', (req, res) => {
    //req.body is where our incoming content will be
    //With POST requests, we typically package up data as an object, and send it to the server. 
    //The req.body property is where we can access that data on the server side and do something with it.
    
    //Adds unique ID based on what the next index of the array will be
    req.body.id = animals.length.toString();

    // if any data in req.body is incorrect, send 400 error back
    if (!validateAnimal(req.body)) {
        res.status(400).send('The animal is not properly formatted.');
    } else {
        // add animal to json file and animals array in this function
        const animal = createNewAnimal(req.body, animals);

        //Were using res.json() to send the data back to the client.
        res.json(animal);
    }

});



module.exports = router;