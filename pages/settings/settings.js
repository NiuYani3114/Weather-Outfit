const storage = require('../../utils/storage');

Page({
  data: {
    gender: 'male', bodyType: 'normal', genderText: '男生', bodyTypeText: '正常',
    recordHistory: true, isLightMode: false
  },

  onLoad() {
    const prefs = storage.getPreferences() || {};
    const savedGender = prefs.gender || 'male';
    const savedBodyType = prefs.bodyType || 'normal';
    
    let bodyTypeText = '正常';
    if (savedBodyType === 'cold') bodyTypeText = '怕冷';
    if (savedBodyType === 'hot') bodyTypeText = '怕热';

    this.setData({
      gender: savedGender, bodyType: savedBodyType,
      genderText: savedGender === 'female' ? '女生' : '男生', bodyTypeText: bodyTypeText
    });
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
  },

  // 后面保留你原来的逻辑...
  onChangeGender() {
    wx.showActionSheet({
      itemList: ['男生', '女生'],
      success: (res) => {
        let newGender = res.tapIndex === 0 ? 'male' : 'female';
        let newText = res.tapIndex === 0 ? '男生' : '女生';
        this.setData({ gender: newGender, genderText: newText });
        storage.setPreferences({ gender: newGender, bodyType: this.data.bodyType });
      }
    })
  },

  onChangeBodyType() {
    wx.showActionSheet({
      itemList: ['怕冷', '正常', '怕热'],
      success: (res) => {
        let newType = ['cold', 'normal', 'hot'][res.tapIndex];
        let newText = ['怕冷', '正常', '怕热'][res.tapIndex];
        this.setData({ bodyType: newType, bodyTypeText: newText });
        storage.setPreferences({ gender: this.data.gender, bodyType: newType });
      }
    })
  },

  toggleHistory() {
    this.setData({ recordHistory: !this.data.recordHistory });
  },

  onToggleTheme() {
    const isLight = !this.data.isLightMode;
    const themeName = isLight ? 'light' : 'dark';
    this.setData({ isLightMode: isLight });
    wx.setStorageSync('themeMode', themeName);
    
    if (isLight) {
      wx.setNavigationBarColor({ frontColor: '#000000', backgroundColor: '#ffffff' });
    } else {
      wx.setNavigationBarColor({ frontColor: '#ffffff', backgroundColor: '#1e222b' }); // 👈 改这里
    }
    
    wx.showToast({ title: isLight ? '已切换日间模式' : '已切换夜间模式', icon: 'none' });
  },

  onClearData() {
    wx.showModal({
      title: '⚠️ 危险操作', content: '确定要清空所有数据吗？此操作无法撤销。',
      success: (res) => {
        if (res.confirm) {
          storage.clearAll(); 
          this.setData({ gender: 'male', bodyType: 'normal', genderText: '男生', bodyTypeText: '正常' });
          wx.showToast({ title: '已清空', icon: 'success' });
        }
      }
    });
  }
});