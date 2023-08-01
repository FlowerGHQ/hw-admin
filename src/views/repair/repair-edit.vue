<template>
    <div id="RepairEdit" class="edit-container">
        <!-- 标题 -->
        <div class="title-container">
            <div class="title-area">{{ $t('r.repair_create') }}</div>
        </div>
        <!-- 顶部提示 -->
        <div class="tips-container">
            <div class="tips-block">
                <img src="../../assets/images/warn-tip.png" alt="">
                <div class="tips-text" v-for="item in tipList" :key="index">
                    {{ item }}
                </div>
            </div>
        </div>
        <!-- 车辆信息 -->
        <div class="head-container">
            <div class="color-block"></div>
            <div class="head-wrap">
                {{ $t(/*车辆信息*/'r.vehicle_information') }}
            </div>
        </div>
        <!-- 车架号 -->
        <div class="form-container">
            <div class="form-wrap required">
                <div class="key">{{ $t('search.vehicle_no') }}:</div>
                <div class="value">
                    <a-textarea v-model:value="form.vehicle_no" :placeholder="$t('search.enter_vehicle_no')"
                        :auto-size="{ minRows: 1, maxRows: 5 }" />
                </div>
                <a-button type="primary" @click="handleSubmitVehicle">{{ $t('i.addition') }}</a-button>
            </div>
        </div>
        <div class="detail-container">
            <template v-if="isVehicle">
                <div class="item-table-container">
                    <div class="item-table-head">
                        <div class="item-table-title">
                            {{ $t(/*商品信息*/'i.product_information') }}
                        </div>
                        <div class="item-table-tip">
                            {{ $t(/*商品信息*/'r.top_long_tip') }}
                        </div>
                    </div>
                    <a-table style="margin-top: 6px;" :columns="itemTableColumns" :data-source="itemTableData"
                        :scroll="{ x: true }" :row-key="record => record.id" :pagination='false'>
                        <template #headerCell="{ column }">
                            <div v-html="column.title"></div>
                        </template>
                        <template #bodyCell="{ column, text, record }">
                            <template v-if="column.dataIndex === 'warranty_status'">
                                <a-tooltip v-if="text === 3" placement="top" :title="$t('r.tooltip_text')">
                                    <div class="status status-bg status-box" :class="$Util.threePagFilter(text, 'color')">
                                        {{ $Util.threePagFilter(text, $i18n.locale) }}
                                    </div>
                                </a-tooltip>
                                <div class="status status-bg status-box" v-else
                                    :class="$Util.threePagFilter(text, 'color')">
                                    {{ $Util.threePagFilter(text, $i18n.locale) }}
                                </div>
                            </template>
                            <!-- 通用展示 -->
                            <template v-if="column.key === 'item'">
                                {{ text || '-' }}
                            </template>
                            <template v-if="column.key === 'frame_uid'">
                                <a-tooltip placement="top" :title='text'>
                                    {{ text || '-' }}
                                </a-tooltip>
                            </template>
                            <!-- 行驶公里数 -->
                            <template v-if="column.key === 'input'">
                                <a-input v-model:value="mileage" style="width: 140px; margin-right: 4px;"
                                    :placeholder="$t(/*请输入里程数*/'search.enter_mile')" /> {{ $t(/*公里*/'r.km') }}
                            </template>
                            <template v-if="column.key === 'operation'">
                                <a-button type="link" class="danger" @click="handleDeleteItemTable">{{ $t('def.delete')
                                }}</a-button>
                            </template>
                        </template>
                    </a-table>
                    <div class="table-footer">
                        <!-- 共 条记录 -->
                        {{ $t('n.all_total') }}
                        <span class="table-footer-num">{{ itemTableDetail.count || 0 }}</span>
                        <!-- 已过滤重复 条 -->
                        {{ $t('r.records') }}，{{ $t('r.filtered_duplicate') }}
                        <span class="table-footer-num">{{ itemTableDetail.filter_number || 0 }}</span>
                        {{ $t('in.total') }}，
                        <!-- 执行中工单 条 -->
                        {{ $t('r.Execute_intermediate') }}
                        <span class="table-footer-num">{{ itemTableDetail.executing_number || 0 }}</span>
                        <!-- 特殊 条 -->
                        {{ $t('in.total') }}，{{ $t('search.special') }}
                        <span class="table-footer-num">{{ itemTableDetail.special_number || 0 }}</span>
                        {{ $t('in.total') }}，{{ $t('r.spec_tip') }}
                    </div>
                </div>
                <template v-for="($1, index) in vehicleGroupList" :key="index">
                    <!-- 车辆信息 -->
                    <div class="head-container pr">
                        <div class="color-block"></div>
                        <div class="head-wrap">
                            {{ $t(/*车型*/'r.car_type') }}：{{ $1.model || '-' }}
                            <div class="order-type-key">{{ $t(/*工单类型*/'r.device_classify') }}：</div>
                            <a-select v-model:value="category" @change="handleOrderChange" style="width: 120px;"
                                :placeholder="$t('def.select')">
                                <a-select-option v-for="item of repairTypeList" :key="item.id" :value="item.value">{{
                                    item[$i18n.locale] }}</a-select-option>
                            </a-select>
                        </div>

                    </div>
                    <!-- 故障分类 故障类型 -->
                    <div class="form-container pl">
                        <!-- 故障种类 -->
                        <div class="form-wrap required">
                            <div class="key">{{ $t('r.fault_type') }}:</div>
                            <div class="value">
                                <a-radio-group v-model:value="$1.failure_type">
                                    <a-radio v-for="item in faultTypeList" :value="item.key">
                                        {{ lang === 'zh' ? item.zh : item.en }}
                                    </a-radio>
                                </a-radio-group>
                            </div>
                        </div>
                        <!-- 故障类型 -->
                        <div class="form-wrap required mt" v-if="$1.failure_type === 1">
                            <div class="key">{{ $t('r.fault_types') }}:</div>
                            <a-checkbox-group class="checkbox-wrap" v-model:value="form.category" :disabled="falgEdit">
                                <a-checkbox v-for="item in faultTypesList" :value="item.value">
                                    {{ item[$i18n.locale] }}
                                </a-checkbox>
                            </a-checkbox-group>
                        </div>
                    </div>
                    <div class="parts-replace-container">
                        <div class="parts-replace-title" v-if="$1.failure_type === 1">
                            {{ $t(/*零部件更换*/'r.replacement_items') }}：
                        </div>
                        <div class="border-wrap" v-for="($2, index) in $1.vehicle_list" :key="index">
                            <div class="vehicle-item-head-wrap">
                                <div class="vehicle-item-head">
                                    {{ $t(/*车架号*/'search.vehicle_no') }}：{{ $2.frame_uid }}
                                </div>
                                <div class="spec-tab" v-if="!$1.model">
                                    {{ $t(/*特殊*/'search.special') }}
                                </div>
                            </div>
                            <!-- 故障类型 -->
                            <div class="form-wrap required mt" v-if="isShow($1.failure_type)">
                                <div class="key">{{ $t('r.fault_types') }}:</div>
                                <a-checkbox-group class="checkbox-wrap" v-model:value="form.category" :disabled="falgEdit">
                                    <a-checkbox v-for="item in faultTypesList" :value="item.value">
                                        {{ item[$i18n.locale] }}
                                    </a-checkbox>
                                </a-checkbox-group>
                            </div>
                            <div class="parts-replace-title mb" v-if="isShow($1.failure_type)">
                                {{ $t(/*零部件更换*/'r.replacement_items') }}：
                            </div>
                            <div class="vehicle-item-table">
                                <a-table :columns="itemVehicleTableColumns" :data-source="$2.itemVehicleTableData"
                                    :scroll="{ x: true }" :row-key="record => record.id" :pagination='false'>
                                    <template #headerCell="{ column }">
                                        <div v-html="column.title"></div>
                                    </template>
                                    <template #bodyCell="{ column, text, record }">
                                        <template v-if="column.dataIndex === 'warranty_status'">
                                            <a-tooltip v-if="text === 3" placement="top" :title="$t('r.tooltip_text')">
                                                <div class="status status-bg status-box"
                                                    :class="$Util.threePagFilter(text, 'color')">
                                                    {{ $Util.threePagFilter(text, $i18n.locale) }}
                                                </div>
                                            </a-tooltip>
                                            <div class="status status-bg status-box" v-else
                                                :class="$Util.threePagFilter(text, 'color')">
                                                {{ $Util.threePagFilter(text, $i18n.locale) }}
                                            </div>
                                        </template>
                                        <!-- 通用展示 -->
                                        <template v-if="column.key === 'item'">
                                            {{ text || '-' }}
                                        </template>
                                        <template v-if="column.key === 'price'">
                                            {{ $Util.countFilter(text) || '-' }}€
                                        </template>
                                        <template v-if="column.key === 'upload'">
                                            <div class="table-upload">
                                                <div class="table-img" v-if="record.attachment_list.length">
                                                    <a-image :width="24" :height="24"
                                                        :src="$Util.imageFilter(record.attachment_list[0]?.path.includes('img') ? record.attachment_list[0]?.path : '', 4)"
                                                        :fallback="$t('def.none')" />
                                                    <a-tooltip placement="top" :title='record.attachment_list[0]?.name'>
                                                        <p class="ell" style="max-width:120px;margin-left:12px;">{{
                                                            record.attachment_list[0]?.name || '-' }}</p>
                                                    </a-tooltip>
                                                </div>
                                                <div v-if="record.attachment_list.length > 1" class="divide-line"></div>
                                                <a-popover placement="bottom" trigger="click" :visible="clicked"
                                                    @visibleChange="handleClickChange">
                                                    <template #content>
                                                        <div class="file-list" v-for="item in record.attachment_list">
                                                            <!-- <div class="file-list"> -->
                                                            <a-image :width="24" :height="24"
                                                                :src="$Util.imageFilter(item?.path.includes('img') ? item?.path : '', 4)"
                                                                :fallback="$t('def.none')" />
                                                            <div class="file-name">
                                                                {{ item.name }}
                                                            </div>
                                                            <i class="icon i_delete" />
                                                            <!-- </div> -->
                                                        </div>
                                                    </template>
                                                    <a-button v-if="record.attachment_list.length > 1" type="link"
                                                        style="margin-left: 8px; font-size: 14px;">{{
                                                            $t('n.more')
                                                        }}</a-button>
                                                </a-popover>
                                                <div v-if="record.attachment_list.length > 1" class="divide-line"></div>
                                                <img @click="handleUploadModalShow($2.frame_uid, record.item_id, record)"
                                                    class="upload-icon" src="../../assets/images/upload-icon.png" alt="">
                                                <div @click="handleUploadModalShow($2.frame_uid, record.item_id, record)"
                                                    class="upload-text">
                                                    {{ $t(/*上传附件*/'n.upload_attachment') }}
                                                </div>
                                            </div>
                                        </template>
                                        <!-- 行驶公里数 -->
                                        <template v-if="column.key === 'input'">
                                            <a-input v-model:value="record.question_desc"
                                                style="width: 180px; margin-right: 4px;" show-count :maxlength="500"
                                                :placeholder="$t(/*请输入问题描述*/'r.fault_description')" />
                                        </template>
                                        <template v-if="column.key === 'operation'">
                                            <a-button type="link" class="danger" @click="handleDeleteItemTable">{{
                                                $t('def.delete')
                                            }}</a-button>
                                        </template>
                                    </template>
                                </a-table>
                                <div class="vehicle-item-footer">
                                    <a-button v-if="!$1.model" class="add-btn" type="primary"
                                        @click="handleSelectItemModal">{{
                                            $t(/*添加商品*/'i.add')
                                        }}</a-button>
                                    <div class="total">
                                        {{ $t(/*合计*/'p.total') }}
                                    </div>
                                    <div class="total-amount">
                                        {{ $t(/*总数量*/'i.total_quantity') }}: {{ $2.amount }}
                                    </div>
                                    <div class="total-amount">
                                        {{ $t(/*总金额*/'r.total_amount') }}: €{{ $2.price }}
                                    </div>
                                    <div class="total-amount">
                                        {{ $t(/*实付金额*/'r.amount_paid') }}: €{{ $2.pay_price }}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </template>
                <!-- 上传附件弹框 -->
                <a-modal v-model:visible="uploadModalShow" :title="$t('n.upload_attachment')"
                    class="attachment-file-upload-modal" :after-close="handleModalClose">
                    <div class="form-title">
                        <div class="form-item required file-upload">
                            <div class="key">{{ $t('f.upload') }}:</div>
                            <div class="value">
                                <a-upload name="file" class="file-uploader" :multiple="true" :file-list="upload.fileList"
                                    :action="upload.action" :headers="upload.headers" :data='upload.data'
                                    :before-upload="handleFileCheck" @change="handleFileChange">
                                    <a-button type="primary" ghost class="file-upload-btn">
                                        <i class="icon i_upload" /> {{ $t('f.choose') }}
                                    </a-button>
                                </a-upload>
                            </div>
                        </div>
                    </div>
                    <template #footer>
                        <a-button @click="uploadModalShow = false">{{ $t('def.cancel') }}</a-button>
                        <a-button @click="handleModalSubmit" type="primary" :disabled="submitDisabled">{{ $t('def.sure')
                        }}</a-button>
                    </template>
                </a-modal>
                <!-- 选择商品弹框 -->
                <a-modal v-model:visible="selectItemModalShow" :title="$t('i.select_item')" width='860px'
                    :after-close="handleModalClose">
                    <div class="repair-modal-content">
                        <div class="modal-title-wrap">
                            <div class="modal-title-key">
                                {{ $t(/*故障选择*/'r.fault_selection') }}
                            </div>
                            <div class="modal-title-value">
                                111
                            </div>
                        </div>
                        <!-- 爆炸图 -->
                        <div class="explored-content" v-if="tabsArray.length > 0">
                            <div class="explore-content">
                                <div class="carousel-list">
                                    <div class="carousel-item" v-for="(item, i) of tabsArray" :key="i">
                                        <img :class="{ carouselImg: mediaWidth }" :src="$Util.imageFilter(item.img)" />
                                        <canvas :ref="`exploreCanvas${i}`"></canvas>
                                        <div class="point-start" v-for="(point, j) in (item.item_component_list || [])"
                                            :key="j"
                                            :style="{ 'left': `${(point.start.x * (point.rate || 1)) - 4}px`, 'top': `${(point.start.y * (point.rate || 1)) - 4}px` }">
                                        </div>
                                        <div class="point-end"
                                            :class="{ 'point-end-select': item.item_component_list[j].target_id === pointIndex }"
                                            v-for="(point, j) in (item.item_component_list || [])" :key="j"
                                            :style="{ 'left': `${(point.end.x * (point.rate || 1)) - 4 * (point.rate || 1)}px`, 'top': `${(point.end.y * (point.rate || 1)) - 4 * (point.rate || 1)}px` }"
                                            @mouseenter.stop="showDetail(i, j)" @mouseleave="showDetail(-1)"
                                            @click="addPoint(item.item_component_list[j].target_id)">
                                            {{ point.index }}
                                        </div>
                                    </div>
                                </div>
                                <transition name="fade">
                                    <div class="component-contain" v-if="selectIndex > -1" :style="componentStyle"
                                        @mouseenter.stop="showDetail(currentExplore.i, currentExplore.j)"
                                        @mouseleave="showDetail(-1)">
                                        <div class="contain-name">
                                            <i class="icon i_skew-bg" />
                                            <span class="icon-name">{{ $t('n.name') }}</span>
                                            <span v-if="$i18n.locale === 'zh'"> {{ componentDetail.name }}</span>
                                            <span v-if="$i18n.locale === 'en'"> {{ componentDetail.name_en }}</span>
                                        </div>
                                        <div class="contain-type">
                                            <div class="type-left">{{ $t('def.model') }}:&nbsp;{{ componentDetail.model }}
                                            </div>
                                            <div class="type-left" v-if="currency === 'eur' || currency === 'EUR'">
                                                €{{ $Util.countFilter(componentDetail[priceKey + 'eur']) }}
                                            </div>
                                            <div class="type-left" v-else>
                                                ${{ $Util.countFilter(componentDetail[priceKey + 'usd']) }}
                                            </div>
                                        </div>
                                    </div>
                                </transition>
                            </div>
                        </div>
                        <SimpleImageEmpty v-else :desc="$t('p.no_item_explode')" />
                        <div class="table-container">
                            <a-table :columns="modalTableColumns" :data-source="modalTableData" :scroll="{ x: true }"
                                :row-key="record => record.id" :loading='loading' :pagination='false'
                                :row-selection="rowSelection">
                                <template #bodyCell="{ record, column, text }">
                                    <template v-if="column.key === 'detail'">
                                        <div class="table-img">
                                            <a-image :width="30" :height="30" :src="$Util.imageFilter(record.logo)"
                                                :fallback="$t('def.none')" />
                                            <a-tooltip placement="top"
                                                :title="$i18n.locale === 'zh' ? record.name : record.name_en || '-'">
                                                <div class="info">
                                                    <div class="ell" style="max-width: 100px">{{ $i18n.locale === 'zh' ?
                                                        record.name : record.name_en || '-' }}</div>
                                                </div>
                                            </a-tooltip>
                                        </div>
                                    </template>
                                    <template v-if="column.key === 'price'">
                                        <span v-if="text >= 0">{{ column.unit }}</span>
                                        {{ $Util.countFilter(text) }}
                                    </template>
                                    <template v-if="column.key === 'item'">
                                        {{ text || '-' }}
                                    </template>
                                    <template v-if="column.dataIndex === 'warranty_status'">
                                        <a-tooltip v-if="text === 3" placement="top" :title="$t('r.tooltip_text')">
                                            <div class="status status-bg status-box"
                                                :class="$Util.threePagFilter(text, 'color')">
                                                {{ $Util.threePagFilter(text, $i18n.locale) }}
                                            </div>
                                        </a-tooltip>
                                        <div class="status status-bg status-box" v-else
                                            :class="$Util.threePagFilter(text, 'color')">
                                            {{ $Util.threePagFilter(text, $i18n.locale) }}
                                        </div>
                                    </template>
                                    <template v-if="column.key === 'category_list'">
                                        <span v-for="(category, index) in text">
                                            <span v-if="index !== 0">,</span>
                                            {{ $i18n.locale === 'zh' ? category.category_name : category.category_name_en }}
                                        </span>
                                    </template>
                                </template>
                            </a-table>
                        </div>
                    </div>
                    <template #footer>
                        <a-button @click="selectItemModalShow = false">{{ $t('def.cancel') }}</a-button>
                        <a-button @click="handleSelectItemSubmit" type="primary">{{ $t('def.sure')
                        }}</a-button>
                    </template>
                </a-modal>
            </template>
        </div>
        <div class="fix-container">
            <div class="pay-method-key">
                {{ $t(/*赔付方式*/'r.payment_method') }}：
                <div class="pay-method-radio">
                    <a-radio-group v-model:value="form.compensation_method">
                        <a-radio v-for="item in payMethodList" :value="item.key">
                            {{ lang === 'zh' ? item.zh : item.en }}
                        </a-radio>
                    </a-radio-group>
                </div>
                <div class="balance">
                    ( {{ $t(/*可用余额*/'r.available_balance') }}: €100 )
                </div>
                <div class="submit-btn-group">
                    <a-button @click="handleCancel">{{ $t(/*取消*/'def.cancel') }}</a-button>
                    <a-button @click="handleConfirm" type="primary">{{ $t(/*提交工单*/'r.submit_work_order') }}</a-button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Core from '../../core';
import SimpleImageEmpty from '../../components/common/SimpleImageEmpty.vue';
const REPAIR = Core.Const.REPAIR
import ChinaAddressCascader from '@/components/common/ChinaAddressCascader.vue';
import AddressCascader from '@/components/common/AddressCascader.vue';
import ItemTable from '@/components/table/ItemTable.vue'
import { get } from 'lodash';

export default {
    name: 'RepairEdit',
    components: { ChinaAddressCascader, AddressCascader, SimpleImageEmpty, ItemTable },
    props: {},
    data() {
        return {
            REPAIR,
            loginType: Core.Data.getLoginType(),
            // 加载
            loading: false,
            tipList: [
                "1. 当前新增工单时，请填写出现同一工单类型的车架号信息",
                "2. 同一车型的车架号会生成一个工单",
                "3. 提交后的工单在没有审核前，可以点击取消并重新编辑工单，也可直接作废该工单，作废的工单不可再次编辑；取消的工单在【已关闭】状态的工单列表中查找",
            ],
            itemTableData: [],
            mileage: undefined,
            category: 1,
            repairTypeList: [ // 工单类型
                { zh: '维修', en: 'Repair', value: 1, key: 1 },
                { zh: '开箱损', en: 'Unpacking Damage', value: 2, key: 2 },
            ],
            form: {
                vehicle_no: undefined,
                failure_type: 1,
                category: [],
                compensation_method: 1,
            },
            vehicleGroupList: [], // 车型
            isVehicle: false,
            uidList: [],
            itemTableDetail: {
                count: 5, //车架号数量
                filter_number: 2, //过滤掉的重复车架号数量
                executing_number: 1, //在执行中的工单数量
                special_number: 1, //特殊的车架号数量
            },
            faultTypeList: [ // 故障种类
                {
                    key: 1,
                    zh: '同一故障',
                    en: 'Identical Fault'
                },
                {
                    key: 2,
                    zh: '不同故障',
                    en: 'Different Fault'
                },
            ],
            payMethodList: [ // 赔付方式
                {
                    key: 1,
                    zh: '赔付配件',
                    en: 'Compensation Accessories'
                },
                {
                    key: 2,
                    zh: '赔付至账户',
                    en: 'Allocated Account'
                },
            ],
            faultTypesList: [ // 故障类型
                {
                    key: 1,
                    zh: '电池组',
                    en: 'Identical Fault',
                    value: 1,
                },
                {
                    key: 2,
                    zh: '电机组',
                    en: 'Different Fault',
                    value: 2,
                },
                {
                    key: 3,
                    zh: '方向组',
                    en: 'Identical Fault',
                    value: 3,

                },
                {
                    key: 4,
                    zh: '制动组',
                    en: 'Different Fault',
                    value: 4,

                },
                {
                    key: 5,
                    zh: '前叉组',
                    en: 'Different Fault',
                    value: 5,

                },
                {
                    key: 6,
                    zh: '前轮组',
                    en: 'Different Fault',
                    value: 6,
                },
                {
                    key: 7,
                    zh: '后轮组',
                    en: 'Different Fault',
                    value: 7,
                },
                {
                    key: 8,
                    zh: '车架组',
                    en: 'Different Fault',
                    value: 8,
                },
                {
                    key: 9,
                    zh: '支撑组',
                    en: 'Different Fault',
                    value: 9,
                },
                {
                    key: 9,
                    zh: '前部塑件组',
                    en: 'Different Fault',
                    value: 9,
                },
                {
                    key: 10,
                    zh: '尾部塑件组',
                    en: 'Identical Fault',
                    value: 10,
                },
                {
                    key: 11,
                    zh: '坐垫组',
                    en: 'Different Fault',
                    value: 11,
                },
            ],
            vehicleGroupList: [],
            itemVehicleTableData: [],
            question_desc: undefined,
            uploadModalShow: false, // 上传文件弹框
            upload: { // upload
                action: Core.Const.NET.FILE_UPLOAD_END_POINT,
                fileList: [],
                headers: {
                    ContentType: false
                },
                data: {
                    token: Core.Data.getToken(),
                    type: 'img',
                },
            },
            submitDisabled: true, // 上传文件按钮禁用
            currentRecord: undefined, // 当前上传附件行数据
            currentFrameUid: undefined, // 当前上传附件车架号
            currentItemId: undefined, // 当前上传附件商品id
            finishUploadData: [], // 上传文件中间数组
            selectItemModalShow: false,
            pointerList: [], // 点位列表
            // 无爆炸图
            explodeShow: true,
            // 爆炸图列表
            exploredList: [],
            // 选中的指示点
            pointIndex: -1,
            canvasGroup: [],
            tabsArray: [],
            selectIndex: -1,
            componentDetail: {},
            componentStyle: {
                'top': '0',
                'left': '0'
            },
            timer: null,
            currentExplore: {
                i: null,
                j: null
            },
            currency: '',
            mediaWidth: null,
            modalTableData: [],
            selectedRowKeys: [],
            selectedRowItems: [],
            selectedRowItemsAll: [],
        };
    },
    watch: {},
    computed: {
        itemTableColumns() {
            let columns = [
                { title: this.$t('search.vehicle_no'), dataIndex: 'frame_uid', key: 'frame_uid' }, // 车架号
                { title: this.$t('r.item_name'), dataIndex: 'item_name', key: 'item' }, // 商品名称
                { title: this.$t('i.code'), dataIndex: 'item_code', key: 'item' }, // 商品编码
                { title: this.$t('r.car_type'), dataIndex: 'model', key: 'item' }, // 车型
                { title: this.$t('i.commercial_specification'), dataIndex: 'item_spec', key: 'item' }, // 商品规格
                {
                    title: `<span style="color: red; margin-right: 2px;">*</span> ${this.$t('r.km_travelled')}`,
                    dataIndex: 'mileage',
                    key: 'input'
                },
                { title: this.$t('r.three_pack_aging'), dataIndex: 'warranty_status' }, // 三包时效
                { title: this.$t('def.operate'), key: 'operation' }
            ]
            return columns
        },
        itemVehicleTableColumns() {
            let columns = [
                { title: this.$t('r.item_name'), dataIndex: 'item_name', key: 'item' }, // 商品名称
                { title: this.$t('i.code'), dataIndex: 'item_code', key: 'item' }, // 商品编码
                { title: this.$t('i.spec'), dataIndex: 'item_spec', key: 'item' }, // 规格
                { title: this.$t('i.amount'), dataIndex: 'amount', key: 'item' }, // 数量
                { title: this.$t('i.unit_price'), dataIndex: 'unit_price', key: 'price' }, // 单价
                { title: this.$t('i.total_price'), dataIndex: 'total_price', key: 'price' }, // 总价
                { title: this.$t('r.fault_types'), dataIndex: 'fault_type', key: 'fault_type' }, // 故障类型
                { title: this.$t('r.three_pack_aging'), dataIndex: 'warranty_status' }, // 三包时效
                {   // 上传附件
                    title: `<span style="color: red; margin-right: 2px;">*</span> ${this.$t('p.attachment')}`,
                    dataIndex: 'attachment_list',
                    key: 'upload'
                },
                {   // 问题描述
                    title: `<span style="color: red; margin-right: 2px;">*</span> ${this.$t('r.description')}`,
                    dataIndex: 'question_desc',
                    key: 'input'
                },
                { title: this.$t('def.operate'), key: 'operation' }
            ]
            return columns
        },
        modalTableColumns() {
            let modalTableColumns = [
                { title: this.$t('r.item_name'), dataIndex: 'name', key: 'detail' }, // 商品名称
                { title: this.$t('i.code'), dataIndex: 'code', key: 'item' }, // 商品编码
                { title: this.$t('i.commercial_specification'), dataIndex: 'item_spec', key: 'item' }, // 商品规格
                { title: this.$t('i.amount'), dataIndex: 'amount', key: 'item' }, // 数量
                { title: this.$t('i.unit_price'), dataIndex: 'unit_price', key: 'price' }, // 单价
                { title: this.$t('i.total_price'), dataIndex: 'total_price', key: 'price' }, // 总价
                { title: this.$t('r.three_pack_aging'), dataIndex: 'warranty_status' }, // 三包时效
            ]
            return modalTableColumns
        },
        lang() {
            return this.$store.state.lang
        },
        rowSelection() {
            return {
                type: 'checkbox',
                selectedRowKeys: this.selectedRowKeys,
                preserveSelectedRowKeys: true,
                onChange: (selectedRowKeys, selectedRows) => { // 表格 选择 改变
                    this.selectedRowKeys = selectedRowKeys
                    this.selectedRowItemsAll.push(...selectedRows)
                    let selectedRowItems = []
                    selectedRowKeys.forEach(id => {
                        let element = this.selectedRowItemsAll.find(i => i.id == id)
                        selectedRowItems.push(element)
                    });
                    this.selectedRowItems = selectedRowItems
                    console.log('rowSelection this.selectedRowKeys:', this.selectedRowKeys, 'selectedRowItems:', selectedRowItems)
                },
            };
        },
    },
    mounted() {
        this.getTableData()
        this.currency = Core.Data.getCurrency();
        // 适配
        if (window.screen.width <= 1280) {
            this.mediaWidth = '700px'
        }
    },
    methods: {
        handleSelectItemModal() {
            this.selectItemModalShow = true
            this.getItemExploreList(this.id)
            this.modalTableData = [
                {
                    id: 7458,
                    imgs: "",
                    name: '360旋转自拍台',
                    category_list: [
                        {
                            category_id: 59,
                            category_name: "广宣品",
                            category_name_en: "Publicity products",
                            create_time: 1690819397,
                            id: 56507,
                            item_id: 7458,
                            update_time: 1690819397,
                            weight: 0
                        }
                    ],
                    model: "ZST01-0080",
                    code: 'ZST01-0080',
                    attr_list: ''
                },
                {
                    id: 7459,
                    imgs: "",
                    name: '液压升降小推车--MAUTO',
                    category_list: [
                        {
                            category_id: 59,
                            category_name: "周边件",
                            category_name_en: "Publicity products",
                            create_time: 1690819397,
                            id: 56507,
                            item_id: 7458,
                            update_time: 1690819397,
                            weight: 0
                        }
                    ],
                    model: "ZST01-0080",
                    code: 'ZST01-0080',
                    attr_list: ''
                },
            ]
        },
        handleSelectItem(ids, items) {
            console.log('handleSelectItem ids, items:', ids, items)
            this.selectItems = items
            this.selectItemIds = ids
        },
        handleSelectItemSubmit() {
            this.selectItemModalShow = false
        },
        handleClickChange() {

        },
        isShow(item) {
            if (item === 2) {
                return true
            } else {
                return false
            }
        },
        handleUploadModalShow(uid, id, record) {
            this.submitDisabled = true
            this.uploadModalShow = true
            this.currentRecord = record
            this.currentFrameUid = uid
            this.currentItemId = id
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
        handleFileChange({ file, fileList }) {
            console.log("handleFileChange status:", file.status, "file:", file)
            if (file.status == 'done') {
                if (file.response && file.response.code > 0) {
                    return this.$message.error(file.response.message)
                }
                const path = file.response.data.filename
                const _item = {
                    "name": file.response.data.name,
                    "path": path,
                    "type": path.split('.').pop(),
                }
                this.finishUploadData.push(_item)
            }
            this.upload.fileList = fileList
            this.submitDisabled = fileList.length === 0;
        },
        // 确定上传文件
        handleModalSubmit() {
            if (this.currentRecord) {
                this.currentRecord.attachment_list = [
                    ...this.currentRecord.attachment_list,
                    ...this.finishUploadData,
                ];
                // 清空上传文件列表
                this.upload.fileList = [];
                this.submitDisabled = true;
            }
            this.uploadModalShow = false;
        },
        // 页面跳转
        routerChange(type, item) {
            let routeUrl
            switch (type) {
                case 'back':
                    this.$router.go(-1)
                    break;
                case 'customer':  // 新建客户
                    routeUrl = this.$router.resolve({
                        path: "/eos-customer/eos-customer-edit",
                    })
                    window.open(routeUrl.href, '_blank')
                    break;
                case 'detail':  // 维修单详情
                    routeUrl = this.$router.replace({
                        path: "/repair/repair-detail",
                        query: {
                            id: item.id
                        }
                    })
                    break;
            }
        },
        getTableData() {
            let res = {
                count: 5, //车架号数量
                filter_number: 2, //过滤掉的重复车架号数量
                executing_number: 1, //在执行中的工单数量
                special_number: 1,
                vehicle_info_list: [
                    {
                        frame_uid: "R45BB2B60P3000006",
                        item_name: "SK3银蓝",
                        item_code: "TLA3-B8-0000",
                        item_spec: "蓝色",
                        model: "EK1",
                        warranty_status: 1
                    },
                    {
                        frame_uid: "R45BB2B60P3000007",
                        item_name: "SK3银蓝",
                        item_code: "TLA3-B8-0001",
                        item_spec: "蓝色",
                        model: "EK3",
                        warranty_status: 2
                    },
                    {
                        frame_uid: "R45BB2B60P3000008",
                        item_name: "SK3银蓝",
                        item_code: "TLA3-B8-0002",
                        item_spec: "蓝色",
                        model: "SK3",
                        warranty_status: 3
                    },
                ],
                vehicle_group_list: [
                    {
                        model: "",
                        failure_type: 1,
                        vehicle_list: [
                            {
                                frame_uid: "R45BB2B60P3000007",
                                itemVehicleTableData: [
                                    {
                                        item_name: '电池',
                                        item_id: 1,
                                        item_code: 'TLA3-B8-0000',
                                        item_spec: '珍珠白；100/80-14’’',
                                        amount: 1,
                                        unit_price: 10000,
                                        total_price: 20000,
                                        fault_type: '电池故障',
                                        warranty_status: 1,
                                        attachment_list: [],
                                        question_desc: '',
                                    },
                                    {
                                        item_name: '电池',
                                        item_id: 2,
                                        item_code: 'TLA3-B8-0000',
                                        item_spec: '珍珠白；100/80-14’’',
                                        amount: 1,
                                        unit_price: 10000,
                                        total_price: 20000,
                                        fault_type: '电池故障',
                                        warranty_status: 1,
                                        attachment_list: [],
                                        question_desc: '',
                                    },
                                ],
                                amount: 10,
                                price: 100,
                                pay_price: 1000,
                            },
                            {
                                frame_uid: "R45BB2B60P3000008",
                                itemVehicleTableData: [
                                    {
                                        item_name: '电池',
                                        item_id: 1,
                                        item_code: 'TLA3-B8-0000',
                                        item_spec: '珍珠白；100/80-14’’',
                                        amount: 1,
                                        unit_price: 10000,
                                        total_price: 20000,
                                        fault_type: '电池故障',
                                        warranty_status: 1,
                                        attachment_list: [],
                                        question_desc: '',
                                    }
                                ],
                                amount: 10,
                                price: 100,
                                pay_price: 1000,
                            },
                        ]
                    },
                    {
                        model: "EK3",
                        failure_type: 1,
                        vehicle_list: [
                            {
                                frame_uid: "R45BB2B60P3000009",
                                itemVehicleTableData: [
                                    {
                                        item_name: '电池',
                                        item_id: 2,
                                        item_code: 'TLA3-B8-0000',
                                        item_spec: '珍珠白；100/80-14’’',
                                        amount: 1,
                                        unit_price: 10000,
                                        total_price: 20000,
                                        fault_type: '电池故障',
                                        warranty_status: 1,
                                        attachment_list: [],
                                        question_desc: '',
                                    }
                                ],
                                amount: 10,
                                price: 100,
                                pay_price: 1000,
                            },
                            {
                                frame_uid: "R45BB2B60P3000010",
                                itemVehicleTableData: [
                                    {
                                        item_name: '电池',
                                        item_code: 'TLA3-B8-0000',
                                        item_spec: '珍珠白；100/80-14’’',
                                        amount: 1,
                                        unit_price: 10000,
                                        total_price: 20000,
                                        fault_type: '电池故障',
                                        warranty_status: 1,
                                        attachment_list: [],
                                        question_desc: '',
                                    }
                                ],
                                amount: 10,
                                price: 100,
                                pay_price: 1000,
                            },
                        ]
                    },
                ]
            };
            this.itemTableData = res.vehicle_info_list
            this.itemTableDetail.count = res.count
            this.itemTableDetail.filter_number = res.filter_number
            this.itemTableDetail.executing_number = res.executing_number
            this.itemTableDetail.special_number = res.special_number
            this.vehicleGroupList = res.vehicle_group_list
        },
        handleDeleteItemTable() {
            let _this = this;
            this.$confirm({
                title: _this.$t('pop_up.sure_delete'),
                okText: _this.$t('def.sure'),
                okType: 'danger',
                cancelText: this.$t('def.cancel'),
                onOk() {
                    console.log('handleDeleteItemTable ok');
                },
            });
        },
        handleSubmitVehicle() {
            this.isVehicle = true
            this.uidList = this.form.vehicle_no.trim().split('\n').map(str => str.trim());;
            console.log('uidList', this.uidList);
        },
        /** 获取 商品爆炸图 */
        getItemExploreList() {
            const ths = this;
            this.pointerList = [];
            this.tabsArray = [];
            Core.Api.Item.getItemComponent({
                // target_id: id, 
                // target_type: Core.Const.ITEM_COMPONENT_SET.TARGET_TYPE.ITEM_CATEGORY
                target_id: 21,
                target_type: 2
            }).then((res) => {
                this.tabsArray = get(res, "list.list", []);
                this.parsePoint();
                ths.$nextTick(() => {
                    ths.tabsArray.forEach((item, index) => {
                        ths.loadImage(item.img, index);
                    })
                })
            }).catch(err => {
                console.log('getItemExploreList err', err);
            });
        },
        parsePoint() {
            this.tabsArray.forEach(item => {
                let list = get(item, "item_component_list", []);
                list.forEach(point => {
                    point.start = point.start_point ? JSON.parse(point.start_point) : { x: 50, y: 50 };
                    point.end = point.end_point ? JSON.parse(point.end_point) : { x: 50, y: 150 };
                })
            })
        },
        /** 加载图片，获取宽高 */
        loadImage(url, index) {
            let img = new Image();
            const ths = this;

            img.onload = () => {
                ths.imageLoadCallback(img.naturalWidth, img.naturalHeight, index);
                img.onload = null;
            };
            img.src = this.$Util.imageFilter(url);
        },
        imageLoadCallback(width, height, index) {
            let cvs = this.$refs[`exploreCanvas${index}`];
            if (!cvs) return;
            if (Array.isArray(cvs) === false) {
                cvs = [cvs]
            }
            this.canvasGroup[index] = cvs
            let rate = null
            // 适配照片的
            if (this.mediaWidth) {
                rate = this.mediaWidth.replace(/['px']/g, '') / 800;
            } else {
                rate = width > 800 ? 1 : 800 / width;
            }
            cvs.forEach(canvas => {
                canvas.width = 800;
                canvas.height = height / width * 800;
                this.canvasUpdata(canvas, index, rate);
            })
        },
        /** 刷新canvas画布 */
        canvasUpdata(cv, index, rate) {
            let ctx = cv.getContext("2d");
            let pointerList = get(this.tabsArray, `[${index}].item_component_list`, []);

            ctx.clearRect(0, 0, cv.width, cv.height);
            ctx.lineWidth = 1;
            ctx.strokeStyle = '#1890ff';
            ctx.beginPath();
            pointerList.forEach(item => {
                item.rate = rate;
                ctx.moveTo(get(item, 'start.x', 0) * rate, get(item, 'start.y', 0) * rate);
                ctx.lineTo(get(item, 'end.x', 0) * rate, get(item, 'end.y', 0) * rate);
            })
            ctx.stroke();
        },
        /** 显示点位详情 */
        showDetail(i, j) {
            let delay = 350;
            if (i > -1) {
                delay = 150;
            }
            if (this.timer) clearTimeout(this.timer);
            const ths = this;
            ths.timer = setTimeout(() => {
                j === null ? '' : ths.selectIndex = j;
                ths.currentExplore = { i, j };
                if (ths.selectIndex < 0) return;
                let rate = get(ths.tabsArray, `[${i}].item_component_list[${ths.selectIndex}].rate`, 1);
                let y = (get(ths.tabsArray, `[${i}].item_component_list[${ths.selectIndex}].end.y`, 0) + 10) * rate;
                let x = (get(ths.tabsArray, `[${i}].item_component_list[${ths.selectIndex}].end.x`, 0) - 15) * rate;

                ths.componentDetail = get(ths.tabsArray, `[${i}].item_component_list[${ths.selectIndex}].item`, {})
                ths.componentStyle.top = `${y + 12}px`;
                ths.componentStyle.left = `${x - 15}px`;
                ths.timer = null;
            }, delay)
        },
        // 增加指示点
        addPoint(id) {
            console.log(id)
            this.pointIndex = id
        },
    }
};
</script>

<style lang="less" scoped>
#RepairEdit {
    position: relative;

    :deep(.ant-table-cell) {
        color: #1D2129;
        font-size: 12px;
    }

    .tips-container {
        width: 100%;
        padding: 20px;
        box-sizing: border-box;

        .tips-block {
            width: 100%;
            padding: 16px 0 16px 46px;
            box-sizing: border-box;
            min-height: 98px;
            border-radius: 8px;
            border: 1px solid rgba(255, 125, 0, 0.30);
            background: #FFF8F2;
            position: relative;

            >img {
                position: absolute;
                top: 20px;
                left: 20px;
                width: 20px;
                height: 20px;
            }

            .tips-text {
                color: #FF7D00;
                font-size: 15px;
                font-weight: 400;
                line-height: 24px;
            }
        }
    }

    .head-container {
        width: 100%;
        display: flex;
        padding: 32px 20px 24px;
        box-sizing: border-box;

        &.pr {
            padding-right: 0;
        }

        .color-block {
            width: 3px;
            height: 48px;
            background-color: #0061FF;
        }

        .head-wrap {
            width: calc(100% - 3px);
            height: 48px;
            background-color: #F9FBFF;
            display: flex;
            align-items: center;
            padding-left: 24px;
            box-sizing: border-box;
            color: #1D2129;
            font-size: 16px;
            font-weight: 600;

            .order-type-key {
                margin-left: 24px;
                margin-right: 10px;
                color: #1D2129;
                font-size: 14px;
                font-weight: 400;
            }
        }
    }

    .form-container {
        width: 100%;
        padding: 0 20px 0;
        box-sizing: border-box;

        &.pl {
            padding-left: 44px;
        }


    }

    .form-wrap {
        display: flex;
        align-items: center;

        &.mt {
            margin-top: 25px;
            align-items: flex-start;
        }

        .key {
            min-width: 100px;
            margin-right: 16px;
            color: #000;
            font-size: 14px;
        }

        .checkbox-wrap {
            width: 100%;
            text-align: center;
            display: flex;
            align-content: flex-start;
            flex-flow: row wrap;

            .ant-checkbox-wrapper {
                width: 25%;
                margin-left: 0;
                margin-bottom: 18px;
                flex: 0 0 20%;
            }
        }

        .value {
            width: 400px;
            height: 32px;

            textarea {
                &::-webkit-scrollbar {
                    /*滚动条整体样式*/
                    width: 6px;
                    height: 52px;
                }


                &::-webkit-scrollbar-thumb {
                    /*滚动条内部滑块*/
                    border-radius: 10px;
                    background-color: #D9D9D9;
                    transition: background-color 0.3s;


                    &:hover {
                        background: #bbb;
                    }
                }


                &::-webkit-scrollbar-track {
                    /*滚动条内部轨道*/
                    // opacity: 0.9;
                    background: #F5F5F5;
                }
            }
        }

        .ant-btn {
            width: 80px;
            height: 32px;
            margin-left: 16px;
        }

        .key::before {
            opacity: 0;
            content: '*';
            color: @TC_required;
            padding-right: 4px;
        }

        &.required {

            // 必填标志
            .key::before {
                opacity: 1;
            }
        }
    }

    .detail-container {
        width: 100%;
        min-height: 650px;
        background-color: #FFF;
        padding: 0 20px 20px 0px;
        box-sizing: border-box;

        .item-table-container {
            margin-top: 104px;
            padding-left: 88px;
            box-sizing: border-box;
            width: 100%;

            .item-table-head {
                display: flex;
                align-items: center;

                .item-table-title {
                    color: #1D2129;
                    font-size: 16px;
                    font-weight: 600;
                }

                .item-table-tip {
                    color: #86909C;
                    font-size: 12px;
                    margin-left: 10px;
                }
            }

            .table-footer {
                color: #86909C;
                font-size: 12px;
                font-weight: 400;
                margin-top: 12px;

                .table-footer-num {
                    color: #F5222D;
                    font-weight: 600;
                }
            }
        }

        .parts-replace-container {
            width: 100%;
            padding: 0 20px 0 48px;
            box-sizing: border-box;

            .parts-replace-title {
                color: #1D2129;
                font-size: 14px;

                &.mb {
                    margin-bottom: 16px;
                }
            }

            .border-wrap {
                margin-top: 16px;
                width: 100%;
                padding: 16px 16px 24px 16px;
                box-sizing: border-box;
                border-radius: 4px;
                border: 1px solid #EEF0F3;
                min-height: 200px;

                .vehicle-item-head-wrap {
                    display: flex;

                    .vehicle-item-head {
                        min-width: 214px;
                        max-width: 260px;
                        height: 24px;
                        background: rgba(0, 97, 255, 0.10);
                        padding: 0px 6px;
                        box-sizing: border-box;
                        color: #0061FF;
                        font-size: 14px;
                        font-weight: 600;
                        line-height: 24px;
                        text-align: center;
                    }

                    .spec-tab {
                        margin-left: 8px;
                        min-width: 52px;
                        text-align: center;
                        line-height: 24px;
                        padding: 0 12px;
                        height: 24px;
                        border-radius: 2px;
                        color: #F5222D;
                        font-size: 14px;
                        font-weight: 400;
                        background: rgba(245, 34, 45, 0.10);
                    }
                }


                .vehicle-item-footer {
                    position: relative;
                    margin-top: 18px;
                    margin-bottom: 16px;
                    width: 100%;
                    display: flex;
                    justify-content: flex-end;
                    color: #1D2129;
                    font-size: 14px;
                    font-weight: 400;

                    .add-btn {
                        position: absolute;
                        left: 0;
                    }

                    .total,
                    .total-amount {
                        margin-right: 24px;
                    }
                }

                .table-upload {
                    display: flex;
                    align-items: center;

                    .divide-line {
                        width: 1px;
                        height: 16px;
                        background: #F0F0F0;
                        margin: 0 12px;
                    }

                    .upload-icon {
                        width: 20px;
                        height: 20px;
                        cursor: pointer;
                        margin-left: 10px;
                    }

                    .upload-text {
                        color: #0061FF;
                        font-size: 14px;
                        font-weight: 400;
                        margin-left: 6px;
                        cursor: pointer;
                    }

                    :deep(.file-list) {
                        display: flex !important;
                        width: 300px;
                    }

                    :deep(.file-name) {
                        width: 1000px;
                        margin-right: 20px;
                        margin-left: 10px;
                    }
                }
            }
        }
    }

    .fix-container {
        width: 100%;
        height: 60px;
        position: fixed;
        z-index: 999;
        bottom: 0;
        display: flex;
        justify-content: right;
        align-items: center;
        background-color: #FFF;

        .pay-method-key {
            width: 840px;
            display: flex;
            align-items: center;
            color: #1D2129;
            font-size: 14px;
            font-weight: 400;

            .pay-method-radio {
                margin-left: 16px;
            }

            .balance {
                color: #86909C;
                font-size: 14px;
                font-weight: 400;
                margin-left: 24px;
            }

            .submit-btn-group {
                margin-left: 32px;
            }
        }
    }

    .form-item {
        .value {
            .fac();

            .ant-input-number {
                margin-right: 10px;
            }

            .unit {
                font-size: 12px;
                line-height: 16px;
                color: #363D42;
            }

        }

        i.icon {
            display: inline-block;
            width: 24px;
            text-align: right;
            font-size: 18px;

        }

        .i_confirm {
            color: @green;
            font-size: 18px;
        }

        .i_close_c {
            color: @red;
            font-size: 18px;

        }

        .not_exist {
            text-align: center;
            align-items: center;
        }
    }
}
</style>
