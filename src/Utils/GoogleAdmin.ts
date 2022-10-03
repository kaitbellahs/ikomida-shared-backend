import FBAdmin, { app } from 'firebase-admin';
import { Credential } from 'firebase-admin/app';
import { FirebaseError } from '@firebase/util';
import axios from 'axios';
import iKomidaError from './iKomidaError';
import sharp from 'sharp';
import Logger from './Logger';
import { Interfaces, Classes, Types } from '@ikomida/shared-types';
import { AddressModel } from '../Domain/Models';

export default class GoogleAdmin {
  googleAdmin?: FBAdmin.app.App;
  credential?: Credential;
  logger: Logger;
  production;
  servicesUrl: Interfaces.IMetadata = {};

  constructor(logger: Logger) {
    this.logger = logger;
    this.production = process.env.NODE_ENV === 'production';
  }

  async getCredential() {
    if (!this.credential) {
      try {
        const credentials = JSON.parse(Buffer.from(process.env.GOOGLEADMIN ?? '', 'base64').toString());
        this.credential = FBAdmin.credential.cert(credentials);
      } catch (exception: any) {
        this.logger.error(exception);
      }
    }
    return this.credential;
  }

  async getGoogleAdmin(): Promise<app.App | null> {
    if (!this.googleAdmin) {
      try {
        this.googleAdmin = FBAdmin.initializeApp({
          credential: await this.getCredential(),
        });
      } catch (exception: any) {
        this.logger.error(exception);
        return null;
      }
    }
    return this.googleAdmin;
  }

  async getAccessToken() {
    try {
      const credential = await this.getCredential();
      const response = await credential?.getAccessToken();
      return response?.access_token;
    } catch (exception: any) {
      this.logger.error(exception);
      return null;
    }
  }

  async listProjects() {
    const accessToken = await this.getAccessToken();
    const uri = 'https://firebase.googleapis.com/v1beta1/availableProjects';

    try {
      const response = await axios.get(`${uri}`, {
        headers: {
          Authorization: 'Bearer ' + accessToken,
          'X-Requested-With': 'iKomida-PS-V0.0.1',
        },
      });
      if (response.status >= 200 && response.status < 300) {
        return response?.data;
      }
    } catch (exception: any) {
      this.logger.error(axios.isAxiosError(exception) ? exception.response?.data : exception);
    }
    return null;
  }

  async getRunServiceURL(name: string) {
    try {
      if (name in this.servicesUrl) {
        return this.servicesUrl?.[name];
      }
      const accessToken = await this.getAccessToken();
      const uri = `https://us-central1-run.googleapis.com/apis/serving.knative.dev/v1/namespaces/ikomida-prod/services/${name}`;

      const response = await axios.get(`${uri}`, {
        headers: {
          Authorization: 'Bearer ' + accessToken,
          'X-Requested-With': 'iKomida-PS-V0.0.1',
        },
      });
      if (!this.production) {
        this.logger.log(response?.data);
      }
      if (response.status >= 200 && response.status < 300) {
        if (!this.servicesUrl) {
          this.servicesUrl = {};
        }
        this.servicesUrl[name] = response?.data?.status?.url;
        return this.servicesUrl?.[name];
      }
    } catch (exception: any) {
      this.logger.error(axios.isAxiosError(exception) ? exception.response?.data : exception);
    }
    return null;
  }

  async androidApps(projectId: any) {
    const accessToken = await this.getAccessToken();
    const uri = `https://firebase.googleapis.com/v1beta1/projects/${projectId}/androidApps`;
    try {
      const response = await axios.get(`${uri}`, {
        headers: {
          Authorization: 'Bearer ' + accessToken,
          'X-Requested-With': 'iKomida-PS-V0.0.1',
        },
      });
      this.logger.log(response?.data);
      if (response.status >= 200 && response.status < 300) {
        return response?.data;
      }
    } catch (exception: any) {
      this.logger.error(axios.isAxiosError(exception) ? exception.response?.data : exception);
    }
  }

  async androidApp(projectId: any, appID: any) {
    const accessToken = await this.getAccessToken();
    const uri = `https://firebase.googleapis.com/v1beta1/projects/${projectId}/androidApps/${appID}/config`;
    this.logger.log(uri);
    try {
      const response = await axios.get(`${uri}`, {
        headers: {
          Authorization: 'Bearer ' + accessToken,
          'X-Requested-With': 'iKomida-PS-V0.0.1',
        },
      });
      this.logger.log(response?.data);
      if (response.status >= 200 && response.status < 300) {
        return null;
      }
    } catch (exception: any) {
      this.logger.error(axios.isAxiosError(exception) ? exception.response?.data : exception);
    }
  }

  async createNewApp(displayName: any, packageName: any, platform: string) {
    try {
      const admin = await this.getGoogleAdmin();
      const defaultProjectManagement = admin?.projectManagement();
      let response;
      if (platform === 'android') {
        response = await defaultProjectManagement?.createAndroidApp(packageName, displayName);
      } else if (platform === 'ios') {
        response = await defaultProjectManagement?.createIosApp(packageName, displayName);
      }
      return { code: 0, id: response?.appId };
    } catch (exception: any) {
      if (exception instanceof FirebaseError) {
        this.logger.error(exception?.message);
        this.logger.warn(`googleAdmin: ${exception?.code}, ${JSON.stringify(exception)}`);
        switch (exception?.code) {
          case 'project-management/already-exists':
            return { code: 1 };
          //TODO: -- handle other errors
          // case 'messaging/invalid-argument':
          //     return { code: 2 }
        }
      }
      const error = new iKomidaError(iKomidaError.GOOGLE_ADMIN_CREATE_NEW_ANDROID_APP, exception);
      error.log(this.logger);
    }
    return { code: -1 };
  }

  // async addAndroidApp(projectId, displayName, packageName) {
  //     const accessToken = await this.getAccessToken()
  //     const uri = `https://firebase.googleapis.com/v1beta1/projects/${projectId}/androidApps`
  //     const body = {
  //         'displayName': displayName,
  //         'packageName': packageName
  //     }

  //     try {
  //         let response = await axios.post(`${uri}`, body, {
  //             headers: {
  //                 'Authorization': 'Bearer ' + accessToken
  //             }
  //         })
  //         console.log(response?.data)
  //         if (response.status >= 200 && response.status < 300) {
  //             return null
  //         }
  //     } catch (error: any) {
  //         console.error(error.response?.data)
  //     }
  //     return null
  // }

  async currentAndroidConfig(appId: any) {
    try {
      const admin = await this.getGoogleAdmin();
      const defaultProjectManagement = admin?.projectManagement();
      const defaultAndroidApp = await defaultProjectManagement?.androidApp(appId);
      const response = await defaultAndroidApp?.getConfig();
      return response ?? null;
    } catch (exception: any) {
      const error = new iKomidaError(iKomidaError.GOOGLE_ADMIN_GET_CURRENT_ANDROID_CONFIG, exception);
      error.log(this.logger);
    }
    return null;
  }

  async currentIosConfig(appId: any) {
    try {
      const admin = await this.getGoogleAdmin();
      const defaultProjectManagement = admin?.projectManagement();
      const defaultIosApp = await defaultProjectManagement?.iosApp(appId);
      const response = await defaultIosApp?.getConfig();
      return response ?? null;
    } catch (exception: any) {
      const error = new iKomidaError(iKomidaError.GOOGLE_ADMIN_GET_CURRENT_IOS_CONFIG, exception);
      error.log(this.logger);
    }
    return null;
  }
  // async currentPolicy() {
  //     const accessToken = await this.getAccessToken()
  //     const uri = `https://cloudresourcemanager.googleapis.com/v1/projects/storied-shelter-287123:getIamPolicy`
  //     const body = {
  //         "options": {
  //             "requestedPolicyVersion": 3
  //         }
  //     }

  //     try {
  //         let response = await axios.post(`${uri}`, body, {
  //             headers: {
  //                 'Authorization': 'Bearer ' + accessToken
  //             }
  //         })
  //         console.log(JSON.stringify(response?.data))
  //         if (response.status >= 200 && response.status < 300) {
  //             return null
  //         }
  //     } catch (error: any) {
  //         console.error(error.response?.data)
  //     }
  // }

  async sendPushNotification(payload?: Classes.CNotificationPayload): Promise<Types.TSendReturn> {
    try {
      const admin = await this.getGoogleAdmin();
      const defaultMessaging = admin?.messaging();
      const id = await defaultMessaging?.send(payload as any);
      return { code: 0, id };
    } catch (exception: any) {
      if (exception instanceof FirebaseError) {
        this.logger.error(exception?.message);
        this.logger.warn(`googleAdmin: ${exception?.code}, ${JSON.stringify(exception)}`);
        switch (exception?.code) {
          case 'messaging/registration-token-not-registered':
            return { code: 1 };
          case 'messaging/invalid-argument':
            return { code: 2 };
        }
      }
      const error = new iKomidaError(iKomidaError.GOOGLE_ADMIN_SEND_PUSH_NOTIFICATION, exception);
      error.log(this.logger);
    }
    return { code: -1 };
  }

  async uploadFileToStorage(bucketName: string, fileContents: Buffer, mimType: string, destination: string, metadata: Interfaces.IMetadata) {
    try {
      const sharpData = sharp(fileContents).resize({
        width: 512,
      });
      let data;
      if (mimType === 'png') {
        data = await sharpData
          .png({
            quality: 80,
          })
          .toBuffer();
      } else {
        data = await sharpData
          .jpeg({
            quality: 80,
          })
          .toBuffer();
      }
      const admin = await this.getGoogleAdmin();
      const storage = admin?.storage();
      const bucket = storage?.bucket(bucketName);
      await bucket?.file(destination).save(data, {
        metadata,
      });
      return `https://storage.googleapis.com/${bucket?.name ?? '-'}/${destination}`;
    } catch (exception: any) {
      const error = new iKomidaError(iKomidaError.GOOGLE_ADMIN_GET_CURRENT_ANDROID_CONFIG, exception);
      error.log(this.logger);
    }
    return null;
  }

  async uploadToStorage(identity: Classes.CUser, id: string, image: string, type: string, dir: string, payload?: string) {
    try {
      const bucket: any = {
        development: 'dev.',
        homologation: 'hmlg.',
        production: '',
      }
      if (payload?.includes('data:')) {
        const [metadata, base64Image] = payload.split(',');
        const [dataType] = metadata ? metadata.split(';') : [];
        let imageExtension = 'jpg';
        if (dataType === 'data:image/png') {
          imageExtension = 'png';
        }
        const imageUri = `${identity.ikomidaID}/${dir}/${id}/0.${imageExtension}`;
        const buffer = Buffer.from(base64Image, 'base64');

        return (await this.uploadFileToStorage(
          `${bucket[process.env.NODE_ENV ?? 'development']}cdn.ikomida.com`,
          buffer,
          imageExtension,
          imageUri,
          {
            ikomidaID: identity.ikomidaID,
            type,
            dir,
          },
        )) ?? image;
      }
    } catch (exception: any) {
      new iKomidaError(iKomidaError.IKOMIDA_PRODUCTS_SERVICE_EDIT_PRODUCT_UPLOAD_IMAGE, exception).log(this.logger);
    }
    return payload ?? image
  }

  static async calcDistance(pointA?: AddressModel, pointB?: Classes.CAddress) {
    const apiKey = process.env.CALC_DISTANCE_API_KEY
    if (!apiKey || !pointA || !pointB) {
      return false;
    }
    const addressOrigin = `${pointA.street}, ${pointA.number}, ${pointA.neighborhood} - ${pointA.city}/${pointA.stat}, cep:${pointA.postalCode}`;
    const addressDelivery = `${pointB.street}, ${pointB.number}, ${pointB.neighborhood} - ${pointB.city}/${pointB.stat}, cep:${pointB.postalCode}`;
    const uri = `https://maps.googleapis.com/maps/api/distancematrix/json?key=${apiKey}&origins=${encodeURI(
      addressOrigin,
    )}&destinations=${encodeURI(addressDelivery)}&units=imperial`;
    try {
      const response = await axios.get(`${uri}`, {
        headers: {
          'X-Requested-With': 'iKomida-PS-V0.0.1',
        },
      });
      if (response.status >= 200 && response.status < 300) {
        for (const el of response?.data?.rows || []) {
          for (const el1 of el?.elements || []) {
            return [el1?.distance?.value, el1?.duration?.value];
          }
        }
      }
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        console.error(`StatusCode: ${error?.response?.status} Error: ${error?.response?.data}`);
        if (error?.response?.status === 409) {
          return { error: 1 };
        }
      } else {
        console.error(`StatusCode: ${JSON.stringify(error)}`);
      }
    }
  }
}
