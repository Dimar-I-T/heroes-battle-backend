import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';

describe('JWT Token API (e2e)', () => {
  let app: INestApplication;
  let accessToken: string; 
  
  const testUser = {
    username: `testuser_${Date.now()}`, 
    password: 'Password123!',
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    app.setGlobalPrefix('api');
    app.useGlobalPipes(new ValidationPipe()); 
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Token Generation & Validation', () => {
    
    it('1. [POST /api/auth/register] : Harus berhasil register dan mengembalikan JWT Token', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/auth/register')
        .send(testUser)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('access_token');
      accessToken = response.body.data.access_token;
    });

    it('2. [GET /api/player-heroes/me] : Harus ditolak jika tidak mengirimkan Token', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/player-heroes/me')
        .expect(401); 
        
      expect(response.body.message).toMatch(/unauthorized/i);
    });

    it('3. [GET /api/player-heroes/me] - Harus diterima jika menggunakan Token yang valid', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/player-heroes/me')
        .set('Authorization', `Bearer ${accessToken}`) 
        .expect(200); 

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true); 
    });
  });
});