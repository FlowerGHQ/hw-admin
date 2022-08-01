<template>
    <div id="DownLoad" class="list-container">
        <div class="download">
            <div class="list" v-for="i in 2">
                <mac-command-outlined class="icon" />
                <a @click="handleDownloadConfirm()">Datasheet</a>
            </div>
        </div>
    </div>
</template>

<script>
import { MacCommandOutlined } from '@ant-design/icons-vue';
import Core from '../../../core';
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
        handleDownloadConfirm(item){ // 下载问询
            let _this = this;
            this.$confirm({
                title: '确认要下载吗？',
                okText: '确定',
                cancelText: '取消',
                onOk() {
                    _this.handleDownload(item);
                }
            })
        },
        handleDownload(item) { // 下载
            this.downloadDisabled = true;
            let path = item.path
            let fileUrl = Core.Const.NET.FILE_URL_PREFIX + path + ''
            window.open(fileUrl, '_blank')
            this.downloadDisabled = false;
        },
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
