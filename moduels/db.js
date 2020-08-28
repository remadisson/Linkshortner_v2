const monk = require('monk');
const clear = require('clear');

const db = monk('localhost/linkshortner_2'); // TODO CHANGE LATER ON
const link = db.get('links');
const user = db.get('users'); // TODO LATER IN THE MISSION xD

module.exports.redirect = {
    getLinks: () => {
        return link.find({}, "-_id").then(callback => callback);
    },

    getLink: async(id) => {
        return await link.findOne({id: id}, "-_id").then(callback => callback);
    },

    isEmpty: async() => {
        return await link.find({}).then(callback => callback.length > 0);
    },

    linkExists: async(id) => {
        return await link.findOne({id: id}).then(callback => callback != null);
    },

    addLink: async(redirect) => {
        return await link.insert({id: redirect.id, url: redirect.url, date: redirect.date}).then(callback => callback);
    },

    removeLink: async(id) => {
        return await link.remove({id: id}).then(callback => callback);
    },

    Link: (id, url) => {
        return { id: id, url:url, date: new Date()};
    },

    clearDatabase: () => {
        link.remove({});
    }
}