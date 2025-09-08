import { userLoginModel } from "../../model/user/index";

async function login(email, password) {
  
  try {
    const res = await userLoginModel(email, password);
    return res;
  } catch (e) {
    console.error(e);
  }
}

export default login;
