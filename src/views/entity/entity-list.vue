<template>
    <div id="EntityList">
        <div class="list-container">
            <div class="title-container">
                <div class="title-area">
                    {{ viewType === 'part' ? $t('v.parts') : $t('v.vehicle') }}{{ $t('v.list') }}
                </div>
                <div class="btns-area">
                    <a-button type="primary" @click="handleVehicleShow"
                        ><i class="icon i_add" />{{ $t('v.save')
                        }}{{ viewType === 'part' ? $t('v.parts') : $t('v.vehicle') }}</a-button
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
                        <a-button type="primary" class="file-upload-btn">
                            <i class="icon i_add" /> {{ $t('v.bulk_import') }}
                        </a-button>
                    </a-upload>
                </div>
            </div>
            <div class="search-container">
                <a-row class="search-area">
                    <a-col :xs="24" :sm="24" :xl="8" :xxl="6" class="search-item">
                        <div class="key">{{ $t('v.number') }}:</div>
                        <div class="value">
                            <a-input
                                :placeholder="$t('def.input')"
                                v-model:value="searchForm.uid"
                                @keydown.enter="handleSearch"
                            />
                        </div>
                    </a-col>
                    <a-col :xs="24" :sm="24" :xl="8" :xxl="6" class="search-item" v-if="$auth('ADMIN')">
                        <div class="key">{{ $t('n.distributor') }}:</div>
                        <div class="value">
                            <a-select
                                v-model:value="searchForm.distributor_id"
                                :placeholder="$t('def.select')"
                                @change="handleSearch"
                            >
                                <a-select-option v-for="item of distributorList" :key="item.id" :value="item.id">
                                    {{
                                        item.name
                                    }}
                                </a-select-option>
                            </a-select>
                        </div>
                    </a-col>
                    <a-col :xs="24" :sm="24" :xl="8" :xxl="6" class="search-item">
                        <div class="key">{{ $t('n.agent') }}:</div>
                        <div class="value">
                            <a-select
                                v-model:value="searchForm.agent_id"
                                :placeholder="$t('def.select')"
                                @change="handleSearch"
                                :disabled="!searchForm.distributor_id"
                            >
                                <a-select-option v-for="item of agentList" :key="item.id" :value="item.id">{{
                                    item.name
                                }}</a-select-option>
                            </a-select>
                        </div>
                    </a-col>
                    <a-col :xs="24" :sm="24" :xl="8" :xxl="6" class="search-item">
                        <div class="key">{{ $t('n.store') }}:</div>
                        <div class="value">
                            <a-select
                                v-model:value="searchForm.store_id"
                                :placeholder="$t('def.select')"
                                @change="handleSearch"
                                :disabled="!searchForm.agent_id"
                            >
                                <a-select-option v-for="item of storeList" :key="item.id" :value="item.id">{{
                                    item.name
                                }}</a-select-option>
                            </a-select>
                        </div>
                    </a-col>
                    <a-col :xs="24" :sm="24" :xl="16" :xxl="12" class="search-item">
                        <div class="key">{{ $t('d.create_time') }}:</div>
                        <div class="value">
                            <TimeSearch @search="handleOtherSearch" ref="TimeSearch" />
                        </div>
                    </a-col>
                </a-row>
                <div class="btn-area">
                    <a-button @click="handleSearch" type="primary">{{ $t('def.search') }}</a-button>
                    <a-button @click="handleSearchReset">{{ $t('def.reset') }}</a-button>
                </div>
            </div>
            <div class="operate-container" v-if="viewType === 'vehicle'">
                <a-button type="primary" @click="handleSetShow" :disabled="!selectedRowKeys.length">{{
                    $t('v.set')
                }}</a-button>
            </div>
            <div class="table-container">
                <a-table
                    :check-mode="true"
                    :columns="tableColumns"
                    :data-source="tableData"
                    :scroll="{ x: true }"
                    :row-key="record => record.id"
                    :pagination="false"
                    :row-selection="rowSelection"
                    :expandedRowKeys="expandedRowKeys"
                    :indentSize="0"
                    :expandIconColumnIndex="expandIconColumnIndex"
                >
                    <template #headerCell="{ title }">
                        {{ $t(title) }}
                    </template>
                    <template #bodyCell="{ column, text, record }">
                        <template v-if="column.key === 'detail'">
                            <!-- <a-image class="image" :width="55" :height="55" :src="$Util.imageFilter(record.logo)" fallback='无'/>
                            {{ text || '-' }} -->
                            <!-- <a-button type="link" @click="routerChange('detail', record)">
                                <div class="ell" style="max-width: 150px">{{ text || '-' }}</div>
                            </a-button> -->

                            <a-button type="link" @click="routerChange('detail', record)">
                                <span v-if="record.type === ITEM_TYPE.PRODUCT">
                                    <a-image
                                        class="image"
                                        :width="55"
                                        :height="55"
                                        :src="$Util.imageFilter(record.logo)"
                                        :fallback="$t('def.none')"
                                    />
                                    {{ record.item ? record.item.name || '-' : '-' }}
                                </span>
                                <span v-if="record.type === ITEM_TYPE.COMPONENT">
                                    {{ record.material ? record.material.name || '-' : '-' }}
                                </span>
                            </a-button>
                        </template>
                        <template v-if="column.key === 'code'">
                            <span v-if="record.type === ITEM_TYPE.PRODUCT">
                                {{ record.item ? record.item.code || '-' : '-' }}</span
                            >
                            <span v-if="record.type === ITEM_TYPE.COMPONENT">
                                {{ record.material ? record.material.code || '-' : '-' }}</span
                            >
                        </template>
                        <template v-if="column.key === 'item'">
                            {{ text || '-' }}
                        </template>
                        <template v-if="column.key === 'vehicle_uid'">
                            {{ record.vehicle ? record.vehicle.vehicle_uid : '-' }}
                        </template>
                        <template v-if="column.key === 'battery_uid'">
                            {{ record.vehicle ? record.vehicle.battery_uid : '-' }}
                        </template>
                        <template v-if="column.key === 'motor_uid'">
                            {{ record.vehicle ? record.vehicle.motor_uid : '-' }}
                        </template>
                        <template v-if="column.key === 'vcu_uid'">
                            {{ record.vehicle ? record.vehicle.vcu_uid : '-' }}
                        </template>
                        <template v-if="column.key === 'attr'">
                            {{ record.attr_desc || ' ' }}
                        </template>
                        <template v-if="column.dataIndex === 'org_name'">
                            {{ text || '-' }}
                        </template>
                        <template v-if="column.dataIndex === 'status'">
                            {{ $Util.entityStatusFilter(text, $i18n.locale) }}
                        </template>
                        <template v-if="column.dataIndex === 'org_type'">
                            {{ $Util.userTypeFilter(text, $i18n.locale) }}
                        </template>
                        <template v-if="column.key === 'time'">
                            {{ $Util.timeFilter(text) }}
                        </template>
                        <template v-if="column.key === 'operation'">
                            <template v-if="!record.default_item_id">
                                <!--                                <a-button type='link' @click="handleVehicleShow(record)"><i class="icon i_edit"/>编辑</a-button>-->
                                <a-button type="link" @click="routerChange('detail', record)"
                                    ><i class="icon i_detail" />{{ $t('def.detail') }}</a-button
                                >
                            </template>
                            <a-button type="link" @click="handleDelete(record.id)" class="danger"
                                ><i class="icon i_delete" />{{ $t('def.delete') }}
                            </a-button>
                        </template>
                    </template>
                </a-table>
            </div>
            <div class="paging-container">
                <a-pagination
                    v-model:current="currPage"
                    :page-size="pageSize"
                    :total="total"
                    show-quick-jumper
                    show-size-changer
                    show-less-items
                    :show-total="total => $t('n.all_total') + ` ${total} ` + $t('in.total')"
                    :hide-on-single-page="false"
                    :pageSizeOptions="['10', '20', '30', '40']"
                    @change="pageChange"
                    @showSizeChange="pageSizeChange"
                />
            </div>
        </div>
        <template class="modal-container">
            <a-modal
                v-model:visible="vehicleShow"
                :title="editForm.uid ? $t(titleType) + $t('n.edit') : $t('v.save') + $t(titleType)"
                class="vehicle-edit-modal"
                :after-close="handleVehicleClose"
            >
                <div class="modal-content">
                    <div class="form-item required">
                        <div class="key">{{ $t('i.type') }}:</div>
                        <a-radio-group v-model:value="type">
                            <a-radio v-for="item in TYPE_MAP" :value="item.key">
                                {{ lang === 'zh' ? item.zh : item.en }}
                            </a-radio>
                        </a-radio-group>
                    </div>
                    <div class="form-item required" v-if="type === 1">
                        <div class="key">{{ $t('i.code') }}:</div>
                        <a-input
                            v-model:value="editForm.item_code"
                            :placeholder="$t('i.commodity_code')"
                            @blur="handleItemCodeBlur"
                        />
                        <span v-if="isExist == 1"><i class="icon i_confirm" /></span>
                        <span v-else-if="isExist == 2"><i class="icon i_close_c" /></span>
                    </div>

                    <div class="form-item required" v-if="type === 2">
                        <div class="key">{{ $t('r.item_name') }}:</div>
                        <a-input v-model:value="editForm.name" :placeholder="$t('def.input')" />
                    </div>

                    <div class="form-item required">
                        <div class="key">{{ $t(titleType) + $t('n.serial_number') }}</div>
                        <a-input
                            v-model:value="editForm.uid"
                            :placeholder="$t('n.please_input') + $t(titleType) + $t('n.serial_number')"
                        />
                    </div>
                </div>
                <template #footer>
                    <a-button @click="vehicleShow = false">{{ $t('def.cancel') }}</a-button>
                    <a-button @click="handleVehicleSubmit" type="primary">{{ $t('def.ok') }}</a-button>
                </template>
            </a-modal>
            <a-modal
                v-model:visible="entityShow"
                :title="$t('v.set')"
                class="arrival-time-modal"
                :after-close="handleEntityClose"
            >
                <div class="modal-content">
                    <div class="form-item required">
                        <div class="key">{{ $t('r.arrival_time') }}:</div>
                        <div class="value">
                            <a-date-picker
                                v-model:value="entityForm.arrival_time"
                                valueFormat="YYYY-MM-DD HH:mm:ss"
                                :show-time="defaultTime"
                                :placeholder="$t('r.select_arrival')"
                            >
                                <template #suffixIcon><i class="icon i_calendar" /></template>
                            </a-date-picker>
                        </div>
                    </div>
                </div>
                <template #footer>
                    <a-button @click="entityShow = false">{{ $t('def.cancel') }}</a-button>
                    <a-button @click="handleEntitySubmit" type="primary">{{ $t('def.ok') }}</a-button>
                </template>
            </a-modal>
        </template>
    </div>
</template>

<script>
import Core from '../../core';
import dayjs from 'dayjs';
import CategoryTreeSelect from '@/components/popup-btn/CategoryTreeSelect.vue';
import TimeSearch from '@/components/common/TimeSearch.vue';

const ITEM_TYPE = Core.Const.ITEM.TYPE;
const TYPE_MAP = Core.Const.ENTITY.TYPE_MAP;

export default {
    name: 'EntityList',
    components: {
        CategoryTreeSelect,
        TimeSearch,
    },
    props: {},
    data() {
        return {
            type: 1,
            ITEM_TYPE,
            TYPE_MAP,
            defaultTime: Core.Const.TIME_PICKER_DEFAULT_VALUE.BEGIN,
            // 加载
            loading: false,
            // 分页
            currPage: 1,
            pageSize: 20,
            total: 0,
            // 搜索
            distributorList: [],
            agentList: [],
            storeList: [],
            searchForm: {
                name: '',
                uid: '',
                category_id: undefined,
                begin_time: '',
                end_time: '',
                distributor_id: undefined,
                agent_id: undefined,
                store_id: undefined,
            },
            // 表格
            tableData: [],
            expandedRowKeys: [],
            expandIconColumnIndex: 0,

            // 上传
            upload: {
                action: Core.Const.NET.URL_POINT + '/admin/1/entity/import',
                fileList: [],
                headers: {
                    ContentType: false,
                },
                data: {
                    token: Core.Data.getToken(),
                    type: 'xlsx',
                },
            },
            // 弹框
            vehicleShow: false,
            isExist: '',
            editForm: {
                id: '',
                uid: '',
                item_code: '',
                name: '',
            },
            selectedRowKeys: [],
            selectedRowItems: [],
            entitySelect: [],
            entityShow: false,
            entityForm: {
                ids: '',
                arrival_time: '',
            },
            viewType: '',
            title: '整车',
            titleType: '',
        };
    },
    watch: {
        $route: {
            deep: true,
            immediate: true,
            handler(newRoute) {
                let type = newRoute.meta ? newRoute.meta.type : 'vehicle';
                this.viewType = type;
                if (type === 'part') {
                    this.title = this.$t('v.parts');
                    this.titleType = 'v.parts';
                } else {
                    this.title = this.$t('v.vehicle');
                    this.titleType = 'v.vehicle';
                }
                Object.assign(this.searchForm, this.$options.data().searchForm);
                this.pageChange(1);
            },
        },
        'searchForm.distributor_id': function () {
            this.getAgentListAll();
            this.searchForm.agent_id = undefined;
            this.searchForm.store_id = undefined;
        },
        'searchForm.agent_id': function () {
            this.getStoreListAll();
            this.searchForm.store_id = undefined;
        },
    },
    computed: {
        tableColumns() {
            let columns = [
                { title: 'n.name', dataIndex: 'name', key: 'detail' },
                { title: 'p.code', dataIndex: 'code', key: 'code' },
                { title: 'search.vehicle_no', dataIndex: 'vehicle_uid', key: 'vehicle_uid' },
                { title: 'v.vehicle_code', dataIndex: 'uid', key: 'item' },
                { title: 'v.motor_coding', dataIndex: 'motor_uid', key: 'motor_uid' },
                { title: 'v.control_code', dataIndex: 'vcu_uid', key: 'vcu_uid' },
                { title: 'v.battery_code', dataIndex: 'battery_uid', key: 'battery_uid' },
                { title: 'i.spec', dataIndex: 'attr', key: 'attr' },
                { title: 'v.type', dataIndex: 'org_type' },
                { title: 'r.unit', dataIndex: 'org_name' },
                { title: 'wa.related', dataIndex: 'warehouse_name' },
                { title: 'p.status', dataIndex: 'status' },
                { title: 'v.date', dataIndex: 'arrival_time', key: 'time' },
                { title: 'd.create_time', dataIndex: 'create_time', key: 'time' },
                { title: 'def.operate', key: 'operation', fixed: 'right', width: 180 },
            ];
            return columns;
        },
        rowSelection() {
            return {
                selectedRowKeys: this.selectedRowKeys,
                onChange: (selectedRowKeys, selectedRows) => {
                    // 表格 选择 改变
                    this.selectedRowKeys = selectedRowKeys;
                    this.selectedRowItems = selectedRows;
                    console.log('rowSelection onChange this.selectedRowKeys', this.selectedRowKeys);
                },
            };
        },
        lang() {
            return this.$store.state.lang;
        },
    },
    mounted() {
        this.getTableData();
        if (this.$auth('ADMIN')) {
            this.getDistributorListAll();
        }
        if (this.$auth('ADMIN', 'DISTRIBUTOR')) {
            this.getAgentListAll();
        }
        if (!this.$auth('STORE')) {
            this.getStoreListAll();
        }
        // this.getEntityList();
    },
    methods: {
        routerChange(type, item = {}) {
            console.log('routerChange item:', item);
            let routeUrl = '';
            switch (type) {
                case 'detail': // 整车详情
                    routeUrl = this.$router.resolve({
                        path: '/entity/entity-detail',
                        query: { id: item.default_item_id || item.id, set_id: item.set_id },
                    });
                    window.open(routeUrl.href, '_blank');
                    break;
            }
        },
        pageChange(curr) {
            // 页码改变
            this.currPage = curr;
            this.getTableData();
        },
        pageSizeChange(current, size) {
            // 页码尺寸改变
            console.log('pageSizeChange size:', size);
            this.pageSize = size;
            this.getTableData();
        },
        handleSearch() {
            // 搜索
            this.pageChange(1);
        },
        handleOtherSearch(params) {
            // 时间等组件化的搜索
            for (const key in params) {
                this.searchForm[key] = params[key];
            }
            this.pageChange(1);
        },
        handleSearchReset() {
            // 重置搜索
            Object.assign(this.searchForm, this.$options.data().searchForm);
            this.pageChange(1);
            this.$refs.TimeSearch.handleReset();
        },
        getDistributorListAll() {
            Core.Api.Distributor.listAll().then(res => {
                this.distributorList = res.list;
            });
        },
        getAgentListAll() {
            if (this.searchForm.distributor_id) {
                Core.Api.Agent.listAll({ distributor_id: this.searchForm.distributor_id }).then(res => {
                    this.agentList = res.list;
                });
            } else {
                this.agentList = [];
            }
        },
        getStoreListAll() {
            if (this.searchForm.agent_id) {
                Core.Api.Store.listAll({ agent_id: this.searchForm.agent_id }).then(res => {
                    this.storeList = res.list;
                });
            } else {
                this.storeList = [];
            }
        },
        getTableData() {
            // 获取 表格 数据
            this.loading = true;
            let type = this.viewType == 'part' ? ITEM_TYPE.COMPONENT : ITEM_TYPE.PRODUCT;
            Core.Api.Entity.list({
                ...this.searchForm,
                type: type,
                page: this.currPage,
                page_size: this.pageSize,
            })
                .then(res => {
                    console.log('getTableData res:', res);
                    // let list = res.list.map(entity => {
                    //     entity.attr_desc = entity.item.attr_list ? entity.item.attr_list.map(i => i.value).join(',') : ''
                    //     return entity
                    // })
                    console.log('res.list', res.list);
                    this.total = res.count;
                    this.tableData = res.list;
                })
                .catch(err => {
                    console.log('getTableData err:', err);
                })
                .finally(() => {
                    this.loading = false;
                    this.expandedRowKeys = [];
                });
        },

        // 删除
        handleDelete(id) {
            let _this = this;
            this.$confirm({
                title: _this.$t('pop_up.sure_delete'),
                okText: _this.$t('def.sure'),
                okType: 'danger',
                cancelText: this.$t('def.cancel'),
                onOk() {
                    Core.Api.Entity.delete({ id })
                        .then(() => {
                            _this.$message.success(_this.$t('pop_up.delete_success'));
                            _this.getTableData();
                        })
                        .catch(err => {
                            console.log('handleDelete err', err);
                        });
                },
            });
        },

        // 弹框 添加、编辑
        handleVehicleShow(record) {
            // 显示弹框
            this.editForm = {
                id: record.id,
                uid: record.uid,
                item_code: record.item_code,
            };
            this.vehicleShow = true;
        },
        handleVehicleClose() {
            // 关闭弹框
            this.vehicleShow = false;
            this.isExist = '';
            this.editForm = {
                id: '',
                uid: '',
                item_code: '',
            };
        },
        handleVehicleSubmit() {
            // 审核提交
            let form = Core.Util.deepCopy(this.editForm);
            if (!form.uid) {
                return this.$message.warning(this.$t('def.enter'));
            }
            if (!form.item_code && this.type === 1) {
                form.name = '';
                return this.$message.warning(this.$t('def.enter'));
            }
            if (!form.name && this.type === 2) {
                form.item_code = '';
                return this.$message.warning(this.$t('def.enter'));
            }
            if (this.isExist == 2) {
                return this.$message.warning(this.$t('def.enter'));
            }

            let type = this.viewType == 'part' ? ITEM_TYPE.COMPONENT : ITEM_TYPE.PRODUCT;
            form.type = type;
            Core.Api.Entity.save(form)
                .then(res => {
                    console.log('handleRefundSubmit res', res);
                    this.handleVehicleClose();
                    this.getTableData();
                })
                .catch(err => {
                    console.log('handleRefundSubmit err', err);
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        handleItemCodeBlur() {
            // 获取 商品编码
            if (!this.editForm.item_code) {
                return (this.isExist = '');
            }
            Core.Api.Item.detailByCode({
                code: this.editForm.item_code,
            })
                .then(res => {
                    console.log('handleItemCodeBlur res', res);
                    this.isExist = res.detail == null ? 2 : 1;
                })
                .catch(err => {
                    console.log('handleItemCodeBlur err', err);
                });
        },

        // 上传文件
        handleMatterChange({ file, fileList }) {
            console.log('handleMatterChange status:', file.status, 'file:', file);
            if (file.status == 'done') {
                if (file.response && file.response.code > 0) {
                    return this.$message.error(this.$t(file.response.code + '', JSON.parse(file.response.message)));
                } else {
                    return this.$message.success(this.$t('i.uploaded'));
                }
            }
            this.upload.fileList = fileList;
        },
        /*getEntityList() {  // 获取 车架列表
            Core.Api.Entity.list({}).then(res => {
                console.log("getEntityList res", res)
                let list = res.list;
                let map = {};
                for (const item of list) {
                    map[item.id] = item.name
                }
                this.entityMap = map;
            }).catch(err => {
                console.log('getEntityList err:', err)
            }).finally(() => {
                this.loading = false;
            });
        },*/
        handleSetShow() {
            this.entityShow = true;
        },
        handleEntityClose() {
            this.entityShow = false;
            this.entityForm = {
                arrival_time: '',
            };
        },
        handleEntitySubmit() {
            let form = Core.Util.deepCopy(this.entityForm);
            form.arrival_time = form.arrival_time ? dayjs(form.arrival_time).unix() : 0; // 日期转时间戳
            form.ids = this.selectedRowKeys.join(',');
            Core.Api.Entity.batchSave(form)
                .then(res => {
                    console.log('handleEntitySubmit res', res);
                    this.$message.success(this.$t('i.settings') + this.$t('pop_up.success'));
                    this.handleEntityClose();
                    this.getTableData();
                    this.selectedRowKeys = [];
                    this.selectedRowItems = [];
                })
                .catch(err => {
                    console.log('handleEntitySubmit err', err);
                })
                .finally(() => {
                    this.loading = false;
                });
        },
    },
};
</script>

<style lang="less">
#EntityList {
    .ant-btn.ant-btn-link {
        line-height: 22px;
        margin-left: 8px;
    }
}

.form-item {
    .fac();

    .ant-input {
        width: calc(~'100% - 24px');
    }

    i.icon {
        display: inline-block;
        width: 24px;
        text-align: right;
    }

    .i_confirm {
        color: @green;
        font-size: 18px;
    }

    .i_close_c {
        color: @red;
        font-size: 18px;
    }
}
</style>
<style lang="less" scoped>
#EntityList {
    .list-container {
        .title-container {
            .btns-area {
                .file-upload-btn {
                    margin-left: 10px;
                }
            }
        }
    }
}
</style>
