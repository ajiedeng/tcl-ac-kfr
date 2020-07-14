/* eslint-disable */
var config = {
    components: [
    {
        "name": "开关",
        "icon": "icon-kaiguan",
        "key": 0,
        "type": 1,
        "operable": true,
        "order": 7,
        "showType": 1,
        "value": '0'
    },
    {
        "name": "模式",
        "icon": "icon-shedingmoshi",
        "key": 1001,
        "type": 3,
        "order": 4,
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
        "name": "睡眠",
        "icon": "icon-shuimian",
        "key": 17,
        "type": 1,
        "order": 23,
        "showType": 1,
        "operable": true,
        "value": '0'
    },
    {
        "name": "定时",
        "type": 5,
        "icon": "icon-yanshikaiguan",
        "showType": 1
    },
    {
        "name": "风速",
        "icon": "icon-shedingfengsu",
        "key": 1002,
        "type": 3,
        "order": 5,
        "showType": 1,
        "operable": true,
        "value": "-1",
        "enums": [
        {
            "key": "0",
            "value": "自动"
        },
        {
            "key": "1",
            "value": "低风速"
        },
        {
            "key": "2",
            "value": "中风速"
        },
        {
            "key": "3",
            "value": "高风速"
        }]
    },
    {
        "name": "温度",
        "icon": "icon-shedingwendu",
        "key": 2001,
        "type": 2,
        "order": 45,
        "operable": true,
        "showType": 1,
        "minValue": 160,
        "maxValue": 320,
        "stepLen": 1,
        "rate": 0.1,
        "value": 160,
        "unitSymbol": "℃"
    },
    {
        "name": "电加热",
        "icon": "icon-dianjiare",
        "key": 3,
        "type": 1,
        "operable": true,
        "order": 10,
        "showType": 1,
        "value": '0'
    },
    {
        "name": "上下摆风",
        "icon": "icon-shedingshangxiabaifeng",
        "key": 10,
        "type": 1,
        "order": 17,
        "operable": true,
        "showType": 1,
        "value": '0'
    },
    {
        "name": "ECO",
        "icon": "icon-ECOjieneng",
        "key": 15,
        "operable": true,
        "type": 1,
        "order": 21,
        "showType": 1,
        "value": '0'
    },
    {
        "name": "强力",
        "icon": "icon-qianglikaiting",
        "key": 26,
        "type": 1,
        "order": 32,
        "operable": true,
        "showType": 1,
        "value": '0'
    },
    {
        "name": "灯光",
        "icon": "icon-beijingdeng",
        "key": 38,
        "type": 1,
        "operable": true,
        "order": 44,
        "showType": 0,
        "value": '0'
    },
    {
        "name": "室温",
        "icon": "icon-shineihuanjingwendu",
        "key": 2003,
        "type": 2,
        "order": 47,
        "operable": true,
        "showType": 0,
        "minValue": 0,
        "maxValue": 40,
        "stepLen": 1,
        "value": 0,
        "unitSymbol": "℃"
    }
    ]
}