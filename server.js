// Initinal functionalities
const express = require('express');
const app = express();
const cors = require('cors');
const figlet = require('figlet');
const clear = require('clear');

// Import classes
const inputManager = require('./moduels/input');
const database = require('./moduels/db');

// Make it looq butiful
const chalk = require('chalk');

// Initialize utils
app.use(express.json());
app.use(cors());


app.get('/', (req, res) => {
    res.redirect('https://www.remadyreturns.de/');
});

app.get('/links', async(req, res) => {
    const callback = await database.redirect.getLinks();

    if(callback != null && callback.length > 0){
        for(var entry in callback){
            res.json(callback[entry]);
        }
    } else {
        res.json({
            status: 204,
            message: "There are no redirects yet! >:(",
        })
    }

});

app.get('/*', async(req, res) => {
    const url = req.originalUrl.substr(1, req.originalUrl.length);
    
    const redirect = await database.redirect.getLink(url);
    if(redirect != null){
        res.redirect(redirect.url);
    } else {
        res.status(404).redirect(`https://remadyreturns.de/${url}`);
    }
});

app.listen(8080, () => {
    clear();
    console.log(chalk.magentaBright(figlet.textSync('LS2', {horizontalLayout: 'full'})));
    console.log(chalk.magenta(">> Linkshortner-2 ready! <<"));
    inputManager.init();
});



