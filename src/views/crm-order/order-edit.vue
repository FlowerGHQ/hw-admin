<template>
    <div id="OrderEdit" class="edit-container">
        <div class="title-container">
            <div class="title-area">{{ form.id ? $t('crm_o.edit') : $t('crm_o.save') }}</div>
        </div>
        <div class="form-block">
            <div class="form-title">
                <div class="title-colorful">{{ $t('n.information') }}</div>
            </div>
            <div class="form-content">
                <div class="form-item required">
                    <div class="key">{{ $t('crm_o.belone_customer') }}：</div> <!-- 所属客户 -->
                    <div class="value">
                        <!--  user_type -->
                        <a-input v-model:value="form.customer_id" :placeholder="$t('def.input')"/>
                    </div>
                </div>
                <div class="form-item required">
                    <div class="key">{{ $t('crm_o.contract_no') }}：</div> <!-- 合同编号 -->
                    <div class="value">
                        <a-input v-model:value="form.uid" :placeholder="$t('def.input')"/>
                    </div>
                </div>
                <div class="form-item required">
                    <div class="key">{{ $t('crm_o.name') }}：</div> <!-- 合同名称 -->
                    <div class="value">
                        <a-input v-model:value="form.name" :placeholder="$t('def.input')"/>
                    </div>
                </div>
                <div class="form-item required">
                    <div class="key">{{ $t('crm_o.signing_date') }}：</div> <!-- 签约日期 -->
                    <div class="value">
                        <!-- <a-input v-model:value="form.date" :placeholder="$t('def.input')"/> -->
                        <a-date-picker v-model:value="form.date" valueFormat='YYYY-MM-DD' placeholder="选择日期"/>
                    </div>
                </div>
                <div class="form-item required">
                    <div class="key">{{ $t('crm_o.seller_signatory') }}：</div> <!-- 我方签约人 -->
                    <div class="value">
                        <a-input v-model:value="form.seller_signatory" :placeholder="$t('def.input')"/>
                    </div>
                </div>
                <div class="form-item required">
                    <div class="key">{{ $t('crm_o.contract_type') }}：</div> <!-- 合同类型 -->
                    <div class="value">
                        <!-- <a-input v-model:value="form.type" :placeholder="$t('def.input')"/> -->
                        <a-select v-model:value="form.type" :placeholder="$t('def.select')" >
                            <a-select-option v-for="item of CRM_ORDER_TYPE" :key="item.value" :value="item.value">{{lang === 'zh' ? item.zh: item.en}}</a-select-option>
                        </a-select>
                    </div>
                </div>
                <div class="form-item required">
                    <div class="key">{{ $t('crm_o.buyer_signatory') }}：</div> <!-- 客户方签约人 -->
                    <div class="value">
                        <a-input v-model:value="form.buyer_signatory" :placeholder="$t('def.input')"/>
                    </div>
                </div>
                <div class="form-item required">
                    <div class="key">{{ $t('crm_o.remark') }}：</div> <!-- 备注 -->
                    <div class="value">
                        <!-- <a-input v-model:value="form.remark" :placeholder="$t('def.input')"/> -->
                        <a-textarea v-model:value="form.remark" :placeholder="$t('def.input')"
                                    :auto-size="{ minRows: 2, maxRows: 6 }" :maxlength='500'/>
                    </div>
                </div>
                <div class="form-item file-upload">
                    <div class="key">附件:</div>
                    <div class="value">
                        <a-button type="primary" @click="handleModalShow" v-if="can_upload">{{$t('n.upload_attachment')}}</a-button>
                    </div>
                </div>
                <div class="table-container">
                    <a-table :columns="uploadColumns" :data-source="uploadData" :scroll="{ x: true }"
                             :row-key="record => record.id" :pagination='false' size="small">
                        <template #headerCell="{title}">
                            {{ $t(title) }}
                        </template>
                        <template #bodyCell="{ column , record ,index, text}">
                            <template v-if="column.key === 'item'">
                                {{ text || '-' }}
                            </template>
                            <template v-if="column.dataIndex === 'price'">
                                $ {{ text || '-' }}
                                <!--                                    <a-input-number v-model:value="record.price" style="width: 82px;"-->
                                <!--                                                      :min="0" :precision="2" placeholder="请输入"/>-->
                            </template>
                            <template v-if="column.key === 'amount'">
                                <a-input-number v-model:value="record.amount" style="width: 66px;"
                                                :min="1" :precision="0" placeholder="请输入"/>
                                {{ $t('in.item') }}
                            </template>
                            <template v-if="column.key === 'discount'">
                                <a-input-number v-model:value="record.discount" style="width: 66px;"
                                                :min="1" :max="100" :precision="0" placeholder="请输入"/>
                                %
                            </template>

                            <template v-if="column.key === 'total_price'">
                                $ {{ $Util.countFilter(record.price * record.amount * record.discount / 100, 1) }}
                            </template>

                            <template v-if="column.key === 'time'">
                                {{ text || '-' }}
                            </template>

                            <template v-if="column.dataIndex === 'operation'">
                                <!-- handleFailUploadDelete(index) -->
                                <a-button type="link" class="danger" @click="handleFileRemove"><i
                                    class="icon i_delete"/>{{ $t('def.remove') }}
                                </a-button>
                            </template>
                            <template v-if="column.key === 'remark'">
                                <a-input v-model:value="record.remark" :placeholder="$t('def.input')"/>
                            </template>
                        </template>
                    </a-table>
                </div>
            </div>
        </div>
        <div class="form-block">
            <div class="form-title">
                <div class="title-colorful">{{ $t('crm_o.sales_info') }}</div>
            </div>
            <div class="form-content">
                <div class="form-item textarea block">
                    <!-- <div class="key">{{ $t('r.remark') }}</div> -->

                    <div class="fault-title">
                        <ItemSelect @select="handleAddFailItem"
                                    :disabled-checked='tableData.map(i => i.item_id)'
                                    btn-type='primary' :btn-text="$t('i.add')" btn-class="fault-btn"
                                    v-if="$auth('repair-order.save')"/>
                    </div>
                    <a-table :columns="tableColumns" :data-source="tableData" :scroll="{ x: true }"
                             :row-key="record => record.id" :pagination='false' size="small">
                        <template #headerCell="{title}">
                            {{ $t(title) }}
                        </template>
                        <template #bodyCell="{ column , record ,index, text}">
                            <template v-if="column.key === 'item'">
                                {{ text || '-' }}
                            </template>
                            <template v-if="column.dataIndex === 'price'">
                                $ {{ text || '-' }}
                                <!--                                    <a-input-number v-model:value="record.price" style="width: 82px;"-->
                                <!--                                                      :min="0" :precision="2" placeholder="请输入"/>-->
                            </template>
                            <template v-if="column.key === 'amount'">
                                <a-input-number v-model:value="record.amount" style="width: 66px;"
                                                :min="1" :precision="0" placeholder="请输入"/>
                                {{ $t('in.item') }}
                            </template>
                            <template v-if="column.key === 'discount'">
                                <a-input-number v-model:value="record.discount" style="width: 66px;"
                                                :min="1" :max="100" :precision="0" placeholder="请输入"/>
                                %
                            </template>

                            <template v-if="column.key === 'total_price'">
                                $ {{ $Util.countFilter(record.price * record.amount * record.discount / 100, 1) }}
                            </template>

                            <template v-if="column.dataIndex === 'operation'">
                                <a-button type="link" class="danger" @click="handleFailItemDelete(index)"><i
                                    class="icon i_delete"/>{{ $t('def.remove') }}
                                </a-button>
                            </template>
                            <template v-if="column.key === 'remark'">
                                <a-input v-model:value="record.remark" :placeholder="$t('def.input')"/>
                            </template>
                        </template>
                    </a-table>
                </div>
                <div class="form-item">
                    <div class="key">{{ $t('crm_o.total_amount') }}：</div>
                    <div class="value">
                        <a-input v-model:value="form.total_price" :placeholder="$t('def.input')"/>
                    </div>
                </div>
                <div class="form-item">
                    <div class="key">{{ $t('crm_o.whole_discount') }}：</div>
                    <div class="value">
                        <a-input v-model:value="form.discount_rate" :placeholder="$t('def.input')"/>
                    </div>
                </div>
                <div class="form-item">
                    <div class="key">{{ $t('crm_o.other_fee') }}：</div>
                    <div class="value">
                        <a-input v-model:value="form.other_cost" :placeholder="$t('def.input')"/>
                    </div>
                </div>
                <div class="form-item">
                    <div class="key">{{ $t('crm_o.discounted') }}：</div>
                    <div class="value">
                        <a-input v-model:value="form.discount_amount" :placeholder="$t('def.input')"/>
                    </div>
                </div>
                <div class="form-item required">
                    <div class="key">{{ $t('crm_o.money') }}：</div>
                    <div class="value">
                        <!--  disabled -->
                        <a-input :value="contractAmount" :placeholder="$t('def.input')"/>
                    </div>
                </div>
                <div class="form-item required">
                    <div>{{ $t('crm_o.money_tip') }}</div>
                </div>
            </div>
        </div>
        <div class="form-btns">
            <a-button @click="handleSubmit" type="primary">{{ $t('def.sure') }}</a-button>
            <a-button @click="routerChange('back')" type="primary" ghost="">{{ $t('def.cancel') }}</a-button>
        </div>

        <!-- 上传附件 -->
        <a-modal v-model:visible="modalShow" :title="$t('n.upload_attachment')" class="attachment-file-upload-modal" :after-close="handleModalClose">
            <div class="form-title">
                <div class="form-item required">
                    <div class="key">{{ $t('n.name') }}:</div>
                    <div class="value">
                        <a-input v-model:value="modelForm.name" :placeholder="$t('def.input')"/>
                    </div>
                </div>
                <div class="form-item required file-upload">
                    <div class="key">{{ $t('f.upload') }}:</div>
                    <div class="value">
                        <a-upload name="file" class="file-uploader"
                            :file-list="upload.fileList" :action="upload.action"
                            :headers="upload.headers" :data='upload.data'
                            :before-upload="handleFileCheck"
                            @change="handleFileChange">
                            <a-button type="primary" ghost class="file-upload-btn" v-if="upload.fileList.length < 1">
                                <i class="icon i_upload"/> {{ $t('f.choose') }}
                            </a-button>
                        </a-upload>
                    </div>
                </div>
            </div>
            <template #footer>
                <a-button @click="modalShow = false">{{ $t('def.cancel') }}</a-button>
                <a-button @click="handleModalSubmit" type="primary" :disabled="submitDisabled">{{ $t('def.sure') }}</a-button>
            </template>
        </a-modal>
    </div>
</template>

<script>
import Core from '../../core';

import ChinaAddressCascader from '@/components/common/ChinaAddressCascader.vue'
import CountryCascader from '@/components/common/CountryCascader.vue'
import AddressCascader from '@/components/common/AddressCascader.vue';
import ItemSelect from '@/components/popup-btn/ItemSelect.vue';
import ItemTable from '@/components/table/ItemTable.vue'
import dayjs from "dayjs";

export default {
    name: 'OrderEdit',
    components: { ChinaAddressCascader, CountryCascader, AddressCascader,ItemSelect,ItemTable },
    props: {},
    data() {
        return {
            ATTACHMENT_TYPE: Core.Const.ATTACHMENT.TARGET_TYPE,
            // 加载
            loading: false,
            detail: {},
            form: {
                customer_id: '',
                uid: '',
                name: '',
                date: '',
                seller_signatory: '',
                // type: '',
                buyer_signatory: '',
                remark:'',
                item_bind_list: []
            },
            // defAddr: [],
            // areaList: [],
            // defArea: [],
            area: {
                country: '',
                country_en: '',
                province: '',
                province_en: '',
                city: '',
                city_en: '',
                county: '',
                county_en: '',

            },
            // areaMap: {},
            countryShow: false,

            tableData: [],
            CRM_ORDER_TYPE: Core.Const.CRM_ORDER.TYPE_MAP,
            modalShow: false,
            submitDisabled: true,
            modelForm: {
                name: '',
                path: '',
                type: ''
            },
            // 上传文件
            upload: {
                action: Core.Const.NET.FILE_UPLOAD_END_POINT,
                fileList: [],
                headers: {
                    ContentType: false
                },
                data: {
                    token: Core.Data.getToken(),
                    type: 'file',
                },
            },
            uploadData: [],
        };
    },
    watch: {},
    computed: {
        lang() {
            return this.$store.state.lang
        },
        tableColumns() {
            let tableColumns = [
                {title: 'def.operate', dataIndex: 'operation', key: 'operation' },
                {title: "crm_o.choose_product", dataIndex: 'name', key: 'item'},
                {title: 'crm_o.price_list', dataIndex: 'price', key: 'price' },
                {title: 'crm_o.unit_price', dataIndex: 'price', key: 'price' },
                {title: 'i.amount', dataIndex: 'amount', key: 'item' },
                {title: 'crm_b.discount', dataIndex: 'discount', key: 'item' },
                {title: 'i.total_price', dataIndex: 'price', key: 'price' },
                {title: 'i.remark', dataIndex: 'remark', key: 'remark' },
            ]
            return tableColumns
        },
        uploadColumns() {
            let uploadColumns = [
                {title: 'crm_o.file_name' , dataIndex: 'name', key: 'item'},
                {title: 'n.uploader', dataIndex: 'belone_customer', key: 'item' },
                {title: 'n.upload_time', dataIndex: 'phone', key: 'time' },
                {title: 'crm_o.file_size', dataIndex: 'phone', key: 'item' },
                {title: 'i.remark', dataIndex: 'remark', key: 'remark' },
                {title: 'def.operate', dataIndex: 'operation', key: 'operation' },
            ]
            return uploadColumns
        },
        contractAmount() {
            let amount = Number(this.form.total_price * this.form.discount_rate) + Number(this.form.other_cost) - Number(this.form.discount_amount)
            return amount || ''
        },
        can_upload() {
            return true
        },
        // user_type() {
        //     return Core.Data.getUserType()
        // },
    },
    mounted() {
        this.form.id = Number(this.$route.query.id) || 0
        if (this.form.id) {
            this.getOrderDetail();
        }
    },
    methods: {
        routerChange(type, item) {
            switch (type) {
                case 'back':    // 详情
                    let routeUrl = this.$router.resolve({
                        path: "/crm-order/order-list",
                    })
                    window.open(routeUrl.href, '_self')
                    break;
            }
        },
        getOrderDetail() {
            this.loading = true;
            Core.Api.CRMOrder.detail({
                id: this.form.id,
            }).then(({detail}) => {
                console.log('getOrderDetail res.detail', detail)
                this.detail = detail
                this.detail.date = detail.date ? dayjs.unix(detail.date).format('YYYY-MM-DD') : undefined
                for (const key in this.form) {
                    this.form[key] = this.detail[key]
                }
                // this.defAddr = [d.province, d.city, d.county]

                // this.defArea = [d.continent || '', d.country || '']
            }).catch(err => {
                console.log('getOrderDetail err', err)
            }).finally(() => {
                this.loading = false;
            });
        },
        handleSubmit() {
            let form = Core.Util.deepCopy(this.form)
            // let area = Core.Util.deepCopy(this.area)
            if (!form.customer_id) {
                return this.$message.warning(this.$t('def.input'))
            }
            if (!form.uid) {
                return this.$message.warning(this.$t('def.input'))
            }
            if (!form.name) {
                return this.$message.warning(this.$t('def.input'))
            }
            if (!form.date) {
                return this.$message.warning(this.$t('def.select'))
            }
            if (!form.seller_signatory) {
                return this.$message.warning(this.$t('def.input'))
            }
            if (!form.type) {
                return this.$message.warning(this.$t('def.select'))
            }
            if (!form.buyer_signatory) {
                return this.$message.warning(this.$t('def.input'))
            }
            if (!form.remark) {
                return this.$message.warning(this.$t('def.input'))
            }
            if (!form.item_bind_list) {
                return this.$message.warning(this.$t('def.select'))
            }
            if (!form.total_price) {
                return this.$message.warning(this.$t('def.input'))
            }
            if (!form.discount_rate) {
                return this.$message.warning(this.$t('def.input'))
            }
            if (!form.other_cost) {
                return this.$message.warning(this.$t('def.input'))
            }
            if (!form.discount_amount) {
                return this.$message.warning(this.$t('def.input'))
            }
            form.date = form.date ? dayjs(form.date).unix() : 0 // 日期转时间戳
            form.item_bind_list = this.tableData


            console.log('form',form)
            // Core.Api.CRMOrder.save({
            //     ...form,
            // }).then(() => {
            //     this.$message.success(this.$t('pop_up.save_success'))
            //     this.routerChange('back')
            // }).catch(err => {
            //     console.log('handleSubmit err:', err)
            // })
        },

        // 添加附件
        handleModalShow() {
            this.modalShow = true;
            this.submitDisabled = true;
        },
        handleModalClose() {
            this.modalShow = false;
            Object.assign(this.modelForm, this.$options.data().modelForm)
            this.upload.fileList = []
        },
        handleModalSubmit() {
            let form = Core.Util.deepCopy(this.modelForm)
            console.log('handleLogin form:', form)
            if (!form.name) {
                return this.$message.warning(this.$t('def.enter'))
            }
            this.loading = true;
            Core.Api.Attachment.save({
                ...form,
                target_type: this.ATTACHMENT_TYPE.ITEM,
                // target_id: this.target_id,
            }).then(() => {
                this.$message.success(this.$t('pop_up.save_success'))
                this.handleModalClose();
                this.getUploadData();
            }).catch(err => {
                console.log('handleSubmit err:', err)
            })
        },
        // 上传前检查文件
        handleFileCheck(file) {
            console.log('handleFileCheck file.type', file.type)
            if (file.type.includes('image/')) {
                this.upload.data.type = 'img'
            } else if (file.type.includes('video/')) {
                this.upload.data.type = 'video'
            } else if (file.type.includes('audio/')) {
                this.upload.data.type = 'audio'
            } else {
                this.upload.data.type = 'file'
            }
            return true
        },
        // 上传文件
        handleFileChange({file, fileList}) {
            console.log("handleCoverChange status:", file.status, "file:", file)
            if (file.status == 'done') {
                if (file.response && file.response.code > 0) {
                    return this.$message.error(file.response.message)
                }
                this.form.path = file.response.data.filename
                this.form.type = this.form.path.split('.').pop()
                if (this.form.path){
                    this.submitDisabled = false
                }
            }
            this.upload.fileList = fileList
        },

        getUploadData() {  // 获取 附件 数据
            this.loading = true;
            Core.Api.Attachment.list({
                // target_id: this.target_id,
                target_type: this.ATTACHMENT_TYPE.ITEM,
                page: 0
            }).then(res => {
                console.log("AttachmentFile res", res)
                this.uploadData = res.list
            }).catch(err => {
                console.log('AttachmentFile err', err)
            }).finally(() => {
                this.loading = false;
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
                    Core.Api.Attachment.delete({id}).then(() => {
                        _this.$message.success(_this.$t('pop_up.delete_success'));
                        _this.getUploadData();
                    }).catch(err => {
                        console.log("handleDelete err", err);
                    })
                },
            });
        },
        // 下载附件
        handleDownload(record) {
            console.log('handleDownload record:', record)
            let url = Core.Const.NET.FILE_URL_PREFIX + record.path
            window.open(url, '_self')
        },

        // 添加商品
        async handleAddFailItem(ids, items) {
            for (let i = 0; i < items.length; i++) {
                const element = items[i];
                element.item_id = element.id
                element.id = 0
                element.amount = 1
                element.price = element.fob_usd / 100
                element.discount = 100
                element.remark = ''
            }
            console.log('handleAddFailItem items:', items)
            this.tableData.push(...items)
        },
        // 移除商品
        handleFailItemDelete(index, name) {
            this.tableData.splice(index, 1)
        },
    }
};
</script>

<style lang="less">
.OrderEdit {

    .icon {
        font-size: 12px;
    }
}
.block {
    display: block;
    padding: 0 20px;
}
</style>
