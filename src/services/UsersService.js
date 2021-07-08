const Boom = require('@hapi/boom');
const bcrypt = require('bcrypt');
const MongoLib = require('../lib/Mongo');

class UsersService {
  constructor() {
    this.collection = 'users';
    this.mongoDB = new MongoLib();
  }

  async createUser(user) {
    const userAlreadyExists = await this.mongoDB.count(
      this.collection, { email: user.email },
    );
    if (userAlreadyExists) {
      throw Boom.conflict('There is already one user with this email');
    }

    const password = await bcrypt.hash(user.password, 10);

    const userData = {
      ...user,
      password,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const createdUserID = await this.mongoDB.create(this.collection, userData);
    return createdUserID;
  }
}

module.exports = UsersService;
