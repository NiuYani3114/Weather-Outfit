Component({
  properties: {
    icon: { type: String, value: '👕' },
    name: { type: String, value: '' },
    bgColor: { type: String, value: '#e8f1f6' },
    warmth: { type: Number, value: 0 },
    type: { type: String, value: '' }
  },

  data: {
    warmthText: ''
  },

  observers: {
    'warmth': function (val) {
      const warmthMap = ['', '薄', '适中', '厚', '加绒', '防寒'];
      this.setData({ warmthText: warmthMap[val] || '' });
    }
  },

  methods: {
    onTap() {
      this.triggerEvent('tap', {
        type: this.data.type,
        name: this.data.name
      });
    }
  }
});