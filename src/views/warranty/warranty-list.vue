<template>
    <div id="WarrantyList">
        <div class="list-container">
            <div class="title-container">
                <div class="title-area">{{ $t(/*三包管理*/'wt.warranty_management') }}</div>
            </div>
            <div class="tabs-container colorful">
                <a-tabs v-model:activeKey="tabstatus" @change='handleTabSearch(1)'>
                    <a-tab-pane :key="item.value" v-for="item of statusList">
                        <template #tab>
                            <div class="tabs-title">{{ $i18n.locale === 'zh' ? item.name : item.name_en }}</div>
                        </template>
                    </a-tab-pane>
                </a-tabs>
            </div>
            <div class="search-container" v-if="tabstatus !== 1">
                <a-row class="search-area">
                    <!-- 选择类型 (变更记录显示) -->
                    <a-col :xs='24' :sm='24' :xl="8" :xxl='6' class="search-item" v-if="tabstatus === 3">
                        <div class="key">{{ $t('wt.select_type') }}:</div>
                        <div class="value">
                            <a-select v-model:value="searchForm.target_type" @change='handleSearch'
                                :placeholder="$t('def.select')">
                                <a-select-option v-for="item of selectTypeList" :key="item.key" :value="item.value">{{
                                    item[$i18n.locale] }}</a-select-option>
                            </a-select>
                        </div>
                    </a-col> 
                    <template v-if="tabstatus === 2 || searchForm.target_type !== 1">
                        <!-- 商品名称 -->
                        <a-col :xs='24' :sm='24' :xl="8" :xxl='6' class="search-item">
                            <div class="key">{{ $t('r.item_name') }}:</div>
                            <div class="value">
                                <a-input :placeholder="$t('def.input')" v-model:value="searchForm.item_name"
                                    @keydown.enter='handleSearch' />
                            </div>
                        </a-col>                
                        <!-- 商品分类 -->
                        <a-col :xs='24' :sm='24' :xl="8" :xxl='6' class="search-item">
                            <div class="key">{{ $t('wt.product_sort') }}:</div>
                            <div class="value">
                                <CategoryTreeSelect @change="handleSelect" :category-id="searchForm.target_id" type="list-item"/>
                            </div>
                        </a-col>
                        <!-- 商品编码 -->
                        <a-col :xs='24' :sm='24' :xl="8" :xxl='6' class="search-item">
                            <div class="key">{{ $t('i.code') }}:</div>
                            <div class="value">
                                <a-input :placeholder="$t('def.input')" v-model:value="searchForm.item_code"
                                    @keydown.enter='handleSearch' />
                            </div>
                        </a-col>
                    </template>
                </a-row>
                <div class="btn-area">
                    <a-button @click="handleSearch" type="primary">{{ $t('def.search') }}</a-button>
                    <a-button @click="handleSearchReset">{{ $t('def.reset') }}</a-button>
                </div>
            </div>
            <!-- 商品分类 -->
            <div class="table-container" v-if="tabstatus === 1">
                <a-table 
                    :columns="categoryTableColumns" 
                    :data-source="categoryTableData" 
                    :scroll="{ x: true }"
                    :row-key="record => record.target_id" 
                    :pagination='false' 
                    :loading="loading"
                    >
                    <template #bodyCell="{ column, text, record }">
                        <template v-if="column.key === 'item'">
                            {{ ($i18n.locale === 'zh' ? record?.category_name : record?.category_name_en) || '-' }}
                        </template>
                        <template v-if="column.key === 'warranty_period'">
                            <template v-if="record.type !== 2">
                                <a-input-number 
                                    style="width: 60px; 
                                    margin-right: 4px;"
                                    v-model:value="record.month"
                                    :placeholder="$t(/*请输入*/'def.input')" 
                                    :precision="0" 
                                    :min="0"                                    
                                    :max="120"
                                    @blur="handleSaveWarranty(record)" 
                                    />
                                {{ $t(/*个月*/'wt.month') }}
                            </template>
                            <template v-if="record.type !== 1">
                                ,{{ $t(/*或*/'wt.or') }}
                                <a-input-number 
                                    v-model:value="record.mileage"
                                    style="width: 60px; 
                                    margin-right: 4px;"
                                    :min="0" 
                                    :max="20000"
                                    :precision="0" 
                                    :placeholder="$t(/*请输入*/'def.input')" 
                                    @blur="handleSaveWarranty(record)" 
                                    />
                                {{ $t(/*公里*/'r.km') }}
                            </template>
                        </template>
                    </template>
                </a-table>
            </div>
            <!-- 商品列表 -->
            <div class="table-container" v-if="tabstatus === 2">
                <a-table :columns="itemTableColumns" :data-source="itemTableData" :scroll="{ x: true }"
                    :row-key="record => record.id" :pagination='false' :loading="loading">
                    <template #bodyCell="{ column, text, record }">
                        <template v-if="column.key === 'detail'">
                            <a-button type="link" @click="routerChange('detail', record)">
                                {{ ($i18n.locale === 'zh' ? record?.item_name : record?.item_name_en) || '-' }}
                            </a-button>
                        </template>
                        <template v-if="column.key === 'item'">
                            {{ text || '-' }}
                        </template>
                        <template v-if="column.dataIndex === 'item_category_name_list'">
                            {{ $i18n.locale === 'zh' ? record?.item_category_name_list :
                                record?.item_category_name_list_en }}
                        </template>
                        <template v-if="column.dataIndex === 'item_status'">
                            <div class="status status-bg status-tag"
                                :class="$Util.warrantyStatusFilter(record.item_status, 'color')">
                                {{ $Util.warrantyStatusFilter(record.item_status, $i18n.locale) }}
                            </div>
                        </template>
                        <template v-if="column.key === 'warranty_period'">
                            <!-- <div class="flex-wrap" v-show="record.label === 1">
                                <span>{{ record.month }}</span>{{ $t(/*个月*/'wt.month') }}{{ $t(/*或*/'wt.or') }}<span>{{
                                    record.mileage
                                }}</span>{{ $t(/*公里*/'r.km') }}<i class="icon i_edit"
                                    @click="handleEditWarrantyPeriod(record)" style="cursor: pointer; margin-left: 4px;" />

                            </div>
                            <div class="flex-wrap" >
                                <span>{{ record.month }}</span>{{ $t(/*个月*/'wt.month') }}{{ $t(/*或*/'wt.or') }}<span>{{
                                    record.mileage
                                }}</span>{{ $t(/*公里*/'r.km') }}<i class="icon i_edit"
                                    @click="handleEditWarrantyPeriod(record)" style="cursor: pointer; margin-left: 4px;" />
                            </div> -->
                            <div class="flex-wrap">
                                <a-input-number @blur="handleSaveWarranty(record)" style="width: 60px; margin-right: 4px;"
                                    :min="0" :max="120" :precision="0" v-model:value="record.month"
                                    :placeholder="$t(/*请输入*/'def.input')" />
                                {{ $t(/*个月*/'wt.month') }}
                                ,{{ $t(/*或*/'wt.or') }}
                                <a-input-number @blur="handleSaveWarranty(record)" style="width: 60px; margin-right: 4px;"
                                    :min="0" :max="20000" :precision="0" v-model:value="record.mileage"
                                    :placeholder="$t(/*请输入*/'def.input')" />
                                {{ $t(/*公里*/'r.km') }}
                                <div class="tag" v-show="record.label === 2">
                                    {{ $t(/*自定义*/'crm_set.unpreset') }}
                                </div>
                                <div class="tag orange" v-show="record.label === 1">
                                    {{ $t(/*按商品分类*/'wt.classification_commodity') }}
                                </div>
                            </div>
                        </template>
                    </template>
                </a-table>
                <div class="paging-container">
                    <a-pagination v-model:current="currPage" :page-size='pageSize' :total="total" show-quick-jumper
                        show-size-changer show-less-items
                        :show-total="total => $t('n.all_total') + ` ${total} ` + $t('in.total')"
                        :hide-on-single-page='false' :pageSizeOptions="['10', '20', '30', '40']" @change="pageChange"
                        @showSizeChange="pageSizeChange" />
                </div>
            </div>
            <!-- 变更记录 -->
            <div class="table-container" v-if="tabstatus === 3">
                <a-table :columns="trackTableColumns" :data-source="trackTableData" :scroll="{ x: true }"
                    :row-key="record => record.id" :pagination='false'>
                    <template #bodyCell="{ column, text, record }">
                        <template v-if="column.key === 'item'">
                            {{ text || '-' }}
                        </template>
                        <template v-if="column.dataIndex === 'before_change'">
                            {{ record.monthFlag ? record.before_month : '-' }} {{ $t(/*个月*/'wt.month') }} {{
                                $t(/*或*/'wt.or') }} {{ record.mileageFlag ? record.before_mileage : '-' }} {{
        $t(/*公里*/'r.km') }}
                        </template>
                        <template v-if="column.dataIndex === 'after_change'">
                            {{ record.monthFlag ? record.after_month : '-' }} {{ $t(/*个月*/'wt.month') }} {{
                                $t(/*或*/'wt.or') }} {{ record.mileageFlag ? record.after_mileage : '-' }} {{
        $t(/*公里*/'r.km') }}
                        </template>
                        <template v-if="column.key === 'detail'">
                            <a-button type="link" @click="routerChange('detail', record)">
                                {{ ($i18n.locale === 'zh' ? record?.item_name : record?.item_name_en) || '-' }}
                            </a-button>
                        </template>
                        <template v-if="column.key === 'category_name_list'">
                            {{ ($i18n.locale === 'zh' ? record?.category_name_list :
                                record?.category_name_list_en) || '-' }}
                        </template>
                        <template v-if="column.key === 'time'">
                            {{ $Util.timeFilter(text) }}
                        </template>
                    </template>
                </a-table>
                <div class="paging-container">
                    <a-pagination v-model:current="currPage" :page-size='pageSize' :total="total" show-quick-jumper
                        show-size-changer show-less-items
                        :show-total="total => $t('n.all_total') + ` ${total} ` + $t('in.total')"
                        :hide-on-single-page='false' :pageSizeOptions="['10', '20', '30', '40']" @change="pageChange"
                        @showSizeChange="pageSizeChange" />
                </div>
            </div>
        </div>
        <template class="modal-container">
            <a-modal v-model:visible="modalVisible" :title="$t(/*设置期限*/'wt.set_deadline')" @ok="handleModalSubmit">
                <div class="modal-content">
                    <div class="form-item required">
                        <div class="key">{{ $t(/*三包期限*/'wt.warranty_period') }}:</div>
                        <div class="value">
                            <a-input-number style="width: 80px; margin-right: 4px;" :min="0" :max="120" :precision="0"
                                v-model:value="editForm.month" :placeholder="$t(/*请输入*/'def.input')" />
                            {{ $t(/*个月*/'wt.month') }}{{ $t(/*或*/'wt.or') }}
                            <a-input-number style="width: 80px; margin-right: 4px;" :min="0" :max="20000" :precision="0"
                                v-model:value="editForm.mileage" :placeholder="$t(/*请输入*/'def.input')" />
                            {{ $t(/*公里*/'r.km') }}
                        </div>
                    </div>
                </div>
            </a-modal>
        </template>
    </div>
</template>

<script>
import Core from '../../core';
import CategoryTreeSelect from '@/components/popup-btn/CategoryTreeSelect.vue';
const ITEM = Core.Const.ITEM

export default {
    name: 'ItemCategory',
    components: {
        CategoryTreeSelect
    },
    props: {},
    data() {
        return {
            // 加载
            loading: false,
            tableData: [],
            modalVisible: false,
            editForm: {
                month: undefined,
                mileage: undefined,
            },
            statusList: [
                { name: '商品分类', name_en: 'Commodity Classification', key: 1, value: 1 },
                { name: '商品列表', name_en: 'Commodity List', key: 2, value: 2 },
                { name: '变更记录', name_en: 'Change Log', key: 3, value: 3 },
            ],
            selectTypeList: [
                {
                    key: 1,
                    zh: '按商品分类',
                    en: 'Classification by commodity',
                    value: 1
                },
                {
                    key: 2,
                    zh: '按商品列表',
                    en: 'By product list',
                    value: 2
                },
            ],
            tabstatus: 1, // tab切换status
            searchForm: {                
                item_name: undefined,
                target_id: undefined,
                item_code: undefined,
                target_type: 1,
            },
            categoryTableData: [],
            trackTableData: [],
            itemTableData: [],
            item_category: {},
            currPage: 1,
            pageSize: 20,
            total: 0,            
        };
    },
    watch: {},
    computed: {
        categoryTableColumns() {
            let columns = [
                { title: this.$t('wt.product_sort'), dataIndex: 'category_name', key: 'item' },
                { title: this.$t('wt.warranty_period'), dataIndex: 'warranty_period', key: 'warranty_period' },
            ]
            return columns
        },
        itemTableColumns() {
            let columns = [
                { title: this.$t('r.item_name'), dataIndex: 'item_name', key: 'detail' },
                { title: this.$t('wt.product_sort'), dataIndex: 'item_category_name_list' },
                { title: this.$t('i.code'), dataIndex: 'item_code', key: 'item' },
                { title: this.$t('i.commercial_specification'), dataIndex: 'item_spec', key: 'item' },
                { title: this.$t('i.status'), dataIndex: 'item_status' },
                { title: this.$t('wt.warranty_period'), dataIndex: 'month', key: 'warranty_period' },
            ]
            return columns
        },
        trackTableColumns() {
            let columns = [
                { title: this.$t('wt.product_type'), dataIndex: 'category_name_list', key: 'category_name_list' },
                { title: this.$t('wt.before_change'), dataIndex: 'before_change' },
                { title: this.$t('wt.after_change'), dataIndex: 'after_change' },
                { title: this.$t('wt.change_time'), dataIndex: 'create_time', key: 'time' },
            ]
            if (this.searchForm.target_type === 2) {
                columns.splice(0, 1,
                    { title: this.$t('wt.item_name'), dataIndex: 'item_name', key: 'item' },
                    { title: this.$t('wt.product_sort'), dataIndex: 'category_name_list', key: 'category_name_list' },
                    { title: this.$t('i.code'), dataIndex: 'item_code', key: 'item' }
                )
            }
            return columns
        }
    },
    mounted() {
        this.getCategoryTableData();
    },
    methods: {
        routerChange(type, item = {}) {
            let routeUrl = ''
            switch (type) {
                case 'detail':  // 商品详情
                    routeUrl = this.$router.resolve({
                        path: "/item/item-detail",
                        query: { id: item.target_id }
                    })
                    window.open(routeUrl.href, '_blank')
                    break;
            }
        },
        handleEditWarrantyPeriod(record) {
            this.modalVisible = true
            this.editForm = {
                month: record.month,
                mileage: record.mileage,
                id: record.id,
                target_id: record.target_id,
                target_type: record.target_type,
                type: record.type
            };
        },
        pageChange(curr) {
            this.currPage = curr
            this.handleTabSearch();
        },
        pageSizeChange(current, size) {  // 页码尺寸改变
            this.pageSize = size
            this.handleTabSearch();
        },
        handleSearch() {  // 搜索
            this.pageChange(1);
        },
        handleSelect(val) {
            this.searchForm.target_id = val
            this.pageChange(1);
        },
        handleSearchReset() { // 重置
            this.searchForm.item_name = undefined
            this.searchForm.item_code = undefined
            this.searchForm.target_id = undefined
            this.pageChange(1);
        },
        handleTabSearch(type) {
            console.log('handleTabSearch type', type);
            console.log('searchForm', this.searchForm);
            if (type) {
                this.searchForm.target_id = undefined;
                this.searchForm.item_name = undefined;
                this.searchForm.item_code = undefined;
            }
            switch (this.tabstatus) {
                case 1:
                    this.getCategoryTableData();
                    break;
                case 2:
                    this.getItemTableData();
                    break;
                case 3:
                    this.getTrackTableData();
                    break;
            }
        },
        // 商品分类列表
        getCategoryTableData() {
            this.loading = true
            Core.Api.Warranty.categoryList().then(res => {
                console.log('getCategoryTableData res', res);
                this.treeFilter(res.warranty_config_list)
                this.categoryTableData = res.warranty_config_list
            }).catch(err => {
                console.log('getCategoryTableData err', err);
            }).finally(() => {
                this.loading = false
            })
        },
        // 商品列表
        getItemTableData() {
            this.loading = true
            let params = Core.Util.deepCopy(this.searchForm)
            Core.Api.Warranty.itemList({
                ...params,
                page: this.currPage,
                page_size: this.pageSize
            }).then(res => {
                console.log('getItemTableData res', res);
                this.itemTableData = res.warranty_config_list
                this.total = res.count
                // 处理商品分类字段 数组拆分用/连接
                this.itemTableData.forEach(el => {
                    el.item_category_name_list = el.item_category_name_list.length ? el.item_category_name_list.join('/') : '-'
                    el.item_category_name_en_list = el.item_category_name_en_list.length ? el.item_category_name_en_list.join('/') : '-'
                })
            }).catch(err => {
                console.log('getItemTableData err', err);
            }).finally(() => {
                this.loading = false
            })
        },
        getTrackTableData() {
            this.loading = true
            let params = Core.Util.deepCopy(this.searchForm)
            Core.Api.Warranty.updateLogList({
                ...params,                
                page: this.currPage,
                page_size: this.pageSize
            }).then(res => {
                console.log('getTrackTableData res', res);
                this.trackTableData = res.warranty_config_list
                this.total = res.count
                // 处理商品分类字段 数组拆分用/连接
                this.trackTableData.forEach(item => {
                    item.category_name_list = item.category_name_list.join('/')
                    item.category_name_en_list = item.category_name_en_list.join('/')
                    let emptyFlag = !item.content ? true : false
                    if (!emptyFlag) {
                        let targetContent = JSON.parse(item?.content).content[0]
                        item.before_month = targetContent.old_value
                        item.after_month = targetContent.new_value
                        item.monthFlag = targetContent.key === 'wc.month' ? true : false
                        item.before_mileage = targetContent.old_value
                        item.after_mileage = targetContent.new_value
                        item.mileageFlag = targetContent.key === 'wc.mileage' ? true : false
                    }
                })
                console.log('this.trackTableData', this.trackTableData);
            }).catch(err => {
                console.log('getTrackTableData err', err);
            }).finally(() => {
                this.loading = false
            })
        },
        // 更新商品分类列表三包时效信息
        handleSaveWarranty(record) {
            console.log('record', record.month, record.mileage);
            // 时效的上限: 20000公里，120月
            // if(record.month > 120 || record.mileage > 20000){
            //     return this.$message.error(this.$t('wt.max_range'))
            // }
            let params = {
                id: record.id,
                target_id: record.target_id,
                target_type: record.target_type,
                month: record.month,
                mileage: record.mileage,
                type: record.type
            }
            Core.Api.Warranty.warrantyConfigSave({
                ...params
            }).then(res => {
                console.log('hanldeSaveMonth res', res);
                this.getCategoryTableData();
                this.getItemTableData();
            }).catch(err => {
                console.log('hanldeSaveMonth err', err);
            })
        },
        handleModalSubmit() {
            let params = Core.Util.deepCopy(this.editForm)
            Core.Api.Warranty.warrantyConfigSave({
                ...params
            }).then(res => {
                console.log('hanldeSaveMonth res', res);
                this.$message.success(this.$t('pop_up.save_success'))
                this.modalVisible = false
                this.getItemTableData();
            }).catch(err => {
                console.log('hanldeSaveMonth err', err);
            })
        },   

        // 树型展开数据过滤
        treeFilter(list){            
            // console.log("树型数据过滤", list);
            list.forEach(item => {
                // console.log("测试", item.children.length);                      
                if(item.children.length){                    
                    this.treeFilter(item.children)  
                }else{
                    item.children = null  
                }
            });
        }
    }
};
</script>

<style lang="less" scoped>
// #WarrantyList {}
.flex-wrap {
    display: flex;
    align-items: center;

    .tag {
        max-width: 100px;
        padding: 0 10px;
        height: 24px;
        line-height: 22px;
        text-align: center;
        font-size: 12px;
        border-radius: 2px;
        border: 1px solid #3491FA;
        background-color: #E8F7FF;
        color: #3491FA;
        margin-left: 4px;
        &.orange {
            color: #F77234;
            border: 1px solid #F77234;
            background-color: #FFF3E8;
        }
    }
}

.modal-container {
    .modal-content {
        .form-item {
            .value {
                display: flex;
                align-items: center;
            }
        }
    }
}
</style>
