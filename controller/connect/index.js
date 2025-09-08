const { func } = require("joi");
const redis = require("redis");
const client = redis.createClient();
const { promisify } = require("util");
const getRedis = promisify(client.get).bind(client);
const setRedis = promisify(client.setex).bind(client);
const delRedis = promisify(client.del).bind(client);

/**
 * Check Connection and replace new sid
 * @param {String} userId user id
 * @param {String} sid new sid
 * @returns {Object} { exist: Bool, sid: String}
 */
async function checkConnect(userId, sid) {
  
  try {
    const oldSid = await getRedis(userId);
    if (oldSid) {
      // Set New Session Id, return the old one
      await setRedis(userId, 86400, sid);
      return { exist: true, sid: oldSid };
    } else {
      // Set the New Session Id
      await setRedis(userId, 86400, sid);
      return { exist: false };
    }
  } catch (e) {
      console.error(e);
  }
}

/**
 * Check If Sid is equal to the old one
 *
 * @param   {String}  userId  
 * @param   {String}  sid     new sid
 *
 * @return  {Bool}          
 */
async function checkSid(userId, sid) {
    const oldSid = await getRedis(userId);
    return oldSid === sid;
}

async function deleteSid(userId) {
  await delRedis(userId);
}

exports.checkConnect = checkConnect;
exports.deleteSid = deleteSid;
exports.checkSid = checkSid;
