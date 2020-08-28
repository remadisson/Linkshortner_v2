const chalk = require('chalk');
const readline = require('readline');
const databsae = require('./db');

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

       if(link.url != null) return link;
       link.url = await ask(chalk.blue('> Input the URL of the redirect: '));

        return link;
    },

    removeLink: async() => {
        var id = {};
        id = await ask(chalk.blue('Input the ID of the redirect, you want to delete: '));

        console.log(id);
        console.log(await databsae.redirect.linkExists(id));

        if(!(await databsae.redirect.linkExists(id))){
            console.log(chalk.red('> The ID ') + chalk.yellow(id) + chalk.red(' could not been found! Try again!'));
            await this.redirect.removeLink();
        }

        return id;
    }
}

async function askID(question, force){
    var callback = undefined;

    await new Promise((resolve, reject) => {
        rl.question(question, (input) => {
            if(input && input.length > 0 && input.toString() != ''){
                if(input.length > 5 || force){
                    callback = input.toString().trim();
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
            if(input && input.length > 0 && input.toString() != ''){
                callback = input.toString().toLowerCase().trim();
                resolve()
            } else {
                reject();
            }
        });
    })

    return callback;
}