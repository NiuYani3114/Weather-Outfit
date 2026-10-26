// app.js - 成员3
App({
  globalData: {
    currentTemp: null,
    currentLocation: null,
    userPrefs: null
  },
  
  onLaunch() {
    // 初始化用户偏好
    const storage = require('./utils/storage');
    this.globalData.userPrefs = storage.getPreferences();
    
    // 检查更新
    if (wx.canIUse('getUpdateManager')) {
      const updateManager = wx.getUpdateManager();
      updateManager.onUpdateReady(() => {
        wx.showModal({
          title: '更新提示',
          content: '新版本已准备好，是否重启应用？',
          success: (res) => {
            if (res.confirm) updateManager.applyUpdate();
          }
        });
      });
    }
  }
});