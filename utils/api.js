// utils/api.js - 成员3 【Open-Meteo 无key免费天气接口】
const constants = require('./constants');

const api = {
  // 获取定位
  getLocation() {
    return new Promise((resolve, reject) => {
      wx.getLocation({
        type: 'wgs84',
        success: resolve,
        fail: (err) => {
          console.error('定位失败', err);
          // 定位失败兜底：北京经纬度
          resolve({ latitude: 39.9042, longitude: 116.4074 });
        }
      });
    });
  },

  // 调用Open-Meteo获取天气原始数据
  getWeatherRaw(lat, lon) {
    return new Promise((resolve, reject) => {
      wx.request({
        url: `https://api.open-meteo.com/v1/forecast`,
        data: {
          latitude: lat,
          longitude: lon,
          current: "temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m",
          daily: "weather_code,temperature_2m_max,temperature_2m_min",
          timezone: "auto"
        },
        method: "GET",
        success: (res) => {
          if (res.statusCode === 200) {
            resolve(res.data);
          } else {
            reject(`接口返回状态码:${res.statusCode}`);
          }
        },
        fail: (err) => {
          reject(err);
        }
      })
    })
  },

  getCurrentWeather(lat, lon) {
    return new Promise(async (resolve, reject) => {
      try {
        const raw = await this.getWeatherRaw(lat, lon);
        const current = raw.current;
        const daily = raw.daily;
        const weatherCode = current.weather_code.toString();
        
        // 确保取到的是纯数字
        const currentT = Math.round(current.temperature_2m);
        const maxT = Math.round(daily.temperature_2m_max[0]);
        const minT = Math.round(daily.temperature_2m_min[0]);

        resolve({
          temp: currentT,
          feelsLike: currentT,
          todayTempMax: maxT,
          todayTempMin: minT,
          text: this.getWeatherText(weatherCode),
          icon: constants.WEATHER_ICONS[weatherCode] || constants.WEATHER_ICONS.default,
          iconCode: weatherCode,
          humidity: current.relative_humidity_2m,
          windScale: Math.round(current.wind_speed_10m)
        })
      } catch (err) {
        reject(err);
      }
    })
  },

  // 格式化多天预报
  getForecast(lat, lon) {
    return new Promise(async (resolve, reject) => {
      try {
        const raw = await this.getWeatherRaw(lat, lon);
        const daily = raw.daily;
        const list = [];
        // 【修改这里】取前6天，这样剔除今天后，页面刚好显示未来5天
        for(let i=0; i<6; i++){
          const wCode = daily.weather_code[i].toString();
          list.push({
            date: daily.time[i],
            tempMax: Math.round(daily.temperature_2m_max[i]),
            tempMin: Math.round(daily.temperature_2m_min[i]),
            textDay: this.getWeatherText(wCode),
            textNight: this.getWeatherText(wCode),
            iconDay: constants.WEATHER_ICONS[wCode] || constants.WEATHER_ICONS.default,
            iconNight: constants.WEATHER_ICONS[wCode] || '🌙',
            // 兼容对外约定字段
            text: this.getWeatherText(wCode),
            icon: constants.WEATHER_ICONS[wCode] || constants.WEATHER_ICONS.default
          })
        }
        resolve({ daily: list })
      } catch (err) {
        reject(err);
      }
    })
  },

  // 天气code转中文描述（Open-Meteo天气编码）
  getWeatherText(code) {
    const map = {
      '0': '晴朗',
      '1': '大部晴朗',
      '2': '多云',
      '3': '阴天',
      '45': '雾',
      '48': '雾凇',
      '51': '毛毛雨',
      '53': '小雨',
      '55': '大雨毛雨',
      '61': '小雨',
      '63': '中雨',
      '65': '大雨',
      '71': '小雪',
      '73': '中雪',
      '75': '大雪',
      '80': '阵雨',
      '81': '强阵雨',
      '82': '暴雨',
      '95': '雷暴',
    }
    return map[code] || '未知天气';
  },

  // 逆地理获取城市名（Open-Meteo不带城市，保留定位坐标，可后续接入地图api）
  getCityName(lat, lon) {
    return new Promise((resolve) => {
      // Open-Meteo本身不返回城市名称，这里暂时保留，可替换成高德/百度逆地理
      resolve('当前位置');
    });
  },

  // 聚合入口（主页index直接调用这个，函数名不变！！主页代码不用改）
  async getAllWeather() {
    try {
      const loc = await this.getLocation();
      const [current, forecast, city] = await Promise.all([
        this.getCurrentWeather(loc.latitude, loc.longitude),
        this.getForecast(loc.latitude, loc.longitude),
        this.getCityName(loc.latitude, loc.longitude)
      ]);
      return { current, forecast, city, location: loc };
    } catch (err) {
      console.error('OpenMeteo接口请求失败，启用Mock兜底数据', err);
      // 兜底mock，防止页面空白
      return {
        current: {
          temp: 20,
          feelsLike: 19,
          text: '多云',
          icon: constants.WEATHER_ICONS['101'],
          iconCode: '101',
          humidity: 55,
          windScale: 2
        },
        forecast: {
          daily: [
            { date: '2026-09-28', tempMax:24, tempMin:16, textDay:'多云', textNight:'晴', iconDay:'⛅', iconNight:'🌙'},
            { date: '2026-09-29', tempMax:22, tempMin:15, textDay:'阴', textNight:'小雨', iconDay:'☁️', iconNight:'🌧️'},
            { date: '2026-09-30', tempMax:21, tempMin:14, textDay:'晴', textNight:'多云', iconDay:'☀️', iconNight:'⛅'},
            { date: '2026-10-01', tempMax:23, tempMin:15, textDay:'晴', textNight:'晴', iconDay:'☀️', iconNight:'🌙'},
            { date: '2026-10-02', tempMax:25, tempMin:17, textDay:'多云', textNight:'阴', iconDay:'⛅', iconNight:'☁️'},
            { date: '2026-10-03', tempMax:20, tempMin:12, textDay:'小雨', textNight:'小雨', iconDay:'🌧️', iconNight:'🌧️'}
          ]
        },
        city: '当前位置',
        location: { latitude: 39.9042, longitude: 116.4074 }
      };
    }
  }
};

module.exports = api;