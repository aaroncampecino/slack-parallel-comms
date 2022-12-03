import axios from "axios";
import { logger } from "./logger";
import { v4 as uuidv4 } from "uuid";

const BASE_URL = process.env.SLACK_BASE_URL;

axios.defaults.validateStatus = false;

const api = axios.create({
  baseURL: BASE_URL,
  auth: {
    username: process.env.JIRA_USERNAME,
    password: process.env.JIRA_TOKEN
  }
});

api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (!error.response) {
      logger.error(`api.interceptors.response`);
      logger.error(`${error}`);
      return "ERR_CONNECTION_REFUSED";
    }

    return Promise.reject(error);
  }
);

export { api };
