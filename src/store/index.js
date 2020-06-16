import Vue from "vue";
import Vuex from "vuex";
import $axios from "../plugins/api";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    packages: [],
    package: {},
  },
  getters: {
    getPackages: (state) => state.packages,
    getPackage: (state) => state.package,
  },
  mutations: {
    SET_PACKAGE(store, data) {
      store.package = data;
    },
    SET_PACKAGES(store, data) {
      store.packages = data;
    },
  },
  actions: {
    async fetchPackages({ commit }, packageName = "") {
      return $axios()
        .get("", {
          params: {
            name: packageName,
            fields: "lastversion,name,author",
          },
        })
        .then((res) => {
          console.log(res);
          const { data } = res;
          commit("SET_PACKAGES", data);
        });
    },
    async fetchPackageInfo({ commit }, packageName = "") {
      return $axios()
        .get("", {
          params: {
            name: packageName,
          },
        })
        .then((res) => {
          console.log(res);
          const { data } = res;
          commit("SET_PACKAGE", data[0]);
        });
    },
  },
});
