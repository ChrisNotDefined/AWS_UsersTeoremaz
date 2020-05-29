import { BAD_REQUEST, NOT_FOUND, OK } from 'http-status-codes';
import { respond } from '../utils/response';
import Controller from '../models/Controller';
import User from '../models/User';

export default class UserController extends Controller {
  static basePath = '/users';

  static mountController(app) {
    return new UserController(app);
  }

  initialize() {
    this.app.get(UserController.basePath, UserController.getAllUsers);
    this.app.post(`${UserController.basePath}/login`, UserController.login);
    this.app.post(UserController.basePath, UserController.createUser);
  }

  static async getAllUsers(req, res) {
    try {
      const users = await new User().get();
      respond(res, OK, users);
    } catch (e) {
      UserController.handleUnknownError(res, e);
    }
  }

  static async login(req, res) {
    try {
      const expectedParams = ['username', 'password'];
      const validationErrors = [];

      expectedParams.forEach(key => {
        if (!req.body[key]) {
          validationErrors.push(`"${key}" was missing in the request.`);
        }
      });

      if (validationErrors.length > 0) {
        respond(res, BAD_REQUEST, {
          message: validationErrors.join('\n')
        });
        return;
      }

      const { username, password } = req.body;
      const ans = await new User(
        username,
        undefined,
        undefined,
        password
      ).verifyLogin();
      respond(res, OK, ans);
    } catch (e) {
      UserController.handleUnknownError(res, e);
    }
  }

  static async createUser(req, res) {
    try {
      const expectedParams = ['username', 'email', 'completeName', 'password'];
      const validationErrors = [];

      expectedParams.forEach(key => {
        if (!req.body[key]) {
          validationErrors.push(`"${key}" was missing in the request.`);
        }
      });

      if (validationErrors.length > 0) {
        respond(res, BAD_REQUEST, {
          message: validationErrors.join('\n')
        });
        return;
      }

      const { username, email, completeName, password } = req.body;

      const user = User.newUser(username, email, completeName, password);

      await user.create();

      respond(res, OK, user);
    } catch (e) {
      this.handleUnknownError(res, e);
    }
  }

  static async updateUser(req, res) {
    try {
      const allowedParams = ['username', 'email', 'completeName', 'password'];
      const validationErrors = [];
      allowedParams.forEach(key => {
        if (!req.body[key]) {
          validationErrors.push(`"${key}" value not specified`);
        }
      });

      if (validationErrors.length > 0) {
        respond(res, BAD_REQUEST, {
          messsage: validationErrors.join('\n')
        });
      }

      const { username, email, completeName, password } = req.body;
      const user = await new User(username).getByKey();
      if (!user) {
        respond(res, NOT_FOUND);
        return;
      }

      await user.update();

      respond(res, OK, user);
    } catch (e) {
      this.handleUnknownError(res, e);
    }
  }
}
