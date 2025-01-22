import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

export type UserRole = 'user' | 'admin' | 'master';

const userSchema = new mongoose.Schema({
	email: {
	  type: String,
	  required: true,
	  unique: true
	},
	password: {
	  type: String,
	  required: true,
	  select: false
	},
	role: {
	  type: String,
	  enum: ['user', 'admin', 'master'],
	  default: 'user'
	},
	verified: {
	  type: Boolean,
	  default: false
	},
	verificationToken: String,
	createdAt: {
	  type: Date,
	  default: Date.now
	}
  });

  userSchema.pre('save', async function(next) {
	if (this.isModified('password')) {
	  console.log('Hashing password before save...');
	  this.password = await bcrypt.hash(this.password, 10);
	}
	next();
  });

export const User = mongoose.models.User || mongoose.model('User', userSchema);