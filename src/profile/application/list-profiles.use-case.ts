import { Injectable } from '@nestjs/common';
import type { Profile } from '../domain/index.js';
import { ProfileRepository } from '../infrastructure/index.js';

@Injectable()
export class ListProfilesUseCase {
  constructor(private readonly repository: ProfileRepository) {}

  execute(): Promise<Profile[]> {
    return this.repository.listProfiles();
  }
}
