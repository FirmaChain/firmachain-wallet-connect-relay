import * as dotenv from 'dotenv';
import CryptoJS from 'crypto-js';

dotenv.config();

const keySize = 256;
const iterations = 100;
const salt = CryptoJS.enc.Hex.parse(process.env.SALT!);
const iv = CryptoJS.enc.Hex.parse(process.env.IV!);
const pass = process.env.SECRET_KEY!;

export const encryptJSONData = (originalJSON: object): string => {
  return encryptData(JSON.stringify(originalJSON));
};

export const decryptJSONData = (encryptMessage: string): string => {
  return JSON.parse(decryptData(encryptMessage));
};

export const encryptData = (originalMessage: string): string => {
  try {
    const key = CryptoJS.PBKDF2(pass, salt, {
      keySize: keySize / 32,
      iterations: iterations,
    });

    const encrypted = CryptoJS.AES.encrypt(originalMessage, key, {
      iv: iv,
      padding: CryptoJS.pad.Pkcs7,
      mode: CryptoJS.mode.CBC,
    });

    return Buffer.from(encrypted.toString(), 'utf8').toString('base64');
  } catch (error) {
    throw new Error('ERROR ENCRYPT');
  }
};

export const decryptData = (encryptMessage: string): string => {
  try {
    const encrypted = Buffer.from(encryptMessage, 'base64').toString('utf8');

    const key = CryptoJS.PBKDF2(pass, salt, {
      keySize: keySize / 32,
      iterations: iterations,
    });

    const decrypted = CryptoJS.AES.decrypt(encrypted, key, {
      iv: iv,
      padding: CryptoJS.pad.Pkcs7,
      mode: CryptoJS.mode.CBC,
    }).toString(CryptoJS.enc.Utf8);

    if (decrypted === '') throw new Error('ERROR');

    return decrypted;
  } catch (error) {
    throw new Error('ERROR DECRYPT');
  }
};
