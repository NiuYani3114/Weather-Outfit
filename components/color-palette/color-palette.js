Component({
  /**
   * 组件的属性列表
   * 这些属性就是成员5在别的页面调用你时，需要传进来的数据
   */
  properties: {
    name: {
      type: String,
      value: '配色方案' // 默认名称
    },
    theme: {
      type: String,
      value: '' // 比如“暖色系”、“冷色系”
    },
    colors: {
      type: Array,
      value: [] // 必须是一个数组，比如 ['#FF0000', '#00FF00', '#0000FF']
    },
    desc: {
      type: String,
      value: '' // 配色描述，比如“适合春夏”
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})