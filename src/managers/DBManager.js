import dynamoose from 'dynamoose';

dynamoose.aws.sdk.config.update({ region: 'us-east-1' });

export default class DBManager {
  db;

  constructor(tableName, schema) {
    this.db = dynamoose.model(tableName, schema);
  }

  // eslint-disable-next-line class-methods-use-this
  toDBFormat() {
    throw new Error('Method not implemented. Please use a proper sub-class.');
  }

  // eslint-disable-next-line class-methods-use-this
  getKey() {
    throw new Error('Method not implemented. Please use a proper sub-class.');
  }

  // eslint-disable-next-line class-methods-use-this
  fromDBResponse() {
    throw new Error('Method not implemented. Please use a proper sub-class.');
  }

  async get() {
    const users = await this.db.scan().exec();
    return users.map(p => this.fromDBResponse(p));
  }

  async getByKey() {
    const user = await this.db.get(this.getKey());
    return user ? this.fromDBResponse(user) : null;
  }

  create() {
    return this.db.create(this.toDBFormat());
  }

  update(prevUserName) {
    return this.db.update(prevUserName || this.getKey(), this.toDBFormat());
  }

  delete() {
    return this.db.delete(this.getKey());
  }
}
