Component({
  properties: {
    icon: { type: String, value: '👕' },
    name: { type: String, value: '单品' },
    bgColor: { type: String, value: '#f0f0f0' },
    warmth: { type: Number, value: 0 },
    type: { type: String, value: 'top' }
  },
  methods: {
    // 点击事件，按文档要求触发
    onTap() {
      this.triggerEvent('tap', { name: this.data.name, type: this.data.type });
    }
  }
})