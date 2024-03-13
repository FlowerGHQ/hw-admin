<template>
    <div id="ItemDetail">
        <div class="list-container">
            <a-spin :spinning="loading" class="loading-incontent" v-if="loading"></a-spin>
            <div class="title-container">
                <div class="title-area">{{ $t('i.detail') }}</div>
                <div class="btns-area">
                    <!-- <a-button :type="detail.status === 0 ? 'danger' : 'primary'" ghost @click="handleStatusChange()">
                        <template v-if="detail.status === -1"><i class="icon i_putaway" />{{ $t('i.active_a') }}
                        </template>
                        <template v-if="detail.status === 0"><i class="icon i_downaway" />{{ $t('i.inactive_a') }}
                        </template>
                    </a-button> -->
                </div>
            </div>
            <ItemHeader :detail="detail" :showSpec="indep_flag ? true : false" />
            <div class="gray-panel">
                <p class="title">{{ $t('i.information') }}</p>
                <div class="expand-body" v-if="detail.set_id && !indep_flag">
                    <div class="table" :style="{ height: expand ? `${tableHeight}px` : `${tableTheadHeight}px` }">
                        <a-table
                            id="expand-table"
                            :columns="specificColumns"
                            :data-source="specific.data"
                            :scroll="{ x: true }"
                            :row-key="record => record.id"
                            :pagination="false"
                        >
                            <template #headerCell="{ column }">
                                <template v-if="column.key === 'select'">
                                    {{ lang == 'zh' ? column.title : column.dataIndex }}
                                </template>
                            </template>
                            <template #bodyCell="{ column, text, record, index }">
                                <template v-if="column.key === 'input'">
                                    {{ lang == 'zh' ? record.name : record.name_en }}({{ $t('d.code') }}：{{ text }})
                                </template>
                                <template v-if="column.key === 'select'">
                                    {{ lang == 'zh' ? text.value : text.value_en }}
                                </template>
                                <template v-if="column.key === 'item'">
                                    {{ text || '' }}
                                </template>
                                <template v-if="column.key === 'money'">
                                    {{ $Util.priceUnitFilter(record.original_price_currency) }}
                                    {{ $Util.countFilter(text) }}
                                </template>
                                <template v-if="column.key === 'fob'">
                                    {{ column.unit }} {{ $Util.countFilter(text) }}
                                </template>
                                <template v-if="column.dataIndex === 'flag_independent_info'">
                                    <template v-if="index === 0">
                                        <a-tooltip :title="$t('i.default_a')">
                                            {{ $t('i.default') }} <i class="icon i_hint" style="font-size: 12px" />
                                        </a-tooltip>
                                    </template>
                                    <template v-else>
                                        <a-switch
                                            v-model:checked="record.flag_independent_info"
                                            @change="handleIndepChange(record)"
                                        />
                                    </template>
                                </template>
                                <template v-if="column.dataIndex === 'flag_default'">
                                    <template v-if="index === 0">
                                        <a-tooltip :title="$t('i.default_a')">
                                            {{ $t('i.default') }} <i class="icon i_hint" style="font-size: 12px" />
                                        </a-tooltip>
                                    </template>
                                    <template v-else>
                                        <a-switch
                                            v-model:checked="record.flag_default"
                                            @change="handleDefaults(record)"
                                        />
                                    </template>
                                </template>

                                <template v-if="column.key === 'operation'">
                                    <a-button type="link" @click="routerChange('edit', record)"
                                        ><i class="icon i_edit" />{{ $t('def.edit') }}
                                    </a-button>
                                </template>
                            </template>
                        </a-table>
                    </div>
                    <div :class="expand ? 'unexpand' : 'expand'" @click="expand = !expand">
                        <img src="@images/item/expend.svg" />
                    </div>
                </div>
                <div class="panel-content info-container item-list-container">
                    <!-- 多规格商品切换 -->
                    <div v-if="detail.set_id" class="item-list-wrap">
                        <div
                            @click="handleSelectItemCode(item.id)"
                            :class="item.onClick ? 'item-list-block on-click' : 'item-list-block'"
                            v-for="(item, index) in specific.data"
                            :key="index"
                        >
                            <div
                                :class="item.onClick ? 'item-block-name on-click' : 'item-block-name'"
                                v-if="item.name"
                            >
                                {{ lang === 'zh' ? item.name : item.name_en }}
                            </div>
                            <div :class="item.onClick ? 'item-block-name on-click' : 'item-block-name'" v-else>-</div>
                            <div :class="item.onClick ? 'item-block-code on-click' : 'item-block-code'">
                                {{ item.code || '-' }}
                            </div>
                        </div>
                    </div>
                    <!-- 商品展示图/附件/爆炸图/销售BOM -->
                    <div :class="detail.set_id ? 'tab-container' : 'tab-container pd0'">
                        <div class="my-tabs">
                            <my-tabs
                                v-model:activeKey="tabKey"
                                :canClick="canClick"
                                :tabsList="tabList"
                                @handlechange="handleTabChange"
                            ></my-tabs>
                        </div>
                        <!-- 展示图 -->
                        <template v-if="tabKey === 0">
                            <DisplayImage
                                :coverImageList="coverImageList"
                                :detailImageList="detailImageList"
                                :specImageList="specImageList"
                            />
                        </template>
                        <template v-else-if="tabKey === 1">
                            <AttachmentFile
                                :target_id="id"
                                :target_type="ATTACHMENT_TYPE.ITEM"
                                :detail="detail"
                                @submit="getItemDetail"
                                ref="AttachmentFile"
                            />
                        </template>
                        <!-- 爆炸图 -->
                        <template v-else-if="tabKey === 2">
                            <ExplosionImage :detailId="id" :id="currentSpecId" />
                        </template>
                        <template v-else-if="tabKey === 3">
                            <!-- 销售BOM -->
                            <ItemAccessory
                                :item_id="currentSpecId || id"
                                :target_type="ATTACHMENT_TYPE.ITEM"
                                :detail="detail"
                                @submit="getItemDetail"
                                ref="AttachmentFile"
                            />
                        </template>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Core from '../../core';
import ItemHeader from './components/ItemHeader.vue';
import AttachmentFile from './components/AttachmentFile.vue';
import ItemAccessory from './components/ItemAccessory.vue';
import DisplayImage from './components/DisplayImage.vue';
import ExplosionImage from './components/ExplosionImage.vue';
import MyTabs from './components/MyTabs.vue';
export default {
    name: 'RepairDetail',
    components: {
        ItemHeader,
        AttachmentFile,
        ItemAccessory,
        DisplayImage,
        ExplosionImage,
        MyTabs,
    },
    props: {},
    data() {
        return {
            ATTACHMENT_TYPE: Core.Const.ATTACHMENT.TARGET_TYPE,
            loginType: Core.Data.getLoginType(),
            // 加载
            loading: false,
            id: '',
            detail: {}, // 采购单详情
            config: [],

            specific: {
                // 规格
                list: [], // 规格定义
                data: [], // 规格商品
            },
            activeKey: ['itemInfo'],
            indep_flag: 0,
            tableTheadHeight: 0,
            tableHeight: '',
            expand: false,
            tabList: [
                { zh: '展示图', en: 'Picture', value: 0, key: 0 },
                { zh: '附件', en: 'File', value: 1, key: 1 },
                { zh: '爆炸图', en: 'Explosive View', value: 2, key: 2 },
                { zh: '销售BOM', en: 'Sale BOM', value: 3, key: 3 },
            ],
            tabKey: 0,
            coverImageList: [],
            detailImageList: [],
            specImageList: [],
            currentSpecId: null,
            nameList: [
                { key: '1', value: 'aa' },
                { key: '2', value: 'bb' },
            ],
            canClick: false,
        };
    },
    watch: {},
    computed: {
        lang() {
            return this.$store.state.lang;
        },
        specificColumns() {
            let column = [];
            column = this.specific.list.map((item, index) => ({
                id: item.id,
                title: item.name,
                dataIndex: item.key,
                key: 'select',
                option: item.option,
                minWidth: '150px',
            }));
            column = column.filter(item => item.title && item.dataIndex);
            column.unshift({ title: this.$t('r.item_name'), key: 'input', dataIndex: 'code', fixed: 'left' });
            column.push(
                // { title: this.$t('i.cost_price'), key: 'money', dataIndex: 'original_price' },
                // { title: this.$t('i.custom'), dataIndex: 'flag_independent_info' },
                // { title: this.$t('i.default_display'), dataIndex: 'flag_default' },
                { title: this.$t('def.operate'), key: 'operation' },
            );
            return column;
        },
    },
    // 路由离开时，验证附件数量
    beforeRouteLeave(to, from, next) {
        if (this.tabKey === 3) {
            this.$refs.AttachmentFile.validateAmount(next);
        } else {
            next();
        }
    },
    created() {
        this.id = Number(this.$route.query.id) || 0;
        this.tabKey = Number(this.$route.query.tab) || 0;
        console.log('tabKey-------------------------', this.tabKey);
        console.log('id', this.id);
    },
    mounted() {
        this.indep_flag = Number(this.$route.query.indep_flag) || 0;
        this.getItemDetail();
    },
    methods: {
        initHeight() {
            this.tableTheadHeight = document.querySelector('.ant-table-thead').offsetHeight;
            this.tableHeight = document.getElementById('expand-table').offsetHeight;
        },
        routerChange(type, item = {}) {
            let routeUrl = '';
            switch (type) {
                case 'edit': // 编辑
                    routeUrl = this.$router.resolve({
                        path: '/item/item-edit',
                        query: {
                            id: this.id,
                            set_id: this.detail.set_id,
                            indep_flag: this.indep_flag,
                            edit: true,
                        },
                    });
                    window.open(routeUrl.href, '_self');
                    break;
                case 'edit-indep': // 商品个性化编辑
                    routeUrl = this.$router.resolve({
                        path: '/item/item-edit',
                        query: { id: item.id, indep_flag: 1 },
                    });
                    window.open(routeUrl.href, '_self');
                    break;
                case 'detail-indep': // 商品个性化详情
                    routeUrl = this.$router.resolve({
                        path: '/item/item-detail',
                        query: { id: item.id, indep_flag: 1 },
                    });
                    window.open(routeUrl.href, '_blank');
                    break;
                case 'edit-explored':
                    routeUrl = this.$router.resolve({
                        path: '/item/item-explored-edit',
                        query: { id: this.id, indep_flag: this.indep_flag },
                    });
                    window.open(routeUrl.href, '_self');
                    break;
                case 'edit-explored-indep':
                    routeUrl = this.$router.resolve({
                        path: '/item/item-explored-edit',
                        query: { id: item.id, indep_flag: 1 },
                    });
                    window.open(routeUrl.href, '_self');
                    break;
            }
        },
        // 获取 商品详情
        getItemDetail() {
            console.log('this.id', this.id);
            this.loading = true;
            Core.Api.Item.detail({
                id: this.id,
            })
                .then(res => {
                    console.log('getItemDetail res', res);
                    let detail = res.detail || {};
                    detail.sales_area_name = detail.sales_area_list
                        ? detail.sales_area_list.map(i => i.name).join(' , ')
                        : '';
                    this.detail = detail;
                    this.coverImageList = this.detail.logo.split(',');
                    this.detailImageList = this.detail.imgs.split(',');
                    try {
                        this.config = JSON.parse(detail.config);
                    } catch (err) {
                        this.config = [];
                    }
                    if (detail.set_id && !this.indep_flag) {
                        // 多规格展开
                        this.expand = true;
                        if (!this.activeKey.includes('itemSpec')) {
                            this.activeKey.push('itemSpec');
                        }
                        this.getAttrDef();
                    } else {
                        this.expand = false;
                    }
                })
                .catch(err => {
                    console.log('getItemDetail err', err);
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        // 获取规格定义
        getAttrDef() {
            this.loading = true;
            Core.Api.AttrDef.listBySet({
                // 获取规格定义
                set_id: this.detail.set_id,
            }).then(res => {
                let list = res.list.map(item => ({
                    id: item.id,
                    key: item.key,
                    name: item.name,
                    name_en: item.key,
                }));
                this.specific.list = list;
                this.getSpecList();
            });
        },
        // 获取 多规格 商品列表
        getSpecList() {
            this.loading = true;
            Core.Api.Item.listBySet({
                set_id: this.detail.set_id,
            })
                .then(res => {
                    let data = res.list.map(item => {
                        let params = {};
                        for (const attr of this.specific.list) {
                            let element = item.attr_list.find(i => i.attr_def_id === attr.id);
                            if (element != undefined) {
                                params[attr.key] = {
                                    value: element.value,
                                    value_en: element.value_en,
                                };
                            } else {
                                params[attr.key] = {
                                    value: '',
                                    value_en: '',
                                };
                            }
                        }
                        return {
                            ...params,
                            id: item.id,
                            code: item.code,
                            name: item.name,
                            name_en: item.name_en,
                            price: item.price,
                            original_price: item.original_price,
                            original_price_currency: item.original_price_currency,
                            fob_eur: item.fob_eur,
                            fob_usd: item.fob_usd,
                            flag_independent_info: item.flag_independent_info ? true : false,
                            flag_default: item.flag_default ? true : false,
                        };
                    });
                    this.specific.data = data.filter(item => !item.flag_default);
                    if (this.specific.data.length) {
                        this.specific.data[0].onClick = true;
                        this.currentSpecId = Number(this.specific.data[0].id);
                    }
                    this.$nextTick(() => {
                        //获取table和table-header高度
                        this.initHeight();
                    });
                    this.getSpecImg();
                })
                .catch(err => {
                    console.log('getSpecList err', err);
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        // 获取规格图
        getSpecImg() {
            this.loading = true;
            Core.Api.Item.listBySet({
                set_id: this.detail.set_id,
                id: this.currentSpecId,
                flag_default: 0,
            })
                .then(res => {
                    console.log('getSpecImg res', res);
                    if (res.list.length) {
                        this.specImageList = res.list[0].imgs.split(',');
                    }
                })
                .catch(err => {
                    console.log('getSpecImg err', err);
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        // 开启、关闭 商品个性化
        handleIndepChange(record) {
            console.log('handleIndepChange record:', record);
            let _this = this;
            this.$confirm({
                title:
                    this.$t('pop_up.sure') +
                    `${record.flag_independent_info ? this.$t('pop_up.open') : this.$t('pop_up.close')} [${record.code}] ` +
                    this.$t('pop_up.information'),
                okText: this.$t('def.sure'),
                cancelText: this.$t('def.cancel'),
                onOk() {
                    Core.Api.Item.setIndep({ id: record.id })
                        .then(() => {
                            _this.$message.success(_this.$t('pop_up.save_success'));
                            _this.getSpecList();
                        })
                        .catch(err => {
                            console.log('handleIndepChange err', err);
                        });
                },
                onCancel() {
                    record.flag_independent_info = !record.flag_independent_info;
                },
            });
        },
        // 开启、关闭 默认显示
        handleDefaults(record) {
            console.log('handleDefaults record:', record);
            let _this = this;
            this.$confirm({
                title:
                    this.$t('pop_up.sure') +
                    `${record.flag_default ? this.$t('pop_up.open') : this.$t('pop_up.close')} [${record.code}] ` +
                    this.$t('pop_up.default'),
                okText: this.$t('def.sure'),
                cancelText: this.$t('def.cancel'),
                onOk() {
                    Core.Api.Item.setDefaults({ id: record.id })
                        .then(() => {
                            _this.$message.success(_this.$t('pop_up.save_success'));
                            _this.getSpecList();
                        })
                        .catch(err => {
                            console.log('handleIndepChange err', err);
                        });
                },
                onCancel() {
                    record.flag_default = !record.flag_default;
                },
            });
        },

        handleStatusChange() {
            let _this = this;
            let name = _this.detail.status === -1 ? _this.$t('i.active_a') : _this.$t('i.inactive_a');
            this.$confirm({
                title: _this.$t('pop_up.sure') + `${name}？`,
                okText: _this.$t('def.sure'),
                okType: _this.detail.status === -1 ? '' : 'danger',
                content: _this.detail.status === -1 ? '' : _this.$t('i.after'),
                cancelText: _this.$t('def.cancel'),
                onOk() {
                    Core.Api.Item.updateStatus({ id: _this.detail.id })
                        .then(() => {
                            _this.$message.success(name + _this.$t('pop_up.success'));
                            _this.getItemDetail();
                        })
                        .catch(err => {
                            console.log('handleStatusChange err', err);
                        });
                },
            });
        },
        handleSelectItemCode(id) {
            this.currentSpecId = Number(id);
            this.specific.data = this.specific.data.map(item => {
                return {
                    ...item,
                    onClick: item.id === id,
                };
            });
            this.getSpecImg();
        },
        handleTabChange(next) {
            if (typeof next === 'function') {
                if (this.tabKey === 3) {
                    this.$refs.AttachmentFile.validateAmount(next);
                } else {
                    next();
                }
            }
        },
    },
};
</script>

<style lang="less" scoped>
.title {
    color: #000;
    font-size: 16px;
    font-weight: 500;
    margin-bottom: 16px;
}

.expand-body {
    position: relative;
    background-color: #fff;
    padding: 20px;
    margin-bottom: 16px;

    .table {
        overflow: hidden;
        transition: 0.2s;

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
    }

    .expand,
    .unexpand {
        width: 121px;
        height: 16px;
        display: flex;
        align-items: center;
        justify-content: center;
        position: absolute;
        bottom: 5px;
        left: 50%;
        transform: translateX(-50%);
        background-color: #e2e2e2;
        border-bottom-left-radius: 4px;
        border-bottom-right-radius: 4px;
        cursor: pointer;
    }

    .unexpand {
        transform: translateX(-50%) rotate(180deg);
    }
}

.item-list-container {
    display: flex;
}

.item-list-wrap {
    width: 200px;
    background: #fff;
    // border-right: 1px solid #EEE;
    padding-right: 20px;
    box-sizing: border-box;
    position: relative;

    &::after {
        content: '';
        width: 1px;
        height: calc(100% + 40px);
        background: #eee;
        position: absolute;
        right: 0px;
        top: -20px;
    }

    .item-list-block {
        color: #333;
        font-size: 14px;
        font-style: normal;
        font-weight: 500;
        padding: 6px 24px;
        border-radius: 4px;
        border: 1px solid #e2e2e2;
        background: #fff;
        cursor: pointer;
        margin-bottom: 10px;

        &.on-click {
            color: #0061ff;
            background: rgba(0, 97, 255, 0.1);
            border: 1px solid rgba(0, 97, 255, 0.1);
        }

        .item-block-name {
            color: #333;
            font-size: 14px;
            font-style: normal;
            font-weight: 500;
            line-height: normal;

            &.on-click {
                color: #0061ff;
            }
        }

        .item-block-code {
            color: #8e8e8e;
            opacity: 0.6;
            font-size: 12px;
            font-style: normal;
            font-weight: 400;
            line-height: normal;

            &.on-click {
                color: #0061ff;
            }
        }
    }
}

.tab-container {
    padding-left: 20px;
    box-sizing: border-box;
    width: calc(100% - 200px);

    &.pd0 {
        padding: 0;
        width: 100%;
    }

    .my-tabs {
        margin-bottom: 16px;
    }
}

:deep(.ant-tabs-tab) {
    padding: 0px 0 4px 0;
    box-sizing: border-box;
    font-size: 16px;
    width: 80px;
    justify-content: center;
}

:deep(
        .ant-tabs-top > .ant-tabs-nav::before,
        .ant-tabs-bottom > .ant-tabs-nav::before,
        .ant-tabs-top > div > .ant-tabs-nav::before,
        .ant-tabs-bottom > div > .ant-tabs-nav::before
    ) {
    border-bottom: none;
}

.title-area {
    color: #1d2129;
    font-size: 18px;
    font-style: normal;
    font-weight: 600;
    line-height: normal;
}
</style>
