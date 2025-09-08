import { userRegisterModel } from "../../model/user/index";

async function register(email, password, nickname, avatar) {
  try {
    const res = await userRegisterModel(email, password, nickname, avatar);
    return res;
  } catch (e) {
    console.error(e);
  }
}

export default register;
