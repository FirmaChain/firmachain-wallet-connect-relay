import { v4 as uuid } from 'uuid';

import StoreService from './store.service';

import { encryptData, encryptJSONData, decryptData } from '../utils/crypto';

const REQUEST_EXPIRE_SECOND = Number.parseInt(process.env.REQUEST_EXPIRE_SECOND!);
const REQUEST_PREFIX = process.env.REQUEST_PREFIX!;
const PROJECT_PREFIX = process.env.PROJECT_PREFIX!;
const SERVICE_PREFIX = process.env.SERVICE_PREFIX!;

class ProjectService {
  constructor(public storeService: StoreService) {}

  public async getProjects(): Promise<any> {
    try {
      const projectList = await this.getProjectList();

      return {
        projectList,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  public async newProjectKey(projectSecretKey: string): Promise<{ projectKey: string }> {
    try {
      const projectId = this.getDecryptProjectId(projectSecretKey);
      const projectKey = this.getEncryptProjectKey(projectId);

      return {
        projectKey,
      };
    } catch (error) {
      throw error;
    }
  }

  public async newSignRequest(
    projectId: string,
    qrType: number,
    type: number,
    isMultiple: boolean,
    signer: string,
    message: string,
    info: string,
    argument: any
  ): Promise<{ data: string }> {
    try {
      const requestKey = this.generateRequestId();
      const requestId = this.getEncryptRequestKey(requestKey);
      const api = 'sign';

      argument = argument === undefined ? {} : argument;

      await this.addRequestQueue(requestKey, isMultiple, {
        requestId,
        qrType,
        projectId,
        isMultiple,
        api,
        message,
        info,
        argument,
        type,
        signer,
      });

      return {
        data: `${api}://${requestKey}`,
      };
    } catch (error) {
      throw error;
    }
  }

  private getDecryptProjectId(projectSecretKey: string): string {
    return decryptData(projectSecretKey);
  }

  private getEncryptProjectKey(projectId: string): string {
    return encryptJSONData({ projectId, timestamp: new Date().getTime() });
  }

  private getEncryptRequestKey(requestId: string): string {
    return encryptData(requestId);
  }

  private generateRequestId(): string {
    return uuid();
  }

  private async addRequestQueue(key: string, isMultiple: boolean, obj: Object): Promise<void> {
    if (isMultiple) {
      await this.storeService.setMessage(`${REQUEST_PREFIX}${key}`, JSON.stringify(obj));
    } else {
      await this.storeService.setMessage(`${REQUEST_PREFIX}${key}`, JSON.stringify(obj), REQUEST_EXPIRE_SECOND);
    }
  }

  private async getProjectList(): Promise<
    {
      name: string;
      description: string;
      url: string;
      icon: string;
      identity: string;
    }[]
  > {
    const projectKeys = await this.storeService.keys(`${PROJECT_PREFIX}*`);

    let result = [];

    for (let projectKey of projectKeys) {
      const projectInfo = await this.getProjectInfoByKey(projectKey);
      const serviceList = await this.getServiceList(projectKey);

      const name = projectInfo.name;
      const description = projectInfo.description;
      const url = projectInfo.url;
      const icon = projectInfo.icon;
      const isDapp = projectInfo.isDapp === 'true';
      const isServiceOnly = projectInfo.isServiceOnly === 'true';
      const identity = projectKey.replace(PROJECT_PREFIX, '');
      const token = projectInfo.token ? JSON.parse(projectInfo.token) : null;

      if (isDapp === false) {
        continue;
      }

      result.push({
        name,
        description,
        url,
        icon,
        identity,
        isServiceOnly,
        serviceList,
        token,
      });
    }

    return result;
  }

  private async getProjectInfoByKey(key: string): Promise<{
    callback: string;
    verifyRequest: string;
    name: string;
    description: string;
    icon: string;
    url: string;
    isDapp: string;
    isServiceOnly: string;
    token: string;
  }> {
    return await this.storeService.hgetAll(key);
  }

  private async getServiceList(key: string): Promise<
    {
      name: string;
      url: string;
      icon: string;
    }[]
  > {
    const services = await this.storeService.hgetAll(`${SERVICE_PREFIX}${key.replace(PROJECT_PREFIX, '')}`);

    console.log(`${SERVICE_PREFIX}${key}`);

    let result: { name: string; url: string; icon: string }[] = [];
    for (let serviceId in services) {
      const serviceJSON = JSON.parse(services[serviceId]);
      result.push(serviceJSON);
    }

    return result;
  }
}

export default ProjectService;
