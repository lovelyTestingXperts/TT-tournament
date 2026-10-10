/**
 * Coverage: full GraphQL lifecycle for User operations
 * - createUser mutation returns created user
 * - users query returns pagination meta
 * - user query returns 404 for soft-deleted user
 * - deleteUser mutation soft deletes user without deletion
 * - restoreUser mutation restores user
 */

import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { getModelToken } from '@nestjs/mongoose';
import * as request from 'supertest';

import { UsersResolver } from './user.resolver';
import { UsersService } from './user.service';
import { User } from './schemas/user.schema';
import * as request from 'supertest';
import { UserRole } from '../../shared/enums/user-role.enum';

const sampleUser = {
  _id: 'abc123',
  firstName: 'Jane',
  lastName: 'Doe',
  fullName: 'Jane Doe',
  email: 'jane.doe@example.com',
  password: 'hidden',
  phoneNumber: '555-0000',
  role: UserRole.MEMBER,
  isDeleted: false,
};

const mockUserModel = {
  findOne: jest.fn(),
  create: jest.fn(),
  find: jest.fn(),
  countDocuments: jest.fn(),
  findByIdAndUpdate: jest.fn(),
};

describe('User Integration (GraphQL)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        GraphQLModule.forRoot<ApolloDriverConfig>({
          driver: ApolloDriver,
          autoSchemaFile: true,
          playground: false,
          sortSchema: true,
          context: ({ req }) => ({ req }),
        }),
      ],
      providers: [
        UsersResolver,
        UsersService,
        {
          provide: getModelToken(User.name),
          useValue: mockUserModel,
        },
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create a user via createUser mutation', async () => {
    mockUserModel.findOne.mockResolvedValue(null);
    mockUserModel.create.mockResolvedValue(sampleUser);

    const mutation = `
      mutation CreateUser($input: RegisterInput!) {
        createUser(registerInput: $input) {
          email
          firstName
          lastName
          fullName
        }
      }
    `;

    const response = await request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: mutation,
        variables: {
          input: {
            firstName: 'Jane',
            lastName: 'Doe',
            employeeId: 'EMP001',
            email: 'jane.doe@example.com',
            password: 'Password123',
          },
        },
      })
      .expect(200);

    expect(response.body.data.createUser).toEqual({
      email: sampleUser.email,
      firstName: sampleUser.firstName,
      lastName: sampleUser.lastName,
      fullName: sampleUser.fullName,
    });
  });

  it('should return paginated meta for users query', async () => {
    const queryMock = {
      sort: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      limit: jest.fn().mockResolvedValue([sampleUser]),
    };

    mockUserModel.find.mockReturnValue(queryMock as any);
    mockUserModel.countDocuments.mockResolvedValue(1);

    const query = `
      query GetUsers($input: UsersInput) {
        users(input: $input) {
          items { email }
          meta { total page limit totalPages }
        }
      }
    `;

    const response = await request(app.getHttpServer())
      .post('/graphql')
      .send({
        query,
        variables: {
          input: {
            page: 1,
            limit: 10,
          },
        },
      })
      .expect(200);

    expect(response.body.data.users.meta).toEqual({
      total: 1,
      page: 1,
      limit: 10,
      totalPages: 1,
    });
  });

  it('should return error for soft-deleted user when user query is executed', async () => {
    mockUserModel.findOne.mockResolvedValue(null);

    const query = `
      query GetUser($id: String!) {
        user(id: $id) { email }
      }
    `;

    const response = await request(app.getHttpServer())
      .post('/graphql')
      .send({
        query,
        variables: { id: 'deleted-id' },
      })
      .expect(200);

    expect(response.body.data).toBeNull();
    expect(response.body.errors).toBeDefined();
  });

  it('should soft delete a user and keep the record present', async () => {
    mockUserModel.findOne.mockResolvedValue(sampleUser);
    mockUserModel.findByIdAndUpdate.mockResolvedValue(true);

    const mutation = `
      mutation DeleteUser($id: String!) {
        deleteUser(id: $id)
      }
    `;

    const response = await request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: mutation,
        variables: { id: 'abc123' },
      })
      .expect(200);

    expect(response.body.data.deleteUser).toBe(true);
    expect(mockUserModel.findByIdAndUpdate).toHaveBeenCalledWith('abc123', {
      isDeleted: true,
      deletedAt: expect.any(Date),
    });
  });

  it('should restore a soft-deleted user via restoreUser mutation', async () => {
    mockUserModel.findOne.mockResolvedValue({
      ...sampleUser,
      isDeleted: true,
    });
    mockUserModel.findByIdAndUpdate.mockResolvedValue(true);

    const mutation = `
      mutation RestoreUser($id: String!) {
        restoreUser(id: $id)
      }
    `;

    const response = await request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: mutation,
        variables: { id: 'abc123' },
      })
      .expect(200);

    expect(response.body.data.restoreUser).toBe(true);
    expect(mockUserModel.findByIdAndUpdate).toHaveBeenCalledWith('abc123', {
      isDeleted: false,
      deletedAt: null,
    });
  });
});
