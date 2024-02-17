<template>
    <div id="AftersalesEdit" class="edit-container">
        <div class="title-container">
            <div class="title-area">{{ form.id ? $t('af.edit') : $t('af.save') }}</div>
        </div>
        <div class="gray-panel" v-if="form.type !== TYPE.ONLY_REFUND">
            <div class="panel-content">
                <MySteps :stepsList="stepsList" :current="currStep"></MySteps>
            </div>
        </div>
        <!-- 基本信息 -->
        <div class="form-block" v-if="currStep === 0">
            <div class="form-title">
                <div class="title-colorful">{{ $t('n.information') }}</div>
            </div>
            <div class="form-content">
                <div class="form-item required">
                    <div class="key">{{ $t('af.sn') }}:</div>
                    <div class="value">
                        <a-input
                            v-model:value="form.order_sn"
                            :placeholder="$t('def.input')"
                            @blur="getPurchaseDetail"
                        />
                    </div>
                </div>
                <div class="form-item required">
                    <div class="key">{{ $t('n.type') }}:</div>
                    <div class="value">
                        <a-select :placeholder="$t('def.select')" v-model:value="form.type">
                            <a-select-option v-for="item of typeMap" :key="item.key" :value="item.key">{{
                                item[$i18n.locale]
                            }}</a-select-option>
                        </a-select>
                    </div>
                </div>
                <div class="form-item" :class="needRefund ? 'required' : ''">
                    <div class="key">{{ $t('af.money') }}:</div>
                    <!--                <div class="key">{{needRefund ? $t('af.reimburse') : $t('af.compensate')}}{{$t('af.money')}}:</div>-->
                    <div class="value input-number">
                        <a-input-number
                            v-model:value="form.refund_money"
                            :placeholder="$t('def.input')"
                            :min="0.01"
                            :precision="2"
                            placeholder="0.00"
                        />
                        <span>{{ $Util.priceUnitFilter(form.refund_money_currency) }}</span>
                    </div>
                </div>
                <div class="form-item textarea">
                    <div class="key">{{ $t('r.remark') }}:</div>
                    <div class="value">
                        <a-input
                            v-model:value="form.remark"
                            :placeholder="$t('def.input')"
                            type="textarea"
                            :auto-size="{ minRows: 2, maxRows: 10 }"
                            :max-length="99"
                        />
                        <span class="content-length">{{ form.remark.length }}/99</span>
                    </div>
                </div>
                <div class="form-item img-upload">
                    <div class="key">{{ $t('af.upload') }}:</div>
                    <div class="value">
                        <a-upload
                            name="file"
                            class="image-uploader"
                            list-type="picture-card"
                            accept="image/*"
                            :file-list="upload.fileList"
                            :action="upload.action"
                            :headers="upload.headers"
                            :data="upload.data"
                            :before-upload="handleImgCheck"
                            @change="handleImgChange"
                        >
                            <div class="image-inner" v-if="upload.fileList.length < 5">
                                <i class="icon i_upload" />
                            </div>
                        </a-upload>
                    </div>
                </div>
            </div>
        </div>
        <!-- 售后商品 -->
        <div class="form-block" v-if="currStep === 1">
            <div class="form-title">
                <div class="title-colorful">{{ $t('af.choose') }}</div>
            </div>
            <div class="form-content">
                <ItemSelect
                    @select="handleSelectInItem"
                    :disabled-checked="itemInList.map(i => i.item_id)"
                    btn-type="primary"
                    :btnText="$t('af.choose')"
                    btn-class="select-item-btn"
                    :purchaseId="detail.order_id"
                    @option="getAllInItemList"
                />
                <div class="table-container">
                    <a-table
                        :columns="itemInColumns"
                        :data-source="itemInList"
                        :scroll="{ x: true }"
                        :row-key="record => record.id"
                        :pagination="false"
                    >
                        <template #headerCell="{ title }">
                            {{ $t(title) }}
                        </template>
                        <template #bodyCell="{ column, text, record, index }">
                            <template v-if="column.key === 'detail'">
                                <a-tooltip placement="top" :title="text">
                                    <a-button type="link" @click="routerChange('item', record)"
                                        >{{ text || '-' }}
                                    </a-button>
                                </a-tooltip>
                            </template>
                            <template v-if="column.dataIndex === 'amount'">
                                <a-input-number
                                    v-model:value="record.amount"
                                    style="width: 120px"
                                    :min="1"
                                    :precision="0"
                                    :placeholder="$t('def.input')"
                                />
                                {{ $t('in.item') }}
                            </template>
                            <template v-if="column.dataIndex === 'type'">
                                {{ $Util.itemTypeFilter(text) }}
                            </template>
                            <template v-if="column.key === 'item'">
                                {{ text || '-' }}
                            </template>
                            <template v-if="column.dataIndex === 'count'">
                                {{ text || '-' }} {{ $t('in.item') }}
                            </template>
                            <template v-if="column.key === 'operation'">
                                <a-button type="link" class="danger" @click="handleRemove('In', index)"
                                    ><i class="icon i_delete" /> {{ $t('def.remove') }}</a-button
                                >
                            </template>
                        </template>
                    </a-table>
                </div>
            </div>
        </div>
        <!-- 寄出商品 -->
        <div class="form-block" v-if="currStep === 1 && needItemOut">
            <div class="form-title">
                <div class="title-colorful">
                    {{ $t('n.select') }}{{ typeMap[form.type][$i18n.locale] }}{{ $t('i.item') }}
                </div>
            </div>
            <div class="form-content">
                <ItemSelect
                    @select="handleSelectOutItem"
                    :disabled-checked="itemOutList.map(i => i.item_id)"
                    btn-type="primary"
                    :btnText="`${$t('n.select')}${typeMap[form.type][$i18n.locale]}${$t('i.item')}`"
                    btn-class="select-item-btn"
                />
                <div class="table-container">
                    <a-table
                        :columns="itemOutColumns"
                        :data-source="itemOutList"
                        :scroll="{ x: true }"
                        :row-key="record => record.id"
                        :pagination="false"
                    >
                        <template #headerCell="{ title }">
                            {{ $t(title) }}
                        </template>
                        <template #bodyCell="{ column, text, record, index }">
                            <template v-if="column.key === 'detail'">
                                <a-tooltip placement="top" :title="text">
                                    <a-button type="link" @click="routerChange('item', record)"
                                        >{{ text || '-' }}
                                    </a-button>
                                </a-tooltip>
                            </template>
                            <template v-if="column.dataIndex === 'amount'">
                                <a-input-number
                                    v-model:value="record.amount"
                                    style="width: 120px"
                                    :min="1"
                                    :max="record.count"
                                    :precision="0"
                                    :placeholder="$t('def.input')"
                                />
                                {{ $t('in.item') }}
                            </template>
                            <template v-if="column.dataIndex === 'type'">
                                {{ $Util.itemTypeFilter(text) }}
                            </template>
                            <template v-if="column.key === 'item'">
                                {{ text || '-' }}
                            </template>
                            <template v-if="column.key === 'operation'">
                                <a-button type="link" class="danger" @click="handleRemove('Out', index)"
                                    ><i class="icon i_delete" /> {{ $t('def.remove') }}</a-button
                                >
                            </template>
                        </template>
                    </a-table>
                </div>
            </div>
        </div>
        <!-- 按钮 -->
        <div class="form-btns" v-if="currStep === 0">
            <a-button type="primary" @click="handleSubmitInfo">{{ $t('af.step') }}</a-button>
            <a-button type="primary" @click="routerChange('list')" ghost>{{ $t('def.cancel') }}</a-button>
        </div>
        <div class="form-btns" v-if="currStep === 1">
            <a-button type="primary" @click="handleSubmitItem">{{ $t('def.sure') }}</a-button>
            <a-button type="primary" @click="currStep = 0" ghost>{{ $t('af.last') }}</a-button>
        </div>
    </div>
</template>

<script>
import Core from '../../core';
import MySteps from '@/components/common/MySteps.vue';
import ItemSelect from '../../components/popup-btn/ItemSelect.vue';
import EntitySelect from '../../components/popup-btn/EntitySelect.vue';

const TYPE = Core.Const.AFTERSALES.TYPE;
export default {
    name: 'AftersalesEdit',
    components: {
        MySteps,
        ItemSelect,
        EntitySelect,
    },
    props: {},
    data() {
        return {
            TYPE,
            loginType: Core.Data.getOrgType(), // 当前登录的用户的 组织类型
            ORG_TYPE: Core.Const.LOGIN.ORG_TYPE,

            // 加载
            loading: false,
            currStep: 0,
            stepsList: [
                { status: 1, zh: '填写基本信息', en: 'Fill in the basic information' },
                { status: 2, zh: '选择售后商品', en: 'Choose aftermarket products' },
            ],

            id: '', // 售后单ID
            detail: {}, // 售后单详情
            purchase: {}, // 采购单详情
            typeMap: Core.Const.AFTERSALES.TYPE_MAP,
            form: {
                id: '',
                type: undefined,

                sn: '',
                order_sn: '',
                order_id: '',

                refund_money: '',
                refund_money_currency: '',
                remark: '',
                image: '',
            },
            // 需售后商品
            itemInColumns: [
                { title: 'n.name', dataIndex: 'name', key: 'detail' },
                { title: 'i.quantity', dataIndex: 'amount' },
                { title: 'af.quantity', dataIndex: 'count' },
                // { title: '类型', dataIndex: 'type'},
                { title: 'i.categories', dataIndex: ['category', 'name'], key: 'item' },
                { title: 'i.number', dataIndex: 'model', key: 'item' },
                { title: 'i.code', dataIndex: 'code', key: 'item' },
                // { title: '成本价格', dataIndex: 'original_price' ,key: 'money'},
                // { title: 'FOB价', dataIndex: 'fob', key: 'money' },
                // { title: '建议零售价', dataIndex: 'price', key: 'money' },
                { title: 'def.operate', key: 'operation' },
            ],
            itemInListAll: [], // 采购单下单时的商品
            itemInList: [],
            // 需寄出商品
            itemOutColumns: [
                { title: 'n.name', dataIndex: 'name', key: 'detail' },
                { title: 'af.send_number', dataIndex: 'amount' },
                { title: 'i.categories', dataIndex: ['category', 'name'], key: 'item' },
                { title: 'i.number', dataIndex: 'model', key: 'item' },
                { title: 'i.code', dataIndex: 'code', key: 'item' },
                { title: 'def.operate', key: 'operation' },
            ],
            itemOutList: [], // 需要补发、换货的商品
            upload: {
                // 上传图片
                action: Core.Const.NET.FILE_UPLOAD_END_POINT,
                fileList: [],
                headers: { ContentType: false },
                data: {
                    token: Core.Data.getToken(),
                    type: 'img',
                },
            },
        };
    },
    watch: {},
    computed: {
        needItemOut() {
            switch (this.form.type) {
                case TYPE.EXCHANGE_ITEMS:
                case TYPE.REISSUE:
                    return true;
                default:
                    return false;
            }
        },
        needRefund() {
            switch (this.form.type) {
                case TYPE.ONLY_REFUND:
                case TYPE.REFUND_WITH_ITEMS:
                    return true;
                default:
                    return false;
            }
        },
    },
    created() {
        let q = this.$route.query;
        if (q.id) {
            this.id = Number(q.id) || 0;
            this.getOrderDetail();
        }
        if (q.order_id) {
            this.form.order_id = Number(q.order_id) || 0;
        }
        if (q.order_sn) {
            this.form.order_sn = q.order_sn;
            this.getPurchaseDetail();
        }
    },
    methods: {
        routerChange(type, item) {
            let routeUrl = '';
            switch (type) {
                case 'list':
                    routeUrl = this.$router.resolve({
                        path: '/aftersales/aftersales-list',
                    });
                    window.open(routeUrl.href, '_self');
                    break;
                case 'detail':
                    routeUrl = this.$router.resolve({
                        path: '/aftersales/aftersales-detail',
                        query: {
                            id: this.form.id,
                        },
                    });
                    window.open(routeUrl.href, '_self');
                    break;
                case 'item':
                    routeUrl = this.$router.resolve({
                        path: this.$auth('ADMIN') ? '/item/item-detail' : '/purchase/item-display',
                        query: { id: item.item_id },
                    });
                    window.open(routeUrl.href, '_self');
                    break;
            }
        },
        // 获取售后单详情
        getOrderDetail() {
            this.loading = true;
            Core.Api.Aftersales.detail({
                id: this.id,
            })
                .then(res => {
                    console.log('getOrderDetail res', res);
                    let d = res.detail;
                    this.detail = d;
                    for (const key in this.form) {
                        this.form[key] = d[key];
                    }
                    this.form.refund_money = Core.Util.countFilter(this.form.refund_money);
                    if (this.form.images) {
                        let images = this.form.images.split(',');
                        this.upload.fileList = images.map((item, index) => ({
                            uid: index + 1,
                            name: item,
                            url: Core.Const.NET.FILE_URL_PREFIX + item,
                            short_path: item,
                            status: 'done',
                        }));
                        console.log('getOrderDetail this.upload.fileList', this.upload.fileList);
                    }

                    this.getPurchaseDetail();
                })
                .catch(err => {
                    console.log('getOrderDetail err', err);
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        // 获取采购单详情
        getPurchaseDetail() {
            this.form.order_id = '';
            this.form.refund_money_currency = '';
            Core.Api.Purchase.detailBySn({
                sn: this.form.order_sn,
            })
                .then(res => {
                    console.log('getPurchaseDetail res', res);
                    let d = res.detail;
                    if (d) {
                        this.purchase = d;
                        this.form.order_id = d.id;
                        this.form.refund_money_currency = d.currency;
                    }
                })
                .catch(err => {
                    console.log('getPurchaseDetail err', err);
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        // 提交 售后单 基本信息
        handleSubmitInfo() {
            console.log('handleSubmitInfo', this.upload.fileList);

            let form = Core.Util.deepCopy(this.form);
            if (!form.order_sn) {
                return this.$message.warning(this.$t('def.enter'));
            }
            if (Core.Util.isEmptyObj(this.purchase)) {
                return this.$message.warning(this.$t('af.not_found'));
            }
            if (!form.type) {
                return this.$message.warning(this.$t('def.enter'));
            }
            if (this.needRefund && !form.refund_money) {
                return this.$message.warning(this.$t('def.enter'));
            }
            form.refund_money = Math.round(form.refund_money * 100);
            if (form.refund_money > this.purchase.charge) {
                // return this.$message.warning((this.needRefund ? '退款' : '补偿') + '金额不可大采购单实际支付金额')
                return this.$message.warning(this.$t('af.amount'));
            }
            console.log('handleSubmitInfo this.upload.fileList', this.upload.fileList);
            if (this.upload.fileList.length) {
                let list = this.upload.fileList.map(item => {
                    return item.short_path || item.response.data.filename;
                });
                form.images = list.join(',');
            }
            console.log('form.images', form.images);

            Core.Api.Aftersales.save(form)
                .then(res => {
                    console.log('handleSubmitInfo res:', res);
                    this.$message.success(this.$t('pop_up.save_success'));
                    this.form.id = res.detail.id;
                    this.detail = res.detail;
                    this.currStep = 1;
                    if (form.type === TYPE.ONLY_REFUND) {
                        this.routerChange('detail');
                    }
                })
                .catch(err => {
                    console.log('handleSubmit err:', err);
                });
        },
        // 提交 售后单 售后商品
        handleSubmitItem() {
            let inItem = [],
                outItem = [];
            if (!this.itemInList.length) {
                return this.$message.warning(this.$t('af.choose_item'));
            }
            for (const item of this.itemInList) {
                if (!item.amount) {
                    return this.$message.warning(this.$t('def.enter'));
                }
                inItem.push({
                    id: item.id,
                    after_sales_order_id: this.detail.id,
                    amount: item.amount,
                    item_id: item.item_id,
                    type: 1,
                });
            }
            if (this.needItemOut && !this.itemOutList.length) {
                return this.$message.warning(this.$t('def.enter'));
            }
            for (const item of this.itemOutList) {
                if (!item.amount) {
                    return this.$message.warning(this.$t('def.enter'));
                }
                outItem.push({
                    id: item.id,
                    after_sales_order_id: this.detail.id,
                    amount: item.amount,
                    item_id: item.item_id,
                    type: 2,
                });
            }
            Core.Api.AftersalesItem.save({
                after_sales_order_id: this.detail.id,
                after_sales_order_items_list: [...inItem, ...outItem],
            })
                .then(() => {
                    this.$message.success(this.$t('pop_up.save_success'));
                    this.routerChange('detail');
                })
                .catch(err => {
                    console.log('handleSubmit err:', err);
                });
        },

        // 校验图片
        handleImgCheck(file) {
            const isCanUpType = ['image/jpeg', 'image/png', 'image/gif', 'image/bmp'].includes(file.type);
            if (!isCanUpType) {
                this.$message.warning(this.$t('n.file_incorrect'));
            }
            const isLt10M = file.size / 1024 / 1024 < 10;
            if (!isLt10M) {
                this.$message.warning(this.$t('n.picture_smaller'));
            }
            return isCanUpType && isLt10M;
        },
        // 上传图片
        handleImgChange({ file, fileList }) {
            console.log('handleImgChange status:', file.status, 'file:', file);
            if (file.status == 'done') {
                if (file.response && file.response.code > 0) {
                    return this.$message.error(file.response.message);
                }
            }
            this.upload.fileList = fileList;
            console.log('handleImgChange this.upload.fileList:', this.upload.fileList);
        },

        getAllInItemList(items) {
            console.log('getAllInItemList:', items);
            this.itemInListAll = items;
            this.getOrderItemList();
        },
        // 获取采购单详情
        getOrderItemList() {
            Core.Api.AftersalesItem.list({
                after_sales_order_id: this.detail.id,
            })
                .then(res => {
                    console.log('getOrderItemList res:', res);
                    let inItem = [],
                        outItem = [];
                    res.list.forEach(item => {
                        let id = item.id;
                        if (item.item) {
                            item = { ...item, ...item.item };
                        }
                        item.id = id;
                        if (item.type == 1) {
                            inItem.push(item);
                        } else {
                            outItem.push(item);
                        }
                    });

                    for (const item of this.itemInListAll) {
                        for (const element of inItem) {
                            if (item.id === element.item_id) {
                                element.count = item.count;
                                continue;
                            }
                        }
                    }
                    this.itemInList = inItem;
                    this.itemOutList = outItem;
                })
                .catch(err => {
                    console.log('getOrderItemList err:', err);
                });
        },
        handleSelectInItem(ids, items) {
            console.log('handleSelectInItem:', items);
            items.forEach(item => {
                item.item_id = item.id;
                item.amount = 1;
                item.id = 0;
            });
            console.log('items:', items);
            this.itemInList.push(...items);
        },
        handleSelectOutItem(ids, items) {
            console.log('handleSelectOutItem:', items);
            items.forEach(item => {
                item.item_id = item.id;
                item.amount = 1;
                item.id = 0;
            });
            console.log('items:', items);
            this.itemOutList.push(...items);
        },
        handleRemove(type, index) {
            console.log('handleRemove:', index);
            let key = 'item' + type + 'List';
            this[key].splice(index, 1);
        },
    },
};
</script>

<style lang="less">
#AftersalesEdit {
    .table-container {
        width: 92%;
        margin: 20px 0 !important;
    }
    .select-item-btn {
        height: 32px;
        margin-top: -16px;
    }
}
</style>
