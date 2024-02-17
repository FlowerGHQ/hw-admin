<template>
    <a-empty :image="simpleImage" :description="desc" style="margin: 16px" />
</template>

<script>
import { Empty } from 'ant-design-vue';
export default {
    name: 'SimpleImageEmpty',
    props: {
        desc: {
            type: String,
            default: '暂无数据',
        },
    },
    data() {
        return {
            simpleImage: Empty.PRESENTED_IMAGE_SIMPLE,
        };
    },
};
</script>
