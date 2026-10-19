import { Injectable } from '@nestjs/common';
import type { Profile } from '../domain/index.js';
import { ProfileRepository } from '../infrastructure/index.js';

@Injectable()
export class GetProfileUseCase {
  constructor(private readonly repository: ProfileRepository) {}

  execute(slug: string): Promise<Profile> {
    return this.repository.getProfileBySlug(slug);
  }
}
