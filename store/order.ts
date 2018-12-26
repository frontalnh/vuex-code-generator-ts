import Axios from 'axios';
  import { Constants } from 'utils/constants';
  import { Filter } from 'common/models/Filter';
  import { UpdateOption, DeleteOption } from 'common/models/QueryOption';
  const qs = require('qs');
  
  class Transaction {
    id: number;
  }
  
  class State {
    createdItem: Transaction;
    allItems: Transaction[];
    pagedItems: Transaction[];
  }
  
  export const state = () => ({
    createdItem: Transaction,
    allItems: [],
    pagedItems: []
  });
  
  export const mutations = {
    create(state: State, transaction: Transaction) {
      state.createdItem = transaction;
    },
    fetchAll(state: State, transactions: Transaction[]) {
      state.allItems = transactions;
    },
    fetchPage(state: State, transactions: Transaction[]) {
      state.pagedItems = transactions;
    },
    update(
      state: State,
      transaction: Partial<Transaction>,
      option: UpdateOption<Transaction>
    ) {
      state.pagedItems.forEach((v, i) => {
        if (option.isIncluded(v)) Object.assign(v, transaction);
      });
      state.allItems.forEach((v, i) => {
        if (option.isIncluded(v)) Object.assign(v, transaction);
      });
    },
    delete(state: State, option: DeleteOption<Transaction>) {
      state.pagedItems.filter(item => !option.isIncluded(item));
      state.allItems.filter(item => !option.isIncluded(item));
    },
    clear(state: State) {
      state.allItems = [];
      state.pagedItems = [];
    }
  };
  
  export const actions = {
    async create({ commit }, transaction: Transaction) {
      let { data } = await Axios.post(
        Constants.ServerUrl + '/transactions',
        transaction
      );
      let createdTransaction = data;
  
      console.log('Created transaction: ', createdTransaction);
      commit('create', createdTransaction);
    },
  
    async fetchAll({ commit }, filter: Filter) {
      console.log(filter);
      let query = qs.stringify(filter);
      console.log('$$$$', query);
      let { data } = await Axios.get(
        Constants.ServerUrl + '/transactions?' + query
      );
      let transactions = data.payload;
  
      console.log('Number of fetched transactions: ', transactions.length);
      commit('fetchAll', transactions);
    },
  
    async fetchPage({ commit }, filter: Filter) {
      let query = qs.stringify(filter);
      let { data } = await Axios.get(
        Constants.ServerUrl + '/transactions?' + query
      );
      let transactions = data.payload;
  
      console.log('Fetched transactions: ', transactions);
      commit('fetchPage', transactions);
    },
  
    async update(
      { commit },
      transaction: Partial<Transaction>,
      option: UpdateOption<Transaction>
    ) {
      await Axios.put(Constants.ServerUrl + '/transactions', {
        transaction,
        option
      });
      commit('update', transaction, option);
    },
  
    async delete({ commit }, option: DeleteOption<Transaction>) {
      await Axios.put(Constants.ServerUrl + '/transactions', {
        option
      });
  
      commit('delete', option);
    },
  
    async clear({ commit }) {
      commit('clear');
    }
  };
