const chalk = require('chalk');
const readline = require('readline');
const database = require('./db');
const no_id = module.exports.no_id = ["links", "users"];

const rl = readline.createInterface({
    terminal: false,
    input: process.stdin,
    output: process.stdout
});

module.exports.redirect = {
    addLink: async(force) => {
       let link = {};
       link.id = await askID(chalk.blue('> Input the ID of the redirect: '), force).catch(async function(error) {
        console.log(chalk.red("> Your ID does not follow our requirements!"));
        console.log(chalk.red('>> Make sure you have at least 6 chars in your id!'));
        link = await require('./questions').redirect.addLink();
       });
       
       if(link.id == false || link.url == false) return false;
       if(link.url != null) return link;
       link.url = await ask(chalk.blue('> Input the URL of the redirect: '));
       if(link.url == false) return false;

         return link;
    },

    removeLink: async() => {
        var id = undefined;
        id = await askID(chalk.blue('Input the ID of the redirect, you want to delete: '));

        if(id == false){
            return false;
        }

        if(!(await database.redirect.linkExists(id))){
            console.log(chalk.red('> The ID ') + chalk.yellow(id) + chalk.red(' could not been found! Try again!'));

            if(id == false){
                return false;
            }

           id = await this.redirect.removeLink();
        }

        return id;
    },

    askWithRandomID: async() => {
        var url = undefined;
        url = await ask(chalk.blue('> Input the URL of the redirect: '));

        if(url == false){
            return false;
        }

        if(url == null){
            url = await this.redirect.askWithRandomID();
        }

        return url;
    }
}

async function askID(question, force){
    var callback = undefined;
    await new Promise((resolve, reject) => {
        rl.question(question, (input) => {

            if(input.toString().toLowerCase().trim() == ':a'){
                callback = false;
                resolve();
            }

            if(input && input.length > 0 && input.toString() != ''){
                if((input.length > 5 || force) && !no_id.includes(input.toString().toLowerCase().trim())){
                    callback = input.toString().toLowerCase().trim();
                    resolve();
                } else {
                    reject();
                }
            } else {
                reject();
            }
        })
    });

    return callback;
}

async function ask(question){
    var callback = undefined;
    await new Promise((resolve, reject) => {
        rl.question(question, (input) => {
            if(input.toString().toLowerCase().trim() == ':a'){
                callback = false;
                resolve();
            }

            if(input && input.length > 0 && input.toString() != '' && input.toString().toLowerCase().trim() != ':a'){
                callback = input.toString().trim();
                resolve()
            } else {
                reject();
            }
        });
    })

    return callback;
}