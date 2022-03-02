//We have to import and use the fs library to write that data to animals.json.
const fs = require('fs');
//Path, built into the Node.js, makes working with our file system a little more predictable
const path = require('path');

const { animals } = require('./data/animals.json');

const express = require('express');

const PORT = process.env.PORT || 3001;

// instantiates the server
const app = express();


//Telling Express.js to INTERCEPT (middleware) our POST request before it gets to the callback function.
//parse incoming string or array data |  converts it to key/value pairing
app.use(express.urlencoded({ extended: true }));
//parse incoming JSON data
app.use(express.json());



//This function will take in req.query as an argument and filter through the animals accordingly, returning the new filtered array.
function filterByQuery(query, animalsArray) {
    let personalityTraitsArray = [];
    // Note that we save the animalsArray as filteredResults here:
    let filteredResults = animalsArray;
    if (query.personalityTraits) {
        // Save personalityTraits as a dedicated array.
        // If personalityTraits is a string, place it into a new array and save.
        if (typeof query.personalityTraits === 'string') {
            personalityTraitsArray = [query.personalityTraits];
        } else {
            personalityTraitsArray = query.personalityTraits;
        }
        // Loop through each trait in the personalityTraits array:
        personalityTraitsArray.forEach(trait => {
            // Check the trait against each animal in the filteredResults array.
            // Remember, it is initially a copy of the animalsArray,
            // but here we're updating it for each trait in the .forEach() loop.
            // For each trait being targeted by the filter, the filteredResults
            // array will then contain only the entries that contain the trait,
            // so at the end we'll have an array of animals that have every one 
            // of the traits when the .forEach() loop is finished.
            filteredResults = filteredResults.filter(
                animal => animal.personalityTraits.indexOf(trait) !== -1
            );
        });
    }
    if (query.diet) {
        filteredResults = filteredResults.filter(animal => animal.diet === query.diet);
    }
    if (query.species) {
        filteredResults = filteredResults.filter(animal => animal.species === query.species);
    }
    if (query.name) {
        filteredResults = filteredResults.filter(animal => animal.name === query.name);
    }
    // return the filtered results:
    return filteredResults;
}

//New  function  that takes in the id and array of animals and returns a single animal object
function findById(id, animalsArray) {
    const result = animalsArray.filter(animal => animal.id === id)[0];
    return result; 
}


//New POST function that accepts the POST route's req.body value and the array we want to add the data to.
// execute this function  within the app.post() route's callback function - it'll take the new animal data and add it to the animalsArray we passed in, and then write the new array data to animals.json.
function createNewAnimal(body, animalsArray) {

    //Now when we POST a new animal, we'll add it to the imported animals array from the animals.json file
    const animal = body;
    animalsArray.push(animal);

    fs.writeFileSync(
        //we use the method path.join() to join the value of __dirname, which represents the directory of the file we execute the code in, with the path to the animals.json file.
        path.join(__dirname, './data/animals.json'),
       
        //Saving the JavaScript array data as JSON,
        //The other two arguments used in the method, null and 2, are means of keeping our data formatted.
        //The null argument means we don't want to edit any of our existing data; if we did, we could pass something in there.
        //The 2 indicates we want to create white space between our values to make it more readable.
        JSON.stringify({ animals: animalsArray }, null, 2)
    );

    //return finished code to poste route for response
    return animal;
}


//Creating Validation
//the animal parameter is going to be the content from req.body
function validateAnimal(animal) {
    if (!animal.name || typeof animal.name !== 'string') {
      return false;
    }
    if (!animal.species || typeof animal.species !== 'string') {
      return false;
    }
    if (!animal.diet || typeof animal.diet !== 'string') {
      return false;
    }
    if (!animal.personalityTraits || !Array.isArray(animal.personalityTraits)) {
      return false;
    }
    return true;
  }


//creating a route that the front-end can request data from.Add the route just before app.listen()
//The second arg is a callback function that will execute every time that route is accessed with a GET request.
app.get('/api/animals', (req, res) => {
    let results = animals;
    if (req.query) {
        results = filterByQuery(req.query, results);
    }
    res.json(results);
});

//new GET route SEARCH BY ID...A PARAM route must come after the other GET route
//.param is specific to a single property, often intended to retrieve a single record.
app.get('/api/animals/:id', (req, res) => {
    const result = findById(req.params.id, animals);
    if (result) {
        res.json(result);
    } else {
        res.send(404);
    }
});

//RECEIVING DATA
app.post('/api/animals', (req, res) => {
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

//we need to make our server listen. app.listen can be placed at any point after app is declared.
app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
});  //then typed 'npm start' into terminal


