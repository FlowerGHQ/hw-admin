<template>
    <div id="InvoiceDetail" class="list-container">
        <div class="title-container">
            <div class="title-area">{{ type_ch }}{{ $t('in.detail') }}</div>
            <template v-if="authOrg(detail.org_id, detail.org_type)">
                <div class="btn-area">
                    <template v-if="detail.status === STATUS.INIT">
                        <div class="btns-area">
                            <a-upload
                                name="file"
                                class="file-uploader"
                                :file-list="upload.fileList"
                                :action="upload.action"
                                :show-upload-list="false"
                                :headers="upload.headers"
                                :data="upload.data"
                                accept=".xlsx,.xls"
                                @change="handleFileUpload"
                            >
                                <a-button type="primary" ghost class="panel-btn">
                                    <i class="icon i_add" /> {{ $t('i.import') }}
                                </a-button>
                            </a-upload>
                        </div>
                        <a-button type="primary" @click="handleSubmit()"
                            ><i class="icon i_confirm" />{{ $t('def.submit') }}</a-button
                        >
                        <a-button type="danger" ghost @click="handleCancel()">
                            <i class="icon i_close_c" />{{ $t('def.cancel') }}</a-button
                        >
                    </template>

                    <div
                        class="btns-area"
                        v-if="
                            (detail.status === STATUS.AUDIT_PASS && detail.type === TYPE.IN) ||
                            (detail.type === TYPE.OUT && detail.status === STATUS.AUDIT_PASS))
                        "
                    >
                        <a-upload
                            name="file"
                            class="file-uploader"
                            :file-list="uploadPDA.fileList"
                            :action="uploadPDA.action"
                            :show-upload-list="false"
                            :headers="uploadPDA.headers"
                            :data="uploadPDA.data"
                            accept=".xlsx,.xls"
                            @change="handleFileUpload"
                        >
                            <a-button type="primary" ghost class="panel-btn">
                                <i class="icon i_add" /> {{ $t('i.import_storage') }}
                            </a-button>
                        </a-upload>
                    </div>

                    <template
                        v-if="
                            (detail.status === STATUS.CLOSE || detail.status === STATUS.DELIVERY) &&
                            detail.type === TYPE.IN &&
                            detail.target_type === 30 &&
                            $auth('ADMIN')
                        "
                    >
                        <a-button type="primary" @click="handleExportIn"
                            ><i class="icon i_download" />{{ $t('in.export') }}</a-button
                        >
                    </template>

                    <AuditHandle
                        v-if="
                            detail.status === STATUS.FINANCE_PASS ||
                            (detail.status === STATUS.WAIT_AUDIT && detail.type === TYPE.IN)
                        "
                        btnType="primary"
                        :ghost="false"
                        :api-list="['Invoice', 'audit']"
                        :id="id"
                        :sPass="STATUS.AUDIT_PASS"
                        :sRefuse="STATUS.AUDIT_REFUSE"
                        :sBack="STATUS.AUDIT_BACK"
                        @submit="getInvoiceDetail"
                        ><i class="icon i_audit" />{{ $t('in.warehouse_audit') }}</AuditHandle
                    >
                    <a-button
                        type="primary"
                        @click="handleComplete()"
                        v-if="detail.status === STATUS.AUDIT_PASS && detail.type === TYPE.IN"
                        ><i class="icon i_confirm" />{{ type_ch }}{{ $t('in.finish') }}</a-button
                    >
                    <template v-if="detail.type === TYPE.OUT">
                        <AuditHandle
                            v-if="detail.status === STATUS.WAIT_AUDIT"
                            btnType="primary"
                            :ghost="false"
                            :api-list="['Invoice', 'audit']"
                            :id="id"
                            :sPass="STATUS.FINANCE_PASS"
                            :sRefuse="STATUS.AUDIT_REFUSE"
                            @submit="getInvoiceDetail"
                            ><i class="icon i_audit" />{{ $t('in.finance_audit') }}</AuditHandle
                        >
                        <a-button type="primary" @click="handleComplete()" v-if="detail.status === STATUS.AUDIT_PASS"
                            ><i class="icon i_confirm" />{{ type_ch }}{{ $t('in.finish') }}</a-button
                        >
                        <a-button
                            type="primary"
                            @click="handleExportOut"
                            v-if="
                                (detail.status === STATUS.CLOSE || detail.status === STATUS.DELIVERY) &&
                                detail.target_type === 30 &&
                                $auth('ADMIN')
                            "
                            ><i class="icon i_download" />{{ $t('in.export') }}</a-button
                        >

                        <a-button
                            type="primary"
                            @click="handleExportDetail"
                            v-if="
                                (detail.status === STATUS.CLOSE ||
                                    detail.status === STATUS.DELIVERY ||
                                    detail.status === STATUS.RECEIVED) &&
                                $auth('ADMIN')
                            "
                            ><i class="icon i_download" />{{ $t('in.export_invoice') }}</a-button
                        >
                    </template>
                </div>
            </template>
        </div>
        <div class="gray-panel info">
            <div class="panel-title">
                <div class="left">
                    <span>{{ type_ch }}{{ $t('in.number') }}:</span> {{ detail.uid }}
                    <div v-show="detail.uid">                        
                        <img id="jsbarcodeImg" style="width: 200px" />
                    </div>
                </div>

                <div class="right">
                    <div class="status">
                        <i class="icon i_point" :class="$Util.invoiceStatusFilter(detail.status, 'color')" />
                        {{ $Util.invoiceStatusFilter(detail.status, $i18n.locale) }}
                    </div>
                </div>
            </div>
            <div class="panel-content">
                <div class="info-item">
                    <div class="key">{{ $t('in.related') }}</div>
                    <div class="value">
                        <a-button type="link" @click="routerChange('warehouse')">{{ warehouse.name || '-' }}</a-button>
                    </div>
                </div>
                <div class="info-item">
                    <div class="key">{{ $t('n.type') }}</div>
                    <div class="value">{{ $Util.warehouseTypeFilter(warehouse.type, $i18n.locale) || '-' }}</div>
                </div>
                <div class="info-item">
                    <div class="key">{{ $t('in.category') }}</div>
                    <div class="value">{{ $Util.targetTypeFilter(detail.target_type, $i18n.locale) || '-' }}</div>
                </div>
                <div class="info-item">
                    <div class="key">{{ $t('n.source') }}</div>
                    <!--                admin端设置了不翻译来源-->
                    <div class="value" v-if="$auth('ADMIN')">
                        {{ $Util.sourceTypeAdminFilter(detail.source_type, $i18n.locale) || '-' }}
                    </div>
                    <div class="value" v-if="!$auth('ADMIN')">
                        {{ $Util.sourceTypeFilter(detail.source_type, $i18n.locale) || '-' }}
                    </div>
                </div>
                <div class="info-item" v-if="detail.source_type !== SOURCE_TYPE.ADMIN">
                    <div class="key">{{ $t('n.source_number') }}</div>
                    <div class="value">
                        <a-button type="link" v-if="detail.source_uid" @click="routerChange('source')">{{
                            detail.source_uid
                        }}</a-button>
                    </div>
                </div>
                <div class="info-item">
                    <div class="key">{{ $t('n.operator') }}</div>
                    <div class="value">
                        <template v-if="detail.apply_user && detail.apply_user.account">{{
                            detail.apply_user.account.name
                        }}</template>
                        <template v-else>-</template>
                    </div>
                </div>
                <div class="info-item">
                    <div class="key">{{ $t('d.create_time') }}</div>
                    <div class="value">{{ $Util.timeFilter(detail.create_time) || '-' }}</div>
                </div>
                <div class="info-item">
                    <div class="key">{{ $t('in.reviewer') }}</div>
                    <div class="value">
                        <template v-if="detail.audit_user && detail.apply_user.account">{{
                            detail.audit_user.account.name
                        }}</template>
                        <template v-else>-</template>
                    </div>
                </div>
                <div class="info-item">
                    <div class="key">{{ $t('in.time') }}</div>
                    <div class="value">{{ $Util.timeFilter(detail.audit_time) || '-' }}</div>
                </div>
                <div class="info-item" v-if="detail.type === TYPE.OUT">
                    <div class="key">{{ $t('in.finance_audit_time') }}</div>
                    <div class="value">{{ $Util.timeFilter(detail.finance_audit_time) || '-' }}</div>
                </div>
            </div>
        </div>
        <a-collapse v-model:activeKey="activeKey" ghost>
            <!-- 无实例 -->
            <a-collapse-panel
                key="ItemList"
                :header="$t('i.product_information')"
                class="gray-collapse-panel"
                collapsible="disabled"
            >
                <template #extra>
                    <template v-if="detail.status === STATUS.INIT && !addMode && $auth('invoice.save')">
                        <ItemSelect
                            btnType="link"
                            :btnText="$t('i.add')"
                            :purchaseId="detail.type == TYPE.IN ? detail.source_id : 0"
                            :sourceType="detail.type == TYPE.IN ? detail.source_type : 0"
                            :warehouseId="0"
                            :disabledChecked="disabledChecked"
                            @select="handleAddItemChange"
                        />
                        <!--                    <a-popover v-model:visible="production.addVisible" trigger="click" placement="left" v-else-if="production.maxCount"-->
                        <!--                        @visibleChange='(visible) => {!visible && handleProdAddCancel()}' title="{{ $t('in.input_add_amount') }}">-->
                        <!--                        <template #content>-->
                        <!--                            <div class="prod-edit-popover">-->
                        <!--                                <a-input-number v-model:value="production.addCount" placeholder="{{ $t('in.add_amount') }}"-->
                        <!--                                    @keydown.enter="handleProdAddChange(index)" :autofocus="true" :max="production.maxCount" :min='1' :precision="0"/>-->
                        <!--                                <div class="btns">-->
                        <!--                                    <a-button type="primary" @click="handleProdAddCancel()" ghost >{{ $t('def.cancel') }}</a-button>-->
                        <!--                                    <a-button type="primary" @click="handleProdAddChange()" >{{ $t('def.sure') }}</a-button>-->
                        <!--                                </div>-->
                        <!--                            </div>-->
                        <!--                        </template>-->
                        <!--                        <a-button type="link" class="extra-btn" @click.stop>{{ $t('in.add_item') }}</a-button>-->
                        <!--                    </a-popover>-->
                    </template>
                    <a-button type="link" class="extra-btn" v-if="addMode" @click.stop="handleAddSubmit('item')">{{
                        $t('in.add')
                    }}</a-button>
                </template>
                <div class="panel-content">
                    <div class="search-container">
                        <a-row class="search-area">
                            <a-col :xs="24" :sm="24" :xl="8" :xxl="6" class="search-item">
                                <div class="key">{{ $t('i.type') }}:</div>
                                <div class="value">
                                    <a-select v-model:value="searchForm.target_type" :placeholder="$t('def.select')">
                                        <a-select-option
                                            v-for="(val, key) in TARGET_TYPE_MAP"
                                            :key="key"
                                            :value="key"
                                            >{{ val[$i18n.locale] }}</a-select-option
                                        >
                                    </a-select>
                                </div>
                            </a-col>
                            <a-col :xs="24" :sm="24" :xl="8" :xxl="6" class="search-item">
                                <div class="key">{{ $t('i.code') }}:</div>
                                <div class="value">
                                    <a-input
                                        :placeholder="$t('def.input')"
                                        v-model:value="searchForm.code"
                                        :disabled="this.searchForm.target_type === ''"
                                        @keydown.enter="getInvoiceList"
                                    />
                                </div>
                            </a-col>
                        </a-row>
                        <div class="btn-area">
                            <a-button @click="getInvoiceList" type="primary">{{ $t('def.search') }}</a-button>
                            <a-button @click="handleSearchReset">{{ $t('def.reset') }}</a-button>
                        </div>
                    </div>
                    <div class="table-container">
                        <a-table
                            :columns="itemTableColumns"
                            :data-source="addMode ? addData : tableData"
                            :scroll="{ x: true }"
                            :row-key="record => record.id"
                            :pagination="false"
                        >
                            <template #bodyCell="{ column, text, record }">
                                <template v-if="column.key === 'tip_item'">
                                    <a-tooltip placement="top" :title="text">
                                        <div class="ell" style="max-width: 160px">
                                            <a-button type="link" @click="routerChange('item', record)">{{
                                                text || '-'
                                            }}</a-button>
                                        </div>
                                    </a-tooltip>
                                </template>
                                <!--                            <template v-if="column.key === 'attr_list'">-->
                                <!--                                <a-tooltip placement="top" :title='$Util.itemSpecFilter(text)'>-->
                                <!--                                    <div class="ell" style="max-width: 120px">-->
                                <!--                                        {{ $Util.itemSpecFilter(text) }}-->
                                <!--                                    </div>-->
                                <!--                                </a-tooltip>-->
                                <!--                            </template>-->
                                <!--                            <template v-if="column.key === 'item'">-->
                                <!--                                {{ text || '-' }}-->
                                <!--                                {{ record.target_type || '-' }}-->
                                <!--                            </template>-->

                                <template v-if="column.key === 'target_type'">
                                    {{ $Util.targetTypeFilter(record.target_type, $i18n.locale) }}
                                </template>
                                <template v-if="record.target_type === COMMODITY_TYPE.MATERIALS">
                                    <template v-if="column.key === 'name'">
                                        <div class="ell" style="max-width: 160px">
                                            <a-button type="link" @click="routerChange('material', record)">{{
                                                $i18n.locale == 'zh'
                                                    ? record.material.name || '-'
                                                    : record.material.name_en || '-'
                                            }}</a-button>
                                        </div>
                                    </template>
                                    <template v-if="column.key === 'code'">
                                        {{ record.material.code || '-' }}
                                    </template>
                                    <template v-if="column.key === 'spec'">
                                        {{ record.material.spec || '-' }}
                                    </template>
                                    <template v-if="column.key === 'count'">
                                        {{ record.material.stock ? record.material.stock + $t('in.item') : '-' }}
                                    </template>
                                    <template v-if="column.key === 'amount'">
                                        <template v-if="addMode || record.editMode">
                                            <a-input-number
                                                v-model:value="record.amount"
                                                :placeholder="$t('def.input')"
                                                :min="1"
                                                :max="
                                                    detail.type === TYPE.IN
                                                        ? 99999
                                                        : record.material != undefined
                                                          ? record.material.stock
                                                          : 0
                                                "
                                                :precision="0"
                                            />
                                            {{ $t('in.item') }}
                                        </template>
                                        <template v-else>{{ text ? text + $t('in.item') : '-' }}</template>
                                    </template>
                                </template>
                                <template v-if="record.target_type === COMMODITY_TYPE.ITEM">
                                    <template v-if="column.key === 'name'">
                                        <div class="ell" style="max-width: 160px">
                                            <a-button type="link" @click="routerChange('item', record)">{{
                                                $i18n.locale == 'zh'
                                                    ? record.item.name || '-'
                                                    : record.item.name_en || '-'
                                            }}</a-button>
                                        </div>
                                    </template>
                                    <template v-if="column.key === 'code'">
                                        {{ record.item.code || '-' }}
                                    </template>
                                    <template v-if="column.key === 'spec'">
                                        <a-tooltip placement="top" :title="$Util.itemSpecFilter(text, $i18n.locale)">
                                            <div class="ell" style="max-width: 120px">
                                                {{ $Util.itemSpecFilter(text, $i18n.locale) }}
                                            </div>
                                        </a-tooltip>
                                    </template>
                                    <template v-if="column.key === 'count'">
                                        {{ record.item.stock ? record.item.stock + $t('in.item') : '-' }}
                                    </template>
                                    <template v-if="column.key === 'amount'">
                                        <template v-if="addMode || record.editMode">
                                            <a-input-number
                                                v-model:value="record.amount"
                                                :placeholder="$t('def.input')"
                                                :min="1"
                                                :max="
                                                    detail.type === TYPE.IN
                                                        ? 99999
                                                        : record.item != undefined
                                                          ? record.item.stock
                                                          : 0
                                                "
                                                :precision="0"
                                            />
                                            {{ $t('in.item') }}
                                        </template>
                                        <template v-else>{{ text ? text + $t('in.item') : '-' }}</template>
                                    </template>
                                </template>

                                <template v-if="column.key === 'flag_entity'">
                                    {{ $Util.itemFlagEntityFilter(text, $i18n.locale) }}
                                </template>

                                <template v-if="column.key === 'count'">
                                    {{ text ? text + $t('in.item') : '-' }}
                                </template>
                                <template v-if="column.key === 'child_size'">
                                    <a-button
                                        type="link"
                                        @click="handleRowUidInfoShow(record)"
                                        v-if="
                                            record.flag_entity === Core.Const.ITEM.FLAG_ENTITY.YES &&
                                            (detail.status === STATUS.CLOSE ||
                                                detail.status === STATUS.DELIVERY ||
                                                detail.status === STATUS.AUDIT_REFUSE ||
                                                detail.status === STATUS.CANCEL)
                                        "
                                    >
                                        {{ text }} / {{ record.amount }}
                                    </a-button>
                                    <a-button
                                        type="link"
                                        @click="handleRowUidShow(record)"
                                        v-if="
                                            record.flag_entity === Core.Const.ITEM.FLAG_ENTITY.YES &&
                                            detail.status !== STATUS.CLOSE &&
                                            detail.status !== STATUS.DELIVERY &&
                                            detail.status !== STATUS.AUDIT_REFUSE &&
                                            detail.status !== STATUS.CANCEL
                                        "
                                        >{{ text }} / {{ record.amount }}
                                    </a-button>
                                </template>
                                <template v-if="column.key === 'confirm_amount'">
                                    {{ text ? text + $t('in.item') : '-' }}
                                </template>

                                <template v-if="column.key === 'operation'">
                                    <a-button
                                        type="link"
                                        @click="handleRowUidShow(record)"
                                        v-if="record.flag_entity === Core.Const.ITEM.FLAG_ENTITY.YES"
                                        ><i class="icon i_edit" />{{ $t('in.enter_instance_number') }}</a-button
                                    >
                                </template>
                                <template v-if="column.key === 'operation' && $auth('invoice.save')">
                                    <a-button type="link" @click="handleRowChange(record)" v-if="!record.editMode"
                                        ><i class="icon i_edit" />{{ $t('in.change') }}</a-button
                                    >
                                    <a-button type="link" @click="handleRowSubmit(record, record.target_type)" v-else
                                        ><i class="icon i_confirm" />{{ $t('in.changes') }}</a-button
                                    >
                                    <a-button type="link" @click="handleRemoveRow(record)" class="danger"
                                        ><i class="icon i_delete" />{{ $t('def.remove') }}</a-button
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
            </a-collapse-panel>
            <!-- 物料 -->
            <!--        <a-collapse-panel key="ItemList" header="物料信息" class="gray-collapse-panel" collapsible="disabled" v-if="detail.target_type === COMMODITY_TYPE.MATERIALS">-->
            <!--            <template #extra v-if="$auth('invoice.save')">-->
            <!--                <MaterialSelect btnType='link' btnText="添加物料" v-if="detail.status === STATUS.INIT && !addMode" :sourceId="detail.type == TYPE.IN ? detail.source_id : 0"-->
            <!--                                :sourceType="detail.type == TYPE.IN ? detail.source_type : 0" :warehouseId="detail.type == TYPE.OUT ? detail.warehouse_id : 0" :disabledChecked="disabledChecked"-->
            <!--                                @select="handleAddChange"/>-->
            <!--                <a-button type="link" class="extra-btn" v-if="addMode" @click.stop="handleAddSubmit('material')">{{ $t('in.add') }}</a-button>-->
            <!--            </template>-->
            <!--            <div class="panel-content">-->
            <!--                <div class="table-container no-mg">-->
            <!--                    <a-table :columns="materialTableColumns" :data-source="addMode ? addData : tableData" :scroll="{ x: true }"-->
            <!--                             :row-key="record => record.id" :pagination='false'>-->
            <!--                        <template #bodyCell="{ column, text, record }">-->
            <!--                            <template v-if="column.dataIndex === 'supplier'">-->
            <!--                                <template v-if="addMode">-->
            <!--                                    <a-select v-model:value="record.supplier_id" placeholder="请选择供应商" style="width: 120px;">-->
            <!--                                        <a-select-option v-for="item of record.supplier_list" :key="item.id" :value="item.id">{{ item.name }}</a-select-option>-->
            <!--                                    </a-select>-->
            <!--                                </template>-->
            <!--                                <template v-else>-->
            <!--                                    <a-tooltip placement="top" :title='text'>-->
            <!--                                        <a-button type="link" @click="routerChange('supplier', record )">{{ record.supplier_name }}</a-button>-->
            <!--                                    </a-tooltip>-->
            <!--                                </template>-->
            <!--                            </template>-->
            <!--                            <template v-if="column.key === 'tip_item'">-->
            <!--                                <a-tooltip placement="top" :title='text'>-->
            <!--                                    <div class="ell" style="max-width: 120px">-->
            <!--                                        <a-button type="link" @click="routerChange('material', record )">{{ text || '-' }}</a-button>-->
            <!--                                    </div>-->
            <!--                                </a-tooltip>-->
            <!--                            </template>-->
            <!--                            <template v-if="column.key === 'item'">-->
            <!--                                {{ text || '-' }}-->
            <!--                            </template>-->
            <!--                            <template v-if="column.key === 'spec'">-->
            <!--                                <a-tooltip placement="top" :title='text'>-->
            <!--                                    <div class="ell" style="max-width: 120px">-->
            <!--                                        {{text || '-'}}-->
            <!--                                    </div>-->
            <!--                                </a-tooltip>-->
            <!--                            </template>-->
            <!--                            <template v-if="column.key === 'price'">-->
            <!--                                <template v-if="addMode">-->
            <!--                                    ￥ {{ $Util.countFilter(record.supplier_map[record.supplier_id]) || '0'}}-->
            <!--                                </template>-->
            <!--                                <template v-else>￥{{ $Util.countFilter(text) || '0'}}</template>-->
            <!--                            </template>-->
            <!--                            <template v-if="column.key === 'total_price'">-->
            <!--                                <template v-if="addMode">-->
            <!--                                    ￥{{ $Util.countFilter(record.supplier_map[record.supplier_id] * record.amount) }}-->
            <!--                                </template>-->
            <!--                                <template v-else>￥{{ $Util.countFilter(record.price * record.amount) }}</template>-->
            <!--                            </template>-->
            <!--                            <template v-if="column.key === 'count'">-->
            <!--                                {{ text ? text + '件' : '-' }}-->
            <!--                            </template>-->
            <!--                            <template v-if="column.key === 'amount'">-->
            <!--                                <template v-if="addMode || record.editMode">-->
            <!--                                    <a-input-number v-model:value="record.amount" placeholder="请输入"-->
            <!--                                                    :min="1" :max="detail.type === TYPE.IN ? 99999: record.material.stock" :precision="0"/> 件-->
            <!--                                </template>-->
            <!--                                <template v-else>{{ text ? text + '件' : '-' }}</template>-->
            <!--                            </template>-->

            <!--                            <template v-if="column.key === 'operation' && $auth('invoice.save')" >-->
            <!--                                <a-button type="link" @click="handleRowChange(record)" v-if="!record.editMode"><i class="icon i_edit"/>更改数量</a-button>-->
            <!--                                <a-button type="link" @click="handleRowSubmit(record, 'material')" v-else><i class="icon i_confirm"/>确认更改</a-button>-->
            <!--                                <a-button type="link" @click="handleRemoveRow(record)" class="danger"><i class="icon i_delete"/>{{ $t('def.remove') }}</a-button>-->
            <!--                            </template>-->
            <!--                        </template>-->

            <!--                    </a-table>-->
            <!--                </div>-->
            <!--                <div class="paging-container" v-if="!addMode">-->
            <!--                    <a-pagination-->
            <!--                        v-model:current="currPage"-->
            <!--                        :page-size='pageSize'-->
            <!--                        :total="total"-->
            <!--                        show-quick-jumper-->
            <!--                        show-size-changer-->
            <!--                        show-less-items-->
            <!--                        :show-total="total => $t('n.all_total') + ` ${total} ` + $t('in.total')"-->
            <!--                        :hide-on-single-page='false'-->
            <!--                        :pageSizeOptions="['10', '20', '30', '40']"-->
            <!--                        @change="pageChange"-->
            <!--                        @showSizeChange="pageSizeChange"-->
            <!--                    />-->
            <!--                </div>-->
            <!--            </div>-->
            <!--        </a-collapse-panel>-->
        </a-collapse>
        <a-modal
            v-model:visible="childShow"
            :title="$t('in.enter_instance_number')"
            class="attachment-file-upload-modal"
        >
            <div class="form-title">
                <div class="form-item" v-if="authOrg(detail.org_id, detail.org_type)">
                    <div class="key">{{ $t('v.number') }}</div>
                    <div class="value">
                        <a-input
                            v-model:value="form.target_uid"
                            style="width: 200px"
                            :placeholder="$t('def.input')"
                            @blur="handleVehicleBlur()"
                        />
                        <!--                        <template v-if="!$auth('ADMIN')">-->
                        <span v-if="form.target_id"><i class="icon suffix i_confirm" /></span>
                        <span v-else-if="entity_no_exist"><i class="icon suffix i_close_c" /></span>
                        <!--                        </template>-->
                    </div>
                    <div class="key">
                        <a-button @click="addInvoiceItemChild">{{ $t('in.addition') }}</a-button>
                    </div>
                </div>
                <a-table
                    :columns="childColumns"
                    :data-source="childDate"
                    :scroll="{ x: true }"
                    :row-key="record => record.id"
                    :pagination="false"
                >
                    <template #bodyCell="{ column, text, record }">
                        <template v-if="column.key === 'item'">
                            {{ text || '-' }}
                        </template>
                        <template
                            v-if="
                                column.key === 'operation' &&
                                $auth('invoice.save') &&
                                authOrg(detail.org_id, detail.org_type)
                            "
                        >
                            <a-button type="link" @click="handleRemoveRow(record)" class="danger"
                                ><i class="icon i_delete" />{{ $t('def.remove') }}</a-button
                            >
                        </template>
                    </template>
                </a-table>
                <div class="paging-container">
                    <a-pagination
                        v-model:current="childCurrPage"
                        :page-size="childPageSize"
                        :total="childTotal"
                        show-quick-jumper
                        show-size-changer
                        show-less-items
                        :show-total="total => $t('n.all_total') + ` ${total} ` + $t('in.total')"
                        :hide-on-single-page="false"
                        :pageSizeOptions="['10', '20', '30', '40']"
                        @change="childPageChange"
                        @showSizeChange="childPageSizeChange"
                    />
                </div>
            </div>
            <template #footer>
                <a-button @click="childShow = false">{{ $t('def.cancel') }}</a-button>
                <!--            <a-button @click="handleModalSubmit" type="primary">{{ $t('def.sure') }}</a-button>-->
            </template>
        </a-modal>
        <a-modal
            v-model:visible="childInfoShow"
            :title="$t('in.enter_instance_number')"
            class="attachment-file-upload-modal"
        >
            <div class="form-title">
                <a-table
                    :columns="childColumns"
                    :data-source="childDate"
                    :scroll="{ x: true }"
                    :row-key="record => record.id"
                    :pagination="false"
                >
                    <template #bodyCell="{ column, text, record }">
                        <template v-if="column.key === 'item'">
                            {{ text || '-' }}
                        </template>
                    </template>
                </a-table>
                <div class="paging-container">
                    <a-pagination
                        v-model:current="childCurrPage"
                        :page-size="childPageSize"
                        :total="childTotal"
                        show-quick-jumper
                        show-size-changer
                        show-less-items
                        :show-total="total => $t('n.all_total') + ` ${total} ` + $t('in.total')"
                        :hide-on-single-page="false"
                        :pageSizeOptions="['10', '20', '30', '40']"
                        @change="childPageChange"
                        @showSizeChange="childPageSizeChange"
                    />
                </div>
            </div>
            <template #footer>
                <a-button @click="childInfoShow = false">{{ $t('def.cancel') }}</a-button>
                <!--            <a-button @click="handleModalSubmit" type="primary">{{ $t('def.sure') }}</a-button>-->
            </template>
        </a-modal>
    </div>
</template>

<script>
import Core from '../../core';
import ItemSelect from '../../components/popup-btn/ItemSelect.vue';
import EntitySelect from '../../components/popup-btn/EntitySelect.vue';
import MaterialSelect from '../../components/popup-btn/MaterialSelect.vue';
import AuditHandle from '../../components/popup-btn/AuditHandle.vue';
import JsBarcode from 'jsbarcode';
import data from '../../core/data';

const STOCK_RECORD = Core.Const.STOCK_RECORD;
const TARGET_TYPE_MAP = Core.Const.INVOICE_ITEM.TARGET_TYPE_MAP;
const TYPE = STOCK_RECORD.TYPE;
const STATUS = STOCK_RECORD.STATUS;
const SOURCE_TYPE = STOCK_RECORD.SOURCE_TYPE;
const COMMODITY_TYPE = STOCK_RECORD.COMMODITY_TYPE;

export default {
    name: 'InvoiceDetail',
    components: {
        ItemSelect,
        EntitySelect,
        MaterialSelect,
        AuditHandle,
        JsBarcode,
    },
    props: {},
    data() {
        return {
            Core,
            COMMODITY_TYPE,
            SOURCE_TYPE,
            STATUS,
            TARGET_TYPE_MAP,
            TYPE,
            // 加载
            loading: false,
            // 分页
            currPage: 1,
            pageSize: 20,
            total: 0,

            id: '',
            detail: {},
            warehouse: {},
            activeKey: ['ItemList'],
            supplierName: [],
            tableData: [],
            addMode: false,
            addData: [],
            supplier_id: undefined,
            loginType: Core.Data.getLoginType(),
            loginOrgId: Core.Data.getOrgId(),
            loginOrgType: Core.Data.getOrgType(),
            production: {
                addVisible: false,
                addCount: '',
                maxCount: '',
                addItem: {},
            },
            searchForm: {
                code: '',
                target_type: '',
            },
            exportDisabled: false,

            form: {
                target_id: 0,
                target_uid: '',
                parent_id: 0,
            },
            entity_no_exist: 0,

            // 分页
            childCurrPage: 1,
            childPageSize: 20,
            childTotal: 0,

            childShow: false,
            childDate: [],

            // 上传
            childInfoShow: false,
            // 上传
            upload: {
                action: Core.Const.NET.URL_POINT + '/admin/1/invoice-item/import',
                fileList: [],
                headers: {
                    ContentType: false,
                },
                data: {
                    token: Core.Data.getToken(),
                    type: 'xlsx',
                    invoice_id: '',
                },
            },
            // 上传
            uploadPDA: {
                action: Core.Const.NET.URL_POINT + '/admin/1/stock-record/import',
                fileList: [],
                headers: {
                    ContentType: false,
                },
                data: {
                    token: Core.Data.getToken(),
                    type: 'xlsx',
                    invoice_id: '',
                },
            },
        };
    },
    watch: {},
    computed: {
        type_ch() {
            return this.detail.type == TYPE.IN ? this.$t('in.inbound') : this.$t('in.outbound');
        },
        disabledChecked() {
            let list = [];
            console.log('disabledChecked.list', list);
            this.tableData.forEach(item => {
                if (item.item && item.item.id) {
                    list.push(item.item.id);
                } else if (item.material && item.material.id) {
                    list.push(item.material.id);
                }
            });
            console.log('tableData.list', this.tableData);
            return list;
        },
        childColumns() {
            let columns = [
                { title: this.$t('n.name'), dataIndex: ['item', 'name'] },
                { title: this.$t('uid'), dataIndex: ['entity', 'uid'], key: 'uid' },
                { title: this.$t('def.operate'), key: 'operation', fixed: 'right', width: 100 },
            ];
            return columns;
        },
        itemTableColumns() {
            // 无实例商品的 出入库
            let columns = [
                { title: this.$t('n.name'), dataIndex: 'name', key: 'name' },

                // {title: this.$t('i.number'), dataIndex: ['item', 'model'], key: 'item'},
                { title: this.$t('i.code'), dataIndex: 'code', key: 'code' },
                { title: this.$t('i.type'), dataIndex: 'target_type', key: 'target_type' },
                { title: this.$t('i.spec'), dataIndex: 'spec', key: 'spec' },
                { title: this.$t('in.has_number'), dataIndex: 'flag_entity', key: 'flag_entity' },
                { title: this.$t('in.instance_number_amount'), dataIndex: 'child_size', key: 'child_size' },
                {
                    title: this.$t('in.realistic') + this.type_ch + this.$t('i.amount'),
                    dataIndex: 'confirm_amount',
                    key: 'confirm_amount',
                },
                { title: this.type_ch + this.$t('i.amount'), dataIndex: 'amount', key: 'amount' },
                { title: this.$t('def.operate'), key: 'operation' },
            ];
            if (this.detail.status !== STATUS.INIT || this.addMode) {
                columns.pop();
            }
            if (this.detail.type == TYPE.OUT) {
                columns.splice(2, 0, { title: this.$t('wa.quantity'), dataIndex: 'stock', key: 'stock' });
            }
            return columns;
        },
        materialTableColumns() {
            //物料 出入库
            let columns = [
                { title: '供应商', dataIndex: 'supplier' },
                { title: '物料名称', dataIndex: ['material', 'name'], key: 'tip_item' },
                { title: '物料分类', dataIndex: ['material', 'category', 'name'], key: 'item' },
                { title: '物料编码', dataIndex: ['material', 'code'], key: 'item' },
                { title: '物料规格', dataIndex: ['material', 'spec'], key: 'spec' },
                { title: '单位', dataIndex: ['material', 'unit'], key: 'item' },
                { title: '单价', dataIndex: 'price', key: 'price' },
                { title: this.type_ch + '数量', dataIndex: 'amount', key: 'amount' },
                { title: '总价', key: 'total_price' },
                { title: '操作', key: 'operation' },
            ];
            if (this.detail.status !== STATUS.INIT || this.addMode) {
                columns.pop();
            }
            if (this.detail.type == TYPE.OUT) {
                columns.splice(2, 0, { title: '库存数量', dataIndex: ['material', 'stock'], key: 'count' });
            }
            return columns;
        },
        isProd() {
            let d = this.detail;
            if (d.source_type == SOURCE_TYPE.PRODUCTION && d.type == TYPE.IN) {
                return true;
            }
            return false;
        },
        childColumns() {
            let columns = [
                { title: this.$t('n.name'), dataIndex: ['item', 'name'] },
                { title: this.$t('uid'), dataIndex: ['entity', 'uid'], key: 'uid' },
                { title: this.$t('def.operate'), key: 'operation', fixed: 'right', width: 100 },
            ];
            return columns;
        },
    },
    mounted() {
        this.id = Number(this.$route.query.id) || 0;
        this.upload.data.invoice_id = this.id;
        this.uploadPDA.data.invoice_id = this.id;

        this.getInvoiceDetail();
    },
    methods: {
        authOrg(orgId, orgType) {
            console.log('org', this.loginOrgId === orgId && this.loginOrgType === orgType);
            if (this.loginOrgId === orgId && this.loginOrgType === orgType) {
                return true;
            } else {
                return false;
            }
        },

        routerChange(type, item = {}) {
            let routeUrl = '';
            switch (type) {
                case 'list':
                    routeUrl = this.$router.resolve({
                        path: '/warehouse/invoice-list',
                    });
                    window.open(routeUrl.href, '_self');
                    break;
                case 'edit':
                    routeUrl = this.$router.resolve({
                        path: '/warehouse/invoice-edit',
                        query: { id: this.detail.id },
                    });
                    window.open(routeUrl.href, '_self');
                    break;
                case 'warehouse':
                    routeUrl = this.$router.resolve({
                        path: '/warehouse/warehouse-detail',
                        query: { id: this.detail.warehouse_id },
                    });
                    window.open(routeUrl.href, '_blank');
                    break;
                case 'item':
                    routeUrl = this.$router.resolve({
                        path: '/item/item-detail',
                        query: { id: item.item.id },
                    });
                    window.open(routeUrl.href, '_blank');
                    break;
                case 'supplier':
                    routeUrl = this.$router.resolve({
                        path: '/production/supplier-detail',
                        query: { id: item.supplier_id },
                    });
                    window.open(routeUrl.href, '_blank');
                    break;
                case 'material':
                    routeUrl = this.$router.resolve({
                        path: '/production/material-detail',
                        query: { id: item.target_id },
                    });
                    window.open(routeUrl.href, '_blank');
                    break;
                case 'source':
                    let path = '';
                    switch (this.detail.source_type) {
                        case SOURCE_TYPE.PRODUCTION:
                            path = '/production/manufacture-order-detail';
                            break;
                        case SOURCE_TYPE.PURCHASE:
                            path = '/purchase/purchase-order-detail';
                            break;
                        case SOURCE_TYPE.AFTER_SALES:
                            path = '/aftersales/aftersales-detail';
                            break;
                        case SOURCE_TYPE.TRANSFER:
                            path = '/warehouse/transfer-order-detail';
                            break;
                        case SOURCE_TYPE.REPAIR:
                            path = '/repair/repair-detail';
                            break;
                        case SOURCE_TYPE.MATERIAL_PURCHASE:
                            path = '/production/material-purchase-detail';
                            break;
                    }
                    routeUrl = this.$router.resolve({
                        path,
                        query: { id: this.detail.source_id },
                    });
                    window.open(routeUrl.href, '_blank');
                    break;
            }
        },
        handleRowUidShow(item) {
            this.childShow = true;
            this.form.parent_id = item.id;
            this.itemId = item.item.id;
            this.getInvoiceItemChildList();
        },
        handleRowUidInfoShow(item) {
            this.childInfoShow = true;
            this.form.parent_id = item.id;
            this.itemId = item.item.id;
            this.getInvoiceItemChildList();
        },
        handleRowUid(item) {
            this.childShow = true;
        },
        // 获取出入库单详情
        getInvoiceDetail() {
            this.loading = true;
            Core.Api.Invoice.detail({
                id: this.id,
            })
                .then(res => {
                    console.log('getInvoiceDetail res', res);
                    let d = res.detail || {};
                    this.detail = d;
                    this.warehouse = d.warehouse || {};
                    this.getInvoiceList();
                    this.generateJSBarcodeImg(this.detail.uid);
                })
                .catch(err => {
                    console.log('getInvoiceDetail err', err);
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        addInvoiceItemChild() {
            if (!this.form.target_id) {
                return this.$message.warning('请输入正确的实例号');
            }
            let form = Core.Util.deepCopy(this.form);
            Core.Api.InvoiceItem.saveChild({
                ...form,
            }).then(res => {
                console.log('getInvoiceList res', res);
                this.getInvoiceItemChildList();
                this.getInvoiceList();
            });
        },
        getInvoiceItemChildList() {
            this.loading = true;
            Core.Api.InvoiceItem.list({
                invoice_id: this.id,
                parent_id: this.form.parent_id,
                page: this.childCurrPage,
                page_size: this.childPageSize,
            })
                .then(res => {
                    console.log('getInvoiceList res', res);
                    let list = res.list;
                    if (this.detail.target_type === COMMODITY_TYPE.ENTITY) {
                        list.forEach(item => {
                            item.entity_id = item.target_id;
                            item.entity_uid = item.entity ? item.entity.uid : '';
                        });
                    }
                    this.childtotal = res.count;
                    this.childDate = list;
                    console.log('this.tableData', this.tableData);
                    if (this.isProd) {
                        this.getProductionItem();
                    }
                    // if (this.detail.target_type === 30) {
                    //     this.getSupplierName();
                    // }
                })
                .catch(err => {
                    console.log('getInvoiceList err', err);
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        // 获取出入库单商品列表
        getInvoiceList() {
            this.loading = true;
            Core.Api.InvoiceItem.list({
                code: this.searchForm.code,
                target_type: this.searchForm.target_type,
                invoice_id: this.id,
                page: this.currPage,
                page_size: this.pageSize,
            })
                .then(res => {
                    console.log('getInvoiceList res', res);
                    let list = res.list;
                    // if (this.detail.target_type === COMMODITY_TYPE.ENTITY) {
                    //     list.forEach(item => {
                    //         item.item = item.entity ? item.entity.item || {} : {}
                    //         item.entity_id = item.target_id
                    //         item.entity_uid = item.entity ? item.entity.uid : ''
                    //     })
                    // }
                    this.total = res.count;
                    this.tableData = list;
                    console.log('this.tableData', this.tableData);
                    if (this.isProd) {
                        this.getProductionItem();
                    }
                    // if (this.detail.target_type === 30) {
                    //     this.getSupplierName();
                    // }
                })
                .catch(err => {
                    console.log('getInvoiceList err', err);
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        // getSupplierName() {
        //     let data = [...this.tableData]
        //     for (const item of data) {
        //         let supplier_id
        //         if (item.supplier_id) {
        //             supplier_id = item.supplier_id
        //         }
        //         Core.Api.Supplier.detail({
        //             id: supplier_id
        //         }).then(res => {
        //             item.supplier_name = res.detail.name
        //             console.log('getSupplierName', res.detail.name)
        //         })
        //     }
        // },
        pageChange(curr) {
            // 页码改变
            this.currPage = curr;
            this.getInvoiceList();
        },
        pageSizeChange(current, size) {
            // 页码尺寸改变
            this.pageSize = size;
            this.getInvoiceList();
        },
        childPageChange(curr) {
            // 页码改变
            this.childCurrPage = curr;
            this.getInvoiceItemChildList();
        },
        childPageSizeChange(current, size) {
            // 页码尺寸改变
            this.childPageSize = size;
            this.getInvoiceItemChildList();
        },

        // 获取生产单对应商品
        getProductionItem() {
            Core.Api.ProductionOrder.detail({
                id: this.detail.source_id,
            }).then(res => {
                console.log('getProductionItem res:', res);
                let d = res.detail || {};
                this.production.addItem = d.item;
                let maxCount = d.amount - d.in_warehouse_count;
                if (this.detail.target_type == COMMODITY_TYPE.ENTITY) {
                    maxCount = maxCount - this.total;
                }
                this.production.addCount = maxCount;
                this.production.maxCount = maxCount;
                console.log('this.production:', this.production);
            });
        },

        // 取消 出入库单
        handleCancel() {
            let _this = this;
            this.$confirm({
                title: _this.$t('pop_up.sure_cancel'),
                okText: _this.$t('def.sure'),
                okType: 'danger',
                cancelText: this.$t('def.cancel'),
                onOk() {
                    Core.Api.Invoice.cancel({ id: _this.detail.id })
                        .then(() => {
                            _this.$message.success(_this.$t('pop_up.canceled'));
                            _this.routerChange('list');
                        })
                        .catch(err => {
                            console.log('handleCancel err', err);
                        });
                },
            });
        },
        // 提交出入库单
        handleSubmit() {
            if (!this.tableData.length) {
                return this.$message.warning(this.$t('def.enter'));
            }
            let _this = this;
            this.$confirm({
                title: _this.$t('pop_up.sure_audit'),
                okText: _this.$t('def.sure'),
                cancelText: this.$t('def.cancel'),
                onOk() {
                    Core.Api.Invoice.submit({ id: _this.detail.id })
                        .then(() => {
                            _this.$message.success(_this.$t('pop_up.operate'));
                            _this.getInvoiceDetail();
                        })
                        .catch(err => {
                            console.log('handleComplete err', err);
                        });
                },
            });
        },

        // 处理完成 出入库单
        handleComplete() {
            if (!this.tableData.length) {
                return this.$message.warning(this.$t('def.enter'));
            }
            let _this = this;
            let flag_entity = false;
            let flag_amount = false;
            this.tableData.forEach(it => {
                if (it.amount != it.confirm_amount) {
                    flag_amount = true;
                }
                if (it.flag_entity === Core.Const.ITEM.FLAG_ENTITY.YES && it.confirm_amount != it.child_size) {
                    flag_entity = true;
                }
            });
            let title = this.$t('pop_up.sure_audit');
            if (flag_amount) {
                title = this.$t('i.actual_quantity_shortage') + ',' + title;
            }
            if (flag_entity) {
                title = this.$t('i.the_frame_number_is_inconsistent_with_the_actual_quantity') + ',' + title;
            }

            this.$confirm({
                title: title,
                okText: _this.$t('def.sure'),
                cancelText: this.$t('def.cancel'),
                onOk() {
                    Core.Api.Invoice.handle({ id: _this.detail.id })
                        .then(() => {
                            _this.$message.success(_this.$t('pop_up.operate'));
                            _this.getInvoiceDetail();
                        })
                        .catch(err => {
                            console.log('handleComplete err', err);
                        });
                },
            });
        },

        // {{ $t('def.remove') }} 商品
        handleRemoveRow(record) {
            Core.Api.InvoiceItem.delete({ id: record.id }).then(() => {
                this.$message.success(this.$t('pop_up.remove_a'));
                this.getInvoiceItemChildList();
                this.getInvoiceDetail();
            });
        },
        // 批量添加 商品
        handleAddChange(ids, items) {
            console.log('handleAddChange items:', items);
            let list = items.map(item => {
                let supplier_list = item.supplier_list.map(i => ({
                    id: i.id,
                    name: i.name,
                    price: i.price,
                }));
                return {
                    id: item.id,
                    item: item,
                    material: item.material !== undefined ? item.material : item,
                    target_type:
                        item.type === Core.Const.ITEM.TYPE.COMPONENT ? COMMODITY_TYPE.MATERIALS : COMMODITY_TYPE.ITEM,
                    amount: 1,
                    entity_uid: '',
                    category: item.category,
                    supplier_list,
                    supplier_id: supplier_list && supplier_list.length ? supplier_list[0].id : undefined,
                };
            });
            console.log('list', list);
            this.addData = list;
            this.addMode = true;
            for (let item of list) {
                item.supplier_map = {};
                for (let supplier of item.supplier_list) {
                    item.supplier_map[supplier.id] = supplier.price;
                    console.log('getMaterialList', supplier.price);
                }
            }
        },
        handleAddItemChange(ids, items) {
            console.log('handleAddChange items:', items);
            let list = items.map(item => ({
                id: 0,
                item: item,
                material: item.material !== undefined ? item.material : item,
                target_type:
                    item.type === Core.Const.ITEM.TYPE.COMPONENT ? COMMODITY_TYPE.MATERIALS : COMMODITY_TYPE.ITEM,
                amount: 1,
                flag_entity: item.flag_entity,
                entity_uid: '',
            }));
            this.addData = list;
            this.addMode = true;
        },
        async handleAddSubmit(type) {
            this.loading = true;
            let data = [...this.tableData, ...this.addData];
            console.log('data', data);
            let list = [];
            for (const item of data) {
                let target_id, target_uid, supplier_id, price, flag_entity, target_type;
                target_type = item.target_type;
                switch (item.target_type) {
                    case COMMODITY_TYPE.ITEM:
                        if (item.item && item.item.id) {
                            target_id = item.item.id;
                            flag_entity = item.item.flag_entity;
                        } else {
                            return this.$message.warning(this.$t('in.warn_a'));
                        }
                        break;
                    case COMMODITY_TYPE.MATERIALS:
                        console.log('item.material', item.material);
                        console.log('item.material', item.material);
                        console.log('item.material.id:', item.material.id);
                        console.log('item.supplier_id:', item.supplier_id);
                        console.log('item.price:', item.price);
                        console.log('item.material && item.material.id:', item.material && item.material.id);
                        if (item.material && item.material.id) {
                            target_id = item.material.id;
                            supplier_id = item.supplier_id;
                            console.log('item.supplier_map', item.supplier_map);
                            console.log('supplier_id', supplier_id);
                            // console.log('item.material.supplier_map', item.supplier_map[supplier_id])
                            if (item.supplier_id && item.supplier_map) {
                                price = item.supplier_map[supplier_id];
                            } else {
                                price = item.price;
                            }
                        } else {
                            return this.$message.warning(this.$t('in.material_not_exist'));
                        }
                        break;
                }
                list.push({
                    id: item.id,
                    amount: item.amount,
                    invoice_id: this.id,
                    target_id,
                    flag_entity,
                    target_uid,
                    target_type,
                    supplier_id,
                    price,
                });
            }
            console.log('handleAddSubmit list:', list);
            Core.Api.InvoiceItem.saveList(list)
                .then(() => {
                    this.$message.success(this.$t('pop_up.save_success'));
                    this.getInvoiceDetail();
                    this.addMode = false;
                })
                .catch(err => {
                    console.log('handleAddSubmit err', err);
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        // 编辑单个 无实例商品
        handleRowChange(item) {
            console.log('handleRowChange', item);
            item.editMode = true;
        },
        handleRowSubmit(item, target_type) {
            let target_id = '';
            let supplier_id = '';
            let price = '';
            switch (target_type) {
                case this.COMMODITY_TYPE.ITEM:
                    target_id = item.item.id;
                    break;
                case this.COMMODITY_TYPE.MATERIALS: {
                    target_id = item.material.id;
                    supplier_id = item.supplier_id;
                    price = item.price;
                    break;
                }
            }
            let target = {
                id: item.id,
                target_type,
                amount: item.amount,
                target_id,
                supplier_id,
                invoice_id: this.id,
                price,
            };
            if (!target.target_id) {
                return this.$message.warning(
                    `${type === 'item' ? this.$t('i.item') : this.$t('i.item_instance')}` + this.$t('in.no'),
                );
            }
            console.log('amount', item.amount);

            if (item.amount < item.child_size) {
                return this.$message.warning(this.$t('in.instance_gt_total'));
            }

            Core.Api.InvoiceItem.save(target).then(() => {
                this.$message.success(this.$t('pop_up.save_success'));
                this.getInvoiceDetail();
            });
        },

        handleVehicleBlur() {
            // 获取 车架号ID
            // HW1000T-1B00B30001
            if (!this.form.target_uid) {
                return;
            }
            Core.Api.Entity.detailByUid({
                item_id: this.itemId,
                uid: this.form.target_uid,
            })
                .then(res => {
                    console.log('handleVehicleBlur res:', res);
                    if (Core.Util.isEmptyObj(res.detail)) {
                        if (!this.$auth('ADMIN')) {
                            this.$message.warning(this.$t('in.warn'));
                        }
                        this.form.target_id = 0;
                        this.entity_no_exist = 1;
                    } else {
                        this.form.target_id = res.detail.id;
                        this.entity_no_exist = 0;
                    }
                })
                .catch(err => {
                    console.log('handleVehicleBlur err', err);
                })
                .finally(() => {});
        },

        handleCopyEntity(index, record) {
            this.addData.splice(index, 0, {
                id: 0,
                item: record.item,
                amount: 1,
                entity_uid: '',
            });
        },

        handleAddEntityChange(ids, items) {
            console.log('handleAddEntityChange items:', items);
            let list = items.map(item => {
                console.log('item:', item);
                return {
                    id: 0,
                    amount: 1,
                    invoice_id: this.id,
                    target_id: item.id,
                    target_uid: item.uid,
                };
            });
            Core.Api.InvoiceItem.saveList(list)
                .then(() => {
                    this.$message.success(this.$t('pop_up.save_success'));
                    this.getInvoiceDetail();
                    this.addMode = false;
                })
                .catch(err => {
                    console.log('handleAddSubmit err', err);
                })
                .finally(() => {
                    this.loading = false;
                });
        },

        handleProdAddChange() {
            let list;
            if (this.detail.target_type == COMMODITY_TYPE.ENTITY) {
                list = new Array(this.production.addCount).fill({});
                list = list.map(item => ({
                    id: 0,
                    item: this.production.addItem,
                    amount: 1,
                    entity_uid: '',
                }));
            } else if (this.detail.target_type == COMMODITY_TYPE.ITEM) {
                list = [
                    {
                        id: 0,
                        item: this.production.addItem,
                        amount: this.production.addCount,
                    },
                ];
            }
            this.production.addVisible = false;
            this.addData = list;
            this.addMode = true;
        },
        handleProdAddCancel() {
            this.production.addVisible = false;
            // this.getProductionItem()
        },
        handleExportOut() {
            // 确认入库单是否导出
            let _this = this;
            this.$confirm({
                title: _this.$t('in.sure_export'),
                okText: _this.$t('def.sure'),
                cancelText: _this.$t('def.cancel'),
                onOk() {
                    _this.handleInvoiceExportOut();
                },
            });
        },
        handleExportDetail() {
            // 确认入库单是否导出
            let _this = this;
            this.$confirm({
                title: _this.$t('in.sure_export'),
                okText: _this.$t('def.sure'),
                cancelText: _this.$t('def.cancel'),
                onOk() {
                    _this.handleInvoiceDetailExport();
                },
            });
        },
        handleInvoiceDetailExport() {
            // 订单导出
            this.exportDisabled = true;
            let exportUrl = Core.Api.Export.invoiceDetailExport({
                invoice_id: this.id,
                language: this.$i18n.locale === 'en' ? 1 : 0,
            });
            console.log('handleRepairExport _exportUrl', exportUrl);
            window.open(exportUrl, '_blank');
            this.exportDisabled = false;
        },
        handleInvoiceExportOut() {
            // 订单导出
            this.exportDisabled = true;
            let exportUrl = Core.Api.Export.invoiceOutExport({
                invoice_id: this.id,
                language: this.$i18n.locale === 'en' ? 1 : 0,
            });
            console.log('handleRepairExport _exportUrl', exportUrl);
            window.open(exportUrl, '_blank');
            this.exportDisabled = false;
        },
        handleExportIn() {
            // 确认库单是否导出
            let _this = this;
            this.$confirm({
                title: _this.$t('in.sure_export'),
                okText: _this.$t('def.sure'),
                cancelText: _this.$t('def.cancel'),
                onOk() {
                    _this.handleInvoiceExportIn();
                },
            });
        },
        handleInvoiceExportIn() {
            // 订单导出
            this.exportDisabled = true;
            let exportUrl = Core.Api.Export.invoiceInExport({
                invoice_id: this.id,
                language: this.$i18n.locale === 'en' ? 1 : 0,
            });
            console.log('handleRepairExport _exportUrl', exportUrl);
            window.open(exportUrl, '_blank');
            this.exportDisabled = false;
        },
        // 上传文件
        handleFileUpload({ file, fileList }) {
            console.log('handleFileUpload status:', file.status, 'file:', file);
            if (file.status == 'done') {
                let res = file.response;
                if (res && res.code === 0) {
                    return this.$message.success(this.$t('pop_up.uploaded'));
                } else {
                    return this.$message.error('上传失败:' + res.message);
                }
            }
            this.upload.fileList = fileList;
            this.getInvoiceDetail();
        },
        //循环生成条形码
        generateJSBarcodeImg(uid) {
            // 根据动态id，动态赋值，动态生成条形码
            JsBarcode('#jsbarcodeImg', uid, {
                format: 'CODE39',
                width: 2,
                height: 80,
                displayValue: false,
            });
        },
        handleSearchReset() {
            // 重置搜索
            Object.assign(this.searchForm, this.$options.data().searchForm);
            this.pageChange(1);
        },
    },
};
</script>

<style lang="less">
#InvoiceDetail {
    .extra-btn {
        height: 14px;
        line-height: 14px;
    }
    .gray-panel.info {
        .right {
            .fcc();
            font-size: 12px;

            .status {
                .fcc();

                .i_point {
                    margin-right: 6px;
                }
            }
        }
    }
    .ant-table-cell {
        input.ant-input.input-number {
            width: 100% - 50px;
        }
    }
    .panel-content {
    }
    .btns-area {
        .file-uploader {
            margin-right: 15px;
        }
    }
}
.prod-edit-popover {
    margin: 0 -4px;
    display: flex;
    .flex(flex-start,flex-end);
    .ant-input,
    .ant-input-number {
        width: 155px;
        margin-bottom: 8px;
    }
    .btns {
        margin-top: 16px;
        .fcc();
        .ant-btn {
            width: 48px;
            height: 25px;
            font-size: 12px;
            border-radius: 2px;
            padding: 0;
            line-height: 25px;
        }
    }
}
</style>
