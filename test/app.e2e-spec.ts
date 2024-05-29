import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { CreateTaskDto } from '../src/modules/task/dto/create-task.dto';
import { TaskStatus, TaskPriority } from '../src/modules/task/dto/task.enum';

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

  describe('/task (POST)', () => {
    it('Create a task', () => {
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
  
    it('Create a task only with title and description', () => {
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

    it('Should return 400 if title is missing', async () => {
      const createTaskDto = {
        description: 'Task description',
        status: 'to-do',
        priority: 'low',
      };

      const response = await request(app.getHttpServer())
        .post('/task')
        .send(createTaskDto)
        .expect(400);

      expect(response.body.message).toContain('title should not be empty');
    });

    it('Should return 400 if description is missing', async () => {
      const createTaskDto = {
        title: 'Task Title',
        status: 'to-do',
        priority: 'low',
      };

      const response = await request(app.getHttpServer())
        .post('/task')
        .send(createTaskDto)
        .expect(400);

      expect(response.body.message).toContain('description should not be empty');
    });

    it('Should return 400 if status is invalid', async () => {
      const createTaskDto = {
        title: 'Task Title',
        description: 'Task description',
        status: 'invalid-status',
        priority: 'low',
      };

      const response = await request(app.getHttpServer())
        .post('/task')
        .send(createTaskDto)
        .expect(400);

      expect(response.body.message).toContain('status must be a valid enum value');
    });

    it('Should return 400 if priority is invalid', async () => {
      const createTaskDto = {
        title: 'Task Title',
        description: 'Task description',
        status: 'to-do',
        priority: 'invalid-priority',
      };

      const response = await request(app.getHttpServer())
        .post('/task')
        .send(createTaskDto)
        .expect(400);

      expect(response.body.message).toContain('priority must be a valid enum value');
    });
  });


  describe('/task (GET)', () => {
    it('List all tasks when no tasks exist', async () => {
      const response = await request(app.getHttpServer())
        .get('/task')
        .expect(200);

      expect(Array.isArray(response.body)).toBeTruthy();
      expect(response.body.length).toBe(0);
    });

    it('Get a specific task that does not exist', async () => {
      const response = await request(app.getHttpServer())
        .get('/task/999')
        .expect(404);

      expect(response.body.message).toContain('Task not found');
    });
  });

  describe('/task/:id (PATCH)', () => {
    it('Should return 404 if task does not exist', async () => {
      const updateTaskDto = {
        title: 'Updated Task',
        description: 'Updated description',
        status: 'in-progress',
        priority: 'high',
      };

      const response = await request(app.getHttpServer())
        .patch('/task/999')
        .send(updateTaskDto)
        .expect(404);

      expect(response.body.message).toContain('Task not found');
    });

    it('Should return 400 if data is invalid', async () => {
      const createTaskDto: CreateTaskDto = {
        title: 'Initial Task',
        description: 'Initial description',
        status: TaskStatus.TO_DO,
        priority: TaskPriority.LOW,
      };

      const { body: createdTask } = await request(app.getHttpServer())
        .post('/task')
        .send(createTaskDto)
        .expect(201);

      const updateTaskDto = {
        status: 'invalid-status',
      };

      const response = await request(app.getHttpServer())
        .patch(`/task/${createdTask.id}`)
        .send(updateTaskDto)
        .expect(400);

      expect(response.body.message).toContain('status must be a valid enum value');
    });
  });

  describe('/task/:id (DELETE)', () => {
    it('should return 404 if task does not exist', async () => {
      const response = await request(app.getHttpServer())
        .delete('/task/999')
        .expect(404);

      expect(response.body.message).toContain('Task not found');
    });
  });
});
