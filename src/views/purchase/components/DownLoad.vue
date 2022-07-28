<template>
    <div id="DownLoad" class="list-container">
        <div class="download">
            <div class="list" v-for="i in 2">
                <mac-command-outlined class="icon" />
                <a href="#">Datasheet</a>
            </div>
        </div>
    </div>
</template>

<script>
import { MacCommandOutlined } from '@ant-design/icons-vue';
export default {
    name: 'DownLoad',
    components: {
        MacCommandOutlined,
    },
    props: {},
    data() {
        return {
        };
    },
    watch: {},
    computed: {
    },
    mounted() {
    },
    methods: {
    }
};
</script>

<style lang="less" scoped>
#DownLoad {
    padding-top: 40px;
    .download {
        padding: 42px;
        border: 1px solid @TC_car_bc;
        border-radius: 4px;
    }
    a {
        margin-left: 11px;
        color: @TC_D;
        text-decoration: underline;
        font-weight: 500;
        font-size: @fz_md;
    }
    .icon {
        width: 21px;
        height: 21px;
    }
    .list {
        margin-top: 20px;
        &:nth-of-type(1) {
            margin-top: 0;
        }
    }
}
</style>
