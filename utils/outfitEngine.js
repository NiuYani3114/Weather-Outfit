// outfitEngine.js - 成员3（核心文件）
const { ITEM_BG_COLORS } = require('./constants');
// ==================== 工具：按风格取穿搭 ====================
function getItemsByStyle(db, style) {
    if (db.styleOutfits && db.styleOutfits[style]) {
        return db.styleOutfits[style].items.filter(item => item.name !== null);
    }
    return db.items.filter(item => item.name !== null);
}
// 风格分类映射：细分风格 → 所属大类（休闲/正式/运动/其他）
const STYLE_CATEGORY_MAP = {
    '法式': '休闲',
    '文艺': '休闲',
    '日系': '休闲',
    '韩系': '休闲',
    '通勤': '正式',
    '轻熟': '正式',
    '商务': '正式',
    '街头': '运动',
    '户外': '运动',
    '健身': '运动',
    '度假': '其他',
    '甜酷': '其他',
    '简约': '其他',
    '休闲': '休闲'
};
// ===================== 风格固定对应【颜色文字名称】，输出给前端直接展示文字，不输出对象、不输出色值 =====================
const STYLE_FIX_COLOR_NAME = {
    '法式': '大地色系',
    '文艺': '莫兰迪色系',
    '日系': '马卡龙色系',
    '韩系': '大地色系',
    '通勤': '莫兰迪色系',
    '轻熟': '酒红复古',
    '商务': '莫兰迪色系',
    '街头': '海军蓝白',
    '户外': '森林绿色',
    '健身': '海军蓝白',
    '度假': '马卡龙色系',
    '甜酷': '酒红复古',
    '简约': '大地色系',
    '休闲': '大地色系'
};
// ==================== 穿搭数据库（9 个温度区间 × 4 风格，男女共 72 套） ====================
const OUTFIT_DB = {
    female: {
        'below_neg10': {
            // ≤ -10℃：严寒，保暖等级全部拉满，配件补耳罩/面罩/手套
            styles: ['韩系', '通勤', '户外', '简约'],
            items: [
                { type: 'top', name: '加厚保暖内衣', icon: '🧶', warmth: 5 },
                { type: 'top', name: '高领加厚毛衣', icon: '🧶', warmth: 5 },
                { type: 'bottom', name: '加绒加厚打底裤', icon: '👖', warmth: 5 },
                { type: 'outer', name: '长款加厚羽绒服', icon: '🧥', warmth: 5 },
                { type: 'shoes', name: '防滑雪地靴', icon: '🥾', warmth: 5 },
                { type: 'accessory', name: '耳罩围巾手套', icon: '🧣', warmth: 5 }
            ],
            styleOutfits: {
                '韩系': {
                    items: [
                        { type: 'top', name: '加厚德绒打底', icon: '👕', warmth: 5 },
                        { type: 'top', name: '高领加厚毛衣', icon: '🧶', warmth: 5 },
                        { type: 'bottom', name: '加绒加厚打底裤', icon: '👖', warmth: 5 },
                        { type: 'outer', name: '长款加厚羽绒服', icon: '🧥', warmth: 5 },
                        { type: 'shoes', name: '防滑雪地靴', icon: '🥾', warmth: 5 },
                        { type: 'accessory', name: '耳罩围巾手套', icon: '🧣', warmth: 5 }
                    ]
                },
                '通勤': {
                    items: [
                        { type: 'top', name: '加厚德绒高领', icon: '👕', warmth: 5 },
                        { type: 'top', name: '加厚羊毛毛衣', icon: '🧶', warmth: 5 },
                        { type: 'bottom', name: '加绒加厚西裤', icon: '👖', warmth: 5 },
                        { type: 'outer', name: '长款过膝羽绒大衣', icon: '🧥', warmth: 5 },
                        { type: 'shoes', name: '加绒防滑皮靴', icon: '👢', warmth: 5 },
                        { type: 'accessory', name: '羊毛围巾手套', icon: '🧣', warmth: 5 }
                    ]
                },
                '户外': {
                    items: [
                        { type: 'top', name: '速热加厚打底', icon: '👕', warmth: 5 },
                        { type: 'top', name: '抓绒加厚卫衣', icon: '👕', warmth: 5 },
                        { type: 'bottom', name: '加绒防水冲锋裤', icon: '👖', warmth: 5 },
                        { type: 'outer', name: '长款加厚羽绒冲锋衣', icon: '🧥', warmth: 5 },
                        { type: 'shoes', name: '高帮防滑雪地靴', icon: '🥾', warmth: 5 },
                        { type: 'accessory', name: '防寒帽面罩', icon: '🧢', warmth: 5 }
                    ]
                },
                '简约': {
                    items: [
                        { type: 'top', name: '加厚纯棉保暖内衣', icon: '🧶', warmth: 5 },
                        { type: 'top', name: '纯色加厚毛衣', icon: '🧶', warmth: 5 },
                        { type: 'bottom', name: '加绒加厚直筒裤', icon: '👖', warmth: 5 },
                        { type: 'outer', name: '长款黑色羽绒服', icon: '🧥', warmth: 5 },
                        { type: 'shoes', name: '防滑雪地靴', icon: '🥾', warmth: 5 },
                        { type: 'accessory', name: '纯色羊毛围巾手套', icon: '🧣', warmth: 5 }
                    ]
                }
            }
        },
        'neg10_0': {
            // -10 ~ 0℃：零下，厚款 + 防滑鞋底
            styles: ['韩系', '通勤', '户外', '简约'],
            items: [
                { type: 'top', name: '德绒打底衫', icon: '👕', warmth: 4 },
                { type: 'top', name: '宽松厚毛衣', icon: '🧶', warmth: 4 },
                { type: 'bottom', name: '加绒半身长裙', icon: '👗', warmth: 4 },
                { type: 'outer', name: '中长款羽绒服', icon: '🧥', warmth: 5 },
                { type: 'shoes', name: '毛毛防滑短靴', icon: '👢', warmth: 4 },
                { type: 'accessory', name: '针织贝雷帽围巾', icon: '🎩', warmth: 4 }
            ],
            styleOutfits: {
                '韩系': {
                    items: [
                        { type: 'top', name: '德绒打底衫', icon: '👕', warmth: 4 },
                        { type: 'top', name: '宽松厚毛衣', icon: '🧶', warmth: 4 },
                        { type: 'bottom', name: '加绒半身长裙', icon: '👗', warmth: 4 },
                        { type: 'outer', name: '中长款羽绒服', icon: '🧥', warmth: 5 },
                        { type: 'shoes', name: '毛毛防滑短靴', icon: '👢', warmth: 4 },
                        { type: 'accessory', name: '针织贝雷帽围巾', icon: '🎩', warmth: 4 }
                    ]
                },
                '通勤': {
                    items: [
                        { type: 'top', name: '德绒高领打底', icon: '👕', warmth: 4 },
                        { type: 'top', name: '修身羊毛毛衣', icon: '🧶', warmth: 4 },
                        { type: 'bottom', name: '加厚西装直筒裤', icon: '👖', warmth: 4 },
                        { type: 'outer', name: '长款过膝羊毛大衣', icon: '🧥', warmth: 5 },
                        { type: 'shoes', name: '加绒通勤皮靴', icon: '👢', warmth: 4 },
                        { type: 'accessory', name: '细款羊毛围巾', icon: '🧣', warmth: 4 }
                    ]
                },
                '户外': {
                    items: [
                        { type: 'top', name: '速热保暖打底', icon: '👕', warmth: 5 },
                        { type: 'top', name: '抓绒厚卫衣', icon: '👕', warmth: 4 },
                        { type: 'bottom', name: '加绒防水冲锋裤', icon: '👖', warmth: 5 },
                        { type: 'outer', name: '长款加厚冲锋衣', icon: '🧥', warmth: 5 },
                        { type: 'shoes', name: '高帮雪地徒步靴', icon: '🥾', warmth: 5 },
                        { type: 'accessory', name: '防寒针织冷帽', icon: '🧢', warmth: 4 }
                    ]
                },
                '简约': {
                    items: [
                        { type: 'top', name: '纯棉保暖内衣', icon: '🧶', warmth: 4 },
                        { type: 'top', name: '纯色基础毛衣', icon: '🧶', warmth: 4 },
                        { type: 'bottom', name: '加绒直筒裤', icon: '👖', warmth: 4 },
                        { type: 'outer', name: '长款哑光羽绒服', icon: '🧥', warmth: 5 },
                        { type: 'shoes', name: '简约雪地靴', icon: '🥾', warmth: 4 },
                        { type: 'accessory', name: '纯色羊毛围巾', icon: '🧣', warmth: 4 }
                    ]
                }
            }
        },
        '0_5': {
    styles: ['韩系', '通勤', '户外', '简约'],
    items: [
        { type: 'top', name: '加绒打底衫', icon: '👕', warmth: 3 },
        { type: 'top', name: '针织毛衣', icon: '🧶', warmth: 3 },
        { type: 'bottom', name: '加绒直筒裤', icon: '👖', warmth: 3 },
        { type: 'outer', name: '中长款棉服', icon: '🧥', warmth: 4 },
        { type: 'shoes', name: '加绒短靴', icon: '👢', warmth: 3 },
        { type: 'accessory', name: '针织围巾', icon: '🧣', warmth: 2 }
    ],
    styleOutfits: {
        '韩系': {
            items: [
                { type: 'top', name: '加绒打底衫', icon: '👕', warmth: 3 },
                { type: 'top', name: '宽松针织毛衣', icon: '🧶', warmth: 3 },
                { type: 'bottom', name: '加绒半身长裙', icon: '👗', warmth: 3 },
                { type: 'outer', name: '中长款棉服', icon: '🧥', warmth: 4 },
                { type: 'shoes', name: '加绒短靴', icon: '👢', warmth: 3 },
                { type: 'accessory', name: '针织围巾', icon: '🧣', warmth: 2 }
            ]
        },
        '通勤': {
            items: [
                { type: 'top', name: '德绒打底衫', icon: '👕', warmth: 3 },
                { type: 'top', name: '修身针织衫', icon: '🧶', warmth: 3 },
                { type: 'bottom', name: '加绒西装裤', icon: '👖', warmth: 3 },
                { type: 'outer', name: '中长款羊毛大衣', icon: '🧥', warmth: 4 },
                { type: 'shoes', name: '通勤短靴', icon: '👢', warmth: 3 },
                { type: 'accessory', name: '细羊毛围巾', icon: '🧣', warmth: 2 }
            ]
        },
        '户外': {
            items: [
                { type: 'top', name: '速干保暖打底', icon: '👕', warmth: 3 },
                { type: 'top', name: '抓绒卫衣', icon: '👕', warmth: 3 },
                { type: 'bottom', name: '加绒休闲裤', icon: '👖', warmth: 3 },
                { type: 'outer', name: '薄款防风冲锋衣', icon: '🧥', warmth: 4 },
                { type: 'shoes', name: '低帮徒步鞋', icon: '🥾', warmth: 3 },
                { type: 'accessory', name: '运动棒球帽', icon: '🧢', warmth: 1 }
            ]
        },
        '简约': {
            items: [
                { type: 'top', name: '纯棉打底衫', icon: '👕', warmth: 3 },
                { type: 'top', name: '纯色基础毛衣', icon: '🧶', warmth: 3 },
                { type: 'bottom', name: '加绒直筒裤', icon: '👖', warmth: 3 },
                { type: 'outer', name: '中长款棉服', icon: '🧥', warmth: 4 },
                { type: 'shoes', name: '简约加绒短靴', icon: '👢', warmth: 3 },
                { type: 'accessory', name: '纯色围巾', icon: '🧣', warmth: 2 }
            ]
        }
    }
        },
        '5_10': {
            // 休闲:文艺 | 正式:通勤 | 运动:街头 | 其他:甜酷
            styles: ['文艺', '通勤', '街头', '甜酷'],
            items: [
                { type: 'top', name: '打底衫', icon: '👕', warmth: 3 },
                { type: 'top', name: '针织衫', icon: '🧶', warmth: 4 },
                { type: 'bottom', name: '牛仔裤', icon: '👖', warmth: 3 },
                { type: 'outer', name: '大衣', icon: '🧥', warmth: 4 },
                { type: 'shoes', name: '短靴', icon: '👢', warmth: 3 },
                { type: 'accessory', name: '围巾', icon: '🧣', warmth: 3 }
            ],
            styleOutfits: {
                '文艺': {
                    items: [
                        { type: 'top', name: '棉感打底衫', icon: '👕', warmth: 2 },
                        { type: 'top', name: '麻花针织毛衣', icon: '🧶', warmth: 3 },
                        { type: 'bottom', name: '灯芯绒半身裙', icon: '👗', warmth: 3 },
                        { type: 'outer', name: '宽松毛呢大衣', icon: '🧥', warmth: 4 },
                        { type: 'shoes', name: '复古马丁短靴', icon: '👢', warmth: 3 },
                        { type: 'accessory', name: '格纹围巾', icon: '🧣', warmth: 2 }
                    ]
                },
                '通勤': {
                    items: [
                        { type: 'top', name: '德绒打底衫', icon: '👕', warmth: 3 },
                        { type: 'top', name: '修身针织衫', icon: '🧶', warmth: 4 },
                        { type: 'bottom', name: '加绒西装裤', icon: '👖', warmth: 3 },
                        { type: 'outer', name: '中长款羊毛大衣', icon: '🧥', warmth: 4 },
                        { type: 'shoes', name: '低跟通勤短靴', icon: '👢', warmth: 3 },
                        { type: 'accessory', name: '细羊毛围巾', icon: '🧣', warmth: 2 }
                    ]
                },
                '街头': {
                    items: [
                        { type: 'top', name: '加厚磨毛打底', icon: '👕', warmth: 3 },
                        { type: 'top', name: 'oversize做旧卫衣', icon: '👕', warmth: 3 },
                        { type: 'bottom', name: '加绒直筒工装裤', icon: '👖', warmth: 3 },
                        { type: 'outer', name: '短款工装棉夹克', icon: '🧥', warmth: 4 },
                        { type: 'shoes', name: '高帮厚底马丁靴', icon: '🥾', warmth: 3 },
                        { type: 'accessory', name: '针织冷帽', icon: '🧢', warmth: 2 }
                    ]
                },
                '甜酷': {
                    items: [
                        { type: 'top', name: '黑色磨毛打底', icon: '👕', warmth: 3 },
                        { type: 'top', name: '短款高领毛衣', icon: '🧶', warmth: 3 },
                        { type: 'bottom', name: '黑色皮质半裙', icon: '👗', warmth: 3 },
                        { type: 'outer', name: '短款机车棉服', icon: '🧥', warmth: 4 },
                        { type: 'shoes', name: '厚底马丁短靴', icon: '👢', warmth: 3 },
                        { type: 'accessory', name: '链条贝雷帽', icon: '🎩', warmth: 2 }
                    ]
                }
            }
        },
        '10_15': {
            // 休闲:日系 | 正式:通勤 | 运动:户外 | 其他:简约
            styles: ['日系', '通勤', '户外', '简约'],
            items: [
                { type: 'top', name: '长袖T恤', icon: '👕', warmth: 2 },
                { type: 'top', name: '薄毛衣', icon: '🧶', warmth: 3 },
                { type: 'bottom', name: '休闲裤', icon: '👖', warmth: 2 },
                { type: 'outer', name: '风衣', icon: '🧥', warmth: 3 },
                { type: 'shoes', name: '乐福鞋', icon: '👞', warmth: 2 },
                { type: 'accessory', name: '贝雷帽', icon: '🎩', warmth: 2 }
            ],
            styleOutfits: {
                '日系': {
                    items: [
                        { type: 'top', name: '条纹长袖T恤', icon: '👕', warmth: 2 },
                        { type: 'top', name: 'V领针织背心', icon: '🧶', warmth: 2 },
                        { type: 'bottom', name: '阔腿工装休闲裤', icon: '👖', warmth: 2 },
                        { type: 'outer', name: '宽松短风衣', icon: '🧥', warmth: 3 },
                        { type: 'shoes', name: '小白帆布鞋', icon: '👟', warmth: 2 },
                        { type: 'accessory', name: '报童帽', icon: '🎩', warmth: 1 }
                    ]
                },
                '通勤': {
                    items: [
                        { type: 'top', name: '长袖基础T恤', icon: '👕', warmth: 2 },
                        { type: 'top', name: '薄款针织开衫', icon: '🧶', warmth: 2 },
                        { type: 'bottom', name: '垂感西装裤', icon: '👖', warmth: 2 },
                        { type: 'outer', name: '中长款风衣', icon: '🧥', warmth: 3 },
                        { type: 'shoes', name: '乐福小皮鞋', icon: '👞', warmth: 2 },
                        { type: 'accessory', name: '简约贝雷帽', icon: '🎩', warmth: 1 }
                    ]
                },
                '户外': {
                    items: [
                        { type: 'top', name: '速干长袖打底', icon: '👕', warmth: 2 },
                        { type: 'top', name: '薄抓绒卫衣', icon: '👕', warmth: 2 },
                        { type: 'bottom', name: '弹力户外休闲裤', icon: '👖', warmth: 2 },
                        { type: 'outer', name: '薄款防风冲锋衣', icon: '🧥', warmth: 3 },
                        { type: 'shoes', name: '低帮户外徒步鞋', icon: '🥾', warmth: 2 },
                        { type: 'accessory', name: '轻薄运动棒球帽', icon: '🧢', warmth: 1 }
                    ]
                },
                '简约': {
                    items: [
                        { type: 'top', name: '基础纯色长袖T恤', icon: '👕', warmth: 2 },
                        { type: 'top', name: '基础薄针织', icon: '🧶', warmth: 2 },
                        { type: 'bottom', name: '垂感直筒休闲裤', icon: '👖', warmth: 2 },
                        { type: 'outer', name: '极简短风衣', icon: '🧥', warmth: 3 },
                        { type: 'shoes', name: '基础乐福鞋', icon: '👞', warmth: 2 },
                        { type: 'accessory', name: '纯色贝雷帽', icon: '🎩', warmth: 1 }
                    ]
                }
            }
        },
        '15_20': {
            // 休闲:法式 | 正式:轻熟 | 运动:健身 | 其他:度假
            styles: ['法式', '轻熟', '健身', '度假'],
            items: [
                { type: 'top', name: '衬衫', icon: '👔', warmth: 2 },
                { type: 'top', name: '薄针织', icon: '👕', warmth: 2 },
                { type: 'bottom', name: '阔腿裤', icon: '👖', warmth: 1 },
                { type: 'outer', name: '西装外套', icon: '🧥', warmth: 2 },
                { type: 'shoes', name: '小白鞋', icon: '👟', warmth: 1 },
                { type: 'accessory', name: '单肩包', icon: '🎒', warmth: 0 }
            ],
            styleOutfits: {
                '法式': {
                    items: [
                        { type: 'top', name: '收腰缎面衬衫', icon: '👔', warmth: 2 },
                        { type: 'top', name: '薄针织马甲', icon: '🧶', warmth: 1 },
                        { type: 'bottom', name: 'A字垂感半裙', icon: '👗', warmth: 1 },
                        { type: 'outer', name: '短款休闲西装', icon: '🧥', warmth: 2 },
                        { type: 'shoes', name: '浅口平底单鞋', icon: '🥿', warmth: 1 },
                        { type: 'accessory', name: '细链条小包', icon: '👛', warmth: 0 }
                    ]
                },
                '轻熟': {
                    items: [
                        { type: 'top', name: '缎面衬衫', icon: '👔', warmth: 1 },
                        { type: 'top', name: '薄针织打底', icon: '👕', warmth: 1 },
                        { type: 'bottom', name: '高腰直筒半身裙', icon: '👗', warmth: 1 },
                        { type: 'outer', name: '短款小西装', icon: '🧥', warmth: 2 },
                        { type: 'shoes', name: '浅口平底单鞋', icon: '🥿', warmth: 1 },
                        { type: 'accessory', name: '细链条小包', icon: '👛', warmth: 0 }
                    ]
                },
                '健身': {
                    items: [
                        { type: 'top', name: '速干长袖运动上衣', icon: '👕', warmth: 2 },
                        { type: 'top', name: null, icon: null, warmth: 0 },
                        { type: 'bottom', name: '弹力运动长裤', icon: '👖', warmth: 1 },
                        { type: 'outer', name: '薄款运动外套', icon: '🧥', warmth: 2 },
                        { type: 'shoes', name: '缓震运动鞋', icon: '👟', warmth: 1 },
                        { type: 'accessory', name: '运动束发带', icon: '🎀', warmth: 0 }
                    ]
                },
                '度假': {
                    items: [
                        { type: 'top', name: '印花雪纺衬衫', icon: '👔', warmth: 2 },
                        { type: 'top', name: null, icon: null, warmth: 0 },
                        { type: 'bottom', name: '飘逸大摆半身长裙', icon: '👗', warmth: 1 },
                        { type: 'outer', name: '轻薄针织开衫', icon: '🧥', warmth: 2 },
                        { type: 'shoes', name: '平底草编鞋', icon: '🥿', warmth: 1 },
                        { type: 'accessory', name: '草编斜挎包', icon: '👜', warmth: 0 }
                    ]
                }
            }
        },
        '20_25': {
            // 休闲:法式 | 正式:通勤 | 运动:街头 | 其他:简约
            styles: ['法式', '通勤', '街头', '简约'],
            items: [
                { type: 'top', name: '薄针织', icon: '👕', warmth: 2 },
                { type: 'bottom', name: '阔腿裤', icon: '👖', warmth: 1 },
                { type: 'outer', name: '薄外套', icon: '🧥', warmth: 2 },
                { type: 'shoes', name: '小白鞋', icon: '👟', warmth: 1 },
                { type: 'accessory', name: '单肩包', icon: '🎒', warmth: 0 }
            ],
            styleOutfits: {
                '法式': {
                    items: [
                        { type: 'top', name: '碎花薄针织', icon: '👕', warmth: 2 },
                        { type: 'top', name: null, icon: null, warmth: 0 },
                        { type: 'bottom', name: '雪纺半身长裙', icon: '👗', warmth: 1 },
                        { type: 'outer', name: '轻薄开衫外套', icon: '🧥', warmth: 2 },
                        { type: 'shoes', name: '浅口平底鞋', icon: '🥿', warmth: 1 },
                        { type: 'accessory', name: '编织小包', icon: '👜', warmth: 0 }
                    ]
                },
                '通勤': {
                    items: [
                        { type: 'top', name: '薄款针织上衣', icon: '👕', warmth: 2 },
                        { type: 'top', name: null, icon: null, warmth: 0 },
                        { type: 'bottom', name: '高腰阔腿裤', icon: '👖', warmth: 1 },
                        { type: 'outer', name: '轻薄小西装', icon: '🧥', warmth: 2 },
                        { type: 'shoes', name: '小白鞋', icon: '👟', warmth: 1 },
                        { type: 'accessory', name: '简约单肩包', icon: '🎒', warmth: 0 }
                    ]
                },
                '街头': {
                    items: [
                        { type: 'top', name: '短款印花T恤', icon: '👕', warmth: 2 },
                        { type: 'top', name: null, icon: null, warmth: 0 },
                        { type: 'bottom', name: '做旧工装短裤', icon: '🩳', warmth: 1 },
                        { type: 'outer', name: '薄款牛仔夹克', icon: '🧥', warmth: 2 },
                        { type: 'shoes', name: '高帮帆布鞋', icon: '👟', warmth: 1 },
                        { type: 'accessory', name: '黑色棒球帽', icon: '🧢', warmth: 0 }
                    ]
                },
                '简约': {
                    items: [
                        { type: 'top', name: '纯色基础薄针织', icon: '👕', warmth: 2 },
                        { type: 'top', name: null, icon: null, warmth: 0 },
                        { type: 'bottom', name: '纯色直筒阔腿裤', icon: '👖', warmth: 1 },
                        { type: 'outer', name: '极简薄款西装', icon: '🧥', warmth: 2 },
                        { type: 'shoes', name: '基础小白鞋', icon: '👟', warmth: 1 },
                        { type: 'accessory', name: '纯色托特包', icon: '👜', warmth: 0 }
                    ]
                }
            }
        },
        '25_30': {
            // 休闲:休闲 | 正式:轻熟 | 运动:健身 | 其他:甜酷
            styles: ['休闲', '轻熟', '健身', '甜酷'],
            items: [
                { type: 'top', name: '短袖T恤', icon: '👕', warmth: 1 },
                { type: 'bottom', name: '半身裙', icon: '👗', warmth: 1 },
                { type: 'outer', name: '防晒衫', icon: '🥼', warmth: 1 },
                { type: 'shoes', name: '凉鞋', icon: '👡', warmth: 1 },
                { type: 'accessory', name: '遮阳帽', icon: '👒', warmth: 0 }
            ],
            styleOutfits: {
                '休闲': {
                    items: [
                        { type: 'top', name: '纯色短袖T恤', icon: '👕', warmth: 1 },
                        { type: 'top', name: null, icon: null, warmth: 0 },
                        { type: 'bottom', name: '牛仔半身短裙', icon: '👗', warmth: 1 },
                        { type: 'outer', name: '轻薄防晒衫', icon: '🥼', warmth: 1 },
                        { type: 'shoes', name: '平底凉鞋', icon: '👡', warmth: 1 },
                        { type: 'accessory', name: '草编遮阳帽', icon: '👒', warmth: 0 }
                    ]
                },
                '轻熟': {
                    items: [
                        { type: 'top', name: '缎面短袖小衫', icon: '👕', warmth: 1 },
                        { type: 'top', name: null, icon: null, warmth: 0 },
                        { type: 'bottom', name: '缎面中长半身裙', icon: '👗', warmth: 1 },
                        { type: 'outer', name: '轻薄雪纺防晒开衫', icon: '🥼', warmth: 1 },
                        { type: 'shoes', name: '细带平底凉鞋', icon: '👡', warmth: 1 },
                        { type: 'accessory', name: '小巧珍珠耳饰', icon: '📿', warmth: 0 }
                    ]
                },
                '健身': {
                    items: [
                        { type: 'top', name: '速干运动短袖', icon: '👕', warmth: 1 },
                        { type: 'top', name: null, icon: null, warmth: 0 },
                        { type: 'bottom', name: '运动速干短裙', icon: '👗', warmth: 1 },
                        { type: 'outer', name: '透气运动防晒衣', icon: '🥼', warmth: 1 },
                        { type: 'shoes', name: '运动训练凉鞋', icon: '👡', warmth: 1 },
                        { type: 'accessory', name: '运动空顶帽', icon: '🧢', warmth: 0 }
                    ]
                },
                '甜酷': {
                    items: [
                        { type: 'top', name: '短款辣妹T恤', icon: '👕', warmth: 1 },
                        { type: 'top', name: null, icon: null, warmth: 0 },
                        { type: 'bottom', name: '黑色牛仔短裙', icon: '👗', warmth: 1 },
                        { type: 'outer', name: '薄款黑色防晒外套', icon: '🥼', warmth: 1 },
                        { type: 'shoes', name: '厚底凉鞋', icon: '👡', warmth: 1 },
                        { type: 'accessory', name: '黑色棒球帽', icon: '🧢', warmth: 0 }
                    ]
                }
            }
        },
        '30_40': {
            // 休闲:休闲 | 正式:轻熟 | 运动:健身 | 其他:度假
            styles: ['休闲', '轻熟', '健身', '度假'],
            items: [
                { type: 'top', name: '吊带背心', icon: '🎽', warmth: 1 },
                { type: 'bottom', name: '短裤', icon: '🩳', warmth: 1 },
                { type: 'outer', name: null, icon: null, warmth: 0 },
                { type: 'shoes', name: '凉拖', icon: '🩴', warmth: 1 },
                { type: 'accessory', name: '墨镜', icon: '🕶️', warmth: 0 }
            ],
            styleOutfits: {
                '休闲': {
                    items: [
                        { type: 'top', name: '简约吊带背心', icon: '🎽', warmth: 1 },
                        { type: 'top', name: null, icon: null, warmth: 0 },
                        { type: 'bottom', name: '高腰牛仔短裤', icon: '🩳', warmth: 1 },
                        { type: 'outer', name: null, icon: null, warmth: 0 },
                        { type: 'shoes', name: '简约凉拖', icon: '🩴', warmth: 1 },
                        { type: 'accessory', name: '黑框墨镜', icon: '🕶️', warmth: 0 }
                    ]
                },
                '轻熟': {
                    items: [
                        { type: 'top', name: '缎面细肩吊带', icon: '🎽', warmth: 1 },
                        { type: 'top', name: null, icon: null, warmth: 0 },
                        { type: 'bottom', name: '垂感西装短裤', icon: '🩳', warmth: 1 },
                        { type: 'outer', name: null, icon: null, warmth: 0 },
                        { type: 'shoes', name: '细带平底凉拖', icon: '🩴', warmth: 1 },
                        { type: 'accessory', name: '金属细框墨镜', icon: '🕶️', warmth: 0 }
                    ]
                },
                '健身': {
                    items: [
                        { type: 'top', name: '速干运动背心', icon: '🎽', warmth: 1 },
                        { type: 'top', name: null, icon: null, warmth: 0 },
                        { type: 'bottom', name: '运动短裤', icon: '🩳', warmth: 1 },
                        { type: 'outer', name: null, icon: null, warmth: 0 },
                        { type: 'shoes', name: '运动凉拖', icon: '🩴', warmth: 1 },
                        { type: 'accessory', name: '运动墨镜', icon: '🕶️', warmth: 0 }
                    ]
                },
                '度假': {
                    items: [
                        { type: 'top', name: '海边吊带', icon: '🎽', warmth: 1 },
                        { type: 'top', name: null, icon: null, warmth: 0 },
                        { type: 'bottom', name: '沙滩短裤', icon: '🩳', warmth: 1 },
                        { type: 'outer', name: null, icon: null, warmth: 0 },
                        { type: 'shoes', name: '沙滩凉拖', icon: '🩴', warmth: 1 },
                        { type: 'accessory', name: '彩色墨镜', icon: '🕶️', warmth: 0 }
                    ]
                }
            }
        }
    },
    male: {
        'below_neg10': {
            styles: ['日系', '商务', '户外', '简约'],
            items: [
                { type: 'top', name: '加厚保暖内衣', icon: '🧶', warmth: 5 },
                { type: 'top', name: '高领加厚毛衣', icon: '🧶', warmth: 5 },
                { type: 'bottom', name: '加绒加厚裤', icon: '👖', warmth: 5 },
                { type: 'outer', name: '长款加厚羽绒服', icon: '🧥', warmth: 5 },
                { type: 'shoes', name: '防滑雪地靴', icon: '🥾', warmth: 5 },
                { type: 'accessory', name: '围巾手套', icon: '🧣', warmth: 5 }
            ],
            styleOutfits: {
                '日系': {
                    items: [
                        { type: 'top', name: '加厚德绒圆领打底', icon: '👕', warmth: 5 },
                        { type: 'top', name: '加厚落肩毛衣', icon: '🧶', warmth: 5 },
                        { type: 'bottom', name: '加绒加厚工装裤', icon: '👖', warmth: 5 },
                        { type: 'outer', name: '长款加厚羽绒服', icon: '🧥', warmth: 5 },
                        { type: 'shoes', name: '加绒防滑板鞋', icon: '👟', warmth: 5 },
                        { type: 'accessory', name: '加厚针织冷帽手套', icon: '🧢', warmth: 5 }
                    ]
                },
                '商务': {
                    items: [
                        { type: 'top', name: '加厚德绒打底', icon: '👕', warmth: 5 },
                        { type: 'top', name: '高领加厚羊毛毛衣', icon: '🧶', warmth: 5 },
                        { type: 'bottom', name: '加厚西裤', icon: '👖', warmth: 5 },
                        { type: 'outer', name: '长款过膝羊毛大衣', icon: '🧥', warmth: 5 },
                        { type: 'shoes', name: '加绒商务皮鞋', icon: '👞', warmth: 5 },
                        { type: 'accessory', name: '羊毛围巾手套', icon: '🧣', warmth: 5 }
                    ]
                },
                '户外': {
                    items: [
                        { type: 'top', name: '速热加厚打底', icon: '👕', warmth: 5 },
                        { type: 'top', name: '抓绒加厚卫衣', icon: '👕', warmth: 5 },
                        { type: 'bottom', name: '加绒防水冲锋裤', icon: '👖', warmth: 5 },
                        { type: 'outer', name: '长款加厚羽绒冲锋衣', icon: '🧥', warmth: 5 },
                        { type: 'shoes', name: '高帮防滑雪地靴', icon: '🥾', warmth: 5 },
                        { type: 'accessory', name: '防寒帽面罩', icon: '🧢', warmth: 5 }
                    ]
                },
                '简约': {
                    items: [
                        { type: 'top', name: '加厚纯棉保暖内衣', icon: '🧶', warmth: 5 },
                        { type: 'top', name: '纯色加厚毛衣', icon: '🧶', warmth: 5 },
                        { type: 'bottom', name: '加绒加厚直筒裤', icon: '👖', warmth: 5 },
                        { type: 'outer', name: '长款黑色羽绒服', icon: '🧥', warmth: 5 },
                        { type: 'shoes', name: '加绒防滑皮鞋', icon: '👞', warmth: 5 },
                        { type: 'accessory', name: '纯色羊毛围巾手套', icon: '🧣', warmth: 5 }
                    ]
                }
            }
        },
        'neg10_0': {
            styles: ['日系', '商务', '户外', '简约'],
            items: [
                { type: 'top', name: '德绒圆领打底', icon: '👕', warmth: 4 },
                { type: 'top', name: '宽松落肩毛衣', icon: '🧶', warmth: 4 },
                { type: 'bottom', name: '加绒阔腿工装裤', icon: '👖', warmth: 4 },
                { type: 'outer', name: '宽松廓形羽绒服', icon: '🧥', warmth: 5 },
                { type: 'shoes', name: '加绒工装板鞋', icon: '👟', warmth: 4 },
                { type: 'accessory', name: '纯色针织冷帽', icon: '🧢', warmth: 4 }
            ],
            styleOutfits: {
                '日系': {
                    items: [
                        { type: 'top', name: '德绒圆领打底', icon: '👕', warmth: 4 },
                        { type: 'top', name: '宽松落肩毛衣', icon: '🧶', warmth: 4 },
                        { type: 'bottom', name: '加绒阔腿工装裤', icon: '👖', warmth: 4 },
                        { type: 'outer', name: '宽松廓形羽绒服', icon: '🧥', warmth: 5 },
                        { type: 'shoes', name: '加绒工装板鞋', icon: '👟', warmth: 4 },
                        { type: 'accessory', name: '纯色针织冷帽', icon: '🧢', warmth: 4 }
                    ]
                },
                '商务': {
                    items: [
                        { type: 'top', name: '德绒打底衫', icon: '👕', warmth: 4 },
                        { type: 'top', name: '高领羊毛毛衣', icon: '🧶', warmth: 4 },
                        { type: 'bottom', name: '加厚西裤', icon: '👖', warmth: 4 },
                        { type: 'outer', name: '长款羊毛大衣', icon: '🧥', warmth: 5 },
                        { type: 'shoes', name: '加绒商务皮鞋', icon: '👞', warmth: 4 },
                        { type: 'accessory', name: '羊毛围巾', icon: '🧣', warmth: 4 }
                    ]
                },
                '户外': {
                    items: [
                        { type: 'top', name: '速热保暖打底', icon: '👕', warmth: 5 },
                        { type: 'top', name: '抓绒厚卫衣', icon: '👕', warmth: 4 },
                        { type: 'bottom', name: '加绒防水冲锋裤', icon: '👖', warmth: 5 },
                        { type: 'outer', name: '长款加厚冲锋衣', icon: '🧥', warmth: 5 },
                        { type: 'shoes', name: '高帮户外靴', icon: '🥾', warmth: 5 },
                        { type: 'accessory', name: '防寒冷帽', icon: '🧢', warmth: 4 }
                    ]
                },
                '简约': {
                    items: [
                        { type: 'top', name: '纯棉保暖内衣', icon: '🧶', warmth: 4 },
                        { type: 'top', name: '纯色基础毛衣', icon: '🧶', warmth: 4 },
                        { type: 'bottom', name: '加绒直筒裤', icon: '👖', warmth: 4 },
                        { type: 'outer', name: '黑色基础羽绒服', icon: '🧥', warmth: 5 },
                        { type: 'shoes', name: '简约加绒皮鞋', icon: '👞', warmth: 4 },
                        { type: 'accessory', name: '纯色围巾', icon: '🧣', warmth: 4 }
                    ]
                }
            }
        },
        '0_5': {
    styles: ['日系', '商务', '户外', '简约'],
    items: [
        { type: 'top', name: '德绒圆领打底', icon: '👕', warmth: 3 },
        { type: 'top', name: '宽松针织毛衣', icon: '🧶', warmth: 3 },
        { type: 'bottom', name: '加绒工装裤', icon: '👖', warmth: 3 },
        { type: 'outer', name: '中长款棉服', icon: '🧥', warmth: 4 },
        { type: 'shoes', name: '加绒板鞋', icon: '👟', warmth: 3 },
        { type: 'accessory', name: '针织冷帽', icon: '🧢', warmth: 2 }
    ],
    styleOutfits: {
        '日系': {
            items: [
                { type: 'top', name: '德绒圆领打底', icon: '👕', warmth: 3 },
                { type: 'top', name: '宽松针织毛衣', icon: '🧶', warmth: 3 },
                { type: 'bottom', name: '加绒工装裤', icon: '👖', warmth: 3 },
                { type: 'outer', name: '中长款棉服', icon: '🧥', warmth: 4 },
                { type: 'shoes', name: '加绒板鞋', icon: '👟', warmth: 3 },
                { type: 'accessory', name: '针织冷帽', icon: '🧢', warmth: 2 }
            ]
        },
        '商务': {
            items: [
                { type: 'top', name: '德绒打底衫', icon: '👕', warmth: 3 },
                { type: 'top', name: '高领针织毛衣', icon: '🧶', warmth: 3 },
                { type: 'bottom', name: '加厚西裤', icon: '👖', warmth: 3 },
                { type: 'outer', name: '中长款羊毛大衣', icon: '🧥', warmth: 4 },
                { type: 'shoes', name: '加绒商务皮鞋', icon: '👞', warmth: 3 },
                { type: 'accessory', name: '羊毛围巾', icon: '🧣', warmth: 2 }
            ]
        },
        '户外': {
            items: [
                { type: 'top', name: '速热保暖打底', icon: '👕', warmth: 4 },
                { type: 'top', name: '抓绒卫衣', icon: '👕', warmth: 3 },
                { type: 'bottom', name: '加绒冲锋裤', icon: '👖', warmth: 4 },
                { type: 'outer', name: '薄款冲锋衣', icon: '🧥', warmth: 4 },
                { type: 'shoes', name: '低帮户外靴', icon: '🥾', warmth: 4 },
                { type: 'accessory', name: '防寒冷帽', icon: '🧢', warmth: 3 }
            ]
        },
        '简约': {
            items: [
                { type: 'top', name: '纯棉打底衫', icon: '👕', warmth: 3 },
                { type: 'top', name: '纯色基础毛衣', icon: '🧶', warmth: 3 },
                { type: 'bottom', name: '加绒直筒裤', icon: '👖', warmth: 3 },
                { type: 'outer', name: '中长款棉服', icon: '🧥', warmth: 4 },
                { type: 'shoes', name: '简约加绒皮鞋', icon: '👞', warmth: 3 },
                { type: 'accessory', name: '纯色围巾', icon: '🧣', warmth: 2 }
            ]
        }
    }
},
        '5_10': {
            // 休闲:休闲 | 正式:轻熟 | 运动:街头 | 其他:简约
            styles: ['休闲', '轻熟', '街头', '简约'],
            items: [
                { type: 'top', name: '卫衣', icon: '👕', warmth: 3 },
                { type: 'bottom', name: '牛仔裤', icon: '👖', warmth: 3 },
                { type: 'outer', name: '夹克', icon: '🧥', warmth: 3 },
                { type: 'shoes', name: '运动鞋', icon: '👟', warmth: 2 },
                { type: 'accessory', name: '针织帽', icon: '🧢', warmth: 2 }
            ],
            styleOutfits: {
                '休闲': {
                    items: [
                        { type: 'top', name: '纯棉长袖打底', icon: '👕', warmth: 2 },
                        { type: 'top', name: '纯色休闲卫衣', icon: '👕', warmth: 3 },
                        { type: 'bottom', name: '水洗牛仔裤', icon: '👖', warmth: 3 },
                        { type: 'outer', name: '休闲立领夹克', icon: '🧥', warmth: 3 },
                        { type: 'shoes', name: '复古板鞋', icon: '👟', warmth: 2 },
                        { type: 'accessory', name: '基础针织帽', icon: '🧢', warmth: 2 }
                    ]
                },
                '轻熟': {
                    items: [
                        { type: 'top', name: '磨毛牛津衬衫', icon: '👔', warmth: 3 },
                        { type: 'top', name: 'V领薄针织马甲', icon: '🧶', warmth: 3 },
                        { type: 'bottom', name: '加厚垂感西裤', icon: '👖', warmth: 3 },
                        { type: 'outer', name: '短款毛呢夹克', icon: '🧥', warmth: 3 },
                        { type: 'shoes', name: '复古休闲皮鞋', icon: '👞', warmth: 2 },
                        { type: 'accessory', name: '皮质腕表', icon: '⌚', warmth: 0 }
                    ]
                },
                '街头': {
                    items: [
                        { type: 'top', name: '加厚长袖打底', icon: '👕', warmth: 3 },
                        { type: 'top', name: '宽松重磅卫衣', icon: '👕', warmth: 3 },
                        { type: 'bottom', name: '直筒牛仔裤', icon: '👖', warmth: 3 },
                        { type: 'outer', name: '工装夹克', icon: '🧥', warmth: 3 },
                        { type: 'shoes', name: '高帮运动鞋', icon: '👟', warmth: 2 },
                        { type: 'accessory', name: '针织冷帽', icon: '🧢', warmth: 2 }
                    ]
                },
                '简约': {
                    items: [
                        { type: 'top', name: '纯色磨毛打底', icon: '👕', warmth: 3 },
                        { type: 'top', name: '基础纯色卫衣', icon: '👕', warmth: 3 },
                        { type: 'bottom', name: '纯色直筒休闲裤', icon: '👖', warmth: 3 },
                        { type: 'outer', name: '极简立领夹克', icon: '🧥', warmth: 3 },
                        { type: 'shoes', name: '基础板鞋', icon: '👟', warmth: 2 },
                        { type: 'accessory', name: '纯色针织帽', icon: '🧢', warmth: 2 }
                    ]
                }
            }
        },
        '10_15': {
            // 休闲:日系 | 正式:通勤 | 运动:街头 | 其他:简约
            styles: ['日系', '通勤', '街头', '简约'],
            items: [
                { type: 'top', name: '长袖T恤', icon: '👕', warmth: 2 },
                { type: 'top', name: '薄卫衣', icon: '👕', warmth: 2 },
                { type: 'bottom', name: '休闲裤', icon: '👖', warmth: 2 },
                { type: 'outer', name: '牛仔外套', icon: '🧥', warmth: 2 },
                { type: 'shoes', name: '帆布鞋', icon: '👟', warmth: 1 },
                { type: 'accessory', name: '棒球帽', icon: '🧢', warmth: 0 }
            ],
            styleOutfits: {
                '日系': {
                    items: [
                        { type: 'top', name: '纯色长袖T恤', icon: '👕', warmth: 2 },
                        { type: 'top', name: '宽松薄卫衣', icon: '👕', warmth: 2 },
                        { type: 'bottom', name: '阔腿工装休闲裤', icon: '👖', warmth: 2 },
                        { type: 'outer', name: '宽松牛仔外套', icon: '🧥', warmth: 2 },
                        { type: 'shoes', name: '低帮帆布鞋', icon: '👟', warmth: 1 },
                        { type: 'accessory', name: '浅色系棒球帽', icon: '🧢', warmth: 0 }
                    ]
                },
                '通勤': {
                    items: [
                        { type: 'top', name: '长袖免烫衬衫', icon: '👔', warmth: 2 },
                        { type: 'top', name: null, icon: null, warmth: 0 },
                        { type: 'bottom', name: '垂感商务休闲西裤', icon: '👖', warmth: 2 },
                        { type: 'outer', name: '休闲薄西装', icon: '🧥', warmth: 2 },
                        { type: 'shoes', name: '商务休闲皮鞋', icon: '👞', warmth: 2 },
                        { type: 'accessory', name: '简约手表', icon: '⌚', warmth: 0 }
                    ]
                },
                '街头': {
                    items: [
                        { type: 'top', name: '印花长袖T恤', icon: '👕', warmth: 2 },
                        { type: 'top', name: '薄款连帽卫衣', icon: '👕', warmth: 2 },
                        { type: 'bottom', name: '阔腿牛仔裤', icon: '👖', warmth: 2 },
                        { type: 'outer', name: '做旧牛仔夹克', icon: '🧥', warmth: 2 },
                        { type: 'shoes', name: '复古板鞋', icon: '👟', warmth: 1 },
                        { type: 'accessory', name: '黑色棒球帽', icon: '🧢', warmth: 0 }
                    ]
                },
                '简约': {
                    items: [
                        { type: 'top', name: '基础长袖T恤', icon: '👕', warmth: 2 },
                        { type: 'top', name: '纯色薄卫衣', icon: '👕', warmth: 2 },
                        { type: 'bottom', name: '卡其休闲长裤', icon: '👖', warmth: 2 },
                        { type: 'outer', name: '牛仔外套', icon: '🧥', warmth: 2 },
                        { type: 'shoes', name: '经典帆布鞋', icon: '👟', warmth: 1 },
                        { type: 'accessory', name: '纯色棒球帽', icon: '🧢', warmth: 0 }
                    ]
                }
            }
        },
        '15_20': {
            // 休闲:休闲 | 正式:商务 | 运动:健身 | 其他:简约
            styles: ['休闲', '商务', '健身', '简约'],
            items: [
                { type: 'top', name: '衬衫', icon: '👔', warmth: 2 },
                { type: 'bottom', name: '卡其裤', icon: '👖', warmth: 2 },
                { type: 'outer', name: '西装外套', icon: '🧥', warmth: 2 },
                { type: 'shoes', name: '休闲皮鞋', icon: '👞', warmth: 2 },
                { type: 'accessory', name: '手表', icon: '⌚', warmth: 0 }
            ],
            styleOutfits: {
                '休闲': {
                    items: [
                        { type: 'top', name: '纯色牛津衬衫', icon: '👔', warmth: 2 },
                        { type: 'top', name: null, icon: null, warmth: 0 },
                        { type: 'bottom', name: '水洗卡其休闲裤', icon: '👖', warmth: 2 },
                        { type: 'outer', name: '休闲薄夹克', icon: '🧥', warmth: 2 },
                        { type: 'shoes', name: '复古休闲板鞋', icon: '👟', warmth: 2 },
                        { type: 'accessory', name: '帆布小包', icon: '👜', warmth: 0 }
                    ]
                },
                '商务': {
                    items: [
                        { type: 'top', name: '纯棉长袖衬衫', icon: '👔', warmth: 2 },
                        { type: 'top', name: null, icon: null, warmth: 0 },
                        { type: 'bottom', name: '修身西裤', icon: '👖', warmth: 2 },
                        { type: 'outer', name: '深色西装外套', icon: '🧥', warmth: 2 },
                        { type: 'shoes', name: '商务休闲皮鞋', icon: '👞', warmth: 2 },
                        { type: 'accessory', name: '简约机械手表', icon: '⌚', warmth: 0 }
                    ]
                },
                '健身': {
                    items: [
                        { type: 'top', name: '速干长袖运动T恤', icon: '👕', warmth: 2 },
                        { type: 'top', name: null, icon: null, warmth: 0 },
                        { type: 'bottom', name: '弹力运动长裤', icon: '👖', warmth: 2 },
                        { type: 'outer', name: '轻薄运动外套', icon: '🧥', warmth: 2 },
                        { type: 'shoes', name: '缓震训练运动鞋', icon: '👟', warmth: 2 },
                        { type: 'accessory', name: '运动手环', icon: '⌚', warmth: 0 }
                    ]
                },
                '简约': {
                    items: [
                        { type: 'top', name: '纯色长袖衬衫', icon: '👔', warmth: 2 },
                        { type: 'top', name: null, icon: null, warmth: 0 },
                        { type: 'bottom', name: '直筒休闲长裤', icon: '👖', warmth: 2 },
                        { type: 'outer', name: '休闲西装', icon: '🧥', warmth: 2 },
                        { type: 'shoes', name: '简约休闲皮鞋', icon: '👞', warmth: 2 },
                        { type: 'accessory', name: '基础款手表', icon: '⌚', warmth: 0 }
                    ]
                }
            }
        },
        '20_25': {
            // 休闲:休闲 | 正式:商务 | 运动:街头 | 其他:度假
            styles: ['休闲', '商务', '街头', '度假'],
            items: [
                { type: 'top', name: '牛津衬衫', icon: '👔', warmth: 2 },
                { type: 'bottom', name: '卡其裤', icon: '👖', warmth: 1 },
                { type: 'outer', name: '轻薄夹克', icon: '🧥', warmth: 2 },
                { type: 'shoes', name: '休闲皮鞋', icon: '👞', warmth: 1 },
                { type: 'accessory', name: '手表', icon: '⌚', warmth: 0 }
            ],
            styleOutfits: {
                '休闲': {
                    items: [
                        { type: 'top', name: '纯色薄衬衫', icon: '👔', warmth: 2 },
                        { type: 'top', name: null, icon: null, warmth: 0 },
                        { type: 'bottom', name: '垂感休闲裤', icon: '👖', warmth: 1 },
                        { type: 'outer', name: '轻薄休闲夹克', icon: '🧥', warmth: 2 },
                        { type: 'shoes', name: '复古休闲皮鞋', icon: '👞', warmth: 1 },
                        { type: 'accessory', name: '皮质手表', icon: '⌚', warmth: 0 }
                    ]
                },
                '商务': {
                    items: [
                        { type: 'top', name: '薄款牛津衬衫', icon: '👔', warmth: 2 },
                        { type: 'top', name: null, icon: null, warmth: 0 },
                        { type: 'bottom', name: '轻薄西裤', icon: '👖', warmth: 1 },
                        { type: 'outer', name: '轻薄商务夹克', icon: '🧥', warmth: 2 },
                        { type: 'shoes', name: '轻便商务皮鞋', icon: '👞', warmth: 1 },
                        { type: 'accessory', name: '简约手表', icon: '⌚', warmth: 0 }
                    ]
                },
                '街头': {
                    items: [
                        { type: 'top', name: '宽松印花短袖T恤', icon: '👕', warmth: 2 },
                        { type: 'top', name: null, icon: null, warmth: 0 },
                        { type: 'bottom', name: '工装五分短裤', icon: '🩳', warmth: 1 },
                        { type: 'outer', name: '薄款工装夹克', icon: '🧥', warmth: 2 },
                        { type: 'shoes', name: '高帮板鞋', icon: '👟', warmth: 1 },
                        { type: 'accessory', name: '黑色棒球帽', icon: '🧢', warmth: 0 }
                    ]
                },
                '度假': {
                    items: [
                        { type: 'top', name: '宽松棉麻短袖衬衫', icon: '👔', warmth: 2 },
                        { type: 'top', name: null, icon: null, warmth: 0 },
                        { type: 'bottom', name: '棉麻休闲短裤', icon: '🩳', warmth: 1 },
                        { type: 'outer', name: null, icon: null, warmth: 0 },
                        { type: 'shoes', name: '休闲沙滩鞋', icon: '🩴', warmth: 1 },
                        { type: 'accessory', name: '大檐遮阳帽', icon: '👒', warmth: 0 }
                    ]
                }
            }
        },
        '25_30': {
            // 休闲:休闲 | 正式:轻熟 | 运动:街头 | 其他:度假
            styles: ['休闲', '轻熟', '街头', '度假'],
            items: [
                { type: 'top', name: '短袖T恤', icon: '👕', warmth: 1 },
                { type: 'bottom', name: '短裤', icon: '🩳', warmth: 1 },
                { type: 'outer', name: null, icon: null, warmth: 0 },
                { type: 'shoes', name: '凉鞋', icon: '🩴', warmth: 1 },
                { type: 'accessory', name: '墨镜', icon: '🕶️', warmth: 0 }
            ],
            styleOutfits: {
                '休闲': {
                    items: [
                        { type: 'top', name: '纯色短袖T恤', icon: '👕', warmth: 1 },
                        { type: 'top', name: null, icon: null, warmth: 0 },
                        { type: 'bottom', name: '牛仔短裤', icon: '🩳', warmth: 1 },
                        { type: 'outer', name: null, icon: null, warmth: 0 },
                        { type: 'shoes', name: '休闲凉鞋', icon: '🩴', warmth: 1 },
                        { type: 'accessory', name: '黑框墨镜', icon: '🕶️', warmth: 0 }
                    ]
                },
                '轻熟': {
                    items: [
                        { type: 'top', name: '纯色短袖Polo衫', icon: '👕', warmth: 1 },
                        { type: 'top', name: null, icon: null, warmth: 0 },
                        { type: 'bottom', name: '垂感西装短裤', icon: '🩳', warmth: 1 },
                        { type: 'outer', name: null, icon: null, warmth: 0 },
                        { type: 'shoes', name: '简约皮凉拖', icon: '🩴', warmth: 1 },
                        { type: 'accessory', name: '金属细框墨镜', icon: '🕶️', warmth: 0 }
                    ]
                },
                '街头': {
                    items: [
                        { type: 'top', name: '印花短袖T恤', icon: '👕', warmth: 1 },
                        { type: 'top', name: null, icon: null, warmth: 0 },
                        { type: 'bottom', name: '工装短裤', icon: '🩳', warmth: 1 },
                        { type: 'outer', name: null, icon: null, warmth: 0 },
                        { type: 'shoes', name: '厚底凉拖', icon: '🩴', warmth: 1 },
                        { type: 'accessory', name: '黑框墨镜', icon: '🕶️', warmth: 0 }
                    ]
                },
                '度假': {
                    items: [
                        { type: 'top', name: '宽松短袖T恤', icon: '👕', warmth: 1 },
                        { type: 'top', name: null, icon: null, warmth: 0 },
                        { type: 'bottom', name: '沙滩短裤', icon: '🩳', warmth: 1 },
                        { type: 'outer', name: null, icon: null, warmth: 0 },
                        { type: 'shoes', name: '沙滩凉拖', icon: '🩴', warmth: 1 },
                        { type: 'accessory', name: '彩色墨镜', icon: '🕶️', warmth: 0 }
                    ]
                }
            }
        },
        '30_40': {
            // 休闲:休闲 | 正式:轻熟 | 运动:健身 | 其他:度假
            styles: ['休闲', '轻熟', '健身', '度假'],
            items: [
                { type: 'top', name: '背心', icon: '🎽', warmth: 1 },
                { type: 'bottom', name: '短裤', icon: '🩳', warmth: 1 },
                { type: 'outer', name: null, icon: null, warmth: 0 },
                { type: 'shoes', name: '凉拖', icon: '🩴', warmth: 1 },
                { type: 'accessory', name: '墨镜', icon: '🕶️', warmth: 0 }
            ],
            styleOutfits: {
                '休闲': {
                    items: [
                        { type: 'top', name: '纯棉背心', icon: '🎽', warmth: 1 },
                        { type: 'top', name: null, icon: null, warmth: 0 },
                        { type: 'bottom', name: '薄款休闲短裤', icon: '🩳', warmth: 1 },
                        { type: 'outer', name: null, icon: null, warmth: 0 },
                        { type: 'shoes', name: '基础凉拖', icon: '🩴', warmth: 1 },
                        { type: 'accessory', name: '简约墨镜', icon: '🕶️', warmth: 0 }
                    ]
                },
                '轻熟': {
                    items: [
                        { type: 'top', name: '纯色Polo背心', icon: '🎽', warmth: 1 },
                        { type: 'top', name: null, icon: null, warmth: 0 },
                        { type: 'bottom', name: '垂感西装短裤', icon: '🩳', warmth: 1 },
                        { type: 'outer', name: null, icon: null, warmth: 0 },
                        { type: 'shoes', name: '简约皮质凉拖', icon: '🩴', warmth: 1 },
                        { type: 'accessory', name: '细框商务墨镜', icon: '🕶️', warmth: 0 }
                    ]
                },
                '健身': {
                    items: [
                        { type: 'top', name: '速干运动背心', icon: '🎽', warmth: 1 },
                        { type: 'top', name: null, icon: null, warmth: 0 },
                        { type: 'bottom', name: '健身运动短裤', icon: '🩳', warmth: 1 },
                        { type: 'outer', name: null, icon: null, warmth: 0 },
                        { type: 'shoes', name: '运动凉拖', icon: '🩴', warmth: 1 },
                        { type: 'accessory', name: '运动墨镜', icon: '🕶️', warmth: 0 }
                    ]
                },
                '度假': {
                    items: [
                        { type: 'top', name: '宽松棉背心', icon: '🎽', warmth: 1 },
                        { type: 'top', name: null, icon: null, warmth: 0 },
                        { type: 'bottom', name: '棉麻居家短裤', icon: '🩳', warmth: 1 },
                        { type: 'outer', name: null, icon: null, warmth: 0 },
                        { type: 'shoes', name: '居家凉拖', icon: '🩴', warmth: 1 },
                        { type: 'accessory', name: '休闲墨镜', icon: '🕶️', warmth: 0 }
                    ]
                }
            }
        }
    }
};
// ==================== 配色方案（超级调色盘 - 按季节分类） ====================
const COLOR_PALETTES = [
    // ===== 春季：甜美、盐系、轻盈 (适合 12-22度) =====
    { name: '盐系高街-紫', theme: '盐系高街', season: '春季', colors: ['#CCBBDA', '#A08D9D', '#E2CAC9', '#484451'], desc: '低饱和的灰紫与奶杏色，清冷高级的盐系穿搭。' },
    { name: '盐系高街-蓝', theme: '盐系高街', season: '春季', colors: ['#7594A5', '#DBC8A1', '#A3A5A6', '#424D56'], desc: '雾霾蓝与卡其色的经典碰撞，干净清爽。' },
    { name: '盐系高街-绿', theme: '盐系高街', season: '春季', colors: ['#50775A', '#CCD8BA', '#98A099', '#52564E'], desc: '抹茶绿与浅灰，充满呼吸感的日系盐系配色。' },
    { name: '盐系高街-粉', theme: '盐系高街', season: '春季', colors: ['#E5939D', '#F7DFCE', '#D1CABD', '#748793'], desc: '灰粉与奶油白，融入一点灰蓝，甜而不腻。' },
    { name: '法式蜜桃派', theme: '甜美软糯', season: '春季', colors: ['#F28695', '#FFC5BB', '#FFD0A9', '#FCEA7E'], desc: '蜜桃粉与奶油色的碰撞，温柔又治愈' },
    { name: '玫瑰可露丽', theme: '法式甜心', season: '春季', colors: ['#FEC5CE', '#F8819B', '#734025', '#DC9942'], desc: '玫瑰粉与焦糖棕，一口咬下法式甜品的浪漫。' },
    { name: '精灵可露丽', theme: '森林童话', season: '春季', colors: ['#C2E391', '#9BB336', '#9F6634', '#FFEC96'], desc: '嫩绿色与金黄色，仿佛置身于春日森林。' },
    { name: '雏菊冰糖梨', theme: '清新自然', season: '春季', colors: ['#BBEADB', '#63D6C5', '#F9EEA0', '#9DC847'], desc: '嫩绿与薄荷的碰撞，清新又元气' },
    { name: '窗纱香灰', theme: '国风仙气', season: '春季', colors: ['#B6A9C8', '#A09BC3', '#D8E6EA', '#9DBFC3'], desc: '香纱紫与山雪白，自带仙气的高级感' },
    { name: '远山素影', theme: '国风水墨', season: '春季', colors: ['#A8BEDF', '#C7D5E8', '#D8C9BA', '#EFE4D4'], desc: '远山青与雾沙灰，宛如一幅水墨画' },

    // ===== 夏季：清爽、多巴胺、明亮 (适合 22度以上) =====
    { name: '薄荷曼波', theme: '清新氧气', season: '夏季', colors: ['#CFE4DD', '#F9F4EA', '#FCD3D6', '#8D6C63'], desc: '薄荷绿与豆沙色的碰撞，视觉降暑神器' },
    { name: '橘子汽水', theme: '活力多巴胺', season: '夏季', colors: ['#FEBF29', '#FAE593', '#849C4D', '#C5863C'], desc: '明亮橘色搭配草绿，元气满满的夏日气息' },
    { name: '莓酱芝士挞', theme: '草莓甜心', season: '夏季', colors: ['#FFB6BD', '#FFD7D5', '#FFEEB6', '#BAFCF1'], desc: '草莓粉与冰淇淋黄，像甜点一样诱人' },
    { name: '盐系高街-浅灰', theme: '盐系高街', season: '夏季', colors: ['#DBA9B5', '#423C3A', '#B6A881', '#50524A'], desc: '柔和粉灰与深咖，极具现代感的冷淡配色。' },
    { name: '盐系高街-黄蓝', theme: '盐系高街', season: '夏季', colors: ['#F9CD75', '#8EA0A1', '#E9DBB7', '#444339'], desc: '明媚的鹅黄搭配灰蓝，活力又高级。' },
    { name: '盐系高街-冷绿', theme: '盐系高街', season: '夏季', colors: ['#B7CFE5', '#32736A', '#8C9BA3', '#353A4C'], desc: '冰冷的灰蓝与深绿，带来一丝薄荷般的凉意。' },
    { name: '盐系高街-灰粉', theme: '盐系高街', season: '夏季', colors: ['#F1BFC9', '#4A5060', '#AEB4BA', '#57627C'], desc: '灰粉色与深石板灰，又酷又飒。' },
    // ===== 秋季：秋冬温暖、美拉德、复古、浓郁 (适合 8-20度) =====
    { name: '香草酥皮塔', theme: '秋冬温暖', season: '秋季', colors: ['#4a1a0d', '#ece2be', '#9baa76', '#a5322f'], desc: '香草、抹茶与莓果的浓郁碰撞，温暖的甜品系。' },
    { name: '莓果拿破仑', theme: '秋冬温暖', season: '秋季', colors: ['#3a1616', '#fddbb0', '#dfa73d', '#7e2d1e'], desc: '深红与明黄的经典组合，像拿破仑蛋糕一样层层叠叠。' },
    { name: '薄荷巧克力', theme: '秋冬温暖', season: '秋季', colors: ['#372010', '#7f513e', '#96afcb', '#a55539'], desc: '浓郁的巧克力底色上点缀清冷薄荷蓝，复古高级。' },
    { name: '坚果巴斯克', theme: '秋冬温暖', season: '秋季', colors: ['#6d4e36', '#fbd6b0', '#efac73', '#a27b5b'], desc: '焦糖坚果与奶油色，散发着巴斯克蛋糕的烘焙香气。' },
    { name: '盐系马卡龙', theme: '秋冬温暖', season: '秋季', colors: ['#4f2b2b', '#f7f1e4', '#e9ca89', '#a2c1c0'], desc: '低饱和的莫兰迪色系，清冷中带有一丝甜美。' },
    { name: '抹茶牛角包', theme: '秋冬温暖', season: '秋季', colors: ['#4d3116', '#fde1c3', '#9c923c', '#6b5729'], desc: '浓郁的抹茶绿搭配牛角包的焦糖色，秋日森系。' },
    { name: '椰芒瑞士卷', theme: '秋冬温暖', season: '秋季', colors: ['#5d3216', '#dbe1d0', '#f5ed90', '#9da74c'], desc: '清新的椰芒黄与深咖色，像一份轻盈的下午茶。' },
    { name: '玫瑰可露丽', theme: '秋冬温暖', season: '秋季', colors: ['#805d47', '#eef7ed', '#eefdb8', '#dea6a5'], desc: '温柔的玫瑰粉与可可色，法式甜品的极致浪漫。' },
    { name: '蓝莓布朗尼', theme: '秋冬温暖', season: '秋季', colors: ['#69493c', '#f7f1e4', '#f5e4b4', '#d2c4c6'], desc: '蓝莓的深邃与布朗尼的厚重，甜而不腻的秋冬色调。' },
    { name: '蓝咖复古', theme: '美拉德风', season: '秋季', colors: ['#81B2D9', '#2059A6', '#8C5A46', '#E9E4D8'], desc: '浅蓝、深蓝与深咖的经典撞色，浓郁复古。' },
    { name: '柠檬咖色', theme: '美拉德风', season: '秋季', colors: ['#F7D117', '#4A3025', '#7A4A2D', '#D1C8B4'], desc: '亮眼的柠檬黄搭配深咖，如同秋日落叶与阳光。' },
    { name: '湖水麦浪', theme: '美拉德风', season: '秋季', colors: ['#379B8B', '#DAB637', '#C1411D', '#1D1D1B'], desc: '湖水蓝绿碰撞麦浪黄与亮橘，极具视觉冲击力。' },
    { name: '粉咖甜心', theme: '美拉德风', season: '秋季', colors: ['#F0C6C5', '#523024', '#86B6D6', '#EBE2D5'], desc: '柔和的粉色与深咖、浅蓝组合，甜美又温暖。' },
    { name: '牛仔橘调', theme: '美拉德风', season: '秋季', colors: ['#416B94', '#D07C2A', '#F3B823', '#4D3A27'], desc: '经典的牛仔蓝与枫叶橘，活力百搭的秋日色彩。' },
    { name: '紫绿撞色', theme: '美拉德风', season: '秋季', colors: ['#744B84', '#929E28', '#381F23', '#F2ECE4'], desc: '紫色的神秘与橄榄绿的复古，小众且极其高级。' },
    { name: '山葵果棕', theme: '美拉德风', season: '秋季', colors: ['#B3C387', '#71442A', '#BDC549', '#E2D5C4'], desc: '清新的山葵绿搭配醇厚的果棕色，自然舒缓。' },
    { name: '焦糖奶咖', theme: '美拉德风', season: '秋季', colors: ['#A6673A', '#C9A68B', '#F5F2EB', '#4B3424'], desc: '焦糖、奶咖与象牙白，秋冬最经典的温暖治愈系。' },
    { name: '姜黄奶白', theme: '美拉德风', season: '秋季', colors: ['#EAA81B', '#9B6E4B', '#F6F4EE', '#3D2B1F'], desc: '明快的姜黄色与浅棕、奶白，打破秋冬的沉闷。' },
    { name: '橄榄浅咖', theme: '美拉德风', season: '秋季', colors: ['#6D8237', '#7B4F35', '#D2B69F', '#E8DFD3'], desc: '森系橄榄绿与浅咖色的完美融合，温柔且包容。' },
    { name: '费尔岛拿铁', theme: '复古北欧', season: '秋季', colors: ['#A4B9DD', '#FBF6E0', '#E4C291', '#8A5128'], desc: '北欧风情的费尔岛毛衣配色，复古又温馨。' },
    { name: '陶碗酒痕', theme: '国风复古', season: '秋季', colors: ['#99B6B4', '#BACFCE', '#DFB199', '#D48982'], desc: '窑釉青与酒痕红，沉淀岁月之美' },
    { name: '费尔岛-复古红', theme: '浓郁费尔岛', season: '秋季', colors: ['#1E1C20', '#D3CFB2', '#396067', '#7A3B3B'], desc: '深色基调搭配复古红与孔雀蓝，浓郁北欧风。' },
    { name: '费尔岛-深邃蓝', theme: '浓郁费尔岛', season: '秋季', colors: ['#32374D', '#D7985C', '#D79E50', '#9B3A53'], desc: '深邃的藏蓝与亮橘色，强烈的视觉对比。' },
    { name: '费尔岛-摩卡棕', theme: '浓郁费尔岛', season: '秋季', colors: ['#BE9C78', '#767C4B', '#3C261F', '#9E5B4C'], desc: '温暖的摩卡棕与橄榄绿，秋日复古感拉满。' },
    { name: '费尔岛-灰绿调', theme: '浓郁费尔岛', season: '秋季', colors: ['#602923', '#E5CA9F', '#202539', '#4D6758'], desc: '暗红与灰绿，经典的费尔岛毛衣复古配色。' },
    // ===== 冬季：温暖、厚重、极简 (适合 8度以下) =====
    { name: '枫叶奶茶', theme: '美拉德风', season: '冬季', colors: ['#B63A30', '#4D2A20', '#D5B8A1', '#F2EBE1'], desc: '枫叶红与深咖、奶茶色，宛如一杯热腾腾的冬日红茶。' },
    { name: '雾蓝浅咖', theme: '美拉德风', season: '冬季', colors: ['#AA8678', '#A0C0D6', '#F8F6F0', '#4E3D34'], desc: '静谧的雾霾蓝中和了咖色的厚重，清冷又高级。' },
    { name: '姜饼小熊仁', theme: '秋冬暖意', season: '冬季', colors: ['#DEB075', '#F8C8C6', '#8B7069', '#E5A383'], desc: '烤饼干般的温暖配色，适合冬日午后。' },
    { name: '糖炒冰栗子', theme: '秋冬暖意', season: '冬季', colors: ['#8C5105', '#B9D9EA', '#E9BA6C', '#A55F19'], desc: '栗子棕与冰蓝色，带来意想不到的温暖撞色。' },
    { name: '珍珠糯米糍', theme: '软糯大地', season: '冬季', colors: ['#F4EDD1', '#5C3D3B', '#E2C19E', '#A27D60'], desc: '浓郁的巧克力与糯米白，高级的秋冬大地色。' },
    { name: '黄油可露丽', theme: '复古甜品', season: '冬季', colors: ['#F3E698', '#CFB697', '#674B3F', '#BE7743'], desc: '黄油般的温暖质感，浓郁的法式复古风。' },
    { name: '甘纳许曲奇', theme: '浓郁焦糖', season: '冬季', colors: ['#7D5148', '#E2BA89', '#4B3134', '#C7541B'], desc: '深咖色与橘调焦糖，散发着浓郁的烘焙香气。' },
    { name: '栗绒焦糖子', theme: '秋冬暖意', season: '冬季', colors: ['#FDC441', '#EF852F', '#823D32', '#E3CFB4'], desc: '温暖的橘黄色系，像冬日里的一杯热饮。' },
    { name: '芦汀初雪', theme: '国风清冷', season: '冬季', colors: ['#A1C1A1', '#8BA995', '#D2C4B2', '#DFDAD3'], desc: '低饱和绿与雪松棕，展现中式清冷美感' },
    // ===== 新增：四季百搭基础极简色系 =====
    { name: '极简黑白灰', theme: '经典百搭', season: '四季', colors: ['#1A1A1A', '#808080', '#D3D3D3', '#FFFFFF'], desc: '最经典的极简配色，无论什么天气都能闭眼穿。' },
    { name: '高级冷灰调', theme: '清冷极简', season: '四季', colors: ['#F5F5F5', '#B0B0B0', '#5F6368', '#202124'], desc: '低饱和度的冷灰色阶梯，自带清冷高级感。' },
    { name: '温润燕麦色', theme: '温柔中性', season: '四季', colors: ['#E8DCC8', '#D1C4B1', '#A89A86', '#7C6F61'], desc: '比纯白多一分温暖的燕麦色，适合打造温柔中性风。' },
    { name: '法式黑白碰撞', theme: '复古极简', season: '四季', colors: ['#000000', '#FFFFFF', '#B22222', '#F5F5DC'], desc: '经典黑白加上一抹复古红点缀，永不过时的法式优雅。' },
    { name: '极简灰蓝', theme: '静谧理性', season: '四季', colors: ['#FAFAFA', '#D0D6DD', '#6C7A89', '#2C3E50'], desc: '理性的灰蓝色调，非常适合职场通勤与日常穿搭。' },
    { name: '纯净黑咖', theme: '利落干练', season: '四季', colors: ['#2B2B2B', '#564F4A', '#A9A9A9', '#E5E5E5'], desc: '黑咖与银灰的利落组合，尽显干练气质。' }
];
// ==================== 体质偏移 ====================
const BODY_OFFSET = {
    cold: -3,
    normal: 0,
    hot: +3
};
// ==================== 引擎核心 ====================
const outfitEngine = {
    // 生成今日穿搭
    generateOutfit(temp, gender = 'female', bodyType = 'normal') {
        const adjustedTemp = temp + (BODY_OFFSET[bodyType] || 0);
        const range = this._matchTempRange(adjustedTemp);
        const db = OUTFIT_DB[gender]?.[range];
        if (!db) return this._getFallbackOutfit(gender);
        const items = db.items
            .filter(item => item.name !== null)
            .map(item => ({
                ...item,
                bgColor: ITEM_BG_COLORS[item.type] || '#f0f0f0'
            }));
        // 取第一个风格对应的颜色文字
        const firstStyle = db.styles[0];
        const colorText = STYLE_FIX_COLOR_NAME[firstStyle] ?? '大地色系';
        return {
            id: `${gender}_${range}_${Date.now()}`,
            temp: temp,
            adjustedTemp: adjustedTemp,
            items: items,
            styles: db.styles,
            colors: [colorText], // 只输出文字字符串，不输出对象、不输出色值
            warnings: this._generateWarnings(temp),
            timestamp: Date.now()
        };
    },
    // 生成多套搭配
    generateMultipleOutfits(temp, gender = 'female', bodyType = 'normal', count = 3) {
        const adjustedTemp = temp + (BODY_OFFSET[bodyType] || 0);
        const range = this._matchTempRange(adjustedTemp);
        const db = OUTFIT_DB[gender]?.[range];
        if (!db) return [];
        const outfits = [];
        const styleList = db.styles.slice(0, count);
        styleList.forEach((style, index) => {
            const items = getItemsByStyle(db, style).map(item => ({
                ...item,
                bgColor: ITEM_BG_COLORS[item.type] || '#f0f0f0'
            }));
            // 每套风格输出对应的颜色【文字】，不需要色值对象
            const colorText = STYLE_FIX_COLOR_NAME[style] ?? '大地色系';
            outfits.push({
                id: `${gender}_${range}_style${index}_${Date.now()}`,
                style: style,
                category: STYLE_CATEGORY_MAP[style],
                items: items,
                colors: [colorText], // 数组内是普通字符串，如["大地色系"]
                temp: temp,
                isFavorite: false
            });
        });
        return outfits;
    },
    // 根据当前月份（季节）与温度，随机推荐 5 套配色
    recommendColors(temp) {
        // 1. 获取当前月份并判断季节
        const month = new Date().getMonth() + 1;
        let currentSeason = '春季';
        if (month >= 3 && month <= 5) currentSeason = '春季';
        else if (month >= 6 && month <= 8) currentSeason = '夏季';
        else if (month >= 9 && month <= 11) currentSeason = '秋季';
        else currentSeason = '冬季';

        // 2. 严格过滤出属于当前季节的配色
        let seasonPool = COLOR_PALETTES.filter(item => item.season === currentSeason);

        // 3. 极端温度微调（增加人性化逻辑）
        if (temp > 28) {
            // 极其炎热时，去掉看着厚重的深色系
            seasonPool = seasonPool.filter(c => c.theme !== '美拉德风' && c.theme !== '浓郁费尔岛');
        } else if (temp < 0) {
            // 零下时，去掉看着清冷的色系
            seasonPool = seasonPool.filter(c => c.name !== '薄荷曼波' && c.name !== '芦汀初雪');
        }

        // 4. 【核心】将符合条件的数组随机打乱，然后截取前 5 套！
        let shuffled = seasonPool.sort(() => 0.5 - Math.random());
        return shuffled.slice(0, 5);
    },
    getAllColorPalettes() {
        return COLOR_PALETTES;
    },
    _matchTempRange(temp) {
        if (temp <= -10) return 'below_neg10';
        if (temp <= 0) return 'neg10_0';
        if (temp <= 5) return '0_5';
        if (temp <= 10) return '5_10';
        if (temp <= 15) return '10_15';
        if (temp <= 20) return '15_20';
        if (temp <= 25) return '20_25';
        if (temp <= 30) return '25_30';
        return '30_40';
    },
    _generateWarnings(temp) {
        const warnings = [];
        if (temp <= -10) warnings.push({ type: 'cold', level: 'danger', message: '严寒天气，尽量减少外出，注意防冻防滑' });
        else if (temp <= 0) warnings.push({ type: 'cold', level: 'danger', message: '零下天气，注意防寒防滑' });
        else if (temp < 5) warnings.push({ type: 'cold', level: 'danger', message: '极寒天气，注意防寒保暖' });
        else if (temp < 10) warnings.push({ type: 'cold', level: 'warning', message: '气温较低，注意保暖' });
        if (temp > 35) warnings.push({ type: 'hot', level: 'danger', message: '高温预警，避免户外活动' });
        else if (temp > 30) warnings.push({ type: 'hot', level: 'warning', message: '天气炎热，注意防晒补水' });
        return warnings;
    },
    _getFallbackOutfit(gender) {
        //兜底输出颜色文字
        const colorText = STYLE_FIX_COLOR_NAME['休闲'] ?? '大地色系';
        return {
            id: `fallback_${Date.now()}`,
            temp: 20,
            items: [
                { type: 'top', name: 'T恤', icon: '👕', warmth: 1, bgColor: ITEM_BG_COLORS.top },
                { type: 'bottom', name: '牛仔裤', icon: '👖', warmth: 2, bgColor: ITEM_BG_COLORS.bottom }
            ],
            styles: ['休闲'],
            colors: [colorText],
            warnings: [],
            timestamp: Date.now()
        };
    }
};

module.exports = outfitEngine;