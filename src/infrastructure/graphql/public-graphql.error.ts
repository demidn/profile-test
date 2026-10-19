import { GraphQLError } from 'graphql';

export class PublicGraphQLError extends GraphQLError {
  constructor(message: string, code: string) {
    super(message, { extensions: { code } });
  }
}
