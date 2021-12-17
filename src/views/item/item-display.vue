<template>
<div id="ItemDisplay">
    <div class="info-content">
        <div class="name"></div>
    </div>
    <div class="imgs-content">
        <a-carousel autoplay>
            <div><h3>1</h3></div>
            <div><h3>2</h3></div>
            <div><h3>3</h3></div>
            <div><h3>4</h3></div>
        </a-carousel>
    </div>
</div>
</template>

<script>
import Core from '../../core';
export default {
    name: 'ItemDisplay',
    components: {},
    props: {},
    data() {
        return {
            loginType: Core.Data.getLoginType(),
            // 加载
            loading: false,

            id: '',
            detail: {},
        };
    },
    watch: {},
    computed: {},
    mounted() {
        this.id = Number(this.$route.query.id) || 0
        this.getItemDetail();
    },
    methods: {
        // 获取商品详情
        getItemDetail() {
            this.loading = true;
            Core.Api.Item.detail({
                id: this.form.id,
            }).then(res => {
                console.log('getItemDetail res', res)
                this.detail = res
                this.detail.imgs = this.detail.imgs ? this.detail.imgs.split(',') : []
            }).catch(err => {
                console.log('getItemDetail err', err)
            }).finally(() => {
                this.loading = false;
            });
        },
    }
};
</script>

<style lang="less" scoped>
// #ItemDisplay {}
</style>