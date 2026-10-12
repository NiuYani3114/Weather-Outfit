App({
  globalData: {
    theme: 'dark', // 默认夜间模式
  },

  onLaunch() {
    // 启动时，读取本地缓存中保存的主题
    const savedTheme = wx.getStorageSync('themeMode');
    if (savedTheme) {
      this.globalData.theme = savedTheme;
    }
  }
})