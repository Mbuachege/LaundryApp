import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';


@Injectable()
export class EncryptDecrypt {

    set(keys: string, value: string) {
        var key = CryptoJS.enc.Utf8.parse(keys);
        var iv = CryptoJS.enc.Utf8.parse(keys);
        var encrypted = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(value.toString()), key,
            {
                keySize: 128 / 8,
                iv: iv,
                mode: CryptoJS.mode.CBC,
                padding: CryptoJS.pad.Pkcs7
            });

        return encrypted.toString();
    }

    get(keys: string, value: string) {
        var key = CryptoJS.enc.Utf8.parse(keys);
        var iv = CryptoJS.enc.Utf8.parse(keys);
        var decrypted = CryptoJS.AES.decrypt(value, key, {
            keySize: 128 / 8,
            iv: iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        });

        return decrypted.toString(CryptoJS.enc.Utf8);
    }
    Encrypt(text: any) {

        var encodedString = this.set('NBZYSwQLCFlDBBFZHgxdGwoKCB0NHwpZHxxMD0UNBRBe', text);

        return encodedString;
    }
    Decrypt(text: any) {
        var decodedString = this.get('NBZYSwQLCFlDBBFZHgxdGwoKCB0NHwpZHxxMD0UNBRBe', text);
        return decodedString;
    }
}
