import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, unlinkSync } from 'node:fs';
import { join } from 'node:path';
import type { INestApplication } from '@nestjs/common';
import { GraphQLError } from 'graphql';
import request from 'supertest';
import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import { GetProfileUseCase } from '../src/profile/application/index.js';

const databaseDirectory = join(process.cwd(), 'prisma', 'data');
const databaseName = `profile-e2e-${process.pid}.db`;
const databasePath = join(databaseDirectory, databaseName);
const databaseUrl = `file:./data/${databaseName}`;
mkdirSync(databaseDirectory, { recursive: true });
process.env.DATABASE_URL = databaseUrl;

const runDatabaseCommand = (command: string[]): void => {
  execFileSync('pnpm', ['prisma', ...command], {
    cwd: process.cwd(),
    env: { ...process.env, DATABASE_URL: databaseUrl, VITEST: undefined },
    stdio: 'pipe',
  });
};

describe('Profile GraphQL API', () => {
  let app: INestApplication;

  afterEach(() => {
    vi.restoreAllMocks();
  });

  beforeAll(async () => {
    if (existsSync(databasePath)) {
      unlinkSync(databasePath);
    }

    runDatabaseCommand(['migrate', 'deploy']);
    runDatabaseCommand(['db', 'seed']);

    const { NestFactory } = await import('@nestjs/core');
    const { AppModule } = await import('../src/app.module.js');
    app = await NestFactory.create(AppModule);
    await app.listen(0, '127.0.0.1');
  });

  afterAll(async () => {
    if (app) {
      await app.close();
    }
    if (existsSync(databasePath)) {
      unlinkSync(databasePath);
    }
  });

  it('returns a profile', async () => {
    const response = await request(app.getHttpServer())
      .post('/graphql')
      .send({ query: '{ profile(slug: "demid-nikitin") { id slug name description } }' });

    expect(response.body.errors).toBeUndefined();
    expect(response.body.data.profile.slug).toBe('demid-nikitin');
    expect(response.body.data.profile.name).toBe('Демид Никитин');
  });

  it('returns all seeded profiles', async () => {
    const response = await request(app.getHttpServer())
      .post('/graphql')
      .send({ query: '{ profiles { id slug name } }' });
    const slugs = response.body.data.profiles.map((profile: { slug: string }) => profile.slug);

    expect(response.body.errors).toBeUndefined();
    expect(slugs).toEqual(expect.arrayContaining(['demid-nikitin', 'nikita-krasnov']));
  });

  it('supports profile skill graph traversal', async () => {
    const response = await request(app.getHttpServer()).post('/graphql').send({
      query: '{ profile(slug: "demid-nikitin") { skills { id name profiles { id slug name skills { id name } } } } }',
    });
    const profiles = response.body.data.profile.skills.flatMap((skill: { profiles: unknown[] }) => skill.profiles);

    expect(response.body.errors).toBeUndefined();
    expect(profiles.some((profile: { slug: string }) => profile.slug === 'nikita-krasnov')).toBe(true);
    expect(profiles.some((profile: { skills: unknown[] }) => profile.skills.length > 0)).toBe(true);
  });

  it('returns a safe not found error', async () => {
    const response = await request(app.getHttpServer())
      .post('/graphql')
      .send({ query: '{ profile(slug: "profile-that-does-not-exist") { id slug name } }' });
    const error = response.body.errors[0];

    expect(error.extensions.code).toBe('PROFILE_NOT_FOUND');
    expect(error.message).toBe('Profile "profile-that-does-not-exist" not found');
    expect(JSON.stringify(error)).not.toContain('Prisma');
    expect(JSON.stringify(error)).not.toContain('stack');
  });

  it.each([
    [
      'unknown field',
      '{ profile { unknownField } }',
      undefined,
      'GRAPHQL_VALIDATION_FAILED',
      'Cannot query field "unknownField"',
    ],
    [
      'unknown argument',
      '{ profile(unknownArgument: "value") { id } }',
      undefined,
      'GRAPHQL_VALIDATION_FAILED',
      'Unknown argument "unknownArgument"',
    ],
    [
      'invalid argument type',
      '{ profile(slug: 123) { id } }',
      undefined,
      'GRAPHQL_VALIDATION_FAILED',
      'String cannot represent a non string value',
    ],
    ['invalid syntax', '{ profile {', undefined, 'GRAPHQL_PARSE_FAILED', 'Syntax Error'],
    [
      'invalid variable',
      'query ($slug: String!) { profile(slug: $slug) { id } }',
      { slug: 123 },
      'BAD_USER_INPUT',
      'Variable "$slug" got invalid value',
    ],
  ])('preserves client errors for %s', async (_name, query, variables, code, message) => {
    const response = await request(app.getHttpServer()).post('/graphql').send({ query, variables });

    expect(response.body.errors[0].message).toContain(message);
    expect(response.body.errors[0].extensions).toEqual({ code });
    expect(JSON.stringify(response.body)).not.toContain('stacktrace');
  });

  it.each([undefined, 'PROFILE_NOT_FOUND', 'BAD_USER_INPUT', 'GRAPHQL_VALIDATION_FAILED'])(
    'masks unexpected resolver errors with code %s',
    async (code) => {
      const message = 'Prisma invocation failed at /app/src/private.ts:42; SELECT * FROM SecretTable';
      const error = code
        ? new GraphQLError(message, { extensions: { code, internalMetadata: 'private-value' } })
        : new Error(message);
      error.name = 'PrivateDatabaseException';
      vi.spyOn(app.get(GetProfileUseCase), 'execute').mockRejectedValueOnce(error);

      const response = await request(app.getHttpServer())
        .post('/graphql')
        .send({ query: '{ profile(slug: "demid-nikitin") { id } }' });

      expect(response.body.data).toBeNull();
      expect(response.body.errors).toHaveLength(1);
      expect(response.body.errors[0]).toEqual({
        message: 'Internal server error',
        locations: [{ line: 1, column: 3 }],
        path: ['profile'],
        extensions: { code: 'INTERNAL_SERVER_ERROR' },
      });
      for (const detail of [
        message,
        'Prisma',
        '/app/',
        'SELECT',
        'SecretTable',
        'stack',
        'PrivateDatabaseException',
        'internalMetadata',
        'private-value',
      ]) {
        expect(JSON.stringify(response.body)).not.toContain(detail);
      }
    },
  );
});
