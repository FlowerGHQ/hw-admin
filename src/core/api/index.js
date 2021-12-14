import Api from './base';
import Const from '../const'

let baseUrl = Const.NET.URL_POINT
/*
 * PostJson
 * GetJson
 * Post
 * Get
 */

const apiList = {
    Common: { // 公共
        login: ['PostJson', 'system/login'], // 账号登录
        logout: ['Post', 'system/logout'], // 账号登出

        emailCode: ['Post', 'common/email-verification-code-send'], // 发送邮箱验证码
        phoneCode: ['Post', 'common/phone-verification-code-send'], // 发送手机验证码
        userInfo: ['Get', 'system/info'], // 获取当前登录账号的账户信息
        migrate: ['Post', 'migrate/order'], // 获取当前登录账号的账户信息
    },
    Export: { // 导出
        templateExport: ['PostJson', 'item-media-package/export'],
    },
    Account: {
        list: ['PostJson', 'account/list'], // 账户列表
        save: ['PostJson', 'account/save' ], // 账号新增
        profile: ['GET', 'account/profile' ], // 账户详情
        update: ['PostJson', 'account/update'], //  账号修改
        delete: ['PostJson', 'account/delete' ], // 账户删除
        resetPwd: ['PostJson', 'account/resetPwd' ], // 重置密码
        statusUpdate: ['PostJson', 'account/status-update'], // 更新账户状态1=启用2=禁用
        roleAssign: ['PostJson','account/role-assign'],
    },
    AuthRole: {
        authTree: ['PostJson', 'auth/menu-list-tree'], // 权限树
        list: ['PostJson', 'auth/role-list'], // 角色列表
        save: ['PostJson', 'auth/role-save'], // 角色编辑
        menuList: ['PostJson', 'auth/menu-list'],
        menuSave: ['PostJson', 'auth/menu-save'],
        menuDelete: ['PostJson', 'auth/menu-delete'],
        treeList: ['PostJson', 'auth/menu-list-tree'],
        detail: ['PostJson', 'auth/role-detail'], // 角色详情
        delete: ['PostJson', 'auth/role-delete'], // 角色删除
        userMenu: ['PostJson', 'auth/user-menu'], // 角色删除
    },
    Dealers: { // 经销商
        list: ['PostJson', 'dealers/list'], // 列表
        save: ['PostJson', 'dealers/save'], // 编辑
        detail: ['PostJson', 'dealers/detail'], // 详情
        update: ['PostJson', 'dealers/update'], // 更新
        delete: ['PostJson', 'dealers/delete'], // 删除
    },

    Repair: { // 维修单
        list: ['PostJson', 'repair/list'], // 列表
        save: ['PostJson', 'repair/save'], // 列表
        update: ['PostJson', 'repair/update'], // 列表
        detail: ['PostJson', 'repair/detail'], // 工单详情
    },
    Item: { // 商品
        save: ['PostJson', 'item/save'],
        list: ['PostJson', 'item/list'],
        detail: ['PostJson', 'item/detail'],
        detele: ['PostJson', 'item/detele'],
    },
    ItemCategory: { // 商品分类
        list: ['PostJson', 'item-category/list'],
        tree: ['PostJson', 'item-category/tree'],
        save: ['PostJson', 'item-category/save'],
        update: ['PostJson', 'item-category/update'],
        delete: ['PostJson', 'item-category/delete'],
    },
    Warehouse: { // 仓库
        save: ['PostJson', 'warehouse/save'],
        update: ['PostJson', 'warehouse/update'], // 列表

        list: ['PostJson', 'warehouse/list'],
        detele: ['PostJson', 'warehouse/detele'],
    },
    ShopCart: { // 购物车
        save: ['PostJson', 'shopping-cart/save'],
        list: ['PostJson', 'shopping-cart/list'],
        clear: ['PostJson', 'shopping-cart/clear'],
        detail: ['GetJson', 'shopping-cart/detail'],
        remove: ['PostJson', 'shopping-cart/delete'],
    },
    Favorite: { // 收藏夹
        add: ['PostJson', 'favorite/create'],
        list: ['PostJson', 'favorite/list-user'],
        remove: ['PostJson', 'favorite/delete'],
    },
    Purchase: { // 采购订单
        list: ['PostJson', 'purchase-order/list'], // 采购订单列表
        cancel: ['PostJson', 'purchase-order/cancel'], // 取消采购订单
        create: ['PostJson', 'purchase-order/create'], // 创建采购订单
        detail: ['PostJson', 'purchase-order/detail'], // 采购订单详情
        detailByUid: ['PostJson', 'purchase-order/detail-uid'], // 采购订单详情

        itemList: ['PostJson', 'purchase-order-item/list'], // 采购订单明细列表
    }


};

export default new Api(baseUrl, apiList);

