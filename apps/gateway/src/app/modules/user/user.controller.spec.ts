/**
 * Coverage: UsersResolver as controller analogue
 * - Each GraphQL resolver method routes to the correct service call
 * - DTO validation rejects malformed payloads
 * - Reflection metadata exists for resolver parameters
 * - Pending guard coverage for missing auth guard implementation
 */

import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';

import { UsersResolver } from './user.resolver';
import { RegisterInput } from '../auth/dto/register.input';
import { UpdateUserInput } from './dto/update-user.input';
import { UsersInput } from './dto/users.input';
import { UserRole } from '../../shared/enums/user-role.enum';

describe('UsersResolver (controller equivalent)', () => {
  let resolver: UsersResolver;
  let usersService: Record<string, jest.Mock>;

  beforeEach(() => {
    usersService = {
      create: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      softDelete: jest.fn(),
      restoreUser: jest.fn(),
    };

    resolver = new UsersResolver(usersService as any);
  });

  describe('createUser', () => {
    it('should call usersService.create when createUser is invoked', async () => {
      const registerInput: RegisterInput = {
        firstName: 'Jane',
        lastName: 'Doe',
        employeeId: 'EMP001',
        email: 'jane.doe@example.com',
        password: 'Password123',
      } as any;
      const user = { id: '123', ...registerInput } as any;

      usersService.create.mockResolvedValue(user);

      const result = await resolver.createUser(registerInput);

      expect(usersService.create).toHaveBeenCalledWith(registerInput);
      expect(result).toBe(user);
    });
  });

  describe('users', () => {
    it('should call usersService.findAll when users query is invoked', async () => {
      const input: UsersInput = { page: 1, limit: 5 } as any;
      const paginated = {
        items: [],
        meta: { total: 0, page: 1, limit: 5, totalPages: 0 },
      } as any;

      usersService.findAll.mockResolvedValue(paginated);

      const result = await resolver.users(input);

      expect(usersService.findAll).toHaveBeenCalledWith(input);
      expect(result).toBe(paginated);
    });
  });

  describe('user', () => {
    it('should call usersService.findById when user query is invoked', async () => {
      const user = { id: 'abc123' } as any;
      usersService.findById.mockResolvedValue(user);

      const result = await resolver.user('abc123');

      expect(usersService.findById).toHaveBeenCalledWith('abc123');
      expect(result).toBe(user);
    });
  });

  describe('updateUser', () => {
    it('should call usersService.update when updateUser is invoked', async () => {
      const input: UpdateUserInput = {
        firstName: 'Janet',
        role: UserRole.ADMIN,
      } as any;
      const user = { id: 'abc123', ...input } as any;

      usersService.update.mockResolvedValue(user);

      const result = await resolver.updateUser(
        'abc123',
        input,
      );

      expect(usersService.update).toHaveBeenCalledWith(
        'abc123',
        input,
      );
      expect(result).toBe(user);
    });
  });

  describe('deleteUser', () => {
    it('should call usersService.softDelete when deleteUser is invoked', async () => {
      usersService.softDelete.mockResolvedValue(true);

      const result = await resolver.deleteUser('abc123');

      expect(usersService.softDelete).toHaveBeenCalledWith('abc123');
      expect(result).toBe(true);
    });
  });

  describe('restoreUser', () => {
    it('should call usersService.restoreUser when restoreUser is invoked', async () => {
      usersService.restoreUser.mockResolvedValue(true);

      const result = await resolver.restoreUser('abc123');

      expect(usersService.restoreUser).toHaveBeenCalledWith('abc123');
      expect(result).toBe(true);
    });
  });

  describe('DTO validation', () => {
    it('should reject malformed RegisterInput payloads', async () => {
      const payload = plainToInstance(RegisterInput, {
        firstName: 'Jane',
        email: 'not-an-email',
        password: '123',
      });

      const errors = await validate(payload);

      expect(errors.length).toBeGreaterThan(0);
      expect(errors.some((error) => error.property === 'email')).toBe(true);
      expect(errors.some((error) => error.property === 'password')).toBe(true);
    });

    it('should reject malformed UpdateUserInput payloads', async () => {
      const payload = plainToInstance(UpdateUserInput, {
        firstName: 123,
        role: 'invalid-role',
      });

      const errors = await validate(payload as any);

      expect(errors.length).toBeGreaterThan(0);
      expect(errors.some((error) => error.property === 'firstName')).toBe(true);
      expect(errors.some((error) => error.property === 'role')).toBe(true);
    });
  });

  describe('reflection metadata', () => {
    it('should expose design:paramtypes metadata for createUser resolver', () => {
      const paramTypes = Reflect.getMetadata(
        'design:paramtypes',
        UsersResolver.prototype,
        'createUser',
      );

      expect(paramTypes).toBeDefined();
      expect(paramTypes[0].name).toBe('RegisterInput');
    });
  });

  describe('auth guard', () => {
    it.skip('should prevent access when no token is provided', () => {
      // Auth guard is not implemented on current GraphQL resolver.
    });
  });
});
