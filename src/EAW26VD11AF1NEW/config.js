/* eslint-disable */
var config = {
  components: [
    {
      "name": "开关",
      "icon": "icon-kaiguan",
      "key": 0,
      "type": 1,
      "operable": true,
      "showType": 1,
      "value": '0'
    },
    {
      "name": "模式",
      "icon": "icon-shedingmoshi",
      "key": 1001,
      "type": 3,
      "showType": 1,
      "operable": true,
      "value": "-1",
      "enums": [{
        "key": "0",
        "value": "自动"
      },
        {
          "key": "1",
          "value": "制冷"
        },
        {
          "key": "2",
          "value": "除湿"
        },
        {
          "key": "3",
          "value": "制热"
        },
        {
          "key": "4",
          "value": "送风"
        }]
    },

    {
      "name": "风速",
      "icon": "icon-shedingfengsu",
      "key": 1002,
      "type": 3,
      "showType": 1,
      "operable": true,
      "value": "-1",
      "enums": [
        {
          "key": "0",
          "value": "自动",
          "disabled": true
        },
        {
          "key": "1",
          "value": "低风速",
          "disabled": true
        },
        {
          "key": "4",
          "value": "中低风",
          "disabled": true
        },
        {
          "key": "2",
          "value": "中风速",
          "disabled": true
        },
        {
          "key": "5",
          "value": "中高风",
          "disabled": true
        },
        {
          "key": "3",
          "value": "高风速",
          "disabled": true
        }]
    },
    {
      "name": "柔风",
      "icon": "icon-roufeng",
      "key": 13,
      "type": 1,
      "operable": true,
      "showType": 1,
      "value": '0'
    },
    {
      "name": "强劲",
      "icon": "icon-qianglikaiting",
      "key": 26,
      "type": 1,
      "operable": true,
      "showType": 1,
      "value": '0'
    },
    {
      "name": "静音",
      "icon": "icon-jingyin",
      "key": 33,
      "type": 1,
      "operable": true,
      "showType": 1,
      "value": '0'
    },
    {
      "name": "健康",
      "icon": "icon-jiankangfulizizhuangtai",
      "key": 2,
      "type": 1,
      "operable": true,
      "showType": 0,
      "value": '0'
    },
    {
      "name": "温度",
      "icon": "icon-shedingwendu",
      "key": 2001,
      "type": 2,
      "operable": true,
      "showType": 0,
      "minValue": 160,
      "maxValue": 310,
      "stepLen": 5,
      "rate": 1,
      "value": 160,
      "unitSymbol": "℃"
    },
    {
      "name": "上下扫风",
      "icon": "icon-shedingshangxiabaifeng",
      "key": 10,
      "type": 1,
      "operable": true,
      "showType": 1,
      "value": '0'
    },
    {
      "name": "左右扫风",
      "icon": "icon-shedingzuoyoubaifeng",
      "key": 11,
      "type": 1,
      "operable": true,
      "showType": 1,
      "value": '0'
    },
    {
      "name": "电加热",
      "icon": "icon-dianjiare",
      "key": 3,
      "type": 1,
      "operable": true,
      "showType": 1,
      "value": '0'
    },
    {
      "name": "节能",
      "icon": "icon-ECOjieneng",
      "key": 15,
      "type": 1,
      "operable": true,
      "showType": 1,
      "value": '0'
    },
    {
      "name": "睡眠",
      "icon": "icon-shuimian",
      "key": 17,
      "type": 1,
      "operable": true,
      "showType": 1,
      "value": '0'
    },
    {
      "name": "睡眠",
      "icon": "icon-shuimian",
      "key": 1004,
      "type": 3,
      "showType": 0,
      "operable": true,
      "value": "-1",
      "selected":false,
      "enums": [
        {
          "key": "0",
          "value": "关闭",
          "disabled": false
        },
        {
          "key": "1",
          "value": "标准",
          "disabled": false
        },
        {
          "key": "2",
          "value": "老人",
          "disabled": false
        },
        {
          "key": "4",
          "value": "儿童",
          "disabled": false
        }
      ]
    },
    {
      "name": "灯光",
      "icon": "icon-beijingdeng",
      "key": 14,
      "type": 1,
      "operable": true,
      "showType": 0,
      "value": '0'
    },
    {
      "name": "屏显",
      "icon": "icon-beijingdeng",
      "key": 38,
      "type": 1,
      "operable": true,
      "showType": 1,
      "value": '0'
    },
    {
      "name": "定时",
      "type": 5,
      "icon": "icon-yanshikaiguan",
      "showType": 1
    },
    {
      "name": "E享模式",
      "key": 39,
      "type": 1,
      "operable": true,
      "showType": 0,
      "value": '0'
    },
    {
      "name": "室温",
      "icon": "icon-shineihuanjingwendu",
      "key": 2003,
      "type": 2,
      "operable": true,
      "showType": 0,
      "minValue": 0,
      "maxValue": 60,
      "stepLen": 1,
      "value": 0,
      "unitSymbol": "℃"
    }
  ]
}
