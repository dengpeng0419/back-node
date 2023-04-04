var express = require("express");
var moment = require("moment");
var router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require("../common/auth");

function guid () {
  return 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

router.get("/getRouters", forwardAuthenticated, (req, res) => {
  const list = [
    {
      name: "System",
      path: "/system",
      hidden: false,
      redirect: "noRedirect",
      component: "Layout",
      alwaysShow: true,
      meta: {
        title: "系统管理",
        icon: "system",
        noCache: false,
        link: null,
      },
      children: [
        // {
        //   name: "User",
        //   path: "user",
        //   hidden: false,
        //   component: "system/user/index",
        //   meta: {
        //     title: "用户管理",
        //     icon: "user",
        //     noCache: false,
        //     link: null,
        //   },
        // },
        {
          name: "Users",
          path: "users",
          hidden: false,
          component: "system/users/index",
          meta: {
            title: "用户管理",
            icon: "user",
            noCache: false,
            link: null,
          },
        },
        {
          name: 'Products',
          icon: 'PartitionOutlined',
          path: 'products',
          hidden: false,
          component: 'system/products/index',
          // access: 'authorize',
          // wrappers: ['@/components/KeepAlive'],
          meta: {
            title: "商品管理",
            icon: "PartitionOutlined",
            noCache: false,
            link: null,
          },
        },
        // {
        //   name: "Role",
        //   path: "role",
        //   hidden: false,
        //   component: "system/role/index",
        //   meta: {
        //     title: "角色管理",
        //     icon: "peoples",
        //     noCache: false,
        //     link: null,
        //   },
        // },
        // {
        //   name: "Menu",
        //   path: "menu",
        //   hidden: false,
        //   component: "system/menu/index",
        //   meta: {
        //     title: "菜单管理",
        //     icon: "tree-table",
        //     noCache: false,
        //     link: null,
        //   },
        // },
        // {
        //   name: "Dept",
        //   path: "dept",
        //   hidden: false,
        //   component: "system/dept/index",
        //   meta: {
        //     title: "部门管理",
        //     icon: "tree",
        //     noCache: false,
        //     link: null,
        //   },
        // },
        // {
        //   name: "Post",
        //   path: "post",
        //   hidden: false,
        //   component: "system/post/index",
        //   meta: {
        //     title: "岗位管理",
        //     icon: "post",
        //     noCache: false,
        //     link: null,
        //   },
        // },
        // {
        //   name: "Dict",
        //   path: "dict",
        //   hidden: false,
        //   component: "system/dict/index",
        //   meta: {
        //     title: "字典管理",
        //     icon: "dict",
        //     noCache: false,
        //     link: null,
        //   },
        // },
        // {
        //   name: "Config",
        //   path: "config",
        //   hidden: false,
        //   component: "system/config/index",
        //   meta: {
        //     title: "参数设置",
        //     icon: "edit",
        //     noCache: false,
        //     link: null,
        //   },
        // },
        // {
        //   name: "Notice",
        //   path: "notice",
        //   hidden: false,
        //   component: "system/notice/index",
        //   meta: {
        //     title: "通知公告",
        //     icon: "message",
        //     noCache: false,
        //     link: null,
        //   },
        // },
        // {
        //   name: "Log",
        //   path: "log",
        //   hidden: false,
        //   redirect: "noRedirect",
        //   component: "ParentView",
        //   alwaysShow: true,
        //   meta: {
        //     title: "日志管理",
        //     icon: "log",
        //     noCache: false,
        //     link: null,
        //   },
        //   children: [
        //     {
        //       name: "Operlog",
        //       path: "operlog",
        //       hidden: false,
        //       component: "monitor/operlog/index",
        //       meta: {
        //         title: "操作日志",
        //         icon: "form",
        //         noCache: false,
        //         link: null,
        //       },
        //     },
        //     {
        //       name: "Logininfor",
        //       path: "logininfor",
        //       hidden: false,
        //       component: "monitor/logininfor/index",
        //       meta: {
        //         title: "登录日志",
        //         icon: "logininfor",
        //         noCache: false,
        //         link: null,
        //       },
        //     },
        //   ],
        // },
      ],
    },
    {
      name: 'config',
      path: "/config",
      hidden: false,
      redirect: "noRedirect",
      component: "Layout",
      alwaysShow: true,
      meta: {
        title: "系统配置",
        icon: "config",
        noCache: false,
        link: null,
      },
      children: [
        {
          name: "Color",
          path: "color",
          hidden: false,
          component: "config/color/index",
          meta: {
            title: "颜色参数",
            icon: "color",
            noCache: false,
            link: null,
          },
        },
      ]
    },
    {
      name: "Monitor",
      path: "/monitor",
      hidden: false,
      redirect: "noRedirect",
      component: "Layout",
      alwaysShow: true,
      meta: {
        title: "系统监控",
        icon: "monitor",
        noCache: false,
        link: null,
      },
      // children: [
      //   {
      //     name: "Online",
      //     path: "online",
      //     hidden: false,
      //     component: "monitor/online/index",
      //     meta: {
      //       title: "在线用户",
      //       icon: "online",
      //       noCache: false,
      //       link: null,
      //     },
      //   },
      //   {
      //     name: "Job",
      //     path: "job",
      //     hidden: false,
      //     component: "monitor/job/index",
      //     meta: {
      //       title: "定时任务",
      //       icon: "job",
      //       noCache: false,
      //       link: null,
      //     },
      //   },
      //   {
      //     name: "Druid",
      //     path: "druid",
      //     hidden: false,
      //     component: "monitor/druid/index",
      //     meta: {
      //       title: "数据监控",
      //       icon: "druid",
      //       noCache: false,
      //       link: null,
      //     },
      //   },
      //   {
      //     name: "Server",
      //     path: "server",
      //     hidden: false,
      //     component: "monitor/server/index",
      //     meta: {
      //       title: "服务监控",
      //       icon: "server",
      //       noCache: false,
      //       link: null,
      //     },
      //   },
      //   {
      //     name: "Cache",
      //     path: "cache",
      //     hidden: false,
      //     component: "monitor/cache/index",
      //     meta: {
      //       title: "缓存监控",
      //       icon: "redis",
      //       noCache: false,
      //       link: null,
      //     },
      //   },
      // ],
    },
    // {
    //   name: "Tool",
    //   path: "/tool",
    //   hidden: false,
    //   redirect: "noRedirect",
    //   component: "Layout",
    //   alwaysShow: true,
    //   meta: {
    //     title: "系统工具",
    //     icon: "tool",
    //     noCache: false,
    //     link: null,
    //   },
    //   children: [
    //     {
    //       name: "Build",
    //       path: "build",
    //       hidden: false,
    //       component: "tool/build/index",
    //       meta: {
    //         title: "表单构建",
    //         icon: "build",
    //         noCache: false,
    //         link: null,
    //       },
    //     },
    //     {
    //       name: "Gen",
    //       path: "gen",
    //       hidden: false,
    //       component: "tool/gen/index",
    //       meta: {
    //         title: "代码生成",
    //         icon: "code",
    //         noCache: false,
    //         link: null,
    //       },
    //     },
    //     {
    //       name: "Swagger",
    //       path: "swagger",
    //       hidden: false,
    //       component: "tool/swagger/index",
    //       meta: {
    //         title: "系统接口",
    //         icon: "swagger",
    //         noCache: false,
    //         link: null,
    //       },
    //     },
    //   ],
    // },
  ];
  res.send({
    code: 0,
    data: list,
    msg: "",
  });
});

router.get("/info", forwardAuthenticated, (req, res) => {
  res.send({
    websocket: true,
    origins: ["*:*"],
    cookie_needed: false,
    entropy: 1349661977,
  });
});

router.get("/fake_analysis_chart_data", forwardAuthenticated, (req, res) => {
  res.send({
    data: {
      visitData: [
        {
          x: "2023-03-20",
          y: 7,
        },
        {
          x: "2023-03-21",
          y: 5,
        },
        {
          x: "2023-03-22",
          y: 4,
        },
        {
          x: "2023-03-23",
          y: 2,
        },
        {
          x: "2023-03-24",
          y: 4,
        },
        {
          x: "2023-03-25",
          y: 7,
        },
        {
          x: "2023-03-26",
          y: 5,
        },
        {
          x: "2023-03-27",
          y: 6,
        },
        {
          x: "2023-03-28",
          y: 5,
        },
        {
          x: "2023-03-29",
          y: 9,
        },
        {
          x: "2023-03-30",
          y: 6,
        },
        {
          x: "2023-03-31",
          y: 3,
        },
        {
          x: "2023-04-01",
          y: 1,
        },
        {
          x: "2023-04-02",
          y: 5,
        },
        {
          x: "2023-04-03",
          y: 3,
        },
        {
          x: "2023-04-04",
          y: 6,
        },
        {
          x: "2023-04-05",
          y: 5,
        },
      ],
      visitData2: [
        {
          x: "2023-03-20",
          y: 1,
        },
        {
          x: "2023-03-21",
          y: 6,
        },
        {
          x: "2023-03-22",
          y: 4,
        },
        {
          x: "2023-03-23",
          y: 8,
        },
        {
          x: "2023-03-24",
          y: 3,
        },
        {
          x: "2023-03-25",
          y: 7,
        },
        {
          x: "2023-03-26",
          y: 2,
        },
      ],
      salesData: [
        {
          x: "1月",
          y: 826,
        },
        {
          x: "2月",
          y: 1083,
        },
        {
          x: "3月",
          y: 1148,
        },
        {
          x: "4月",
          y: 1033,
        },
        {
          x: "5月",
          y: 283,
        },
        {
          x: "6月",
          y: 287,
        },
        {
          x: "7月",
          y: 627,
        },
        {
          x: "8月",
          y: 1131,
        },
        {
          x: "9月",
          y: 415,
        },
        {
          x: "10月",
          y: 973,
        },
        {
          x: "11月",
          y: 482,
        },
        {
          x: "12月",
          y: 686,
        },
      ],
      searchData: [
        {
          index: 1,
          keyword: "搜索关键词-0",
          count: 790,
          range: 49,
          status: 1,
        },
        {
          index: 2,
          keyword: "搜索关键词-1",
          count: 318,
          range: 77,
          status: 0,
        },
        {
          index: 3,
          keyword: "搜索关键词-2",
          count: 301,
          range: 76,
          status: 1,
        },
        {
          index: 4,
          keyword: "搜索关键词-3",
          count: 393,
          range: 40,
          status: 0,
        },
        {
          index: 5,
          keyword: "搜索关键词-4",
          count: 898,
          range: 9,
          status: 1,
        },
        {
          index: 6,
          keyword: "搜索关键词-5",
          count: 303,
          range: 42,
          status: 0,
        },
        {
          index: 7,
          keyword: "搜索关键词-6",
          count: 671,
          range: 31,
          status: 1,
        },
        {
          index: 8,
          keyword: "搜索关键词-7",
          count: 266,
          range: 69,
          status: 1,
        },
        {
          index: 9,
          keyword: "搜索关键词-8",
          count: 811,
          range: 69,
          status: 1,
        },
        {
          index: 10,
          keyword: "搜索关键词-9",
          count: 767,
          range: 88,
          status: 0,
        },
        {
          index: 11,
          keyword: "搜索关键词-10",
          count: 464,
          range: 22,
          status: 0,
        },
        {
          index: 12,
          keyword: "搜索关键词-11",
          count: 150,
          range: 41,
          status: 1,
        },
        {
          index: 13,
          keyword: "搜索关键词-12",
          count: 111,
          range: 55,
          status: 0,
        },
        {
          index: 14,
          keyword: "搜索关键词-13",
          count: 953,
          range: 26,
          status: 0,
        },
        {
          index: 15,
          keyword: "搜索关键词-14",
          count: 458,
          range: 19,
          status: 1,
        },
        {
          index: 16,
          keyword: "搜索关键词-15",
          count: 326,
          range: 44,
          status: 0,
        },
        {
          index: 17,
          keyword: "搜索关键词-16",
          count: 611,
          range: 94,
          status: 0,
        },
        {
          index: 18,
          keyword: "搜索关键词-17",
          count: 159,
          range: 33,
          status: 1,
        },
        {
          index: 19,
          keyword: "搜索关键词-18",
          count: 700,
          range: 7,
          status: 0,
        },
        {
          index: 20,
          keyword: "搜索关键词-19",
          count: 913,
          range: 53,
          status: 1,
        },
        {
          index: 21,
          keyword: "搜索关键词-20",
          count: 145,
          range: 13,
          status: 1,
        },
        {
          index: 22,
          keyword: "搜索关键词-21",
          count: 122,
          range: 45,
          status: 1,
        },
        {
          index: 23,
          keyword: "搜索关键词-22",
          count: 595,
          range: 97,
          status: 1,
        },
        {
          index: 24,
          keyword: "搜索关键词-23",
          count: 318,
          range: 38,
          status: 0,
        },
        {
          index: 25,
          keyword: "搜索关键词-24",
          count: 198,
          range: 78,
          status: 1,
        },
        {
          index: 26,
          keyword: "搜索关键词-25",
          count: 238,
          range: 55,
          status: 1,
        },
        {
          index: 27,
          keyword: "搜索关键词-26",
          count: 154,
          range: 12,
          status: 0,
        },
        {
          index: 28,
          keyword: "搜索关键词-27",
          count: 60,
          range: 9,
          status: 1,
        },
        {
          index: 29,
          keyword: "搜索关键词-28",
          count: 324,
          range: 5,
          status: 1,
        },
        {
          index: 30,
          keyword: "搜索关键词-29",
          count: 584,
          range: 70,
          status: 0,
        },
        {
          index: 31,
          keyword: "搜索关键词-30",
          count: 365,
          range: 0,
          status: 0,
        },
        {
          index: 32,
          keyword: "搜索关键词-31",
          count: 882,
          range: 20,
          status: 0,
        },
        {
          index: 33,
          keyword: "搜索关键词-32",
          count: 573,
          range: 34,
          status: 1,
        },
        {
          index: 34,
          keyword: "搜索关键词-33",
          count: 334,
          range: 7,
          status: 1,
        },
        {
          index: 35,
          keyword: "搜索关键词-34",
          count: 448,
          range: 15,
          status: 1,
        },
        {
          index: 36,
          keyword: "搜索关键词-35",
          count: 725,
          range: 89,
          status: 0,
        },
        {
          index: 37,
          keyword: "搜索关键词-36",
          count: 734,
          range: 27,
          status: 1,
        },
        {
          index: 38,
          keyword: "搜索关键词-37",
          count: 794,
          range: 10,
          status: 0,
        },
        {
          index: 39,
          keyword: "搜索关键词-38",
          count: 898,
          range: 61,
          status: 0,
        },
        {
          index: 40,
          keyword: "搜索关键词-39",
          count: 515,
          range: 28,
          status: 0,
        },
        {
          index: 41,
          keyword: "搜索关键词-40",
          count: 646,
          range: 12,
          status: 1,
        },
        {
          index: 42,
          keyword: "搜索关键词-41",
          count: 920,
          range: 57,
          status: 0,
        },
        {
          index: 43,
          keyword: "搜索关键词-42",
          count: 48,
          range: 48,
          status: 0,
        },
        {
          index: 44,
          keyword: "搜索关键词-43",
          count: 193,
          range: 96,
          status: 0,
        },
        {
          index: 45,
          keyword: "搜索关键词-44",
          count: 311,
          range: 11,
          status: 0,
        },
        {
          index: 46,
          keyword: "搜索关键词-45",
          count: 336,
          range: 3,
          status: 1,
        },
        {
          index: 47,
          keyword: "搜索关键词-46",
          count: 949,
          range: 93,
          status: 1,
        },
        {
          index: 48,
          keyword: "搜索关键词-47",
          count: 249,
          range: 32,
          status: 1,
        },
        {
          index: 49,
          keyword: "搜索关键词-48",
          count: 261,
          range: 86,
          status: 0,
        },
        {
          index: 50,
          keyword: "搜索关键词-49",
          count: 765,
          range: 19,
          status: 0,
        },
      ],
      offlineData: [
        {
          name: "Stores 0",
          cvr: 0.1,
        },
        {
          name: "Stores 1",
          cvr: 0.2,
        },
        {
          name: "Stores 2",
          cvr: 0.6,
        },
        {
          name: "Stores 3",
          cvr: 0.6,
        },
        {
          name: "Stores 4",
          cvr: 0.9,
        },
        {
          name: "Stores 5",
          cvr: 0.1,
        },
        {
          name: "Stores 6",
          cvr: 0.4,
        },
        {
          name: "Stores 7",
          cvr: 0.6,
        },
        {
          name: "Stores 8",
          cvr: 0.3,
        },
        {
          name: "Stores 9",
          cvr: 0.5,
        },
      ],
      offlineChartData: [
        {
          date: "10:32",
          type: "客流量",
          value: 60,
        },
        {
          date: "10:32",
          type: "支付笔数",
          value: 30,
        },
        {
          date: "11:02",
          type: "客流量",
          value: 81,
        },
        {
          date: "11:02",
          type: "支付笔数",
          value: 15,
        },
        {
          date: "11:32",
          type: "客流量",
          value: 36,
        },
        {
          date: "11:32",
          type: "支付笔数",
          value: 33,
        },
        {
          date: "12:02",
          type: "客流量",
          value: 32,
        },
        {
          date: "12:02",
          type: "支付笔数",
          value: 109,
        },
        {
          date: "12:32",
          type: "客流量",
          value: 63,
        },
        {
          date: "12:32",
          type: "支付笔数",
          value: 28,
        },
        {
          date: "13:02",
          type: "客流量",
          value: 45,
        },
        {
          date: "13:02",
          type: "支付笔数",
          value: 26,
        },
        {
          date: "13:32",
          type: "客流量",
          value: 39,
        },
        {
          date: "13:32",
          type: "支付笔数",
          value: 32,
        },
        {
          date: "14:02",
          type: "客流量",
          value: 77,
        },
        {
          date: "14:02",
          type: "支付笔数",
          value: 13,
        },
        {
          date: "14:32",
          type: "客流量",
          value: 77,
        },
        {
          date: "14:32",
          type: "支付笔数",
          value: 48,
        },
        {
          date: "15:02",
          type: "客流量",
          value: 37,
        },
        {
          date: "15:02",
          type: "支付笔数",
          value: 83,
        },
        {
          date: "15:32",
          type: "客流量",
          value: 49,
        },
        {
          date: "15:32",
          type: "支付笔数",
          value: 75,
        },
        {
          date: "16:02",
          type: "客流量",
          value: 48,
        },
        {
          date: "16:02",
          type: "支付笔数",
          value: 17,
        },
        {
          date: "16:32",
          type: "客流量",
          value: 18,
        },
        {
          date: "16:32",
          type: "支付笔数",
          value: 70,
        },
        {
          date: "17:02",
          type: "客流量",
          value: 31,
        },
        {
          date: "17:02",
          type: "支付笔数",
          value: 32,
        },
        {
          date: "17:32",
          type: "客流量",
          value: 10,
        },
        {
          date: "17:32",
          type: "支付笔数",
          value: 17,
        },
        {
          date: "18:02",
          type: "客流量",
          value: 106,
        },
        {
          date: "18:02",
          type: "支付笔数",
          value: 76,
        },
        {
          date: "18:32",
          type: "客流量",
          value: 38,
        },
        {
          date: "18:32",
          type: "支付笔数",
          value: 63,
        },
        {
          date: "19:02",
          type: "客流量",
          value: 105,
        },
        {
          date: "19:02",
          type: "支付笔数",
          value: 59,
        },
        {
          date: "19:32",
          type: "客流量",
          value: 97,
        },
        {
          date: "19:32",
          type: "支付笔数",
          value: 17,
        },
        {
          date: "20:02",
          type: "客流量",
          value: 38,
        },
        {
          date: "20:02",
          type: "支付笔数",
          value: 106,
        },
      ],
      salesTypeData: [
        {
          x: "家用电器",
          y: 4544,
        },
        {
          x: "食用酒水",
          y: 3321,
        },
        {
          x: "个护健康",
          y: 3113,
        },
        {
          x: "服饰箱包",
          y: 2341,
        },
        {
          x: "母婴产品",
          y: 1231,
        },
        {
          x: "其他",
          y: 1231,
        },
      ],
      salesTypeDataOnline: [
        {
          x: "家用电器",
          y: 244,
        },
        {
          x: "食用酒水",
          y: 321,
        },
        {
          x: "个护健康",
          y: 311,
        },
        {
          x: "服饰箱包",
          y: 41,
        },
        {
          x: "母婴产品",
          y: 121,
        },
        {
          x: "其他",
          y: 111,
        },
      ],
      salesTypeDataOffline: [
        {
          x: "家用电器",
          y: 99,
        },
        {
          x: "食用酒水",
          y: 188,
        },
        {
          x: "个护健康",
          y: 344,
        },
        {
          x: "服饰箱包",
          y: 255,
        },
        {
          x: "其他",
          y: 65,
        },
      ],
      radarData: [
        {
          name: "个人",
          label: "引用",
          value: 10,
        },
        {
          name: "个人",
          label: "口碑",
          value: 8,
        },
        {
          name: "个人",
          label: "产量",
          value: 4,
        },
        {
          name: "个人",
          label: "贡献",
          value: 5,
        },
        {
          name: "个人",
          label: "热度",
          value: 7,
        },
        {
          name: "团队",
          label: "引用",
          value: 3,
        },
        {
          name: "团队",
          label: "口碑",
          value: 9,
        },
        {
          name: "团队",
          label: "产量",
          value: 6,
        },
        {
          name: "团队",
          label: "贡献",
          value: 3,
        },
        {
          name: "团队",
          label: "热度",
          value: 1,
        },
        {
          name: "部门",
          label: "引用",
          value: 4,
        },
        {
          name: "部门",
          label: "口碑",
          value: 1,
        },
        {
          name: "部门",
          label: "产量",
          value: 6,
        },
        {
          name: "部门",
          label: "贡献",
          value: 5,
        },
        {
          name: "部门",
          label: "热度",
          value: 7,
        },
      ],
    },
  });
});

router.get("/getInfo", forwardAuthenticated, (req, res) => {
  res.send({
    msg: "操作成功",
    code: 200,
    permissions: ["*:*:*"],
    roles: ["admin"],
    user: {
      searchValue: null,
      createBy: "admin",
      createTime: "2021-09-09 17:25:28",
      updateBy: null,
      updateTime: null,
      remark: "管理员",
      params: {},
      userId: 1,
      deptId: 103,
      userName: "admin",
      nickName: "若依",
      email: "ry@163.com",
      phonenumber: "15888888888",
      sex: "1",
      avatar: "/static/img/profile.473f5971.jpg",
      status: "0",
      delFlag: "0",
      loginIp: "61.140.198.155",
      loginDate: "2021-11-11T14:03:07.723+0800",
      dept: {
        searchValue: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
        remark: null,
        params: {},
        deptId: 103,
        parentId: 101,
        ancestors: null,
        deptName: "研发部门",
        orderNum: "1",
        leader: "若依",
        phone: null,
        email: null,
        status: "0",
        delFlag: null,
        parentName: null,
        children: [],
      },
      roles: [
        {
          searchValue: null,
          createBy: null,
          createTime: null,
          updateBy: null,
          updateTime: null,
          remark: null,
          params: {},
          roleId: 1,
          roleName: "超级管理员",
          roleKey: "admin",
          roleSort: "1",
          dataScope: "1",
          menuCheckStrictly: false,
          deptCheckStrictly: false,
          status: "0",
          delFlag: null,
          flag: false,
          menuIds: null,
          deptIds: null,
          admin: true,
        },
      ],
      roleIds: null,
      postIds: null,
      roleId: null,
      admin: true,
    },
  });
});

router.get("/system/dict/data/type/sys_user_sex", forwardAuthenticated, (req, res) => {
  res.send({"msg":"操作成功","code":200,"data":[{"createBy":"admin","createTime":"2023-02-03 11:12:41","updateBy":null,"updateTime":null,"remark":"性别男","dictCode":1,"dictSort":1,"dictLabel":"男","dictValue":"0","dictType":"sys_user_sex","cssClass":"","listClass":"","isDefault":"Y","status":"0","default":true},{"createBy":"admin","createTime":"2023-02-03 11:12:42","updateBy":null,"updateTime":null,"remark":"性别女","dictCode":2,"dictSort":2,"dictLabel":"女","dictValue":"1","dictType":"sys_user_sex","cssClass":"","listClass":"","isDefault":"N","status":"0","default":false},{"createBy":"admin","createTime":"2023-02-03 11:12:42","updateBy":null,"updateTime":null,"remark":"性别未知","dictCode":3,"dictSort":3,"dictLabel":"未知","dictValue":"2","dictType":"sys_user_sex","cssClass":"","listClass":"","isDefault":"N","status":"0","default":false}]});
});

router.get("/system/dict/data/type/sys_normal_disable", forwardAuthenticated, (req, res) => {
  res.send({"msg":"操作成功","code":200,"data":[{"createBy":"admin","createTime":"2023-02-03 11:12:43","updateBy":null,"updateTime":null,"remark":"正常状态","dictCode":6,"dictSort":1,"dictLabel":"正常","dictValue":"0","dictType":"sys_normal_disable","cssClass":"","listClass":"primary","isDefault":"Y","status":"0","default":true},{"createBy":"admin","createTime":"2023-02-03 11:12:43","updateBy":null,"updateTime":null,"remark":"停用状态","dictCode":7,"dictSort":2,"dictLabel":"停用","dictValue":"1","dictType":"sys_normal_disable","cssClass":"","listClass":"danger","isDefault":"N","status":"0","default":false}]});
});

router.get("/system/user/list", forwardAuthenticated, (req, res) => {
  res.send({"total":2,"rows":[{"createBy":"admin","createTime":"2023-02-03 11:11:26","updateBy":null,"updateTime":null,"remark":"管理员","userId":1,"deptId":103,"userName":"admin","nickName":"若依","email":"ry@163.com","phonenumber":"15888888888","sex":"1","avatar":"","password":null,"status":"0","delFlag":"0","loginIp":"221.226.5.142","loginDate":"2023-03-21T17:19:05.000+08:00","dept":{"createBy":null,"createTime":null,"updateBy":null,"updateTime":null,"remark":null,"deptId":103,"parentId":null,"ancestors":null,"deptName":"研发部门","orderNum":null,"leader":"若依","phone":null,"email":null,"status":null,"delFlag":null,"parentName":null,"children":[]},"roles":[],"roleIds":null,"postIds":null,"roleId":null,"admin":true},{"createBy":"admin","createTime":"2023-02-03 11:11:26","updateBy":null,"updateTime":null,"remark":"测试员","userId":2,"deptId":105,"userName":"ry","nickName":"若依","email":"ry@qq.com","phonenumber":"15666666666","sex":"1","avatar":"","password":null,"status":"0","delFlag":"0","loginIp":"119.57.169.162","loginDate":"2023-03-21T16:33:40.000+08:00","dept":{"createBy":null,"createTime":null,"updateBy":null,"updateTime":null,"remark":null,"deptId":105,"parentId":null,"ancestors":null,"deptName":"测试部门","orderNum":null,"leader":"若依","phone":null,"email":null,"status":null,"delFlag":null,"parentName":null,"children":[]},"roles":[],"roleIds":null,"postIds":null,"roleId":null,"admin":false}],"code":200,"msg":"查询成功"});
});

router.post("/logout", forwardAuthenticated, (req, res) => {
  res.send({ data: {}, success: true });
});

router.post("/login", forwardAuthenticated, (req, res) => {
  console.log(req.body)
  const { password, username, type } = req.body;
  if (password === "msfe@417" && username === "msfe") {
    res.send({
      code: 200,
      type,
      currentAuthority: "admin",
      token: guid(),
    });
    access = "admin";
    return;
  }
  // if (password === "123456" && username === "user") {
  //   res.send({
  //     code: 200,
  //     type,
  //     currentAuthority: "user",
  //     token: guid(),
  //   });
  //   access = "user";
  //   return;
  // }
  // if (type === "mobile") {
  //   res.send({
  //     code: 200,
  //     type,
  //     currentAuthority: "admin",
  //     token: guid(),
  //   });
  //   access = "admin";
  //   return;
  // }

  res.send({
    status: "error",
    msg: "error",
    type,
    currentAuthority: "guest",
  });
  access = "guest";
});

module.exports = router;
