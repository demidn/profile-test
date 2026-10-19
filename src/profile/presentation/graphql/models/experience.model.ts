import { Field, GraphQLISODateTime, ID, ObjectType } from '@nestjs/graphql';

@ObjectType('Experience')
export class ExperienceModel {
  @Field(() => ID) id!: string;
  @Field() company!: string;
  @Field() position!: string;
  @Field(() => GraphQLISODateTime) startDate!: Date;
  @Field(() => GraphQLISODateTime, { nullable: true }) endDate!: Date | null;
  @Field() achievements!: string;
}
