import {
  ConflictException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
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
import { CreateUserInput } from './dto/create-user.input';
import { UsersInput } from './dto/users.input';
import { PaginatedUsersEntity } from './entity/pagingated-users.entity';
import { UserSortField } from './enums/user-sort-field.enum';
import { SortOrder } from './enums/sort-order.enum';
import { UpdateUserInput } from './dto/update-user.input';
import { USER_ERRORS } from './user.constants';
import { UserRole } from '../../shared/enums/user-role.enum';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
  ) {}

  async create(input: RegisterInput | CreateUserInput): Promise<User> {
    try {
      const email = input.email.toLowerCase().trim();

      const existingUser = await this.userModel.findOne({
        email,
      });

      if (existingUser) {
        throw new ConflictException(USER_ERRORS.USER_ALREADY_EXISTS);
      }

      const hashedPassword = await bcrypt.hash(input.password, 10);

      const firstName = input.firstName.trim();
      const lastName = input.lastName.trim();
      const fullName = `${firstName} ${lastName}`.trim();

      const role = (input as CreateUserInput).role ?? UserRole.PLAYER;
      const roles = [role];
      const bio = (input as CreateUserInput).bio ?? null;
      const avatar = (input as CreateUserInput).avatar ?? null;
      const employeeId =
        input.employeeId?.trim() ||
        `EMP-${Math.floor(1000 + Math.random() * 9000)}`;

      const user = await this.userModel.create({
        firstName,
        lastName,
        fullName,
        email,
        password: hashedPassword,
        phoneNumber: input.phoneNumber?.trim() || undefined,
        role,
        roles,
        bio: bio || undefined,
        avatar: avatar || undefined,
        employeeId,
        isActive: true,
        isEmailVerified: false,
        isDeleted: false,
      });

      return user;
    } catch (error) {
      if (
        error instanceof ConflictException ||
        error instanceof ForbiddenException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }

      throw new InternalServerErrorException(USER_ERRORS.DATABASE_ERROR);
    }
  }

  async findAll(input: UsersInput): Promise<PaginatedUsersEntity> {
    try {
      const {
        page = 1,
        limit = 10,
        search,
        role,
        isActive,
        sortBy = UserSortField.CREATED_AT,
        sortOrder = SortOrder.DESC,
      } = input;

      const skip = (page - 1) * limit;

      const filter: Record<string, any> = {
        isDeleted: false,
      };

      if (role) {
        filter.role = role.toLowerCase();
      }

      if (typeof isActive === 'boolean') {
        filter.isActive = isActive;
      }

      if (search?.trim()) {
        const trimmedSearch = search.trim();
        filter.$or = [
          {
            fullName: {
              $regex: trimmedSearch,
              $options: 'i',
            },
          },
          {
            email: {
              $regex: trimmedSearch,
              $options: 'i',
            },
          },
          {
            phoneNumber: {
              $regex: trimmedSearch,
              $options: 'i',
            },
          },
        ];
      }

      const [users, total] = (await Promise.all([
        this.userModel
          .find(filter)
          .sort({
            [sortBy]: sortOrder === SortOrder.ASC ? 1 : -1,
          })
          .skip(skip)
          .limit(limit)
          .exec(),

        this.userModel.countDocuments(filter).exec(),
      ])) as [User[], number];

      return {
        items: users as any,
        meta: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit) || 1,
        },
      };
    } catch (error) {
      throw new InternalServerErrorException(USER_ERRORS.DATABASE_ERROR);
    }
  }

  async findById(id: string): Promise<User> {
    try {
      const user = await this.userModel.findOne({
        _id: id,
        isDeleted: false,
      }).exec();

      if (!user) {
        throw new NotFoundException(USER_ERRORS.NOT_FOUND);
      }

      if (!user.roles || user.roles.length === 0) {
        user.roles = [user.role || UserRole.PLAYER];
      }

      return user;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new InternalServerErrorException(USER_ERRORS.DATABASE_ERROR);
    }
  }

  async findByEmailWithPassword(email: string): Promise<UserDocument | null> {
    return this.userModel
      .findOne({
        email: email.toLowerCase().trim(),
        isDeleted: false,
      })
      .select('+password')
      .exec();
  }

  async update(id: string, input: UpdateUserInput): Promise<User> {
    try {
      const user = await this.findById(id);

      const updatePayload: Partial<User> = {
        ...input,
      };

      if (input.role) {
        const lowerRole = input.role.toLowerCase() as UserRole;
        updatePayload.role = lowerRole;
        updatePayload.roles = [lowerRole];
      }

      const firstName = input.firstName ?? user.firstName;
      const lastName = input.lastName ?? user.lastName;

      updatePayload.fullName = `${firstName} ${lastName}`.trim();

      const updatedUser = await this.userModel
        .findByIdAndUpdate(id, updatePayload, {
          returnDocument: 'after',
        })
        .exec();

      if (!updatedUser) {
        throw new NotFoundException(USER_ERRORS.NOT_FOUND);
      }

      return updatedUser;
    } catch (error) {
      if (
        error instanceof ForbiddenException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }

      throw new InternalServerErrorException(USER_ERRORS.DATABASE_ERROR);
    }
  }

  async softDelete(id: string): Promise<boolean> {
    try {
      const user = (await this.findById(id)) as any;

      await this.userModel.findByIdAndUpdate(user._id, {
        isDeleted: true,
        deletedAt: new Date(),
      }).exec();

      return true;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new InternalServerErrorException(USER_ERRORS.DATABASE_ERROR);
    }
  }

  async restoreUser(id: string): Promise<boolean> {
    try {
      const user = (await this.userModel.findOne({
        _id: id,
      }).exec()) as any;

      if (!user) {
        throw new NotFoundException(USER_ERRORS.NOT_FOUND);
      }

      if (!user.isDeleted) {
        throw new ConflictException(USER_ERRORS.USER_ALREADY_ACTIVE);
      }

      await this.userModel.findByIdAndUpdate(user._id, {
        isDeleted: false,
        deletedAt: null,
      }).exec();

      return true;
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ConflictException
      ) {
        throw error;
      }

      throw new InternalServerErrorException(USER_ERRORS.DATABASE_ERROR);
    }
  }
}