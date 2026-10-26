const outfitEngine = require('../../../utils/outfitEngine');

Page({
  data: { allPalettes: [], isLightMode: false },
  
  onLoad() {
    this.setData({ allPalettes: outfitEngine.getAllColorPalettes() });
  },

  onShow() {
    const savedTheme = wx.getStorageSync('themeMode') || 'dark';
    const isLight = savedTheme === 'light';
    this.setData({ isLightMode: isLight });
    
    if (isLight) {
      wx.setNavigationBarColor({ frontColor: '#000000', backgroundColor: '#ffffff' });
    } else {
      wx.setNavigationBarColor({ frontColor: '#ffffff', backgroundColor: '#1e222b' }); // 👈 改这里
    }
  }
});