<template>
    <div class="explored-content" v-if="tabsArray.length > 0">
        <div class="title" v-if="show">{{ $t('i.view') }}</div>
        <div class="explore-content">
            <a-carousel autoplay class="carousel-list">
                <div class="carousel-item" v-for="(item,i) of tabsArray" :key="i">
                    <img :src="$Util.imageFilter(item.img)"/>
                    <canvas :ref="`exploreCanvas${i}`"></canvas>
                    <div
                        class="point-start"
                        v-for="(point, j) in (item.item_component_list || [])"
                        :key="j"
                        :style="{'left': `${(point.start.x * (point.rate || 1)) - 4}px`, 'top': `${(point.start.y * (point.rate || 1))- 4}px`}"></div>
                    <div
                        class="point-end"
                        :class="{'point-end-select': selectIndex===j}"
                        v-for="(point, j) in (item.item_component_list || [])"
                        :key="j"
                        :style="{'left': `${(point.end.x * (point.rate || 1)) - 4* (point.rate || 1)}px`, 'top': `${(point.end.y * (point.rate || 1))- 4* (point.rate || 1)}px`}"
                        @mouseenter.stop="showDetail(i,j)" @mouseleave="showDetail(-1)"
                    >
                        {{j + 1}}
                    </div>
                </div>
            </a-carousel>
            <transition name="fade">
                <div
                    class="component-contain"
                    v-if="selectIndex > -1"
                    :style="componentStyle"
                    @mouseenter.stop="showDetail(currentExplore.i, currentExplore.j)"
                    @mouseleave="showDetail(-1)">
                    <div class="contain-name">
                        <i class="icon i_skew-bg" />
                        <span class="icon-name">产品名称</span>
                        {{ componentDetail.name }}
                    </div>
                    <div class="contain-type">
                        <div class="type-left">型号:&nbsp;{{ componentDetail.model}}</div>
                        <div class="type-left">€{{$Util.countFilter(componentDetail[priceKey + 'eur'])}} | ${{$Util.countFilter(componentDetail[priceKey + 'usd'])}}</div>
                    </div>
                    <div class="edit-btn">
                        <a-button type="primary" class="disabled" v-if="componentDetail.in_shopping_cart">已在购物车中</a-button>
                        <a-button type="primary" @click="hanldeAddToShopCart" v-else>添加到购物车</a-button> -->
                    </div>
                </div>
            </transition>
        </div>
    </div>
    <div class="export-lists">
         <div class="card-left">
            <div class="serial—number">
                <div class="serial">{{1}}</div>
            </div>
            <div class="card-info">
                <div class="title">{{ 1111 }}</div>
                <div class="info">{{ 22222 }}</div>
                <!-- <ul>
                    <li v-for="attr in data.attr_list">{{ $i18n.locale =='zh' ? attr.attr_def_name : attr.attr_def_key }}：{{ $i18n.locale =='zh' ? attr.value : attr.value_en }}</li>
                </ul> -->
                <div class="price">¥ 320.00</div>
            </div>
        </div>
        <div class="shop-card">
            <div class="shop-top">
                <div class="spot-box">
                    <div class="spot"></div>
                    <span>库存：89</span>
                </div>
                <div class="shop-price">€{{1234567}} | ${{1234}}</div>
            </div>
            <div class="shop-bottom">
                <div class="cart-box">
                    <div class="num-box">
                        <div class="icon add" @click.stop="add">
                            <caret-up-outlined />
                        </div>
                        <a-input-number id="inputNumber" v-model:value="value" :bordered="false" :controls="false" :min="1" :max="999" class="num"/>
                        <div class="icon minus" @click.stop="minus">
                            <caret-down-outlined />
                        </div>
                    </div>
                    <div class="cart" @click="hanldeAddToShopCart">
                        <shopping-cart-outlined class="icon"/>
                    </div>
                </div>
                <div class="stars" @click="hanldeAddToFavorite">
                    <star-outlined />
                    <span class="star-text">{{ 12345 }}</span>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { get } from 'lodash';
import Core from '../../../core';
import { CaretUpOutlined, CaretDownOutlined, ShoppingCartOutlined, StarOutlined } from '@ant-design/icons-vue';
export default {
    props: {
        show: {
            type: Boolean,
            default: true,
        }
    },
    computed: {
        priceKey() {
            let priceKey = this.$auth('DISTRIBUTOR') ? 'fob_' : 'purchase_price_'
            console.log('priceKey:', priceKey)
            return priceKey
        }
    },
     components: {
        CaretUpOutlined,
        CaretDownOutlined,
        ShoppingCartOutlined,
        StarOutlined,
    },
    mounted () {},
    data() {
        return {
            Core,
            id: undefined,

            canvasGroup: [],

            pointerList: [],
            tabsArray: [],

            selectIndex: -1,
            componentDetail: {},
            componentStyle: {
                'top': '0',
                'left': '0'
            },
            timer: null,
            currentExplore: {
                i: null,
                j: null
            },


            value: 1
        }
    },
    methods: {
        /** 获取 商品爆炸图 */
        getItemExploreList(id) {
            if(!id) return;
            const ths = this;
            this.pointerList = [];
            this.tabsArray = [];
            Core.Api.Item.getItemComponent({ target_id: id, target_type: Core.Const.ITEM_COMPONENT_SET.TARGET_TYPE.ITEM }).then((res)=>{
                this.tabsArray = get(res, "list.list" , []);
                this.parsePoint();
                ths.$nextTick(()=>{
                    ths.tabsArray.forEach((item, index) => {
                        ths.loadImage(item.img, index);
                    })
                })
                // 无爆炸图数据
                console.log('getItemExploreList res', res);
                if(res.list.length) {
                    this.$emit('noData',false)
                }
            }).catch( err => {
                console.log('getItemExploreList err', err);
            });
        },
        parsePoint () {
            this.tabsArray.forEach(item => {
                let list = get(item, "item_component_list", []);
                list.forEach(point => {
                    point.start = point.start_point ? JSON.parse(point.start_point) : { x: 50, y: 50 };
                    point.end = point.end_point ? JSON.parse(point.end_point) : { x: 50, y: 150 };
                })
            })
        },
        /** 加载图片，获取宽高 */
        loadImage(url, index){
            let img = new Image();
            const ths = this;

            img.onload = ()=>{
                ths.imageLoadCallback(img.naturalWidth, img.naturalHeight, index);
                img.onload = null;
            };
            img.src = this.$Util.imageFilter(url);
        },
        imageLoadCallback(width, height, index) {
            let cvs = this.$refs[`exploreCanvas${index}`];
            if(!cvs) return;
            // if(cvs.length > 0) return;
            if(Array.isArray(cvs) === false) {
                cvs = [cvs]
            }
            this.canvasGroup[index] = cvs
            // if(cvs.length > 0) this.canvasGroup[index] = cvs;
            // else return;
            let rate = width > 800 ? 1 : 800 / width;
            cvs.forEach(canvas=>{
                canvas.width = 800;
                canvas.height = height / width * 800;
                this.canvasUpdata(canvas, index, rate);
            })
        },
        /** 刷新canvas画布 */
        canvasUpdata(cv, index, rate){
            let ctx = cv.getContext("2d");
            let pointerList = get(this.tabsArray, `[${index}].item_component_list`, []);

            ctx.clearRect(0, 0, cv.width, cv.height);
            ctx.lineWidth = 1;
            ctx.strokeStyle = '#1890ff';
            ctx.beginPath();
            pointerList.forEach(item=>{
                item.rate = rate;
                ctx.moveTo(get(item,'start.x', 0) * rate , get(item,'start.y', 0) * rate);
                ctx.lineTo(get(item,'end.x', 0) * rate, get(item,'end.y', 0) * rate);
            })
            ctx.stroke();
        },
        /** 显示点位详情 */
        showDetail(i, j) {
            let delay = 350;
            if(i > -1) {
                delay = 150;
            }
            if(this.timer) clearTimeout(this.timer);
            const ths = this;
            ths.timer = setTimeout(()=>{
                j === null ? '' : ths.selectIndex = j;
                ths.currentExplore = { i, j };
                if(ths.selectIndex < 0) return;
                let rate = get(ths.tabsArray, `[${i}].item_component_list[${ths.selectIndex }].rate`, 1);
                let y = (get(ths.tabsArray, `[${i}].item_component_list[${ths.selectIndex }].end.y`, 0) + 10) * rate;
                let x = (get(ths.tabsArray, `[${i}].item_component_list[${ths.selectIndex }].end.x`, 0) - 15) * rate;

                ths.componentDetail = get(ths.tabsArray, `[${i}].item_component_list[${ths.selectIndex }].item`, {})
                ths.componentStyle.top = `${y}px`;
                ths.componentStyle.left = `${x}px`;
                ths.timer = null;
            }, delay)
        },
        // 添加到购物车
        hanldeAddToShopCart() {
            Core.Api.ShopCart.save({
                item_id: this.componentDetail.id,
                amount: 1,
                price: this.componentDetail.purchase_price
            }).then(res => {
                console.log('hanldeAddToShopCart res:', res)
                this.$message.success('添加成功')
                this.componentDetail.in_shopping_cart = true;
            })
        },


        // 增加商品数量
        add() {
            this.value++;
        },
        // 减少商品数量
        minus() {
            if(this.value == 1) return
            this.value--;
        },
    },
}
</script>
<style lang="less" scoped>
.explored-content {
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
        width: 800px;
        .carousel-item {
            position: relative;
            padding-bottom: 150px;
            >img {
                width: 800px;
            }
            canvas {
                position: absolute;
                top: 0;
                right: 0;
                bottom: 0;
                left: 0;
            }
            .point-end, .point-start {
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
        background-color: @BG_LP;
        border: 1px solid @BG_LP;
        font-size: 0;
        &:before, &:after {
            content: "";
            display: block;
            border-width: 5px;
            position: absolute;
            top: -10px;
            left: 30px;
            border-style: solid dashed dashed;
            border-color: transparent transparent @BG_LP  transparent;
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
            }
            .icon-name {
                position: absolute;
                top: 0;
                left: 16px;
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
            text-align: center;
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
.fade-enter-from, .fade-leave-to {
    opacity: 0;
}

.export-lists {
    border: 1px solid @TC_car_bc;
    border-radius: 4px;
    padding: 10px;
    display: flex;
    .card-left {
        flex: 1;
        display: flex;
        overflow: hidden;
        img {
            width: 130px;
            min-height: 99px;
        }
        .card-info {
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            color: @TC_car_title;
            font-size: @fz_sm;
            padding: 20px 10px;
            overflow: hidden;
            .title {
                font-size: @fz_bs;
                font-weight: 600;
                // margin-top: 12px;
                .ell()
            }
            .info {
                // margin-top: 12px;
                .ell()
            }
            .price {
                // margin-top: 6px;
                color: @TC_car_price;
                font-size: @fz_sm;
                .ell()
            }
        }
        .serial—number {
            width: 170px;
            height: 100%;
            
            .serial {
                display: inline-block;
                width: 30px;
                height: 30px;
                line-height: 30px;
                box-sizing: border-box;
                border: 1px solid #006EF9;
                text-align: center;
                border-radius: 50%;
            }
            .fcc()
        }
    }
    .shop-card {
        width: 300px;
        background: rgba(128, 182, 252, .2);
        border-radius: 4px;
        padding: 12px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        .shop-top {
            display: flex;
            justify-content: space-between;
            .spot-box {
                font-size: @fz_sm;
                color: @TC_car_title;
                display: flex;
                align-items: center;
                .spot {
                    width: 8px;
                    height: 8px;
                    background: #FF9918;
                    border-radius: 50%;
                    margin-right: 7px;
                }
            }
            .shop-price {
                color: @TC_car_price;
                font-size: @fz_md;
            }
        }
        .shop-bottom {
            margin-top: 25px;
            height: 36px;
            align-items: center;
            display: flex;
            justify-content: space-between;
            .cart-box {
                display: flex;
                .num-box {
                    width: 88px;
                    background-color: @white;
                    display: flex;
                    padding: 1px;
                    .icon {
                        background-color: #D9D9D9;
                        width: 26px;
                        .fcc()
                    }
                    .num {
                        flex: 1;
                    }
                }
                .cart {
                    width: 36px;
                    height: 36px;
                    background-color: #006EF9;
                    margin-left: 10px;
                    .fcc()
                }
            }
            .stars {
                color: @TC_D;
                font-size: @fz_bs;
                margin-top: 14px;
                .star-text {
                    margin-left: 6px;
                }
            }
        }
    }
}

//  ul {
//     // list-style: disc;
//     // margin-top: 20px;
//     width: 100%;
//     color: @TC_car_info;
//     font-size: @fz_sm;
//     li {
//         // margin-top: 10px;
//         position: relative;
//         padding-left: 14px;
//         &:nth-of-type(1) {
//             margin-top: 0;
//         }
//         .ell();
//         &:before {
//             position: absolute;
//             left: 0;
//             top: 50%;
//             transform: translateY(-50%);
//             content: "";
//             width: 6px;
//             height: 6px;
//             display: inline-block;
//             border-radius: 50%;
//             background: #515154;
//             vertical-align: middle;
//             margin-right: 14px;
//         }
//     }
// }
.ant-input-number :deep(.ant-input-number-input-wrap) {
    width: 100%;
    height: 100%;
}

.ant-input-number :deep(.ant-input-number-input) {
    width: 100%;
    height: 100%;
    padding: 0;
    text-align: center;
}
</style>
