import { Module } from '@nestjs/common';
import {
  GetProfileSkillsUseCase,
  GetProfileUseCase,
  GetProfilesBySkillUseCase,
  ListProfilesUseCase,
} from './application/index.js';
import { ProfileRepository } from './infrastructure/index.js';
import { ProfileResolver, SkillResolver } from './presentation/index.js';

@Module({
  providers: [
    ProfileResolver,
    SkillResolver,
    GetProfileUseCase,
    ListProfilesUseCase,
    GetProfileSkillsUseCase,
    GetProfilesBySkillUseCase,
    ProfileRepository,
  ],
})
export class ProfileModule {}
