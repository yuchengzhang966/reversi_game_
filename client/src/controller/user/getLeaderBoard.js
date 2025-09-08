import { getUserLeaderBoardModel } from "../../model/user/index";

async function getUserLeaderBoard(amount) {
    try{
        const res = await getUserLeaderBoardModel(amount);
        return { data: res.data, message: res.message };
    }catch(e){
        return { message: e.message };
    }
}

export default getUserLeaderBoard;
