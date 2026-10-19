import { Module } from '@nestjs/common';
import { DatabaseModule } from './infrastructure/database/index.js';
import { GraphqlModule } from './infrastructure/graphql/index.js';
import { ProfileModule } from './profile/profile.module.js';

@Module({
  imports: [DatabaseModule, GraphqlModule, ProfileModule],
})
export class AppModule {}
