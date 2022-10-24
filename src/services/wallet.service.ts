import { v4 as uuid } from 'uuid';
import axios from 'axios';

import StoreService from './store.service';

import { SignData } from '../interfaces/wallet.interface';

import { encryptJSONData, decryptJSONData } from '../utils/crypto';

const REQUEST_PREFIX = process.env.REQUEST_PREFIX!;
const PROJECT_PREFIX = process.env.PROJECT_PREFIX!;
const SERVICE_PREFIX = process.env.SERVICE_PREFIX!;
const SERVICE_ADD_PREFIX = process.env.SERVICE_ADD_PREFIX!;

class WalletService {
  constructor(public storeService: StoreService) {}

  public async getUserkey(userkey: string | undefined): Promise<{ userkey: string }> {
    try {
      if (userkey === undefined) {
        const newUserId = this.generateUserId();
        const newUserkey = this.generateUserkey(newUserId);

        return { userkey: newUserkey };
      } else if (await this.isValidUserkey(userkey)) {
        return { userkey };
      } else {
        throw new Error('INVALID');
      }
    } catch (error) {
      throw error;
    }
  }

  public async getDappQRData(requestKey: string): Promise<{
    project: {
      projectId: string;
      name: string;
      icon: string;
    };
    service: {
      serviceId: string;
      name: string;
      icon: string;
    };
  }> {
    try {
      const serviceAddData = await this.getServiceAddData(requestKey);
      const projectId = serviceAddData.projectId;
      const serviceId = serviceAddData.serviceId;

      const projectInfo = await this.getProjectInfoById(projectId);
      const serviceInfo = await this.getServiceById(projectId, serviceId);

      return {
        project: {
          projectId: projectId,
          name: projectInfo.name,
          icon: projectInfo.icon,
        },
        service: {
          serviceId: serviceId,
          name: serviceInfo.name,
          icon: serviceInfo.icon,
        },
      };
    } catch (error) {
      throw error;
    }
  }

  public async getRequestData(requestKey: string): Promise<{
    qrType: number;
    signParams: { message: string; info: string; argument: object; signer: string; type: string };
    projectMetaData: { projectId: string; name: string; description: string; icon: string; url: string };
  }> {
    try {
      const requestQueueData = await this.getRequestQueueData(requestKey);
      const projectInfo = await this.getProjectInfo(requestQueueData.projectId);

      return {
        qrType: requestQueueData.qrType,
        signParams: {
          message: requestQueueData.message,
          info: requestQueueData.info,
          argument: requestQueueData.argument,
          signer: requestQueueData.signer,
          type: requestQueueData.type,
        },
        projectMetaData: {
          projectId: requestQueueData.projectId,
          name: projectInfo.name,
          description: projectInfo.description,
          icon: projectInfo.icon,
          url: projectInfo.url,
        },
      };
    } catch (error) {
      throw error;
    }
  }

  public async verifySign(requestKey: string, signature: string): Promise<{ isValid: boolean }> {
    try {
      const requestQueueData = await this.getRequestQueueData(requestKey);
      const projectInfo = await this.getProjectInfo(requestQueueData.projectId);
      const signer = requestQueueData.signer;

      const response = await this.projectVerifyRequest(projectInfo.verifyRequest, {
        requestKey,
        signature,
        signer,
      });

      const isValid = this.isValidVerifySignFromProject(response.data, requestKey, signature);

      return { isValid };
    } catch (error) {
      throw error;
    }
  }

  public async approveRequest(requestKey: string, signData: SignData): Promise<{ requestKey: string }> {
    try {
      const requestQueueData = await this.getRequestQueueData(requestKey);
      const projectInfo = await this.getProjectInfo(requestQueueData.projectId);
      const api = requestQueueData.api;
      const type = requestQueueData.type;

      this.projectCallback(projectInfo.callback, {
        requestKey,
        api,
        type,
        approve: true,
        signData,
      });

      if (requestQueueData.isMultiple === undefined || requestQueueData.isMultiple === false)
        this.removeRequestQueueData(requestKey);

      return { requestKey };
    } catch (error) {
      throw error;
    }
  }

  public async rejectRequest(requestKey: string): Promise<{ requestKey: string }> {
    try {
      const requestQueueData = await this.getRequestQueueData(requestKey);
      const projectInfo = await this.getProjectInfo(requestQueueData.projectId);
      const api = requestQueueData.api;
      const type = requestQueueData.type;

      this.projectCallback(projectInfo.callback, {
        requestKey,
        api,
        type,
        approve: false,
      });

      if (requestQueueData.isMultiple === undefined || requestQueueData.isMultiple === false)
        this.removeRequestQueueData(requestKey);

      return { requestKey };
    } catch (error) {
      throw error;
    }
  }

  private generateUserId(): string {
    return uuid();
  }

  private generateUserkey(userId: string): string {
    return encryptJSONData({ userId, timestamp: new Date().getTime() });
  }

  private async isValidUserkey(userkey: string): Promise<boolean> {
    decryptJSONData(userkey);
    return true;
  }

  private isValidVerifySignFromProject(
    data: { requestKey: string; signature: string; isValid: boolean },
    originRequestKey: string,
    originSignature: string
  ): boolean {
    let isValid = data.isValid;
    if (data.requestKey !== originRequestKey || data.signature !== originSignature) {
      isValid = false;
    }

    return isValid;
  }

  private async getServiceAddData(requestKey: string): Promise<{ projectId: string; serviceId: string }> {
    const jsonString = await this.storeService.hget(`${SERVICE_ADD_PREFIX}`, requestKey);

    if (jsonString === null) {
      throw new Error('INVALID DATA');
    }

    return JSON.parse(jsonString);
  }

  private async getRequestQueueData(requestKey: string): Promise<any> {
    const jsonString = await this.storeService.getMessage(`${REQUEST_PREFIX}${requestKey}`);

    if (jsonString === null) {
      throw new Error('INVALID DATA');
    }

    return JSON.parse(jsonString);
  }

  private async removeRequestQueueData(requestKey: string): Promise<void> {
    await this.storeService.removeMessage(`${REQUEST_PREFIX}${requestKey}`);
  }

  private async getProjectInfo(projectId: string): Promise<{
    callback: string;
    verifyRequest: string;
    name: string;
    description: string;
    icon: string;
    url: string;
  }> {
    return await this.storeService.hgetAll(`${PROJECT_PREFIX}${projectId}`);
  }

  private async projectVerifyRequest(uri: string, body: { requestKey: string; signature: string; signer: string }) {
    return await axios.post<{ requestKey: string; signature: string; isValid: boolean }>(uri, body);
  }

  private async getProjectInfoById(key: string): Promise<{
    callback: string;
    verifyRequest: string;
    name: string;
    description: string;
    icon: string;
    url: string;
    isDapp: string;
    isServiceOnly: string;
    token: string;
    order: number;
  }> {
    return await this.storeService.hgetAll(`${PROJECT_PREFIX}${key}`);
  }

  private async getServiceById(
    projectId: string,
    serviceId: string
  ): Promise<{
    serviceId: string;
    name: string;
    url: string;
    icon: string;
    isExternalBrowser: boolean;
  }> {
    const services = await this.storeService.hget(`${SERVICE_PREFIX}${projectId}`, serviceId);

    let serviceJSON = JSON.parse(services);
    serviceJSON.serviceId = serviceId;

    if (serviceJSON.isExternalBrowser === undefined) {
      serviceJSON.isExternalBrowser = false;
    }

    return serviceJSON;
  }

  private projectCallback(
    uri: string,
    body: {
      requestKey: string;
      api: string;
      type: number;
      approve: boolean;
      signData?: any;
    }
  ) {
    axios
      .post(uri, body)
      .then((response) => {})
      .catch((error) => {});
  }
}

export default WalletService;
