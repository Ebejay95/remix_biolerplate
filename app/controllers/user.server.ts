import { BaseController } from "./base.server";
import { User } from "~/models/user.server";

export class UserController extends BaseController {
 protected static model = User;

 static async getUsers() {
   const users = await this.findAll({}, 'email role verified createdAt', { createdAt: -1 });
   return users.map(user => ({
     _id: user._id.toString(),
     email: user.email,
     role: user.role,
     verified: user.verified,
     createdAt: user.createdAt.toLocaleString()
   }));
 }
}
