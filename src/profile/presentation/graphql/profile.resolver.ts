import { Args, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { GetProfileSkillsUseCase, GetProfileUseCase, ListProfilesUseCase } from '../../application/index.js';
import { ProfileModel } from './models/profile.model.js';
import { SkillModel } from './models/skill.model.js';
import { mapProfileToModel, mapSkillToModel } from './mappers/profile.mapper.js';
import { ProfileNotFoundError } from '../../domain/index.js';
import { PublicGraphQLError } from '../../../infrastructure/graphql/index.js';

@Resolver(() => ProfileModel)
export class ProfileResolver {
  constructor(
    private readonly getProfile: GetProfileUseCase,
    private readonly getSkills: GetProfileSkillsUseCase,
    private readonly listProfiles: ListProfilesUseCase,
  ) {}

  @Query(() => ProfileModel)
  async profile(@Args('slug', { defaultValue: 'demid-nikitin' }) slug: string): Promise<ProfileModel> {
    try {
      return mapProfileToModel(await this.getProfile.execute(slug));
    } catch (error) {
      if (error instanceof ProfileNotFoundError) {
        throw new PublicGraphQLError(error.message, error.code);
      }

      throw error;
    }
  }

  @Query(() => [ProfileModel])
  async profiles(): Promise<ProfileModel[]> {
    return (await this.listProfiles.execute()).map(mapProfileToModel);
  }

  @ResolveField(() => [SkillModel])
  async skills(@Parent() profile: ProfileModel): Promise<SkillModel[]> {
    return (await this.getSkills.execute(profile.id)).map(mapSkillToModel);
  }
}
