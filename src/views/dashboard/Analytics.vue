<template>
    <div id="Analytics">
        <div class="banner-header">
            <img src="../../assets/images/default_banner-one.png" class="banner-bg" />
            <p class="banner-title">{{ $t('n.search_title') }}</p>
            <a-input
                v-model:value="searchValue"
                :placeholder="$t('n.search_placeholder')"
                class="banner-search"
                allowClear
                :maxlength="99"
                @pressEnter="hadleSearch"
            >
                <template #prefix>
                    <search-outlined class="search" @click="hadleSearch" />
                </template>
                <template #suffix>
                    <arrow-right-outlined class="arrow" @click="hadleSearch" />
                </template>
            </a-input>
        </div>
        <div class="banner-cards">
            <div
                class="banner-card"
                v-for="(banner, i) in bannerList"
                :key="i"
                @click="routerChange('item', banner.first_level)"
            >
                <template v-if="banner.first_level === '1'">
                    <img src="../../assets/images/default_banner-five.jpeg" class="card-bg" />
                    <arrow-right-outlined type="user" class="arrow-black" />
                </template>
                <template v-if="banner.first_level === '2'">
                    <img src="../../assets/images/default_banner-five.png" class="card-bg" />
                    <arrow-right-outlined type="user" class="arrow-black" />
                </template>
                <template v-if="banner.first_level === '3'">
                    <img src="../../assets/images/default_banner-two.png" class="card-bg" />
                    <p class="title">{{ $i18n.locale === 'zh' ? banner.content : banner.content_en }}</p>
                    <p class="info">{{ $i18n.locale === 'zh' ? banner.name : banner.name_en }}</p>
                    <arrow-right-outlined type="user" class="arrow" />
                </template>
            </div>
        </div>
        <div class="service">
            <div class="service-left card">
                <div class="service-title">{{ $t('n.service') }}</div>
                <div class="service-content service">
                    <div class="service-list" v-for="(service, index) in servicelist" :key="index">
                        <img :src="serviceSrc(service.imgUrl)" alt="" class="service-img" />
                        <p class="service-info">{{ $i18n.locale === 'zh' ? service.name : service.name_en }}</p>
                    </div>
                </div>
            </div>
            <div class="service-right card">
                <div class="service-title">{{ $t('n.unread_num') }}</div>
                <div class="service-content">
                    <div class="notice-list" v-for="unread in unreadList" :key="unread.id">
                        <div class="notice-header">
                            <p class="notice-title">{{ unread.title }}</p>
                            <p class="notice-content">{{ unread.title }}</p>
                            <p class="more" @click="routerChange('notice')">
                                {{ $t('n.detail') }}<right-outlined class="arrow" />
                            </p>
                        </div>
                        <div class="notice-contents">{{ unread.content }}</div>
                        <p class="time">{{ $Util.timeFilter(unread.create_time) }}</p>
                    </div>
                </div>
            </div>
        </div>
        <div class="list-cards">
            <div class="list-card" v-for="(recom, i) in recommendlist" :key="i">
                <div class="list-img">
                    <img src="../../assets/images/default_banner-three.png" class="img" />
                    <div class="date">
                        <p class="day">{{ $Util.timeFilter(recom.date, 3).split('-')[2] }}</p>
                        <p class="month">{{ $Util.timeFilter(recom.date, 3).split('-')[1] }}</p>
                    </div>
                </div>
                <div class="list-content">
                    <p class="title">{{ $i18n.locale === 'zh' ? recom.name : recom.name_en }}</p>
                    <p class="labels">
                        <span class="label" v-for="(label, index) in recom.labels" :key="index">{{
                            $i18n.locale === 'zh' ? label.name : label.name_en
                        }}</span>
                    </p>
                    <div class="btn">
                        <a-button type="primary">{{ $t('n.more') }}</a-button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import Core from '../../core';
import { SearchOutlined, ArrowRightOutlined, RightOutlined } from '@ant-design/icons-vue';

const serviceModules = import.meta.globEager('../../assets/images/service/*');

export default {
    name: 'Analytics',
    components: {
        SearchOutlined,
        ArrowRightOutlined,
        RightOutlined,
    },
    data() {
        return {
            unread: {
                master: '',
                org: '',
                list: [],
            },
            // 搜索内容
            searchValue: '',
            // banner 横幅广告
            bannerList: [
                {
                    name: '交通工具',
                    name_en: 'VEHICLE',
                    content: '内容 内容',
                    content_en: 'Content content',
                    first_level: '1',
                },
                {
                    name: '备品',
                    name_en: 'SPAREPARTS',
                    content: '内容 内容',
                    content_en: 'Content content',
                    first_level: '2',
                },
                {
                    name: '附件',
                    name_en: 'ACCESSOIRES',
                    content: '内容 内容',
                    content_en: 'Content content',
                    first_level: '3',
                },
            ],
            // 待定数据
            pendingList: [
                {
                    name: '预先警报',
                    name_en: 'Early warning',
                    info: '商店的惩罚',
                    info_en: 'Shop is punished',
                    content: '处罚原因:用户投诉店铺',
                    content_en: 'Reason for punishment: The user complains about the Shop',
                    istrue: 1,
                },
                {
                    name: '售后工作指令',
                    name_en: 'After-sales work orders',
                    info: 'XX启动售后退款流程',
                    info_en: 'XX initiates after-sale refund processing',
                    content: '订单号:1234567890',
                    content_en: 'The order number：1234567890',
                    istrue: 0,
                },
                {
                    name: '售后工作指令',
                    name_en: 'After-sales work orders',
                    info: 'XX启动售后退款流程',
                    info_en: 'XX initiates after-sale refund processing',
                    content: '订单号:1234567890',
                    content_en: 'The order number：1234567890',
                    istrue: 0,
                },
            ],
            // 服务数据
            servicelist: [
                {
                    name: '下载',
                    name_en: 'Downloads',
                    imgUrl: 'download',
                },
                {
                    name: '文档',
                    name_en: 'Documents',
                    imgUrl: 'documents',
                },
                {
                    name: '登录管理',
                    name_en: 'Login Management',
                    imgUrl: 'documents',
                },
                {
                    name: '配送地址',
                    name_en: 'Shipping Adresses',
                    imgUrl: 'shipping',
                },
                {
                    name: '常见问题',
                    name_en: 'FAQ',
                    imgUrl: 'FAQ',
                },
                {
                    name: '登录管理',
                    name_en: 'Login Management',
                    imgUrl: 'documents',
                },
            ],
            // 推荐数据
            recommendlist: [
                {
                    name: 'HORWIN合作伙伴活动2022',
                    name_en: 'HORWIN PARTNER EVENT 2022',
                    labels: [
                        {
                            name: '标签',
                            name_en: 'TAG',
                            // imgurl: ''
                        },
                        {
                            name: '标签',
                            name_en: 'TAG',
                        },
                        {
                            name: '标签',
                            name_en: 'TAG',
                        },
                    ],
                    date: '1023000',
                },
                {
                    name: 'HORWIN合作伙伴活动2022',
                    name_en: 'HORWIN PARTNER EVENT 2022',
                    labels: [
                        {
                            name: '标签',
                            name_en: 'TAG',
                        },
                        {
                            name: '标签',
                            name_en: 'TAG',
                        },
                        {
                            name: '标签',
                            name_en: 'TAG',
                        },
                    ],
                    date: '1000000',
                },
                {
                    name: 'HORWIN合作伙伴活动2022',
                    name_en: 'HORWIN PARTNER EVENT 2022',
                    labels: [
                        {
                            name: '标签',
                            name_en: 'TAG',
                        },
                        {
                            name: '标签',
                            name_en: 'TAG',
                        },
                        {
                            name: '标签',
                            name_en: 'TAG',
                        },
                    ],
                    date: '1230340',
                },
            ],
        };
    },
    mounted() {
        this.getUnreadCount();
    },
    computed: {
        unreadList() {
            return this.unread.list.slice(0, 2);
        },
    },
    methods: {
        serviceSrc(name, type = 'png') {
            let path = `../../assets/images/service/${name}.${type}`;
            return serviceModules[path]?.default;
        },
        routerChange(type, first_level_id) {
            let routeUrl = '';
            switch (type) {
                case 'item':
                    routeUrl = this.$router.resolve({
                        path: '/mall/vehicle-list',
                        // query: {
                        //     first_level_id : first_level_id
                        // }
                    });
                    window.open(routeUrl.href, '_self');
                    break;
                case 'notice': //系统
                    routeUrl = this.$router.resolve({
                        path: '/system/notice-list',
                    });
                    window.open(routeUrl.href, '_self');
                    break;
            }
        },
        getUnreadCount() {
            // 获取 未读消息数 数据
            let CATEGORY = Core.Const.NOTICE.CATEGORY;
            Core.Api.Notice.list({
                category: CATEGORY.ORG,
            })
                .then(res => {
                    this.unread.org = res.un_count;
                    this.unread.list.push(...res.list);
                })
                .catch(err => {
                    console.log('getUnreadCount err', err);
                });
            Core.Api.Notice.list({
                category: CATEGORY.MASTER,
            })
                .then(res => {
                    this.unread.master = res.un_count;
                    this.unread.list.push(...res.list);
                })
                .catch(err => {
                    console.log('getUnreadCount err', err);
                });
        },
        hadleSearch() {
            if (this.searchValue.length) {
                console.log(this.searchValue);
                // 请求数据
            } else {
                this.$message.error(this.$t('n.enter_search'));
            }
        },
    },
};
</script>
<style lang="less" scoped>
#Analytics {
    padding: 22px;
    width: 100%;
    box-sizing: border-box;
    .banner-header {
        width: 100%;
        position: relative;
        border-radius: 10px;
        overflow: hidden;
        .banner-bg {
            width: 100%;
        }
        .banner-title {
            position: absolute;
            top: 20%;
            left: 50%;
            transform: translateX(-50%);
            font-size: 24px;
            font-weight: bold;
            color: @white;
            width: 100%;
            text-align: center;
            .ell();
        }
        .banner-search {
            width: 50%;
            height: 54px;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
        }
    }
    .banner-cards {
        width: 100%;
        display: flex;
        justify-content: space-between;
        margin-top: @mt_26;
        .banner-card {
            width: 32%;
            border-radius: 8px;
            overflow: hidden;
            position: relative;
            .card-bg {
                width: 100%;
            }
            > p {
                position: absolute;
                width: calc(100 - 20%);
                .ell();
            }
            .title {
                top: 10%;
                left: 5%;
                font-size: @fz_lg;
                font-weight: bold;
                color: @white;
                opacity: 0.8;
            }
            .info {
                top: 20%;
                left: 5%;
                font-size: 24px;
                font-weight: bold;
                color: @white;
            }
            .arrow {
                position: absolute;
                bottom: 10%;
                right: 6%;
                color: @white;
                font-size: @fz_25;
            }
            .title-black {
                top: 10%;
                left: 5%;
                font-size: @fz_lg;
                font-weight: bold;
                color: #000;
                opacity: 0.8;
            }
            .info-black {
                top: 20%;
                left: 5%;
                font-size: 24px;
                font-weight: bold;
                color: #000;
            }
            .arrow-black {
                position: absolute;
                bottom: 10%;
                right: 6%;
                color: #000;
                font-size: @fz_25;
            }
        }
    }
    .message {
        margin-top: @mt_26;
        .title {
            font-size: @fz_bs;
            font-weight: bold;
            color: #323c4d;
            .badge {
                margin-left: 10px;
            }
        }
        .content {
            width: 100%;
            display: flex;
            flex-wrap: wrap;
            .message-card {
                width: 500px;
                padding: 19px 69px 19px 10px;
                margin-top: 13px;
                border-radius: 12px;
                box-sizing: border-box;
                .message-content {
                    border-left-width: 3px;
                    border-left-style: solid;
                    padding-left: 20px;
                    font-size: @fz_bs;
                    .text {
                        margin-right: 10px;
                        font-weight: 500;
                    }
                    p {
                        .ell();
                    }
                    .info {
                        font-weight: 500;
                    }
                    .content {
                        font-weight: 500;
                        color: #848181;
                    }
                }
            }
        }
    }
    .service {
        margin-top: @mt_26;
        display: flex;
        .service-left {
            margin-right: @mt_26;
            box-sizing: border-box;
        }
        .service-right {
            width: 400px;
            box-sizing: border-box;
        }
        .card {
            padding: 22px 22px 32px;
            box-sizing: border-box;
            &.service-left {
                padding-bottom: 12px;
            }
            &.service-right {
                padding-bottom: 8px;
            }
        }
        .service-title {
            font-size: @fz_bs;
            font-weight: bold;
            color: #323c4d;
        }
        .service-content {
            margin-top: 22px;
            &.service {
                display: flex;
                flex-wrap: wrap;
                justify-content: space-between;
            }
        }
        .service-list {
            width: 30%;
            // width: 40%;
            min-width: 200px;
            margin-bottom: 20px;
            margin-bottom: 55px;
            display: flex;
            align-items: center;
            background: #fafbfc;
            border-radius: 4px 4px 4px 4px;
            padding: 14px;
            box-sizing: border-box;
            .service-img {
                width: 34px;
                height: 34px;
                margin-right: 12px;
            }
            .service-info {
                width: calc(100% - 46px);
                .ell();
                font-weight: bold;
                color: #606c80;
            }
        }
        .notice-list {
            width: 100%;
            box-sizing: border-box;
            margin-bottom: 30px;
            .notice-header {
                width: 100%;
                display: flex;
                .notice-title {
                    font-size: @fz_bs;
                    font-weight: 500;
                    color: #1eb4d1;
                    margin-right: 14px;
                    background: #e5faff;
                    padding: 0 4px;
                    border-radius: 2px;
                }
                .notice-content {
                    flex: 1;
                    font-size: @fz_md;
                    font-weight: 500;
                    color: #000000;
                    .ell();
                }
                .more {
                    margin-left: 25px;
                    font-size: @fz_bs;
                    font-weight: 500;
                    color: #2563eb;
                    .fsb();
                    .arrow {
                        color: #a2a2a2;
                        font-size: @fz_sm;
                        margin-left: 8px;
                    }
                }
            }
            .notice-contents {
                margin-top: 10px;
                width: 100%;
                .ell();
                font-weight: 500;
                color: #a9a9a9;
            }
            .time {
                margin-top: 10px;
            }
        }
    }
    .list-cards {
        width: 100%;
        display: flex;
        justify-content: space-between;
        margin-top: @mt_26;
        .list-card {
            width: 32%;
            border-radius: 8px;
            overflow: hidden;
            position: relative;
            .list-img {
                width: 100%;
                position: relative;
                .img {
                    width: 100%;
                }
                .date {
                    position: absolute;
                    left: 8%;
                    bottom: -28px;
                    background: @BG_upload;
                    border-radius: 6px;
                    padding: 5px 11px;
                    text-align: center;
                    .day {
                        font-size: @fz_lg;
                        font-weight: normal;
                        color: #566a7f;
                    }
                    .month {
                        font-size: @fz_13;
                        font-weight: bold;
                        color: #2563eb;
                    }
                }
            }
            .list-content {
                background: @BG_upload;
                padding: 33px 24px 30px;
                box-sizing: border-box;
                .title {
                    font-size: @fz_lg;
                    font-weight: 400;
                    color: #323c4c;
                    .ell();
                }
                .labels {
                    width: 100%;
                    display: flex;
                    margin-top: 12px;
                    .label {
                        background: rgba(37, 99, 235, 0.16);
                        border-radius: 4px;
                        font-size: @fz_13;
                        font-weight: 400;
                        color: #2563eb;
                        margin-right: 12px;
                        padding: 2px 16px;
                    }
                }
                .btn {
                    margin-top: 20px;
                    display: flex;
                    justify-content: flex-end;
                    :deep(.ant-btn) {
                        font-size: 15px;
                        font-weight: 400;
                    }
                }
            }
        }
    }
}
.green {
    .text {
        color: #367aff;
    }
    > div {
        border-left-color: #367aff;
    }
    background: linear-gradient(94deg, rgba(54, 122, 255, 0.3) 0%, rgba(54, 122, 255, 0) 40%);
}
.red {
    .text {
        color: #ff0000;
    }
    > div {
        border-left-color: #ff0000;
    }
    background: linear-gradient(90deg, rgba(255, 0, 0, 0.3) 0%, rgba(255, 0, 0, 0) 40%);
}
:deep(.ant-badge-count) {
    background-color: rgba(255, 204, 215, 1);
    color: rgba(255, 17, 66, 1);
}
.card {
    background-color: #fff;
    border-radius: 8px;
    overflow: hidden;
    padding: 30px;
}
.banner-search {
    border: none;
    background-color: rgba(255, 255, 255, 0.26);
    padding: 4px 30px;
    border-radius: 33px;
}
:deep(.ant-input) {
    background-color: transparent;
    font-size: @fz_bs;
    font-weight: 400;
    color: @white;
    padding-left: 15px !important;
    &::placeholder {
        font-size: @fz_bs;
        font-weight: 400;
        color: @white;
    }
}
:deep(.ant-input-clear-icon) {
    font-size: 20px;
    margin-right: 20px;
    color: #fff;
    opacity: 0.6;
    &:hover {
        color: #fff;
        opacity: 1;
    }
}
.search {
    font-size: @fz_20;
    color: @white;
}
.arrow {
    font-size: @fz_20;
    color: @white;
}
</style>
