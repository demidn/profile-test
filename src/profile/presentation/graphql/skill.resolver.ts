import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { GetProfilesBySkillUseCase } from '../../application/index.js';
import { mapProfileToModel } from './mappers/profile.mapper.js';
import { ProfileModel } from './models/profile.model.js';
import { SkillModel } from './models/skill.model.js';

@Resolver(() => SkillModel)
export class SkillResolver {
  constructor(private readonly getProfilesBySkill: GetProfilesBySkillUseCase) {}

  @ResolveField(() => [ProfileModel])
  async profiles(@Parent() skill: SkillModel): Promise<ProfileModel[]> {
    const profiles = await this.getProfilesBySkill.execute(skill.id);

    return profiles.map(mapProfileToModel);
  }
}
