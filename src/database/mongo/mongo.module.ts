import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { mongoConfig } from '../../config/mongo.config';

@Module({
  imports: [MongooseModule.forRoot(mongoConfig.uri, mongoConfig)],
})
export class MongoModule {}
