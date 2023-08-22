export default class UserCurrentDTO {
  constructor(user) {
    this._id = user._id;
    this.name = user.name;
    this.email = user.email;
    this.age = user.age;
    this.cart = user.cart.toString();
    this.role = user.role;
  }
}
