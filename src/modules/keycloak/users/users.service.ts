import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';

import { CreateKeycloakUserDTO } from './create-user.dto';
import { KeycloakClientService } from '../client/client.service';
import { AxiosResponse } from 'axios';

@Injectable()
export class KeycloakUsersService {
  constructor(
    private httpService: HttpService,
    private client: KeycloakClientService,
  ) {}

  async create(
    createKeycloakUserDto: CreateKeycloakUserDTO,
  ): Promise<AxiosResponse> {
    const { access_token } = await this.client.auth();
    console.log(access_token);
    const { email, password } = createKeycloakUserDto;

    const endpoint = `${this.client.server}/admin/realms/${this.client.realm}/users`;

    const { data } = await firstValueFrom(
      this.httpService.post(
        endpoint,
        {
          email,
          enabled: true,
          credentials: [
            {
              type: 'password',
              value: password,
              temporary: false,
            },
          ],
        },
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
            'Content-Type': 'application/json',
          },
        },
      ),
    );

    return data;
  }
}