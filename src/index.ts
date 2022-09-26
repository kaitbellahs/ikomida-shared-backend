import { generateKeyPair, exportPKCS8, exportSPKI, importSPKI, importPKCS8 } from 'jose';
import { sign, verify, SignPrivateKeyInput, VerifyPublicKeyInput } from 'crypto';
import bcrypt from 'bcrypt';
import { Classes } from '@ikomida/shared-types';
export * as Logics from '@ikomida/shared-logics';
export * as Helpers from './Helpers';
export * as Domain from './Domain';
export * as GateWays from './GateWays';
export * as BackendTypes from './Types';
export * as Utils from './Utils';
export * as DBModels from './Domain/Models';
export * as Types from '@ikomida/shared-types';

const algorithm = 'PS256';
const hashAlgo = 'SHA256';

export async function generateNewKeyPair() {
  try {
    console.log('Start generating keys');
    const { publicKey, privateKey } = await generateKeyPair(algorithm);
    const pkcs8Pem = await exportPKCS8(privateKey);
    console.log(pkcs8Pem);
    const spkiPem = await exportSPKI(publicKey);
    console.log(spkiPem);
    console.log('end.');
  } catch (error: any) {
    //TODO: -- report errors
    console.error(error);
  }
}

export async function signData(object?: any) {
  const pkcs8 = Buffer.from(process.env.IKOMIDA_PRIVATEKEY ?? '', 'base64').toString();
  const ecPrivateKey = (await importPKCS8(pkcs8, algorithm)) as SignPrivateKeyInput;
  const data = Buffer.from(JSON.stringify(object));
  const signed = sign(hashAlgo, data, ecPrivateKey);
  return signed.toString('base64');
}

export async function validateSignature(object?: any, signature?: string): Promise<boolean> {
  try {
    const spki = Buffer.from(process.env.IKOMIDA_PUBLICKEY ?? '', 'base64').toString();
    const ecPublicKey = (await importSPKI(spki, algorithm)) as VerifyPublicKeyInput;
    const data = Buffer.from(JSON.stringify(object));
    return verify(hashAlgo, data, ecPublicKey, Buffer.from(String(signature), 'base64'));
  } catch (error: any) {
    //TODO: -- report errors
    console.error(`error: ${JSON.stringify(error)}`);
  }
  return false;
}

export function slugging(string?: string) {
  string = String(string ?? '').replace(/^\s+|\s+$/g, '');
  string = string.toLowerCase();
  const from = 'àáäâèéëêìíïîòóöôùúüûñç·/_,:';
  const to = 'aaaaeeeeiiiioooouuuunc------';
  for (let i = 0, l = from.length; i < l; i++) {
    string = string.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
  }
  string = string
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
  return string;
}

export function bundle(string?: string) {
  string = String(string).replace(/^\s+|\s+$/g, '');
  string = string.toLowerCase();
  const from = 'àáäâèéëêìíïîòóöôùúüûñç·/_,:';
  const to = 'aaaaeeeeiiiioooouuuunc------';
  for (let i = 0, l = from.length; i < l; i++) {
    string = string.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
  }
  string = string.replace(/[^a-z0-9]/g, '').replace(/\s+/g, '');
  return string;
}

export async function cryptPassword(password?: string) {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(String(password), salt);
  return { salt, hash };
}

export function passwordGenerator(size?: number) {
  const length = size ? Number(size) : 10;
  const string = 'abcdefghijklmnopqrstuvwxyz';
  const numeric = '0123456789';
  const punctuation = '!@#$%^&*()_+~`|}{[]\\:?><,./-=';
  let password = '';
  let character = '';
  while (password.length < length) {
    const entity1 = Math.ceil(string.length * Math.random() * Math.random());
    const entity2 = Math.floor(numeric.length * Math.random() * Math.random());
    const entity3 = Math.round(punctuation.length * Math.random() * Math.random());
    let hold = string.charAt(entity1);
    hold = password.length % 2 == 0 ? hold.toUpperCase() : hold;
    character += hold;
    character += numeric.charAt(entity2);
    character += punctuation.charAt(entity3);
    password = character;
  }
  password = password
    .split('')
    .sort(function () {
      return 0.5 - Math.random();
    })
    .join('');
  return password.substring(0, size);
}

export async function comparePassword(password?: string, hash?: string) {
  try {
    return password && hash && bcrypt.compare(password, hash);
  } catch (error: any) {
    //TODO: -- report errors
    console.error(error);
  }
  return false;
}

export function objHasProp(props: string | string[], object: any) {
  if (props instanceof Array) {
    for (const prop of props) {
      if (!(prop in object)) {
        return false;
      }
    }
    return true;
  }
  if (typeof props === 'string') {
    return props in object;
  }
  return false;
}

//MARK: -- this function is for development purpose
export function getObjectFunctions(object: { [x: string]: any }) {
  const methods = [];
  for (const m in object) {
    if (typeof object[m] == 'function') {
      methods.push(m);
    }
  }
  return methods.join(', ');
}
