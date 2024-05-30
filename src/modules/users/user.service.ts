import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDTO } from './create-user.dto';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createUserDto: Partial<CreateUserDTO>): Promise<User> {
    return await this.userRepository.save(createUserDto);
  }

  async delete(id: number): Promise<void> {
    const result = await this.userRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException('Cannot delete user successfully');
    }
  }


}