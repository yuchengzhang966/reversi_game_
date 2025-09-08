import { getUserInfoModel } from "../../model/user/index";

async function getUserInfo(id) {
    try{
        const res = await getUserInfoModel(id);
        return { success: true, data: res.data };
    }catch(e){
        return { success: false, message: e.message };
    }
}

export default getUserInfo;
