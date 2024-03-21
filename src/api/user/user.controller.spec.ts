import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Role } from './entities/user.entity';

describe('UserController', () => {
  let controller: UserController;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a user', async () => {
      const createUserDto: CreateUserDto = {
        fullName: 'John Doe',
        email: 'john@example.com',
        isActive: true,
        password: 'password123',
      };

      await controller.create(createUserDto);

      expect(userService.create).toHaveBeenCalledWith(createUserDto);
    });
  });

  describe('findAll', () => {
    it('should return all users', async () => {
      await controller.findAll();

      expect(userService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a user by id', async () => {
      const userId = '1';

      await controller.findOne(userId);

      expect(userService.findOne).toHaveBeenCalledWith(+userId);
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const userId = '1';
      const updateUserDto: UpdateUserDto = {
        fullName: 'Updated Name',
        email: 'updated@example.com',
        isActive: false,
      };

      await controller.update(userId, updateUserDto);

      expect(userService.update).toHaveBeenCalledWith(+userId, updateUserDto);
    });
  });

  describe('remove', () => {
    it('should remove a user by id', async () => {
      const userId = '1';

      await controller.remove(userId);

      expect(userService.remove).toHaveBeenCalledWith(+userId);
    });
  });
});
