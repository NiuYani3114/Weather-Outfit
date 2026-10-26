// 收藏页 - 成员5（保留前面日夜模式，合并后面功能）
const storage = require('../../utils/storage');

Page({
  data: {
    favorites: [],        // 当前 tab 显示的列表
    allFavorites: [],     // 去重后的全量
    activeGender: 'all',  // all | female | male
    counts: { all: 0, female: 0, male: 0 },
    isLightMode: false,
  },

  onShow() {
    const savedTheme = wx.getStorageSync('themeMode') || 'dark';
    const isLight = savedTheme === 'light';
    this.setData({ isLightMode: isLight });

    // 保留前面版本的导航栏颜色处理
    if (isLight) {
      wx.setNavigationBarColor({ frontColor: '#000000', backgroundColor: '#ffffff' });
    } else {
      wx.setNavigationBarColor({ frontColor: '#ffffff', backgroundColor: '#1e222b' });
    }

    this.loadFavorites();
  },

  onPullDownRefresh() {
    this.loadFavorites();
    wx.stopPullDownRefresh();
  },

  loadFavorites() {
    const raw = storage.getFavorites() || [];

    // 1. 按 id 去重：同 id 只保留时间最新的一条
    const map = new Map();
    raw.forEach(item => {
      const id = item.id || item.favId;
      if (!id) return;
      const ts = item.favTime || item.timestamp || 0;
      const prev = map.get(id);
      const prevTs = prev ? (prev.favTime || prev.timestamp || 0) : -1;
      if (!prev || ts >= prevTs) map.set(id, item);
    });

    // 2. 补字段：gender、favId、favTimeStr
    const all = Array.from(map.values()).map(item => {
      const favTime = item.favTime || item.timestamp || Date.now();
      return {
        ...item,
        gender: this.resolveGender(item),
        favId: item.id || item.favId,
        favTimeStr: this.formatTime(favTime)
      };
    });

    // 3. 最新收藏排前面
    all.sort((a, b) => (b.favTime || b.timestamp || 0) - (a.favTime || a.timestamp || 0));

    // 4. 统计各 tab 数量
    const counts = {
      all: all.length,
      female: all.filter(i => i.gender === 'female').length,
      male: all.filter(i => i.gender === 'male').length,
    };

    // 5. 按当前 tab 过滤
    const activeGender = this.data.activeGender;
    const favorites = activeGender === 'all'
      ? all
      : all.filter(i => i.gender === activeGender);

    this.setData({ allFavorites: all, counts, favorites });
  },

  // 老数据没有 gender 时，从 id 里解析
  resolveGender(item) {
    if (item.gender === 'female' || item.gender === 'male') return item.gender;
    const id = String(item.id || item.favId || '');
    const parts = id.split('_');
    if (parts.indexOf('female') > -1) return 'female';
    if (parts.indexOf('male') > -1) return 'male';
    return 'unknown';
  },

  switchGenderTab(e) {
    const g = e.currentTarget.dataset.gender;
    if (g === this.data.activeGender) return;
    const { allFavorites } = this.data;
    const favorites = g === 'all'
      ? allFavorites
      : allFavorites.filter(i => i.gender === g);
    this.setData({ activeGender: g, favorites });
  },

  goHome() {
    wx.switchTab({ url: '/pages/index/index' });
  },

  goDetail(e) {
    const item = e.currentTarget.dataset.item;
    if (!item) return;
    wx.navigateTo({
      url: `/pages/outfit/detail/detail?data=${encodeURIComponent(JSON.stringify(item))}`
    });
  },

  formatTime(timestamp) {
    const date = new Date(timestamp);
    if (isNaN(date.getTime())) return '';
    return `${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`;
  },

  deleteFav(e) {
    // 阻止冒泡，避免同时触发 goDetail
    if (e && e.stopPropagation) e.stopPropagation();

    const item = e.currentTarget.dataset.item;
    const realId = item && (item.id || item.favId);
    if (!realId) {
      wx.showToast({ title: '数据异常，无法删除', icon: 'none' });
      return;
    }

    wx.showModal({
      title: '删除这条收藏？',
      content: `${item.style || ''} · ${item.temp || '--'}°时的搭配`,
      success: (res) => {
        if (res.confirm) {
          storage.removeFavorite(realId);
          this.loadFavorites();
          wx.showToast({ title: '已删除', icon: 'success' });
        }
      }
    });
  }
});