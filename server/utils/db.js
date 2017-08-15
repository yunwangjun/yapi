import mongoose from 'mongoose';
import yapi from '../yapi.js';
import autoIncrement from 'mongoose-auto-increment';

function model(model, schema) {
    if (schema instanceof mongoose.Schema === false) {
        schema = new mongoose.Schema(schema);
    }

    schema.set('autoIndex', false);

    return yapi.connect.model(model, schema, model);
}

function connect() {
    mongoose.Promise = global.Promise;

    let config = yapi.WEBCONFIG;
    let options = {};

    if (config.db.user) {
        options.user = config.db.user;
        options.pass = config.db.pass;
    }
    

    let db = mongoose.connect(`mongodb://${config.db.servername}:${config.db.port}/${config.db.DATABASE}`, options);

    db.then(function () {
        yapi.commons.log('mongodb load success...');
    }, function (err) {
        yapi.commons.log(err, 'Mongo connect error');
    });

    autoIncrement.initialize(db);
    return db;
}

yapi.db = model;

module.exports = {
    model: model,
    connect: connect
};