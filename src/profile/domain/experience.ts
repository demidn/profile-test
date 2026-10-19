export interface Experience {
  id: string;
  profileId: string;
  company: string;
  position: string;
  startDate: Date;
  endDate: Date | null;
  achievements: string;
}
