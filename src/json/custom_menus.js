export default 
[
    {
        "icon": "iconfont icon-guanlizhongxin",
        "name": "摘要",
        "menuId":'0',
        "home":true,
        "url": "/custom/abstract"
    },
    {
        "icon": "iconfont icon-user",
        "name": "证件照",
        "menuId":'1',
        'opened':false,
        "menus": [
            {
                "name": "证件照管理",
                "url": "/custom/idphoto"
            },
            {
                "name": "底色管理",
                "url": "/custom/background"
            },
            
            {
                "name": "分类管理",
                "url": "/custom/category"
            },
            {
                "name": "历史记录",
                "url": "/custom/history"
            }
        ]
    }
]