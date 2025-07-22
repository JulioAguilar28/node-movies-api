export class UserModel {
  static async login(email, password) {
    return {
      email,
      password,
    };
  }
}
