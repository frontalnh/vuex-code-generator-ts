const storePath = './store';
const fs = require('fs');
const util = require('./util');
const mkdirp = require('mkdirp');

module.exports = function generateStore(domain) {
  let camel = util.makeCamel(domain);
  let upper = camel[0].toUpperCase() + camel.slice(1, camel.length);

  console.log('Generate vuex store');
  let content = `
  import { Filter } from 'common/models/Filter';
  import { UpdateOption, DeleteOption } from 'common/models/QueryOption';
  import { ${upper} } from 'models/${camel}.model';
  
  class State {
    selectedItem: ${upper};
    createdItem: ${upper};
    pageMap: Object;
    totalCount: number;
  }
  
  export const state = () => ({
    selectedItem: ${upper},
    createdItem: ${upper},
    pageMap: new Map<Number, ${upper}[]>(),
    totalCount: 0
  });
  
  export const mutations = {
    create(state: State, ${camel}: ${upper}) {
      state.createdItem = ${camel};
    },
    setTotalCount(state: State, totalCount: number) {
      state.totalCount = totalCount;
    },
    setPage(state: State, { page, ${camel}s }: { page: number; ${camel}s: ${upper}[] }) {
      state.pageMap[page] = ${camel}s;
    },
    select(state: State, asset) {
      state.selectedItem = asset;
    },
    update(state: State, ${camel}: Partial<${upper}>, option: UpdateOption<${upper}>) {
      Object.keys(state.pageMap).forEach((key, index) => {
        state.pageMap[key].forEach((value, index) => {
          if (option.isIncluded(value)) Object.assign(value, ${camel});
        });
      });
    },
    delete(state: State, option: DeleteOption<${upper}>) {
      for (let key in state.pageMap) {
        let ${camel}s = state.pageMap[key];
        ${camel}s.forEach((${camel}: ${upper}, index: number) => {
          if (option.isIncluded(${camel})) ${camel}s.splice(index, 1);
        });
      }
    },
    clear(state: State) {
      state.pageMap = new Map<number, ${upper}[]>();
    }
  };
  
  export const actions = {
    async create({ commit }, ${camel}: ${upper}) {
      let data = await this.$httpHelper.post('/${camel}s', ${camel});
      let created${upper} = data;
  
      commit('create', created${upper});
      return created${upper};
    },
  
    async fetchPage(
      { commit, state }: { commit; state: State },
      { page, pageSize, filter }: { page; pageSize; filter: Filter }
    ) {
      Object.assign(filter, { offset: (page - 1) * pageSize, limit: pageSize });
      if (state.pageMap[page]) return;
      let { totalCount, payload } = await this.$httpHelper.get('/${camel}s', filter);
  
      commit('setTotalCount', totalCount);
      commit('setPage', { page, ${camel}s: payload });
    },
  
    async fetchOne({ commit }, id: number) {
      let data = await this.$httpHelper.get('/${camel}s/' + id);
  
      commit('select', data);
      return data;
    },
  
    async update({ commit }, ${camel}: Partial<${upper}>, option: UpdateOption<${upper}>) {
      await this.$httpHelper.put('/${camel}s', {
        ${camel},
        option
      });
      commit('update', ${camel}, option);
    },
  
    async delete({ commit }, option: DeleteOption<${upper}>) {
      await this.$httpHelper.put('/${camel}s', {
        option
      });
  
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
