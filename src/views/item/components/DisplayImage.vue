<template>
    <div class="DisplayImage">
        <div class="title">{{ $t(/*商品封面*/ 'i.cover') }} ({{ coverImageList.length }})</div>
        <div class="img-list mb40">
            <a-image
                v-for="(img, index) in coverImageList"
                :key="index"
                :width="138"
                :height="136"
                :src="$Util.imageFilter(img)"
                :fallback="$t('def.none')"
            />
        </div>
        <div class="title">{{ $t(/*详情图*/ 'i.picture') }} ({{ detailImageList.length }})</div>
        <div class="img-list mb40">
            <a-image
                v-for="(img, index) in detailImageList"
                :key="index"
                :width="138"
                :height="136"
                :src="$Util.imageFilter(img)"
                :fallback="$t('def.none')"
            />
        </div>
        <div class="title">{{ $t(/*规格图*/ 'i.spec_drawing') }} ({{ specImageList.length }})</div>
        <div class="img-list">
            <a-image
                v-for="(img, index) in specImageList"
                :key="index"
                :width="138"
                :height="136"
                :src="$Util.imageFilter(img)"
                :fallback="$t('def.none')"
            />
        </div>
    </div>
</template>

<script>
import Core from '../../../core';

export default {
    name: 'DisplayImage',
    props: {
        coverImageList: {
            type: Array,
            default: [],
        },
        detailImageList: {
            type: Array,
            default: [],
        },
        specImageList: {
            type: Array,
            default: [],
        },
    },
    data() {
        return {
            // 加载
            loading: false,
        };
    },
    computed: {},
    mounted() {},
    methods: {},
};
</script>

<style lang="less" scoped>
.DisplayImage {
    .title {
        margin-bottom: 16px;
        color: #1d2129;
        font-size: 16px;
        font-style: normal;
        font-weight: 500;
        line-height: normal;
    }

    .img-list {
        width: 100%;
        display: flex;
        flex-wrap: wrap;
        &.mb40 {
            margin-bottom: 40px;
        }
    }
    :deep(.ant-image) {
        margin-right: 14px;
        margin-bottom: 14px;
        cursor: pointer;
        .ant-image-img {
            object-fit: cover;
            height: 100%;
        }
    }
    // .img-list :deep(.ant-image):last-child {
    //     margin-right: 0;
    // }
}
</style>
