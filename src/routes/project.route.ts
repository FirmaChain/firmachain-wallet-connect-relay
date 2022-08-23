import { Router } from 'express';
import { Routes } from '../interfaces/routes.interface';

import StoreService from '../services/store.service';
import ProjectController from '../controllers/project.controller';

import { projectAuthMiddleware } from '../middlewares/auth.middleware';
import validationMiddleware from '../middlewares/validation.middleware';

import { ProjectAuthDto, NewSignDto } from '../dtos/project.dto';

class ProjectRoute implements Routes {
  constructor(
    public storeService: StoreService,
    public path = '/projects',
    public router = Router(),
    private projectController = new ProjectController(storeService)
  ) {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(
      `${this.path}/auth`,
      validationMiddleware(ProjectAuthDto, 'body'),
      this.projectController.newProjectKey
    );

    this.router.post(
      `${this.path}/sign`,
      projectAuthMiddleware(),
      validationMiddleware(NewSignDto, 'body'),
      this.projectController.newSignRequest
    );
  }
}

export default ProjectRoute;