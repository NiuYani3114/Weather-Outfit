// 收藏页 - 成员5
const storage = require('../../utils/storage');

Page({
  data: {
    favorites: [],
    isLightMode: false, // 新增
  },
  onShow() {
    //===== 新增：主题同步逻辑 =====
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
    this.loadFavorites();
  },

  loadFavorites() {
    const list = storage.getFavorites();
    // 格式化时间
    const formatted = list.map(item => ({
      ...item,
      favTimeStr: this.formatTime(item.favTime)
    }));
    
    this.setData({ favorites: formatted });
  },
  goHome() {
    wx.switchTab({ url: '/pages/index/index' });
  },
  goDetail(e) {
    const item = e.currentTarget.dataset.item;
    wx.navigateTo({ url: `/pages/outfit/detail/detail?data=${encodeURIComponent(JSON.stringify(item))}` });
  },
  formatTime(timestamp) {
    const date = new Date(timestamp);
    return `${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`;
  },

  deleteFav(e) {
    const favId = e.currentTarget.dataset.favid;
    const item = e.currentTarget.dataset.item;
    
    wx.showModal({
      title: '删除这条收藏？',
      content: `${item.style} · ${item.temp}°时的搭配`,
      success: (res) => {
        if (res.confirm) {
          storage.removeFavorite(favId);
          this.loadFavorites();
          wx.showToast({ title: '已删除', icon: 'success' });
        }
      }
    });
  }
});