// Initinal functionalities
const express = require('express');
const app = express();
const cors = require('cors');
const monk = require('monk');

const no_id = ["links", "users"]

// Make it looq butiful
const chalk = require('chalk');

// Initialize utils
app.use(express.json());
app.use(cors());

// Initialize db instances
const db = monk('localhost/linkshortner_2'); // TODO CHANGE LATER ON
const links = db.get('links');
const users = db.get('users'); // TODO LATER IN THE MISSION xD

app.get('/', (req, res) => {
    res.redirect('https://www.remadyreturns.de/');
});

app.get('/links', async(req, res) => {
    let callback = await links.find().then(callback => callback);
    
    if(callback != null && callback > 0){
        res.json(callback);
    } else {
        res.json({
            status: 204,
            message: "There are no redirects yet! >:(",
        })
    }

});

app.listen(8080, () => {
    console.log(chalk.yellow("Linkshortner-2 ready!"));
});
