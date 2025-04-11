import { Project } from '../../moneybird/models/project';

export type Activity = string;
export type ActivitiesPerProject = {
  [key: Project['id']]: Activity[];
};
