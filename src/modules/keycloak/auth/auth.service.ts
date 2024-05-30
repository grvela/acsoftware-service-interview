import { Injectable } from '@nestjs/common';
import { CredentialsDto } from './ credentials.dto';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { KeycloakClientService } from '../client/client.service';
import { emit } from 'process';

@Injectable()
export class KeycloakAuthService {
  constructor(
    private httpService: HttpService,
    private client: KeycloakClientService,
  ) {}

  async login(credentials: CredentialsDto) {
    const { email, password } = credentials;

    console.log(email);
    console.log(password);

    const endpoint = `${this.client.server}/realms/${this.client.realm}/protocol/openid-connect/token`;

    const { data } = await firstValueFrom(
      this.httpService.post(
        endpoint,
        new URLSearchParams({
          client_id: this.client.client_id,
          client_secret: this.client.client_secret,
          grant_type: 'password',
          username: email,
          password,
        }),
      ),
    );
    return data;
  }

  async logout(refresh_token: string) {
    const endpoint = `${this.client.server}/realms/${this.client.realm}/protocol/openid-connect/logout`;

    const { data } = await firstValueFrom(
      this.httpService.post(
        endpoint,
        new URLSearchParams({
          client_id: this.client.client_id,
          client_secret: this.client.client_secret,
          grant_type: 'password',
          refresh_token,
        }),
      ),
    );

    return data;
  }

  async refreshAccessToken(refreshToken: string) {
    const endpoint = `${this.client.server}/realms/${this.client.realm}/protocol/openid-connect/token`;

    const { data } = await firstValueFrom(
      this.httpService.post(
        endpoint,
        new URLSearchParams({
          client_id: this.client.client_id,
          client_secret: this.client.client_secret,
          grant_type: 'refresh_token',
          refresh_token: refreshToken,
        }),
      ),
    );
    return data;
  }
}