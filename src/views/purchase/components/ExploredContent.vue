<template>
    <div class="explored-content">
        <div class="title">爆炸图</div>
        <div class="explored-canvas-conten" @click.stop="showDetail(-1)">
            <div class="image-contain">
                <img :src="exploredImageUrl" ref="exploreImg" alt="">
                <canvas ref="exploreCanvas"></canvas>
                <div class="item-pointer" v-for="(item, index) in pointerList" :key="index" 
                    :style="{'left': `${item.start.x - 4}px`, 'top': `${item.start.y - 4}px`}"></div>
                <div class="item-pos" :class="{'item-pos-select': selectIndex===index}" v-for="(item, index) in pointerList" :key="index" 
                    :style="{'left': `${item.end.x - 10}px`, 'top': `${item.end.y - 10}px`}"
                    @mouseenter.stop="showDetail(index)" @mouseleave="showDetail(-1)">
                        {{index + 1}}
                </div>
                <transition name="fade">
                    <div class="component-contain" :style="componentStyle" v-if="selectIndex > -1" @mouseenter.stop="showDetail()" @mouseleave="showDetail(-1)">
                        <div>name</div>
                        <div>type</div>
                        <div>€{{$Util.countFilter(componentDetail[priceKey + 'eur'])}} | ${{$Util.countFilter(componentDetail[priceKey + 'usd'])}}</div>
                        <a-button type="primary" class="disabled" v-if="componentDetail.in_shopping_cart">已在购物车中</a-button>
                        <a-button type="primary" @click="hanldeAddToShopCart" v-else>添加到购物车</a-button>
                    </div>
                </transition>
            </div>
        </div>
    </div>
</template>
<script>
import Core from '../../../core';
export default {
    props: {
        detail: {
            type: Object,
            default: ()=>{}
        }
    },
    computed: {
        priceKey() {
            let priceKey = this.$auth('DISTRIBUTOR') ? 'fob_' : 'purchase_price_'
            console.log('priceKey:', priceKey)
            return priceKey
        }
    },
    mounted () {
        this.canvas = this.$refs.exploreCanvas;
        this.ctx = this.canvas.getContext("2d");
        this.exploredImageUrl = 'https://img.51miz.com/Element/00/90/53/37/8334ff2e_E905337_d68765b3.jpg';
        this.pointerList = [
            {id: null, start: {x: 170, y: 281}, end: {x: 73, y: 461}, target_id: 532, target_type: 1},
            {id: null, start: {x: 444, y: 317}, end: {x: 341, y: 484}, target_id: 532, target_type: 1}
        ]
        this.loadImage(this.exploredImageUrl);
    },
    data() {
        return {
            exploredImageUrl: "",
            pointerList: [],
            selectIndex: -1,
            componentDetail: {},
            componentStyle: {
                'top': '0',
                'left': '0'
            },
            timer: null,
        }
    },
    methods: {
        /** 加载图片，获取宽高 */
        loadImage(url){
            let img = new Image();
            const ths = this;
            
            img.onload = ()=>{
                ths.imageLoadCallback(img.naturalWidth, img.naturalHeight);
                ths.detailImageUrl = url;
                img.onload = null;
            };
            img.src = url;
        },
        imageLoadCallback(width, height) {
            if(width > 800 || height > 800) {
                let rate = width / height;

                this.canvas.width = rate >= 1 ? 800 : width / height * 800;
                this.canvas.height = rate <= 1 ? 800 : height / width * 800;
            } else {
                this.canvas.width = width;
                this.canvas.height = height;
            }
            this.canvasUpdata();
        },
        /** 刷新canvas画布 */
        canvasUpdata(){
            if(!this.canvas) return;
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.lineWidth = 1;
            this.ctx.strokeStyle = '#1890ff';
            this.ctx.beginPath();
            for (var i = 0; i < this.pointerList.length; i++) {
                var p1 = this.pointerList[i].start;
                var p2 = this.pointerList[i].end;
                this.ctx.moveTo(p1.x, p1.y);
                this.ctx.lineTo(p2.x, p2.y);
            }
            this.ctx.stroke();
        },
        /** 显示点位详情 */
        showDetail(index = null) {
            let delay = 350;
            if(index > -1) {
                delay = 150;
            }
            if(this.timer) clearTimeout(this.timer);
            const ths = this;
            ths.timer = setTimeout(()=>{
                index === null ? '' : ths.selectIndex = index;
                if(ths.selectIndex < 0) return;
                ths.componentStyle.top = `${ths.pointerList[ths.selectIndex].end.y + 20}px`;
                ths.componentStyle.left = `${ths.pointerList[ths.selectIndex].end.x - 34}px`;
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
    },
}
</script>
<style lang="less">
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
    .image-contain {
        display: inline-block;
        position: relative;
        max-width: 800px;
        max-height: 800px;
        min-height: 100px;
        .item-pos, .item-pointer {
            position: absolute;
            border-radius: 50px;
            user-select: none;
            cursor: pointer;
            &:hover {
                background-color: @TC_LP;
                color: #ffffff;
            }
        }
        .item-pointer {
            width: 8px;
            height: 8px;
            background-color: @TC_LP;
        }
        .item-pos {
            width: 20px;
            height: 20px;
            line-height: 20px;
            text-align: center;
            font-size: 12px;
            border: 1px solid @TC_LP;
            background-color: white;
        }
        .item-pos-select {
            background-color: @TC_LP;
            color: #ffffff;
        }
        img {
            width: 100%;
            height: 100%;
            border: 1px solid #D2D2D7;
            -webkit-user-drag: none;
        }
        canvas {
            position: absolute;
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;
        }
        .component-contain {
            position: absolute;
            padding: 12px 24px;
            width: 200px;
            border-radius: 5px;
            border: 1px solid @TC_LP;
            background-color: #ffffff;
            &:before, &:after {
                content: "";
                display: block;
                border-width: 12px;
                position: absolute;
                top: -24px;
                left: 22px;
                border-style: solid dashed dashed;
                border-color: transparent transparent @TC_LP  transparent;
                font-size: 0;
                line-height: 0;
            } 
            &:after {
                top: -23px;
                left: 22px;
                border-color: transparent transparent #ffffff transparent;
            }
        }
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
</style>