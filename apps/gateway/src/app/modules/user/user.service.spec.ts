/**
 * Coverage: UsersService
 * - create: happy path, duplicate email, invalid/edge input, DB error
 * - findAll: pagination, search filtering, boundary values, DB error
 * - findById: happy path, soft-deleted lookup, not found
 * - update: happy path, fullName regeneration, forbidden role change, not found
 * - softDelete: sets isDeleted=true, does not delete record
 * - restoreUser: restores deleted user, conflicts on active user
 */

import {
  ConflictException,
  ForbiddenException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

import { UsersService } from './user.service';
import { USER_ERRORS } from './user.constants';
import { RegisterInput } from '../auth/dto/register.input';
import { UpdateUserInput } from './dto/update-user.input';
import { UserRole } from '../../shared/enums/user-role.enum';

jest.mock('bcryptjs', () => ({
  hash: jest.fn(),
}));

type MockModel = {
  findOne: jest.Mock<any, any>;
  create: jest.Mock<any, any>;
  find: jest.Mock<any, any>;
  countDocuments: jest.Mock<any, any>;
  findByIdAndUpdate: jest.Mock<any, any>;
};

describe('UsersService', () => {
  let service: UsersService;
  let userModel: MockModel;

  const sampleUser = {
    _id: 'abc123',
    firstName: 'Jane',
    lastName: 'Doe',
    fullName: 'Jane Doe',
    email: 'jane.doe@example.com',
    password: 'hashed-password',
    phoneNumber: '555-0000',
    role: UserRole.MEMBER,
    isDeleted: false,
  } as any;

  beforeEach(() => {
    userModel = {
      findOne: jest.fn(),
      create: jest.fn(),
      find: jest.fn(),
      countDocuments: jest.fn(),
      findByIdAndUpdate: jest.fn(),
    };

    service = new UsersService(userModel as any);
  });

  describe('create', () => {
    it('should create user when valid input is provided', async () => {
      const registerInput: RegisterInput = {
        firstName: 'Jane',
        lastName: 'Doe',
        employeeId: 'EMP001',
        email: 'jane.doe@example.com',
        password: 'Password123',
        phoneNumber: '555-0000',
      } as any;

      userModel.findOne.mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed-password');
      userModel.create.mockResolvedValue(sampleUser);

      const result = await service.create(registerInput);

      expect(userModel.findOne).toHaveBeenCalledWith({
        email: 'jane.doe@example.com',
      });
      expect(bcrypt.hash).toHaveBeenCalledWith(
        'Password123',
        10,
      );
      expect(userModel.create).toHaveBeenCalledWith({
        firstName: 'Jane',
        lastName: 'Doe',
        fullName: 'Jane Doe',
        email: 'jane.doe@example.com',
        password: 'hashed-password',
        phoneNumber: '555-0000',
        role: undefined,
        employeeId: 'EMP001',
      });
      expect(result).toEqual(sampleUser);
    });

    it('should throw ConflictException when duplicate email exists', async () => {
      const registerInput: RegisterInput = {
        firstName: 'Jane',
        lastName: 'Doe',
        employeeId: 'EMP001',
        email: 'jane.doe@example.com',
        password: 'Password123',
      } as any;

      userModel.findOne.mockResolvedValue(sampleUser);

      await expect(
        service.create(registerInput),
      ).rejects.toThrow(ConflictException);
      expect(userModel.create).not.toHaveBeenCalled();
    });

    it('should handle empty string fields and trim them before create', async () => {
      const registerInput: RegisterInput = {
        firstName: '   ',
        lastName: '   ',
        employeeId: 'EMP001',
        email: 'jane.doe@example.com',
        password: 'Password123',
      } as any;

      userModel.findOne.mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed-password');
      userModel.create.mockResolvedValue({
        ...sampleUser,
        firstName: '',
        lastName: '',
        fullName: '',
      });

      await service.create(registerInput);

      expect(userModel.create).toHaveBeenCalledWith(
        expect.objectContaining({
          firstName: '',
          lastName: '',
          fullName: '',
        }),
      );
    });

    it('should throw InternalServerErrorException when DB connection fails', async () => {
      const registerInput: RegisterInput = {
        firstName: 'Jane',
        lastName: 'Doe',
        employeeId: 'EMP001',
        email: 'jane.doe@example.com',
        password: 'Password123',
      } as any;

      userModel.findOne.mockRejectedValue(new Error('connection lost'));

      await expect(
        service.create(registerInput),
      ).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('findAll', () => {
    const queryMock = {
      sort: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      limit: jest.fn().mockResolvedValue([sampleUser]),
    };

    beforeEach(() => {
      userModel.find.mockReturnValue(queryMock as any);
      userModel.countDocuments.mockResolvedValue(1);
    });

    it('should return paginated users for valid paging values', async () => {
      const result = await service.findAll({
        page: 1,
        limit: 10,
      } as any);

      expect(userModel.find).toHaveBeenCalledWith({ isDeleted: false });
      expect(queryMock.sort).toHaveBeenCalled();
      expect(queryMock.skip).toHaveBeenCalledWith(0);
      expect(queryMock.limit).toHaveBeenCalledWith(10);
      expect(result.meta).toEqual({
        total: 1,
        page: 1,
        limit: 10,
        totalPages: 1,
      });
    });

    it('should handle page=0 and limit=0 as boundary values', async () => {
      await service.findAll({
        page: 0,
        limit: 0,
      } as any);

      expect(queryMock.skip).toHaveBeenCalledWith(-1 * 0);
      expect(queryMock.limit).toHaveBeenCalledWith(0);
    });

    it('should handle non-integer pagination values without throwing', async () => {
      await service.findAll({
        page: 1.5,
        limit: 2.7,
      } as any);

      expect(queryMock.skip).toHaveBeenCalledWith(0.5 * 2.7);
      expect(queryMock.limit).toHaveBeenCalledWith(2.7);
    });

    it('should throw InternalServerErrorException when countDocuments fails', async () => {
      userModel.countDocuments.mockRejectedValue(new Error('fail'));

      await expect(
        service.findAll({
          page: 1,
          limit: 10,
        } as any),
      ).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('findById', () => {
    it('should return a user when it exists and is not deleted', async () => {
      userModel.findOne.mockResolvedValue(sampleUser);

      const result = await service.findById('abc123');

      expect(userModel.findOne).toHaveBeenCalledWith({
        _id: 'abc123',
        isDeleted: false,
      });
      expect(result).toEqual(sampleUser);
    });

    it('should throw NotFoundException when the user is soft-deleted', async () => {
      userModel.findOne.mockResolvedValue(null);

      await expect(service.findById('abc123')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should update user fullName and return updated user', async () => {
      const updateInput: UpdateUserInput = {
        firstName: 'Janet',
        lastName: 'Dane',
      } as any;

      userModel.findOne.mockResolvedValue(sampleUser);
      userModel.findByIdAndUpdate.mockResolvedValue({
        ...sampleUser,
        ...updateInput,
        fullName: 'Janet Dane',
      });

      const result = await service.update('abc123', updateInput);

      expect(userModel.findByIdAndUpdate).toHaveBeenCalledWith(
        'abc123',
        expect.objectContaining({
          fullName: 'Janet Dane',
        }),
        { new: true },
      );
      expect(result.fullName).toBe('Janet Dane');
    });

    it('should throw ForbiddenException when attempting unauthorized role change', async () => {
      const updateInput: UpdateUserInput = {
        role: UserRole.ADMIN,
      } as any;

      userModel.findOne.mockResolvedValue(sampleUser);

      await expect(
        service.update('abc123', updateInput),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should throw NotFoundException when updating a missing user', async () => {
      userModel.findOne.mockResolvedValue(null);

      await expect(
        service.update('unknown', {
          firstName: 'New',
        } as any),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('softDelete', () => {
    it('should set isDeleted=true without deleting the record', async () => {
      userModel.findOne.mockResolvedValue(sampleUser);
      userModel.findByIdAndUpdate.mockResolvedValue(true);

      const result = await service.softDelete('abc123');

      expect(userModel.findByIdAndUpdate).toHaveBeenCalledWith(
        'abc123',
        expect.objectContaining({
          isDeleted: true,
          deletedAt: expect.any(Date),
        }),
      );
      expect(result).toBe(true);
    });

    it('should throw NotFoundException when soft deleting a missing user', async () => {
      userModel.findOne.mockResolvedValue(null);

      await expect(service.softDelete('abc123')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('restoreUser', () => {
    it('should restore a soft-deleted user successfully', async () => {
      userModel.findOne.mockResolvedValue({
        ...sampleUser,
        isDeleted: true,
      });
      userModel.findByIdAndUpdate.mockResolvedValue(true);

      const result = await service.restoreUser('abc123');

      expect(userModel.findByIdAndUpdate).toHaveBeenCalledWith(
        'abc123',
        {
          isDeleted: false,
          deletedAt: null,
        },
      );
      expect(result).toBe(true);
    });

    it('should throw ConflictException when restoring an active user', async () => {
      userModel.findOne.mockResolvedValue(sampleUser);

      await expect(service.restoreUser('abc123')).rejects.toThrow(
        ConflictException,
      );
    });

    it('should throw NotFoundException for a missing user on restore', async () => {
      userModel.findOne.mockResolvedValue(null);

      await expect(service.restoreUser('abc123')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
