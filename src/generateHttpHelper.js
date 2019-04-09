const fs = require('fs');
const mkdirp = require('mkdirp');

module.exports = function generateHttpHelper() {
  let content = `
  const qs = require('qs');
  import { Constants } from './constants';
  import { Filter } from 'common/models/Filter';
  import { CustomError } from 'common/models/CustomError';
  
  interface ResponseData {
    payload: any;
    count?: number;
    totalCount?: number;
  }
  
  const HttpErrCode = {
    LOGIN: {
      NO_USER: 'LOGIN.NO_USER',
      INVALID_PASSWORD: 'LOGIN.INVALID_PASSWORD',
      NOT_AUTHORIZED: 'LOGIN.NOT_AUTHORIZED'
    },
    REGISTER: {
      EXIST_TEL: 'REGISTER.EXIST_TEL',
      EXIST_EMAIL: 'REGISTER.EXIST_EMAIL'
    }
  };
  
  const httpErrorHandler = err => {
    let {
      message,
      code
    }: { message: string; code: string } = err.response.data.error;
  
    switch (code) {
      case HttpErrCode.LOGIN.NOT_AUTHORIZED: {
      }
      case HttpErrCode.LOGIN.NO_USER: {
        message = '등록된 유저가 아닙니다.';
      }
      case HttpErrCode.LOGIN.INVALID_PASSWORD: {
        message = '잘못된 비밀번호 입니다.';
      }
    }
  
    return new CustomError(code, message);
  };
  
  export class HttpHelper {
    $axios: any;
    constructor($axios?: any) {
      this.$axios = $axios;
    }
    public async get(url: string, filter: Filter | any): Promise<ResponseData> {
      try {
        let query = qs.stringify(filter);
        let data = await this.$axios.$get(
          Constants.ServerUrl + url + '?' + query,
          {
            withCredentials: true
          }
        );
  
        return data;
      } catch (err) {
        throw httpErrorHandler(err);
      }
    }
    public async post(url, body) {
      try {
        let data = await this.$axios.$post(Constants.ServerUrl + url, body, {
          withCredentials: true
        });
  
        return data;
      } catch (err) {
        throw httpErrorHandler(err);
      }
    }
    public async put(url, body, option) {
      try {
        console.log(option);
  
        let data = await this.$axios.$put(
          Constants.ServerUrl + url,
          { body, option },
          {
            withCredentials: true
          }
        );
  
        return data;
      } catch (err) {
        throw httpErrorHandler(err);
      }
    }
    public async delete(url, option) {
      try {
        console.log(option);
        let data = await this.$axios.$put(
          Constants.ServerUrl + url,
          { option },
          {
            withCredentials: true
          }
        );
  
        return data;
      } catch (err) {
        throw httpErrorHandler(err);
      }
    }
  }
  
  export const httpHelper = new HttpHelper();
  
    `;

  let plugin = `
  import { HttpHelper } from 'utils/httpHelper';

  export default function(context, inject) {
    let { $axios } = context;
    let httpHelper = new HttpHelper($axios);
    context.$httpHelper = httpHelper;

    inject('httpHelper', httpHelper);
  }

  `;
  mkdirp.sync(`./utils`);
  mkdirp.sync(`./plugins`);

  fs.writeFileSync(`./utils/httpHelper.ts`, content);
  fs.writeFileSync(`./plugins/httpHelper.ts`, plugin);
};
