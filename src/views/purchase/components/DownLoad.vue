<template>
    <div id="DownLoad" class="list-container">
        <div class="download">
            <div class="list" v-for="i in tableData">
                <img src="../../../assets/images/default_download.png" class="img" />
                <a @click="handleDownload(i)">{{ i.name }}</a>
            </div>
        </div>
    </div>
</template>

<script>
import Core from '../../../core';
export default {
    name: 'DownLoad',
    components: {},
    props: {
        // target_id: {
        //     type: Number
        // },
        // target_type: {
        //     type: Number
        // },
        tableData: {
            type: Array,
        },
    },
    data() {
        return {
            // tableData: []
        };
    },
    watch: {},
    computed: {},
    mounted() {
        // this.getTableData()
    },
    methods: {
        // getTableData() {  // 获取 表格 数据
        //     this.loading = true;
        //     Core.Api.Attachment.list({
        //         target_id: this.target_id,
        //         target_type: this.target_type,
        //         page: 0
        //     }).then(res => {
        //         console.log("AttachmentFile res", res)
        //         this.tableData = res.list
        //     }).catch(err => {
        //         console.log('AttachmentFile err', err)
        //     }).finally(() => {
        //         this.loading = false;
        //     });
        // },
        // 下载附件
        handleDownload(record) {
            console.log('handleDownload record:', record);
            let url = Core.Const.NET.FILE_URL_PREFIX + record.path;
            window.open(url, '_self');
        },
    },
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
    .img {
        width: 21px;
        height: 21px;
    }
    .list {
        margin-top: 20px;
        display: flex;
        align-items: center;
        &:nth-of-type(1) {
            margin-top: 0;
        }
    }
}
</style>
