// 色彩搭配 - 成员5
const outfitEngine = require('../../utils/outfitEngine');

Page({
  data: {
    recommend: [],
    allPalettes: []
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

  onSelectPalette(e) {
    const { name } = e.detail;
    wx.showToast({
      title: `已选择${name}`,
      icon: 'none'
    });
  }
});