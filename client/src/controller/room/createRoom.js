import { createRoomModel } from "../../model/room";

async function createRoom(userId){
    try{
        const res = await createRoomModel(userId);
        console.log(res);
        return { success: true, data: res.data };
    }catch(e){
        return { success: false, message: e.message }
    }
}

export default createRoom;