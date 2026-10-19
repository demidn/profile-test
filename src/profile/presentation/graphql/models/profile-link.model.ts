import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType('ProfileLink')
export class ProfileLinkModel {
  @Field(() => ID) id!: string;
  @Field() type!: string;
  @Field() url!: string;
}
