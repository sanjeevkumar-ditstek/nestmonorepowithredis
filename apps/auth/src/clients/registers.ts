import { ConfigService } from '@app/config';
import { ClientsModule } from '@nestjs/microservices';

const ClientRegisters = [
  ClientsModule.register([
    {
      name: 'USER_SERVICE',
      ...new ConfigService().get('redisService'),
    },
  ]),
];

export { ClientRegisters };
