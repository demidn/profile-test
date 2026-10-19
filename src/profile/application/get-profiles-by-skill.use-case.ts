import { Injectable } from '@nestjs/common';
import type { Profile } from '../domain/index.js';
import { ProfileRepository } from '../infrastructure/index.js';

@Injectable()
export class GetProfilesBySkillUseCase {
  constructor(private readonly repository: ProfileRepository) {}

  execute(skillId: string): Promise<Profile[]> {
    return this.repository.getProfilesBySkillId(skillId);
  }
}
