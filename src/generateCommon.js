const fs = require('fs');
const mkdirp = require('mkdirp');

module.exports = function generateCommon() {
  let content = `/**
  * 사용자가 지정한 에러의 양식이다.
  * Javascript default Error 를 확장하여 code 가 추가된다.
  */
 export class CustomError extends Error {
   constructor(code, message) {
     super(message);
     this.code = code;
   }
   public code: string;
 }
 `;
  mkdirp.sync(`./common/models`);

  fs.writeFileSync(`./common/models/CustomError.ts`, content);
};
