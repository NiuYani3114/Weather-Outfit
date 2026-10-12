Component({
  properties: {
    city: { type: String, value: '' },
    temp: { type: Number, value: 0 },
    feelTemp: { type: Number, value: 0 },
    weather: { type: String, value: '' },
    icon: { type: String, value: '' },
    dateText: { type: String, value: '' },
    warning: { type: String, value: '' },
    isLightMode: { type: Boolean, value: false }  // 新增：主题状态
  },

  data: {
    canvas: null,
    ctx: null,
    width: 0,
    height: 0,
    particles: [],
    animId: null,
    weatherType: 'default'
  },

  observers: {
    'weather': function(val) {
      if (val) {
        this.setData({ weatherType: this.getWeatherType(val) });
        this.initCanvas();
      }
    }
  },

  lifetimes: {
    attached() {
      this.initCanvas();
    },
    detached() {
      if (this.data.canvas && this.data.animId) {
        this.data.canvas.cancelAnimationFrame(this.data.animId);
      }
    }
  },

  methods: {
    getWeatherType(text) {
      if (!text) return 'default';
      if (text.includes('雨')) return 'rain';
      if (text.includes('雪')) return 'snow';
      if (text.includes('晴')) return 'sunny';
      if (text.includes('云') || text.includes('阴')) return 'cloudy';
      return 'default';
    },

    initCanvas() {
      const query = this.createSelectorQuery();
      query.select('#weather-canvas')
        .fields({ node: true, size: true })
        .exec((res) => {
          if (!res || !res[0] || !res[0].node) return;

          const canvas = res[0].node;
          const ctx = canvas.getContext('2d');

          let dpr = 1;
          try {
            dpr = wx.getWindowInfo().pixelRatio;
          } catch (e) {
            dpr = wx.getSystemInfoSync().pixelRatio;
          }

          canvas.width = res[0].width * dpr;
          canvas.height = res[0].height * dpr;
          ctx.scale(dpr, dpr);

          this.setData({
            canvas,
            ctx,
            width: res[0].width,
            height: res[0].height
          });

          this.initParticles();
          this.startAnimation();
        });
    },

    initParticles() {
      const { weatherType, width, height } = this.data;
      const particles = [];

      if (weatherType === 'rain') {
        for (let i = 0; i < 80; i++) {
          particles.push({
            x: Math.random() * width,
            y: Math.random() * height,
            len: 8 + Math.random() * 12,
            speed: 6 + Math.random() * 6,
            opacity: 0.3 + Math.random() * 0.5
          });
        }
      } else if (weatherType === 'snow') {
        for (let i = 0; i < 60; i++) {
          particles.push({
            x: Math.random() * width,
            y: Math.random() * height,
            r: 1 + Math.random() * 2.5,
            speed: 0.5 + Math.random() * 1.5,
            drift: (Math.random() - 0.5) * 0.5,
            opacity: 0.4 + Math.random() * 0.6
          });
        }
      } else if (weatherType === 'sunny') {
        for (let i = 0; i < 20; i++) {
          particles.push({
            x: Math.random() * width,
            y: Math.random() * height,
            r: 1 + Math.random() * 2,
            speed: 0.2 + Math.random() * 0.3,
            opacity: 0.2 + Math.random() * 0.4
          });
        }
      } else if (weatherType === 'cloudy') {
        for (let i = 0; i < 5; i++) {
          particles.push({
            x: Math.random() * width,
            y: Math.random() * height * 0.6,
            r: 20 + Math.random() * 30,
            speed: 0.1 + Math.random() * 0.2,
            opacity: 0.1 + Math.random() * 0.2
          });
        }
      }

      this.setData({ particles });
    },

    startAnimation() {
      const canvas = this.data.canvas;
      if (!canvas) return;

      const loop = () => {
        this.draw();
        const animId = canvas.requestAnimationFrame(loop);
        this.setData({ animId });
      };

      loop();
    },

    draw() {
      const { ctx, width, height, particles, weatherType } = this.data;
      if (!ctx) return;

      ctx.clearRect(0, 0, width, height);

      particles.forEach(p => {
        ctx.globalAlpha = p.opacity;

        if (weatherType === 'rain') {
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x + 2, p.y + p.len);
          ctx.stroke();

          p.y += p.speed;
          p.x += 1;
          if (p.y > height) {
            p.y = -p.len;
            p.x = Math.random() * width;
          }
          if (p.x > width) p.x = 0;

        } else if (weatherType === 'snow') {
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fill();

          p.y += p.speed;
          p.x += p.drift;
          if (p.y > height) {
            p.y = -p.r;
            p.x = Math.random() * width;
          }
          if (p.x > width) p.x = 0;
          if (p.x < 0) p.x = width;

        } else if (weatherType === 'sunny') {
          ctx.fillStyle = '#FFF9D2';
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fill();

          p.y -= p.speed;
          if (p.y < -p.r) {
            p.y = height + p.r;
            p.x = Math.random() * width;
          }

        } else if (weatherType === 'cloudy') {
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fill();

          p.x += p.speed;
          if (p.x > width + p.r) {
            p.x = -p.r;
            p.y = Math.random() * height * 0.6;
          }
        }
      });

      ctx.globalAlpha = 1;
    }
  }
});