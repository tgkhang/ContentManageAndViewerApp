import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ContentsModule } from './contents/contents.module';
import { MulterModule } from '@nestjs/platform-express';
import { S3Module } from './s3/s3.module';
import { UploadsModule } from './uploads/uploads.module';
import { ContentsGateway } from './contents/contents.gateway';
 
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      //envFilePath: '.env',
    }),
    UsersModule,
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    //MongooseModule.forRoot(process.env.MONGODB_URI!),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>("MONGODB_URI"),
      }),
    }),
    ContentsModule,
    MulterModule.register({
      limits: {
        fileSize: 10 * 1024 * 1024, // 10MB
      },
    }),
    S3Module,
    UploadsModule,
  ],
  controllers: [AppController],
  providers: [AppService, ContentsGateway],
})
export class AppModule {}
