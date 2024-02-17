<template>
    <div id="ItemDisplay" class="list-container">
        <div class="imgs-content">
            <UpAndDownSwiper
                :imgs="specList.length > 0 ? specList : detail"
                :type="specList.length > 0 ? 0 : 1"
                :item_id="id"
                :imgIndex="mountingIndex"
                :detail="detail"
                @handleChangeIndex="changeId"
            />
        </div>
        <!-- 右侧商品详情 -->
        <div class="info-content">
            <div>
                <div class="title" v-if="lang == 'zh'">
                    {{ $i18n.locale == 'zh' ? detail.name : detail.name_en }}
                </div>
                <div class="title" v-else>
                    {{ detail?.material?.name_en ? detail?.material?.name_en : detail.name_en ? detail.name_en : '-' }}
                </div>
            </div>
            <SimpleImageEmpty v-if="!detail.attr_list.length" :desc="$t('p.no_item_purchase_data')" />
            <ul v-if="isShow">
                <li v-for="attr in detail.attr_list">
                    {{ $i18n.locale == 'zh' ? attr.attr_def_name : attr.attr_def_key }}：{{
                        $i18n.locale == 'zh' ? attr.value : attr.value_en
                    }}
                </li>
            </ul>
            <a-button v-if="isShow" type="primary" block class="btn-cart" @click="hanldeAddToShopCart(detail.id)">{{
                $t('i.cart')
            }}</a-button>
            <div class="price-list" v-if="detail.set_id === 0">
                <div class="retail-price">
                    <span class="price-right" v-if="currency === 'eur' || currency === 'EUR'"
                        >€{{ $Util.countFilter(detail[priceKey + 'eur']) }}</span
                    >
                    <span class="price-right" v-else>${{ $Util.countFilter(detail[priceKey + 'usd']) }}</span>
                </div>
            </div>
            <div class="stars" @click="hanldeAddToFavorite" :class="{ active: detail.in_favorite }">
                <star-outlined />
                <span class="star-text">{{ detail.in_favorite ? $t('i.favorited') : $t('i.favorite_not') }}</span>
            </div>
        </div>
        <!-- 下方商品规格,商品图片 -->
        <div class="content">
            <div v-if="this.specList.length > 0">
                <!-- 商品规格 -->
                <div class="title">{{ $t('i.commercial_specification') }}</div>
                <div class="content-list">
                    <SpecificationCard
                        v-for="(item, index) in specList"
                        :data="item"
                        :i="index"
                        :class="{ active: index === mountingIndex }"
                        class="list"
                        @AddToFavorite="ToFavorite"
                        @handleChangeData="changeId"
                    />
                    <SimpleImageEmpty v-if="!specList.length" :desc="$t('p.no_item_spec')" />
                </div>
            </div>
            <div class="shop-imgs" v-if="specList.length > 0 || detail.imgs">
                <div class="title">{{ $t('i.commercial_picture') }}</div>
                <div class="img-list">
                    <div
                        class="img-area"
                        :style="{
                            width: '100%',
                            border: '1px solid #e6eaee',
                            marginTop: '20px',
                        }"
                    >
                        <div
                            v-for="item in specList[mountingIndex].imgs.split(',')"
                            v-if="specList[mountingIndex]?.imgs && specList.length > 0"
                        >
                            <img :src="$Util.imageFilter(item)" alt="" style="width: 800px" />
                        </div>
                        <div v-else-if="detail?.imgs" v-for="item in detail.imgs.split(',')">
                            <img :src="$Util.imageFilter(item)" alt="" style="width: 800px" />
                        </div>
                        <div v-else>
                            <SimpleImageEmpty :desc="$t('p.no_detail_img')" />
                        </div>
                    </div>
                </div>
            </div>

            <a-tabs v-model:activeKey="activeKey" class="item-purchase-info-tab">
                <!-- 配件 -->
                <a-tab-pane key="mountings" :tab="$t('i.fittings')">
                    <SpecificationCard
                        v-for="(item, index) in accessoryData"
                        class="list"
                        :data="item"
                        @AddToFavorite="ToFavorite"
                    />
                    <SimpleImageEmpty v-if="!accessoryData.length" :desc="$t('p.no_item_fitt')" />
                </a-tab-pane>
                <!-- 爆炸图 -->
                <a-tab-pane key="explosiveView" :tab="$t('i.view')" force-render>
                    <ExploredContent
                        ref="ExploredContent"
                        :id="id"
                        :show="false"
                        class="explored"
                        @noData="noExplodeData"
                    />
                    <SimpleImageEmpty v-if="explodeShow" :desc="$t('p.no_item_explode')" />
                </a-tab-pane>
                <!-- 下载 -->
                <a-tab-pane key="download" :tab="$t('n.download')">
                    <DownLoad :tableData="downloadData" />
                </a-tab-pane>
            </a-tabs>
        </div>
    </div>
</template>

<script>
import Core from '../../core';
import { LeftOutlined, RightOutlined, StarOutlined } from '@ant-design/icons-vue';
import SpecificationCard from './components/SpecificationCard.vue';
import DownLoad from './components/DownLoad.vue';
import ExploredContent from './components/ExploredContent.vue';
import SimpleImageEmpty from '../../components/common/SimpleImageEmpty.vue';
import UpAndDownSwiper from './components/UpAndDownSwiper.vue';

export default {
    name: 'ItemDisplay',
    components: {
        LeftOutlined,
        RightOutlined,
        StarOutlined,
        SpecificationCard,
        DownLoad,
        ExploredContent,
        SimpleImageEmpty,
        UpAndDownSwiper,
    },
    props: {
        item_id: {
            type: Number,
            default: 0,
        },
    },
    watch: {
        item_id: {
            immediate: true,
            handler(n) {
                this.id = n;
                this.getDownloadData();
            },
        },
    },
    data() {
        return {
            activeKey: 'mountings',
            // 加载
            loading: false,
            ATTACHMENT_TYPE: Core.Const.ATTACHMENT.TARGET_TYPE,
            id: undefined,
            detail: {
                attr_list: {},
            },
            isShow: false,
            specList: [],
            accessoryData: [],

            // 无爆炸图
            explodeShow: true,

            // 规格选中
            mountingIndex: 0,

            // 下载数据
            downloadData: [],
            currency: '',
            paramPrice: false,
        };
    },
    computed: {
        priceKey() {
            let priceKey = this.$auth('DISTRIBUTOR') ? 'fob_' : 'purchase_price_';
            return priceKey;
        },
        lang() {
            return this.$store.state.lang;
        },
    },
    mounted() {
        this.currency = Core.Data.getCurrency();
        if (this.currency === 'EUR') {
            this.paramPrice = false;
        } else {
            this.paramPrice = true;
        }
        if (Number(this.$route.query.id)) {
            this.id = Number(this.$route.query.id) || 0;
        }
        this.getItemDetail();
    },
    methods: {
        /*== Fetch start ==*/
        // 获取商品详情接口
        getItemDetail(params = {}) {
            this.loading = true;
            Core.Api.Item.detail({
                id: this.id,
                ...params,
            })
                .then(res => {
                    let detail = res.detail;
                    this.detail = detail;
                    if (detail.set_id) {
                        this.getSpecList();
                    } else {
                        this.isShow = true;
                    }
                })
                .catch(err => {
                    console.log('getItemDetail err', err);
                })
                .finally(() => {
                    this.loading = false;
                    this.getExploreDetail(this.detail.id);
                });
        },
        // 获取 同规格商品 列表接口
        getSpecList(params = {}) {
            this.loading = true;
            Core.Api.Item.list({
                id: this.detail.id,
                set_id: this.detail.set_id,
                flag_spread: 2,
                status: 0,
                ...params,
                flag_default: 0,
            })
                .then(res => {
                    this.specList = res.list.filter(i => i.flag_default !== 1);
                    console.log('specList', this.specList);
                    // 刚进页面初始化 商品规格对应的配件
                    this.getAccessoryData({
                        item_id: res.list[this.mountingIndex].id,
                    });
                })
                .catch(err => {
                    console.log('getSpecList err', err);
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        // 添加到购物车接口
        hanldeAddToShopCart(params = {}) {
            Core.Api.ShopCart.save({
                item_id: this.detail.id,
                amount: 1,
                price: this.detail.purchase_price,
                ...params,
            }).then(res => {
                this.$message.success(this.$t('i.add_success'));
                this.detail.in_shopping_cart = true;
            });
        },

        // 配件接口
        getAccessoryData(params = {}) {
            Core.Api.ItemAccessory.list({
                item_id: this.detail.id,
                is_authority: 1,
                ...params,
            }).then(res => {
                let list = [];
                res.list.forEach(it => {
                    let item = {
                        logo: it.logo,
                        imgs: it.imgs,
                        name: it.target_name,
                        name_en: it.target_name_en,
                        code: it.target_uid,
                        attr_list: it.attr_list,
                        id: it.target_id,
                        fob_usd: it.fob_usd,
                        fob_eur: it.fob_eur,
                        purchase_price_usd: it.purchase_price_usd,
                        purchase_price_eur: it.purchase_price_eur,
                    };
                    list.push(item);
                });
                this.accessoryData = list;
            });
        },

        // 获取下载数据接口
        getDownloadData(params = {}) {
            // 获取 表格 数据
            this.loading = true;
            Core.Api.Attachment.list({
                target_id: this.id,
                target_type: this.ATTACHMENT_TYPE.ITEM,
                page: 0,
                ...params,
            })
                .then(res => {
                    this.downloadData = res.list;
                })
                .catch(err => {
                    console.log('AttachmentFile err', err);
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        /*== Fetch end ==*/

        // 根据id获取爆炸图
        getExploreDetail(id) {
            this.$refs.ExploredContent.getItemExploreList(id);
        },
        // 收藏商品
        hanldeAddToFavorite() {
            let _this = this;
            if (this.detail.in_favorite) {
                return this.$message.warning(_this.$t('i.item_favorite'));
            }
            if (!this.paramPrice) {
                Core.Api.Favorite.add({
                    item_id: this.detail.id,
                    price: this.detail.fob_eur,
                }).then(res => {
                    this.$message.success(_this.$t('i.favorite_success'));
                    this.getItemDetail();
                });
            } else {
                Core.Api.Favorite.add({
                    item_id: this.detail.id,
                    price: this.detail.fob_usd,
                }).then(res => {
                    this.$message.success(_this.$t('i.favorite_success'));
                    this.getItemDetail();
                });
            }
        },
        // 商品规格收藏商品成功
        ToFavorite(data) {
            this.getItemDetail();
        },

        // 无爆炸图数据
        noExplodeData(data) {
            this.explodeShow = data;
        },

        // 点击规格(或者点击图片轮播)请求数据
        changeId({ id, i }) {
            this.id = id;
            this.mountingIndex = i;
            this.getItemDetail();
            this.getAccessoryData();
            this.getDownloadData();
        },
    },
};
</script>

<style lang="less" scoped>
.item-purchase-info-tab {
    .ant-tabs-tab-btn {
        width: auto;
        text-align: center;
    }
}
.active {
    border-color: #006ef9 !important;
}
#ItemDisplay {
    display: flex;
    flex-wrap: wrap;
    box-sizing: border-box;
    padding: 63px 70px;
    .imgs-content {
        display: flex;
        flex: 1;
        justify-content: center;
        color: #111111;
        line-height: 22px;
        font-size: 16px;
        font-weight: 500;
        box-sizing: border-box;
    }

    .info-content {
        flex: 1;
        // margin-right: 120px;
        overflow: hidden;
        min-width: 200px;
        padding-top: 50px;
        div,
        ul {
            width: 100%;
            overflow: hidden;
        }
        ul {
            // list-style: disc;
            margin-top: 20px;
            color: @TC_car_info;
            font-size: @fz_bs;
            font-weight: 400;
            li {
                margin-top: 10px;
                position: relative;
                padding-left: 14px;
                &:nth-of-type(1) {
                    margin-top: 0;
                }
                .ell();
                &:before {
                    position: absolute;
                    left: 0;
                    top: 50%;
                    transform: translateY(-50%);
                    content: '';
                    width: 6px;
                    height: 6px;
                    display: inline-block;
                    border-radius: 50%;
                    background: #515154;
                    vertical-align: middle;
                    margin-right: 14px;
                }
            }
        }
        .title {
            font-size: @fz_28;
            color: @TC_car_title;
            font-weight: 500;
            .ell();
        }
        .btn {
            background-color: rgba(0, 110, 249, 0.5);
            border: none;
            color: @white;
            height: 46px;
            font-size: @fz_md;
            font-weight: 500;
        }
        .btn-cart {
            background-color: rgba(0, 110, 249);
            border: none;
            color: @white;
            height: 46px;
            font-size: @fz_md;
        }
        .price-list {
            div {
                display: flex;
                justify-content: space-between;
                border-bottom: 1px solid @TC_car_bc;
                padding: 10px 0;
            }
            .price-left {
                color: @TC_D;
                font-size: @fz_bs;
                font-weight: 400;
            }
            .price-right {
                color: @TC_car_price;
                font-size: @fz_md;
                font-weight: 500;
            }
        }
        .stars {
            padding: 10px 0;
            font-weight: 400;
            font-size: @fz_bs;
            cursor: pointer;
            .star-text {
                margin-left: 7px;
            }
            &.active {
                color: @TC_car_price;
            }
        }
    }

    .content {
        width: 100%;
        .title {
            margin-top: 51px;
            color: @TC_D;
            font-size: @fz_24;
            font-weight: 500;
        }
        .content-list {
            margin-top: 10px;
            .list {
                margin-top: 30px;
            }
        }
        .item-purchase-info-tab {
            .list {
                margin-top: 30px;
            }
        }
    }
}

.explored {
    // padding: 42px;
    width: 800px;
    // height: auto;
    //border: 1px solid @TC_car_bc;
    border-radius: 4px;
}

/* tab */
.content {
    .ant-tabs {
        margin-top: 50px;
    }
    .ant-tabs :deep(.ant-tabs-nav::before) {
        display: none;
    }
    .ant-tabs :deep(.ant-tabs-tab-btn) {
        color: #363d42;
        font-size: @fz_20;
    }
    .ant-tabs :deep(.ant-tabs-tab) {
        height: 46px;
        background: #ffffff;
        border-radius: 0px 0px 0px 0px;
        border: 1px solid #e6eaee;
        .fcc();
    }
    .ant-tabs :deep(.ant-tabs-tab + .ant-tabs-tab) {
        margin: 0;
    }
    .ant-tabs :deep(.ant-tabs-ink-bar) {
        display: none;
    }
    .ant-tabs :deep(.ant-tabs-tab:hover) {
        color: #363d42;
    }
    .ant-tabs :deep(.ant-tabs-tab.ant-tabs-tab-active) {
        background-color: #006ef9;
        border-color: #006ef9;
    }
    .ant-tabs :deep(.ant-tabs-tab.ant-tabs-tab-active .ant-tabs-tab-btn) {
        color: @white;
    }
    .ant-tabs :deep(.ant-tabs-tab) {
        padding: 0 10px;
        box-sizing: border-box;
        &:nth-of-type(1) {
            border-radius: 4px 0 0 4px;
        }
        &:nth-of-type(3) {
            border-radius: 0 4px 4px 0;
        }
    }
}
</style>
