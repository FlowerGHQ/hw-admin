<template>
    <div class="banner_container">
        <div class="img-big">
            <img :src="getImgUrl(imgIndex)" />
        </div>
        <div class="img-active" v-if="imgsArr.length > 0">
            <div class="left-icon">
                <left-outlined @click="imgPreview(0)" />
            </div>
            <div class="img-item" ref="imgArea">
                <img
                    class="item"
                    :class="{ active: index === imgIndex }"
                    v-for="(item, index) in imgsArr"
                    :key="index"
                    :src="$Util.imageFilter(item, 2)"
                    @click="previewImg(index)"
                    alt=""
                />
            </div>
            <div class="right-icon">
                <right-outlined @click="imgPreview(1)" />
            </div>
        </div>
    </div>
</template>

<script>
import { LeftOutlined, RightOutlined } from '@ant-design/icons-vue';

export default {
    props: {
        imgs: {
            type: [Object, Array],
            default: () => {
                return [];
            },
        },
        type: {
            Number,
            default: 0,
        },
        item_id: {
            type: Number,
            default: 0,
        },
    },
    components: {
        LeftOutlined,
        RightOutlined,
    },
    data() {
        return {
            imgIndex: 0,
        };
    },
    watch: {
        imgs: {
            handler(n) {
                console.log('watch imgs or details:', n);
            },
        },
        type: {
            handler(n) {
                console.log('watch type:', n);
            },
        },
        item_id: {
            handler(n) {
                console.log('watch item_id:', n);
            },
            immediate: true,
        },
    },
    computed: {
        imgsArr() {
            let activeObj = {};
            // activeObj = this.type === 1 ? this.imgs : this.imgs.find((item) => item.id === this.item_id);
            activeObj = this.type === 1 ? this.imgs : this.imgs[0];
            return activeObj?.logo?.split(',') || [];
        },
    },
    methods: {
        getImgUrl() {
            console.log('getImgUrl:', this.imgsArr);
            return this.$Util.imageFilter(this.imgsArr[this.imgIndex], 2);
        },
        imgPreview(type) {
            if (type === 0) {
                if (this.imgIndex === 0) {
                    this.imgIndex = this.imgsArr.length - 1;
                } else {
                    this.imgIndex--;
                }
            } else {
                if (this.imgIndex === this.imgsArr.length - 1) {
                    this.imgIndex = 0;
                } else {
                    this.imgIndex++;
                }
            }
            //   让当前图片居中
            this.$refs.imgArea.scrollLeft = this.imgIndex * 70;
        },
        previewImg(index) {
            this.imgIndex = index;
        },
    },
};
</script>

<style lang="less" scoped>
.banner_container {
    display: flex;
    flex-direction: column;
    padding: 0 100px;
    max-width: 700px;
    .img-big {
        width: 500px;
        height: 500px;
        padding: 0 20px;
        img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
        // margin-left: 160px;
    }
    .img-active {
        display: flex;
        justify-content: space-between;
        margin-top: 20px;
        align-items: center;
        .left-icon,
        .right-icon {
            cursor: pointer;
            font-size: 20px;
        }
        .img-item {
            height: 50px;
            margin: 0 10px;
            flex: 1;
            display: flex;
            //   超出滚动
            overflow-x: auto;
            overflow-y: hidden;
            cursor: pointer;
            // user-select: none;
            // 双击不可显示蓝色选中
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            user-select: none;
            //   隐藏滚动条
            &::-webkit-scrollbar {
                display: none;
            }
            .item {
                height: 50px;
                width: 50px;
                margin: 0 10px;
                object-fit: cover;
            }
            .active {
                border: 1px solid #e0e0e0;
            }
        }
    }
}
</style>
