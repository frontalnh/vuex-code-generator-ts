const fs = require('fs');
const mkdirp = require('mkdirp');

module.exports = function generateCommon() {
  let content = `import { CustomError } from 'common/models/CustomError';

  export const HttpErrCode = {
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
  
  export const httpErrorHandler = err => {
    let { message, code } = err.response.data.error;
  
    console.log('Code: ', code, '\nMessage: ', message);
    console.log(err.response.status);
  
    switch (code) {
      case HttpErrCode.LOGIN.NOT_AUTHORIZED: {
      }
      case HttpErrCode.LOGIN.NO_USER: {
        message = '등록된 유저가 아닙니다.';
      }
    }
  
    return new CustomError(code, message);
  };
  `;
  mkdirp.sync(`./utils`);

  fs.writeFileSync(`./utils/httpErrorHandler.ts`, content);
};
