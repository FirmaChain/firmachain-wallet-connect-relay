import { v4 as uuid } from 'uuid';

import StoreService from './store.service';

import { encryptData, encryptJSONData, decryptData } from '../utils/crypto';

class ProjectService {
  constructor(public storeService: StoreService) {}

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
    type: number,
    signer: string,
    message: string,
    info: string
  ): Promise<{ data: string }> {
    try {
      const requestKey = this.generateRequestId();
      const requestId = this.getEncryptRequestKey(requestKey);
      const api = 'sign';

      await this.addRequestQueue(requestKey, { requestId, projectId, api, message, info, type, signer });

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

  private async addRequestQueue(key: string, obj: Object): Promise<void> {
    await this.storeService.setMessage(key, JSON.stringify(obj), 60);
  }
}

export default ProjectService;
