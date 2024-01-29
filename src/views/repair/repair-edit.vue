<template>
    <div id="RepairEdit" class="edit-container">
        <!-- 标题 -->
        <div class="title-container">
            <div class="title-area">{{ id ? $t(/*编辑工单*/'r.repair_edit') : $t(/*新增工单*/'r.repair_create') }}</div>
        </div>
        <!-- 顶部提示 -->
        <div class="tips-container" v-if="!id">
            <div class="tips-block">
                <img src="../../assets/images/warn-tip.png" alt="">
                <div class="tips-text" v-for="(item, index) in tipList" :key="index">
                    {{ item[$i18n.locale] }}
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
        <div class="form-container" v-if="!id">
            <div class="form-wrap required">
                <div class="key">{{ $t('search.vehicle_no') }}:</div>
                <div class="value">
                    <a-textarea :disabled="isVehicle" v-model:value="form.vehicle_no"
                        :placeholder="$t('search.enter_vehicle_no')" :auto-size="{ minRows: 3, maxRows: 5 }" />
                    <div class="grey-tip">
                        <img src="../../assets/images/warn-tip.png" alt="">
                        {{ $t(/*一行一个车架号*/'r.grey_tip') }}
                    </div>
                </div>
                <a-button v-if="!isVehicle" type="primary" @click="handleSubmitVehicle">{{ $t(/*添加*/'i.addition')
                }}</a-button>
                <a-button v-else type="primary" @click="handleResetVehicle">{{ $t(/*重置*/'def.reset') }}</a-button>
            </div>
        </div>
        <div class="detail-container">
            <template v-if="isVehicle || id">
                <div class="item-table-container">
                    <div class="item-table-head">
                        <div class="item-table-title">
                            {{ $t(/*商品信息*/'i.product_information') }}
                        </div>
                        <div class="item-table-tip">
                            {{ $t(/*请将每辆车行驶的公里数填写在列表内，方便审核*/'r.top_long_tip') }}
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
                                <a-tooltip v-else-if="text === 1" placement="top"
                                    :title="$t(/*起止时间*/'r.start_stop_time') + ':' + $Util.timeFilter(record.begin_time) + $t(/*至*/'r.to') + $Util.timeFilter(record.end_time)">
                                    <div class="status status-bg status-box" :class="$Util.threePagFilter(text, 'color')">
                                        {{ $Util.threePagFilter(text, $i18n.locale) }}
                                    </div>
                                </a-tooltip>
                                <div v-else class="status status-bg status-box"
                                    :class="$Util.threePagFilter(text, 'color')">
                                    {{ $Util.threePagFilter(text, $i18n.locale) }}
                                </div>
                            </template>
                            <!-- 通用展示 -->
                            <template v-if="column.key === 'item'">
                                {{ text || '-' }}
                            </template>
                            <template v-if="column.key === 'detail'">
                                <a-button type="link" v-if="record.item_name" @click="routerChange('itemIdDetail', record)">
                                    {{ record.item_name }}
                                </a-button>
                                <span v-else>-</span>
                            </template>
                            <template v-if="column.key === 'frame_uid'">
                                <a-tooltip placement="top" :title='text'>
                                    {{ text || '-' }}
                                </a-tooltip>
                            </template>
                            <!-- 行驶公里数 -->
                            <template v-if="column.key === 'input'">
                                <a-input @blur="handleMileageBlur(record)" v-model:value="record.mileage"
                                    style="width: 140px; margin-right: 4px;"
                                    :placeholder="$t(/*请输入里程数*/'search.enter_mile')" /> {{ $t(/*公里*/'r.km') }}
                            </template>
                            <template v-if="column.key === 'operation'">
                                <a-button type="link" class="danger" @click="handleDeleteUidTable(record.frame_uid)">{{
                                    $t('def.delete')
                                }}</a-button>
                            </template>
                        </template>
                    </a-table>
                    <div class="table-footer" v-if="!id">
                        <!-- 共 条记录 -->
                        {{ $t('n.all_total') }}
                        <span class="table-footer-num">{{ itemTableDetail.count || 0 }}</span>
                        <!-- 已过滤重复 条 -->
                        {{ $t('r.records') }}，{{ $t('r.filtered_duplicate') }}
                        <span class="table-footer-num">{{ itemTableDetail.filter_number || 0 }}</span>
                        {{ $t('in.total') }}，
                        <!-- 执行中工单 条 -->
                        <!-- {{ $t('r.Execute_intermediate') }}
                        <span class="table-footer-num">{{ itemTableDetail.executing_number || 0 }}</span> -->
                        <!-- 特殊 条 -->
                        <!-- {{ $t('in.total') }}， -->
                        {{ $t('search.special') }}
                        <span class="table-footer-num">{{ itemTableDetail.special_number || 0 }}</span>
                        {{ $t('in.total') }}，{{ $t('r.spec_tip') }}
                    </div>
                </div>
                <template v-for="($1, index) in vehicleGroupList">
                    <!-- 车辆信息 -->
                    <div class="head-container pr">
                        <div class="color-block"></div>
                        <div class="head-wrap">
                            {{ $t(/*车型*/'r.car_type') }}：{{ $1.model || '-' }}
                            <div class="order-type-key">{{ $t(/*工单类型*/'r.device_classify') }}：</div>
                            <a-select v-model:value="$1.category" style="width: 120px;" :placeholder="$t('def.select')">
                                <a-select-option v-for="item of repairTypeList" :key="item.id" :value="item.value">{{
                                    item[$i18n.locale] }}</a-select-option>
                            </a-select>
                        </div>
                    </div>
                    <!-- 故障分类 故障类型 -->
                    <div class="form-container pl">
                    </div>
                    <div class="parts-replace-container">
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
                            <div class="form-wrap required mt" v-if="$1.fault_types_list && $1.fault_types_list.length">
                                <div class="key">{{ $t('r.fault_types') }}:</div>
                                <a-radio-group class="checkbox-wrap" v-model:value="$2.item_category_id"
                                    @change="selectCheckChange($2.frame_uid)">
                                    <a-radio v-for="item in $1.fault_types_list"
                                        :name="$i18n.locale === 'zh' ? item.name : item.name_en" :value="item.id"
                                        @change="handleCheckboxChange($event.target, item.id, item.name, item.name_en)">
                                        {{ $i18n.locale === 'zh' ? item.name : item.name_en }}
                                    </a-radio>
                                </a-radio-group>
                            </div>
                            <div class="parts-replace-title mb">
                                {{ $t(/*零部件更换*/'r.replacement_items') }}：
                            </div>
                            <div class="vehicle-item-table">
                                <a-table :columns="itemVehicleTableColumns" :data-source="$2.repair_order_item_list"
                                    :scroll="{ x: true }" :row-key="record => record.key_id" :pagination='false'>
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
                                            <a-tooltip v-else-if="text === 1" placement="top"
                                                :title="$t(/*起止时间*/'r.start_stop_time') + ':' + $Util.timeFilter(record.begin_time) + $t(/*至*/'r.to') + $Util.timeFilter(record.end_time)">
                                                <div class="status status-bg status-box"
                                                    :class="$Util.threePagFilter(text, 'color')">
                                                    {{ $Util.threePagFilter(text, $i18n.locale) }}
                                                </div>
                                            </a-tooltip>
                                            <div v-else class="status status-bg status-box"
                                                :class="$Util.threePagFilter(text, 'color')">
                                                {{ $Util.threePagFilter(text, $i18n.locale) }}
                                            </div>
                                        </template>
                                        <!-- 通用展示 -->
                                        <template v-if="column.key === 'item'">
                                            {{ text || '-' }}
                                        </template>
                                        <template v-if="column.key === 'amount'">
                                            1
                                        </template>
                                        <template v-if="column.key === 'fault_type'">
                                            {{ ($i18n.locale === 'zh' ? record.category_name : record.category_name_en) ||
                                                '-' }}
                                        </template>
                                        <template v-if="column.key === 'price'">
                                            <div v-if="currency === 'eur' || currency === 'EUR'">
                                                €{{ $Util.countFilter(record[priceKey + 'eur']) }}
                                            </div>
                                            <div v-else>
                                                ${{ $Util.countFilter(record[priceKey + 'usd']) }}
                                            </div>
                                        </template>
                                        <template v-if="column.key === 'detail'">
                                            <a-button type="link" v-if="record.name"
                                                @click="routerChange('itemDetail', record)">
                                                {{ $i18n.locale === 'zh' ? record.name : record.name_en }}
                                            </a-button>
                                            <span v-else>-</span>
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
                                                <div v-if="record.attachment_list.length > 1" class="divide-line">
                                                </div>
                                                <!-- 更多-按钮 -->
                                                <a-button v-if="record.attachment_list.length > 1" type="link"
                                                    style="margin-left: 8px; font-size: 14px;"
                                                    @click="moreAttachModalShow(record)">{{
                                                        $t('n.more')
                                                    }}</a-button>
                                                <div v-if="record.attachment_list.length > 1" class="divide-line">
                                                </div>
                                                <img @click="handleUploadModalShow($2.frame_uid, record.item_id, record)"
                                                    class="upload-icon" src="../../assets/images/upload-icon.png" alt="">
                                                <div @click="handleUploadModalShow($2.frame_uid, record.item_id, record)"
                                                    class="upload-text">
                                                    {{ $t(/*上传附件*/'n.upload_attachment') }}
                                                </div>
                                            </div>
                                        </template>
                                        <!-- 问题描述 -->
                                        <template v-if="column.key === 'input'">
                                            <a-input v-model:value="record.question_desc"
                                                style="width: 180px; margin-right: 4px;" show-count :maxlength="500"
                                                :placeholder="$t(/*请输入问题描述*/'r.fault_description')" />
                                        </template>
                                        <template v-if="column.key === 'operation'">
                                            <a-button type="link" class="danger" @click="handleDeleteItem(record.id, $2)">{{
                                                $t('def.delete')
                                            }}</a-button>
                                        </template>
                                    </template>
                                </a-table>
                                <div class="vehicle-item-footer">
                                    <a-button v-if="!$1.model || (!$1.fault_types_list || !$1.fault_types_list.length)"
                                        class="add-btn" type="primary" @click="handleSelectAllItemModal($2.frame_uid)">{{
                                            $t(/*添加商品*/'i.add')
                                        }}</a-button>
                                    <!-- <a-button class="add-btn" type="primary"
                                        @click="handleSelectAllItemModal($2.frame_uid)">{{
                                            $t(/*添加商品*/'i.add')
                                        }}</a-button> -->
                                    <div class="total">
                                        {{ $t(/*合计*/'p.total') }}
                                    </div>
                                    <div class="total-amount">
                                        {{ $t(/*总数量*/'i.total_quantity') }}: {{ $2.repair_order_item_list.length }}
                                    </div>
                                    <div class="total-amount" v-if="currency === 'eur' || currency === 'EUR'">
                                        {{ $t(/*总金额*/'r.total_amount') }}: €{{ $Util.countFilter($2.totalPrice) }}
                                    </div>
                                    <div class="total-amount" v-else>
                                        {{ $t(/*总金额*/'r.total_amount') }}: ${{ $Util.countFilter($2.totalPrice) }}
                                    </div>
                                    <div class="total-amount" v-if="currency === 'eur' || currency === 'EUR'">
                                        {{ $t(/*实付金额*/'r.amount_paid') }}: €{{ $Util.countFilter($2.totalCharge) }}
                                    </div>
                                    <div class="total-amount" v-else>
                                        {{ $t(/*实付金额*/'r.amount_paid') }}: ${{ $Util.countFilter($2.totalCharge) }}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </template>
                <!-- 上传附件弹框 -->
                <a-modal v-model:visible="uploadModalShow" :title="$t('n.upload_attachment')"
                    class="attachment-file-upload-modal" :after-close="uploadModalClose">
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
                        <a-button @click="handleUploadModalClose">{{ $t('def.cancel') }}</a-button>
                        <a-button @click="handleModalSubmit" type="primary" :disabled="submitDisabled">{{ $t('def.sure')
                        }}</a-button>
                    </template>
                </a-modal>
                <!-- 选择商品弹框 -->
                <a-modal v-model:visible="selectItemModalShow" :title="$t('i.select_item')" width='860px'
                    :after-close="selectItemModalClose">
                    <div class="repair-modal-content">
                        <div class="modal-title-wrap">
                            <div class="modal-title-key">
                                {{ $t(/*故障选择*/'r.fault_selection') }}
                            </div>
                        </div>
                        <!-- 爆炸图 -->
                        <div class="explored-content" v-if="tabsArray.length > 0">
                            <div class="explore-content">
                                <div class="carousel-list">
                                    <div class="carousel-item" v-for="(item, i) of tabsArray" :key="i">
                                        <img :class="{ carouselImg: mediaWidth }" :src="$Util.imageFilter(item?.img)" />
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
                            <a-table :columns="modalTableColumns" :data-source="selectItemTableData" :scroll="{ x: true }"
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
                                    <template v-if="column.key === 'amount'">
                                        1
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
                                </template>
                            </a-table>
                        </div>
                    </div>
                    <template #footer>
                        <a-button @click="selectItemModalCancel">{{ $t('def.cancel') }}</a-button>
                        <a-button @click="handleSelectItemSubmit" type="primary">{{ $t('def.sure')
                        }}</a-button>
                    </template>
                </a-modal>
                <!-- 添加商品弹框 -->
                <AddItemModal v-if="selectAllItemModalShow" :modalShow="selectAllItemModalShow" @select="handleSelectItem"
                    @close="closeAddItemModal" />
                <!-- 查看更多附件列表弹框 -->
                <a-modal v-model:visible="attachModalShow" :title="$t('n.upload_attachment')"
                    class="attachment-file-upload-modal">
                    <div class="file-list" v-for="(item, index) in currentAttachmentList" :key="index">
                        <div class="file-key">
                            <a-image :width="24" :height="24"
                                :src="$Util.imageFilter(item?.path.includes('img') ? item?.path : '', 4)"
                                :fallback="$t('def.none')" />
                            <div class="file-name">
                                {{ item.name }}
                            </div>
                        </div>
                        <div class="file-value">
                            <i class="icon i_delete" @click="handleDeleteFile(index)" />
                        </div>
                    </div>
                    <template #footer>
                        <a-button @click="attachModalShow = false">{{ $t('def.cancel') }}</a-button>
                        <a-button @click="handleMoreAttachmentSubmit" type="primary">{{ $t('def.sure')
                        }}</a-button>
                    </template>
                </a-modal>
            </template>
        </div>
        <!-- 过滤提示弹框 -->
        <a-modal v-model:visible="tipModalShow" :title="$t(/*提示*/'r.tip')" class="attachment-file-upload-modal">
            <div class="form-title">
                <div class="form-item">
                    {{ executingFrameUid || '-' }}{{ $t(/*工单执行中，请先完成上一条工单后再添加*/'r.tip_desc') }}
                </div>
            </div>
            <template #footer>
                <a-button @click="handleTipModalShow">{{ $t('def.cancel') }}</a-button>
                <a-button @click="handleTipModalShow" type="primary">{{ $t('def.sure')
                }}</a-button>
            </template>
        </a-modal>
        <div class="fix-container" v-if="isVehicle || id">
            <div :class="$i18n.locale === 'zh' ? 'pay-method-key' : 'pay-method-key w1080'">
                {{ $t(/*赔付方式*/'r.payment_method') }}：
                <div class="pay-method-radio">
                    <a-radio-group v-model:value="form.compensation_method">
                        <a-radio v-for="item in payMethodList" :value="item.key">
                            {{ lang === 'zh' ? item.zh : item.en }}
                        </a-radio>
                    </a-radio-group>
                </div>
                <div class="balance" v-if="currency === 'eur' || currency === 'EUR'">
                    ( {{ $t(/*可用余额*/'r.available_balance') }}: €{{ $Util.countFilter(balance) || 0 }} )
                </div>
                <div class="balance" v-else>
                    ( {{ $t(/*可用余额*/'r.available_balance') }}: ${{ $Util.countFilter(balance) || 0 }} )
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
import ItemSelect from '@/components/popup-btn/ItemSelect.vue';
import CategoryTreeSelect from '@/components/popup-btn/CategoryTreeSelect.vue'
import AddItemModal from './components/AddItemModal.vue';
import { get } from 'lodash';

export default {
    name: 'RepairEdit',
    components: { ChinaAddressCascader, AddressCascader, SimpleImageEmpty, ItemTable, ItemSelect, CategoryTreeSelect, AddItemModal },
    props: {},
    data() {
        return {
            REPAIR,
            loginType: Core.Data.getLoginType(),
            // 加载
            loading: false,
            tipList: [
                { zh: "1. 当前新增工单时，请填写出现同一工单类型的车架号信息", en: "1. When adding a work order, please fill in the frame number of the same type of work order" },
                { zh: "2. 同一车型的车架号会生成一个工单", en: "2. The frame number of the same model will generate a work order" },
                { zh: "3. 提交后的工单在没有审核前，可以点击取消并重新编辑工单，也可直接作废该工单，作废的工单不可再次编辑；取消的工单在【已关闭】状态的工单列表中查找", en: '3. Before the submitted work order is reviewed, you can click to cancel and edit the work order again, or directly cancel the work order. The invalid work order cannot be edited again. The cancelled work order is found in the work order column table in the Closed state' }
            ],
            itemTableData: [],
            category: 1,
            repairTypeList: [ // 工单类型
                { zh: '维修', en: 'Repair', value: 1, key: 1 },
                { zh: '开箱损', en: 'Unpacking Damage', value: 3, key: 3 },
            ],
            form: {
                vehicle_no: undefined,
                failure_type: 1,
                category: '',
                compensation_method: 1,
            },
            vehicleGroupList: [], // 车型
            isVehicle: false,
            uidList: [],
            itemTableDetail: {
                count: 0, //车架号数量
                filter_number: 2, //过滤掉的重复车架号数量
                executing_number: 1, //在执行中的工单数量
                special_number: 1, //特殊的车架号数量
            },
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
            selectAllItemModalShow: false,
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
            selectItemTableData: [],
            selectedRowKeys: [],
            selectedRowItems: [],
            selectedRowItemsAll: [],
            attachModalShow: false,
            currentAttachmentList: [],
            balance: 0,
            tipModalShow: false,
            executingFrameUid: '',
            id: 0,
            detail: {},
            unResponseList: [],
        };
    },
    watch: {},
    computed: {
        // 货币单位
        priceKey() {
            let priceKey = this.$auth('DISTRIBUTOR') ? 'fob_' : 'purchase_price_'
            console.log('priceKey:', priceKey)
            return priceKey
        },
        itemTableColumns() {
            let columns = [
                { title: this.$t('r.car_type'), dataIndex: 'model', key: 'item' }, // 车型
                { title: this.$t('search.vehicle_no'), dataIndex: 'frame_uid', key: 'frame_uid' }, // 车架号
                { title: this.$t('r.item_name'), dataIndex: 'item_name', key: 'detail' }, // 商品名称
                { title: this.$t('i.code'), dataIndex: 'item_code', key: 'item' }, // 商品编码
                { title: this.$t('i.commercial_specification'), dataIndex: 'item_spec', key: 'item' }, // 商品规格
                {
                    title: `<span style="color: red; margin-right: 2px;">*</span> ${this.$t('r.km_travelled')}`,
                    dataIndex: 'warranty_period_mileage',
                    key: 'input'
                },
                { title: this.$t('r.three_pack_aging'), dataIndex: 'warranty_status' }, // 三包时效
                { title: this.$t('def.operate'), key: 'operation' }
            ]
            return columns
        },
        itemVehicleTableColumns() {
            let columns = [
                { title: this.$t('r.item_name'), dataIndex: 'name', key: 'detail' }, // 商品名称
                { title: this.$t('i.code'), dataIndex: 'code', key: 'item' }, // 商品编码
                { title: this.$t('i.spec'), dataIndex: ['material', 'spec'], key: 'item' }, // 规格
                { title: this.$t('i.amount'), dataIndex: 'amount', key: 'amount' }, // 数量
                { title: this.$t('i.price'), dataIndex: 'fob_eur', key: 'price' }, // 价格
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
                { title: this.$t('i.commercial_specification'), dataIndex: ['material', 'spec'], key: 'item' }, // 商品规格
                { title: this.$t('i.amount'), dataIndex: 'amount', key: 'amount' }, // 数量
                { title: this.$t('i.price'), dataIndex: 'cost', key: 'price' }, // 价格
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
                    console.log('rowSelection this.selectedRowKeys:', this.selectedRowKeys, 'selectedRowItems:', this.selectedRowItems)
                },
            };
        },
    },
    mounted() {
        this.id = Number(this.$route.query.id) || 0
        if (this.id) {
            this.getRepairDetail();
        }
        this.currency = Core.Data.getCurrency();
        // 爆炸图适配
        if (window.screen.width <= 1280) {
            this.mediaWidth = '700px'
        }
        this.getBalanceDetail();
    },
    methods: {
        // 获取工单详情
        getRepairDetail() {
            this.loading = true;
            Core.Api.Repair.detail({
                id: this.id,
            }).then(res => {
                console.log('getRepairDetail res', res)
                this.detail = res
                this.itemTableData = this.detail?.vehicle_list
                const vehicle_group_list = this.detail.vehicle_frame_list.map((vehicle) => {
                    console.log('vehicle.item_list', vehicle.item_list);
                    return {
                        model: vehicle.item_list[0].model,
                        vehicle_list: vehicle.item_list.map((item) => {
                            this.getItemCategory(item.model);
                            return {
                                frame_uid: vehicle.frame_uid,
                                model: item.model,
                                repair_order_item_list: vehicle.item_list.map((item) => ({
                                    name: item.item_name,
                                    code: item.item_code,
                                    marterial: {
                                        spec: item.item_spec
                                    },
                                    fob_eur: item.price,
                                    question_desc: item.description,
                                    ...item,
                                })),
                                fault_types_list: [],
                                amount: 0,
                                totalPrice: vehicle.item_list.reduce((sum, item) => {
                                    return sum + item.price;
                                }, 0),
                                totalCharge: vehicle.item_list.reduce((sum, item) => {
                                    if (item.warranty_status === 3) {
                                        return sum + item.price;
                                    } else {
                                        return sum + item.charge;
                                    }
                                }, 0)
                            };
                        }),
                    };
                });
                if (vehicle_group_list.length) {
                    this.vehicleGroupList = vehicle_group_list
                    this.vehicleGroupList[0].category = this.detail.category
                    this.vehicleGroupList[0].vehicle_list = this.vehicleGroupList[0].vehicle_list.slice(0, 1)
                    console.log('this.vehicleGroupList', this.vehicleGroupList);
                }
                this.form.compensation_method = this.detail.compensation_method
            }).catch(err => {
                console.log('getRepairDetail err', err)
            }).finally(() => {
                this.loading = false;
            });
        },
        // 获取账户余额
        getBalanceDetail() {
            Core.Api.Repair.balance().then(res => {
                console.log('getBalanceDetail res', res);
            }).catch(err => {
                console.log('Error in getBalanceDetail', err);
            })
        },
        // 提交工单
        handleConfirm() {
            const paramsList = this.transformSaveParams();
            const isValid = this.checkParams(paramsList);
            if (!isValid) {
                return;
            }
            let _this = this;
            this.$confirm({
                title: _this.$t('pop_up.sure_audit'),
                okText: _this.$t('def.sure'),
                okType: 'primary',
                cancelText: this.$t('def.cancel'),
                onOk() {
                    console.log('handleConfirm ok');
                    const list = _this.transformSaveParams();
                    const params = list[0]
                    if (_this.id) {
                        Core.Api.Repair.update({
                            category: params.category,
                            compensation_method: params.compensation_method,
                            model: params.model,
                            vehicle_list: params.vehicle_list,
                            id: _this.id
                        }).then(res => {
                            console.log('handleConfirm res', res);
                            _this.routerChange('back')
                        }).catch(err => {
                            console.log('Error in handleConfirm', err);
                        })
                    } else {
                        Core.Api.Repair.create({
                            list
                        }).then(res => {
                            console.log('handleConfirm res', res);
                            _this.routerChange('back')
                        }).catch(err => {
                            console.log('Error in handleConfirm', err);
                        })
                    }
                },
            });
        },
        // 取消提交工单
        handleCancel() {
            this.routerChange('back')
        },
        // 重置工单
        handleResetVehicle() {
            this.$router.go(0);
        },
        // 转换提交工单的数据格式
        transformSaveParams() {
            const targetInfo = this.vehicleGroupList.map((item) => {
                const vehicle_list = item.vehicle_list.map((vehicle) => {
                    const targetFrameItem = this.itemTableData.find(frameItem => frameItem.frame_uid === vehicle.frame_uid)
                    const item_list = vehicle.repair_order_item_list.map((repairOrderItem) => {
                        return {
                            item_id: repairOrderItem.id,
                            item_category_id: repairOrderItem.item_category_id,
                            description: repairOrderItem.question_desc,
                            price: this.currency === 'eur' || this.currency === 'EUR' ? repairOrderItem.fob_eur : repairOrderItem.fob_usd,
                            charge: repairOrderItem.warranty_status === 2 ? (this.currency === 'eur' || this.currency === 'EUR' ? repairOrderItem.fob_eur : repairOrderItem.fob_usd) : 0,
                            attachment_list: repairOrderItem.attachment_list,
                            warranty_status: repairOrderItem.warranty_status
                        };
                    });
                    const fault_types_list = item.fault_types_list.map((faultType) => {
                        return {
                            id: faultType.id,
                            name: faultType.name,
                            nameEn: faultType.name_en,
                            parentId: faultType.parent_id
                        };
                    });
                    return {
                        mileage: targetFrameItem.mileage,
                        delivery_time: targetFrameItem.delivery_time,
                        warranty_status: targetFrameItem.warranty_status,
                        frame_uid: vehicle.frame_uid,
                        item_list,
                        fault_types_list
                    };
                });
                return {
                    category: item.category,
                    model: item.model,
                    vehicle_list,
                };
            });
            targetInfo.forEach(item => {
                item.compensation_method = this.form.compensation_method
            })
            console.log('targetInfo', targetInfo)
            return targetInfo
        },
        // 判断必填
        checkParams(list) {
            for (const val of list) {
                if (!val.category || !val.vehicle_list.length) {
                    this.$message.warning(this.$t(/*请完善必填信息*/'r.enter'));
                    return false;
                }
                const vehicleList = val.vehicle_list;
                for (const vehicle of vehicleList) {
                    if (!vehicle.item_list.length || vehicle.mileage === '' || vehicle.mileage === undefined) {
                        this.$message.warning(this.$t(/*请完善必填信息*/'r.enter'));
                        return false;
                    }
                    const itemList = vehicle.item_list;
                    for (const item of itemList) {
                        if (!item.attachment_list.length || !item.description) {
                            this.$message.warning(this.$t(/*请完善必填信息*/'r.enter'));
                            return false;
                        }
                    }
                }
            }
            return true
        },
        // 隐藏提示弹框
        handleTipModalShow() {
            this.tipModalShow = false
            this.isVehicle = false
        },
        // 监听故障类型多选勾选
        selectCheckChange(frame_uid) {
            this.currentFrameUid = frame_uid
            console.log('this.currentFrameUid', this.currentFrameUid);
        },
        // 监听故障选择多选按钮事件
        handleCheckboxChange(e, id, name, name_en) {
            if (e.checked === true) {
                this.handleSelectItemModal(id, name, name_en)
            }
        },
        // 查看更多附件弹框
        moreAttachModalShow(record) {
            this.currentRecord = record
            this.unResponseList = record.attachment_list
            this.currentAttachmentList = Core.Util.deepCopy(record.attachment_list)
            console.log('record.attachment_list', record.attachment_list);
            this.attachModalShow = true
        },
        // 删除附件
        handleDeleteFile(index) {
            this.currentAttachmentList.splice(index, 1);
        },
        // 查看更多附件弹框修改保存
        handleMoreAttachmentSubmit() {
            for (const item of this.vehicleGroupList) {
                for (const vehicle of item.vehicle_list) {
                    if (vehicle.frame_uid === this.currentFrameUid) {
                        for (const target of vehicle.repair_order_item_list) {
                            if (target === this.currentRecord) {
                                target.attachment_list = this.currentAttachmentList
                            }
                        }
                    }
                }
            }
            this.attachModalShow = false
        },
        // 展示具体故障类型选择商品弹框
        handleSelectItemModal(category_id, name, name_en) {
            this.selectItemModalShow = true
            this.getItemExploreList(category_id, name, name_en);
        },
        // 关闭具体故障类型选择商品弹框
        selectItemModalClose() {
            this.selectItemTableData = []
            this.tabsArray = [];
            this.selectedRowItems = []
            this.selectedRowKeys = []
        },
        // 取消具体故障类型选择商品弹框
        selectItemModalCancel() {
            this.selectItemModalShow = false
            for (const vehicle of this.vehicleGroupList) {
                for (const item of vehicle.vehicle_list) {
                    if (item.frame_uid === this.currentFrameUid) {
                        item.item_category_id = undefined
                    }
                }
            }
        },
        // 展示选择全部商品弹框
        handleSelectAllItemModal(frameUid) {
            this.currentFrameUid = frameUid
            this.selectAllItemModalShow = true
        },
        // 添加商品
        handleSelectItem(ids, items) {
            console.log('handleSelectItem ids, items:', ids, items)
            this.selectItems = items
            this.selectItemIds = ids
            const list = this.selectItems
            const idArray = list.map(item => item.id);
            const findItem = this.itemTableData.find(item => item.frame_uid === this.currentFrameUid)
            this.getCategoryItemList(idArray, findItem.warranty_period_mileage, findItem.delivery_time)
            this.closeAddItemModal();
        },
        // 关闭添加商品弹框
        closeAddItemModal() {
            this.selectAllItemModalShow = false
        },
        // 提交选择商品
        handleSelectItemSubmit() {
            this.selectItemModalShow = false
            for (const item of this.vehicleGroupList) {
                for (const vehicle of item.vehicle_list) {
                    if (vehicle.frame_uid === this.currentFrameUid) {
                        let _selectedRowItems = Core.Util.deepCopy(this.selectedRowItems)
                        // 由于故障类型只能选择单一故障 所以每次切换其他故障类型进行添加时把已添加商品清空重新添加
                        vehicle.repair_order_item_list = []
                        _selectedRowItems.forEach(target => {
                            target.key_id = vehicle.frame_uid + target.id
                            const targetFrameItem = this.itemTableData.find(frameItem => frameItem.frame_uid === vehicle.frame_uid)
                            target.delivery_time = targetFrameItem.delivery_time
                            target.begin_time = targetFrameItem.delivery_time + (targetFrameItem.effect_time_day * 24 * 60 * 60);
                            target.end_time = target.begin_time + (target.warranty_period_month * 30 * 24 * 60 * 60);
                            const currentTime = Math.floor(Date.now() / 1000);
                            if (currentTime > target.end_time) {
                                target.warranty_status = 2; // 保外
                            } else {
                                target.warranty_status = 1; // 保内
                            }
                            vehicle.repair_order_item_list.push(target)
                        });
                        console.log('this.vehicleGroupList', this.vehicleGroupList);
                        // 计算 实付金额 的总和
                        const totalCharge = vehicle.repair_order_item_list.reduce((sum, item) => {
                            if (item.warranty_status === 3) {
                                return sum + item.price;
                            } else {
                                return sum + item.charge;
                            }
                        }, 0);
                        // // 计算 金额 的总和
                        const totalPrice = vehicle.repair_order_item_list.reduce((sum, item) => {
                            return sum + item.price;
                        }, 0);
                        vehicle.totalPrice = totalPrice;
                        vehicle.totalCharge = totalCharge;

                        break;
                    }
                }
            }
        },
        // 展示上传文件弹框
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
                console.log('yxy', this.vehicleGroupList);
            }
            this.uploadModalShow = false;
            this.finishUploadData = []
        },
        // 关闭上传文件弹框
        handleUploadModalClose() {
            this.uploadModalShow = false
            this.finishUploadData = []
            this.upload.fileList = []
        },
        // // 上传文件弹框关闭回调
        uploadModalClose() {
            this.upload.fileList = []
            this.submitDisabled = false;
            this.finishUploadData = []
        },
        // 页面跳转
        routerChange(type, item = {}) {
            let routeUrl
            switch (type) {
                case 'back':
                    this.$router.go(-1)
                    break;
                case 'itemDetail':  // 商品详情
                    routeUrl = this.$router.resolve({
                        path: "/mall/vehicle-list/detail",
                        query: {
                            id: item.id
                        }
                    })
                    window.open(routeUrl.href, '_blank')
                    break;
                case 'itemIdDetail':  // 车辆详情
                    routeUrl = this.$router.resolve({
                        path: "/mall/vehicle-list/detail",
                        query: {
                            id: item.item_id
                        }
                    })
                    window.open(routeUrl.href, '_blank')
                    break;
            }
        },
        // 删除车架
        handleDeleteUidTable(frame_uid) {
            let _this = this;
            this.$confirm({
                title: _this.$t('pop_up.sure_delete'),
                okText: _this.$t('def.sure'),
                okType: 'danger',
                cancelText: this.$t('def.cancel'),
                onOk() {
                    console.log('handleDeleteUidTable ok');
                    const index = _this.itemTableData.findIndex(item => item.frame_uid === frame_uid);
                    if (index !== -1) {
                        _this.itemTableData.splice(index, 1);
                        _this.$message.success(_this.$t(/*删除成功*/'pop_up.delete_success'));
                    }
                    let newArr = []
                    _this.itemTableData.forEach(item => {
                        newArr.push(item.frame_uid)
                    })
                    _this.handleVehicleList(newArr)
                },
            });
        },
        // 删除商品
        handleDeleteItem(id, target) {
            let _this = this;
            this.$confirm({
                title: _this.$t('pop_up.sure_delete'),
                okText: _this.$t('def.sure'),
                okType: 'danger',
                cancelText: this.$t('def.cancel'),
                onOk() {
                    console.log('handleDeleteItem ok');
                    const indexToRemove = target.repair_order_item_list.findIndex(item => item.id === id);
                    // 如果找到匹配的索引，则删除该项
                    if (indexToRemove !== -1) {
                        target.repair_order_item_list.splice(indexToRemove, 1);
                    }
                    if (!target.repair_order_item_list.length) {
                        target.item_category_id = undefined
                    }
                },
            });
        },
        // 车架号输入框 根据车架号获取信息
        handleSubmitVehicle() {
            this.uidList = this.form.vehicle_no.trim().split('\n').map(str => str.trim());;
            let duplicates = this.uidList.length - new Set(this.uidList).size;
            this.form.vehicle_no = undefined
            console.log('uidList', this.uidList);
            if (duplicates) {
                this.$message.warning(`${this.$t('r.filtered')}${duplicates}${this.$t('in.total')}${this.$t('r.duplicate_frame')}`)
            }
            this.handleVehicleList(this.uidList);
        },
        // 根据车架号查询信息接口
        handleVehicleList(params) {
            Core.Api.Repair.saveVehicleList({
                frame_uid_list: params
            }).then(res => {
                console.log('handleSubmitVehicle res', res);
                if (res.executing_frame_uid_list.length) {
                    this.executingFrameUid = res.executing_frame_uid_list.join('，')
                    this.tipModalShow = true
                    this.isVehicle = false
                } else {
                    this.isVehicle = true
                    this.itemTableData = res.vehicle_info_list
                    this.itemTableDetail.count = res.vehicle_info_list.length
                    this.itemTableDetail.filter_number = res.duplicate_frame_uid_list.length
                    this.itemTableDetail.executing_number = res.executing_frame_uid_list.length
                    this.itemTableDetail.special_number = res.special_frame_uid_list.length
                    this.vehicleGroupList = this.transformGroupData(res.vehicle_group_list)
                    this.itemTableData.forEach(item => {
                        item.mileage = 0
                        // 获取当前时间的时间戳
                        const currentTime = Math.floor(Date.now() / 1000);
                        // 计算保质期开始时间
                        item.begin_time = item.delivery_time + (item.effect_time_day * 24 * 60 * 60);
                        // 计算保质期结束时间
                        item.end_time = item.begin_time + (item.warranty_period_month * 30 * 24 * 60 * 60);
                        // 判断保修状态
                        if (currentTime > item.end_time) {
                            item.warranty_status = 2; // 保外
                        } else {
                            item.warranty_status = 1; // 保内
                        }
                    })
                    console.log('this.vehicleGroupList', this.vehicleGroupList);
                }
            })
        },
        // 对分组车型数据的转换处理方法
        transformGroupData(data) {
            const transformedData = data.map(group => {
                this.getItemCategory(group.model);
                return {
                    model: group.model,
                    category: 1,
                    vehicle_list: group.frame_uid_list.map(frameUid => {
                        return {
                            frame_uid: frameUid,
                            repair_order_item_list: [],
                            fault_types_list: [],
                            amount: 0,
                            totalPrice: 0,
                            totalCharge: 0
                        };
                    })
                };
            });
            return transformedData
        },
        // 获取故障类型
        getItemCategory(model) {
            Core.Api.Repair.getItemCategory({
                model: model,
                type: 2
            }).then(res => {
                console.log('getItemCategory res', res);
                const group = this.vehicleGroupList.find(item => item.model === model);
                if (group) {
                    group.fault_types_list = res;
                }
            }).catch(err => {
                console.log('Error in getItemCategory', err);
            })
        },
        // 获取具有指定类别的商品列表
        getCategoryItemList(idArray, mileage, deliveryTime, category_id = '', name = '', name_en = '') {
            Core.Api.Repair.getItemStatus({
                item_id_list: idArray,
                mileage: mileage,
                delivery_time: deliveryTime
            }).then(res => {
                console.log('getCategoryItemList res', res);
                if (category_id) {
                    this.selectItemTableData = this.updateItemsWithCategory(
                        this.selectItemTableData,
                        res,
                        category_id,
                        name,
                        name_en
                    );
                } else {
                    const updatedItems = this.selectItems.map(result => {
                        return this.updateItemWithMatchingItem(result, res, category_id, name, name_en);
                    });
                    this.addItemsToRepairOrder(updatedItems);
                }
            }).catch(err => {
                console.log('Error in getCategoryItemList', err);
            });
        },
        // 更新具有指定类别的商品列表项
        updateItemsWithCategory(items, matchingItems, category_id, name, name_en) {
            return items.map(item => {
                const matchingItem = matchingItems.find(target => target.target_id === item.id);
                if (matchingItem) {
                    return {
                        ...item,
                        warranty_status: matchingItem.warranty_status,
                        warranty_period_month: matchingItem.warranty_period_month,
                        warranty_period_mileage: matchingItem.warranty_period_mileage,
                        charge: matchingItem.warranty_status === 1 || matchingItem.warranty_status === 3 ? 0 : (this.currency === 'eur' || this.currency === 'EUR' ? item.fob_eur : item.fob_usd),
                        price: this.currency === 'eur' || this.currency === 'EUR' ? item.fob_eur : item.fob_usd,
                        item_category_id: category_id,
                        attachment_list: [],
                        question_desc: undefined,
                        category_name: name,
                        category_name_en: name_en
                    };
                }
                return item;
            });
        },
        // 使用匹配的商品更新单个商品项(手动添加商品的情况)
        updateItemWithMatchingItem(item, matchingItems, category_id, name, name_en) {
            const matchingItem = matchingItems.find(target => target.target_id === item.id);
            if (matchingItem) {
                return {
                    ...item,
                    warranty_status: matchingItem.warranty_status,
                    charge: matchingItem.warranty_status === 1 || matchingItem.warranty_status === 3 ? 0 : (this.currency === 'eur' || this.currency === 'EUR' ? item.fob_eur : item.fob_usd),
                    price: this.currency === 'eur' || this.currency === 'EUR' ? item.fob_eur : item.fob_usd,
                    item_category_id: category_id,
                    attachment_list: [],
                    question_desc: undefined,
                    category_name: name,
                    category_name_en: name_en
                };
            }
            return item;
        },
        // 弹框选中项添加到对应表格中
        addItemsToRepairOrder(items) {
            for (const item of items) {
                for (const vehicleGroup of this.vehicleGroupList) {
                    for (const vehicle of vehicleGroup.vehicle_list) {
                        if (vehicle.frame_uid === this.currentFrameUid) {
                            item.key_id = vehicle.frame_uid + item.id
                            item.delivery_time = vehicle.delivery_time
                            console.log('items', items);
                            vehicle.repair_order_item_list.push(item);
                            // 计算 实付金额 的总和
                            const totalCharge = vehicle.repair_order_item_list.reduce((sum, item) => {
                                if (item.warranty_status === 3) {
                                    return sum + item.price;
                                } else {
                                    return sum + item.charge;
                                }
                            }, 0);
                            // // 计算 金额 的总和
                            const totalPrice = vehicle.repair_order_item_list.reduce((sum, item) => {
                                return sum + item.price;
                            }, 0);
                            vehicle.totalPrice = totalPrice;
                            vehicle.totalCharge = totalCharge;
                            break;
                        }
                    }
                }
            }
        },
        // 行驶公里数输入框失焦
        handleMileageBlur(record) {
            if (record.mileage > record.warranty_period_mileage) {
                record.warranty_status = 2
            } else {
                // 获取当前时间的时间戳
                const currentTime = Math.floor(Date.now() / 1000);
                // 计算保质期开始时间
                record.begin_time = record.delivery_time + (record.effect_time_day * 24 * 60 * 60);
                // 计算保质期结束时间
                record.end_time = record.begin_time + (record.warranty_period_month * 30 * 24 * 60 * 60);
                // 判断保修状态
                if (currentTime > record.end_time) {
                    record.warranty_status = 2; // 保外
                } else {
                    record.warranty_status = 1; // 保内
                }
            }
        },
        /*======== 爆炸图 ========*/
        /* 获取 商品爆炸图 */
        getItemExploreList(category_id, name, name_en) {
            const ths = this;
            this.pointerList = [];
            this.tabsArray = [];
            Core.Api.Item.getItemComponent({
                target_type: Core.Const.ITEM_COMPONENT_SET.TARGET_TYPE.ITEM_CATEGORY, // 代表零配件
                target_id: category_id,
            }).then((res) => {
                const inceptionArray = get(res, "list.list", []);
                if (inceptionArray.length) {
                    this.tabsArray = [inceptionArray[0]]
                }
                this.parsePoint();
                ths.$nextTick(() => {
                    ths.tabsArray.forEach((item, index) => {
                        ths.loadImage(item.img, index);
                    })
                })
                if (res.list.list.length) {
                    const list = res.list.list[0].item_component_list.map(item => item.item)
                    const idArray = list.map(item => item.id);
                    const findItem = this.itemTableData.find(item => item.frame_uid === this.currentFrameUid)
                    this.selectItemTableData = list
                    this.getCategoryItemList(idArray, findItem.warranty_period_mileage, findItem.delivery_time, category_id, name, name_en)
                }
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
        /* 加载图片，获取宽高 */
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
        /* 刷新canvas画布 */
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
        /* 显示点位详情 */
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
        /* 增加指示点 */
        addPoint(id) {
            console.log(id)
            this.pointIndex = id
        },
        /*======== 爆炸图 ========*/
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

            .ant-radio-wrapper {
                width: 25%;
                height: 22px;
                margin-left: 0;
                margin-bottom: 18px;
                flex: 0 0 14%;
            }

            // .ant-radio-group .ant-radio-wrapper {
            // }
        }

        .value {
            width: 400px;
            height: 32px;

            .grey-tip {
                margin-top: 6px;
                display: flex;
                align-items: center;
                font-size: 12px;
                font-weight: 400;
                color: #FF7D00;

                >img {
                    width: 16px;
                    height: 16px;
                    margin-right: 4px;
                }
            }

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
        margin-bottom: 60px;
        box-sizing: border-box;

        .item-table-container {
            margin-top: 24px;
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
                    margin-top: 70px;
                }

                .item-table-tip {
                    color: #86909C;
                    font-size: 12px;
                    margin-left: 10px;
                    margin-top: 72px;
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
                    margin-top: 20px;
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

            &.w1080 {
                width: 1080px;
            }

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

    .attachment-file-upload-modal {
        .file-list {
            display: flex;
            width: 100%;
            align-items: center;
            justify-content: space-between;

            .file-key {
                display: flex;
                align-items: center;
            }
        }
    }

}
</style>