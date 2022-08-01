<template>
    <div id="ItemDisplay" class="list-container">
        <div class="imgs-content">
            <!-- <a-carousel arrows dots-class="slick-dots slick-thumb" >
                <div v-for="item,index in imgs" :key="item">
                    <img :src="getImgUrl(index)" />
                </div>
                <template #customPaging="props">
                    <a>
                        <img :src="getImgUrl(props.i)" />
                    </a>
                </template> 
                <template #prevArrow>
                    <div class="custom-slick-arrow">
                        <left-outlined />
                    </div>
                </template>
                <template #nextArrow>
                    <div class="custom-slick-arrow">
                        <right-outlined />
                    </div>
                </template>
            </a-carousel> -->
            <UpAndDownSwiper></UpAndDownSwiper>
        </div>
        <div class="info-content">
            <div class="title">{{ $i18n.locale =='zh' ? detail.name : detail.name_en }}</div>
            <SimpleImageEmpty v-if="!detail.attr_list.length" :desc="$t('p.no_item_purchase_data')"/>
            <ul>
                <li v-for="attr in detail.attr_list">{{ $i18n.locale =='zh' ? attr.attr_def_name : attr.attr_def_key }}：{{ $i18n.locale =='zh' ? attr.value : attr.value_en }}</li>
            </ul>
            <a-button type="primary" block class="btn">{{ $i18n.locale =='zh' ? '此商品 ' : 'This commodity has ' }}{{ specList.length }}{{ $i18n.locale =='zh' ? ' 种规格' : ' kinds of specifications' }}</a-button>
            <div class="price-list">
                <div class="retail-price">
                    <span class="price-left">{{ $t('i.price_suggest') }}</span>
                    <span class="price-right">€{{$Util.countFilter(detail[priceKey + 'eur'])}} | ${{$Util.countFilter(detail[priceKey + 'usd'])}}</span>
                </div>
                <div class="price">
                    <span class="price-left">{{ $t('i.price') }}</span>
                    <span class="price-right">€{{$Util.countFilter(detail[priceKey + 'eur'])}} | ${{$Util.countFilter(detail[priceKey + 'usd'])}}</span>
                </div>
            </div>
            <div class="stars" @click="hanldeAddToFavorite" :class="{'active': detail.in_favorite}">
                <star-outlined />
                <span class="star-text" >{{ detail.in_favorite ? $t('i.favorited') : $t('i.favorite_not') + '商品' }}</span>
            </div>
        </div>
        <div class="content">
            <div class="title">{{ $t('i.commercial_specification') }}</div>
            <div class="content-list">
                <SpecificationCard v-for="item in specList" :data="item" @AddToFavorite="ToFavorite" class="list"/>
                <SimpleImageEmpty v-if="!specList.length" :desc="$t('p.no_item_spec')"/>
            </div>
            <a-tabs v-model:activeKey="activeKey" class="tab-box">
                <a-tab-pane key="mountings" :tab="$t('i.fittings')">
                    <SpecificationCard v-for="item in specList" class="list" :data="item" @AddToFavorite="ToFavorite"/>
                    <SimpleImageEmpty v-if="!specList.length" :desc="$t('p.no_item_fitt')"/>
                </a-tab-pane>
                <a-tab-pane key="explosiveView" :tab="$t('i.view')" force-render> 
                    <ExploredContent ref="ExploredContent" :id="id" :show="false" class="explored" @noData="noExplodeData"/>
                    <SimpleImageEmpty v-if="explodeShow" :desc="$t('p.no_item_explode')"/>
                </a-tab-pane>
                <a-tab-pane key="download" :tab="$t('n.download')">
                    <DownLoad :target_id='id' :target_type='ATTACHMENT_TYPE.ITEM' />
                </a-tab-pane>
            </a-tabs>
        </div>
    </div>
</template>

<script>
import Core from '../../core';
// import ExploredContent from './components/ExploredContent.vue';
import { LeftOutlined, RightOutlined, StarOutlined } from '@ant-design/icons-vue';
import SpecificationCard from './components/SpecificationCard.vue'
import DownLoad from './components/DownLoad.vue'
import ExploredContent from './components/ExploredContent.vue';
import SimpleImageEmpty from '../../components/common/SimpleImageEmpty.vue'
import UpAndDownSwiper from './components/UpAndDownSwiper.vue'

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
    props: {},
    data() {
        return {
            // imgs: ['https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg.jj20.com%2Fup%2Fallimg%2Ftp09%2F210F2130512J47-0-lp.jpg&refer=http%3A%2F%2Fimg.jj20.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1661495042&t=b77c1037ad5171fd86341525a2b14e7e','https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg.jj20.com%2Fup%2Fallimg%2F1113%2F052420110515%2F200524110515-2-1200.jpg&refer=http%3A%2F%2Fimg.jj20.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1661495151&t=1660dab7f77bcb019bb65f50621ece75','https://img1.baidu.com/it/u=2003496092,3295249130&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=313','https://img1.baidu.com/it/u=3164998783,2199444470&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=333','https://img1.baidu.com/it/u=3384796346,381674655&fm=253&fmt=auto&app=138&f=JPEG?w=889&h=500','https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg.jj20.com%2Fup%2Fallimg%2Ftp09%2F210F2130512J47-0-lp.jpg&refer=http%3A%2F%2Fimg.jj20.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1661495042&t=b77c1037ad5171fd86341525a2b14e7e','https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg.jj20.com%2Fup%2Fallimg%2Ftp09%2F210F2130512J47-0-lp.jpg&refer=http%3A%2F%2Fimg.jj20.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1661495042&t=b77c1037ad5171fd86341525a2b14e7e','https://img1.baidu.com/it/u=3164998783,2199444470&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=333','https://img1.baidu.com/it/u=3384796346,381674655&fm=253&fmt=auto&app=138&f=JPEG?w=889&h=500','https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg.jj20.com%2Fup%2Fallimg%2Ftp09%2F210F2130512J47-0-lp.jpg&refer=http%3A%2F%2Fimg.jj20.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1661495042&t=b77c1037ad5171fd86341525a2b14e7e',],
            activeKey: 'mountings',
            // loginType: Core.Data.getLoginType(),
            // 加载
            loading: false,
            ATTACHMENT_TYPE: Core.Const.ATTACHMENT.TARGET_TYPE,
            id: null,
            detail: {
                attr_list: {},
            },
            // category: {},
            // config: [],
            // imgs: [],
            // activeKey: 0,

            specList: [],

            // 无爆炸图
            explodeShow: true,
        };
    },
    watch: {},
    computed: {
        // priceKey() {
        //     let priceKey = this.$auth('DISTRIBUTOR') ? 'fob_' : 'purchase_price_'
        //     console.log('priceKey:', priceKey)
        //     return priceKey
        // }
    },
    mounted() {
        this.id = Number(this.$route.query.id) || 0
        this.getItemDetail();
    },
    methods: {
        // getImgUrl(i) {
        //     return this.imgs[i]
        // },
        // 获取商品详情
        getItemDetail() {
            this.loading = true;
            Core.Api.Item.detail({
                id: this.id,
            }).then(res => {
                console.log('getItemDetail111111111 res', res)
                let detail = res.detail
                this.detail = detail
                if (detail.set_id) {
                    this.getSpecList();
                }
            }).catch(err => {
                console.log('getItemDetail err', err)
            }).finally(() => {
                this.loading = false;
                this.getExploreDetail(this.id);
            });
        },
        // 获取 同规格商品 列表
        getSpecList() {
            this.loading = true;
            Core.Api.Item.listBySet({
                set_id: this.detail.set_id
            }).then(res => {
                console.log('getSpecList this.specific.data:', res)
                this.specList = res.list;
            }).catch(err => {
                console.log('getSpecList err', err)
            }).finally(() => {
                this.loading = false;
            });
        },
        // 查看不同 规格
        // handleSpecChange(item) {
        //     this.id = item.id;
        //     this.getItemDetail()
        // },
        // 根据id获取爆炸图
        getExploreDetail(id) {
            this.$refs.ExploredContent.getItemExploreList(id);
        },
        // 收藏商品
        hanldeAddToFavorite() {
            if (this.detail.in_favorite) {
                return this.$message.warning('该商品已在收藏夹中')
            }
            Core.Api.Favorite.add({
                item_id: this.detail.id,
                price: this.detail.purchase_price
            }).then(res => {
                console.log('hanldeAddToFavorite res:', res)
                this.$message.success('收藏成功')
                this.getItemDetail();
            })
        },

        // 商品规格收藏商品成功
        ToFavorite(data) {
            this.getItemDetail();
        },

        // 无爆炸图数据
        noExplodeData(data) {
            this.explodeShow = data
        },

        // getImgUrl(i) {
        //     return Core.Util.imageFilter(this.imgs[i])
        // },
    }
};
</script>

<style lang="less" scoped>
#ItemDisplay {
    display: flex;
    flex-wrap: wrap;
    box-sizing: border-box;
    padding: 63px 70px 200px;

    .imgs-content {
        // width: calc(~'100% - 620px');
        width: 900px;
        height: 600px;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: flex-start;
        color: #111111;
        line-height: 22px;
        font-size: 16px;
        font-weight: 500;
        box-sizing: border-box;
        padding-left: 64px;
    }

    .info-content {
        // width: 500px;
        flex: 1;
        // margin-right: 120px;
        overflow: hidden;
        min-width: 200px;
        div, ul {
            width: 100%;
            overflow: hidden;
        } 
        ul {
            // list-style: disc;
            margin-top: 20px;
            color: @TC_car_info;
            font-size: @fz_bs;
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
                    content: "";
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
            .ell();
        }
        .btn {
            background-color: rgba(0, 110, 249, .5);
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
            }
            .price-right {
                color: @TC_car_price;
                font-size: @fz_md;
            }
        }
        .stars {
            padding: 10px 0;
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
        }
        .content-list {
            margin-top: 10px;
            .list {
                margin-top: 30px;
            }
        }
        .tab-box {
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
    border: 1px solid @TC_car_bc;
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
        color: #363D42;
        font-size: @fz_20;
    }
    .ant-tabs :deep(.ant-tabs-tab) {
        width: 120px;
        height: 46px;
        background: #FFFFFF;
        border-radius: 0px 0px 0px 0px;
        border: 1px solid #E6EAEE;
        .fcc()
    }
    .ant-tabs :deep(.ant-tabs-tab + .ant-tabs-tab) {
        margin: 0;
    }
    .ant-tabs :deep(.ant-tabs-ink-bar) {
        display: none;
    }
    .ant-tabs :deep(.ant-tabs-tab:hover) {
        color: #363D42;
    }
    .ant-tabs :deep(.ant-tabs-tab.ant-tabs-tab-active) {
        background-color: #006EF9;
        border-color: #006EF9;
    }
    .ant-tabs :deep(.ant-tabs-tab.ant-tabs-tab-active .ant-tabs-tab-btn) {
        color: @white;
    }
}

/* For demo */


.ant-carousel {
    width: 100%;
    height: 540px;
    // width: 110px;
}
.ant-carousel :deep(.slick-slider) {
    position: relative;
    display: flex;
    width: 100%;
    height: 100%;
    overflow: hidden;
}
.ant-carousel :deep(.slick-list) {
    // display: none;
    width: 522px;
    height: 500px;
    margin-left: 100px;
    margin-top: 40px;
}
.ant-carousel :deep(.slick-slide) {
    height: 100%;
}
// .ant-carousel :deep(.slick-slide div) {
//     height: 100%;
// }
.ant-carousel :deep(.slick-track) {
    height: 500px;
}
.ant-carousel :deep(.slick-dots) {
  position: relative;
  height: auto;
}
.ant-carousel :deep(.slick-slide img) {
  border: 5px solid #fff;
  display: block;
  margin: auto;
  max-width: 80%;
}
.ant-carousel :deep(.slick-arrow) {
//   width: 40px;
//   height: 40px;
    background-color: #fff !important;
    color: #333 !important;
    transform: rotate(90deg);
}
.ant-carousel :deep(.slick-prev) {
    top: 0;
    left: 30px;
}
.ant-carousel :deep(.slick-next) {
    top: 92%;
    right: calc(100% - 72px) !important;
}
.ant-carousel :deep(.slick-thumb) {
  top: 40px;
  left: 20px;
  width: 100px;
  height: 430px;
//   overflow-y: auto;
//   max-height: 373px;
//   overflow-y: scroll;
overflow: hidden;
  flex-wrap: wrap;
  display: block !important;
  margin: 0;
  position: absolute;
}
.ant-carousel :deep(.slick-thumb li) {
  width: 60px;
  height: 45px;
  margin-top: 10px;
}
.ant-carousel :deep(.slick-thumb li img) {
  width: 100%;
  height: 100%;
  filter: grayscale(100%);
  display: block;
}
.ant-carousel :deep .slick-thumb li.slick-active img {
  filter: grayscale(0%);
}
.ant-carousel :deep(.slick-slide) {
  text-align: center;
  height: 100%;
  line-height: 360px;
  overflow: hidden;
}

.ant-carousel :deep(.slick-slide img) {
  width: 522px;
//   height: auto;
}

.ant-carousel :deep(.slick-arrow.custom-slick-arrow) {
  width: 40px;
  height: 40px;
  text-align: center;
  line-height: 40px;
  font-size: 25px;
  color: #fff;
  background-color: rgba(31, 45, 61, 0.11);
  opacity: 0.3;
  z-index: 1;
}
.ant-carousel :deep(.custom-slick-arrow:before) {
  display: none;
}
.ant-carousel :deep(.custom-slick-arrow:hover) {
  opacity: 0.5;
}

.ant-carousel :deep(.slick-slide h3) {
  color: #fff;
}
</style>
