export type ProfileLinkType = 'github' | 'linkedin' | 'website' | 'other';

export interface ProfileLink {
  id: string;
  profileId: string;
  type: ProfileLinkType;
  url: string;
}
