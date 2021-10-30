// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

exports.main = async (event, context) => {
  console.log(event)
  
  let {listName,searchLimit,needid} = event
  let { OPENID, APPID } = cloud.getWXContext()
  const {data} = await cloud.database().collection(listName).where(searchLimit).limit(20).get()

  if (needid) {
    return {
      openId: OPENID,
      appId: APPID,
      data
    }
  }else{
    return {
      data
    };
  }
}