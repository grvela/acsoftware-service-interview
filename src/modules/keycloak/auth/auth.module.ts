import { Module } from '@nestjs/common';
import { KeycloakAuthService } from './auth.service';
import { HttpModule } from '@nestjs/axios';
import { KeycloakAuthController } from './auth.controller';
import { KeycloakClientModule } from '../client/client.module';

@Module({
  imports: [HttpModule, KeycloakClientModule],
  controllers: [KeycloakAuthController],
  providers: [KeycloakAuthService],
})
export class KeycloakAuthModule {}