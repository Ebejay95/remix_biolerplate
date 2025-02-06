import { Model } from "mongoose";

export class BaseController {
 protected static model: Model<any>;

 static async findAll(filter = {}, select = '', sort = {}) {
   return this.model.find(filter).select(select).sort(sort);
 }

 static async findById(id: string) {
   return this.model.findById(id);
 }

static async findOne(filter = {}, select = '') {
  return this.model.findOne(filter).select(select);
}

 static async create(data: any) {
   return this.model.create(data);
 }

 static async update(id: string, data: any) {
   return this.model.findByIdAndUpdate(id, data, { new: true });
 }

 static async delete(id: string) {
   return this.model.findByIdAndDelete(id);
 }
}
