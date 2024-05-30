import { Module } from '@nestjs/common';
import { KeycloakUsersService } from './users.service';
import { HttpModule } from '@nestjs/axios';
import { KeycloakClientModule } from '../client/client.module';

@Module({
  imports: [HttpModule, KeycloakClientModule],
  providers: [KeycloakUsersService],
  exports: [KeycloakUsersService],
})
export class KeycloakUsersModule {}