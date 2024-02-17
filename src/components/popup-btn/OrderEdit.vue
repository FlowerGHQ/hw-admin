<template>
    <div class="OrderEdit edit-container">
        <div class="title-container">
            <div class="title-area">{{ form.id ? $t('crm_o.edit') : $t('crm_o.save') }}</div>
        </div>
        <div class="form-block">
            <div class="form-title">
                <div class="title-colorful">{{ $t('crm_o.info') }}</div>
            </div>
            <div class="form-content">
                <div class="form-item required">
                    <div class="key">{{ $t('crm_o.belone_customer') }}：</div>
                    <div class="value">
                        <!-- customer_id -->
                        <a-input v-model:value="form.customer_id" :placeholder="$t('def.input')" />
                    </div>
                </div>
                <div class="form-item required">
                    <div class="key">{{ $t('crm_o.contract_no') }}：</div>
                    <div class="value">
                        <a-input v-model:value="form.source_id" :placeholder="$t('def.input')" />
                    </div>
                </div>
                <div class="form-item required">
                    <div class="key">{{ $t('crm_o.name') }}：</div>
                    <div class="value">
                        <a-input v-model:value="form.name" :placeholder="$t('def.input')" />
                    </div>
                </div>
                <div class="form-item required">
                    <div class="key">{{ $t('crm_o.signing_date') }}：</div>
                    <div class="value">
                        <a-date-picker
                            v-model:value="form.date"
                            valueFormat="YYYY-MM-DD"
                            :placeholder="$t('crm_def.select_date')"
                        />
                    </div>
                </div>
                <div class="form-item">
                    <div class="key">{{ $t('crm_o.seller_signatory') }}：</div>
                    <div class="value">
                        <a-input v-model:value="form.seller_signatory" :placeholder="$t('def.input')" />
                    </div>
                </div>
                <div class="form-item">
                    <div class="key">{{ $t('crm_o.contract_type') }}:</div>
                    <div class="value">
                        <a-select v-model:value="form.source_type" :placeholder="$t('def.select')">
                            <a-select-option
                                v-for="item of CRM_MARITAL_STATUS_MAP"
                                :key="item.value"
                                :value="item.value"
                                >{{ lang === 'zh' ? item.zh : item.en }}</a-select-option
                            >
                        </a-select>
                    </div>
                </div>
                <div class="form-item">
                    <div class="key">{{ $t('crm_o.buyer_signatory') }}：</div>
                    <div class="value">
                        <a-input v-model:value="form.buyer_signatory" :placeholder="$t('def.input')" />
                    </div>
                </div>
                <div class="form-item textarea">
                    <div class="key">{{ $t('crm_o.remark') }}：</div>
                    <div class="value">
                        <a-textarea
                            v-model:value="form.remark"
                            :placeholder="$t('def.input')"
                            :auto-size="{ minRows: 2, maxRows: 6 }"
                            :maxlength="500"
                        />
                        <!-- <span class="content-length">{{ form.remark }}/500</span> -->
                    </div>
                </div>
                <div class="form-item file-upload">
                    <div class="key">{{ $t('crm_t.file') }}:</div>
                    <div class="value">
                        <a-upload
                            name="file"
                            :file-list="upload.fileList"
                            :action="upload.action"
                            :headers="upload.headers"
                            :data="upload.data"
                            :before-upload="handleImgCheck"
                            @change="handleFileChange"
                        >
                            <a-button class="file-upload-btn" type="primary" ghost v-if="upload.fileList.length < 1">
                                <i class="icon i_upload" /> {{ $t('f.upload') }}
                            </a-button>
                        </a-upload>
                    </div>
                </div>
                <div class="table-container">
                    <ItemTable
                        :columns="uploadColumns"
                        :data-source="tableData"
                        :loading="loading"
                        :check-mode="true"
                        @submit="handleSelectItem"
                    />
                </div>
            </div>
        </div>
        <div class="form-block">
            <div class="form-title">
                <div class="title-colorful">{{ $t('crm_b.select_item') }}</div>
            </div>
            <div class="form-content">
                <div class="form-item textarea">
                    <div class="key">{{ $t('r.remark') }}</div>

                    <div class="fault-title">
                        <ItemSelect
                            @select="handleAddFailItem"
                            :disabled-checked="tableData.map(i => i.item_id)"
                            btn-type="primary"
                            :btn-text="$t('i.add')"
                            btn-class="fault-btn"
                            v-if="$auth('repair-order.save')"
                        />
                    </div>
                    <a-table
                        :columns="tableColumns"
                        :data-source="tableData"
                        :scroll="{ x: true }"
                        :row-key="record => record.id"
                        :pagination="false"
                        size="small"
                    >
                        <template #headerCell="{ title }">
                            {{ $t(title) }}
                        </template>
                        <template #bodyCell="{ column, record, index, text }">
                            <template v-if="column.key === 'item'">
                                {{ text || '-' }}
                            </template>
                            <template v-if="column.dataIndex === 'price'">
                                $ {{ text || '-' }}
                                <!--                                    <a-input-number v-model:value="record.price" style="width: 82px;"-->
                                <!--                                                      :min="0" :precision="2" placeholder="请输入"/>-->
                            </template>
                            <template v-if="column.key === 'amount'">
                                <a-input-number
                                    v-model:value="record.amount"
                                    style="width: 66px"
                                    :min="1"
                                    :precision="0"
                                    placeholder="请输入"
                                />
                                {{ $t('in.item') }}
                            </template>
                            <template v-if="column.key === 'discount'">
                                <a-input-number
                                    v-model:value="record.discount"
                                    style="width: 66px"
                                    :min="1"
                                    :max="100"
                                    :precision="0"
                                    placeholder="请输入"
                                />
                                %
                            </template>

                            <template v-if="column.key === 'total_price'">
                                $ {{ $Util.countFilter((record.price * record.amount * record.discount) / 100, 1) }}
                            </template>

                            <template v-if="column.dataIndex === 'operation'">
                                <a-button type="link" class="danger" @click="handleFailItemDelete(index)"
                                    ><i class="icon i_delete" />{{ $t('def.remove') }}
                                </a-button>
                            </template>
                        </template>
                    </a-table>
                </div>
                <div class="form-item">
                    <div class="key">{{ $('crm_o.total_price') }}：</div>
                    <div class="value">
                        <a-input v-model:value="form.total_price" :placeholder="$t('def.input')" />
                    </div>
                </div>
                <div class="form-item">
                    <div class="key">{{ $('crm_o.discount_rate') }}：</div>
                    <div class="value">
                        <a-input v-model:value="form.discount_rate" :placeholder="$t('def.input')" />
                    </div>
                </div>
                <div class="form-item">
                    <div class="key">{{ $('crm_o.other_cost') }}：</div>
                    <div class="value">
                        <a-input v-model:value="form.other_cost" :placeholder="$t('def.input')" />
                    </div>
                </div>
                <div class="form-item">
                    <div class="key">{{ $('crm_o.discount_amount') }}：</div>
                    <div class="value">
                        <a-input v-model:value="form.discount_amount" :placeholder="$t('def.input')" />
                    </div>
                </div>
                <div class="form-item required">
                    <div class="key">{{ $('crm_o.money') }}：</div>
                    <div class="value">
                        <!--  disabled -->
                        <a-input :value="contractAmount" :placeholder="$t('def.input')" />
                    </div>
                </div>
                <div class="form-item required">
                    <div>{{ $t('crm_o.money_tip') }}</div>
                </div>
            </div>
        </div>
        <div class="form-btns">
            <a-button @click="handleSubmit" type="primary">{{ $t('def.save') }}</a-button>
            <a-button @click="routerChange('back')" type="primary" ghost="">{{ $t('def.cancel') }}</a-button>
        </div>
    </div>
</template>

<script>
import Core from '../../core';
import ItemTable from '@/components/table/ItemTable.vue';

export default {
    name: 'OrderEdit',
    components: {
        ItemTable,
    },
    // emits: ['saveFault'],
    props: {
        // btnText: {
        //     type: String,
        //     default: '新增故障'
        // },
        // btnType: {
        //     type: String,
        //     default: 'primary'
        // },
        // btnClass: {
        //     type: String,
        // },
        // ghost: {
        //     type: Boolean,
        //     default: false,
        // },
        // id: {
        //     type: Number,
        // }
    },
    data() {
        return {
            form: {
                id: '',
                remark: '',

                total_price: '',
                discount_rate: '',
                other_cost: '',
                discount_amount: '',
            },
            // 上传文件
            upload: {
                action: Core.Const.NET.FILE_UPLOAD_END_POINT,
                fileList: [],
                headers: {
                    ContentType: false,
                },
                data: {
                    token: Core.Data.getToken(),
                    type: 'file',
                },
            },
            CRM_MARITAL_STATUS_MAP: Core.Const.CRM_CUSTOMER.MARITAL_STATUS_MAP,

            tableData: [],
            loading: false,
        };
    },
    watch: {
        tableData: {
            deep: true,
            immediate: true,
            handler(n) {
                this.moneyCheck();
                // this.imgs = n
            },
        },
    },
    computed: {
        tableColumns() {
            let tableColumns = [
                { title: '操作', dataIndex: 'phone', key: 'operate' },
                { title: '选择产品', dataIndex: 'name', key: 'item' },
                { title: '价格表价格', dataIndex: 'phone', key: 'phone' },
                { title: '销售单价', dataIndex: 'phone', key: 'phone' },
                { title: '数量', dataIndex: 'phone', key: 'count' },
                { title: '折扣', dataIndex: 'phone', key: 'phone' },
                { title: '总价', dataIndex: 'phone', key: 'money' },
                { title: '备注', dataIndex: 'phone', key: 'phone' },
            ];
            return tableColumns;
        },
        uploadColumns() {
            let uploadColumns = [
                { title: '文件名', dataIndex: 'name', key: 'item' },
                { title: '上传人', dataIndex: 'phone', key: 'item' },
                { title: '上传时间', dataIndex: 'phone', key: 'time' },
                { title: '文件大小', dataIndex: 'phone', key: 'item' },
                { title: '备注', dataIndex: 'phone', key: 'item' },
                { title: '操作', dataIndex: 'phone', key: 'operate' },
            ];
            return uploadColumns;
        },
        contractAmount() {
            let amount =
                Number(this.form.total_price * this.form.discount_rate) +
                Number(this.form.other_cost) -
                Number(this.form.discount_amount);
            return amount || '';
        },
    },
    mounted() {},
    methods: {
        routerChange(type, item) {
            switch (type) {
                case 'back': // 详情
                    let routeUrl = this.$router.resolve({
                        path: '/crm-customer/customer-list',
                    });
                    window.open(routeUrl.href, '_self');
                    break;
            }
        },
        // 校验文件
        handleImgCheck(file) {
            // console.log('handleImgCheck file.type', file.type)
            // if (file.type.includes('image/')) {
            //     this.upload.data.type = 'img'
            // } else if (file.type.includes('video/')) {
            //     this.upload.data.type = 'video'
            // } else if (file.type.includes('audio/')) {
            //     this.upload.data.type = 'audio'
            // } else {
            //     this.upload.data.type = 'file'
            // }
            // return true
        },
        // 上传文件
        handleFileChange({ file, fileList }) {
            // console.log("handleFileChange status:", file.status, "file:", file)
            // if (file.status == 'done') {
            //     if (file.response && file.response.code > 0) {
            //         return this.$message.error(file.response.message)
            //     }
            // }
            // this.upload.fileList = fileList
            // let list = file.name.split('.')
            // if (list) {
            //     this.form.type = list.pop().toLowerCase()
            // }
        },

        handleSelectItem(ids, items) {
            // console.log('handleSelectItem ids, items:', ids, items)
            // this.selectItems = items
            // this.selectItemIds = ids
        },

        // 添加商品
        async handleAddFailItem(ids, items) {
            for (let i = 0; i < items.length; i++) {
                const element = items[i];
                element.item_id = element.id;
                element.id = 0;
                element.amount = 1;
                element.price = element.fob_usd / 100;
                element.discount = 100;
            }
            console.log('handleAddFailItem items:', items);
            this.tableData.push(...items);
        },
        // 移除商品
        handleFailItemDelete(index, name) {
            this.tableData.splice(index, 1);
        },
        moneyCheck() {
            if (this.tableData.length > 0) {
                let total_price = 0;
                this.tableData.forEach(record => {
                    total_price += (record.price * record.amount * record.discount) / 100;
                });
                this.form.money = total_price;
                this.moneyDisabled = true;
            } else {
                this.moneyDisabled = false;
            }
        },

        handleSubmit() {
            let form = Core.Util.deepCopy(this.form);
            // let area = Core.Util.deepCopy(this.area)
            if (!form.customer_id) {
                return this.$message.warning(this.$t('def.input'));
            }
            if (!form.source_id) {
                return this.$message.warning(this.$t('def.input'));
            }
            if (!form.date) {
                return this.$message.warning(this.$t('def.select'));
            }
            if (!form.seller_signatory) {
                return this.$message.warning(this.$t('def.input'));
            }
            if (!form.source_type) {
                return this.$message.warning(this.$t('def.select'));
            }
            if (!form.buyer_signatory) {
                return this.$message.warning(this.$t('def.input'));
            }
            if (!form.remark) {
                return this.$message.warning(this.$t('def.input'));
            }
            if (!form.total_price) {
                return this.$message.warning(this.$t('def.input'));
            }
            if (!form.discount_rate) {
                return this.$message.warning(this.$t('def.input'));
            }
            if (!form.other_cost) {
                return this.$message.warning(this.$t('def.input'));
            }
            form.date = form.date ? dayjs(form.date).unix() : 0; // 日期转时间戳

            console.log('form', this.form);

            // Core.Api.CRMOrder.save({
            //     ...form,
            // }).then(() => {
            //     this.$message.success(this.$t('pop_up.save_success'))
            //     this.routerChange('back')
            // }).catch(err => {
            //     console.log('handleSubmit err:', err)
            // })
        },
    },
};
</script>

<style scoped></style>
