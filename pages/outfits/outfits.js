// 多套搭配 - 成员5（保留前面日夜模式，合并后面功能）
const outfitEngine = require('../../utils/outfitEngine');
const storage = require('../../utils/storage');

Page({
  data: {
    outfits: [],
    filteredOutfits: [],
    currentFilter: 'all',
    currentTemp: 24,
    currentGender: 'female', // 用于生成稳定收藏 ID
    isLightMode: false,
  },

  onLoad() {
    this.generateOutfits();
  },

  onShow() {
    const savedTheme = wx.getStorageSync('themeMode') || 'dark';
    const isLight = savedTheme === 'light';
    this.setData({ isLightMode: isLight });

    // 保留前面版本的导航栏颜色处理
    if (isLight) {
      wx.setNavigationBarColor({
        frontColor: '#000000',
        backgroundColor: '#ffffff'
      });
    } else {
      wx.setNavigationBarColor({
        frontColor: '#ffffff',
        backgroundColor: '#1e222b'
      });
    }

    this.generateOutfits();
  },

  onPullDownRefresh() {
    this.generateOutfits();
    wx.stopPullDownRefresh();
  },

  generateOutfits() {
    const app = getApp();
    const temp = app.globalData.currentTemp || 24;
    const prefs = storage.getPreferences() || {};
    const gender = prefs.gender || 'female';

    const outfits = outfitEngine.generateMultipleOutfits(
      temp,
      gender,
      prefs.bodyType || 'normal',
      6
    );

    this.setData({
      outfits,
      filteredOutfits: outfits,
      currentTemp: temp,
      currentGender: gender
    });
  },

  filter(e) {
    const filter = e.currentTarget.dataset.filter;
    const { outfits } = this.data;

    let filtered = outfits;
    if (filter !== 'all') {
      // 保留前面更兼容的过滤：category 或 style 命中都算
      filtered = outfits.filter(o => o.category === filter || o.style === filter);
    }

    this.setData({
      currentFilter: filter,
      filteredOutfits: filtered
    });
  },

  selectOutfit(e) {
    const outfit = this.data.filteredOutfits[e.currentTarget.dataset.index];
    if (!outfit) return;

    // 合并后面的稳定 ID 修复，避免随机 ID 导致重复收藏判断失效
    const gender = this.data.currentGender || 'female';
    const stableId = `outfit_${gender}_${outfit.style}_${outfit.temp}`;
    const favoriteData = { ...outfit, id: stableId, gender };

    // 后面修正为 isFavorite，前面写的是 isFavorited
    if (storage.isFavorite(stableId)) {
      wx.showToast({ title: '已在收藏中', icon: 'none' });
      return;
    }

    wx.showModal({
      title: outfit.style,
      content: '是否收藏此搭配？',
      confirmText: '收藏',
      cancelText: '关闭',
      success: (res) => {
        if (res.confirm) {
          storage.addFavorite(favoriteData);
          wx.showToast({ title: '已收藏', icon: 'success' });
        }
      }
    });
  }
});