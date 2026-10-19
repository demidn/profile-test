import { Injectable } from '@nestjs/common';
import type { Skill } from '../domain/index.js';
import { ProfileRepository } from '../infrastructure/index.js';

@Injectable()
export class GetProfileSkillsUseCase {
  constructor(private readonly repository: ProfileRepository) {}

  execute(profileId: string): Promise<Skill[]> {
    return this.repository.getSkillsByProfileId(profileId);
  }
}
