import { Injectable } from '@nestjs/common';
import type { Prisma, Skill as SkillRecord } from '@prisma/client';
import { PrismaService } from '../../infrastructure/database/index.js';
import {
  type Experience,
  type Profile,
  type ProfileLink,
  type ProfileLinkType,
  ProfileNotFoundError,
  type Project,
  type Skill,
} from '../domain/index.js';

const profileInclude = {
  links: true,
  experience: {
    orderBy: {
      startDate: 'desc',
    },
  },
  projects: true,
} satisfies Prisma.ProfileInclude;

type ProfileRecord = Prisma.ProfileGetPayload<{ include: typeof profileInclude }>;
type ProfileLinkRecord = ProfileRecord['links'][number];
type ExperienceRecord = ProfileRecord['experience'][number];
type ProjectRecord = ProfileRecord['projects'][number];

function toProfileLinkType(type: string): ProfileLinkType {
  switch (type) {
    case 'github':
    case 'linkedin':
    case 'website':
    case 'other':
      return type;
    default:
      throw new Error(`Unsupported profile link type: ${type}`);
  }
}

function toProfileLink(link: ProfileLinkRecord): ProfileLink {
  return {
    id: link.id,
    profileId: link.profileId,
    type: toProfileLinkType(link.type),
    url: link.url,
  };
}

function toExperience(experience: ExperienceRecord): Experience {
  return {
    id: experience.id,
    profileId: experience.profileId,
    company: experience.company,
    position: experience.position,
    startDate: experience.startDate,
    endDate: experience.endDate,
    achievements: experience.achievements,
  };
}

function toProject(project: ProjectRecord): Project {
  return {
    id: project.id,
    profileId: project.profileId,
    name: project.name,
    url: project.url,
  };
}

function toSkill(skill: SkillRecord): Skill {
  return {
    id: skill.id,
    name: skill.name,
  };
}

function toProfile(profile: ProfileRecord): Profile {
  return {
    id: profile.id,
    slug: profile.slug,
    name: profile.name,
    description: profile.description,
    links: profile.links.map(toProfileLink),
    experience: profile.experience.map(toExperience),
    projects: profile.projects.map(toProject),
  };
}

@Injectable()
export class ProfileRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getProfileBySlug(slug: string): Promise<Profile> {
    const profile = await this.prisma.profile.findUnique({
      where: { slug },
      include: profileInclude,
    });

    if (!profile) {
      throw new ProfileNotFoundError(slug);
    }

    return toProfile(profile);
  }

  async listProfiles(): Promise<Profile[]> {
    const profiles = await this.prisma.profile.findMany({
      include: profileInclude,
      orderBy: { name: 'asc' },
    });

    return profiles.map(toProfile);
  }

  async getProfilesBySkillId(skillId: string): Promise<Profile[]> {
    const profiles = await this.prisma.profile.findMany({
      where: { skills: { some: { skillId } } },
      include: profileInclude,
      orderBy: { name: 'asc' },
    });

    return profiles.map(toProfile);
  }

  async getSkillsByProfileId(profileId: string): Promise<Skill[]> {
    const skills = await this.prisma.skill.findMany({
      where: { profiles: { some: { profileId } } },
      orderBy: { name: 'asc' },
    });

    return skills.map(toSkill);
  }
}
