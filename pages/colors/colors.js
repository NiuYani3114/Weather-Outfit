const outfitEngine = require('../../utils/outfitEngine');

Page({
  data: { recommend: [], isLightMode: false },
  
  onShow() {
    const savedTheme = wx.getStorageSync('themeMode') || 'dark';
    const isLight = savedTheme === 'light';
    this.setData({ isLightMode: isLight });
    
    if (isLight) {
      wx.setNavigationBarColor({ frontColor: '#000000', backgroundColor: '#ffffff' });
    } else {
      wx.setNavigationBarColor({ frontColor: '#ffffff', backgroundColor: '#1e222b' }); // 👈 改这里
    }
    this.randomizeRecommend();
  },

  randomizeRecommend() {
    const app = getApp();
    const temp = app.globalData.currentTemp || 24;
    let recommendPool = outfitEngine.recommendColors(temp);
    let shuffled = recommendPool.sort(() => 0.5 - Math.random());
    let selected = shuffled.slice(0, 5);

    const month = new Date().getMonth() + 1;
    let seasonStr = month >= 9 || month <= 2 ? '秋季' : '春季';
    let weatherTip = `当前正值${seasonStr}，气温 ${temp}°C，`;
    if (temp > 28) weatherTip += '天气炎热，推荐清爽降暑配色。';
    else if (temp > 18) weatherTip += '气温舒适，推荐温柔百搭配色。';
    else weatherTip += '天气微凉，推荐温暖复古配色。';

    const recommendWithTip = selected.map(item => ({ ...item, desc: `${weatherTip} ${item.desc}` }));
    this.setData({ recommend: recommendWithTip });
  },

  goToLibrary() {
    wx.navigateTo({ url: '/pages/colors/library/library' });
  }
});