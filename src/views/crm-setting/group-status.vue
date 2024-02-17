<template>
    <div id="CustomerList">
        <div class="list-container">
            <div class="title-container">
                <div class="title-area">{{ $t('crm_g.business_opportunities_phase') }}</div>
                <div class="btns-area">
                    <a-button type="primary" @click="addBoStatusGroup" v-if="$auth('crm-bo-status.save')"
                        ><i class="icon i_add" />{{ $t('crm_b.save') }}</a-button
                    >
                </div>
            </div>
            <div class="table-container">
                <a-table :columns="tableColumns" :data-source="tableData" :scroll="{ x: true }" :pagination="false">
                    <template #headerCell="{ title }">
                        {{ $t(title) }}
                    </template>
                    <template #bodyCell="{ column, text, record, index }">
                        <template v-if="column.key === 'time'">
                            {{ $Util.timeFilter(text) }}
                        </template>
                        <template v-if="column.key === 'status'">
                            {{ $t('crm_g.underway') }}
                        </template>
                        <template v-if="column.key === 'operation'">
                            <a-button
                                type="link"
                                @click="routerChange('up', record, index)"
                                :disabled="index === 0"
                                v-if="$auth('crm-bo-status.save')"
                                ><i class="icon i_detail" />{{ $t('crm_g.up') }}</a-button
                            >
                            <a-button
                                type="link"
                                @click="routerChange('down', record, index)"
                                :disabled="index === tableData.length - 1"
                                v-if="$auth('crm-bo-status.save')"
                                ><i class="icon i_detail" />{{ $t('crm_g.down') }}</a-button
                            >
                            <a-button
                                type="link"
                                @click="routerChange('edit', record, index)"
                                v-if="$auth('crm-bo-status.save')"
                                ><i class="icon i_edit" />{{ $t('def.edit') }}</a-button
                            >
                            <a-button
                                type="link"
                                @click="handleDelete(index)"
                                class="danger"
                                v-if="$auth('crm-bo-status.delete')"
                                ><i class="icon i_delete" /> {{ $t('def.delete') }}</a-button
                            >
                        </template>
                    </template>
                </a-table>
            </div>
            <a-modal
                :title="$t('ad.add')"
                v-model:visible="modalShow"
                :after-close="handleClose"
                :maskClosable="false"
                class="receiver-address-edit-modal"
            >
                <div class="modal-content">
                    <div class="form-item required">
                        <div class="key">{{ $t('crm_g.sales_stage') }}:</div>
                        <div class="value">
                            <a-input v-model:value="form.zh" :placeholder="$t('def.input')" />
                        </div>
                    </div>
                    <div class="form-item required">
                        <div class="key">{{ $t('crm_g.sales_stage_en') }}:</div>
                        <div class="value">
                            <a-input v-model:value="form.en" :placeholder="$t('def.input')" />
                        </div>
                    </div>
                    <!--                    <div class="form-item required">-->
                    <!--                        <div class="key">{{ $t('crm_g.phase_type') }}:</div>-->
                    <!--                        <div class="value">-->
                    <!--                            <a-input v-model:value="form.status" :placeholder="$t('def.input')"/>-->
                    <!--                        </div>-->
                    <!--                    </div>-->
                </div>
                <template #footer>
                    <a-button @click="handleClose">{{ $t('def.cancel') }}</a-button>
                    <a-button @click="handleConfirm" type="primary">{{ $t('def.sure') }}</a-button>
                </template>
            </a-modal>
        </div>
    </div>
</template>

<script>
import Core from '../../core';
import TimeSearch from '../../components/common/TimeSearch.vue';

export default {
    name: 'CustomerList',
    components: {
        TimeSearch,
    },
    props: {},
    data() {
        return {
            loginType: Core.Data.getLoginType(),
            // 加载
            loading: false,
            modalShow: false,
            modalShowIndex: '',
            form: {
                zh: '',
                en: '',
            },
            // 表格
            tableData: [],
        };
    },
    watch: {},
    computed: {
        tableColumns() {
            let columns = [
                { title: 'crm_g.sales_stage', dataIndex: 'zh', key: 'zh' },
                { title: 'crm_g.sales_stage_en', dataIndex: 'en', key: 'en' },
                { title: 'crm_g.phase_type', dataIndex: 'status', key: 'status' },
                // {title: 'crm_g.phase_type', dataIndex: 'status', key:'status'},
                { title: 'def.operate', key: 'operation', fixed: 'right' },
            ];
            return columns;
        },
    },
    mounted() {
        this.getDetail();
    },
    methods: {
        routerChange(type, item = {}, index) {
            let routeUrl = '';
            switch (type) {
                case 'detail': // 编辑
                    routeUrl = this.$router.resolve({
                        path: '/crm-bo/bo-detail',
                        query: { id: item.id },
                    });
                    window.open(routeUrl.href, '_self');
                    break;
                case 'edit': // 编辑
                    this.form = Core.Util.deepCopy(item);
                    this.modalShow = true;
                    this.modalShowIndex = index;
                    break;
                case 'up':
                    if (this.tableData[index - 1] != null) {
                        this.form = this.tableData[index];
                        this.tableData[index] = this.tableData[index - 1];
                        this.tableData[index - 1] = this.form;
                        this.handleSave();
                    }
                    break;
                case 'down':
                    if (this.tableData[index + 1] != null) {
                        this.form = this.tableData[index];
                        this.tableData[index] = this.tableData[index + 1];
                        this.tableData[index + 1] = this.form;
                        this.handleSave();
                    }
                    break;
            }
        },
        getDetail() {
            // 获取 表格 数据
            this.loading = true;
            Core.Api.CRMBoStatusGroup.detail({
                id: 1,
            })
                .then(res => {
                    this.detail = res.detail;
                    console.log('tableData err:', this.detail);
                    console.log('tableData err:', this.detail.status_list);
                    this.tableData = JSON.parse(this.detail.status_list);
                })
                .catch(err => {
                    console.log('getTableData err:', err);
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        handleDelete(index) {
            let _this = this;
            console.log('tableData err:', _this.tableData[0]);
            console.log('index err:', index);
            this.$confirm({
                title: this.$t('pop_up.sure_delete'),
                okText: this.$t('def.sure'),
                okType: 'danger',
                cancelText: this.$t('def.cancel'),
                onOk() {
                    _this.tableData.splice(index, 1);
                    let status_list = JSON.stringify(_this.tableData);
                    Core.Api.CRMBoStatusGroup.save({
                        id: 1,
                        status_list: status_list,
                    })
                        .then(res => {})
                        .catch(err => {})
                        .finally(() => {
                            _this.loading = false;
                            _this.getDetail();
                        });
                },
            });
        },
        addBoStatusGroup() {
            this.modalShow = true;
        },
        handleClose() {
            Object.assign(this.form, this.$options.data().form);
            this.modalShow = false;
            this.modalShowIndex = '';
        },
        handleConfirm() {
            let form = Core.Util.deepCopy(this.form);
            if (this.modalShowIndex !== '') {
                this.tableData[this.modalShowIndex] = form;
            } else {
                this.tableData.push(form);
            }

            this.handleSave();
            this.handleClose();
        },
        handleSave() {
            let status_list = JSON.stringify(this.tableData);
            Core.Api.CRMBoStatusGroup.save({
                id: 1,
                status_list: status_list,
            })
                .then(res => {})
                .catch(err => {})
                .finally(() => {
                    this.loading = false;
                    this.getDetail();
                });
            this.handleClose();
        },
    },
};
</script>

<style lang="less" scoped>
// #CustomerList {}
</style>
