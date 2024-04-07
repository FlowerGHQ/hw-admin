<template>
    <div class="UserScope gray-panel no-margin">
        <div class="panel-content">
            <div class="table-container">
                <a-button
                    type="primary"
                    ghost
                    @click="handleAuthShow"
                    v-if="$auth('MANAGER')"
                    class="panel-btn"
                >
                    <i class="icon i_add" />{{ $t('u.new_resource') }}
                </a-button>
                <a-table
                    :columns="tableColumns"
                    :data-source="tableData"
                    :scroll="{ x: true }"
                    :row-key="record => record.id"
                    :pagination="false"
                >
                    <template #bodyCell="{ column, text, record }">
                        <template v-if="column.key === 'text'">
                            {{ text || '-' }}
                        </template>
                        <template v-if="column.key === 'content'">
                            {{ $i18n.locale === 'zh' ? record.resource.name : record.resource.nameEn }}
                        </template>
                        <template v-if="column.key === 'type'">
                            {{ $Util.userAuthFilter(text, $i18n.locale) }}
                        </template>
                        <template v-if="column.key === 'time'">
                            {{ $Util.timeFilter(text) }}
                        </template>
                        <template v-if="column.key === 'operation'">
                            <!--                            <a-button type='link' @click="handleAuthShow(record)"><i class="icon i_edit"/>编辑</a-button>-->
                            <a-button type="link" @click="handleDelete(record)" class="danger"
                                ><i class="icon i_delete" />{{ $t('def.delete') }}</a-button
                            >
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
        <a-modal
            v-model:visible="authShow"
            :title="$t('u.new_resource')"
            class="stock-change-modal"
            :after-close="handleAuthClose"
        >
            <div class="form-item required">
                <div class="key">{{ $t('u.resource_type') }}</div>
                <div class="value">
                    <a-select
                        v-model:value="form.resource_type"
                        :placeholder="$t('def.select') + $t('u.resource_type')"
                        disabled
                    >
                        <a-select-option
                            v-for="resource in resourceList"
                            :key="resource.value"
                            :value="resource.value"
                            >{{ resource[$i18n.locale] }}</a-select-option
                        >
                    </a-select>
                </div>
            </div>
            <div class="form-item required" v-if="resourceType == RESOURCE_TYPE.WAREHOUSE">
                <div class="key">{{ $t('u.resource_obj') }}</div>
                <div class="value">
                    <a-select v-model:value="form.resource_id" :placeholder="$t('def.select') + $t('u.resource_obj')">
                        <a-select-option
                            v-for="item of warehouseList"
                            :key="item.id"
                            :value="item.id"
                            :disabled="item.disabled"
                            >{{ item.name }}</a-select-option
                        >
                    </a-select>
                </div>
            </div>
            <div class="form-item required" v-if="resourceType == RESOURCE_TYPE.PURCHASE">
                <div class="key">{{ $t('u.resource_obj') }}</div>
                <div class="value">
                    <a-select v-model:value="form.resource_id" :placeholder="$t('def.select') + $t('u.resource_obj')">
                        <a-select-option
                            v-for="item of categoryList"
                            :key="item.id"
                            :value="item.id"
                            :disabled="item.disabled"
                            >{{ $i18n.locale === 'zh' ? item.name : item.name_en }}</a-select-option
                        >
                    </a-select>
                </div>
            </div>
            <div class="form-item required" v-if="resourceType == RESOURCE_TYPE.DISTRIBUTOR">
                <div class="key">{{ $t('u.resource_obj') }}</div>
                <div class="value">
                    <a-select v-model:value="form.resource_id" :placeholder="$t('def.select') + $t('u.resource_obj')">
                        <a-select-option
                            v-for="item of distributorList"
                            :key="item.id"
                            :value="item.id"
                            :disabled="item.disabled"
                            >{{ item.name }}</a-select-option
                        >
                    </a-select>
                </div>
            </div>
            <template #footer>
                <a-button @click="handleAuthSubmit" type="primary">{{ $t('def.sure') }}</a-button>
                <a-button @click="authShow = false">{{ $t('def.cancel') }}</a-button>
            </template>
        </a-modal>
    </div>
</template>

<script>
import Core from '../../../core';
export default {
    name: 'UserScope',
    components: {},
    props: {
        userId: {
            type: Number,
        },
        userType: {
            type: Number,
        },
        resourceType: {
            type: Number,
        },
    },
    data() {
        return {
            // 加载
            loading: false,
            // 分页
            currPage: 1,
            pageSize: 20,
            // userId: 0,
            // userType: 0,
            // resourceType: 0,
            total: 0,
            // 表格
            tableData: [],
            // 弹框
            authShow: false,
            warehouseList: [],
            categoryList: [],
            distributorList: [],
            resourceList: Core.Const.NOTICE.RESOURCE_TYPE_LIST,
            RESOURCE_TYPE: Core.Const.NOTICE.RESOURCE_TYPE,
            form: {
                id: '',
                resource_type: undefined,
                user_id: '',
                user_type: '',
                resource_id: undefined,
            },
        };
    },
    watch: {},
    computed: {
        tableColumns() {
            let tableColumns = [
                { title: this.$t('u.resource_type'), dataIndex: 'resource_type', key: 'type' },
                { title: this.$t('u.resource_obj'), dataIndex: ['resource', 'name'], key: 'content' },
                { title: this.$t('def.create_time'), dataIndex: 'create_time', key: 'time' },
                { title: this.$t('def.operate'), key: 'operation', fixed: 'right' },
            ];
            return tableColumns;
        },
    },
    mounted() {
        // this.userId = Number(this.$route.query.user_id) || 0
        // this.userType = Number(this.$route.query.user_type) || 0
        // this.resourceType = Number(this.$route.query.resource_type) || 0
        this.form.resource_type = this.resourceType;
        this.getTableData();
    },
    methods: {
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
        getTableData() {
            // 获取 表格 数据
            Core.Api.AuthorityUser.list({
                user_id: this.userId,
                resource_type: this.resourceType,
            })
                .then(res => {
                    console.log('getTableData res', res);
                    this.total = res.count;

                    res.list.forEach(it => {
                        if (it.resource_type !== Core.Const.NOTICE.RESOURCE_TYPE.PURCHASE) {
                            it.resource.nameEn = it.resource.name;
                        }
                    });
                    this.tableData = res.list;
                })
                .catch(err => {
                    console.log('getTableData err', err);
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        async getWarehouseList() {
            Core.Api.Warehouse.listAll({ is_authority_warehouse: 0 }).then(res => {
                res.list.forEach(warehouse => {
                    this.tableData.forEach(it => {
                        console.log(warehouse.id);
                        console.log(it);
                        if (warehouse.id == it.resource_id) {
                            warehouse.disabled = true;
                        }
                    });
                });
                this.warehouseList = res.list;
            });
        },
        async getCategoryList() {
            Core.Api.ItemCategory.listAll().then(res => {
                res.list.forEach(itemCategory => {
                    this.tableData.forEach(it => {
                        if (itemCategory.id === it.resource_id) {
                            itemCategory.disabled = true;
                        }
                    });
                });
                this.categoryList = res.list;
            });
        },
        async getDistributorList() {
            Core.Api.Distributor.listAll().then(res => {
                res.list.forEach(distributor => {
                    this.tableData.forEach(it => {
                        if (distributor.id === it.resource_id) {
                            distributor.disabled = true;
                        }
                    });
                });
                this.distributorList = res.list;
            });
        },
        handleAuthShow() {
            this.authShow = true;
            switch (this.resourceType) {
                case this.RESOURCE_TYPE.WAREHOUSE: {
                    this.getWarehouseList();
                    break;
                }
                case this.RESOURCE_TYPE.PURCHASE: {
                    this.getCategoryList();
                    break;
                }
                case this.RESOURCE_TYPE.DISTRIBUTOR: {
                    this.getDistributorList();
                    break;
                }
            }

            /*if (item) {
                this.form.resource_type = item.resource_type
                this.form.resource_id = item.resource_id
            }*/
        },
        handleAuthClose() {
            this.authShow = false;
            Object.assign(this.form, this.$options.data().form);
            this.form.resource_type = this.resourceType;
        },
        handleAuthSubmit() {
            let form = Core.Util.deepCopy(this.form);
            form.user_id = this.userId;
            form.user_type = this.userType;
            if (!form.resource_type) {
                return this.$message.warning(this.$t('def.select') + this.$t('u.resource_type'));
            }
            if (!form.resource_id) {
                return this.$message.warning(this.$t('def.select') + this.$t('u.resource_obj'));
            }
            Core.Api.AuthorityUser.save(form)
                .then(() => {
                    this.$message.success(this.$t('pop_up.save_success'));
                    this.handleAuthClose();
                    this.getTableData();
                })
                .catch(err => {
                    console.log('handleStockAddSubmit err:', err);
                });
        },
        handleDelete(item) {
            let form = {
                user_id: this.userId,
                user_type: this.userType,
                resource_id: item.resource_id,
                resource_type: item.resource_type,
            };
            console.log('form', form);
            let _this = this;
            this.$confirm({
                title: _this.$t('u.sure_delete'),
                okText: _this.$t('def.sure'),
                okType: 'danger',
                cancelText: _this.$t('def.cancel'),
                onOk() {
                    Core.Api.AuthorityUser.delete(form)
                        .then(() => {
                            _this.$message.success(this.$t('pop_up.save_success'));
                            _this.getTableData();
                        })
                        .catch(err => {
                            console.log('handleDelete -> err', err);
                        });
                },
            });
        },
    },
};
</script>
<style lang="less">
.gray-panel {
    background: #fff;
    box-shadow: 0px 1px 2px rgb(23 32 48 / 6%);
    border-radius: 4px;
    margin: 0 20px 20px;
    padding: 14px;
}
</style>
