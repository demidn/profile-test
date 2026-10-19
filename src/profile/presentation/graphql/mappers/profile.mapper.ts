import type { Experience, Profile, ProfileLink, Project, Skill } from '../../../domain/index.js';
import { ExperienceModel } from '../models/experience.model.js';
import { ProfileLinkModel } from '../models/profile-link.model.js';
import { ProfileModel } from '../models/profile.model.js';
import { ProjectModel } from '../models/project.model.js';
import { SkillModel } from '../models/skill.model.js';

export function mapExperienceToModel(experience: Experience): ExperienceModel {
  return {
    id: experience.id,
    company: experience.company,
    position: experience.position,
    startDate: experience.startDate,
    endDate: experience.endDate,
    achievements: experience.achievements,
  };
}

export function mapProfileLinkToModel(link: ProfileLink): ProfileLinkModel {
  return {
    id: link.id,
    type: link.type,
    url: link.url,
  };
}

export function mapProjectToModel(project: Project): ProjectModel {
  return {
    id: project.id,
    name: project.name,
    url: project.url,
  };
}

export function mapSkillToModel(skill: Skill): SkillModel {
  return {
    id: skill.id,
    name: skill.name,
  };
}

export function mapProfileToModel(profile: Profile): ProfileModel {
  return {
    id: profile.id,
    slug: profile.slug,
    name: profile.name,
    description: profile.description,
    links: profile.links.map(mapProfileLinkToModel),
    experience: profile.experience.map(mapExperienceToModel),
    projects: profile.projects.map(mapProjectToModel),
  };
}
