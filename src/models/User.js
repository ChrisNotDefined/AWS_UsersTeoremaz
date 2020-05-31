import { sha512 } from 'js-sha512';
import DBManager from '../managers/DBManager';

const usersDBSchema = {
  username: {
    type: String,
    hashKey: true
  },
  email: String,
  completeName: String,
  password: String,
  courses: {
    type: Array,
    schema: [String]
  }
};

export default class User extends DBManager {
  username;

  email;

  completeName;

  password;

  courses;

  constructor(username, email, completeName, password, courses) {
    super('users-teoremaz', usersDBSchema);
    this.username = username;
    this.email = email;
    this.completeName = completeName;
    this.password = password;
    this.courses = courses;
  }

  toDBFormat() {
    return {
      email: this.email,
      completeName: this.completeName,
      password: this.password,
      courses: this.courses
    };
  }

  getKey() {
    return { username: this.username };
  }

  async verifyLogin() {
    const toVerify = { ...this };
    this.username = toVerify.username;
    const user = await this.getByKey();

    if (!user) return false;
    if (user.password === sha512(toVerify.password)) {
      return user;
    }

    return false;
  }

  static newUser(username, email, completeName, password, courses) {
    return new User(username, email, completeName, sha512(password), courses);
  }

  // eslint-disable-next-line class-methods-use-this
  fromDBResponse(user) {
    const { username, email, completeName, password, courses } = user;
    return new User(username, email, completeName, password, courses);
  }
}
