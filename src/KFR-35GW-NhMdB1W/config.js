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
        "combinamap": [
            {
                value: 0,
                opt: [{1001:4},{1003:5}]
            },
            {
                min: 10,
                max: 10,
                opt: [{1001:4},{1003:5}]
            },
            {
                value: 'abc',
                opt: [{1001:4},{1003:5}]
            }
        ],
        "mutexmap": [
            {
                value: 0,
                key: 2001
            },
            {
                value: [10,100],
                key: 2001
            }
        ],
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
            "value": "制暖"
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
            "value": "自动"
        },
        {
            "key": "1",
            "value": "低风"
        },
        {
            "key": "2",
            "value": "中低风"
        },
        {
            "key": "3",
            "value": "中风"
        },
        {
            "key": "4",
            "value": "中高风"
        },
        {
            "key": "5",
            "value": "高风"
        },
        {
            "key": "6",
            "value": "强劲风"
        },
        {
            "key": "7",
            "value": "静音风"
        }]
    },
    {
        "name": "温度",
        "icon": "icon-shedingwendu",
        "key": 2001,
        "type": 2,
        "operable": true,
        "showType": 0,
        "minValue": 16,
        "maxValue": 30,
        "stepLen": 1,
        "rate": 1,
        "value": 16,
        "unitSymbol": "℃"
    },
    {
        "name": "上下扫风",
        "icon": "icon-shedingshangxiabaifeng",
        "key": 1006,
        "type": 3,
        "operable": true,
        "showType": 1,
        "value": '80',
        "enums": [
            {
                "key": "80",
                "value": "关"
            },
            {
                "key": "99",
                "value": "扫风"
            },
            {
                "key": "1",
                "value": "1号位置"
            },
            {
                "key": "2",
                "value": "2号位置"
            },
            {
                "key": "3",
                "value": "3号位置"
            },
            {
                "key": "4",
                "value": "4号位置"
            },
            {
                "key": "5",
                "value": "5号位置"
            }
        ]
    },
    {
        "name": "左右扫风",
        "icon": "icon-shedingzuoyoubaifeng",
        "key": 1007,
        "type": 3,
        "operable": true,
        "showType": 1,
        "value": '80',
        "enums": [
            {
                "key": "80",
                "value": "关"
            },
            {
                "key": "99",
                "value": "扫风"
            },
            {
                "key": "1",
                "value": "1号位置"
            },
            {
                "key": "2",
                "value": "2号位置"
            },
            {
                "key": "3",
                "value": "3号位置"
            },
            {
                "key": "4",
                "value": "4号位置"
            },
            {
                "key": "5",
                "value": "5号位置"
            }
        ]
    },
    {
        "name": "辅热",
        "icon": "icon-dianjiare",
        "key": 3,
        "type": 1,
        "operable": true,
        "showType": 1,
        "value": '0'
    },
    {
        "name": "灯光",
        "icon": "icon-beijingdeng",
        "key": 14,
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
        "name": "强力",
        "icon": "icon-qianglikaiting",
        "key": 26,
        "type": 1,
        "operable": true,
        "showType": 0,
        "value": '0'
    },
    {
        "name": "静音",
        "icon": "icon-jingyin",
        "key": 33,
        "type": 1,
        "operable": true,
        "showType": 0,
        "value": '0'
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