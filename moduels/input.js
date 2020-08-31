const readline = require('readline');
const chalk = require('chalk');
const clear = require('clear');
const no_id = require('./../server').no_id;
const links = require('./../server').links;

const database = require('./db');
const question = require('./questions');

const rl = readline.createInterface({
    terminal: false,
    input: process.stdin,
    output: process.stdout,
});

const commands = ["help", "link", "user", "db", "clear"];

let send = false;
module.exports.init = async() => {
    if(!send) console.log(chalk.cyanBright("> Use 'help' for more information.")), send = true;
    await new Promise((resolve, reject) => {
      rl.question(chalk.blueBright('> ') , async(input) => {
            
            
            let raw = input.toString().toLowerCase().trim().replace("  ", " ");
            let command = raw.split(" ")[0];    
            let args = [];
                for(i = 1; i < raw.split(" ").length; i++){
                    args.push(raw.split(" ")[i]);
                }

                if(!commands.includes(command) && (command.length != 0 || command.toString().toLowerCase().trim() != '')){
                    error("`" + input.toString() + "` could not be found!");
                }

            await doCommandCycle(input, command, args);
            
            resolve();
        });
    }).then(callback => this.init());
}

async function doCommandCycle(input, command, args){
    switch(command){
        case "clear": {
            clear()
            console.log(chalk.magenta(">> Linkshortner-2 ready! <<"));
            console.log(chalk.cyanBright("> Use 'help' for more information."));
            return;
        }

        case "help":{
            sendMessage(" Help for LinkShortner", chalk.greenBright);
            sendMessage("> help", chalk.greenBright);
            sendMessage("> link [add]/remove/list/info [-f] <id>", chalk.greenBright);
            sendMessage("> user add/remove/list", chalk.greenBright);
            sendMessage("> db", chalk.greenBright);
            return;

        } //end of case help

        case "link": {
            switch(args.length){
                default:
                case 0:{
                    sendMessage("link [add]/remove/list/info [-f] <id>", chalk.greenBright);
                    return;
                }

                case 2:
                case 1: {
                    switch(args[0]){
                        case "add": {
                            if(args.length == 1){

                                const newlink = await question.redirect.addLink(false);
                                
                                if(newlink == false){
                                    error('Command aborted!');
                                    return;
                                }

                                if(await database.redirect.linkExists(newlink.id)){
                                    error('An redirect with this ID already exists!');
                                    return;
                                }

                                const link = database.redirect.Link(newlink.id, newlink.url);
                                await database.redirect.addLink(link).then(callback => {
                                    sendMessage(callback.id + " has been added!", chalk.blue);
                                });
                                
                            } else if(args.length == 2){
                                if(args[1].toString().toLowerCase() == ("-f")){
                                    const newlink = await question.redirect.addLink(true);
                                    
                                    if(newlink == false){
                                        error('Command aborted!');
                                        return;
                                    }

                                    if((await database.redirect.linkExists(newlink.id))){
                                        error('An redirect with this ID already exists!');
                                        return;
                                    }
    
                                    const link = database.redirect.Link(newlink.id, newlink.url);
                                    await database.redirect.addLink(link).then(callback => {
                                        sendMessage(callback.id + " has been added!", chalk.blue);
                                    });

                                } else {
                                    error(" `" + input.toString() + "` could not be found!");
                                }
                            } else {
                                sendHelp(command)
                            }
                            return;
                        }

                        case "remove":{
                            if(args.length == 1){                                
                                const removelink = await question.redirect.removeLink();
                                
                                if(removelink == false){
                                    error('Command aborted!');
                                    return;
                                }

                                await database.redirect.removeLink(removelink).then(callback => {
                                    error(removelink + " has been deleted!");
                                });
                            } else if(args.length == 2){
                                if(args[1].toString().toLowerCase() == ("-f")){
                                    await database.redirect.clearDatabase();
                                    error('Database has been erased!');
                                } else {
                                    error(" `" + input.toString() + "` could not be found!");
                                }
                            } else {
                                sendHelp(command);
                            }
                            return;
                        }

                        case "list":{
                            const link = await database.redirect.getLinks();
                            
                            if(link.length < 1){
                                error('There are currently no entrys!');
                                return;
                            }   

                            console.log(" ");
                            sendMessage('Here are all of your entries: ' + link.length, chalk.yellow);
                            
                            let info = 1;

                            link.forEach(entry => {
                                console.log(" ");
                                sendMessage(info, chalk.cyan);
                                sendMessage('Info of ' + chalk.blue(entry.url), chalk.cyan);
                                sendMessage('ID: ' + chalk.white(entry.id), chalk.green);
                                sendMessage('createdAT: ' + chalk.white(entry.date), chalk.green);
                                info++;
                            });

                            return;
                        }

                        case "info": {
                            if(args.length == 2){
                                if(!(await database.redirect.linkExists(args[1]))){
                                    error('This ID could not be found!');
                                    return;
                                }

                                const infolink = await database.redirect.getLink(args[1]);
                                sendMessage('Info of ' + chalk.green(infolink.url), chalk.cyan);
                                sendMessage('ID: ' + chalk.white(infolink.id), chalk.green);
                                sendMessage('createdAT: ' + chalk.white(infolink.date), chalk.green);

                            } else {
                                sendHelp(command);
                            }

                            return;
                        }

                        default:{
                            sendMessage("link [add]/remove/list/info [-f] <id>", chalk.greenBright);
                            return;
                        }
                    }
                }

            }
        } // end of case link

    } // end of switch(command)
} // end of doCommandCylce

function sendHelp(command){
    switch(command.toLowerCase()){
        case "link": {
            sendMessage("link [add]/remove/list/info [-f] <id>", chalk.greenBright);
            return;
        }

        /*
        case "": {
                    
                }
        */

        default: {
            sendMessage("Please use `help` for more information.", chalk.blueBright);
            return;
        }
    }
}

function error(message){
    sendMessage(message, chalk.red);
}

function sendMessage(message, color){
    console.log(color('> ' + message));
}



