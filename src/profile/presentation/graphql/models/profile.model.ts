import { Field, ID, ObjectType } from '@nestjs/graphql';
import { ExperienceModel } from './experience.model.js';
import { ProfileLinkModel } from './profile-link.model.js';
import { ProjectModel } from './project.model.js';
import { SkillModel } from './skill.model.js';

@ObjectType('Profile')
export class ProfileModel {
  @Field(() => ID) id!: string;
  @Field() slug!: string;
  @Field() name!: string;
  @Field() description!: string;
  @Field(() => [ProfileLinkModel]) links!: ProfileLinkModel[];
  @Field(() => [ExperienceModel]) experience!: ExperienceModel[];
  @Field(() => [ProjectModel]) projects!: ProjectModel[];
  @Field(() => [SkillModel]) skills?: SkillModel[];
}
