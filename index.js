const express = require('express');
const app = new express();

//export the divisors endpoint for the test 1
require('./API/divisors')(app);

//export the searchText endpoint for the test 2
require('./API/searchText')(app);




const listener = app.listen(process.env.PORT, () => { console.log('Your app is listening on port ' + listener.address().port) });