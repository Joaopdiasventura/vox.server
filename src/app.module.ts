import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { AppConfig } from "./config/app.config";
import { DatabaseConfig } from "./config/db.config";
import { MongooseModule } from "@nestjs/mongoose";
import { CoreModule } from "./core/core.module";
import { EmailModule } from "./shared/services/email/email.module";
import { EventEmitterModule } from "@nestjs/event-emitter";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [AppConfig, DatabaseConfig] }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>("mongo.uri"),
      }),
    }),
    EventEmitterModule.forRoot(),
    EmailModule,
    CoreModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
