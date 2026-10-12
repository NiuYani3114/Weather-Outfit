// 色彩搭配 - 成员5
const outfitEngine = require('../../utils/outfitEngine');

Page({
  data: {
    recommend: [],
    allPalettes: [],
    isLightMode: false, //新增
  },
  onLoad() {
    const app = getApp();
    const temp = app.globalData.currentTemp || 24;
    const recommend = outfitEngine.recommendColors(temp);
    const all = outfitEngine.getAllColorPalettes();
    this.setData({
      recommend: recommend,
      allPalettes: all
    });
  },
  //=====全新增加onShow=====
  onShow() {
    const savedTheme = wx.getStorageSync('themeMode') || 'dark';
    const isLight = savedTheme === 'light';
    this.setData({ isLightMode: isLight });
    if (isLight) {
      wx.setNavigationBarColor({
        frontColor: '#000000',
        backgroundColor: '#ffffff'
      });
    } else {
      wx.setNavigationBarColor({
        frontColor: '#ffffff',
        backgroundColor: '#151921'
      });
    }
  },
  onSelectPalette(e) {
    const { name } = e.detail;
    wx.showToast({
      title: `已选择${name}`,
      icon: 'none'
    });
  }
});
