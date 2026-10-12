// 多套搭配 - 成员5
const outfitEngine = require('../../utils/outfitEngine');
const storage = require('../../utils/storage');

Page({
  data: {
    outfits: [],
    filteredOutfits: [],
    currentFilter: 'all',
    currentTemp: 24
  },

  onLoad() {
    this.generateOutfits();
  },

  onShow() {
    this.generateOutfits();
  },

  generateOutfits() {
    const app = getApp();
    const temp = app.globalData.currentTemp || 24;
    const prefs = storage.getPreferences() || {};
    
    const outfits = outfitEngine.generateMultipleOutfits(
      temp,
      prefs.gender || 'female',
      prefs.bodyType || 'normal',
      6
    );
    
    this.setData({
      outfits: outfits,
      filteredOutfits: outfits,
      currentTemp: temp
    });
  },

  filter(e) {
    const filter = e.currentTarget.dataset.filter;
    const { outfits } = this.data;
    
    let filtered = outfits;
    if (filter !== 'all') {
      filtered = outfits.filter(o => o.style === filter);
    }
    
    this.setData({
      currentFilter: filter,
      filteredOutfits: filtered
    });
  },

  selectOutfit(e) {
    const index = e.currentTarget.dataset.index;
    const outfit = this.data.filteredOutfits[index];
    
    wx.showModal({
      title: outfit.style,
      content: '是否查看详情或收藏此搭配？',
      confirmText: '收藏',
      cancelText: '关闭',
      success: (res) => {
        if (storage.isFavorited(outfit.id)) {
          wx.showToast({ title: '已在收藏中', icon: 'none' });
          return;
        }
        if (res.confirm) {
          storage.addFavorite(outfit);
          wx.showToast({ title: '已收藏', icon: 'success' });
        }
      }
    });
  }
});