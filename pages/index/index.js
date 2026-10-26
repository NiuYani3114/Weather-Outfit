// 引入成员3写的真实接口
const api = require('../../utils/api');
const outfitEngine = require('../../utils/outfitEngine');
const storage = require('../../utils/storage');

Page({
  data: {
    loading: true,
    city: '定位中...',
    currentTemp: 0,
    feelTemp: 0,
    weatherText: '--',
    weatherIcon: '🌤️',
    dateText: '',
    warningText: '',
    gender: 'male',
    bodyType: 'normal',
    // ===== 个人信息弹窗 =====
    showSetupModal: false,
    bodyTypes: ['怕冷', '正常', '怕热'],
    tempBodyTypeIndex: 1,

    outfitItems: [],
    styleTags: [],
    isFav: false,
    isLightMode: false,
    currentOutfit: null,
    
    // 【新增】今日最高/最低温，用于天气卡片显示区间
    todayTempMax: undefined,
    todayTempMin: undefined,

    tomorrow: {
      date: '明天',
      tempMin: 0,
      tempMax: 0,
      tip: '暂无推荐'
    }
  },

  onLoad() {
    this.setDateText();

    // 1. 读取用户偏好
    const prefs = storage.getPreferences();
    this.setData({
      gender: prefs.gender || 'male',
      bodyType: prefs.bodyType || 'normal'
    });

    // ===== 检查是否需要弹窗 =====
    const userProfile = wx.getStorageSync('userProfile');
    if (!userProfile || !userProfile.gender) {
      let defaultIndex = 1; // 默认正常
      if (userProfile && userProfile.bodyType === 'cold') defaultIndex = 0;
      if (userProfile && userProfile.bodyType === 'hot') defaultIndex = 2;

      this.setData({
        showSetupModal: true,
        tempBodyTypeIndex: defaultIndex
      });
    }

    // 2. 加载真实天气和穿搭
    this.loadData();
  },

  onShow() {
    // 1. 日夜模式主题（保留前面的导航栏夜间色）
    const savedTheme = wx.getStorageSync('themeMode') || 'dark';
    const isLight = savedTheme === 'light';
    this.setData({ isLightMode: isLight });

    if (isLight) {
      wx.setNavigationBarColor({ frontColor: '#000000', backgroundColor: '#ffffff' });
    } else {
      wx.setNavigationBarColor({ frontColor: '#ffffff', backgroundColor: '#1e222b' });
    }

    // 2. 同步设置页的偏好
    const prefs = storage.getPreferences();
    const currentGender = prefs.gender || 'male';
    const currentBodyType = prefs.bodyType || 'normal';

    if (currentGender !== this.data.gender || currentBodyType !== this.data.bodyType) {
      this.setData({ gender: currentGender, bodyType: currentBodyType });
      if (this.data.currentTemp) {
        this.generateOutfit();
      }
    } else if (this.data.currentOutfit) {
      // 关键：性别没变也要重新对一次收藏状态（防止在收藏页删了）
      this.setData({ isFav: storage.isFavorite(this.data.currentOutfit.id) });
    }
  },

  setDateText() {
    const now = new Date();
    const month = now.getMonth() + 1;
    const day = now.getDate();
    const weekDays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    const weekDay = weekDays[now.getDay()];
    this.setData({ dateText: `${month}月${day}日 ${weekDay}` });
  },

  async loadData() {
    this.setData({ loading: true });
    try {
      // 1. 请求真实天气
      const weather = await api.getAllWeather();

            // 2. 更新天气 UI（直接从 current 里拿今天的最高低温）
            this.setData({
              city: weather.city,
              currentTemp: weather.current.temp,
              feelTemp: weather.current.feelsLike,
              weatherText: weather.current.text,
              weatherIcon: weather.current.icon,
              // 【核心修改】把真实的数据赋值给天气卡片
              todayTempMax: weather.current.todayTempMax,
              todayTempMin: weather.current.todayTempMin
            });

      // 3. 提取今日和明日数据
      if (weather.forecast && weather.forecast.daily && weather.forecast.daily.length > 1) {
        const today = weather.forecast.daily[0]; // 今天的数据
        const tm = weather.forecast.daily[1];    // 明天的数据

        this.setData({
          // 【新增】给天气卡片赋今日最高/最低温
          todayTempMax: today.tempMax,
          todayTempMin: today.tempMin,

          // 原有的明日数据
          tomorrow: {
            date: tm.date.substring(5),
            tempMin: tm.tempMin,
            tempMax: tm.tempMax,
            tip: `明日${tm.textDay}，建议根据温度穿搭`
          }
        });
      }

      // 给明日预览页准备全局数据
      const app = getApp();
      app.globalData.weather = weather;
      app.globalData.currentTemp = weather.current.temp;
      app.globalData.gender = this.data.gender;
      app.globalData.forecast = weather.forecast.daily;

      // 4. 生成真实穿搭
      this.generateOutfit();

    } catch (err) {
      console.error('数据加载失败', err);
      wx.showToast({ title: '天气获取失败', icon: 'none' });
      this.setData({ loading: false });
    }
  },

  generateOutfit() {
    const { currentTemp, gender, bodyType } = this.data;

    const outfit = outfitEngine.generateOutfit(currentTemp, gender, bodyType);

    // 覆盖引擎的随机 id，生成固定 id
    outfit.id = `home_${gender}_${currentTemp}_${bodyType}`;
    outfit.gender = gender;

    const isFav = storage.isFavorite(outfit.id);

    let warningText = '';
    if (outfit.warnings && outfit.warnings.length > 0) {
      warningText = outfit.warnings[0].message;
    }

    this.setData({
      outfitItems: outfit.items,
      styleTags: outfit.styles,
      warningText: warningText,
      currentOutfit: outfit,
      isFav: isFav,
      loading: false
    });
  },

  // ===== 弹窗交互 =====
  onGenderChange(e) {
    this.setData({ gender: e.detail.value });
  },

  onBodyTypeChange(e) {
    this.setData({ tempBodyTypeIndex: Number(e.detail.value) });
  },

  saveUserInfo() {
    const { gender, tempBodyTypeIndex, bodyTypes } = this.data;

    const bodyTypeCn = bodyTypes[tempBodyTypeIndex];

    let bodyTypeCode = 'normal';
    if (bodyTypeCn === '怕冷') bodyTypeCode = 'cold';
    if (bodyTypeCn === '怕热') bodyTypeCode = 'hot';

    // 存一份给首页和“我的”页面共享
    wx.setStorageSync('userProfile', { gender, bodyType: bodyTypeCode });

    // 存给底层引擎
    if (storage.setPreferences) {
      storage.setPreferences({ gender, bodyType: bodyTypeCode });
    }

    this.setData({
      showSetupModal: false,
      bodyType: bodyTypeCode
    });

    wx.showToast({ title: '设置成功', icon: 'success' });

    if (this.data.currentTemp) {
      this.generateOutfit();
    }
  },

  onToggleFavorite() {
    const { currentOutfit, isFav } = this.data;
    if (!currentOutfit) return;

    if (isFav) {
      storage.removeFavorite(currentOutfit.id);
      this.setData({ isFav: false });
      wx.showToast({ title: '已取消', icon: 'success' });
    } else {
      storage.addFavorite(currentOutfit);
      this.setData({ isFav: true });
      wx.showToast({ title: '已收藏', icon: 'success' });
    }
  },

  onItemTap(e) {
    const { name, type } = e.detail;
    wx.showToast({ title: `${name}（${type}）`, icon: 'none' });
  },

  goOutfits() {
    wx.switchTab({ url: '/pages/outfits/outfits' });
  },

  goTomorrow() {
    wx.navigateTo({ url: '/pages/tomorrow/tomorrow' });
  },

  async onPullDownRefresh() {
    await this.loadData();
    wx.stopPullDownRefresh();
  }
});