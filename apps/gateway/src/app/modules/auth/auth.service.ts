import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

import { RegisterInput } from './dto/register.input';
import { LoginInput } from './dto/login.input';
import { UsersService } from '../user/user.service';
import { UserRole } from '../../shared/enums/user-role.enum';
import { AuthPayload } from './entity/auth-payload.entity';
import { UserEntity } from '../user/entity/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerInput: RegisterInput): Promise<UserEntity> {
    // Public self-registration is strictly enforced to PLAYER role
    const sanitizedInput = {
      ...registerInput,
      role: UserRole.PLAYER,
    };

    const user = await this.usersService.create(sanitizedInput as any);
    return user as unknown as UserEntity;
  }

  async login(loginInput: LoginInput): Promise<AuthPayload> {
    const { email, password } = loginInput;

    const user = await this.usersService.findByEmailWithPassword(email);
    if (!user) {
      throw new UnauthorizedException('Invalid email or password.');
    }

    if (user.isDeleted) {
      throw new UnauthorizedException('Account has been deactivated.');
    }

    if (!user.isActive) {
      throw new ForbiddenException(
        'Your registration has been submitted and is currently awaiting Admin approval.',
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password.');
    }

    const roles =
      user.roles && user.roles.length > 0
        ? user.roles
        : [user.role || UserRole.PLAYER];

    const tokenPayload = {
      userId: user._id.toString(),
      sub: user._id.toString(),
      email: user.email,
      role: user.role,
      roles: roles,
    };

    const accessToken = this.jwtService.sign(tokenPayload);

    // Update lastLoginAt asynchronously without blocking
    this.usersService
      .update(user._id.toString(), {
        // preserve existing values, just trigger touch
      })
      .catch(() => null);

    return {
      accessToken,
      user: {
        id: user._id.toString(),
        firstName: user.firstName,
        lastName: user.lastName,
        fullName: user.fullName,
        email: user.email,
        employeeId: user.employeeId || '',
        phoneNumber: user.phoneNumber,
        role: user.role,
        roles: roles,
        isEmailVerified: user.isEmailVerified,
        isActive: user.isActive,
        avatar: user.avatar,
        bio: user.bio,
        lastLoginAt: user.lastLoginAt,
        emailVerifiedAt: user.emailVerifiedAt,
        createdAt: (user as any).createdAt,
        updatedAt: (user as any).updatedAt,
      } as UserEntity,
    };
  }

  async validateUserById(userId: string): Promise<UserEntity> {
    const user = await this.usersService.findById(userId);
    return user as unknown as UserEntity;
  }
}