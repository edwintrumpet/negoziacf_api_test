const { MongoClient } = require('mongodb');
const debug = require('debug')('app:db');
const config = require('../config');

const USER = encodeURIComponent(config.dbUser);
const PASSWORD = encodeURIComponent(config.dbPassword);
const DB_NAME = config.dbName;
const DB_LOCAL = config.dbLocal;
let mongoUri;

if (DB_LOCAL) {
  mongoUri = DB_LOCAL;
} else {
  mongoUri = `mongodb+srv://${USER}:${PASSWORD}@${config.dbHost}:${config.dbPort}/${DB_NAME}?retryWrites=true&w=majority`;
}

class MongoLib {
  constructor() {
    this.client = new MongoClient(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    this.dbName = DB_NAME;
  }

  connect() {
    if (!MongoLib.connection) {
      MongoLib.connection = new Promise((resolve, reject) => {
        this.client.connect((err) => {
          if (err) {
            reject(err);
          }
          debug('Connected succesfully to mongo');
          resolve(this.client.db(this.dbName));
        });
      });
    }
    return MongoLib.connection;
  }

  async create(collection, data) {
    const db = await this.connect();
    const { insertedId } = await db.collection(collection).insertOne(data);
    return { id: insertedId };
  }

  async count(collection, query) {
    const db = await this.connect();
    return db.collection(collection).countDocuments(query);
  }
}

module.exports = MongoLib;
