import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { KeycloakClientService } from 'src/modules/keycloak/client/client.service';

@Injectable()
export class KeycloakGuard implements CanActivate {
  constructor(private kcClientService: KeycloakClientService) {}

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const authHeader = request.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Token is required');
    }

    const token = authHeader.split(' ')[1];

    const introspectResult = await this.kcClientService.introspect(token);

    if (introspectResult.active) {
      return true;
    } else {
      throw new UnauthorizedException('Invalid token');
    }
  }
}