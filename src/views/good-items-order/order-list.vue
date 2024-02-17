<template>
    <div id="OrderList">
        <div class="list-container">
            <div class="title-container">
                <div class="title-area">{{ $t('retail.order_list') }}</div>
                <div class="but-box">
                    <a-button
                        type="primary"
                        @click="handleExportConfirm"
                        v-if="activeKey === Core.Const.GOODITEMORDER.Order_Status_Map['1'].value"
                        >导出表格</a-button
                    >

                    <a-button
                        @click="handleMaterialFormwork"
                        v-if="activeKey === Core.Const.GOODITEMORDER.Order_Status_Map['2'].value"
                        type="link"
                        >下载模板</a-button
                    >

                    <a-upload
                        name="file"
                        class="file-uploader"
                        :file-list="upload.fileList"
                        :action="upload.action"
                        :show-upload-list="false"
                        :headers="upload.headers"
                        :data="upload.data"
                        accept=".xlsx,.xls"
                        @change="handleMatterChange"
                    >
                        <a-button
                            class="but-right"
                            v-if="activeKey === Core.Const.GOODITEMORDER.Order_Status_Map['2'].value"
                            >批量发货</a-button
                        >
                    </a-upload>
                </div>
            </div>
            <div class="table-container">
                <a-tabs v-model:activeKey="activeKey" @change="tabChange">
                    <a-tab-pane
                        v-for="item in Core.Const.GOODITEMORDER.Order_Status_Map"
                        :key="item.value"
                        :tab="`${lang == 'zh' ? item.zh : item.en}(${numTab[item.key - 1]})`"
                    ></a-tab-pane>
                </a-tabs>
                <allTable ref="Atable" :activeKey="activeKey" @getTabNumber="tabNumber" />
            </div>
        </div>
    </div>
</template>

<script setup>
import Core from '@/core';
import { computed, getCurrentInstance, onMounted, reactive, ref, provide } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import allTable from './components/custom-table.vue';
const { proxy } = getCurrentInstance();
const router = useRouter();
const lang = computed(() => {
    return proxy.$store.state.lang;
});
const activeKey = ref(0);
activeKey.value = Core.Const.GOODITEMORDER.Order_Status_Map['1'].value;
const numTab = ref([0, 0, 0, 0]);
const Atable = ref();
const upload = reactive({
    action: Core.Const.NET.URL_POINT + '/admin/1/app-order/import-waybill',
    fileList: [],
    headers: {
        ContentType: false,
    },
    data: {
        token: Core.Data.getToken(),
        type: 'xlsx',
    },
});
const tabNumber = obj => {
    Core.Api.GoodItemsOrder.statusCount()
        .then(res => {
            numTab.value[0] = res?.total;
            numTab.value[1] = res?.wait_send_count;
            numTab.value[2] = res?.wait_sake_count;
            numTab.value[3] = res?.completed_count;
        })
        .catch(err => {
            console.log('getTableData err:', err);
        })
        .finally(() => {});
};
/**provide
 *用法:发布更新方法
 *注释掉暂时不用
 */
// provide('tabNumber', tabNumber);
const tabChange = e => {
    proxy.$nextTick(() => {
        Atable.value.handleSearchReset();
    });
};

const handleExportConfirm = () => {
    // 确认物料是否导出
    proxy.$confirm({
        title: proxy.$t('pop_up.sure') + proxy.$t('n.export') + '?',
        okText: proxy.$t('def.sure'),
        cancelText: proxy.$t('def.cancel'),
        onOk() {
            handleMaterialExport();
        },
    });
};
const handleMaterialExport = () => {
    // 物料导出
    /*  let form = Core.Util.deepCopy(this.searchForm);
                for (const key in form) {
                    form[key] = form[key] || ''
                }
            */
    let exportUrl = Core.Api.Export.goodItemExport();
    console.log('handleMaterialExport exportUrl', exportUrl);
    window.open(exportUrl, '_blank');
};

const handleMaterialFormwork = () => {
    // 下载模板
    /*  let form = Core.Util.deepCopy(this.searchForm);
                for (const key in form) {
                    form[key] = form[key] || ''
                }
            */
    let exportUrl = Core.Api.Export.downloadItem();
    console.log('handleMaterialFormwork 6666 exportUrl', exportUrl);
    window.open(exportUrl, '_blank');
};

// 上传文件(批量导入)
const handleMatterChange = ({ file, fileList }) => {
    console.log('handleMatterChange 666  status:', file.status, 'file:', file);
    if (file.status == 'done') {
        if (file.response && file.response.code > 0) {
            return proxy.$message.error(file.response.message);
        } else {
            Atable.value.handleSearchReset();
            return proxy.$message.success(proxy.$t('pop_up.uploaded'));
        }
    }
    upload.fileList = fileList;
};
</script>
<style lang="less" scoped>
.but-right {
    margin-left: 12px;
}
.but-box {
    height: 20px;
}
</style>
