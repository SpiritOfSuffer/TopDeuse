import { Module } from '@nestjs/common';
import { ConfigService } from './ConfigService';

 const environment = process.env.NODE_ENV || '';
 
 @Module({
  providers: [
    {
      provide: ConfigService,
      useValue: new ConfigService(`${environment}.env`),
    },
  ],
  exports: [ConfigService],
})
export class ConfigModule {}