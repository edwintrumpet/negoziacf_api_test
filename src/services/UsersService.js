const Boom = require('@hapi/boom');
const bcrypt = require('bcrypt');

const { ObjectId } = require('mongodb');
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

  async getUser(payload, userId) {
    const { sub, role } = payload;

    if (role !== 'admin' && sub !== userId) {
      throw Boom
        .unauthorized('You do not have the permissions to access the resource');
    }

    const user = await this.mongoDB.getOne(
      this.collection, { _id: ObjectId(userId) }, { password: 0 },
    );

    delete user._id;

    return { id: userId, ...user };
  }

  async listUsers(role, query) {
    if (role !== 'admin') {
      throw Boom
        .unauthorized('You do not have the permissions to access the resource');
    }

    const filter = {};

    if (query.name) {
      const regExp = new RegExp(query.name, 'i');
      filter.name = { $regex: regExp };
    }

    if (query.email) {
      const regExp = new RegExp(query.email, 'i');
      filter.email = { $regex: regExp };
    }

    if (query.role) {
      filter.role = query.role;
    }

    return this.mongoDB.list(this.collection, filter);
  }
}

module.exports = UsersService;
