<template>
    <div class="ItemAccessory">
        <div class="panel-header">
            <div>
                <ItemSelect
                    btnType="primary"
                    :btnText="$t('i.select_item')"
                    btnClass="item-select-btn"
                    :disabled-checked="disabledChecked"
                    @select="handleSelectItem"
                />
            </div>
            <span class="name">{{ $t('i.sale_bom_dis') }}</span>
        </div>
        <a-table
            :columns="tableColumns"
            :data-source="tableData"
            :scroll="{ x: true }"
            :row-key="record => record.id"
            :pagination="false"
        >
            <template #bodyCell="{ column, text, record }">
                <template v-if="column.key === 'detail'">
                    <div>{{ $i18n.locale === 'zh' ? record.target_name : record.target_name_en || '-' }}</div>
                </template>
                <template v-if="column.key === 'item'">
                    {{ text || '-' }}
                </template>
                <template v-if="column.key === 'type'">
                    {{ $Util.itemTypeFilter(text, $i18n.locale) }}
                </template>
                <template v-if="column.key === 'amount'">
                    <p class="input-number" :class="record.amount ? '' : 'border-red'">
                        <a-input-number
                            v-model:value="record.amount"
                            style="width: 120px"
                            :min="1"
                            :precision="0"
                            :placeholder="$t('def.input')"
                            @blur="handleBlur(record.amount)"
                        />
                    </p>
                </template>
                <!-- 价格 -->
                <template v-if="column.key === 'fob_money'">
                    <span v-if="text >= 0">{{ column.unit }}</span>
                    {{ $Util.countFilter(text) }}
                </template>
                <template v-if="column.key === 'time'">
                    {{ $Util.timeFilter(text) }}
                </template>
                <template v-if="column.key === 'operation'">
                    <a-button type="link" @click="handleDelete(record.id)">
                        <i class="icon i_delete" />{{ $t('def.delete') }}
                    </a-button>
                </template>
            </template>
        </a-table>
        <!-- 确认更改 -->
        <!-- <div class="confirm-btn">
        <a-popconfirm v-if="tableData.length"  @confirm="confirmEvent">    
            <template #title>{{ $t('i.confirm_changes') + '?' }}</template>                        
            <a-button type="primary" ghost>{{$t('i.confirm_changes')}}</a-button>                            
        </a-popconfirm>
    </div> -->
        <a-modal
            v-model:visible="infoShow"
            :maskClosable="false"
            width="320px"
            centered
            :title="null"
            class="attachment-file-upload-modal"
            :after-close="infoClose"
        >
            <div class="modal">
                <p class="modal-title">{{ $t('i.modal_title') }}</p>
                <p class="modal-content">{{ $t('i.modal_content') }}</p>
            </div>
            <template #footer>
                <div class="btns">
                    <a-button @click="handleCancle">{{ $t('def.cancel') }}</a-button>
                    <a-button @click="handleOk" type="primary">{{ $t('def.sure_exit') }}</a-button>
                </div>
            </template>
        </a-modal>
    </div>
</template>

<script>
import Core from '../../../core';
import ItemSelect from '@/components/popup-btn/ItemSelect.vue';

export default {
    name: 'ItemAccessory',
    components: { ItemSelect },
    props: {
        item_id: {
            type: Number,
        },
        target_type: {
            type: Number,
        },
        detail: {},
    },
    inject: ['setIndex'],
    data() {
        return {
            // 加载
            loading: false,
            activeKey: ['itemAccessory'],

            tableData: [],

            modalShow: false,
            form: {
                name: '',
                path: '',
                type: '',
            },
            submitDisabled: true,

            upload: {
                action: Core.Const.NET.FILE_UPLOAD_END_POINT,
                fileList: [],
                headers: {
                    ContentType: false,
                },
                data: {
                    token: Core.Data.getToken(),
                    type: 'img',
                },
            },
            disabledChecked: [], // 传给上传配件选择商品中哪些不选中的
            infoShow: false,
            nextFn: undefined,
        };
    },
    computed: {
        tableColumns() {
            let columns = [
                { title: this.$t('n.name'), dataIndex: 'target_name', key: 'detail' },
                { title: this.$t('i.code'), dataIndex: 'target_uid', key: 'item' },
                { title: this.$t('n.type'), dataIndex: 'type', key: 'type' },
                { title: this.$t('i.amount'), dataIndex: 'amount', key: 'amount' },
                { title: 'FOB(EUR)', dataIndex: 'fob_eur', key: 'fob_money', unit: '€' },
                { title: 'FOB(USD)', dataIndex: 'fob_usd', key: 'fob_money', unit: '$' },
                { title: this.$t('def.create_time'), dataIndex: 'create_time', key: 'time' },
                { title: this.$t('def.operate'), key: 'operation', fixed: 'right' },
            ];
            return columns;
        },
    },
    watch: {
        item_id: {
            handler(val) {
                this.getTableData();
            },
            immediate: true,
            deep: true,
        },
    },
    mounted() {
        this.getTableData();
    },
    methods: {
        /*== Fetch start==*/
        confirmChangeFetch(params = {}) {
            Core.Api.Item.ItemAccessoryModify({
                ...params,
            })
                .then(res => {
                    console.log('修改成功', res);
                    this.$message.success(this.$t('p.modify_success'));
                    this.getTableData();
                })
                .catch(err => {
                    console.log('修改失败', err);
                });
        },
        /*== Fetch end==*/

        handleModalClose() {
            this.modalShow = false;
            Object.assign(this.form, this.$options.data().form);
            this.upload.fileList = [];
        },
        handleModalSubmit() {
            let form = Core.Util.deepCopy(this.form);
            console.log('handleLogin form:', form);
            if (!form.name) {
                return this.$message.warning(this.$t('def.enter'));
            }
            this.loading = true;
            Core.Api.Attachment.save({
                ...form,
                target_type: this.target_type,
                target_id: this.target_id,
            })
                .then(() => {
                    this.$message.success(this.$t('pop_up.save_success'));
                    this.$emit('Submit');
                    this.handleModalClose();
                    this.getTableData();
                })
                .catch(err => {
                    console.log('handleSubmit err:', err);
                });
        },
        // 删除附件
        handleDelete(id) {
            let _this = this;
            this.$confirm({
                title: _this.$t('pop_up.sure_delete'),
                okText: _this.$t('def.sure'),
                okType: 'danger',
                cancelText: this.$t('def.cancel'),
                onOk() {
                    Core.Api.ItemAccessory.delete({ id })
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
        getTableData() {
            Core.Api.ItemAccessory.list({ item_id: this.item_id }).then(res => {
                // this.tableData = res.list;
                this.tableData = this.removeChildrenFromData(res.list);

                // 每次先清空
                this.disabledChecked = [];
                res.list.forEach($1 => {
                    this.disabledChecked.push($1.item_id);
                });
            });
        },
        // 去除加号
        removeChildrenFromData(data) {
            return data.map(item => {
                const newItem = { ...item };
                delete newItem.children;
                return newItem;
            });
        },
        handleSelectItem(ids, items) {
            console.log('handleSelectItem ids, items:', ids, items);
            // 多选操作
            let params = {
                item_id: this.item_id,
                target_list: [],
            };

            ids.forEach(el => {
                params.target_list.push({
                    target_id: el,
                    target_type: Core.Const.ITEM_ACCESSORY.TARGET_TYPE_MAP.ITEM,
                });
            });

            // 单选操作
            // let params = {
            //     item_id: this.detail.id,
            //     target_id: ids[0],
            //     target_type: Core.Const.ITEM_ACCESSORY.TARGET_TYPE_MAP.ITEM
            // }

            Core.Api.ItemAccessory.save(params)
                .then(() => {
                    this.$message.success(this.$t('pop_up.save_success'));
                    this.getTableData();
                })
                .catch(err => {
                    console.log('handleDelete err', err);
                });
        },
        // 确认更改
        confirmEvent() {
            if (this.tableData.length) {
                let ItemAccessoryList = [];
                this.tableData.forEach(el => {
                    ItemAccessoryList.push({
                        id: el.id,
                        amount: el.amount,
                    });
                });
                // console.log("数据", ItemAccessoryList);
                this.confirmChangeFetch({
                    item_accessory_list: ItemAccessoryList,
                });
            }
        },
        infoOpen() {
            this.infoShow = true;
        },
        infoClose() {
            this.infoShow = false;
        },
        handleOk() {
            this.nextFn();
            this.infoShow = false;
        },
        handleCancle() {
            this.infoShow = false;
            // 回归左侧和顶部菜单栏选中样式
            this.setIndex(1, ['/item/item-list']);
        },
        // 校验数量
        validateAmount(fn) {
            const arr = this.tableData.filter(item => !item.amount);
            if (arr.length > 0) {
                this.nextFn = fn;
                this.infoOpen();
            } else {
                // 校验成功执行 next
                fn();
            }
        },
        // 数量失焦
        handleBlur(value) {
            if (value) {
                this.confirmEvent();
            }
        },
    },
};
</script>

<style lang="less" scoped>
.ItemAccessory {
    .panel-header {
        display: flex;
        .fcc(flex-start, center);
        margin-bottom: 10px;
        .name {
            color: #666;
            font-family: PingFang SC;
            font-size: 14px;
            margin-left: 6px;
        }
        .ant-btn {
            border-radius: 2px;
        }
    }
    .confirm-btn {
        margin-top: 10px;
        text-align: center;
    }
    .i_delete {
        font-size: 16px;
    }
    /* 表格样式-start */
    .ant-table
        .ant-table-container
        .ant-table-content
        table
        tbody.ant-table-tbody
        tr.ant-table-row
        td.ant-table-cell
        .ant-btn {
        font-size: 14px;
    }
    :deep(
            .ant-table
                .ant-table-container
                .ant-table-content
                table
                tbody.ant-table-tbody
                tr.ant-table-row
                td.ant-table-cell
        ) {
        padding: 10px 16px;
        font-size: 14px;
        color: #1d2129;
    }
    :deep(.ant-table .ant-table-container .ant-table-content table thead.ant-table-thead tr th.ant-table-cell) {
        padding: 10px 16px;
        font-size: 14px;
        font-weight: 500;
        color: #1d2129;
    }
    /* 表格样式-end */
}
</style>
<style lang="less">
.ItemAccessory {
    .input-number {
        display: inline-block;
    }
    .border-red {
        .ant-input-number {
            border: 1px solid red !important;
        }
    }
}
.attachment-file-upload-modal {
    .modal {
        .modal-title {
            color: #1d2129;
            text-align: center;
            font-family: PingFang SC;
            font-size: 18px;
            font-weight: 600;
            margin-bottom: 24px;
        }
        .modal-content {
            color: #1d2129;
            text-align: center;
            font-family: PingFang SC;
            font-size: 14px;
            font-weight: 400;
        }
    }
    .btns {
        text-align: center;
    }
}
</style>
