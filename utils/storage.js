// utils/storage.js
const KEY_PREFERENCE = "user_preference"
const KEY_FAVORITE = "user_favorite"
const KEY_HISTORY = "user_outfit_history"

// 获取偏好配置
function getPreferences() {
  const str = wx.getStorageSync(KEY_PREFERENCE)
  if(str){
    try{
      return JSON.parse(str)
    }catch(err){
      console.error("缓存解析出错，使用默认配置", err)
      wx.removeStorageSync(KEY_PREFERENCE)
      return {
        gender: "male",
        bodyType: "normal"
      }
    }
  }
  return {
    gender: "male",
    bodyType: "normal"
  }
}

// 保存偏好，文档名字 setPreferences
function setPreferences(data) {
  const oldData = getPreferences();
  const newData = {...oldData, ...data}
  wx.setStorageSync(KEY_PREFERENCE, JSON.stringify(newData))
}

// ========== 收藏 ==========
function getFavorites(){
  const str = wx.getStorageSync(KEY_FAVORITE);
  if(str){
    try{
      return JSON.parse(str);
    }catch(e){
      console.error("读取收藏失败",e);
      wx.removeStorageSync(KEY_FAVORITE);
      return [];
    }
  }
  return [];
}

function addFavorite(outfitItem){
  const favList = getFavorites();
  const exist = favList.find(item=>item.id === outfitItem.id);
  if(!exist){
    favList.push(outfitItem);
    wx.setStorageSync(KEY_FAVORITE, JSON.stringify(favList));
  }
}

function removeFavorite(favId){
  const favList = getFavorites();
  const newList = favList.filter(item=>item.id !== favId);
  wx.setStorageSync(KEY_FAVORITE, JSON.stringify(newList));
}

function isFavorite(id){
  const favList = getFavorites();
  return !!favList.find(item=>item.id === id);
}

// ========== 穿搭历史记录（文档要求，补齐） ==========
function getHistory(){
  const str = wx.getStorageSync(KEY_HISTORY);
  if(str){
    try{
      return JSON.parse(str)
    }catch(e){
      wx.removeStorageSync(KEY_HISTORY)
      return []
    }
  }
  return []
}

function addHistory(outfit, date){
  const list = getHistory();
  list.unshift({outfit, date})
  // 最多存20条，防止存储爆满
  if(list.length>20) list.pop();
  wx.setStorageSync(KEY_HISTORY, JSON.stringify(list))
}

// 清空全部缓存
function clearAll() {
  wx.clearStorageSync();
}

// ⚠️【对外导出完全严格和文档一模一样，不要旧别名】
module.exports = {
  getPreferences,
  setPreferences,
  getFavorites,
  addFavorite,
  removeFavorite,
  isFavorite,
  getHistory,
  addHistory,
  clearAll
}
