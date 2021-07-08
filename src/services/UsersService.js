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
      deleted: false,
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
      this.collection,
      { _id: ObjectId(userId), deleted: false },
      { password: 0 },
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

    filter.deleted = false;

    const sort = {};

    if (query.sortby) {
      if (query.sort) {
        sort[query.sortby] = query.sort === 'desc' ? -1 : 1;
      } else {
        sort[query.sortby] = -1;
      }
    } else {
      sort.createdAt = -1;
    }

    const projection = {
      password: 0,
    };

    return this.mongoDB.list(this.collection, filter, projection, sort);
  }

  async updateUser(payload, userId, data) {
    const { sub, role } = payload;

    if (role !== 'admin' && sub !== userId) {
      throw Boom
        .unauthorized('You do not have the permissions to access the resource');
    }

    const newData = {
      ...data,
      updatedAt: new Date(),
    };

    const query = {
      _id: ObjectId(userId),
      deleted: false,
    };

    const updated = await this.mongoDB.update(
      this.collection, query, newData,
    );

    if (!updated.matchedCount) {
      throw Boom.notFound('user does not found');
    }

    return userId;
  }

  async deleteUser(payload, userId) {
    const { sub, role } = payload;

    if (role !== 'admin' && sub !== userId) {
      throw Boom
        .unauthorized('You do not have the permissions to access the resource');
    }

    const data = {
      deleted: true,
    };

    const query = {
      _id: ObjectId(userId),
      deleted: false,
    };

    const deleted = await this.mongoDB.update(this.collection, query, data);

    if (!deleted.matchedCount) {
      throw Boom.notFound('user does not found');
    }

    return userId;
  }
}

module.exports = UsersService;
