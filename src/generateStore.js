const storePath = './store';
const fs = require('fs');
const util = require('./util');
const mkdirp = require('mkdirp');

module.exports = function generateStore(domain) {
  let camel = util.makeCamel(domain);
  let upper = camel[0].toUpperCase() + camel.slice(1, camel.length);

  console.log('Generate vuex store');
  let content = `import { Filter } from 'common/models/Filter';
    import { UpdateOption, DeleteOption } from 'common/models/QueryOption';
    import { httpHelper } from 'utils/httpHelper';
    
    class ${upper} {
      id: number;
    }
    
    class State {
      createdItem: ${upper};
      allItems: ${upper}[];
      pagedItems: ${upper}[];
      numOfPagedItems: Number
    }
    
    export const state = () => ({
      createdItem: ${upper},
      allItems: [],
      pagedItems: [],
      numOfPagedItems: 0
    });
    
    export const mutations = {
      create(state: State, ${camel}: ${upper}) {
        state.createdItem = ${camel};
      },
      fetchAll(state: State, ${camel}s: ${upper}[]) {
        state.allItems = ${camel}s;
      },
      fetchPage(state: State, ${camel}s: ${upper}[]) {
        state.pagedItems = ${camel}s;
      },
      update(state: State, ${camel}: Partial<${upper}>, option: UpdateOption<${upper}>) {
        state.pagedItems.forEach((v, i) => {
          if (option.isIncluded(v)) Object.assign(v, ${camel});
        });
        state.allItems.forEach((v, i) => {
          if (option.isIncluded(v)) Object.assign(v, ${camel});
        });
      },
      delete(state: State, option: DeleteOption<${upper}>) {
        state.pagedItems.filter(item => !option.isIncluded(item));
        state.allItems.filter(item => !option.isIncluded(item));
      },
      clear(state: State) {
        state.allItems = [];
        state.pagedItems = [];
      },
      updateNum(state: State, num: number){
        state.numOfPagedItems = num;
      }
    };
    
    export const actions = {
      async create({ commit }, ${camel}: ${upper}) {
        let created${upper} = await httpHelper.post('/${camel}s', ${camel});
    
        console.log('Created ${camel}: ', created${upper});
        commit('create', created${upper});
      },
    
      async fetchAll({ commit }, filter: Filter) {
        let { payload, totalCount } = await httpHelper.get('/${camel}s', filter);
        console.log('Number of fetched ${camel}s: ', payload.length);
        commit('fetchAll', payload);
        commit('updateNum', totalCount);
      },
    
      async fetchPage({ commit }, filter: Filter) {
        let { payload, totalCount } = await httpHelper.get('/${camel}s', filter);
  
        console.log('Fetched ${camel}s: ', payload);
        commit('fetchPage', payload);
        commit('updateNum', totalCount);
      },
    
      async update(
        { commit },
        ${camel}: Partial<${upper}>,
        option: UpdateOption<${upper}>
      ) {
        await httpHelper.put('/${camel}s', ${camel}, option);
        commit('update', ${camel}, option);
      },
    
      async delete({ commit }, option: DeleteOption<${upper}>) {
        await httpHelper.delete('/${camel}', option);
    
        commit('delete', option);
      },
    
      async clear({ commit }) {
        commit('clear');
      }
    };  
  `;
  mkdirp.sync(`${storePath}`);

  fs.writeFileSync(`${storePath}/${domain}.ts`, content);
  return;
};
