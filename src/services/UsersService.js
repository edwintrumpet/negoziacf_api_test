const Boom = require('@hapi/boom');
const bcrypt = require('bcrypt');

const MongoLib = require('../lib/Mongo');
const { createToken } = require('../utils/tokens');

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

  async login({ email, password }) {
    const {
      password: hash, _id: id, role, name,
    } = await this.mongoDB.getOne(
      this.collection, { email }, { password: 1, role: 1, name: 1 },
    );

    if (!hash) throw Boom.unauthorized('User or password invalid');

    const match = await bcrypt.compare(password, hash);

    if (!match) throw Boom.unauthorized('User or password invalid');

    const token = createToken({ id, role });

    return {
      token, role, name, id,
    };
  }
}

module.exports = UsersService;
