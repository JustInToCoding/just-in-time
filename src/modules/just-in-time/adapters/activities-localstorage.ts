import { ActivitiesPerProject, Activity } from '../models/activities';

export const getActivities = async (projectId: string): Promise<Activity[]> => {
  const activities = localStorage.getItem('activities');
  if (activities === null) {
    return Promise.resolve([]);
  }

  const activitiesPerProject = JSON.parse(activities) as ActivitiesPerProject;

  if (activitiesPerProject[projectId] === undefined) {
    return Promise.resolve([]);
  }

  return Promise.resolve(activitiesPerProject[projectId]);
};

export const postActivities = async (projectId: string, activities: Activity[]): Promise<void> => {
  const activitiesString = localStorage.getItem('activities');
  let activitiesPerProject: ActivitiesPerProject = {};

  if (activitiesString !== null) {
    activitiesPerProject = JSON.parse(activitiesString) as ActivitiesPerProject;
  }

  activitiesPerProject[projectId] = activities;

  localStorage.setItem('activities', JSON.stringify(activitiesPerProject));

  return Promise.resolve();
};
