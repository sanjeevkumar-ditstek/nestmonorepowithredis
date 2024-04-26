import { ConfigService } from '@app/config';
import { ClientsModule } from '@nestjs/microservices';
import { MicroService } from 'libs/common/enum';

const ClientRegisters = [
  ClientsModule.register([
    {
      name: MicroService.USER_SERVICE,
      ...new ConfigService().get('redisService'),
    },
  ]),
];

export { ClientRegisters };
