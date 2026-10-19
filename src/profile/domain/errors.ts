export const ProfileErrorCode = {
  NotFound: 'PROFILE_NOT_FOUND',
} as const;

export type ProfileErrorCode = (typeof ProfileErrorCode)[keyof typeof ProfileErrorCode];

export class ProfileNotFoundError extends Error {
  readonly code = ProfileErrorCode.NotFound;

  constructor(public readonly slug: string) {
    super(`Profile "${slug}" not found`);
    this.name = 'ProfileNotFoundError';
  }
}
