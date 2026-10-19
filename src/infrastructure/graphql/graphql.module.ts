import { ApolloDriver, type ApolloDriverConfig } from '@nestjs/apollo';
import { ApolloServerErrorCode, unwrapResolverError } from '@apollo/server/errors';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import type { GraphQLFormattedError } from 'graphql';
import { PublicGraphQLError } from './public-graphql.error.js';

function formatError(error: GraphQLFormattedError, originalError: unknown): GraphQLFormattedError {
  const cause = unwrapResolverError(originalError);
  const isPublic = cause instanceof PublicGraphQLError;
  const isRequestError = error.path === undefined;

  return {
    message: isPublic || isRequestError ? error.message : 'Internal server error',
    locations: error.locations,
    path: error.path,
    extensions: {
      code: isPublic || isRequestError ? error.extensions?.code : ApolloServerErrorCode.INTERNAL_SERVER_ERROR,
    },
  };
}

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      sortSchema: true,
      formatError,
    }),
  ],
})
export class GraphqlModule {}
