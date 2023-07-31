import axios from "axios"
import { httpClient } from "../../httpClient";
import api from '../../routes';
import { Login } from "./interface";


type Me = {
  username: string;
  roles: string[]
}

export const login = async (data: Login) => {
  try {
    const result = await axios.post(api.login(), data);
    return result.data;
  } catch (error) {
    //@ts-ignore
    if (error?.request?.status === 401) {
      //@ts-ignore
      const { response } = error;
      return response.data;
    }
    return console.log('errrr: ', error);
  }
}

export const me = async (): Promise<Me | unknown> => {
  try {
    const result = await httpClient.get(api.me());
    return result.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      return error;
    }
  }
};