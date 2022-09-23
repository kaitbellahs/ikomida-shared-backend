import { CompactSign, importPKCS8 } from 'jose';
import axios from 'axios';
import https from 'https';
import iKomidaError from './iKomidaError';
import Logger from './Logger';
import { IHeaders } from '../GateWays/PagSeguro';

export default class AppStoreConnect {
  logger: Logger;
  production;
  api;

  constructor(logger: Logger) {
    this.logger = logger;
    this.production = process.env.NODE_ENV === 'production';

    const httpsAgent = new https.Agent({
      // keepAlive: true
    });
    this.api = axios.create({
      baseURL: 'https://api.appstoreconnect.apple.com',
      httpsAgent,
    });
  }

  async configureApp(iKomidaId: string) {
    try {
      let code = 0;
      const bundleId = await this.createBundleId(iKomidaId);
      if (bundleId?.error) {
        code = bundleId?.error;
      }
      if (code === 0) {
        const pushNotificationCapability = await this.enablePushNotificationCapability(bundleId);
        if (pushNotificationCapability?.error) {
          code = pushNotificationCapability?.error;
        }
      }
      let certificates;
      if (code === 0) {
        certificates = await this.getCertificates();
        if (certificates?.error) {
          code = certificates?.error;
        }
      }
      let id = null;
      if (code === 0) {
        const profilId = await this.createProfile(iKomidaId, bundleId, certificates);
        console.log('profilId:', profilId);
        if (profilId?.error) {
          code = profilId?.error;
        } else {
          id = profilId;
        }
      }
      return { code, id };
    } catch (exception: any) {
      this.logger.warn(`AppStoreConnect: ${JSON.stringify(exception)}`);
      // switch (exception?.errorInfo?.code) {
      //     case 'project-management/already-exists':
      //         return { code: 1 }
      //     //TODO: -- handle other errors
      //     // case 'messaging/invalid-argument':
      //     //     return { code: 2 }
      // }
      const error = new iKomidaError(iKomidaError.GOOGLE_ADMIN_CREATE_NEW_IOS_APP, exception);
      error.log(this.logger);
    }
    return { code: -1 };
  }

  async generateAccessToken() {
    try {
      const iat = new Date().getTime() / 1000;
      const payload = {
        iss: '69a6de97-6757-47e3-e053-5b8c7c11a4d1',
        iat,
        exp: iat + 2 * 60,
        aud: 'appstoreconnect-v1',
      };
      const algorithm = 'ES256';
      const pkcs8 = Buffer.from(process.env.APP_STORE_CONNECT ?? '', 'base64').toString('utf8');
      const ecPrivateKey = await importPKCS8(pkcs8, algorithm);
      return await new CompactSign(new TextEncoder().encode(JSON.stringify(payload)))
        .setProtectedHeader({
          alg: algorithm,
          typ: 'JWT',
          kid: process.env?.APP_STORE_CONNECT_KEY,
        })
        .sign(ecPrivateKey);
    } catch (error: any) {
      //TODO: -- report errors
      this.logger.error(error);
    }
    return null;
  }

  //MARK: -- Apps
  async getApps() {
    return this.apiGet(`/v1/apps`);
  }

  async getApp(iKomidaId: any) {
    const data = await this.apiGet(`/v1/apps?filter[bundleId]=${iKomidaId}`);
    if (data?.error) {
      return data;
    }
    return data?.[0]?.id;
  }

  async getBuilds(id: any) {
    const data = await this.apiGet(`/v1/builds?filter[app]=${id}&filter[processingState]=VALID&limit=1&sort=-version`);
    if (data?.error) {
      return data;
    }
    return data?.[0]?.id;
  }

  async getAppEncryptionDeclarations(id: any) {
    const data = await this.apiGet(`/v1/appEncryptionDeclarations?filter[app]=${id}`);
    if (data?.error) {
      return data;
    }
    return data?.[0]?.id;
  }

  async assignBuildsToAppEncryptionDeclaration(appEncryptionDeclaration: any, buildId: any) {
    const json = {
      data: {
        type: 'builds',
        id: buildId,
      },
    };
    const data = await this.apiPost(
      `/v1/appEncryptionDeclarations/${appEncryptionDeclaration}/relationships/builds`,
      json,
    );
    if (data?.error) {
      return data;
    }
    return data?.id;
  }
  async createAppStoreVersion(appId: any, buildId: any, versionString: any) {
    const json = {
      data: {
        type: 'appStoreVersions',
        attributes: {
          platform: 'IOS',
          versionString,
          releaseType: 'MANUAL', //AFTER_APPROVAL
        },
        relationships: {
          app: {
            data: {
              type: 'apps',
              id: appId,
            },
          },
          build: {
            data: {
              type: 'builds',
              id: buildId,
            },
          },
        },
      },
    };
    const data = await this.apiPost(`/v1/appStoreVersion`, json);
    if (data?.error) {
      return data;
    }
    return data?.id;
  }

  async createAppStoreVersionLocalizations(id: any, whatsNew: any) {
    const json = {
      data: {
        type: 'appStoreVersionLocalizations',
        attributes: {
          whatsNew,
        },
        relationships: {
          appStoreVersion: {
            data: {
              type: 'appStoreVersions',
              id,
            },
          },
        },
      },
    };
    const data = await this.apiPost(`/v1/appStoreVersionLocalizations`, json);
    if (data?.error) {
      return data;
    }
    return data?.id;
  }

  async createReviewSubmission(appId: any) {
    const json = {
      data: {
        type: 'reviewSubmissions',
        attributes: {
          platform: 'IOS',
        },
        relationships: {
          app: {
            data: {
              type: 'apps',
              id: appId,
            },
          },
        },
      },
    };
    const data = await this.apiPost(`/v1/reviewSubmissions`, json);
    if (data?.error) {
      return data;
    }
    return data?.id;
  }

  //MARK: -- Developer
  async getBundleIds() {
    return this.apiGet(`/v1/bundleIds`);
  }

  async getBundleId(bundleId: any) {
    return this.apiGet(`/v1/bundleIds/${bundleId}`);
  }

  async createBundleId(identifier: string) {
    const json = {
      data: {
        attributes: {
          identifier,
          name: identifier?.replace(/\./g, ' '),
          platform: 'UNIVERSAL',
        },
        type: 'bundleIds',
      },
    };
    const data = await this.apiPost(`/v1/bundleIds`, json);
    if (data?.error) {
      return data;
    }
    return data?.id;
  }

  async enablePushNotificationCapability(bundleId: any) {
    const json = {
      data: {
        attributes: {
          capabilityType: 'PUSH_NOTIFICATIONS',
        },
        relationships: {
          bundleId: {
            data: {
              id: bundleId,
              type: 'bundleIds',
            },
          },
        },
        type: 'bundleIdCapabilities',
      },
    };
    const data = await this.apiPost(`/v1/bundleIdCapabilities`, json);
    if (data?.error) {
      return data;
    }
    return data?.id;
  }

  async configCapability(capabilityId: any) {
    const json = {
      data: {
        attributes: {
          capabilityType: 'PUSH_NOTIFICATIONS',
        },
        id: capabilityId,
        type: 'bundleIdCapabilities',
      },
    };
    return this.apiPost(`/v1/bundleIdCapabilities/${capabilityId}`, json);
  }

  async getCertificates() {
    const data = await this.apiGet(`/v1/certificates?filter[certificateType]=DISTRIBUTION`);
    if (data?.error) {
      return data;
    }
    return data?.map((item: { id: any; type: any }) => {
      return {
        id: item?.id,
        type: item?.type,
      };
    });
  }

  async getProfile(iKomidaId: any) {
    const data = await this.apiGet(
      `/v1/profiles?filter[name]=${iKomidaId}&filter[profileState]=ACTIVE&fields[profiles]=expirationDate,profileContent,uuid`,
    );
    if (data?.error) {
      return data;
    }
    return data?.map((item: { id: any; attributes: { uuid: any; profileContent: any; expirationDate: any } }) => {
      return {
        id: item?.id,
        uuid: item?.attributes?.uuid,
        content: item?.attributes?.profileContent,
        expirationDate: item?.attributes?.expirationDate,
      };
    })?.[0];
  }

  async createProfile(iKomidaId: any, bundleId: any, certificates: any) {
    const json = {
      data: {
        attributes: {
          name: iKomidaId,
          profileType: 'IOS_APP_STORE',
        },
        relationships: {
          bundleId: {
            data: {
              id: bundleId,
              type: 'bundleIds',
            },
          },
          certificates: {
            data: certificates,
          },
        },
        type: 'profiles',
      },
    };
    const data = await this.apiPost(`/v1/profiles`, json);
    if (data?.error) {
      return data;
    }
    return data?.id;
  }

  async apiGet(url: string) {
    try {
      const options = {
        headers: await this.headers(),
      };
      const response = await this.api.get(`${url}`, options);
      if (response?.status >= 200 && response?.status < 300) {
        return response?.data?.data;
      }
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        this.logger.error(`StatusCode: ${error?.response?.status} Error: ${error?.response?.data}`);
        if (error?.response?.status === 409) {
          return { error: 1 };
        }
      } else {
        this.logger.error(`StatusCode: ${JSON.stringify(error)}`);
      }
    }
    return null;
  }

  async apiPost(
    url: string,
    data: {
      data:
      | { attributes: { identifier: any; name: any; platform: string }; type: string }
      | {
        attributes: { capabilityType: string };
        relationships: { bundleId: { data: { id: any; type: string } } };
        type: string;
      }
      | {
        attributes: { name: any; profileType: string };
        relationships: { bundleId: { data: { id: any; type: string } }; certificates: { data: any } };
        type: string;
      }
      | { type: string; id: any }
      | {
        type: string;
        attributes: { platform: string; versionString: any; releaseType: string };
        relationships: { app: { data: { type: string; id: any } }; build: { data: { type: string; id: any } } };
      }
      | {
        type: string;
        attributes: { whatsNew: any };
        relationships: { appStoreVersion: { data: { type: string; id: any } } };
      }
      | {
        type: string;
        attributes: { platform: string };
        relationships: { app: { data: { type: string; id: any } } };
      }
      | { attributes: { capabilityType: string }; id: any; type: string };
    },
  ) {
    try {
      const options = {
        headers: await this.headers(true),
      };
      const response = await this.api.post(`${url}`, data, options);
      if (response?.status >= 200 && response?.status < 300) {
        return response?.data?.data;
      }
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        this.logger.error(`StatusCode: ${error?.response?.status} Error: ${error?.response?.data}`);
        if (error?.response?.status === 409) {
          return { error: 1 };
        }
      } else {
        this.logger.error(`StatusCode: ${JSON.stringify(error)}`);
      }
    }
    return null;
  }

  async apiPatch(url: any, data: any) {
    try {
      const options = {
        headers: await this.headers(true),
      };
      const response = await this.api.patch(`${url}`, data, options);
      if (response?.status >= 200 && response?.status < 300) {
        return response?.data?.data;
      }
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        this.logger.error(`StatusCode: ${error?.response?.status} Error: ${error?.response?.data}`);
        if (error?.response?.status === 409) {
          return { error: 1 };
        }
      } else {
        this.logger.error(`StatusCode: ${JSON.stringify(error)}`);
      }
    }
    return null;
  }

  async headers(isJson = false) {
    const headers: IHeaders = {
      Authorization: `Bearer ${await this.generateAccessToken()}`,
      accept: `application/json`,
      'X-Requested-With': `iKomida Publisher V0.0.1`,
    };
    if (isJson) {
      headers['Content-Type'] = `application/json`;
    }
    return headers;
  }
}
