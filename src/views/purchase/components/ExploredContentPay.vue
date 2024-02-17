<template>
    <!--  class="bom-content" -->
    <div class="explored-content" v-if="tabsArray.length > 0">
        <!-- <div class="title">{{ $t('i.view') }}</div> -->
        <div class="explore-content">
            <div class="carousel-list">
                <div class="carousel-item" v-for="(item, i) of tabsArray" :key="i">
                    <img :class="{ carouselImg: mediaWidth }" :src="$Util.imageFilter(item.img)" />
                    <canvas :ref="`exploreCanvas${i}`"></canvas>
                    <div
                        class="point-start"
                        v-for="(point, j) in item.item_component_list || []"
                        :key="j"
                        :style="{
                            left: `${point.start.x * (point.rate || 1) - 4}px`,
                            top: `${point.start.y * (point.rate || 1) - 4}px`,
                        }"
                    ></div>
                    <!-- :class="{'point-end-select': selectIndex===j}" -->
                    <div
                        class="point-end"
                        :class="{ 'point-end-select': item.item_component_list[j].target_id === pointIndex }"
                        v-for="(point, j) in item.item_component_list || []"
                        :key="j"
                        :style="{
                            left: `${point.end.x * (point.rate || 1) - 4 * (point.rate || 1)}px`,
                            top: `${point.end.y * (point.rate || 1) - 4 * (point.rate || 1)}px`,
                        }"
                        @mouseenter.stop="showDetail(i, j)"
                        @mouseleave="showDetail(-1)"
                        @click="addPoint(item.item_component_list[j].target_id)"
                    >
                        {{ point.index }}
                    </div>
                </div>
            </div>
            <transition name="fade">
                <div
                    class="component-contain"
                    v-if="selectIndex > -1"
                    :style="componentStyle"
                    @mouseenter.stop="showDetail(currentExplore.i, currentExplore.j)"
                    @mouseleave="showDetail(-1)"
                >
                    <div class="contain-name">
                        <i class="icon i_skew-bg" />
                        <span class="icon-name">{{ $t('n.name') }}</span>
                        <!--                        {{ componentDetail.name }}-->
                        <span v-if="$i18n.locale === 'zh'"> {{ componentDetail.name }}</span>
                        <span v-if="$i18n.locale === 'en'"> {{ componentDetail.name_en }}</span>
                    </div>
                    <div class="contain-type">
                        <div class="type-left">{{ $t('def.model') }}:&nbsp;{{ componentDetail.model }}</div>
                        <div class="type-left" v-if="currency === 'eur' || currency === 'EUR'">
                            €{{ $Util.countFilter(componentDetail[priceKey + 'eur']) }}
                        </div>
                        <div class="type-left" v-else>${{ $Util.countFilter(componentDetail[priceKey + 'usd']) }}</div>
                        <!--                        <div class="type-left">€{{$Util.countFilter(componentDetail[priceKey + 'eur'])}} | ${{$Util.countFilter(componentDetail[priceKey + 'usd'])}}</div>-->
                    </div>
                    <div class="edit-btn">
                        <!-- <a-button class="disabled" v-if="componentDetail.in_shopping_cart">{{ $t('i.already') }}</a-button> -->
                        <a-button @click="hanldeAddToShopCart">{{ $t('i.cart') }}</a-button>
                    </div>
                </div>
            </transition>
        </div>
    </div>
    <SimpleImageEmpty v-else :desc="$t('p.no_item_explode')" />
    <div class="explored-lists" v-if="exploredList.length && tabsArray.length > 0">
        <ExploredContentPayCard
            v-for="(list, index) in tabsArray[0].item_component_list"
            :key="index"
            :class="{ active: list.id === pointIndex }"
            :data="list.item"
            :num="list.index"
            @change="exploreList"
            @click="addPoint(list.item.id)"
        />
    </div>
    <SimpleImageEmpty v-else :desc="$t('i.no_bom_list')" class="mt" />
</template>
<script>
import { ZoomInOutlined, ZoomOutOutlined } from '@ant-design/icons-vue';
import SimpleImageEmpty from '../../../components/common/SimpleImageEmpty.vue';
import Core from '../../../core';
import { get } from 'lodash';
import ExploredContentPayCard from './ExploredContentPayCard.vue';
export default {
    props: {
        id: Number,
        data: Array,
    },
    computed: {
        priceKey() {
            let priceKey = this.$auth('DISTRIBUTOR') ? 'fob_' : 'purchase_price_';
            console.log('priceKey:', priceKey);
            return priceKey;
        },
    },
    components: {
        SimpleImageEmpty,
        ZoomInOutlined,
        ZoomOutOutlined,
        ExploredContentPayCard,
    },
    mounted() {
        this.getItemExploreList(this.id);
        this.exploredList = this.data;
        this.currency = Core.Data.getCurrency();
        // 适配
        if (window.screen.width <= 1280) {
            this.mediaWidth = '700px';
        }
    },
    watch: {
        id: function (newVal, oldVal) {
            this.getItemExploreList(newVal);
        },
        data: function (newVal) {
            this.exploredList = newVal;
        },
    },
    data() {
        return {
            // id: 248,

            // 无爆炸图
            explodeShow: true,
            // 爆炸图列表
            exploredList: [],
            // 选中的指示点
            pointIndex: -1,

            Core,

            canvasGroup: [],

            pointerList: [],
            tabsArray: [],

            selectIndex: -1,
            componentDetail: {},
            componentStyle: {
                top: '0',
                left: '0',
            },
            timer: null,
            currentExplore: {
                i: null,
                j: null,
            },
            currency: '',
            mediaWidth: null,
        };
    },
    methods: {
        /** 获取 商品爆炸图 */
        getItemExploreList(id) {
            if (!id) return;
            const ths = this;
            this.pointerList = [];
            this.tabsArray = [];
            Core.Api.Item.getItemComponent({
                target_id: id,
                target_type: Core.Const.ITEM_COMPONENT_SET.TARGET_TYPE.ITEM_CATEGORY,
                has_price: true,
            })
                .then(res => {
                    this.tabsArray = get(res, 'list.list', []);
                    this.parsePoint();
                    ths.$nextTick(() => {
                        ths.tabsArray.forEach((item, index) => {
                            ths.loadImage(item.img, index);
                        });
                    });
                    // 无爆炸图数据
                    // console.log('getItemExploreList res', res);
                    if (res.list.count) {
                        this.$emit('noData', false);
                    }
                })
                .catch(err => {
                    console.log('getItemExploreList err', err);
                });
        },
        parsePoint() {
            this.tabsArray.forEach(item => {
                let list = get(item, 'item_component_list', []);
                list.forEach(point => {
                    point.start = point.start_point ? JSON.parse(point.start_point) : { x: 50, y: 50 };
                    point.end = point.end_point ? JSON.parse(point.end_point) : { x: 50, y: 150 };
                });
            });
        },
        /** 加载图片，获取宽高 */
        loadImage(url, index) {
            let img = new Image();
            const ths = this;

            img.onload = () => {
                ths.imageLoadCallback(img.naturalWidth, img.naturalHeight, index);
                img.onload = null;
            };
            img.src = this.$Util.imageFilter(url);
        },
        imageLoadCallback(width, height, index) {
            let cvs = this.$refs[`exploreCanvas${index}`];
            if (!cvs) return;
            // if(cvs.length > 0) return;
            if (Array.isArray(cvs) === false) {
                cvs = [cvs];
            }
            this.canvasGroup[index] = cvs;
            // if(cvs.length > 0) this.canvasGroup[index] = cvs;
            // else return;
            let rate = null;
            // 适配照片的
            if (this.mediaWidth) {
                rate = this.mediaWidth.replace(/['px']/g, '') / 800;
            } else {
                rate = width > 800 ? 1 : 800 / width;
            }
            cvs.forEach(canvas => {
                canvas.width = 800;
                canvas.height = (height / width) * 800;
                this.canvasUpdata(canvas, index, rate);
            });
        },
        /** 刷新canvas画布 */
        canvasUpdata(cv, index, rate) {
            let ctx = cv.getContext('2d');
            let pointerList = get(this.tabsArray, `[${index}].item_component_list`, []);

            ctx.clearRect(0, 0, cv.width, cv.height);
            ctx.lineWidth = 1;
            ctx.strokeStyle = '#1890ff';
            ctx.beginPath();
            pointerList.forEach(item => {
                item.rate = rate;
                ctx.moveTo(get(item, 'start.x', 0) * rate, get(item, 'start.y', 0) * rate);
                ctx.lineTo(get(item, 'end.x', 0) * rate, get(item, 'end.y', 0) * rate);
            });
            ctx.stroke();
        },
        /** 显示点位详情 */
        showDetail(i, j) {
            let delay = 350;
            if (i > -1) {
                delay = 150;
            }
            if (this.timer) clearTimeout(this.timer);
            const ths = this;
            ths.timer = setTimeout(() => {
                j === null ? '' : (ths.selectIndex = j);
                ths.currentExplore = { i, j };
                if (ths.selectIndex < 0) return;
                let rate = get(ths.tabsArray, `[${i}].item_component_list[${ths.selectIndex}].rate`, 1);
                let y = (get(ths.tabsArray, `[${i}].item_component_list[${ths.selectIndex}].end.y`, 0) + 10) * rate;
                let x = (get(ths.tabsArray, `[${i}].item_component_list[${ths.selectIndex}].end.x`, 0) - 15) * rate;

                ths.componentDetail = get(ths.tabsArray, `[${i}].item_component_list[${ths.selectIndex}].item`, {});
                ths.componentStyle.top = `${y + 12}px`;
                ths.componentStyle.left = `${x - 15}px`;
                ths.timer = null;
            }, delay);
        },

        // 无爆炸图数据
        noExplodeData(data) {
            this.explodeShow = data;
        },

        // 重新获取爆炸图列表数据
        exploreList() {
            this.$emit('change');
        },

        // 增加指示点
        addPoint(id) {
            console.log(id);
            this.pointIndex = id;
        },
        // 添加到购物车
        hanldeAddToShopCart() {
            Core.Api.ShopCart.save({
                item_id: this.componentDetail.id,
                amount: 1,
                price: this.componentDetail.purchase_price,
            }).then(res => {
                console.log('hanldeAddToShopCart res:', res);
                this.$message.success(this.$t('pop_up.add'));
                this.componentDetail.in_shopping_cart = true;
            });
        },
    },
};
</script>
<style lang="less" scoped>
.explored-lists {
    margin-top: 40px;
}
.explored-content {
    position: relative;
    z-index: 10;
    margin-top: 30px;
    width: 100%;
    * {
        user-select: none;
    }
    > .title {
        font-weight: 500;
        font-size: 16px;
        line-height: 22px;
        color: #000000;
        margin-bottom: 22px;
    }
    .carousel-list {
        width: 900px;
        max-height: 600px;
        overflow: hidden;
        .carousel-item {
            position: relative;
            padding-bottom: 150px;
            > img {
                width: 900px;
            }
            canvas {
                position: absolute;
                top: 0;
                right: 0;
                bottom: 0;
                left: 0;
            }
            .point-end,
            .point-start {
                position: absolute;
                border-radius: 50px;
                user-select: none;
                &:hover {
                    background-color: @TC_LP;
                    color: @TC_L;
                }
            }
            .point-start {
                width: 8px;
                height: 8px;
                background-color: @TC_LP;
            }
            .point-end {
                width: 20px;
                height: 20px;
                line-height: 20px;
                text-align: center;
                font-size: 12px;
                border: 1px solid @TC_LP;
                background-color: white;
                cursor: pointer;
            }
            .point-end-select {
                background-color: @TC_LP;
                color: @TC_L;
            }
        }
    }
    .explore-content {
        position: relative;
    }
    .component-contain {
        position: absolute;
        display: flex;
        flex-wrap: wrap;
        z-index: 2;
        padding: 12px 0;
        width: 250px;
        border-radius: 2px;
        // background-color: @BG_LP;
        background-color: @primary;
        border: 1px solid @BG_LP;
        font-size: 0;
        &:before,
        &:after {
            content: '';
            display: block;
            border-width: 5px;
            position: absolute;
            top: -10px;
            left: 30px;
            border-style: solid dashed dashed;
            border-color: transparent transparent @BG_LP transparent;
            font-size: 0;
            line-height: 0;
        }
        &:after {
            top: -9px;
            left: 30px;
            border-color: transparent transparent @BG_LP transparent;
        }
        .contain-name {
            position: relative;
            padding: 0 16px;
            width: 100%;
            height: 20px;
            line-height: 20px;
            font-size: 16px;
            color: @TC_L;
            text-align: left;
            overflow: hidden; //超出的文本隐藏
            text-overflow: ellipsis; //溢出用省略号显示
            white-space: nowrap;
            .i_skew-bg {
                font-size: 16px;
                color: @TC_L;
                margin-right: 10px;
            }
            .icon-name {
                position: absolute;
                top: 0;
                left: 26px;
                font-style: italic;
                font-size: 12px;
                font-weight: bold;
                color: @TC_LP;
                transform-origin: 50% 50%;
                transform: scale(90%, 90%);
            }
        }
        .contain-type {
            display: flex;
            margin-top: 12px;
            padding: 0 16px;
            width: 100%;
            flex-wrap: wrap;
        }
        .type-left {
            width: 100%;
            color: @TC_L;
            font-size: 16px;
            overflow: hidden; //超出的文本隐藏
            text-overflow: ellipsis; //溢出用省略号显示
            white-space: nowrap;
        }
        .edit-btn {
            margin-top: 12px;
            width: 100%;
            text-align: right;
            margin-right: 20px;
            :deep(span) {
                color: @primary !important;
            }
        }
        // position: absolute;
        // padding: 12px 24px;
        // width: 200px;
        // border-radius: 5px;
        // border: 1px solid @BG_LP;
        // background-color: @BG_N;
        // &:before, &:after {
        //     content: "";
        //     display: block;
        //     border-width: 12px;
        //     position: absolute;
        //     top: -24px;
        //     left: 22px;
        //     border-style: solid dashed dashed;
        //     border-color: transparent transparent @BG_LP  transparent;
        //     font-size: 0;
        //     line-height: 0;
        // }
        // &:after {
        //     top: -23px;
        //     left: 22px;
        //     border-color: transparent transparent @BG_N transparent;
        // }
    }
}
.fade-enter-active {
    transition: opacity 0.15s ease;
}
.fade-leave-active {
    transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

.mt {
    margin-top: 40px !important;
}
// 图片适配
.carouselImg {
    width: v-bind('mediaWidth') !important;
}
</style>
