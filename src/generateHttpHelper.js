const fs = require('fs');
const mkdirp = require('mkdirp');

module.exports = function generateHttpHelper() {
  let content = `const qs = require('qs');
    import Axios from 'axios';
    import { Constants } from './constants';
    import { Filter } from 'common/models/Filter';
    
    interface ResponseData {
      payload: Array<any>;
      count?: number;
      totalCount?: number;
    }
    
    class HttpHelper {
      public async get(url: string, filter: Filter): Promise<ResponseData> {
        try {
          console.log(filter);
          let query = qs.stringify(filter);
          console.log('[httpHelper] Sends query Call Query: ', query);
          let res = await Axios.get(Constants.ServerUrl + url + '?' + query);
    
          return res.data;
        } catch (err) {
          console.log(err.message);
          throw err;
        }
      }
      public async post(url, data) {
        try {
          let res = await Axios.post(Constants.ServerUrl + url, data);
          let payload = res.data.payload;
    
          return payload;
        } catch (err) {
          console.log(err.message);
          throw err;
        }
      }
      public async put(url, data, option) {
        try {
          console.log(option);
    
          let res = await Axios.put(Constants.ServerUrl + url, { data, option });
          let payload = res.data.payload;
    
          return payload;
        } catch (err) {
          console.log(err.message);
          throw err;
        }
      }
      public async delete(url, option) {
        try {
          console.log(option);
          let res = await Axios.put(Constants.ServerUrl + url, { option });
          let payload = res.data.payload;
    
          return payload;
        } catch (err) {
          console.log(err.message);
          throw err;
        }
      }
    }
    
    export const httpHelper = new HttpHelper();
    `;
  mkdirp.sync(`./utils`);

  fs.writeFileSync(`./utils/httpHelper.ts`, content);
};
