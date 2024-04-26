import { Transport } from '@nestjs/microservices';
import { config } from 'dotenv';
config();

export class ConfigService {
  /* eslint-disable */
  private readonly envConfig: { [key: string]: any } = null;
  // private readonly envConfig: EnvConfig = null;
  constructor() {
    this.envConfig = {};
    this.envConfig.port = process.env.API_GATEWAY_PORT;
    this.envConfig.url = process.env.MONGO_CONNECTION_STRING;
    this.envConfig.jwtSecret = process.env.JWT_SECRET_KEY;
    this.envConfig.appApiKey = process.env.APP_API_KEY;
    this.envConfig.permissionAbilityKey = process.env.CHECK_ABILITY_KEY;
    this.envConfig.jwtExpireIn = process.env.JWT_EXPIRE_IN;
    (this.envConfig.esUrl = process.env.ES_URL || 'http://localhost:9200'),
      (this.envConfig.redisService = {
        options: {
          host: process.env.REDIS_SERVICE_HOST,
          port: process.env.REDIS_SERVICE_PORT,
        },
        transport: Transport.REDIS,
      });
  }

  get(key: string) {
    return this.envConfig[key];
  }
}
