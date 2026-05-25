import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import * as bcrypt from 'bcryptjs';

import {
  User,
  UserDocument,
} from './schemas/user.schema';

import { RegisterInput } from '../auth/dto/register.input';
import { UsersInput } from './dto/users.input';
import { PaginatedUsersEntity } from './entity/pagingated-users.entity';
import { UserSortField } from './enums/user-sort-field.enum';
import { SortOrder } from './enums/sort-order.enum';
import { UpdateUserInput } from './dto/update-user.input';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
  ) { }

  async create(
    registerInput: RegisterInput,
  ): Promise<User> {
    const email =
      registerInput.email.toLowerCase();

    const existingUser =
      await this.userModel.findOne({
        email,
      });

    if (existingUser) {
      throw new ConflictException(
        'User already exists',
      );
    }

    const hashedPassword =
      await bcrypt.hash(
        registerInput.password,
        10,
      );

    const fullName =
      `${registerInput.firstName} ${registerInput.lastName}`;

    const user =
      await this.userModel.create({
        firstName:
          registerInput.firstName.trim(),

        lastName:
          registerInput.lastName.trim(),

        fullName,

        email,

        password:
          hashedPassword,

        phoneNumber:
          registerInput.phoneNumber,

        role: undefined,
        employeeId: registerInput.employeeId
      });

    return user;
  }

  async findAll(
    input: UsersInput,
  ): Promise<PaginatedUsersEntity> {
    const {
      page = 1,
      limit = 10,
      search,
      sortBy = UserSortField.CREATED_AT,
      sortOrder = SortOrder.DESC,
    } = input;

    const skip =
      (page - 1) * limit;

    const filter: any =
    {
      isDeleted: false,
    };

    if (search?.trim()) {
      filter.$or = [
        {
          fullName: {
            $regex: search,
            $options: 'i',
          },
        },
        {
          email: {
            $regex: search,
            $options: 'i',
          },
        },
        {
          phoneNumber: {
            $regex: search,
            $options: 'i',
          },
        },
      ];
    }

    const [users, total] =
      await Promise.all([
        this.userModel
          .find(filter)
          .sort({
            [sortBy]:
              sortOrder ===
                SortOrder.ASC
                ? 1
                : -1,
          })
          .skip(skip)
          .limit(limit),

        this.userModel.countDocuments(
          filter,
        ),
      ]);

    return {
      items: users,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(
          total / limit,
        ),
      },
    };
  }


  async findById(
    id: string,
  ): Promise<User> {
    const user =
      await this.userModel.findOne({
        _id: id,
        isDeleted: false,
      });

    if (!user) {
      throw new NotFoundException(
        'User not found',
      );
    }

    return user;
  }

  async update(
    id: string,
    input: UpdateUserInput,
  ): Promise<User> {
    const user =
      await this.findById(id);

    const updatePayload: Partial<User> =
    {
      ...input,
    };

    const firstName =
      input.firstName ??
      user.firstName;

    const lastName =
      input.lastName ??
      user.lastName;

    updatePayload.fullName =
      `${firstName} ${lastName}`;

    const updatedUser =
      await this.userModel.findByIdAndUpdate(
        id,
        updatePayload,
        {
          new: true,
        },
      );

    if (!updatedUser) {
      throw new NotFoundException(
        'User not found',
      );
    }

    return updatedUser;
  }
  async softDelete(
    id: string,
  ): Promise<boolean> {
    const user =
      await this.findById(id);

    await this.userModel.findByIdAndUpdate(
      user._id,
      {
        isDeleted: true,
        deletedAt: new Date(),
      },
    );

    return true;
  }
}