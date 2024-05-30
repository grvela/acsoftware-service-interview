import { Body, Headers, Controller, Post } from '@nestjs/common';
import { KeycloakAuthService } from './auth.service';
import { CredentialsDto } from './ credentials.dto';

@Controller('auth')
export class KeycloakAuthController {
  constructor(private keycloakAuthService: KeycloakAuthService) {}

  @Post('login')
  async login(@Body() credentials: CredentialsDto) {
    return await this.keycloakAuthService.login(credentials);
  }

  @Post('logout')
  async logout(@Headers('Refresh-Token') refreshToken: string) {
    return await this.keycloakAuthService.logout(refreshToken);
  }

  @Post('refresh-access-token')
  async refreshAccessToken(@Headers('Refresh-Token') refreshToken: string) {
    return await this.keycloakAuthService.refreshAccessToken(refreshToken);
  }
}