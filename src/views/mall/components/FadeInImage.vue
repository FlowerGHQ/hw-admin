<template>
    <div id="FadeInImage">
        <img
            class="default-img"
            :class="loaded ? 'hide' : ''"
            src="data:image/bmp;base64,Qk1OAAAAAAAAADYAAAAoAAAAAwAAAAIAAAABABgAAAAAAAAAAADEDgAAxA4AAAAAAAAAAAAA39/d39/d39/dAAAA39/d39/d39/dAAAA"
        />
        <img class="img" :src="src" @load="load" />
    </div>
</template>

<script>
export default {
    name: 'FadeInImage',
    components: {},
    props: {
        // 图片路径
        src: {
            type: String,
            default: '',
        },
    },
    data() {
        return {
            loaded: false,
        };
    },
    watch: {},
    computed: {},
    created() {},
    mounted() {},
    methods: {
        load() {
            this.loaded = true;
        },
    },
};
</script>
<style lang="less" scoped>
#FadeInImage {
    width: 100%;
    height: 100%;
    position: relative;
    .img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
    .default-img {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: 1s;
    }
    .hide {
        opacity: 0;
    }
}
</style>
