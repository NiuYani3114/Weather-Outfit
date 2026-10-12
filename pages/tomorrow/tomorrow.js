Page({
  data: {
    forecastDate: '明天',
    tomorrowTemp: 18,
    tomorrowText: '多云',
    tempDiffTip: '温差正常，体感舒适',
    weatherType: 'cloudy',
    isLightMode: false,
    items: [
      { icon: '👕', name: '薄针织衫', type: 'top', bgColor: '#e8eaf6', warmth: 2 },
      { icon: '👖', name: '休闲长裤', type: 'bottom', bgColor: '#e0f2f1', warmth: 2 },
      { icon: '👟', name: '运动鞋', type: 'shoes', bgColor: '#fff3e0', warmth: 1 }
    ],
    forecastList: [
      { date: '今天', icon: '☀️', text: '晴', temp: 25 },
      { date: '明天', icon: '☁️', text: '多云', temp: 22 },
      { date: '周二', icon: '🌧️', text: '小雨', temp: 19 },
      { date: '周三', icon: '☁️', text: '阴', temp: 18 },
      { date: '周四', icon: '☀️', text: '晴', temp: 26 }
    ]
  },

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
  }
});