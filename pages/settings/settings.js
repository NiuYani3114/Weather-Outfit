Page({
  data: {
    gender: 'male',
    bodyType: 'normal',
    genderText: '男生',
    bodyTypeText: '正常',
    recordHistory: true,
    isLightMode: false
  },

  onLoad() {
    const savedTheme = wx.getStorageSync('themeMode') || 'dark';
    this.setData({
      isLightMode: savedTheme === 'light'
    });
  },

  onChangeGender() {
    wx.showActionSheet({
      itemList: ['男生', '女生'],
      success: (res) => {
        if (res.tapIndex === 0) {
          this.setData({ gender: 'male', genderText: '男生' });
        } else if (res.tapIndex === 1) {
          this.setData({ gender: 'female', genderText: '女生' });
        }
      }
    })
  },

  onChangeBodyType() {
    wx.showActionSheet({
      itemList: ['怕冷', '正常', '怕热'],
      success: (res) => {
        if (res.tapIndex === 0) {
          this.setData({ bodyType: 'cold', bodyTypeText: '怕冷' });
        } else if (res.tapIndex === 1) {
          this.setData({ bodyType: 'normal', bodyTypeText: '正常' });
        } else if (res.tapIndex === 2) {
          this.setData({ bodyType: 'hot', bodyTypeText: '怕热' });
        }
      }
    })
  },

  onRecordHistoryChange(e) {
    this.setData({ recordHistory: e.detail.value });
  },

  onToggleTheme(e) {
    const isLight = e.detail.value;
    const themeName = isLight ? 'light' : 'dark';
    
    this.setData({ isLightMode: isLight });
    wx.setStorageSync('themeMode', themeName);
    
    wx.showToast({
      title: isLight ? '已切换日间模式' : '已切换夜间模式',
      icon: 'none'
    });
  },

  onClearData() {
    wx.showModal({
      title: '⚠️ 危险操作',
      content: '确定要清空所有数据吗？此操作无法撤销。',
      confirmColor: '#ff4d4f',
      success: (res) => {
        if (res.confirm) {
          wx.showToast({ title: '已清空', icon: 'success' });
        }
      }
    });
  }
});