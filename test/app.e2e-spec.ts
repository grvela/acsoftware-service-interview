import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('Tasks API (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/task (POST) - Create a task', () => {
    return request(app.getHttpServer())
      .post('/task')
      .send({
        title: 'Task',
        description: 'Task description',
        status: 'to-do',
        priority: 'low',
      })
      .expect(201)
      .then(response => {
        expect(response.body).toHaveProperty('id');
        expect(response.body.title).toEqual('Task');
        expect(response.body.description).toEqual('Task description');
        expect(response.body.status).toEqual('to-do');
        expect(response.body.priority).toEqual('low');
        expect(response.body).toHaveProperty('createdAt');
        expect(response.body).toHaveProperty('updatedAt');
      });
  });

  it('/task (POST) - Create a task only with title and description', () => {
    return request(app.getHttpServer())
      .post('/task')
      .send({
        title: 'Task',
        description: 'Task description',
      })
      .expect(201)
      .then(response => {
        expect(response.body).toHaveProperty('id');
        expect(response.body.title).toEqual('Task');
        expect(response.body.description).toEqual('Task description');
        expect(response.body.status).toEqual('to-do');
        expect(response.body.priority).toEqual('low');
        expect(response.body).toHaveProperty('createdAt');
        expect(response.body).toHaveProperty('updatedAt');
      });
  });

  it('/task (GET) - List all tasks', () => {
    return request(app.getHttpServer())
      .get('/task')
      .expect(200)
      .then(response => {
        expect(Array.isArray(response.body)).toBeTruthy();
      });
  });

  it('/task/:id (GET) - Get a specific task', () => {
    return request(app.getHttpServer())
      .get('/task/1')
      .expect(200)
      .then(response => {
        expect(response.body).toHaveProperty('id');
        expect(response.body).toHaveProperty('title');
        expect(response.body).toHaveProperty('description');
        expect(response.body).toHaveProperty('status');
        expect(response.body).toHaveProperty('priority');
        expect(response.body).toHaveProperty('createdAt');
        expect(response.body).toHaveProperty('updatedAt');
      });
  });

  it('/task/:id (PUT) - Update a task', () => {
    return request(app.getHttpServer())
      .patch('/task/1')
      .send({
        title: 'Updated Task',
        description: 'Updated description',
        status: 'in-progress',
        priority: 'high',
      })
      .expect(200)
      .then(response => {
        expect(response.body).toHaveProperty('id');
        expect(response.body.title).toEqual('Updated Task');
        expect(response.body.description).toEqual('Updated description');
        expect(response.body.status).toEqual('in-progress');
        expect(response.body.priority).toEqual('high');
        expect(response.body).toHaveProperty('createdAt');
        expect(response.body).toHaveProperty('updatedAt');
      });
  });

  it('/task/:id (PATCH) - Update a task with partial data', () => {
    return request(app.getHttpServer())
      .patch('/task/1')
      .send({
        status: 'done',
      })
      .expect(200)
      .then(response => {
        expect(response.body).toHaveProperty('id');
        expect(response.body).toHaveProperty('title');
        expect(response.body).toHaveProperty('description');
        expect(response.body.status).toEqual('done');
        expect(response.body).toHaveProperty('priority');
        expect(response.body).toHaveProperty('createdAt');
        expect(response.body).toHaveProperty('updatedAt');
      });
  });

  it('/task/:id (DELETE)', () => {
    return request(app.getHttpServer())
      .delete('/task/1')
      .expect(200)
      .then(response => {
        expect(response.body).toEqual(null);
      });
  });
});
