import DBManager from '../managers/DBManager';

const usersDBSchema = {
  username: {
    type: String,
    hashKey: true
  },
  email: String,
  completeName: String,
  password: String
};

export default class User extends DBManager {
  username;

  email;

  completeName;

  password;

  constructor(username, email, completeName, password) {
    super('users-teoremaz', usersDBSchema);
    this.username = username;
    this.email = email;
    this.completeName = completeName;
    this.password = password;
  }

  toDBFormat() {
    return {
      ...this
    };
  }

  getKey() {
    return this.username;
  }

  async verifyLogin() {
    const toVerify = { ...this };
    this.username = toVerify.username;
    const user = await this.getByKey();

    if (!user) return false;

    if (user.password === toVerify.password) {
      return true;
    }

    return false;
  }

  static newUser(username, email, completeName, password) {
    return new User(username, email, completeName, password);
  }

  // eslint-disable-next-line class-methods-use-this
  fromDBResponse(user) {
    const { username, email, completeName, password } = user;
    return new User(username, email, completeName, password);
  }
}
