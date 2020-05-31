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
    const ans = users.map(p => this.fromDBResponse(p));
    console.log(ans);
    return ans;
  }

  async getByKey() {
    const user = await this.db.get(this.getKey());
    return user ? this.fromDBResponse(user) : null;
  }

  create() {
    return this.db.create({ ...this.getKey(), ...this.toDBFormat() });
  }

  update() {
    return this.db.update(this.getKey(), this.toDBFormat());
  }

  delete() {
    return this.db.delete(this.getKey());
  }
}
