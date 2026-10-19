import type { Experience } from './experience.js';
import type { ProfileLink } from './profile-link.js';
import type { Project } from './project.js';

export interface Profile {
  id: string;
  slug: string;
  name: string;
  description: string;
  links: ProfileLink[];
  experience: Experience[];
  projects: Project[];
}
