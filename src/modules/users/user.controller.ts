import {
    Controller,
    Post,
    Body,
  } from '@nestjs/common';
  
  import { UsersService } from './user.service';
  import { CreateUserDTO } from './create-user.dto';
  import { KeycloakUsersService } from '../keycloak/users/users.service';
  
  @Controller('user')
  export class UsersController {
    constructor(
      private readonly usersService: UsersService,
      private readonly kcUsersService: KeycloakUsersService,
    ) {}
  
    @Post()
    async create(@Body() createUserDto: CreateUserDTO) {
      const { email, password } = createUserDto;
      
      const user = await this.usersService.create(createUserDto);
      
      await this.kcUsersService
        .create({
          email,
          password,
        })
        .catch(async (KeycloakError) => {
          
          await this.usersService.delete(user.id);
  
          throw KeycloakError;
        });
  
      return user;
    }
  }