<template>
    <div id="mall-header">
        <div id="header-item">
            <div class="header-content content">
                <div class="text">
                    <span>{{ $t('mall.hi') }}，{{ user.name }}，{{ $t('mall.welcome') }}</span>
                </div>
                <div class="header-right">
                    <!-- 头像 -->
                    <span class="header-menu tab-animate">
                        <a-dropdown :trigger="['click']" overlay-class-name='action-menu' placement="bottom" @visibleChange="avatarDropDownChange">
                            <span class="menu-item-dropdown">
                                <span class="header-menu-img">
                                    <a-avatar :src="$Util.imageFilter(user.avatar, 3)" :size="18" alt="user" />
                                </span>
                                <span class="header-menu-text">{{ user.name }}</span>
                                <svg-icon icon-class="header-expand-icon" :class-name="avatarShow ? 'mt-triangle-icon expand' : 'mt-triangle-icon'" />
                            </span>
                            <template #overlay>
                                <a-menu style="text-align: center;">
                                    <a-menu-item @click="handleEditShow">
                                        <a class="menu_text">{{ $t('n.password') }}</a>
                                        <a-modal v-model:visible="passShow" :title="$t('n.password')"
                                            class="password-edit-modal" :after-close="handleEditClose">
                                            <div class="form-title">
                                                <div class="form-item required">
                                                    <div class="key">{{ $t('n.old') }}:</div>
                                                    <div class="value">
                                                        <a-input-password :placeholder="$t('def.input')"
                                                            v-model:value="form.old_password" />
                                                    </div>
                                                </div>
                                                <div class="form-item required">
                                                    <div class="key">{{ $t('n.new') }}:</div>
                                                    <div class="value">
                                                        <a-input-password v-model:value="form.password"
                                                            :placeholder="$t('def.input')" />
                                                    </div>
                                                </div>
                                                <div class="form-item required">
                                                    <div class="key">{{ $t('n.double') }}:</div>
                                                    <div class="value">
                                                        <a-input-password v-model:value="form.new_password"
                                                            :placeholder="$t('n.double')" />
                                                    </div>
                                                </div>
                                            </div>
                                            <template #footer>
                                                <a-button key="back" @click="handleEditSubmit" type="primary">{{ $t('def.sure')
                                                }}</a-button>
                                                <a-button @click="passShow = false">{{ $t('def.cancel') }}</a-button>
                                            </template>
                                        </a-modal>
                                    </a-menu-item>
                                    <a-menu-divider class="menu_divider" />
                                    <a-menu-item @click="routerChange('/login')" v-if="user_type_list.length > 1">
                                        <a class="menu_text">{{ $t('mall.switch_identity') }}</a>
                                    </a-menu-item>
                                    <a-menu-divider class="menu_divider" v-if="user_type_list.length > 1" />
                                    <a-menu-item @click="handleLogout">
                                        <a class="menu_text">{{ $t('n.exit') }}</a>
                                    </a-menu-item>
                                </a-menu>
                            </template>
                        </a-dropdown>
                    </span>
                    <!-- 收藏夹 -->
                    <span class="header-menu tab-animate" @click="routerChange('/purchase/item-collect')">
                        <span class="header-menu-img">
                            <a-avatar :src="getHeaderSrc('favorites', 'png')" :size="18" alt="user" />
                        </span>
                        <span class="header-menu-text">{{ $t('mall.Favorites') }}</span>
                    </span>
                    <!-- 订单 -->
                    <span class="header-menu tab-animate" @click="routerChange('/purchase/purchase-order-self')">
                        <span class="header-menu-img">
                            <a-avatar :src="getHeaderSrc('orders', 'png')" :size="18" alt="user" />
                        </span>
                        <span class="header-menu-text">{{ $t('mall.Orders') }}</span>
                    </span>
                    <!-- 更多 -->
                    <span class="header-menu tab-animate">
                        <a-dropdown :trigger="['click']" overlay-class-name='action-menu' placement="bottom" @visibleChange="moreDropDownChange">
                            <div class="menu-item-dropdown" @click.prevent>
                                <span class="header-menu-img">
                                    <a-avatar :src="getHeaderSrc('more', 'png')" :size="18" alt="user" />
                                </span>
                                <span class="header-menu-text">{{ $t('mall.more_features') }}</span>
                                <svg-icon icon-class="header-expand-icon" :class-name="moreShow ? 'mt-triangle-icon expand' : 'mt-triangle-icon'" />
                            </div>
                            <template #overlay>
                                <a-menu style="text-align: center;">
                                        <a-menu-item :key="item.key" v-for="(item, index) in menuList" @click="routerChange(item.path)">
                                            <a class="menu_text">{{ $t(`router.${item.nameLang}`) }}</a>
                                            <a-menu-divider class="menu_divider" v-if="index < menuList.length - 1" />
                                        </a-menu-item>
                                </a-menu>
                            </template>
                        </a-dropdown>
                    </span>
                    <!-- 语言切换 -->
                    <span class="header-menu tab-animate">
                        <a-dropdown :trigger="['click']" overlay-class-name='action-menu' placement="bottom" @visibleChange="langDropDownChange">
                            <div class="menu-item-dropdown" @click.prevent>
                                <svg-icon icon-class="header-lang-icon" class-name="mt-user-icon" />
                                <span class="mt-header-lang-text">{{ currentAreaType }}</span>
                                <svg-icon icon-class="header-expand-icon" :class-name="langShow ? 'mt-triangle-icon expand' : 'mt-triangle-icon'" />
                            </div>
                            <template #overlay>
                                <a-menu style="bottom: 0px; position: relative;">
                                    <a-menu-item key="0" @click="handleLangSwitch('en')">
                                        <a class="menu_text">EN</a>
                                    </a-menu-item>
                                    <a-menu-divider class="menu_divider" />
                                    <a-menu-item key="1" @click="handleLangSwitch('zh')">
                                        <a class="menu_text">中文</a>
                                    </a-menu-item>
                                </a-menu>
                            </template>
                        </a-dropdown>
                    </span>
                </div>
            </div>
        </div>
        <div id="search">
            <div class="search-content content">
                <img class="logo-img" :src="getHeaderSrc('logo', 'png')" @click="routerChange('/mall/index')" />
                <div class="search-input">
                    <input type="text" v-model="searchKey" :placeholder="$t('mall.search_placeholder')" @keyup.enter="search(searchKey)">
                    <div @click="search(searchKey)">
                        <my-button type="primary">
                            <svg-icon icon-class="header-search-icon" class-name="header-search-icon" />
                            {{ $t('purchase.search') }}
                        </my-button>
                    </div>
                </div>
                <div class="bag" @click="routerChange('/purchase/item-collect')">
                    <a-badge :count="shopCartNum" :overflowCount="999" :offset="[-6, -2]">
                        <svg-icon icon-class="header-bag-icon" class-name="header-bag-icon" />
                        <svg-icon icon-class="car-icon" class-name="car-icon" />
                    </a-badge>
                    <span class="bag-text">{{ $t('mall.bag') }}</span>
                </div>
            </div>
        </div>
        <div id="menu">
            <div class="menu-content content">
                <!-- 整车 -->
                <span class="menu-item tab-animate">
                    <span class="menu-item-text">{{ $t('mall.vehicle_models') }}</span>
                </span>
                <!-- 配件 -->
                <span class="menu-item tab-animate">
                    <a-dropdown :trigger="['click']" overlay-class-name='action-menu' placement="bottom" @visibleChange="sparepartsDropDownChange">
                        <div class="menu-item-dropdown" @click.prevent>
                            <span class="menu-item-text">{{ $t('mall.spareparts') }}</span>
                            <svg-icon icon-class="header-expand-icon" :class-name="accessoriesShow ? 'mt-triangle-icon expand' : 'mt-triangle-icon'" />
                        </div>
                        <!-- <template #overlay>
                            <a-menu style="text-align: center;">
                                <a-menu-item :key="item.key" v-for="(item, index) in accessoriesMenuList" @click="routerChange(item.path)">
                                    <a class="menu_text">{{ $t(`router.${item.nameLang}`) }}</a>
                                    <a-menu-divider class="menu_divider" />
                                </a-menu-item>
                            </a-menu>
                        </template> -->
                    </a-dropdown>
                </span>
                <!-- 周边产品 -->
                <span class="menu-item tab-animate">
                    <span class="menu-item-text">{{ $t('mall.peripheral_products') }}</span>
                </span>
                <!-- 广宣品 -->
                <span class="menu-item tab-animate">
                    <span class="menu-item-text">{{ $t('mall.promotional_products') }}</span>
                </span>
            </div>
        </div>
    </div>
</template>
    
<script>
import Core from '@/core';
import SvgIcon from "@/components/SvgIcon/index.vue";
import MyButton from '@/components/common/MyButton.vue';

const headerModules = import.meta.globEager("@/assets/images/mall/header/*");

export default {
    components: {
        SvgIcon,
        MyButton
    },
    data() {
        return {
            Core,
            currentAreaType: '',
            avatarShow: false,
            moreShow: false,
            langShow: false,
            accessoriesShow: false,
            user: Core.Data.getUser() || {},
            passShow: false,
            form: {
                id: '',
                password: '',
                new_password: '',
                old_password: '',
            },
            menuList: Core.Const.LOGINMALL.HEADERMENU,
            accessoriesMenuList: Core.Const.LOGINMALL.HEADERACCESMENU,
            searchKey: '',
            searchLoading: false,
            user_type_list: []
        };
    },
    computed: {
        shopCartNum() {
            return this.$store.state.shopCartNum
        },
        mallSearchKey() {
            
            return this.$store.state.mallSearchKey
        }
    },
    watch: {
        mallSearchKey(newV) {
            this.searchKey = newV
        }
    },
    created() {
        const lang = Core.Data.getLang()
        if (lang === "" || lang === null){
            Core.Data.setLang("zh")
        }
        this.handleLangSwitch(Core.Data.getLang())
        this.user_type_list = Core.Data.getUserTypeList();
    },
    mounted() {
        this.getShopCartList()
    },
    methods: {
        getHeaderSrc(name, type = 'png') {
            const path = `../../../../assets/images/mall/header/${name}.${type}`;
            return headerModules[path]?.default || '';
        },
        // 获取购物车商品数量
        getShopCartList() {
            Core.Api.ShopCart.list().then(res => {
                this.$store.commit('setShopCartNum', res.count)
            })
        },
        handleLangSwitch(lang) {
            this.$store.commit('switchLang', lang);
            this.$i18n.locale = this.$store.state.lang;
            if (this.$i18n.locale === 'zh') {
                this.currentAreaType = '中文'
            } else {
                this.currentAreaType = this.$i18n.locale.toUpperCase();
            }
            this.langShow = false
        },
        // 头像下拉菜单
        avatarDropDownChange(e) {
            this.avatarShow = e
        },
        // 头像下拉菜单
        moreDropDownChange(e) {
            this.moreShow = e
        },
        // 语言下拉菜单是否展示
        langDropDownChange(e) {
            this.langShow = e
        },
        sparepartsDropDownChange(e) {
            this.sparepartsShow = e
        },
        // 修改密码
        handleEditShow() {
            this.passShow = true;
        },
        handleEditClose() {
            this.passShow = false;
            this.form = {
                id: '',
                password: '',
                new_password: '',
                old_password: '',
            }
        },
        // 退出登录
        handleLogout() {           
            this.$router.replace('/login');
            localStorage.clear()
            Core.Api.Common.logout()
        },
        handleEditSubmit() {
            let form = Core.Util.deepCopy(this.form)
            if (!form.old_password) {
                return this.$message.warning(this.$t('u.old_password'))
            }
            if (!form.password) {
                return this.$message.warning(this.$t('u.new_password'))
            }
            if (!form.new_password) {
                return this.$message.warning(this.$t('u.again'))
            }
            if (this.form.new_password !== this.form.password) {
                this.$message.warning(this.$t('u.not'))
                return
            }

            this.loading = true;
            Core.Api.Common.updatePwd(this.form).then(() => {
                this.$message.success(this.$t('pop_up.save_success'))
                this.handleEditClose();
            }).catch(err => {
                console.log('handleSubmit err:', err)
            })
        },
        search(key) {
            if (this.searchLoading) return;
            this.searchLoading = true
            if (!key) {
                this.searchLoading = false
                return this.$message.warning(this.$t('mall.search_placeholder'))
            }
            this.searchLoading = false
            this.$store.commit('setMallKey', key);
            this.routerChange('/mall/search', { key })
        },
        // 路由跳转
        routerChange(routeUrl, item = {}, type = 1) {
            switch (type) {
                case 1:
                    this.$router.push({
                        path: routeUrl,
                        query: item
                    })
                    break;
                default:
                    break;
            }
        },
    }
};
</script>
    
<style lang="less">
#mall-header{
    height: var(--header-h-pc-mall);
    overflow: hidden;
    color: #FFF;
    background: #FFF;
    .content {
        margin: 0 auto;
        width: 75%;
    }
    .header-content {
        .flex(space-between, center,  row);
        height: 51px;
    }
    .search-content {
        .flex(space-between, center,  row);
        height: 72px;
    }
    .menu-content {
        .flex(initial, center,  row);
        height: 60px;
        border-top: 1px solid #F5F5F5;
    }
    #header-item {
        background: #000;
        .text {
            > span {
                color: rgba(255, 255, 255, 0.7);
                font-family: Montserrat;
                font-size: 12px;
                font-style: normal;
                font-weight: 400;
                line-height: 16px; /* 133.333% */
            }
        }
        .header-right {
            .fcc();
            height: 100%;
            .header-menu {
                .fcc();
                cursor: pointer;
                margin-right: 48px;
                &:last-child {
                    margin-right: 0;
                }
                .header-menu-img {
                    .fcc();
                    margin-right: 8px;
                }
                .header-menu-text {
                    color: #FFF;
                    text-align: right;
                    font-family: Montserrat;
                    font-size: 12px;
                    font-style: normal;
                    font-weight: 500;
                    line-height: 150%; /* 18px */
                }
            }
        }
    }
    #search {
        .logo-img {
            width: 122px;
            cursor: pointer;
        }
        .search-input {
            .flex(initial, center,  row);
            flex: 1;
            padding: 0 80px;
            #my-button {
                height: 40px;
                width: 168px;
                .my-button-text {
                    .flex(initial, center,  row);
                }
            }
            > input {
                flex: 1;
                padding: 11px 24px;
                height: 40px;
                border: 1px solid #EEE;
                background: #F5F5F5;
                color: #333;
                font-family: Montserrat;
                font-size: 12px;
                font-style: normal;
                font-weight: 400;
                line-height: 150%; /* 18px */
                caret-color: #CC66FF;
                &::-webkit-input-placeholder {
                    color: #999;
                    font-family: Montserrat;
                    font-size: 12px;
                    font-style: normal;
                    font-weight: 400;
                    line-height: 150%; /* 18px */
                }
                &:focus {
                    outline: none;
                    box-shadow: none;
                }
            }
            .header-search-icon {
                width: 24px;
                height: 24px;
                margin-right: 8px;
            }
        }
        .bag {
            .flex(center, center,  row);
            width: 140px;
            height: 40px;
            border: 1px solid #666;
            cursor: pointer;
            .header-bag-icon {
                width: 18px;
                height: 18px;
                margin-right: 8px;
                display: inline-block;
            }
            .car-icon {
                width: 18px;
                height: 18px;
                margin-right: 8px;
                display: none;
            }
            > span {
                color: #333;
                font-family: Montserrat;
                font-size: 12px;
                font-style: normal;
                font-weight: 500;
                line-height: 150%; /* 18px */
            }
            .ant-badge {
                display: flex;
                align-items: center;
            }
            .ant-badge-count {
                height: 14px;
                min-width: 14px;
                font-size: 10px;
                line-height: 14px;
                padding: 0 4px;
            }
            &:hover {
                border: 1px solid #C6F;
                > .bag-text {
                    background: linear-gradient(100deg, #C6F 0%, #66F 100%);
                    background-clip: text;
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }
                .header-bag-icon {
                    display: none;
                }
                .car-icon {
                    display: inline-block;
                }
            }
        }
    }
    #menu {
        .menu-item {
            .flex(center, center,  row);
            margin-right: 40px;
            cursor: pointer;
            &:last-child {
                margin-right: 0;
            }
            .menu-item-text {
                color: #333;
                font-family: Montserrat;
                font-size: 12px;
                font-style: normal;
                font-weight: 500;
                line-height: 150%; /* 18px */
            }
            .menu-item-dropdown {
                .mt-triangle-icon {
                    fill: #333;
                }
            }
            &::before {
                background: #333;
            }
        }
    }
    .menu-item-dropdown {
        .fcc();
        >img {
            width: 28px;
            height: 28px;
            border-radius: 50%;
            margin-right: 8px;
        }
        color: #fff;
        font-family: Montserrat;
        font-size: 16px;
        font-style: normal;
        font-weight: 400;
        line-height: 150%; /* 18px */
        // letter-spacing: 0.64px;
        position: relative;
        .mt-triangle-icon {
            font-size: 18px;
            transition: transform 0.3s ease, top 0.3s ease;
            fill: #FFF;
            margin-left: 2px;
            &.expand {
                transform: rotate(180deg);
            }
        }
        .mt-user-icon {
            width: 18px;
            height: 18px;
            margin-right: 8px;
        }
        .mt-header-lang-text {
            color: #FFF;
            text-align: right;
            font-family: Montserrat;
            font-size: 12px;
            font-style: normal;
            font-weight: 500;
            line-height: 150%; /* 18px */
        }
        .mt-arrow-icon {
            position: absolute;
            width: 14px;
            height: 6px;
            bottom: 32.5px;
        }
        .mt-arrow-icon-user {
            position: absolute;
            width: 14px;
            height: 6px;
            bottom: 37px;
            left: 8px;
        }
    }
    @media (min-width: 820px) {}
    @media (max-width: 820px) {}
}
</style>
<style lang="less">
// dropdown start
.action-menu {
    position: absolute;
    top: 60px !important;
    .ant-dropdown-menu {
        position: relative;
        border-radius: 0;
        &::before {
            content: '';
            position: absolute;
            left: 50%;
            transform: translateX(-50%);
            top: -8px;
            z-index: 999999;
            width: 0;
            height: 0;
            border-left: 12px solid transparent;
            border-right: 12px solid transparent;
            border-bottom: 12px solid #fff;
        }
    }
    .ant-dropdown-menu-item {
        min-width: 100px;
        display: flex;
        align-items: center;
        justify-content: center;
        text-align: center;
        &:hover {
            background-color: #EEE;
        }
        padding: 8px 0px;
        .menu_divider {
            position: relative;
            bottom: -8px;
        }
    }
    .menu_text {
        color: #000;
        font-family: Montserrat;
        font-size: 14px;
        font-style: normal;
        font-weight: 400;
        line-height: 150%;
        text-align: center;
        padding: 0 10px;
    }
}
// dropdown end
</style>