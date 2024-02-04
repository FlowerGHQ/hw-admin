<template>
    <div id="ItemEdit" class="edit-container" ref="bigBox">
        <a-spin :spinning="loading" class="loading-incontent" v-if="loading"></a-spin>
        <div class="title-container">
            <div class="title-area">
                {{ form.id ? $t("i.edit") : $t("i.save") }}
            </div>
        </div>
        <ItemHeader :detail="detail" v-if="indep_flag" :show-spec="true" />
        <!-- 规格 -->
        <div class="form-block">
            <div class="form-title">
                <div class="title">{{ $t("i.mode") }}</div>
            </div>
            <div class="form-content">
                <div class="form-item">
                    <div class="key">{{ $t("i.mode") }}</div>
                    <div class="value">
                        <a-radio-group v-model:value="specific.mode" @change="handleSpecificModeChange">
                            <a-radio :value="1">{{ $t("i.single") }}</a-radio>
                            <a-radio :value="2">{{ $t("i.multiple") }}</a-radio>
                        </a-radio-group>
                    </div>
                </div>
            </div>
        </div>
        <div class="form-block">
            <!-- 基本信息 -->
            <div class="form-title">
                <div class="title">{{ $t("n.information") }}</div>
            </div>
            <div class="form-content">
                <!-- 名称  v-if="this.specific.mode === 1"-->
                <div class="form-item required">
                    <div class="key" :class="form.name === '' && isValidate ? 'error' : ''">
                        {{ $t("n.name") }}
                    </div>
                    <div class="value">
                        <a-input v-model:value="form.name" @change="handleTableNameChange('zh')" :placeholder="$t('def.input')" :maxlength="50" />
                    </div>
                </div>
                <!-- 英文名 v-if="this.specific.mode === 1" -->
                <div class="form-item required">
                    <div class="key" :class="form.name_en === '' && isValidate ? 'error' : ''">
                        {{ $t("n.name_en") }}
                    </div>
                    <div class="value">
                        <a-input v-model:value="form.name_en" @change="handleTableNameChange('en')" :placeholder="$t('def.input')" :maxlength="50" />
                    </div>
                </div>
                <!-- 类型 -->
                <div class="form-item required" v-if="!indep_flag">
                    <div class="key" :class="form.type === '' && isValidate ? 'error' : ''">
                        {{ $t("n.type") }}
                    </div>
                    <div class="value">
                        <a-radio-group v-model:value="form.type">
                            <a-radio class="type-item" v-for="item of itemTypeMap" :key="item.key" :value="item.key">{{
                                item[$i18n.locale]
                            }}</a-radio>
                        </a-radio-group>
                    </div>
                </div>
                <!-- 实例编码 -->
                <div class="form-item required" v-if="!indep_flag && false">
                    <div class="key">
                        {{ $t("n.flag_entity") }}
                        <a-tooltip :title="$t('item-edit.flag_entity_keyword')">
                            <i class="icon i_hint" style="font-size: 12px"></i>
                        </a-tooltip>
                    </div>
                    <div class="value">
                        <a-radio-group v-model:value="form.flag_entity">
                            <a-radio
                                class="type-item"
                                v-for="item of flagEntityMap"
                                :key="item.key"
                                :value="item.key"
                                >{{ item[$i18n.locale] }}</a-radio
                            >
                        </a-radio-group>
                    </div>
                </div>
                <!-- 商品品号 -->
                <div class="form-item required" v-if="!indep_flag && false">
                    <div class="key" :class="form.model === '' && isValidate ? 'error' : ''">
                        {{ $t("i.number") }}
                        <a-tooltip :title="$t('item-edit.item_number_keyword')">
                            <i class="icon i_hint" style="font-size: 12px"></i>
                        </a-tooltip>
                    </div>
                    <div class="value">
                        <a-input v-model:value="form.model" :placeholder="$t('def.input')" />
                    </div>
                </div>
                <!-- 商品编码 改为  SKU编码 v-if="specific.mode === 1 || indep_flag"-->
                <div class="form-item required">
                    <div class="key" :class="form.code === '' && isValidate ? 'error' : ''">
                        {{ specific.mode === 1 ? $t("i.sku_code") : $t("i.code") }}
                    </div>
                    <!-- :disabled="$route.query?.edit" -->
                    <div class="value">
                        <a-input v-model:value="form.code" :placeholder="$t('def.input')" />
                    </div>
                </div>
                <!-- 商品分类 -->
                <div class="form-item required">
                    <div class="key" :class="form.category_ids.length === 0 && isValidate ? 'error' : ''">
                        {{ $t("i.categories") }}
                    </div>
                    <div class="value">
                        <CategoryTreeSelectMultiple
                            @change="handleCategorySelect"
                            :category="item_category"
                            :category-id="form.category_ids"
                            v-if="form.id !== ''" />
                    </div>
                </div>
                <!-- 销售区域 -->
                <div class="form-item required">
                    <div class="key" :class="form.sales_area_ids.length === 0 && isValidate ? 'error' : ''">
                        {{ $t("d.sales_area") }}
                    </div>
                    <div class="value">
                        <a-select
                            v-model:value="form.sales_area_ids"
                            mode="multiple"
                            :placeholder="$t('def.select')"
                            optionFilterProp="label">
                            <a-select-option
                                v-for="(val, key) in salesList"
                                :key="key"
                                :value="val.id"
                                :label="$i18n.locale === 'zh' ? val.name : val.name_en"
                                >{{ $i18n.locale === "zh" ? val.name : val.name_en }}</a-select-option
                            >
                        </a-select>
                    </div>
                </div>
                <template v-if="form.type === Core.Const.ITEM.TYPE.PRODUCT">
                    <!-- 图面代号 -->
                    <div class="form-item required" v-if="false">
                        <div class="key" :class="form.drawing_code === '' && isValidate ? 'error' : ''">
                            {{ $t("d.drawing_code") }}
                            <a-tooltip :title="$t('item-edit.drawing_code_keyword')">
                                <i class="icon i_hint" style="font-size: 12px"></i>
                            </a-tooltip>
                        </div>
                        <div class="value">
                            <a-input v-model:value="form.drawing_code" :placeholder="$t('def.input')" />
                        </div>
                    </div>
                    <!-- 颜色 -->
                    <div class="form-item">
                        <div class="key">{{ $t("d.color") }}</div>
                        <div class="value">
                            <a-input v-model:value="form.color" :placeholder="$t('def.input')" />
                        </div>
                    </div>
                    <!-- 颜色英文 -->
                    <div class="form-item">
                        <div class="key">{{ $t("d.color_en") }}</div>
                        <div class="value">
                            <a-input v-model:value="form.color_en" :placeholder="$t('def.input')" />
                        </div>
                    </div>
                    <!-- 商品重量与外观尺寸 -->
                    <div class="form-item not-aligin-item">
                        <div class="key not-white-space appearance-font">{{ $t("d.appearance") }}</div>
                        <div class="value">
                            <a-row gutter="16">
                                <!-- 净重 -->
                                <a-col :xs="24" :sm="12" :xl="12" :xxl="12">
                                    <a-input v-model:value="form.net_weight" :placeholder="$t('def.input')">
                                        <template #addonBefore>
                                            <span class="l-w-h-style">{{ $t("d.net_weight") }}</span>
                                        </template>
                                        <template #addonAfter>
                                            <span class="l-w-h-style-unit">KG</span>
                                        </template>
                                    </a-input>
                                </a-col>
                                <a-col :xs="24" :sm="12" :xl="12" :xxl="12">
                                    <!-- 毛重 -->
                                    <a-input v-model:value="form.gross_weight" :placeholder="$t('def.input')">
                                        <template #addonBefore>
                                            <span class="l-w-h-style">{{ $t("d.gross_weight") }}</span>
                                        </template>
                                        <template #addonAfter>
                                            <span class="l-w-h-style-unit">KG</span>
                                        </template>
                                    </a-input>
                                </a-col>
                            </a-row>
                            <a-row gutter="16" class="m-t-16">
                                <!-- 长 -->
                                <a-col :xs="24" :sm="8" :xl="8" :xxl="8">
                                    <a-input-number
                                        :controls="false"
                                        v-model:value="form.length"
                                        :placeholder="$t('def.input')"
                                    >
                                        <template #addonBefore>
                                            <span class="l-w-h-style">{{ $t("d.long") }}</span>
                                        </template>
                                        <template #addonAfter>
                                            <span class="l-w-h-style-unit">CM</span>
                                        </template>
                                    </a-input-number>
                                </a-col>
                                <!-- 宽 -->
                                <a-col :xs="24" :sm="8" :xl="8" :xxl="8">
                                    <a-input-number
                                        :controls="false"
                                        v-model:value="form.width"
                                        :placeholder="$t('def.input')"
                                    >
                                        <template #addonBefore>
                                            <span class="l-w-h-style">{{ $t("d.wide") }}</span>
                                        </template>
                                        <template #addonAfter>
                                            <span class="l-w-h-style-unit">CM</span>
                                        </template>
                                    </a-input-number>
                                </a-col>
                                <!-- 高 -->
                                <a-col :xs="24" :sm="8" :xl="8" :xxl="8">
                                    <a-input-number
                                        :controls="false"
                                        v-model:value="form.height"
                                    >
                                        <template #addonBefore>
                                            
                                            <span class="l-w-h-style">{{ $t("d.high") }}</span>
                                        </template>
                                        <template #addonAfter>
                                            <span class="l-w-h-style-unit">CM</span>
                                        </template>
                                    </a-input-number>
                                </a-col>
                            </a-row>
                        </div>
                    </div>
                </template>
            </div>
        </div>
        <!-- 图片信息 -->
        <div class="form-block">
            <div class="form-title">
                <div class="title">{{ $t("i.image") }}</div>
            </div>
            <div class="form-content">
                <div class="form-item img-upload" :class="{ required: form.type !== itemTypeMap['2']?.key }">
                    <div class="key">{{ $t("i.cover") }}</div>
                    <div class="value">
                        <a-upload
                            name="file"
                            class="item-image-uploader"
                            list-type="picture-card"
                            accept="image/*"
                            v-model:file-list="upload.coverList"
                            :action="upload.action"
                            :headers="upload.headers"
                            :data="upload.data"
                            :multiple="true"
                            :before-upload="handleImgCheck"
                            @change="handleCoverChange"
                            @preview="handlePreview">
                            <div class="image-inner" v-if="upload.coverList.length < 9">
                                <!-- <i class="icon i_upload" /> -->
                                <img src="../../assets/images/upload/add.png" class="upload-add" alt="" />
                            </div>

                            <template #removeIcon>
                                <img src="../../assets/images/upload/close.png" class="upload-close" alt="" />
                            </template>
                        </a-upload>
                        <div class="tip">{{ $t("n.size_prompt_cover") }}</div>
                    </div>
                </div>
                <div class="form-item img-upload" :class="{ required: form.type !== itemTypeMap['2']?.key }">
                    <div class="key">{{ $t("i.picture") }}</div>
                    <div class="value">
                        <a-upload
                            name="file"
                            class="item-image-uploader"
                            list-type="picture-card"
                            accept="image/*"
                            v-model:file-list="upload.detailList"
                            :action="upload.action"
                            :headers="upload.headers"
                            :data="upload.data"
                            :multiple="true"
                            :before-upload="handleImgCheck"
                            @change="handleDetailChange"
                            @preview="handlePreview">
                            <div class="image-inner" v-if="upload.detailList.length < 10">
                                <!-- <i class="icon i_upload" /> -->
                                <img src="../../assets/images/upload/add.png" class="upload-add" alt="" />
                            </div>

                            <template #removeIcon>
                                <img src="../../assets/images/upload/close.png" class="upload-close" alt="" />
                            </template>
                        </a-upload>
                        <div class="tip">{{ $t("n.size_prompt_detail") }}</div>
                    </div>
                </div>
            </div>
        </div>
        <!-- 分类配置 -->
        <div class="form-block" v-if="form.category_ids && configTemp.length">
            <div class="form-title">
                <div class="title">{{ $t("i.configuration") }}</div>
            </div>
            <div class="form-content">
                <div
                    v-for="(item, index) of configTemp"
                    :key="index"
                    :class="{
                        'form-item': true,
                        required: item.required,
                        textarea: item.type === 'textarea',
                        rich_text: item.type === 'rich_text',
                    }">
                    <div class="key" :class="form.config[index].value === '' && isValidate ? 'error' : ''">
                        {{ item.name }}
                    </div>
                    <div class="value">
                        <template v-if="item.type == 'input'">
                            <a-input
                                :placeholder="$t('def.input') + ` ${item.name}`"
                                v-model:value="form.config[index].value" />
                        </template>
                        <template v-if="item.type == 'textarea'">
                            <a-textarea
                                :placeholder="$t('def.input') + ` ${item.name}`"
                                v-model:value="form.config[index].value"
                                :auto-size="{ minRows: 4, maxRows: 6 }"
                                :maxlength="500" />
                            <span class="content-length">{{ form.config[index].value.length }}/500</span>
                        </template>
                        <template v-if="item.type == 'select'">
                            <a-select
                                :placeholder="$t('def.select') + ` ${item.name}`"
                                v-model:value="form.config[index].value"
                                show-search
                                option-filter-prop="children">
                                <a-select-option v-for="(val, i) of item.select" :key="i" :value="val">{{
                                    val
                                }}</a-select-option>
                            </a-select>
                        </template>
                        <template v-if="item.type == 'radio'">
                            <a-radio-group v-model:value="form.config[index].value">
                                <a-radio v-for="(val, i) of item.select" :key="i" :value="val">{{ val }}</a-radio>
                            </a-radio-group>
                        </template>
                        <template v-if="item.type == 'rich_text'">
                            <a-textarea v-model="form.config[index].value" />
                        </template>
                    </div>
                </div>
            </div>
        </div>
        <!-- 规格信息 -->
        <!-- 多规格 并且不 为编辑-->
        <div class="form-block" v-if="!indep_flag && specific.mode === 2">
            <div class="form-title">
                <div class="title">{{ $t("i.information") }}</div>
            </div>
            <div class="form-content" style="overflow-x: auto">
                <template v-if="specific.mode === 2">
                    <div class="form-item specific-config">
                        <div class="key" :class="{ 'form-dispaly-key': $i18n.locale === 'en' }">
                            {{ $t("i.define") }}
                            <a-tooltip :title="$t('i.keyword')">
                                <i class="icon i_hint" style="font-size: 12px"></i>
                            </a-tooltip>
                        </div>
                        <div class="value">
                            <div class="spec-item" v-for="(item, index) of specific.list" :key="index">
                                <div class="name" style="background-color: #f8f8f8; margin-right: -1px">
                                    <div class="star">{{ $t("i.name") }}</div>
                                    <a-input
                                        :class="{
                                            'border-red': index === specification.index && specification.isName,
                                        }"
                                        v-model:value="item.name"
                                        :placeholder="$t('def.input')"
                                        @blur="handleSpecEditBlur(index, 'specification_name')" />
                                    <div class="star">{{ $t("i.name_en") }}</div>
                                    <a-input
                                        :class="{
                                            'border-red': index === specification.index && specification.isWords,
                                        }"
                                        v-model:value="item.key"
                                        :placeholder="$t('def.input')"
                                        @blur="handleSpecEditBlur(index, 'words')" />
                                </div>
                                <div class="name">
                                    <div class="popover-button">
                                        <a-button
                                            type="primary"
                                            ghost
                                            @click="openConfigSet(index, item)"
                                            v-if="item.option?.length === 0">
                                            <span style="padding-right: 0">
                                                {{
                                                    `${$t("i.addition")}${
                                                        $i18n.locale === "en" ? ` ${item.key} ` : item.name
                                                    }${$t("i.value")}`
                                                }}
                                            </span>
                                        </a-button>
                                        <a-button
                                            class="tag-button"
                                            type="primary"
                                            ghost
                                            @click="openConfigSet(index, item)"
                                            v-else>
                                            <span key="tag-body" class="tag-body">
                                                <span
                                                    v-for="(optionItem, optionIndex) of item.option"
                                                    class="tag-value">
                                                    {{ optionItem[$i18n.locale] }}
                                                </span>
                                            </span>
                                        </a-button>
                                    </div>
                                </div>
                                <div class="button" @click="handleRemoveSpec(item, index)">
                                    <i class="icon i_delete" />
                                </div>
                            </div>
                            <a-button
                                class="spec-add"
                                type="primary"
                                ghost
                                @click="handleAddSpec"
                                :disabled="specific?.list?.length > 1"
                                >{{ $t("i.definition") }}</a-button
                            >
                            <span class="spec-text">
                                {{ $t("i.definition_more_num") }}
                            </span>
                        </div>
                    </div>
                    <!-- 规格分类 -->
                    <div class="form-item specific-category" v-if="form.type === itemTypeMap['1']?.key">
                        <div class="key">
                            {{ $t("item-edit.spec_category") }}
                            <a-tooltip :title="$t('item-edit.spec_category_tips')">
                                <i class="icon i_hint" style="font-size: 12px"></i>
                            </a-tooltip>
                        </div>
                        <div class="value">
                            <a-switch v-model:checked="openCategory" @change="openCategory = true"/>
                            <span :class="openCategory ? 'open' : 'close'" >{{ openCategory ? "开启" : "关闭" }}</span>
                        </div>
                    </div>
                    <!-- 选择分类 -->
                    <div class="form-item specific-category-select required" v-if="form.type === itemTypeMap['1']?.key">
                        <div class="key" :class=" isDesEmpty && isValidate ? 'error' : ''">
                            {{ $t("item-edit.spec_category_select") }}
                        </div>
                        <div class="value">
                            <div class="select-area">
                                <!-- 选择下拉 -->
                                <a-select
                                    v-model:value="category_index"
                                    :placeholder="$t('def.select')"
                                    :disabled="categoryDisabled"
                                    @change="handleCategory">
                                    <a-select-option
                                        v-for="(val, index) in specific.list"
                                        :key="val.id"
                                        :value="val.id"
                                        :label="$i18n.locale === 'zh' ? val.name : val.name_en"
                                        >{{ $i18n.locale === "zh" ? val.name : val.name_en }}</a-select-option
                                    >
                                </a-select>
                                <div class="tips" v-if="categoryDisabled">
                                    {{ $t("item-edit.spec_category_select_tips") }}
                                </div>
                            </div>
                            <div class="item-rich-area">
                                <div class="rich-item">
                                    <div class="rich-item-content" v-for="item in categoryMessage">
                                        <div class="rich-title">
                                            {{ item.zh || "-" }}
                                        </div>
                                        <div class="rich-item-area">
                                            <MyEditor
                                                v-model:modelValue="item.desc"
                                                placeholder="为前端样式更美观，请用分隔符分类的规格值进行描述，参数条数建议不超过4条，中文建议不超过14个字符 如：                                 ·电池规格：356-23sSDV" />
                                        </div>
                                        <div class="rich-title">
                                            {{ item.en || "-" }}
                                        </div>
                                        <div class="rich-item-area">
                                            <MyEditor
                                                v-model:modelValue="item.desc_en"
                                                placeholder="为前端样式更美观，请用分隔符分类的规格值进行描述，参数条数建议不超过4条，中文建议不超过14个字符 如：                                 ·Battery Volume : 72V46AH"/>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="form-item specific-items required">
                        <div class="key " :class="!validateConfigFlag && isValidate ? 'error' : ''">
                            {{ $t("i.specs") }}
                        </div>
                        <div class="value table-container no-mg">
                            <a-table
                                :columns="specificColumns"
                                :data-source="specific.data"
                                :scroll="{ x: true }"
                                tableLayout="fixed"
                                :row-key="(record,index) => record.title"
                                :pagination="false"
                                class="specific-table">
                                <template #headerCell="{ title, column }">
                                    <template v-if="column.icon">
                                        <a-tooltip :title="$t('item-edit.add_spec')">
                                            <i
                                                class="icon i_hint"
                                                style="font-size: 12px; margin-right: 4px; cursor: pointer"></i>
                                        </a-tooltip>
                                        <span>{{ title }}</span>
                                    </template>
                                    <template
                                        v-if="column.dataIndex === 'fob_eur' && form.type !== itemTypeMap['1']?.key">
                                        <div class="title-row">
                                            <span>
                                                {{ column.title }}
                                            </span>
                                            <a-popover
                                                v-model:visible="batchSet.fobEurVisible"
                                                trigger="click"
                                                @visibleChange="
                                                    (visible) => {
                                                        !visible && handleCloseBatchSet();
                                                    }
                                                ">
                                                <template #content>
                                                    <div class="batch-set-edit-popover">
                                                        <p class="batch-set-edit-popover-title">
                                                            {{ $t("i.settings") }}{{ column.title }}
                                                        </p>
                                                        <a-input-number
                                                            v-model:value="batchSet.fob_eur"
                                                            :placeholder="$t('def.input')"
                                                            @keydown.enter="handleBatchSpec('fob_eur')"
                                                            :min="0"
                                                            :autofocus="true"
                                                            :precision="2" 
                                                            :formatter="(value) => formatNum(value)"
                                                            :parser="(value) => clearNum(value)"
                                                            />
                                                        <div class="btns">
                                                            <a-button
                                                                type="primary"
                                                                ghost
                                                                @click="handleCloseBatchSet"
                                                                >{{ $t("def.cancel") }}</a-button
                                                            >
                                                            <a-button
                                                                type="primary"
                                                                @click="handleBatchSpec('fob_eur')"
                                                                >{{ $t("def.sure") }}</a-button
                                                            >
                                                        </div>
                                                    </div>
                                                </template>
                                                <a href="#">{{ $t("i.settings") }}</a>
                                            </a-popover>
                                        </div>
                                    </template>
                                    <template
                                        v-if="column.dataIndex === 'fob_usd' && form.type !== itemTypeMap['1']?.key">
                                        <div class="title-row">
                                            <span>
                                                {{ column.title }}
                                            </span>
                                            <a-popover
                                                v-model:visible="batchSet.fobUsdVisible"
                                                trigger="click"
                                                @visibleChange="
                                                    (visible) => {
                                                        !visible && handleCloseBatchSet();
                                                    }
                                                ">
                                                <template #content>
                                                    <div class="batch-set-edit-popover">
                                                        <p class="batch-set-edit-popover-title">
                                                            {{ $t("i.settings") }}{{ column.title }}
                                                        </p>
                                                        <a-input-number
                                                            v-model:value="batchSet.fob_usd"
                                                            :placeholder="$t('def.input')"
                                                            @keydown.enter="handleBatchSpec('fob_usd')"
                                                            :min="0"
                                                            :autofocus="true"
                                                            :precision="2" 
                                                            :formatter="(value) => formatNum(value)"
                                                            :parser="(value) => clearNum(value)"
                                                            />
                                                        <div class="btns">
                                                            <a-button
                                                                type="primary"
                                                                ghost
                                                                @click="handleCloseBatchSet"
                                                                >{{ $t("def.cancel") }}</a-button
                                                            >
                                                            <a-button
                                                                type="primary"
                                                                @click="handleBatchSpec('fob_usd')"
                                                                >{{ $t("def.sure") }}</a-button
                                                            >
                                                        </div>
                                                    </div>
                                                </template>
                                                <a href="#">{{ $t("i.settings") }}</a>
                                            </a-popover>
                                        </div>
                                    </template>
                                </template>
                                <template #bodyCell="{ text, record, index, column}">
                                    <template v-if="column.dataIndex === 'imgs'">
                                        <!--  list-type="picture-card" -->
                                        <div>
                                            <a-upload
                                                name="file"
                                                accept="image/*"
                                                v-model:file-list="record.imgsList"
                                                :action="upload.action"
                                                :headers="upload.headers"
                                                :data="upload.data"
                                                :before-upload="handleImgCheck"
                                                @change="handleNewChildChange"
                                                @preview="handlePreview">
                                                <a-button
                                                    v-if="record.imgsList && record.imgsList.length === 0"
                                                    class="spce-add-pic"
                                                    type="primary"
                                                    ghost
                                                    >{{ $t("n.upload_pic") }}</a-button
                                                >
                                            </a-upload>
                                            <div
                                                class="imgList-box"
                                                v-if="record.imgsList && record.imgsList.length > 0">
                                                <img
                                                    class="img-pic"
                                                    @click="handlePreview(record.imgsList?.[0])"
                                                    :src="record.imgsList?.[0]?.url"
                                                    v-if="record.imgsList?.[0]?.url"
                                                    alt="" />
                                                <img
                                                    class="close-pic"
                                                    @click="record.imgsList = []"
                                                    v-if="record.imgsList?.[0]?.url"
                                                    src="../../assets/images/upload/close_table.png"
                                                    alt="" />
                                            </div>
                                        </div>
                                    </template>
                                    <template v-if="column.dataIndex === 'code'">
                                        <a-input
                                            class="code"
                                            v-model:value="record.code"
                                            :placeholder="$t('def.input')"
                                            @change="inputValidateConfig" />
                                    </template>
                                    <template v-if="column.dataIndex === 'name'">
                                        <a-input
                                            class="code"
                                            v-model:value="record.name"
                                            :placeholder="$t('def.input')"
                                            @change="inputValidateConfig" />
                                    </template>
                                    <template v-if="column.dataIndex === 'name_en'">
                                        <a-input
                                            class="code"
                                            v-model:value="record.name_en"
                                            :placeholder="$t('def.input')"
                                            @change="inputValidateConfig" />
                                    </template>
                                    <template v-if="column.dataIndex === 'price'">
                                        <a-input-number
                                            v-model:value="record.price"
                                            :min="0.1"
                                            :precision="2"
                                            :formatter="(value) => formatNum(value)"
                                            :parser="(value) => clearNum(value)"
                                            @change="inputValidateConfig" />
                                    </template>
                                    <template v-if="column.dataIndex === 'fob_eur'">
                                        <a-input-number
                                            v-if="form.type !== itemTypeMap['1']?.key"
                                            v-model:value="record.fob_eur"
                                            :min="0.1"
                                            :precision="2"
                                            :formatter="(value) => formatNum(value)"
                                            :parser="(value) => clearNum(value)"
                                            @change="inputValidateConfig" />
                                        <div
                                            class="show-ladder"
                                            v-else-if="
                                                form.type === itemTypeMap['1']?.key &&
                                                record.fob_eur &&
                                                record.fob_20gp_eur &&
                                                record.fob_40qh_eur
                                            ">
                                            <div class="show-ladder-item" @click="openLadderPrice('EUR',record,index)">
                                                <div class="show-ladder-item-title">
                                                    {{ $t("item-edit.quantity_40HQ") }} :
                                                </div>
                                                <div class="show-ladder-item-content">
                                                    {{
                                                        `€ ${formatNum(record.fob_40qh_eur)}`
                                                    }}
                                                </div>
                                            </div>

                                            <div class="show-ladder-item" @click="openLadderPrice('EUR',record,index)">
                                                <div class="show-ladder-item-title">
                                                    {{ $t("item-edit.quantity_20GP") }} :
                                                </div>
                                                <div class="show-ladder-item-content">
                                                    {{
                                                        `€ ${formatNum(record.fob_20gp_eur)}`
                                                    }}
                                                </div>
                                            </div>
                                            <div class="show-ladder-item" @click="openLadderPrice('EUR',record,index)">
                                                <div class="show-ladder-item-title">{{ $t("item-edit.sample") }} :</div>
                                                <div class="show-ladder-item-content">
                                                    {{ `€ ${formatNum(record.fob_eur)}`}}
                                                </div>
                                            </div>

                                        </div>
                                        <!-- 设置阶梯价格按钮 -->
                                        <a-button
                                            v-else-if="
                                                form.type === itemTypeMap['1']?.key &&
                                                (!record.fob_eur || !record.fob_20gp_eur || !fob_40qh_eur)
                                            "
                                            type="primary"
                                            class="ladder-price"
                                            ghost
                                            @click="openLadderPrice('EUR',record,index)"
                                            >{{ $t("item-edit.ladder_price") }}</a-button
                                        >
                                    </template>
                                    <template v-if="column.dataIndex === 'fob_usd'">
                                        <a-input-number
                                            v-if="form.type !== itemTypeMap['1']?.key"
                                            v-model:value="record.fob_usd"
                                            :min="0.1"
                                            :precision="2"
                                           :formatter="(value) => formatNum(value)"
                                            :parser="(value) => clearNum(value)"
                                            @change="inputValidateConfig" />
                                        <div
                                            class="show-ladder"
                                            v-else-if="
                                                form.type === itemTypeMap['1']?.key &&
                                                record.fob_usd &&
                                                record.fob_20gp_usd &&
                                                record.fob_40qh_usd
                                            ">
                                            <div class="show-ladder-item" @click="openLadderPrice('USD',record,index)">
                                                <div class="show-ladder-item-title">
                                                    {{ $t("item-edit.quantity_40HQ") }} :
                                                </div>
                                                <div class="show-ladder-item-content">
                                                    {{ `€ ${formatNum(record.fob_40qh_usd)}` }}
                                                </div>
                                            </div>
                                            <div class="show-ladder-item" @click="openLadderPrice('USD',record,index)">
                                                <div class="show-ladder-item-title">
                                                    {{ $t("item-edit.quantity_20GP") }} :
                                                </div>
                                                <div class="show-ladder-item-content">
                                                    {{
                                                        `$ ${formatNum(record.fob_20gp_usd)}`
                                                    }}
                                                </div>
                                            </div>
                                            <div class="show-ladder-item" @click="openLadderPrice('USD',record,index)">
                                                <div class="show-ladder-item-title">{{ $t("item-edit.sample") }} :</div>
                                                <div class="show-ladder-item-content">
                                                    {{ `$ ${formatNum(record.fob_usd)}` }}
                                                </div>
                                            </div>

                                        </div>
                                        <a-button
                                            v-else-if="
                                                form.type === itemTypeMap['1']?.key &&
                                                (!record.fob_usd || !record.fob_20gp_usd || !fob_40qh_usd)
                                            "
                                            type="primary"
                                            ghost
                                            class="ladder-price"
                                            @click="openLadderPrice('USD',record,index)"
                                            >{{ $t("item-edit.ladder_price") }}</a-button
                                        >
                                    </template>
                                    <template v-if="column.dataIndex === 'operation'">
                                        <a-button type="link" @click="handleDelete(record)">
                                            <i class="icon i_delete" />
                                            {{ $t("def.delete") }}
                                        </a-button>
                                    </template>
                                    <template v-if="column.key === 'select'">
                                        <a-select
                                            v-model:value="record[column.dataIndex]"
                                            :placeholder="$t('def.select')">
                                            <a-select-option
                                                v-for="(val, index) of column.option"
                                                :key="index"
                                                :value="val.key"
                                                @click="specChange(record, column.dataIndex, val)"
                                                >{{ val[$i18n.locale] }}</a-select-option
                                            >
                                        </a-select>
                                    </template>
                                </template>
                            </a-table>
                            <a-button
                                class="spec-add"
                                style="margin-top: 0px"
                                type="primary"
                                ghost
                                @click="handleAddSpecItem"
                                ><i class="icon i_add" />{{ $t("i.add_specs") }}</a-button
                            >
                        </div>
                    </div>
                </template>
            </div>
        </div>
        <!-- 单规格时的不为整车的价格信息 -->
        <div class="form-block" v-if="(specific.mode === 1 || indep_flag) && form.type !== itemTypeMap['1']?.key">
            <div class="form-title">
                <div class="title">{{ $t("i.price_information") }}</div>
            </div>
            <div class="form-content">
                <div class="form-item required">
                    <div class="key" :class="form.fob_eur === '' && isValidate ? 'error' : ''">FOB(EUR)</div>
                    <div class="value input-number">
                        <a-input-number 
                            v-model:value="form.fob_eur" 
                            :min="0.1"
                            :precision="2" 
                            placeholder="0.00" 
                            :formatter="(value) => formatNum(value)"
                            :parser="(value) => clearNum(value)"
                        />
                        <span>€</span>
                    </div>
                </div>
                <div class="form-item required">
                    <div class="key" :class="form.fob_usd === '' && isValidate ? 'error' : ''">FOB(USD)</div>
                    <div class="value input-number">
                        <a-input-number 
                            v-model:value="form.fob_usd" 
                            :min="0.1"
                            :precision="2" 
                            placeholder="0.00" 
                            :formatter="(value) => formatNum(value)"
                            :parser="(value) => clearNum(value)"/>
                        <span>$</span>
                    </div>
                </div>
            </div>
        </div>
        <!-- 单规格时的整车价格信息 -->
        <div class="labber-form-block form-block" v-if="(specific.mode === 1 || indep_flag) && form.type === itemTypeMap['1']?.key">
            <div class="form-title">
                <div class="title">{{ $t("i.price_information") }}</div>
            </div>
            <div class="labber-form-content" >
                <div class="key-title">
                    <div class="title"> FOB(EUR)</div>
                    <div class="labber">
                        <div class="value input-number">
                            <div  :class="!form.fob_40qh_eur && isValidate ? ' title required error' : 'title required'">{{ $t('item-edit.quantity_40HQ') }}</div>
                            <a-input-number
                                v-model:value="form.fob_40qh_eur"
                                :min="0.1"
                                :precision="2"
                                :formatter="(value) => formatNum(value)"
                                :parser="(value) => clearNum(value)"
                                @change="inputValidateConfig('EUR')"
                            >
                                <template #addonAfter>
                                   <span>€</span>
                                </template>
                            </a-input-number>
                            <div class="tips ">{{ $t('item-edit.quantity_26_no') }}</div>
                        </div>
                        <div class="value input-number">
                            <div  :class="!form.fob_20gp_eur && isValidate ? ' title required error' : 'title required'">{{ $t('item-edit.quantity_20GP') }}</div>
                            <a-input-number
                                v-model:value="form.fob_20gp_eur"
                                :min="0.1"
                                :precision="2"
                                :formatter="(value) => formatNum(value)"
                                :parser="(value) => clearNum(value)"
                                @change="inputValidateConfig('EUR')"
                            >
                                <template #addonAfter>
                                    <span>€</span>
                                </template>
                            </a-input-number>
                            <div  class="tips">{{ $t('item-edit.quantity_11_25_no') }}</div>
                        </div>
                        <div class="value input-number">
                            <div  :class="!form.fob_eur && isValidate ?' title required error' : 'title required'">{{ $t('item-edit.sample') }}</div>
                            <a-input-number
                                v-model:value="form.fob_eur"
                                :min="0.1"
                                :precision="2"
                                :formatter="(value) => formatNum(value)"
                                :parser="(value) => clearNum(value)"
                                @change="inputValidateConfig('EUR')"
                            >
                                <template #addonAfter>
                                    <span>€</span>
                                </template>
                            </a-input-number>
                            <div  class="tips">{{ $t('item-edit.quantity_1_10_no') }}</div>
                        </div>
                    </div>
                </div>
                <div class="key-title">
                    <div class="title"> FOB(USD)</div>
                    <div class="labber">
                        <div class="value input-number">
                            <div  :class="!form.fob_40qh_usd && isValidate ? ' title required error' : 'title required'">{{ $t('item-edit.quantity_40HQ') }}</div>
                            <a-input-number
                                v-model:value="form.fob_40qh_usd"
                                :min="0.1"
                                :precision="2"
                                :formatter="(value) => formatNum(value)"
                                :parser="(value) => clearNum(value)"
                                @change="inputValidateConfig('USD')"
                            >
                                <template #addonAfter>
                                    <span>$</span>
                                </template>
                            </a-input-number>
                            <div  class="tips">{{ $t('item-edit.quantity_26_no') }}</div>

                        </div>
                        <div class="value input-number">
                            <div  :class="!form.fob_20gp_usd && isValidate ? ' title required error' : 'title required'">{{ $t('item-edit.quantity_20GP') }}</div>
                            <a-input-number
                                v-model:value="form.fob_20gp_usd"
                                :min="0.1"
                                :precision="2"
                                :formatter="(value) => formatNum(value)"
                                :parser="(value) => clearNum(value)"
                                @change="inputValidateConfig('USD')"
                            >
                                <template #addonAfter>
                                    <span>$</span>
                                </template>
                            </a-input-number>
                            <div  class="tips">{{ $t('item-edit.quantity_11_25_no') }}</div>
                        </div>
                        <div class="value input-number">
                            <div :class="!form.fob_usd && isValidate ? ' title required error' : 'title required'">{{ $t('item-edit.sample') }}</div>
                            <a-input-number
                                v-model:value="form.fob_usd"
                                :min="0.1"
                                :precision="2"
                                :formatter="(value) => formatNum(value)"
                                :parser="(value) => clearNum(value)"
                                @change="inputValidateConfig('USD')"
                            >
                                <template #addonAfter>
                                    <span>$</span>
                                </template>
                            </a-input-number>
                            <div  class="tips">{{ $t('item-edit.quantity_1_10_no') }}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- 按钮 -->
        <div class="form-btns fixed-btns" ref="fixBox" :style="{ width: fixedWidth }">
            <!-- 保存草稿 -->
            <a-button
                @click="handleSubmit('draft')"
                v-if="saveDarftShow"
            >
                {{ $t("i.save_draft") }}
            </a-button>
            <!--  type="primary" ghost -->
            <a-button @click="routerChange('back')">{{ $t("def.cancel") }}</a-button>
            <a-button type="primary" @click="handleSubmit">{{ $t("def.sure_create") }}</a-button>
            <!-- 底部障眼法-盒子 -->
            <div class="bottom-box"></div>
        </div>

        <div :style="{ height: fixedHeight }"></div>
        <a-modal
            :maskClosable="false"
            destroyOnClose
            :visible="showConfigSet"
            :width="600"
            :title="configSetTitle"
            wrapClassName="config-modal"
            @ok="handleComfirmConfig"
            @cancel="handleCancelConfig">
            <div class="config-list">
                <div class="config-item" v-for="(option, i) of configSetMes.option" :key="i">
                    <div class="config-item-title" :style="{ color: uniqueArr.indexOf(i) !== -1 ? 'red' : '' }">
                        <span> {{ $t("i.value") }}&nbsp;{{ i + 1 }} </span>
                        <i class="icon i_delete" @click="handleRemoveSpecOption(configIndex, i)" />
                    </div>
                    <div class="config-item-mes">
                        <div class="config-item-zh">
                            <p class="config-item-zh-title">
                                <span :style="{ color: option.validate && !option.zh ? 'red' : '' }">
                                    {{ $t("i.value_zh") }}
                                </span>
                                <span class="content-length" v-if="option.zhFocus"> {{ option.zh.length }} /50 </span>
                            </p>
                            <a-input
                                v-model:value="option.zh"
                                :placeholder="$t('def.input') + $t('i.value_zh')"
                                :max-length="50"
                                @focus="option.zhFocus = true"
                                @blur="option.zhFocus = false" />
                        </div>
                        <div class="config-item-en">
                            <p class="config-item-en-title">
                                <span :style="{ color: option.validate && !option.en ? 'red' : '' }">
                                    {{ $t("i.value_en") }}
                                </span>
                                <span class="content-length" v-if="option.enFocus"> {{ option.en.length }}/50 </span>
                            </p>
                            <a-input
                                v-model:value="option.en"
                                :placeholder="$t('def.input') + $t('i.value_en')"
                                @focus="option.enFocus = true"
                                @blur="option.enFocus = false"
                                :max-length="50" />
                        </div>
                    </div>
                </div>
                <div class="fix-bottom">
                    <div class="add-config-btn" @click="addConfig">{{ $t("i.addition") }}{{ $t("i.value") }}</div>
                </div>
            </div>
        </a-modal>
        <!-- 阶梯价格 -->
        <LadderPrice
            v-model:ladderPriceVisible="ladderPriceVisible"
            :ladderPriceTitle="ladderPriceTitle"
            :ladderData="labberData" 
            :activeRow="activeRow"
            :activeIndex="activeIndex"
            @handleLastLadderData="handleLastLadderData"
            @handleSaveLadderData="handleSaveLadderData"
            @initActiveIndex="activeIndex = $event"    
        />
        <!-- 自定义图片预览 -->
        <div class="image-preview" :class="{ 'preview-wrap': previewVisible }" @click="previewVisible = false">
            <img :src="previewImage" alt="" />
        </div>
    </div>
</template>

<script>
import Core from "../../core";
import CategoryTreeSelectMultiple from "@/components/popup-btn/CategoryTreeSelectMultiple.vue";
import ItemHeader from "./components/ItemHeader.vue";
import ItemSelect from "@/components/popup-btn/ItemSelect.vue";
import _ from "lodash";
import {  Upload } from 'ant-design-vue';

// 查重
function findDuplicates(arr) {
    let set = new Set();
    let duplicates = [];
    arr.forEach((item, index) => {
        let prevSize = set.size;
        set.add(JSON.stringify(item));
        if (set.size === prevSize) {
            duplicates.push(index);
        }
    });
    return duplicates;
}
import MyEditor from "@/components/MyEditor/index.vue";
import LadderPrice from "./components/LadderPrice.vue";
export default {
    name: "ItemEdit",
    components: {
        CategoryTreeSelectMultiple,
        ItemHeader,
        ItemSelect,
        MyEditor,
        LadderPrice,
    },
    props: {},
    data() {
        return {
            keyArr:[],
            // 阶梯价格
            labberData: [],
            ladderPriceVisible: false,
            ladderPriceTitle: "",
            activeRow: {},
            activeIndex : null,
            categoryMessage:[],
            // 判断选择哪个分类的数据
            category_index: null,
            openCategory: true, //暂时留作switch开关的逻辑
            categoryDisabled: true, //默认禁用switch开关
            previewImage: "",
            previewVisible: false,
            Core,
            loginType: Core.Data.getLoginType(),
            // 加载
            loading: false,
            itemTypeMap: Core.Const.ITEM.TYPE_MAP,
            flagEntityMap: Core.Const.ITEM.FLAG_ENTITY_MAP,
            // 是否为编辑（是否为创建）
            indep_flag: 0,
            monetaryList: Core.Const.ITEM.MONETARY_TYPE_MAP,
            set_id: "",
            detail: {},
            form: {
                id: "",
                name: "",
                name_en: "",
                type: 1,
                code: "",
                model: "",
                logo: "",
                imgs: "",
                flag_entity: undefined,
                category_ids: [],
                price: undefined,
                // original_price_currency: "CNY", // 默认
                // original_price: undefined,
                config: "",
                // man_hour: '',
                sales_area_ids: [],
                deposit: undefined, // 定金支付
                drawing_code: "",
                color: "",
                color_en: "",
                net_weight: "",
                gross_weight: "",

                fob_eur: "",
                fob_usd: "",
                accessory_id: "",
                accessory_name: "",
                accessory_name_en: "",
                accessory_code: "",
                accessory_amount: "",

                length: undefined, // 长
                width: undefined, // 宽
                height: undefined, // 高
            },
            // temporarily_deposit: 0,// 临时定金支付按钮
            salesList: [], // 销售区域
            // 商品分类
            item_category: {},
            configTemp: [],
            specific: {
                // 规格
                mode: 1, // 1 是单规格 2 是多规格
                list: [], // [{id: '', name: '', key: '', option: [desc:'',desc_en:''], addVisible: false, addValue: '',flag_category:0,}] 商品规格属性列表（可定义）
                data: [], // [{code: '', price: '', original_price: [], ……, attr_list}] 商品规格信息列表
            },
            batchSet: {
                // 批量设置
                priceVisible: false,
                price: "",

                // originalVisible: false,
                // original_price: "",

                fobEurVisible: false,
                fob_eur: "",

                fobUsdVisible: false,
                fob_usd: "",
            },
            upload: {
                // 上传图片
                action: Core.Const.NET.FILE_UPLOAD_END_POINT,
                coverList: [],
                detailList: [],
                headers: {
                    ContentType: false,
                },
                data: {
                    token: Core.Data.getToken(),
                    type: "img",
                },
            },
            tinymce_setting: {
                // 富文本
                menubar: false, // 隐藏菜单栏
                branding: false, // 隐藏右下角技术支持

                toolbar:
                    " fontsizeselect forecolor backcolor | bold italic underline strikethrough | formatselect alignleft aligncenter alignright alignjustify | numlist bullist | indent outdent | superscript subscript | removeformat | fullscreen",
                // toolbar: 'undo redo | fullscreen | formatselect alignleft aligncenter alignright alignjustify | link unlink | numlist bullist | image media table | fontsizeselect forecolor backcolor | bold italic underline strikethrough | indent outdent | superscript subscript | removeformat |',
                toolbar_mode: "sliding",

                // quickbars_selection_toolbar:
                // 'removeformat | bold italic underline strikethrough | fontsizeselect forecolor backcolor',
                // plugins: 'link image media table lists fullscreen quickbars',

                fontsize_formats: "12px 14px 16px 18px",
                default_link_target: "_blank",
                link_title: false,
                nonbreaking_force_tab: true,
                // 设置中文语言
                language: "zh_CN",
                language_url: "/ext/tinymce_zh_CN.js",
                content_style: "body{font-size: 14px}",
            },
            // 是否已校验
            isValidate: false,
            validateConfigFlag: false,
            // 判断多规格时候的 规格名称 关键字 边框变红判断
            specification: {
                isName: false,
                isWords: false,
                index: undefined,
            },
            // 图片最多上传张数
            limit: 10,
            showConfigSet: false,
            configSetMes: {},
            oldConfigSetMes: {},
            configIndex: 0,
            uniqueArr: [],
            // 固定盒子宽度
            fixedWidth: "auto",
            // 固定盒子高度
            fixedHeight: "auto",
            newChild: {
                imgs: []
            },
            goodsDraftData: {},

        };
    },
    watch: {
        specific: {
            handler: function (val, oldVal) {
                if (val?.list && val?.list?.length > 0) {
                    this.categoryDisabled = false;
                } else {
                    this.categoryDisabled = true;
                }
            },
            deep: true,
            immediate: true,
        },
        'specific.list': {
            handler: function (val, oldVal) {
               this.keyArr = [];
               val.forEach((item,index) => {
                   this.keyArr.push(item.key)
               })
            },
            deep: true,
            immediate: true,
        },
    },
    computed: {
        specificColumns() {
            let column = [];
            column = this.specific.list.map((item, index) => ({
                id: item.id,
                title: this.$i18n.locale === "zh" ? item.name : item.key,
                dataIndex: item.key,
                key: "select",
                option: item.option,
                minWidth: "150px",
                icon: true,
            }));
            column = column.filter((item) => item.title && item.dataIndex);
            column.push(
                { title: this.$t("i.spec_pic"), key: "img", dataIndex: "imgs" }, // 规格图片
                { title: this.$t("i.sku_code"), key: "input", dataIndex: "code" }, // , fixed: 'left'
                { title: this.$t("n.name"), key: "input", dataIndex: "name" },
                {
                    title: this.$t("n.name_en"),
                    key: "input",
                    dataIndex: "name_en",
                },
                {
                    title: "FOB(EUR)",
                    key: "money",
                    dataIndex: "fob_eur",
                    unit: "€",
                    width: 160,
                }, //, fixed: 'right'
                {
                    title: "FOB(USD)",
                    key: "money",
                    dataIndex: "fob_usd",
                    unit: "$",
                    width: 160,
                }, // , fixed: 'right'
                {
                    title: this.$t("n.operation"),
                    key: "operation",
                    dataIndex: "operation",
                    fixed: "right",
                } // , fixed: 'right'
            );
            return column;
        },
        configSetTitle() {
            return `${this.$t("i.addition")}${
                this.$i18n.locale === "en" ? ` ${this.configSetMes?.key} ` : this.configSetMes?.name
            }${this.$t("i.value")}`;
        },
        isDesEmpty() {
            let flag = false;
            if(this.categoryMessage && this.categoryMessage.length > 0  ){
                for (let i = 0; i < this.categoryMessage.length; i++) {
                const item = this.categoryMessage[i];
                    if (
                        item.desc === "" || 
                        item.desc_en === "" || 
                        item.desc === "<p><br></p>" || 
                        item.desc_en === "<p><br></p>") {
                        flag = true;
                        break;
                    }
                }
            }else{
                flag = true;
            }
            return flag
        },
        saveDarftShow() {
            if(this.$route.query.edit){
                return  false
            }else {
                return true
            }
        }

    },
    created() {
        this.goodsDraftData = Core.Data.getGoodsDraft() ? JSON.parse(Core.Data.getGoodsDraft()) : {};
        this.form.id = Number(this.$route.query.id) || 0;
        this.set_id = Number(this.$route.query.set_id) || 0;
        this.indep_flag = Number(this.$route.query.indep_flag) || 0; // 商品详情里面的编辑按钮参数

        // 获取草稿信息
        if (this.form.id) {
            this.getItemDetail();
        }
        if(Object.keys(this.goodsDraftData).length > 0 && !this.$route.query.edit){
          this.setFormDartData(this.goodsDraftData);
        }
        this.getSalesAreaList();
    },
    mounted() {
        window.addEventListener("resize", this.handleResize);

        this.$nextTick(() => {
            this.handleResize();
        });
    },
    beforeDestroy() {
        window.removeEventListener("resize", this.handleResize);
        // this.observer.disconnect();    //取消监听
    },
    beforeRouteLeave(to, from, next) {
        window.removeEventListener("resize", this.handleResize);
        // 当离开当前路由时执行的操作
        next();
    },
    methods: {
        handleTableNameChange(type){
            console.log(this.specific.data)
            console.log(this.form)
            switch (type) {
                case 'zh':
                    this.specific.data.forEach((item,index) => {
                        item.name = item.name = `${this?.form?.name || ''} ${this?.keyArr[0] ? item[this.keyArr[0]].value : ''} ${this?.keyArr[1] ? item[this.keyArr[1]].value : ''} `
                    })
                    break;
                case 'en':
                    this.specific.data.forEach((item,index) => {
                        item.name_en = item.name_en = `${this?.form?.name_en || ''} ${this?.keyArr[0] ? item[this.keyArr[0]].value_en : ''} ${this?.keyArr[1] ? item[this.keyArr[1]].value_en : ''} `
                    })
                    break;
            
                default:
                    break;
            }
        },
        // 数字的3位划分
        formatNum(num) {
            // 区分小数点
            let [integer, decimal] = String.prototype.split.call(num, ".");
            integer = integer.replace(/\d(?=(\d{3})+$)/g, "$&,");
            return decimal ? `${integer}.${decimal}` : integer;
        },
        // 清除3位划分的逗号
        clearNum(num) {
            return num.replace(/,/g, "");
        },
        // openLadderPrice
        openLadderPrice(type,record,index) {
            this.specific.data.forEach((item,index) => {
                item.id = index;
                item.fob_eur = item.fob_eur ? item.fob_eur : "";
                item.fob_20gp_eur = item.fob_20gp_eur ? item.fob_20gp_eur : "";
                item.fob_40qh_eur = item.fob_40qh_eur ? item.fob_40qh_eur : "";
                item.fob_usd = item.fob_usd ? item.fob_usd : "";
                item.fob_20gp_usd = item.fob_20gp_usd ? item.fob_20gp_usd : "";
                item.fob_40qh_usd = item.fob_40qh_usd ? item.fob_40qh_usd : "";
            })
            
            this.labberData = this.specific.data;
            this.ladderPriceVisible = true;
            this.activeRow = record;
            this.activeIndex = index;
            this.ladderPriceTitle = this.$t("item-edit.ladder_price_setting");
        },
        // 处理数据（批量修改）
        handleLastLadderData(data) {
            this.labberData = data;
        },
        // 提交数据
        handleSaveLadderData(data){
            this.specific.data = data;
        },
        /* 监听 */
        handleResize() {
            const width = this.$refs.bigBox && this.$refs.bigBox.offsetWidth;
            const height = this.$refs.fixBox && this.$refs.fixBox.offsetHeight;
            this.fixedWidth = width + "px";
            this.fixedHeight = height + "px";
            // 在这里处理宽高变化的逻辑
        },
        handlePreview(file) {
            this.previewImage = file?.response?.data?.filename
                ? Core.Const.NET.FILE_URL_PREFIX + file.response.data.filename
                : file?.url
                ? file.url
                : "";
            this.previewVisible = true;
        },
        changeOption(option, i) {
            option.disabled = false;
        },
        routerChange(type, item) {
            let routeUrl;
            switch (type) {
                case "back":
                    this.$router.go(-1);
                    break;
                case "detail": // 详情
                    routeUrl = this.$router.resolve({
                        path: "/item/item-detail",
                        query: { id: item.id },
                    });
                    window.open(routeUrl.href, "_self");
                    break;
            }
        },
        // 选择分类的触发
        handleCategory(val) {
            this.category_index = val;
            this.categoryMessage = [];
            this.categoryMessage = this.specific.list.filter((item) => item.id === val)[0]?.option || [];
        },
        // 获取商品详情
        getItemDetail() {
            this.loading = true;
            if (this.set_id && !this.indep_flag) {
                // 多规格商品
                Core.Api.Item.listBySet({ set_id: this.set_id })
                    .then((res) => {
                        let list = res.list;
                        let mainItem = list.find((i) => i.flag_default === 1);
                        // 根据详情-赋值规格等信息
                        this.setFormData(mainItem);
                        // 赋值规格定义列表-规格商品列表
                        this.setSpecificData(list);
                    })
                    .catch((err) => {
                        console.log("getItemGroup err", err);
                    })
                    .finally(() => {
                        this.loading = false;
                    });
            } else {
                // 单规格商品
                Core.Api.Item.detail({
                    id: this.form.id,
                })
                    .then((res) => {
                        this.setFormData(res.detail);
                    })
                    .catch((err) => {
                        console.log("getItemDetail err", err);
                    })
                    .finally(() => {
                        this.loading = false;
                    });
            }
        },
        // 根据详情-赋值规格等信息
        setFormData(res) {
            this.loading = true;
            this.detail = res;
            let config = [];
            let _config = [];
            this.item_category = res.category;
            try {
                this.configTemp = JSON.parse(res.category.config);
            } catch (err) {
                this.configTemp = [];
            }
            try {
                _config = JSON.parse(res.config);
            } catch (err) {
                _config = [];
            }
            for (let i = 0; i < this.configTemp.length; i++) {
                const item = this.configTemp[i];
                config.push({
                    name: item.name,
                    key: item.key,
                    value: item.type === "select" ? undefined : "",
                    type: item.type,
                });
            }
            for (let i = 0; i < config.length; i++) {
                const target = config[i];
                let _target = _config.find((item) => item.key === target.key);
                target.value = _target ? _target.value : "";
            }

            for (const key in this.form) {
                this.form[key] = res[key];
            }

            this.form.config = config;
            this.form.type = res.type;
            this.form.price = Core.Util.countFilter(res.price);
            this.form.fob_eur = Core.Util.countFilter(res.fob_eur);
            this.form.fob_20gp_eur = Core.Util.countFilter(res.fob_20gp_eur);
            this.form.fob_40qh_eur = Core.Util.countFilter(res.fob_40qh_eur);
            this.form.fob_usd = Core.Util.countFilter(res.fob_usd);
            this.form.fob_20gp_usd = Core.Util.countFilter(res.fob_20gp_usd);
            this.form.fob_40qh_usd = Core.Util.countFilter(res.fob_40qh_usd);
            this.form.category_ids = this.detail.category_list
                ? this.detail.category_list.map((i) => i.category_id)
                : [];
            this.form.sales_area_ids = this.detail.sales_area_list ? this.detail.sales_area_list.map((i) => i.id) : [];
            this.form.color = res.color;
            this.form.color_en = res.color_en;
            this.form.net_weight = res.net_weight;
            this.form.gross_weight = res.gross_weight;
            // 长宽高回显逻辑
            this.form.length = res.length;
            this.form.width = res.width;
            this.form.height = res.height;

            if (this.form.logo) {
                let logos = this.form.logo.split(",");
                this.upload.coverList = logos.map((item, index) => ({
                    uid: index + 1,
                    name: item,
                    url: Core.Const.NET.FILE_URL_PREFIX + item,
                    short_path: item,
                    status: "done",
                }));
            }
            if (this.form.imgs) {
                let imgs = this.form.imgs.split(",");
                this.upload.detailList = imgs.map((item, index) => ({
                    uid: index + 1,
                    name: item,
                    url: Core.Const.NET.FILE_URL_PREFIX + item,
                    short_path: item,
                    status: "done",
                }));
            }

            if (this.form.type === Core.Const.ITEM.TYPE.PRODUCT) {
                Core.Api.ItemAccessory.list({ type: 10 }).then((res) => {
                    if (res.list.length > 0) {
                        this.form.accessory_code = res.list[0].target_uid;
                        this.form.accessory_name = res.list[0].target_name;
                        this.form.accessory_name_en = res.list[0].target_name_en;

                        this.form.accessory_id = res.list[0].target_id;
                        this.form.accessory_amount = res.list[0].amount;
                    }
                });
            }
            this.loading = false;
        },
        setFormDartData(res){
            this.form = res.form;
            this.form.sales_area_ids = res.form.sales_area_ids.split(',').map((item) => Number(item));
            this.attrDef = res.attrDef;
            this.specData = res.specData;
            this.specific = res.specific;
            this.upload = res.upload;
            this.category_index = res.category_index;
            this.categoryMessage = res.categoryMessage;
           
        },
        // 获取商品规格列表
        setSpecificData(itemList) {
            this.loading = true;
            this.specific.mode = 2;
            Core.Api.AttrDef.listBySet({ set_id: this.set_id }).then((res) => {
                let list = res.list.map((item) => ({
                    id: item.id,
                    key: item.key,
                    name: item.name,
                    name_en: item.key,
                    flag_category: item.flag_category || 0,
                    option: item.value_en.split(",").map((it, index) => ({
                        key: it,
                        zh: item.value.split(",")[index],
                        en: it,
                        disabled: true,
                        desc: item.desc.split(",")[index] || "",
                        desc_en: item.desc_en.split(",")[index] || "",
                    })),
                    addValue: {
                        key: "",
                        zh: "",
                        en: "",
                    },
                    addVisible: false,
                }));
                itemList.shift(); // 删除默认的
                let categoryObj = list.filter((item) => item.flag_category === 1);
                this.category_index = categoryObj[0]?.id || null;
                this.categoryMessage = categoryObj[0]?.option || [];

                let data = itemList.map((item) => {
                    let params = {};
                    for (const attr of list) {
                        let element = item.attr_list.find((i) => i.attr_def_id === attr.id);
                        if (element != undefined) {
                            params[attr.key] = {
                                value: element.value,
                                value_en: element.value_en,
                            };
                        } else {
                            params[attr.key] = {
                                value: "",
                            };
                        }
                    }
                    let logos = !item.imgs ? [] : item.imgs.split(",");
                    item.imgsList = logos.map((imgItem, index) => ({
                        uid: index + 1,
                        name: imgItem,
                        filename: imgItem,
                        url: Core.Const.NET.FILE_URL_PREFIX + imgItem,
                        short_path: imgItem,
                        status: "done",
                    }));
                    return {
                        ...params,
                        code: item.code,
                        name: item.name,
                        name_en: item.name_en,
                        price: Core.Util.countFilter(item.price),
                        fob_eur: Core.Util.countFilter(item.fob_eur),
                        fob_20gp_eur: Core.Util.countFilter(item.fob_20gp_eur),
                        fob_40qh_eur: Core.Util.countFilter(item.fob_40qh_eur),
                        fob_usd: Core.Util.countFilter(item.fob_usd),
                        fob_20gp_usd: Core.Util.countFilter(item.fob_20gp_usd),
                        fob_40qh_usd: Core.Util.countFilter(item.fob_40qh_usd),
                        target_id: item.id,
                        attr_list: item.attr_list,
                        imgsList: item.imgsList,
                        imgs: item.imgs,
                    };
                });
                // 商品规格属性列表
                this.specific.list = list;
                // 多规格商品列表
                this.specific.data = data;
                this.labberData = data;
            });
        },
        handleDelete(record) {
            let _this = this;
            this.$confirm({
                title: `${_this.$t("i.pop_delete_tip")}${record.name}(${_this.$t("d.code")}:${record.code})?`,
                okText: _this.$t("def.sure"),
                okType: "danger",
                cancelText: this.$t("def.cancel"),
                onOk() {
                    if (_this.form.id) {
                        if (!record.target_id) {
                            // 判断在编辑的时候是否新添加信息
                            const index = _this.specific.data.findIndex((el) => el.id === record.id);

                            if (index !== -1) {
                                _this.specific.data.splice(index, 1);
                            }
                        } else {
                            // 编辑进来的(删除后端存的数据)
                            Core.Api.Item.delete({ id: record.target_id })
                                .then(() => {
                                    _this.$message.success(_this.$t("pop_up.delete_success"));
                                    _this.getItemDetail();
                                })
                                .catch((err) => {
                                    console.log("handleDelete err", err);
                                });
                        }
                    } else {
                        // 新增进来
                        const index = _this.specific.data.findIndex((el) => el.id === record.id);

                        if (index !== -1) {
                            _this.specific.data.splice(index, 1);
                        }
                    }
                },
            });
        },
        // 保存、新建 商品
        handleSubmit(type) {
            let form = Core.Util.deepCopy(this.form);
            let specData = Core.Util.deepCopy(this.specific.data);
            let attrDef = Core.Util.deepCopy(this.specific.list);
            let categoryMessage = Core.Util.deepCopy(this.categoryMessage);
            if(type !== 'draft'){
                // 校验检查
                this.isValidate = true;
                if (
                    typeof this.checkFormInput(form, specData, attrDef) ===
                    "function" 
                ) {
                    console.log("checkFormInput err");
                    return;
                }
            }
            
            // 封面上传
            if (this.upload.coverList.length || this.upload.coverList.length === 0) {
                let coverList = this.upload.coverList.map((item) => {
                    return item?.short_path || item?.response?.data?.filename;
                });
                // form.logo = coverList[0];
                form.logo = coverList.join(",");
            }
            // 详情页面上传
            if (this.upload.detailList.length || this.upload.detailList.length === 0) {
                let detailList = this.upload.detailList.map((item) => {
                    return item?.short_path || item?.response?.data?.filename;
                });
                form.imgs = detailList.join(",");
            }

            if (form.type != 1) {
                // 如果不是整车的时候传数据可以删除不必要的
                Core.Util.deleteParamsFilter(form, ["deposit", "color", "color_en", "net_weight", "gross_weight"]);
            }

            form.sales_area_ids = form.sales_area_ids.join(",");
            // form.man_hour = Math.round(form.man_hour * 100)
            form.config = JSON.stringify(form.config);

            let apiName = "save";

            if (this.specific.mode === 1 || this.indep_flag) {
                // 单规格
                apiName = this.indep_flag ? "update" : "save";
                form.price = Math.round(form.price * 100);
                form.fob_eur = Math.round(form.fob_eur * 100);
                form.fob_20gp_eur = Math.round(form.fob_20gp_eur * 100);
                form.fob_40qh_eur = Math.round(form.fob_40qh_eur * 100);
                form.fob_usd = Math.round(form.fob_usd * 100);
                form.fob_20gp_usd = Math.round(form.fob_20gp_usd * 100);
                form.fob_40qh_usd = Math.round(form.fob_40qh_usd * 100);
                // 隐藏成本价格
                // form.original_price = Math.round(form.original_price * 100);
            } else {
                // 多规格
                apiName = "batchSave";
                form.attr_ids = attrDef.map((i) => i.id).join(",");
                form.children = specData.map((data) => {
                    return {
                        id: data.target_id,
                        code: data.code,
                        name: data.name,
                        name_en: data.name_en,
                        price: Math.round(data.price * 100),
                        fob_eur: Math.round(data.fob_eur * 100),
                        fob_20gp_eur: Math.round(data.fob_20gp_eur * 100),
                        fob_40qh_eur: Math.round(data.fob_40qh_eur * 100),
                        fob_usd: Math.round(data.fob_usd * 100),
                        fob_20gp_usd: Math.round(data.fob_20gp_usd * 100),
                        fob_40qh_usd: Math.round(data.fob_40qh_usd * 100),
                        // 隐藏成本价格
                        /* original_price: Math.round(data.original_price * 100),
                        original_price_currency: data.original_price_currency, */
                        attr_params: attrDef.map((attr, index) => {
                            let id = "";
                            if (data.attr_list && data.attr_list.length) {
                                let _attr = data.attr_list.find((i) => i.attr_def_id === attr.id);
                                if (_attr) {
                                    id = _attr.id;
                                }
                            }
                            return {
                                attr_def_id: attr.id,
                                attr_def_name: attr.name,
                                id,
                                name: data[attr.key].value ? data[attr.key].value : data[attr.key],
                                value: data[attr.key].value ? data[attr.key].value : data[attr.key],
                                value_en: data[attr.key].value_en ? data[attr.key].value_en : data[attr.key],
                                target_id: data.target_id || "",
                                target_type: 1,
                            };
                        }),
                        imgs: data.imgsList.map((item) => item?.filename).join(","),
                    };
                });
            }
            if(type === 'draft'){
                // 草稿
                this.goodsDraftData = {
                    form,
                    attrDef,
                    specData,
                    specific: this.specific,
                    upload: this.upload,
                    category_index: this.category_index,
                    categoryMessage: this.categoryMessage,

                }
                Core.Data.setGoodsDraft(JSON.stringify(this.goodsDraftData));
                this.$message.success(this.$t("i.save_draft_success"));
                return
            }
            // 是整车并且为多规格
            if (form.type === this.itemTypeMap['1']?.key && this.specific.mode === 2) {
                this.handleDescripttion();
            }
            Core.Api.Item[apiName](Core.Util.searchFilter(form))
                .then(() => {
                    this.$message.success(this.$t("pop_up.save_success"));
                    Core.Data.clearGoodsDraft();
                    this.routerChange("back");
                })
                .catch((err) => {
                    console.log("handleSubmit err:", err);
                });
        },
        // 保存时检查表单输入
        checkFormInput(form, specData, attrDef) {
            // 如果是整车并且是多规格校验分类
            if (form.type === this.itemTypeMap['1']?.key && this.specific.mode === 2) {
                 if (this.isDesEmpty) {
                    return this.$message.warning(
                        `${this.$t("item-edit.please_complete")}(${this.$t("item-edit.category_description")})`
                    );
                }
            }
            // 名称
            if (!form.name) {
                return this.$message.warning(`${this.$t("def.enter")}(${this.$t("n.name")})`);
            }
            // 英文名
            if (!form.name_en) {
                return this.$message.warning(`${this.$t("def.enter")}(${this.$t("n.name_en")})`);
            }
            // 类型
            if (!form.type) {
                return this.$message.warning(`${this.$t("def.enter")}(${this.$t("n.type")})`);
            }
            // 商品编码
            if (!form.code) {
                return this.$message.warning(
                    `${this.$t("def.enter")}(${this.$t(this.specific.mode === 1 ? "i.sku_code" : "i.code")})`
                );
            }
            // 商品分类
            if (!form.category_ids.length) {
                return this.$message.warning(`${this.$t("def.enter")}(${this.$t("i.categories")})`);
            }
            // 销售区域
            if (!form.sales_area_ids.length) {
                return this.$message.warning(`${this.$t("def.enter")}(${this.$t("d.sales_area")})`);
            }
            // 封面图片
            if (
                (!this.upload.coverList || (this.upload.coverList && this.upload.coverList.length === 0)) &&
                this.form.type !== this.itemTypeMap["2"]?.key
            ) {
                return this.$message.warning(`${this.$t("def.enter")}(${this.$t("n.cover_pic")})`);
            }
            // 详情图片
            if (
                (!this.upload.detailList || (this.upload.detailList && this.upload.detailList.length === 0)) &&
                this.form.type !== this.itemTypeMap["2"]?.key
            ) {
                return this.$message.warning(`${this.$t("def.enter")}(${this.$t("n.detail_pic")})`);
            }
            // 如果为单规格不为整车 或者 从详情跳转过来的
            if ((this.specific.mode === 1 || this.indep_flag)&& form.type !== this.itemTypeMap['1']?.key ) {
                // 单规格
                if (!form.fob_eur) {
                    return this.$message.warning(`${this.$t("def.enter")}(FOB(EUR))`);
                }
                if (!form.fob_usd) {
                    return this.$message.warning(`${this.$t("def.enter")}(FOB(USD))`);
                }
            } 
            //单规格并且为整车
            else if((this.specific.mode === 1 && form.type === this.itemTypeMap['1']?.key)){
                if (!form.fob_eur) {
                    return this.$message.warning(`${this.$t("def.enter")}(FOB(EUR))`);
                }
                if(!form.fob_20gp_eur){
                    return this.$message.warning(`${this.$t("def.enter")}(FOB(20GP))`);
                }
                if(!form.fob_40qh_eur){
                    return this.$message.warning(`${this.$t("def.enter")}(FOB(40QH))`);
                }
                if (!form.fob_usd) {
                    return this.$message.warning(`${this.$t("def.enter")}(FOB(USD))`);
                }
                if(!form.fob_20gp_usd){
                    return this.$message.warning(`${this.$t("def.enter")}(FOB(20GP))`);
                }
                if(!form.fob_40qh_usd){
                    return this.$message.warning(`${this.$t("def.enter")}(FOB(40QH))`);
                }
            }
            else {
                // 多规格
                for (let i = 0; i < attrDef.length; i++) {
                    console.log('attrDef', attrDef);
                    const item = attrDef[i];
                    if (!item.name) {
                        return this.$message.warning(`${this.$t("def.enter")}(${this.$t("i.name")})`);
                    }
                    if (!item.key) {
                        return this.$message.warning(`${this.$t("def.enter")}(${this.$t("i.words")})`);
                    }
                    if (!item.option.length) {
                        return this.$message.warning(`${this.$t("def.enter")}`);
                    }
                }
                this.validateConfig(specData);
                // 规格信息 检查
                let attrs = [];
                // 多规格商品 检查
                if(!specData.length) {
                    return this.$message.warning(
                        `${this.$t("i.add_spec_tip")}`
                    );
                }
                for (let i = 0; i < specData.length; i++) {
                    const item = specData[i];
                    if (!item.imgsList?.[0]?.filename) {
                        return this.$message.warning(`${this.$t("n.spec_pic")}`);
                    }
                    if (!item.code) {
                        return this.$message.warning(`${this.$t("def.enter")}(${this.$t("i.code")})`);
                    }
                    // 名称
                    if (!item.name) {
                        return this.$message.warning(`${this.$t("def.enter")}(${this.$t("n.name")})`);
                    }
                    // 英文名
                    if (!item.name_en) {
                        return this.$message.warning(`${this.$t("def.enter")}(${this.$t("n.name_en")})`);
                    }
                    // 如果为整车
                    if(form.type === this.itemTypeMap['1']?.key){
                        if (!item.fob_eur) {
                            return this.$message.warning(`${this.$t("def.enter")}(FOB(EUR))`);
                        }
                        if(!item.fob_20gp_eur){
                            return this.$message.warning(`${this.$t("def.enter")}(FOB(20GP))`);
                        }
                        if(!item.fob_40qh_eur){
                            return this.$message.warning(`${this.$t("def.enter")}(FOB(40QH))`);
                        }
                        if (!item.fob_usd) {
                            return this.$message.warning(`${this.$t("def.enter")}(FOB(USD))`);
                        }
                        if(!item.fob_20gp_usd){
                            return this.$message.warning(`${this.$t("def.enter")}(FOB(20GP))`);
                        }
                        if(!item.fob_40qh_usd){
                            return this.$message.warning(`${this.$t("def.enter")}(FOB(40QH))`);
                        }
                    }else{
                        if (!item.fob_eur) {
                            return this.$message.warning(`${this.$t("def.enter")}(FOB(EUR))`);
                        }
                        if (!item.fob_usd) {
                            return this.$message.warning(`${this.$t("def.enter")}(FOB(USD))`);
                        }
                    }
                    let str = "";
                    for (let j = 0; j < this.specific.list.length; j++) {
                        const { name, key } = this.specific.list[j];
                        if (!item[key]) {
                            return this.$message.warning(this.$t("def.enter"));
                        }
                        str += item[key];
                    }
                }
                if (Core.Util.hasSameItem(specData.map((i) => i.code))) {
                    return this.$message.warning(this.$t("i.code_a"));
                }
                if (Core.Util.hasSameItem(attrs)) {
                    return this.$message.warning(this.$t("i.spec_a"));
                }
            }
            if (this.configTemp.length) {
                for (let i = 0; i < this.configTemp.length; i++) {
                    let item = this.configTemp[i];
                    if (item.required && !form.config[i].value) {
                        return this.$message.warning(
                            `${["select", "radio"].includes(item.type) ? this.$t("def.select") : this.$t("def.input")}${
                                item.name
                            }`
                        );
                    }
                }
            }
            return 0;
        },
        // 校验图片
        handleImgCheck(file, fileList) {
            const isCanUpType = ["image/jpeg", "image/png", "image/gif", "image/bmp"].includes(file.type);
            if (!isCanUpType) {
                this.$message.warning(this.$t("n.file_incorrect"));
            }
            const isLt10M = file.size / 1024 / 1024 < 10;
            if (!isLt10M) {
                this.$message.warning(this.$t("n.picture_smaller"));
            }
            return (isCanUpType && isLt10M) ||  Upload.LIST_IGNORE;
        },
        // 上传图片
        handleCoverChange({ file, fileList }) {
            if (fileList.length > 9) {
                fileList = fileList.slice(0, 9);
            }
            if (file.status == "done") {
                if (file.response && file.response.code > 0) {
                    return this.$message.error(file.response.message);
                }
            }
            fileList.forEach((item) => {
                if (item.response) {
                    item.url = Core.Const.NET.FILE_URL_PREFIX + item.response.data.filename;
                }
            });
            this.upload.coverList = fileList;
        },
        handleDetailChange({ file, fileList }) {
            if (fileList.length > 10) {
                fileList = fileList.slice(0, 10);
            }
            if (file.status == "done") {
                if (file.response && file.response.code > 0) {
                    return this.$message.error(file.response.message);
                }
            }
            fileList.forEach((item) => {
                if (item.response) {
                    item.url = Core.Const.NET.FILE_URL_PREFIX + item.response.data.filename;
                }
            });
            this.upload.detailList = fileList;
        },
        // 规格列表-上传图片检查
        handleNewChildChange({ file, fileList }) {
            if (fileList.length > 1) {
                fileList = fileList.slice(0, 1);
            }
            if (file.status == "done") {
                if (file.response && file.response.code > 0) {
                    return this.$message.error(file.response.message);
                }
            }
            fileList.forEach((item) => {
                if (item.response) {
                    item.url = Core.Const.NET.FILE_URL_PREFIX + item.response.data.filename;
                    item.filename = item.response.data.filename;
                }
            });
        },
        // 商品分类选择
        handleCategorySelect(val, node) {
            this.form.category_ids = val;
            this.item_category = node;
            try {
                this.configTemp = JSON.parse(node.config);
            } catch (error) {
                this.configTemp = [];
            }

            let _config = Core.Util.deepCopy(this.form.config);
            let config = [];
            for (let i = 0; i < this.configTemp.length; i++) {
                const item = this.configTemp[i];
                config.push({
                    name: item.name,
                    key: item.key,
                    type: item.type,
                    value: item.type === "select" ? undefined : "",
                });
            }
            for (let i = 0; i < config.length; i++) {
                const target = config[i];
                let _target = _config.find((item) => item.key === target.key);
                target.value = _target ? _target.value : "";
            }
            this.form.config = config;
        },
        // 商品规格模式改变
        handleSpecificModeChange() {
            if (this.specific.mode === 2 && this.specific.data && this.specific.data.length === 0) {
                this.specific.data = [
                    {
                        id: 1,
                        code: "",
                        name: "",
                        name_en: "",
                        price: "",
                        fob_eur: "",
                        fob_usd: "",
                        /* original_price: "",
                        original_price_currency: this.form.original_price_currency, */
                        imgsList: [],
                    },
                ];
            }
        },
        // 规格定义
        // 规格名
        handleAddSpec() {
            if (this.specific.list.length > 1) return this.$message.warning(this.$t("i.definition_more_num"));
            // 添加规格定义
            this.specific.list.push({
                id: "",
                name: "",
                key: "",
                option: [],
                flag_category: 0,
                addVisible: false,
                addValue: { key: "", zh: "", en: "" },
            });
        },
        handleRemoveSpec(item, index) {
            // 删除规格定义
            let _this = this;
            this.$confirm({
                title: `${_this.$t("i.pop_delete_spec")}${this.$i18n.locale === "en" ? ` ${item.key}` : item.name}?`,
                okText: _this.$t("def.sure"),
                okType: "danger",
                cancelText: this.$t("def.cancel"),
                onOk() {
                    let item = _this.specific.list[index];
                    if (item.id) {
                        Core.Api.AttrDef.delete({ id: item.id });
                    }
                    _this.specific.list.splice(index, 1);
                },
            });
        },
        handleSpecEditBlur(index, type) {
            this.specification.index = index;
            let item = this.specific.list[index];
            if (type === "specification_name") {
                if (!item.name) {
                    this.specification.isName = true;
                    return this.$message.warning(this.$t("def.specification_name"));
                } else {
                    this.specification.isName = false;
                }
                let names = this.specific.list.map((i) => i.name).filter((val, i) => val && i !== index);
                if (names.includes(item.name)) {
                    this.specific.list[index].name = "";
                    return this.$message.warning(this.$t("def.specification_be_unique"));
                }
            } else if (type === "words") {
                let reg = /^[A-Za-z\s!@#$%^&*()_+-=\[\]{};':"\\|,.<>\/?]+$/g;
                if (!item.key) {
                    this.specification.isWords = true;
                    return this.$message.warning(this.$t("def.specification_keyword"));
                } else {
                    this.specification.isWords = false;
                }
                if (!reg.test(item.key)) {
                    this.specific.list[index].key = "";
                    return this.$message.warning(this.$t("def.keyword_lowercase"));
                }
                let keys = this.specific.list.map((i) => i.key).filter((val, i) => val && i !== index);
                if (keys.includes(item.key)) {
                    this.specific.list[index].key = "";
                    return this.$message.warning(this.$t("def.keyword_unique"));
                }
            }
            if (item.key.trim() && item.name.trim()) {
                let value = "";
                let value_en = "";
                item.option.forEach((it) => {
                    value += it.zh + ",";
                    value_en += it.en + ",";
                });
                var reg = /,$/gi;
                value = value.replace(reg, "");
                value_en = value_en.replace(reg, "");
                let _item = {
                    id: item.id,
                    key: item.key,
                    name: item.name,
                    value: value,
                    value_en: value_en,
                    desc: item.desc || "",
                    desc_en: item.desc_en || "",
                };
                Core.Api.AttrDef.save(_item)
                    .then((res) => {
                        this.specific.list[index].id = res.detail.id;
                        this.perAddSpecItem(index);
                    })
                    .finally(() => {});
            }
        },
        handleDescripttion() {
            console.log("categoryMessage",this.categoryMessage);
            console.log("category_index",this.category_index);
            let item = this.specific.list.filter((i) => i.id === this.category_index)[0];
            item.option = _.cloneDeep(this.categoryMessage);
            if (item.key.trim() && item.name.trim()) {
                let value = "";
                let value_en = "";
                let desc = "";
                let desc_en = "";
                item.option.forEach((it) => {
                    value += it.zh + ",";
                    value_en += it.en + ",";
                    desc += it.desc + ",";
                    desc_en += it.desc_en + ",";
                });
                var reg = /,$/gi;
                value = value.replace(reg, "");
                value_en = value_en.replace(reg, "");

                let _item = {
                    id: item.id,
                    key: item.key,
                    name: item.name,
                    value: value,
                    value_en: value_en,
                    desc: desc,
                    desc_en: desc_en,
                    flag_category: 1,
                };
                console.log("_item-------------------------------", _item);
                Core.Api.AttrDef.save(_item).then((res) => {
                    let target = this.specific.list.filter((i) => i.id === this.category_index)[0];
                    target.id = res.detail.id;
                    this.perAddSpecItem(this.category_index);
                });
            }
        },
        // 规格值
        handleAddSpecOption(index) {
            let target = this.specific.list[index];
            // let isSame = 0;
            let empty = 0;
            target.option.forEach((item) => {
                if (!item.zh) {
                    empty = 1;
                    item.validate = true;
                    return this.$message.warning(this.$t("def.enter_specification_value"));
                }
                if (!item.en) {
                    empty = 1;
                    item.validate = true;
                    return this.$message.warning(this.$t("def.enter_specification_value_en"));
                }
            });
            // 空值校验
            if (empty !== 0) return;
            // 查重校验
            const zhArr = findDuplicates(target.option.map((item) => item.zh));
            const enArr = findDuplicates(target.option.map((item) => item.en));
            this.uniqueArr = Array.from(new Set(zhArr.concat(enArr)));
            if (this.uniqueArr.length > 0) {
                return this.$message.warning(this.$t("def.specification_value_repeated"));
            }
            this.closeConfig();
            if (target.id && target.key.trim() && target.name.trim()) {
                let value = "";
                let value_en = "";
                target.option.forEach((it) => {
                    value += it.zh + ",";
                    value_en += it.en + ",";
                });
                var reg = /,$/gi;
                value = value.replace(reg, "");
                value_en = value_en.replace(reg, "");
                let _item = {
                    id: target.id,
                    key: target.key,
                    name: target.name,
                    value: value,
                    value_en: value_en,
                };
                Core.Api.AttrDef.save(_item)
                    .then((res) => {
                        this.$message.success(this.$t("pop_up.save_success"));
                        this.perAddSpecItem(index);
                    })
                    .finally(() => {});
            }
        },
        // 规格值弹窗-移除规格值
        handleRemoveSpecOption(index, i) {
            let item = this.specific.list[index];
            let _do = function () {
                item.option.splice(i, 1);
                let value = "";
                let value_en = "";
                item.option.forEach((it) => {
                    value += it.zh + ",";
                    value_en += it.en + ",";
                });
                var reg = /,$/gi;
                value = value.replace(reg, "");
                value_en = value_en.replace(reg, "");
                if (item.id && item.key.trim() && item.name.trim()) {
                    let _item = {
                        id: item.id,
                        key: item.key,
                        name: item.name,
                        value: value,
                        value_en: value_en,
                    };
                    // Core.Api.AttrDef.save(_item);
                }
            };

            if (this.specific.data.map((i) => i[item.key]).includes(item.option[i])) {
                this.$confirm({
                    title: this.$t("def.specification_value_remove"),
                    okText: this.$t("def.ok"),
                    okType: "danger",
                    cancelText: this.$t("def.cancel"),
                    onOk: () => {
                        for (const element of this.specific.data) {
                            if (element[item.key] === item.option[i]) {
                                element[item.key] = undefined;
                            }
                        }
                        _do();
                    },
                });
            } else {
                _do();
            }
        },
        // 销售接口Fetch
        getSalesAreaList() {
            Core.Api.SalesArea.list({ page: 0 }).then((res) => {
                this.salesList = res.list;
            });
        },
        // 规格商品
        handleAddSpecItem() {
            // 添加商品规格
            let maxLen = 1;
            for (let i = 0; i < this.specific.list.length; i++) {
                const len = this.specific.list[i].option.length || 1;
                maxLen = maxLen * len;
            }
            this.specific.data.push({
                id: this.specific.data.length + 1,
                code: "",
                name: "",
                name_en: "",
                price: "",
                fob_eur: "",
                fob_usd: "",
                imgsList: [],
            });
        },
        // 排列组合添加商品
        perAddSpecItem(index) {
            let list = [],
                listData = [];
            let obj = {
                code: "",
                name: "",
                name_en: "",
                price: "",
                fob_eur: "",
                fob_20gp_eur: "",
                fob_40qh_eur: "",
                fob_usd: "",
                fob_20gp_usd: "",
                fob_40qh_usd: "",
                imgsList: [],
            };
            let dataList = []; //规格列表数组
            this.specific.list.map((item, index) => {
                list[index] = item.option.map((op, ind) => {
                    return {
                        key: item.key,
                        value: op.zh,
                        value_en: op.en,
                    };
                });
            });
            list = list.filter((subArray) => subArray.length !== 0);
            if (list.length === 0) {
                return;
            } else if (list.length === 1) {
                list[0].forEach((l1, indl1) => {
                    let l1Obj = Core.Util.deepCopy(obj);
                    let { value, value_en } = l1;
                    l1Obj[l1.key] = {
                        value,
                        value_en,
                    };

                    dataList.push({ ...l1Obj, id: dataList.length + 1 });
                });
            } else if (list.length === 2) {
                list[0].forEach((l1, indl1) => {
                    list[1].forEach((l2, indl2) => {
                        let l2Obj = Core.Util.deepCopy(obj);
                        l2Obj[l1.key] = {
                            value: l1.value,
                            value_en: l1.value_en,
                        };
                        l2Obj[l2.key] = {
                            value: l2.value,
                            value_en: l2.value_en,
                        };

                        dataList.push({ ...l2Obj, id: dataList.length + 1 });
                    });
                });
            }
            dataList.forEach((item,index)=>{
                item.name = `${this?.form?.name || ''} ${this?.keyArr[0] ? item[this.keyArr[0]].value : ''} ${this?.keyArr[1] ? item[this.keyArr[1]].value : ''}`
                item.name_en = `${this?.form?.name_en || ''} ${this?.keyArr[0] ? item[this.keyArr[0]].value_en : ''} ${this?.keyArr[1] ? item[this.keyArr[1]].value_en : ''}`
                this.specific.data.forEach((it,id) => {
                    if(id === index){
                        console.log('item',item);
                        // 遍历对象
                        for (let key in item) {
                            if(!item[key]){
                                item[key] = it[key];
                            }
                            // 图片
                            if(key === 'imgsList'){
                                item[key] = it[key];
                            }
                        }
                    }
                });
            })
            console.log("dataList", dataList);
            this.specific.data = Core.Util.deepCopy(dataList);
        },
        // 批量设置
        handleCloseBatchSet() {
            this.batchSet = {
                priceVisible: false,
                price: "",
                /* originalVisible: false,
                original_price: "", */
                fobEurVisible: false,
                fob_eur: "",
                fobUsdVisible: false,
                fob_usd: "",
            };
        },
        handleBatchSpec(key) {
            if (!this.batchSet[key] && this.batchSet[key] !== 0) {
                return this.$message.warning(this.$t("def.set_price"));
            }
            this.specific.data = this.specific.data.map((item) => {
                item[key] = this.batchSet[key];
                return item;
            });
            this.handleCloseBatchSet();
        },
        specChange(record, key, item) {
            record[key] = {
                value: item.zh,
                value_en: item.en,
            };
            record.name = `${this?.form?.name || ''} ${this?.keyArr[0] ? record[this.keyArr[0]].value : ''} ${this?.keyArr[1] ? record[this.keyArr[1]].value : ''} ${this?.keyArr[2] ? record[this.keyArr[2]].value : ''} ${this?.keyArr[3] ? record[this.keyArr[3]].value : ''} ${this?.keyArr[4] ? record[this.keyArr[4]].value : ''} ${this?.keyArr[5] ? record[this.keyArr[5]].value : ''} ${this?.keyArr[6] ? record[this.keyArr[6]].value : ''} ${this?.keyArr[7] ? record[this.keyArr[7]].value : ''} ${this?.keyArr[8] ? record[this.keyArr[8]].value : ''} ${this?.keyArr[9] ? record[this.keyArr[9]].value : ''} ${this?.keyArr[10] ? record[this.keyArr[10]].value : ''} ${this?.keyArr[11] ? record[this.keyArr[11]].value : ''} ${this?.keyArr[12] ? record[this.keyArr[12]].value : ''} ${this?.keyArr[13] ? record[this.keyArr[13]].value : ''} ${this?.keyArr[14] ? record[this.keyArr[14]].value : ''} ${this?.keyArr[15] ? record[this.keyArr[15]].value : ''} ${this?.keyArr[16] ? record[this.keyArr[16]].value : ''} ${this?.keyArr[17] ? record[this.keyArr[17]].value : ''} ${this?.keyArr[18] ? record[this.keyArr[18]].value : ''} ${this?.keyArr[19] ? record[this.keyArr[19]].value : ''}`
            record.name_en = `${this?.form?.name_en || ''} ${this?.keyArr[0] ? record[this.keyArr[0]].value_en : ''} ${this?.keyArr[1] ? record[this.keyArr[1]].value_en : ''} ${this?.keyArr[2] ? record[this.keyArr[2]].value_en : ''} ${this?.keyArr[3] ? record[this.keyArr[3]].value_en : ''} ${this?.keyArr[4] ? record[this.keyArr[4]].value_en : ''} ${this?.keyArr[5] ? record[this.keyArr[5]].value_en : ''} ${this?.keyArr[6] ? record[this.keyArr[6]].value_en : ''} ${this?.keyArr[7] ? record[this.keyArr[7]].value_en : ''} ${this?.keyArr[8] ? record[this.keyArr[8]].value_en : ''} ${this?.keyArr[9] ? record[this.keyArr[9]].value_en : ''} ${this?.keyArr[10] ? record[this.keyArr[10]].value_en : ''} ${this?.keyArr[11] ? record[this.keyArr[11]].value_en : ''} ${this?.keyArr[12] ? record[this.keyArr[12]].value_en : ''} ${this?.keyArr[13] ? record[this.keyArr[13]].value_en : ''} ${this?.keyArr[14] ? record[this.keyArr[14]].value_en : ''} ${this?.keyArr[15] ? record[this.keyArr[15]].value_en : ''} ${this?.keyArr[16] ? record[this.keyArr[16]].value_en : ''} ${this?.keyArr[17] ? record[this.keyArr[17]].value_en : ''} ${this?.keyArr[18] ? record[this.keyArr[18]].value_en : ''} ${this?.keyArr[19] ? record[this.keyArr[19]].value_en : ''}`
            let specData = Core.Util.deepCopy(this.specific.data);
            this.validateConfig(specData);
        },
        // 输入框校验 规格信息
        inputValidateConfig() {
                let specData = Core.Util.deepCopy(this.specific.data);
                this.validateConfig(specData);
        },
        // 规格信息 检查
        validateConfig(specData) {
            for (let i = 0; i < specData.length; i++) {
                const item = specData[i];
                if (!item.imgsList?.[0]?.filename) {
                    return (this.validateConfigFlag = false);
                }
                if (!item.code) {
                    return (this.validateConfigFlag = false);
                }
                // 名称
                if (!item.name) {
                    return (this.validateConfigFlag = false);
                }
                // 英文名
                if (!item.name_en) {
                    return (this.validateConfigFlag = false);
                }
                // if (!item.fob_eur) {
                //     return (this.validateConfigFlag = false);
                // }
                // if(!item.fob_20gp_eur){
                //     return (this.validateConfigFlag = false);
                // }
                // if(!item.fob_40qh_eur){
                //     return (this.validateConfigFlag = false);
                // }
                // if (!item.fob_usd) {
                //     return (this.validateConfigFlag = false);
                // }
                // if(!item.fob_20gp_usd){
                //     return (this.validateConfigFlag = false);
                // }
                // if(!item.fob_40qh_usd){
                //     return (this.validateConfigFlag = false);
                // }
                //如果是整车并且为多规格
                if(this.form.type === this.itemTypeMap['1']?.key && this.specific.mode === 2){
                    if (!item.fob_eur) {
                        return (this.validateConfigFlag = false);
                    }
                    if(!item.fob_20gp_eur){
                        return (this.validateConfigFlag = false);
                    }
                    if(!item.fob_40qh_eur){
                        return (this.validateConfigFlag = false);
                    }
                    if (!item.fob_usd) {
                        return (this.validateConfigFlag = false);
                    }
                    if(!item.fob_20gp_usd){
                        return (this.validateConfigFlag = false);
                    }
                    if(!item.fob_40qh_usd){
                        return (this.validateConfigFlag = false);
                    }
                }
                else{
                    if (!item.fob_eur) {
                        return (this.validateConfigFlag = false);
                    }
                    if (!item.fob_usd) {
                        return (this.validateConfigFlag = false);
                    }
                }
                let str = "";
                for (let j = 0; j < this.specific.list.length; j++) {
                    const { name, key } = this.specific.list[j];
                    if (!item[key]) {
                        return (this.validateConfigFlag = false);
                    }
                    str += item[key];
                }
            }
            return (this.validateConfigFlag = true);
        },
        // 打开规格值设置弹出
        openConfigSet(index, item) {
            this.configIndex = index;
            this.configSetMes = item;
            this.oldConfigSetMes = Core.Util.deepCopy(item);
            this.showConfigSet = true;
        },
        //关闭规格值设置弹出-回调
        handleCancelConfig() {
            this.specific.list[this.configIndex] = this.oldConfigSetMes;
            this.closeConfig();
        },
        //关闭规格值设置弹出
        closeConfig() {
            this.uniqueArr = [];
            this.showConfigSet = false;
        },
        //确认规格值弹窗
        handleComfirmConfig() {
            this.handleAddSpecOption(this.configIndex);
        },
        // 添加规格值
        addConfig() {
            let item = Core.Util.deepCopy({ key: "", zh: "", en: "", desc: "", desc_en: "", validate: false });
            this.specific.list[this.configIndex].option.push(item);
            this.$nextTick(() => {
                this.configScroll();
            });
        },
        // 滚动到底部
        configScroll() {
            const dom = document.querySelector(".config-list");
            const scrollHeight = dom.scrollHeight;
            dom.scrollTo(0, scrollHeight);
        },
    },
};
</script>

<style lang="less" scoped>
#ItemEdit {
    width: 100%;

    .image-preview {
        position: fixed;
        width: 100vw;
        height: 100vh;
        top: 0;
        left: 0;
        z-index: 998;
        background: rgba(0, 0, 0, 0.5);
        display: none;
    }
    .preview-wrap {
        display: flex;
        justify-content: center;
        align-items: center;
        img {
            min-width: 800px;
            max-width: 1400px;
        }
    }
    .error {
        color: @TC_required;
    }
    .title-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    .form-block {
        .form-content {
            .form-item {
                .value.input-number {
                    display: flex;
                    .ant-input-number {
                        width: 120px;
                    }
                    > span {
                        font-size: 10px;
                        color: #8090a6;
                        margin-left: 5px;
                        margin-top: 7px;
                    }
                    .ant-select {
                        margin-left: 10px;
                        width: 60px;
                    }
                }
            }
            .labber-item{
                align-items: flex-start;
            }
        }
    }
    .labber-form-block{
        padding: 20px;
        flex-direction: column;
        .form-title{
            width: 120px !important;
            text-align: left;
        }
        .labber-form-content{
            .key-title{
                display: flex;
                margin-left: 8px;
                margin-top: 16px;
                .title{
                    color: #1D2129;
                    font-size: 14px;
                }
                .labber{
                    margin-left:67px;
                }
                .value,.input-number{
                    margin-bottom:16px;
                    display: flex;
                    align-items: center;
                    .title{
                        color: #8090A6;
                        font-size: 12px;
                        line-height: 14px; /* 116.667% */
                        margin-right:8px;
                        width: 40px;
                        margin: 0 5px;
                        &::before {
                            content: "*";
                            color: @TC_required;
                            margin-right: 4px;
                            vertical-align: middle;
                        }
                    }
                    .tips{
                        margin-left: 5px;
                        color: #666;
                        font-size: 12px;
                    }
                    .error{
                        // 兄弟 ant-input-number-group-wrapper
                        & + .ant-input-number-group-wrapper {
                            :deep(.ant-input-number-wrapper){
                                .ant-input-number{
                                    border-color: @TC_required;
                                }
                            }

                        }

                    }

                }
              
            }
        }

    }
    .form-item.specific-config,
    .form-item.specific-category,
    .form-item.specific-category-select,
    .form-item.specific-items {
        align-items: flex-start;
        > .key {
            line-height: 32px;
            flex-shrink: 0;
        }
        > .value {
            max-width: none;
            flex-shrink: 0;
            .value-price {
                margin-right: 5px;
                width: 60px;
            }
        }
    }
    .form-item.specific-items {
        margin-top: 30px;
    }
    .form-item.specific-category {
        align-items: center;
        .value {
            display: flex;
            align-items: center;
            .ant-switch {
                margin-right: 4px;
            }
            .close,
            .open {
                font-size: 14px;
                color: #1d2129;
            }
        }
    }
    .specific-category-select {
        .value {
            width: calc(100% - 86px - 20px);
            .select-area {
                .ant-select {
                    width: 269px;
                }
                .tips {
                    // 红色
                    color: #ff4d4f;
                    margin-top: 5px;
                }
            }
            .item-rich-area {
                width: 100%;
                display: flex;
                margin-top: 17px;
                overflow-x: auto;
                // 滚动条
                &::-webkit-scrollbar {
                    height: 8px;
                    width: 8px;
                    &-thumb {
                        border-radius: 3px;
                        background-color: @scrollbar-thumb;
                        transition: background-color 0.3s;
                        &:hover {
                            background: @scrollbar-thumb-hover;
                        }
                    }
                    &-track {
                        /*滚动条内部轨道*/
                        background: @scrollbar-track;
                    }
                }
                .rich-item {
                    display: flex;
                    .rich-item-content {
                        margin-right: 16px;
                        width: 237px;
                        border: 1px solid #eaecf1;
                        border-radius: 4px;
                        overflow: hidden;
                        &:last-child{
                            margin-right: 0;
                        }
                        .rich-title {
                            height: 32px;
                            background-color: #f2f3f5;
                            color: #1d2129;
                            font-size: 14px;
                            padding: 6px 15px;
                            display: flex;
                            align-items: center;
                            &::before {
                                content: "";
                                display: block;
                                width: 2px;
                                height: 9px;
                                background-color: #0061ff;
                                margin-right: 3px;
                            }
                        }
                        .rich-item-area {
                            padding: 10px;
                            background-color: #fff;
                            display: flex;
                            flex-direction: column;
                            min-height: 186px;
                            width: 100%;
                            &:hover {
                                :deep(.ql-toolbar){
                                    border: 1px solid #0061FF;
                                    border-bottom: none;
                                }
                                :deep(.editor-area){
                                    border: 1px solid #0061FF;
                                    border-top: 1px solid #EAECF1;
                                }
                            }
                            :deep(.ql-toolbar.ql-snow) {
                                border-radius: 3px 3px 0px 0px;
                                background: #f2f3f5;
                                padding: 10px;
                                font-size: 12px;
                                display: flex;
                                justify-content: space-between;
                                border-color: #EAECF1 !important;
                                .ql-formats {
                                    &:nth-child(2) {
                                        margin-right: 0;
                                    }
                                    .ql-list,
                                    .ql-underline,
                                    .ql-italic,
                                    .ql-bold {
                                        padding: 0;
                                        width: auto;
                                        margin-right: 16px;
                                        height: 15px;
                                    }
                                    .ql-list {
                                        margin-right: 0;
                                    }
                                }
                                &::after {
                                    display: none;
                                }
                            }
                            :deep(.ql-container.ql-snow) {
                                border-radius: 0px 0px 3px 3px;
                                flex: 1;
                                border-color: #EAECF1 !important;
                                .ql-editor {
                                    padding: 10px;
                                    min-height: 143px;
                                    ul {
                                        padding-left: 0;
                                    }
                                    li {
                                        padding-left: 1em;
                                    }
                                    &::before {
                                        font-style: normal;
                                        color: #bfbfbf;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    .spec-item {
        display: flex;
        //   align-items: center;
        margin-bottom: 16px;
        
        .name,
        .option {
            > p {
                width: 4em;
                font-size: 12px;
                color: #000000;
                padding-left: 16px;
                box-sizing: content-box;
            }
            .ant-btn {
                font-size: 12px;
            }
        }
        .name {
            display: flex;
            justify-content: flex-start;
            align-items: flex-start;
            box-sizing: border-box;
            // height: 66px;
            padding: 10px;
            background: #ffffff;
            border: 1px solid #e2e2e2;
            border-radius: 1px;
            > .ant-input {
                width: 194px;
                margin-right: 8px;
            }
            > .ant-btn {
                font-size: 12px;
                // transition: opacity 0.3s ease;
                // visibility: hidden;
                // opacity: 0;
            }
            // &:hover > .ant-btn {
            //     visibility: visible;
            //     opacity: 1;
            // }
            .popover-button {
                margin: 0 8px;
                .tag-button {
                    height: auto;
                    padding: 2px 8px;
                    border-color: #e2e2e2;
                }
                > .ant-btn {
                    width: 336px;
                    .num-tag {
                        position: absolute;
                        right: 10px;
                        width: 20px;
                        height: 20px;
                        border-radius: 4px;
                        background: #f2f3f5;
                        display: inline-flex;
                        justify-content: center;
                        align-items: center;
                        float: right;
                        color: #1d2129;
                        font-family: PingFang SC;
                        font-size: 14px;
                    }
                }
            }
            .star {
                white-space: nowrap;
                margin-top: 5px;
            }
            .tag-body {
                display: flex;
                flex-wrap: wrap;
                width: 100%;
            }
            .tag-value {
                padding: 2px 10px;
                border-radius: 4px;
                background: #f2f3f5;
                font-size: 12px;
                color: #666666;
                margin: 2px 2px 2px 0;
                &:last-child {
                    margin-right: 0;
                }
            }
        }
        .button {
            margin-top: 6px;
            margin-left: 10px;
            display: flex;
            justify-content: center;
            align-items: center;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            border: 1px solid var(--BOS_, #e2e2e2);
            background: #fff;
            flex-shrink: 0; // 固定宽度
            cursor: pointer;
            &:hover {
                background-color: #eee;
            }
        }
        .option {
            display: flex;
            > p {
                padding-left: 34px;
                padding-right: 50px;
                min-height: 32px;
                line-height: 32px;
                margin-bottom: 8px;
            }
            .option-list {
                display: flex;
                flex-wrap: wrap;
                width: calc(~"100% - 64px - 4em");
            }
            .option-item {
                position: relative;
                margin-top: 8px;
                .option-input {
                    background-color: #fff;
                    color: #000;
                }
                .ant-input {
                    width: 90px;
                    margin-right: 14px;
                    text-align: center;
                    border: 1px solid #e5e8eb;
                    box-shadow: 0 0 0 0;
                    cursor: pointer;
                    // 双击禁止选中，出现蓝色背景
                    -webkit-user-select: none !important;
                    -moz-user-select: none !important;
                    -ms-user-select: none !important;
                    user-select: none !important;
                }
                .close {
                    position: absolute;
                    color: #c2c2c2;
                    display: inline-block;
                    width: 18px;
                    height: 18px;
                    line-height: 18px;
                    font-size: 18px;
                    top: -8px;
                    right: 6px;
                    visibility: hidden;
                    opacity: 0;
                }
                &:hover .close {
                    visibility: visible;
                    opacity: 1;
                }
            }
            .ant-btn {
                margin-top: 8px;
            }
        }
    }
    .spec-add {
        border-radius: 2px;
        background: #ffffff;
        font-size: 12px;
    }
    .spec-text {
        color: #969799;
        font-size: 12px;
        font-weight: 400;
        margin-left: 10px;
    }
    .specific-table {
        margin-bottom: 16px;
        margin-right: 20px;
        th {
            background-color: #fff;
            height: 60px;
            font-size: 14px;
        }
        td {
            height: 60px;
        }
        .ant-input-number,
        .ant-select:not(.ant-input-number + .ant-select) {
            width: 120px;
        }
        .code {
            min-width: 150px;
        }
        .ant-table-container .ant-table-content {
            &::-webkit-scrollbar {
                width: 2px;
                height: 6px;
                &-thumb {
                    border-radius: 6px;
                    background-color: rgba(0, 110, 249, 0.2);
                    &:hover {
                        background: rgba(0, 110, 249, 0.5);
                    }
                }
                &-track {
                    /*滚动条内部轨道*/
                    background: #f8fafc;
                }
            }
        }

        .spce-add-pic {
            width: auto !important;
            padding: 7px;
            border-radius: 4px;
        }

        :deep(.ant-upload-list) {
            display: none;
        }
        .ant-table-cell {
            .ladder-price {
                width: 100%;
                padding: 6px 45px;
                height: auto;
                color: #0061ff;
                font-size: 14px;
            }
            .show-ladder {
                display: flex;
                align-items: center;
                border: 1px solid #EAECF1;
                &:hover {
                    border: 1px solid rgba(0, 97, 255, 0.50);
                    border-radius: 4px;
                    .show-ladder-item{
                        background: rgba(0, 97, 255, 0.1);
                        margin: 4px !important;
                    }
                }
                .show-ladder-item {
                    align-items: center;
                    display: inline-flex;
                    height: 26px;
                    padding: 6px 8px;
                    justify-content: center;
                    align-items: center;
                    border-radius: 6px;
                    background: #f2f3f5;
                    margin: 4px;
                    font-size: 14px;
                    color: #1d2129;
                    cursor: pointer;
                    .show-ladder-item-title {
                        margin-right: 4px;
                    }
                }
            }
        }

        .imgList-box {
            .img-pic {
                width: 36px;
                height: 36px;
                border-radius: 4px;
                cursor: pointer;
                object-fit: cover;
            }

            .close-pic {
                width: 14px;
                height: 14px;
                flex-shrink: 0;
                cursor: pointer;
                margin-left: 8px;
            }
        }
    }
    .batch-set {
        width: 100%;
        margin: 20px 0;
        > .ant-btn {
            height: 20px;
            line-height: 20px;
            padding: 0;
            + .ant-btn {
                margin-left: 16px;
            }
        }
    }
}
.specific-option-edit-popover,
.batch-set-edit-popover {
    margin: 0 -4px;
    display: flex;
    .flex(flex-start,flex-end);
    .ant-input,
    .ant-input-number {
        width: 180px;
        margin-bottom: 8px;
    }
    .content-length {
        font-size: 10px;
        line-height: 14px;
        color: #8090a6;
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
    .batch-set-edit-popover-title {
        width: 100%;
        text-align: left;
        margin-bottom: 10px;
        font-size: 14px;
        color: #1d2129;
    }
}
.flex-style {
    display: flex;
    align-items: center;
}
.m-l-5 {
    margin-left: 5px;
}
.m-t-16 {
    margin-top: 16px;
}
.star {
    margin: 0 5px;
    &::before {
        content: "*";
        color: @TC_required;
        margin-right: 4px;
        vertical-align: middle;
    }
}

.border-red {
    border: 1px solid red !important;
}
.form-dispaly-key {
    width: auto !important;
    display: flex;
    align-items: center;
    white-space: nowrap !important;
    .i_hint {
        margin: 0 5px;
    }
}

.item-image-uploader .ant-upload-list-item-thumbnail {
    font-size: 0px;
}

.form-dispaly-key {
    width: auto !important;
    display: flex;
    align-items: center;
    white-space: nowrap !important;
    .i_hint {
        margin: 0 5px;
    }
}
.form-title {
    min-width: 120px !important;
    width: auto !important;
}
.form-content {
    width: 100% !important;
}

.l-w-h-style {
    color: #1d2129;
    font-family: PingFang SC;
    font-size: 12px;
    font-weight: 400;
}
:deep(.ant-input-wrapper) {
    .ant-input-group-addon:nth-of-type(1) {
        background-color: #fff;
    }
}
.not-white-space {
    white-space: nowrap;
}
.appearance-font {
    color: #1d2129 !important;
    font-family: PingFang SC;
    margin-top: 5px;
}
.not-aligin-item {
    align-items: initial;
}
.config-list {
    padding: 24px;
    height: 60vh;
    overflow-y: auto;
    .config-item {
        margin-bottom: 16px;
        &:nth-last-child(2) {
            margin-bottom: 0;
        }
        .config-item-title {
            display: flex;
            justify-content: space-between;
            background-color: #f2f3f5;
            padding: 4px 10px;
            .icon {
                cursor: pointer;
            }
        }
        .config-item-mes {
            display: flex;
            padding: 16px;
            border: 1px solid #e2e2e2;
            border-top: none;
            .config-item-zh,
            .config-item-en {
                flex: 1;
            }
            .config-item-zh-title,
            .config-item-en-title {
                display: flex;
                align-items: flex-end;
                justify-content: space-between;
                margin-bottom: 4px;
                .content-length {
                    font-size: 10px;
                    color: #8090a6;
                }
            }
            .config-item-zh {
                margin-right: 16px;
            }
        }
    }
    .fix-bottom {
        padding: 16px 0;
        position: sticky;
        bottom: -24px;
        background-color: #fff;
        .add-config-btn {
            color: #0061ff;
            border-radius: 4px;
            border: 1px dashed #0061ff;
            padding: 6px 10px;
            font-size: 14px;
            width: 100%;
            text-align: center;
            cursor: pointer;
            &:hover {
                opacity: 0.85;
            }
        }
    }
}
.i_delete {
    color: #0061ff;
}
.popover {
    min-width: 344px;
}
.popover-title {
    color: #1d2129;
    font-size: 16px;
    font-weight: 500;
    margin-bottom: 10px;
}
.popover-subtitle {
    display: flex;
    justify-content: space-between;
    margin-bottom: 4px;
    > span {
        flex: 1;
        color: #666;
        font-size: 12px;
    }
}
.popover-item {
    display: flex;
    justify-content: space-between;
    padding: 5px 11px;
    background-color: #f8f8f8;
    border-radius: 4px;
    margin-bottom: 4px;
    .popover-item-text {
        flex: 1;
        color: #333;
        font-size: 12px;
    }
}

::v-deep(.ant-upload-list-item-actions) {
    /* background-color: rgba(255, 255, 255, 0) !important;
    display: inline-block;
    width: 100%;
    height: 100%;
    opacity: 0.1 !important; */

    // background-color: green;
    width: 100%;
    height: 100%;
}
/* 上传图片样式-穿透 */
::v-deep(.ant-upload-list-item-info::before) {
    opacity: 0 !important;
}

::v-deep(.ant-upload-list-item-card-actions-btn) {
    position: absolute;
    right: 0;
    top: 0;
    box-sizing: border-box;
    padding: 0px !important;
    z-index: 10;
}

::v-deep(.ant-upload-list-item) {
    padding: 0px !important;
    border: 1px dashed #e2e2e2;
    background: #fff;
}

::v-deep(.anticon-eye) {
    position: absolute;
    width: 100% !important;
    height: 100%;
    left: -5px;
    opacity: 0;
    display: inline-block;
}
.upload-add {
    border: 2px solid #0061ff;
    width: 16px;
    height: 16px;
    padding: 3px;
}

.upload-close {
    width: 20px;
    height: 20px;
    margin-top: 4px;
}

.ant-input-group-wrapper {
    :deep(.ant-input-group-addon) {
        color: #8090A6;
        .l-w-h-style-unit{
            color: #8090A6;
        }
    }
}

.fixed-btns {
    position: fixed;
    bottom: 16px;
    width: 100%;
    box-sizing: border-box;
    background-color: #fff;
    padding: 20px 0px;
    display: flex;
    justify-content: center;
    z-index: 52;

    .ant-btn {
        width: auto;
        height: 32px;
        border-radius: 4px;
    }
    .bottom-box {
        background-color: #f0f2f5;
        width: 100%;
        height: 16px;
        position: absolute;
        bottom: -16px;
    }
}
</style>
<style lang="less">
.config-modal {
    .ant-modal-body {
        padding: 0;
    }
    .ant-modal-footer {
        text-align: center;
    }
}
</style>
