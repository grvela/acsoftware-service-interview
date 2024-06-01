import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class KeycloakClientService {
  public readonly server: string;
  public readonly realm: string;
  public readonly client_id: string;
  public readonly client_secret: string;

  constructor(
    private configService: ConfigService,
    private httpService: HttpService,
  ) {
    this.server = this.configService.get('KEYCLOAK_URL');
    this.realm = this.configService.get('KEYCLOAK_REALM');
    this.client_id = this.configService.get('KEYCLOAK_CLIENT_ID');
    this.client_secret = this.configService.get('KEYCLOAK_CLIENT_SECRET');
  }

  public async auth() {
    const endpoint = `${this.server}/realms/${this.realm}/protocol/openid-connect/token`;

    const { data } = await firstValueFrom(
      this.httpService.post(
        endpoint,
        new URLSearchParams({
          client_id: this.client_id,
          client_secret: this.client_secret,
          grant_type: 'client_credentials',
        }),
      ),
    );

    return data;
  }

  public async introspect(token: string){
    const endpoint = `${this.server}/realms/${this.realm}/protocol/openid-connect/token/introspect`;

    const { data } =  await firstValueFrom(
      this.httpService.post(
        endpoint,
        new URLSearchParams({
          client_id: this.client_id,
          client_secret: this.client_secret,
          grant_type: 'client_credentials',
          token: token
        }),
      ),
    );

    return data;
  }
}