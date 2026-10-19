import { Field, ID, ObjectType } from '@nestjs/graphql';
import { ProfileModel } from './profile.model.js';

@ObjectType('Skill')
export class SkillModel {
  @Field(() => ID) id!: string;
  @Field() name!: string;
  @Field(() => [ProfileModel]) profiles?: ProfileModel[];
}
