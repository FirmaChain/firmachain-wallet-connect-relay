import { Request, Response } from 'express';

import StoreService from '../services/store.service';
import ProjectService from '../services/project.service';

import { resultLog } from '../utils/logger';
import { SUCCESS, INVALID_KEY, INTERNAL_ERROR } from '../constants/httpResult';

class ProjectController {
  constructor(public storeService: StoreService, private projectService = new ProjectService(storeService)) {}

  public getProjects = (req: Request, res: Response): void => {
    this.projectService
      .getProjects()
      .then((result) => {
        resultLog(result);
        res.send({ ...SUCCESS, result });
      })
      .catch(() => {
        res.send({ ...INVALID_KEY, result: {} });
      });
  };

  public newProjectKey = (req: Request, res: Response): void => {
    const { projectSecretKey } = req.body;

    this.projectService
      .newProjectKey(projectSecretKey)
      .then((result) => {
        resultLog(result);
        res.send({ ...SUCCESS, result });
      })
      .catch(() => {
        res.send({ ...INVALID_KEY, result: {} });
      });
  };

  public newSignRequest = (req: Request, res: Response): void => {
    const { projectId, type, isMultiple, signer, message, info, argument } = req.body;

    this.projectService
      .newSignRequest(projectId, type, isMultiple, signer, message, info, argument)
      .then((result) => {
        resultLog(result);
        res.send({ ...SUCCESS, result });
      })
      .catch(() => {
        res.send({ ...INTERNAL_ERROR, result: {} });
      });
  };
}

export default ProjectController;
