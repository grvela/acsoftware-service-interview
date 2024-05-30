import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { KeycloakClientService } from './client.service';

@Module({
  imports: [ConfigModule, HttpModule],
  providers: [KeycloakClientService],
  exports: [KeycloakClientService],
})
export class KeycloakClientModule {}