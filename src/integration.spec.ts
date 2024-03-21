import * as supertest from 'supertest';
import * as jwt from 'jsonwebtoken';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module'; // Adjust the path as needed
import { INestApplication } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from '../src/api/auth/strategies/jwt.strategy';
describe('Authenticated endpoint with role', () => {
  let app: INestApplication;
  let jwtStrategy: JwtStrategy;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        AppModule, // Import your AppModule or relevant modules
        JwtModule.register({
          secret: 'your-secret-key',
        }),
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    jwtStrategy = app.get<JwtStrategy>(JwtStrategy);
  });

  afterAll(async () => {
    await app.close();
  });

  it('should return data for an admin user', async () => {
    // Mock user payload with the required role
    const mockUser = {
      id: 'user-id',
      email: 'admin@example.com',
      role: ['ADMIN'],
    };

    const token = jwt.sign(mockUser, 'your-secret-key');

    jest.spyOn(jwtStrategy, 'validate').mockResolvedValue(mockUser);

    const response = await supertest(app.getHttpServer())
      .get('/')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
  });

  it('/user (POST)', () => {
    return supertest(app.getHttpServer())
      .post('/user')
      .send({
        name: 'John Doe',
        email: 'john@example.com',
        isActive: true,
        password: 'Test@123',
      })
      .expect(201);
  });

  it('/user (GET)', async () => {
    // find all
    const mockUser = {
      id: 'user-id',
      email: 'admin@example.com',
      role: 'ADMIN',
    };

    const token = jwt.sign(mockUser, process.env.JWT_SECRET_KEY);
    jest.spyOn(jwtStrategy, 'validate').mockResolvedValue(mockUser);

    jest.spyOn(jwtStrategy, 'validate').mockResolvedValue(mockUser);
    await supertest(app.getHttpServer())
      .get('/user')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect('Content-Type', /json/);
  });

  it('should return a response with a token when a user logs in', async () => {
    const response = await supertest(app.getHttpServer()).post('/login').send({
      name: 'John Doe',
      email: 'john@example.com',
      isActive: true,
      password: 'Test@123',
    });

    console.log('Response Body:', response.body);
    console.log('Status Code:', response.status);
    console.log('Headers:', response.headers);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('token');
  });

  it('/user/:id (GET)', async () => {
    const mockUser = {
      id: 'user-id',
      email: 'admin@example.com',
      role: 'ADMIN',
    };

    const token = jwt.sign(mockUser, process.env.JWT_SECRET_KEY);
    jest.spyOn(jwtStrategy, 'validate').mockResolvedValue(mockUser);

    const response = await supertest(app.getHttpServer())
      .get('/user/2')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect('Content-Type', /json/);

    console.log(response.body);
  });
});
