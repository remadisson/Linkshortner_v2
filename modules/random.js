module.exports = {

    randomID: (length) => {
        var statement = '';
        var characters = 'abcdfghijklmnopqrstuvwxyz0123456789';

        for(i = 0; i < length; i++){
            statement += characters.charAt(Math.floor(Math.random() * characters.length));
        }

        return statement;
    }
}