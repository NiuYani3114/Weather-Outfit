Page({
  data: {
    loading: false,
    city: '北京市朝阳区',
    currentTemp: 26,
    feelTemp: 28,
    weatherText: '多云',
    weatherIcon: '🌤️',
    dateText: '',
    warningText: '今日温差达12°，建议携带外套',
    gender: 'female',
    outfitItems: [
      { id: 1, icon: '👕', name: '薄针织', bgColor: '#e8eaf6', warmth: 2, type: 'top' },
      { id: 2, icon: '👖', name: '阔腿裤', bgColor: '#fce4ec', warmth: 2, type: 'bottom' },
      { id: 3, icon: '🧥', name: '薄外套', bgColor: '#e0f2f1', warmth: 3, type: 'outer' },
      { id: 4, icon: '👟', name: '小白鞋', bgColor: '#fff3e0', warmth: 1, type: 'shoes' },
      { id: 5, icon: '🎒', name: '单肩包', bgColor: '#f3e5f5', warmth: 0, type: 'accessory' }
    ],
    styleTags: ['通勤风', '舒适', '温差适配'],
    isFav: false,
    isLightMode: false,
    tomorrow: {
      date: '周一',
      tempMin: 22,
      tempMax: 30,
      tip: '气温回升，可穿轻薄连衣裙，注意防晒'
    }
  },

  onLoad() {
    this.setDateText();
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
  },

  setDateText() {
    const now = new Date();
    const month = now.getMonth() + 1;
    const day = now.getDate();
    const weekDays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    const weekDay = weekDays[now.getDay()];
    this.setData({
      dateText: `${month}月${day}日 ${weekDay}`
    });
  },

  onGenderChange(e) {
    const gender = e.currentTarget.dataset.gender;
    if (gender === this.data.gender) return;
    this.setData({ gender });

    if (gender === 'male') {
      this.setData({
        outfitItems: [
          { id: 1, icon: '👔', name: '衬衫', bgColor: '#e8eaf6', warmth: 2, type: 'top' },
          { id: 2, icon: '👖', name: '直筒裤', bgColor: '#e0f2f1', warmth: 2, type: 'bottom' },
          { id: 3, icon: '🧥', name: '夹克', bgColor: '#fff3e0', warmth: 3, type: 'outer' },
          { id: 4, icon: '👟', name: '休闲鞋', bgColor: '#fce4ec', warmth: 1, type: 'shoes' },
          { id: 5, icon: '🎒', name: '双肩包', bgColor: '#f3e5f5', warmth: 0, type: 'accessory' }
        ]
      });
    } else {
      this.setData({
        outfitItems: [
          { id: 1, icon: '👕', name: '薄针织', bgColor: '#e8eaf6', warmth: 2, type: 'top' },
          { id: 2, icon: '👖', name: '阔腿裤', bgColor: '#fce4ec', warmth: 2, type: 'bottom' },
          { id: 3, icon: '🧥', name: '薄外套', bgColor: '#e0f2f1', warmth: 3, type: 'outer' },
          { id: 4, icon: '👟', name: '小白鞋', bgColor: '#fff3e0', warmth: 1, type: 'shoes' },
          { id: 5, icon: '🎒', name: '单肩包', bgColor: '#f3e5f5', warmth: 0, type: 'accessory' }
        ]
      });
    }
  },

  onToggleFavorite() {
    this.setData({ isFav: !this.data.isFav });
    wx.showToast({
      title: this.data.isFav ? '已收藏' : '已取消',
      icon: 'success'
    });
  },

  goOutfits() {
    wx.switchTab({ url: '/pages/outfits/outfits' });
  },

  goTomorrow() {
    wx.navigateTo({ url: '/pages/tomorrow/tomorrow' });
  },

  goSettings() {
    wx.navigateTo({ url: '/pages/settings/settings' });
  },

  onPullDownRefresh() {
    wx.stopPullDownRefresh();
  }
});