import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './user.schema';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email });
  }

  async createUser(email: string, password: string): Promise<User> {
    const user = new this.userModel({ email, password });
    return user.save();
  }

  async updateRefreshToken(userId: string, refreshToken: string): Promise<void> {
    await this.userModel.findByIdAndUpdate(userId, { refreshToken });
  }

  async findById(id: string): Promise<User | null> {
    return this.userModel.findById(id);
  }
} 