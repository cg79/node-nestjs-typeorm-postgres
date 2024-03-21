import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

describe('UserService', () => {
  let service: UserService;
  let repository: Repository<UserEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(UserEntity),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    repository = module.get<Repository<UserEntity>>(
      getRepositoryToken(UserEntity),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a user', async () => {
      const createUserDto: CreateUserDto = {
        fullName: 'John Doe',
        email: 'john@example.com',
        isActive: true,
        password: 'password123',
      };

      const mockUserEntity = new UserEntity();
      jest.spyOn(repository, 'create').mockReturnValue(mockUserEntity);
      jest.spyOn(repository, 'save').mockResolvedValue(mockUserEntity);

      const result = await service.create(createUserDto);

      expect(result).toEqual(mockUserEntity);
      expect(repository.create).toHaveBeenCalledWith(createUserDto);
      expect(repository.save).toHaveBeenCalledWith(mockUserEntity);
    });
  });

  describe('findAll', () => {
    it('should return all users', async () => {
      const mockUsers = [new UserEntity(), new UserEntity()];
      jest.spyOn(repository, 'find').mockResolvedValue(mockUsers);

      const result = await service.findAll();

      expect(result).toEqual(mockUsers);
      expect(repository.find).toHaveBeenCalled();
    });
  });

  describe('findOneOrFail', () => {
    it('should return user if found', async () => {
      const conditions = { id: 1 };
      const mockUser = new UserEntity();
      jest.spyOn(repository, 'findOneOrFail').mockResolvedValue(mockUser);

      const result = await service.findOneOrFail(conditions);

      expect(result).toEqual(mockUser);
      expect(repository.findOneOrFail).toHaveBeenCalledWith(
        conditions,
        undefined,
      );
    });

    it('should throw NotFoundException if user not found', async () => {
      const conditions = { id: 999 };
      jest
        .spyOn(repository, 'findOneOrFail')
        .mockRejectedValue(new Error('User not found'));

      await expect(service.findOneOrFail(conditions)).rejects.toThrowError(
        NotFoundException,
      );
    });
  });

  describe('findOne', () => {
    it('should return user by id', async () => {
      const userId = 1;
      const mockUser = new UserEntity();
      jest.spyOn(repository, 'findByIds').mockResolvedValue([mockUser]);

      const result = await service.findOne(userId);

      expect(result).toEqual([mockUser]);
      expect(repository.findByIds).toHaveBeenCalledWith([userId]);
    });
  });

  describe('update', () => {
    it('should update user', async () => {
      const userId = 1;
      const updateUserDto: UpdateUserDto = {
        fullName: 'Updated Name',
        email: 'updated@example.com',
        isActive: false,
      };

      const result = await service.update(userId, updateUserDto);

      expect(result).toEqual(`This action updates a #${userId} user`);
    });
  });

  describe('remove', () => {
    it('should remove user', async () => {
      const userId = 1;

      const result = await service.remove(userId);

      expect(result).toEqual(`This action removes a #${userId} user`);
    });
  });
});
