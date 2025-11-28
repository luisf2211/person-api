import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AuthController } from './features/auth/auth.controller';
import { AuthService } from './features/auth/auth.service';
import { ConfigModule } from '@nestjs/config';
import { BasicAuthMiddleware } from './common/middleware/basic-auth.middleware';
import { BearerAuthMiddleware } from './common/middleware/bearer-auth.middleware';
import { PersonsController } from './features/persons/persons.controller';
import { PersonsService } from './features/persons/persons.service';
import { HttpModule } from '@nestjs/axios';
import { CoreService } from './infra/http/core.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    HttpModule,
  ],
  controllers: [AuthController, PersonsController],
  providers: [AuthService, PersonsService, CoreService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(BasicAuthMiddleware).forRoutes('auth/login');
    consumer.apply(BearerAuthMiddleware).forRoutes('persons', 'person');
  }
}
