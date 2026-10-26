const api = require('../../utils/api.js');
const outfitEngine = require('../../utils/outfitEngine.js');
const storage = require('../../utils/storage.js');

Page({
  data: {
    forecastDate: '明天', 
    realDateText: '', // 👈 新增：用于显示真实日期（如：10月23日 周五）
    city: '定位中...', 
    tomorrowTemp: '--', 
    tomorrowText: '--',
    tempMin: '--', 
    tempMax: '--', 
    tempDiffTip: '加载中...', 
    weatherType: 'cloudy',
    isLightMode: false, 
    items: [], 
    forecastList: [], 
    recommendColor: null, 
    isRefreshing: false 
  },

  onShow() {
    // 1. 生成明天的真实日期
    this.setDateText();

    // 2. 同步主题
    const savedTheme = wx.getStorageSync('themeMode') || 'dark';
    const isLight = savedTheme === 'light';
    this.setData({ isLightMode: isLight });
    
    if (isLight) {
      wx.setNavigationBarColor({ frontColor: '#000000', backgroundColor: '#ffffff' });
    } else {
      wx.setNavigationBarColor({ frontColor: '#ffffff', backgroundColor: '#1e222b' });
    }
    this.loadRealData();
  },

  // 👈 新增：计算明天日期的方法
  setDateText() {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1); // 获取明天
    const month = tomorrow.getMonth() + 1;
    const day = tomorrow.getDate();
    const weekDays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    const weekDay = weekDays[tomorrow.getDay()];
    this.setData({ realDateText: `${month}月${day}日 ${weekDay}` });
  },

  async loadRealData() {
    if (!this.data.isRefreshing) wx.showLoading({ title: '正在获取天气...' });
    try {
      const weatherData = await api.getAllWeather(); 
      if (!weatherData || !weatherData.forecast || !weatherData.forecast.daily) throw new Error('天气数据结构异常');

      const dailyList = weatherData.forecast.daily;
      const tomorrowData = dailyList[1]; 
      if (!tomorrowData) throw new Error('明日天气数据不存在');

      const temp = tomorrowData.tempMax; 
      const text = tomorrowData.textDay;
      const diff = tomorrowData.tempMax - tomorrowData.tempMin;
      let tip = diff > 10 ? '昼夜温差大，建议携带外套' : '温差正常，体感舒适';
      
      let weatherType = 'cloudy';
      if (text.indexOf('晴') !== -1) weatherType = 'sunny';
      else if (text.indexOf('雨') !== -1) weatherType = 'rainy';

      const futureDays = dailyList.slice(1, 6); 
      const forecastList = futureDays.map((item, index) => ({
        date: index === 0 ? '明天' : item.date.substring(5), 
        icon: item.iconDay, 
        text: item.textDay, 
        tempMax: item.tempMax,
        tempMin: item.tempMin
      }));

      const prefs = storage.getPreferences() || { gender: 'female', bodyType: 'normal' };
      const items = outfitEngine.generateOutfit(temp, prefs.gender, prefs.bodyType).items || [];
      const colorArray = outfitEngine.recommendColors(temp);
      const recommendColor = colorArray.length > 0 ? colorArray[0] : null;

      this.setData({
        city: weatherData.city || '当前位置', 
        tomorrowTemp: temp, 
        tomorrowText: text,
        tempMin: tomorrowData.tempMin, 
        tempMax: tomorrowData.tempMax, 
        tempDiffTip: tip,
        weatherType, 
        forecastList, 
        items, 
        recommendColor 
      });
    } catch (err) {
      console.error('API请求失败', err);
      wx.showToast({ title: '网络不佳', icon: 'none' });
      this.loadMockData(); 
    } finally {
      wx.hideLoading();
      this.setData({ isRefreshing: false });
    }
  },

  onPullDownRefresh() {
    this.setData({ isRefreshing: true });
    this.loadRealData().then(() => wx.stopPullDownRefresh());
  },

  loadMockData() {
    this.setDateText(); // 兜底也重新算一下日期
    this.setData({
      city: '北京市朝阳区', 
      tomorrowTemp: 10, 
      tomorrowText: '毛毛雨', 
      tempMin: 2, 
      tempMax: 10,
      tempDiffTip: '温差正常，体感舒适', 
      weatherType: 'rainy',
      forecastList: [
        { date: '明天', icon: '🌧️', text: '毛毛雨', tempMax: 10, tempMin: 2 }, 
        { date: '10-21', icon: '☁️', text: '阴天', tempMax: 5, tempMin: 1 }
      ],
      items: [{ icon: '👕', name: '打底衫', type: 'top', bgColor: '#e8eaf6', warmth: 2 }],
      recommendColor: { name: '莫兰迪色系', desc: '低饱和度配色', colors: ['#B8C5D6', '#C9B1FF'] }
    });
  }
});