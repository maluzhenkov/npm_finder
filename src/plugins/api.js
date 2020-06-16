import axios from "axios";

export default () => {
  return axios.create({
    /**
     * Использовал deprecated версию api, т.к у "https://data.jsdelivr.com/v1" я не нашел endpoint для поиска по пакетам  :(
     * https://github.com/jsdelivr/api
     */
    baseURL: "http://api.jsdelivr.com/v1/jsdelivr/libraries",
  });
};
