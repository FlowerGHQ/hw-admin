<template>
<div id="ItemEdit" class="edit-container">
    <a-spin :spinning="loading" class='loading-incontent' v-if="loading"></a-spin>
    <div class="title-container">
        <div class="title-area">{{ form.id ? $t('i.edit') : $t('i.save') }}</div>
    </div>
    <ItemHeader :detail='detail' v-if="indep_flag" :show-spec='true'/>
    <div class="form-block"> <!-- 基本信息 -->
        <div class="form-title">
            <div class="title">{{ $t('n.information') }}</div>
        </div>
        <div class="form-content">
            <div class="form-item required">
                <div class="key">{{ $t('n.name') }}</div>
                <div class="value">
                    <a-input v-model:value="form.name" :placeholder="$t('def.input')" :maxlength='50'/>
                </div>
            </div>
            <div class="form-item required">
                <div class="key">{{ $t('n.name_en') }}</div>
                <div class="value">
                    <a-input v-model:value="form.name_en" :placeholder="$t('def.input')" :maxlength='50'/>
                </div>
            </div>
            <div class="form-item required" v-if="!indep_flag">
                <div class="key">{{ $t('n.type') }}</div>
                <div class="value">
                    <a-radio-group v-model:value="form.type">
                        <a-radio class="type-item" v-for="item of itemTypeMap" :key="item.key" :value="item.key">{{ item[$i18n.locale] }}</a-radio>
                    </a-radio-group>
                </div>
            </div>
            <div class="form-item required" v-if="!indep_flag">
                <div class="key">{{ $t('n.flag_entity') }}</div>
                <div class="value">
                    <a-radio-group v-model:value="form.flag_entity">
                        <a-radio class="type-item" v-for="item of flagEntityMap" :key="item.key" :value="item.key">{{ item[$i18n.locale] }}</a-radio>
                    </a-radio-group>
                </div>
            </div>
            <div class="form-item required" v-if="!indep_flag">
                <div class="key">{{ $t('i.number') }}</div>
                <div class="value">
                    <a-input v-model:value="form.model" :placeholder="$t('def.input')"/>
                </div>
            </div>
            <div class="form-item required" v-if="specific.mode === 1 || indep_flag">
                <div class="key">{{ $t('i.code') }}</div>
                <div class="value">
                    <a-input v-model:value="form.code" :placeholder="$t('def.input')"/>
                </div>
            </div>
            <div class="form-item required">
                <div class="key">{{ $t('i.categories') }}</div>
                <div class="value">
                    <CategoryTreeSelectMultiple @change="handleCategorySelect"
                        :category='item_category' :category-id='form.category_ids' v-if="form.id !== ''"/>
                </div>
            </div>
            <div class="form-item required">
                <div class="key">{{ $t('i.hours') }}</div>
                <div class="value input-number">
                    <a-input-number v-model:value="form.man_hour" :min="0" :precision="2" placeholder="0.00"/>
                    <span>hour</span>
                </div>
            </div>
            <div class="form-item required">
                <div class="key">{{ $t('d.sales_area') }}</div>
                <div class="value">
                    <a-select v-model:value="form.sales_area_ids" mode="multiple" :placeholder="$t('def.select')">
                        <a-select-option v-for="(val,key) in salesList" :key="key" :value="val.id">{{ val.name }}</a-select-option>
                    </a-select>
                </div>
            </div>
            <div class="form-item required">
                <div class="key">{{ $t('d.drawing_code') }}</div>
                <div class="value">
                    <a-input v-model:value="form.drawing_code" :placeholder="$t('def.input')"/>
                </div>
            </div>
            <div class="form-item" v-if="form.type === Core.Const.ITEM.TYPE.PRODUCT">
                <div class="key">{{ $t('i.on_board_battery') }}</div>
                <div class="value" v-if="form.accessory_code === '' || form.accessory_code === undefined">{{form.accessory_code}}
                    <ItemSelect @select="handleAddItemShow" :radioMode="true" btn-class="select-item-btn" btnType='link'>
                        <i class="icon i_add"/> {{ $t('i.add') }}
                    </ItemSelect>
                </div>
                <div class="value" v-else>
                        {{form.accessory_code}} {{form.accessory_name}}
                        <ItemSelect @select="handleAddItemShow" :radioMode="true" btn-class="select-item-btn" btnType='link'>
                            <i class="icon i_edit"/> {{ $t('def.edit') }}
                        </ItemSelect>
                        <a-button type="link" @click="handleDeleteItem"><i class="icon i_delete"/>删除</a-button>
                </div>
            </div>
            <div class="form-item" v-if="form.type === Core.Const.ITEM.TYPE.PRODUCT">
                <div class="key">{{ $t('i.on_board_battery') }}{{ $t('i.amount') }}</div>
                <div class="value input-number" v-if="form.accessory_code !== '' && form.accessory_code !== undefined">
                    <a-input-number v-model:value="form.accessory_amount" :min="0" :precision="0" placeholder="0"/>
                    <span>{{ $t('i.pcs2') }}</span>
                </div>
            </div>
        </div>
    </div>
    <div class="form-block"> <!-- 图片信息 -->
        <div class="form-title">
            <div class="title">{{ $t('i.image') }}</div>
        </div>
        <div class="form-content">
            <div class="form-item img-upload">
                <div class="key">{{ $t('i.cover') }}</div>
                <div class="value">
                    <a-upload name="file" class="image-uploader"
                        list-type="picture-card" accept='image/*'
                        :file-list="upload.coverList" :action="upload.action"
                        :headers="upload.headers" :data='upload.data'
                        :before-upload="handleImgCheck"
                        @change="handleCoverChange">
                        <div class="image-inner" v-if="upload.coverList.length < 1">
                            <i class="icon i_upload"/>
                        </div>
                    </a-upload>
                    <div class="tip">{{ $t('n.size') }}：800*800px</div>
                </div>
            </div>
            <div class="form-item img-upload">
                <div class="key">{{ $t('i.picture') }}</div>
                <div class="value">
                    <a-upload name="file" class="image-uploader"
                        list-type="picture-card" accept='image/*'
                        :file-list="upload.detailList" :action="upload.action"
                        :headers="upload.headers" :data='upload.data'
                        :before-upload="handleImgCheck"
                        @change="handleDetailChange">
                        <div class="image-inner" v-if="upload.detailList.length < 10">
                            <i class="icon i_upload"/>
                        </div>
                    </a-upload>
                    <div class="tip">{{ $t('n.size') }}：800*800px</div>
                </div>
            </div>
        </div>
    </div>
    <div class="form-block" v-if="form.category_ids && configTemp.length"> <!-- 分类配置 -->
        <div class="form-title">
            <div class="title">{{ $t('i.configuration') }}</div>
        </div>
        <div class="form-content">
            <div v-for="(item, index) of configTemp" :key="index" :class="{'form-item':true, required: item.required, textarea: item.type === 'textarea', rich_text: item.type === 'rich_text'}">
                <div class="key">{{item.name}}</div>
                <div class="value">
                    <template v-if="item.type == 'input'">
                        <a-input :placeholder="$t('def.input') + ` ${item.name}`" v-model:value="form.config[index].value"/>
                    </template>
                    <template v-if="item.type == 'textarea'">
                        <a-textarea :placeholder="$t('def.input') + ` ${item.name}`" v-model:value="form.config[index].value" :auto-size="{ minRows: 4, maxRows: 6 }" :maxlength='500'/>
                        <span class="content-length">{{form.config[index].value.length}}/500</span>
                    </template>
                    <template v-if="item.type == 'select'">
                        <a-select :placeholder="$t('def.select') + ` ${item.name}`" v-model:value="form.config[index].value" show-search option-filter-prop="children">
                            <a-select-option v-for="(val,i) of item.select" :key="i" :value="val" >{{val}}</a-select-option>
                        </a-select>
                    </template>
                    <template v-if="item.type == 'radio'">
                        <a-radio-group v-model:value="form.config[index].value">
                            <a-radio v-for="(val,i) of item.select" :key="i" :value="val" >{{val}}</a-radio>
                        </a-radio-group>
                    </template>
                    <template v-if="item.type == 'rich_text'">
                        <a-textarea v-model="form.config[index].value"/>
                    </template>
                </div>
            </div>
        </div>
    </div>
    <div class="form-block" v-if="!indep_flag"> <!-- 规格信息 -->
        <div class="form-title">
            <div class="title">{{ $t('i.information') }}</div>
        </div>
        <div class="form-content">
            <div class="form-item">
                <div class="key">{{ $t('i.mode') }}</div>
                <div class="value">
                    <a-radio-group v-model:value="specific.mode" @change="handleSpecificModeChange">
                        <a-radio :value="1">{{ $t('i.single') }}</a-radio>
                        <a-radio :value="2">{{ $t('i.multiple') }}</a-radio>
                    </a-radio-group>
                </div>
            </div>
            <template v-if="specific.mode === 2">
            <div class="form-item specific-config">
                <div class="key">{{ $t('i.define') }}
                    <a-tooltip :title="$t('i.keyword')">
                        <i class="icon i_hint" style="font-size: 12px;"></i>
                    </a-tooltip>
                </div>
                <div class="value">
                    <div class="spec-item" v-for="(item,index) of specific.list" :key="index">
                        <div class="name">
                            <p>{{ $t('i.name') }}</p>
                            <a-input v-model:value="item.name" :placeholder="$t('def.input')" @blur="handleSpecEditBlur(index, 'name')"/>
                            <p>{{ $t('i.words') }}</p>
                            <a-input v-model:value="item.key" :placeholder="$t('def.input')" @blur="handleSpecEditBlur(index, 'key')"/>
                            <a-button type="link" v-if="!form.id" @click="handleRemoveSpec(index)">{{ $t('def.delete') }}</a-button>
                        </div>
                        <div class="option">
                            <p>{{ $t('i.value_zh') }}</p>
                            <div class="option-list">
                                <div class="option-item" v-for="(option, i) of item.option" :key="i">
                                    <a-input :value="option.zh" class="option-input" :placeholder="$t('def.input')" disabled/>
                                    <i class="close icon i_close_b" @click="handleRemoveSpecOption(index, i)"/>
                                </div>
                                <a-popover v-model:visible="item.addVisible" trigger="click" @visibleChange='(visible) => {!visible && handleCloseSpecOption(index)}'>
                                    <template #content>
                                        <div class="specific-option-edit-popover">
                                            <a-input v-model:value="item.addValue.zh" :placeholder="$t('def.input')+$t('i.value_zh')" :max-length='50' />
                                            <div class="content-length">{{item.addValue.zh.length}}/50</div>
                                            <a-input v-model:value="item.addValue.en" :placeholder="$t('def.input')+$t('i.value_en')" :max-length='50'/>
                                            <div class="content-length">{{item.addValue.en.length}}/50</div>
                                            <div class="btns">
                                                <a-button type="primary" ghost @click="handleCloseSpecOption(index)">{{ $t('def.cancel') }}</a-button>
                                                <a-button type="primary" @click="handleAddSpecOption(index)">{{ $t('def.sure') }}</a-button>
                                            </div>
                                        </div>
                                    </template>
                                    <a-button type="link"><i class="icon i_add"></i> {{ $t('i.addition') }}</a-button>
                                </a-popover>
                            </div>
                        </div>
                        <div class="option">
                            <p>{{ $t('i.value_en') }}</p>
                            <div class="option-list">
                                <div class="option-item" v-for="(option, i) of item.option" :key="i">
                                    <a-input :value="option.en" class="option-input" :placeholder="$t('def.input')" disabled/>
                                    <i class="close icon i_close_b" @click="handleRemoveSpecOption(index, i)"/>
                                </div>
                            </div>
                        </div>
                    </div>
                    <a-button class="spec-add" type="primary" ghost @click="handleAddSpec">{{ $t('i.definition') }}</a-button>
                </div>
            </div>
            <div class="form-item specific-items">
                <div class="key">{{ $t('i.message') }}</div>
                <div class="value table-container no-mg">
                    <a-table :columns="specificColumns" :data-source="specific.data" :scroll="{ x: true }"
                        :row-key="record => record.title"  :pagination='false' class="specific-table">
                        <template #bodyCell="{ column, record }">
                            <template v-if="column.dataIndex === 'code'">
                                <a-input class="code" v-model:value="record.code" :placeholder="$t('def.input')"/>
                            </template>
                            <template v-if="column.dataIndex === 'name'">
                                <a-input class="code" v-model:value="record.name" :placeholder="$t('def.input')"/>
                            </template>
                            <template v-if="column.dataIndex === 'name_en'">
                                <a-input class="code" v-model:value="record.name_en" :placeholder="$t('def.input')"/>
                            </template>
                            <template v-if="column.dataIndex === 'price'">
                                <a-input-number v-model:value="record.price" :min="0.01" :precision="2"
                                    :formatter="value => `€ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')" :parser="value => value.replace(/€\s?|(,*)/g, '')"/>
                            </template>
                            <div class="input-number-unit" v-if="column.dataIndex === 'original_price'">
                                <a-input-number v-model:value="record.original_price" :min="0.01" :precision="2"
                                    :formatter="value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')" :parser="value => value.replace(/€\s?|(,*)/g, '')" />
                                <a-select v-model:value="record.original_price_currency" placeholder="Unit">
                                    <a-select-option v-for="(val,key) in monetaryList" :key="key" :value="key">{{ val }}</a-select-option>
                                </a-select>
                            </div>
                            <template v-if="column.dataIndex === 'fob_eur'">
                                <a-input-number v-model:value="record.fob_eur" :min="0.01" :precision="2"
                                    :formatter="value => `€ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')" :parser="value => value.replace(/€\s?|(,*)/g, '')" />
                            </template>
                            <template v-if="column.dataIndex === 'fob_usd'">
                                <a-input-number v-model:value="record.fob_usd" :min="0.01" :precision="2"
                                    :formatter="value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')" :parser="value => value.replace(/\$\s?|(,*)/g, '')"/>
                            </template>
                            <template v-if="column.dataIndex === 'operation'">
                                <a-button type='link' danger @click="handleDelete(record.target_id)"><i class="icon i_delete"/>{{ $t('def.delete') }}</a-button>
                            </template>
                            <template v-if="column.key === 'select'">
                                <a-select v-model:value="record[column.dataIndex]" :placeholder="$t('def.select')">
                                    <a-select-option v-for="(val,index) of column.option" :key="index" :value="val.key"  @click="specChange(record, column.dataIndex, val)">{{ val[$i18n.locale] }}</a-select-option>
                                </a-select>
                            </template>
                        </template>
                    </a-table>
                    <div class="batch-set">
                       {{ $t('i.settings') }}：
                        <a-popover v-model:visible="batchSet.originalVisible" trigger="click" @visibleChange='(visible) => {!visible && handleCloseBatchSet()}'>
                            <template #content>
                                <div class="batch-set-edit-popover">
                                    <a-input-number v-model:value="batchSet.original_price" :placeholder="$t('def.input')" @keydown.enter="handleBatchSpec('original_price')" :min='0' :autofocus='true' :precision="2"/>
                                    <div class="btns">
                                        <a-button type="primary" ghost @click="handleCloseBatchSet">{{ $t('def.cancel') }}</a-button>
                                        <a-button type="primary" @click="handleBatchSpec('original_price')">{{ $t('def.sure') }}</a-button>
                                    </div>
                                </div>
                            </template>
                            <a-button type="link">{{ $t('i.cost_price') }}</a-button>
                        </a-popover>
                        <a-popover v-model:visible="batchSet.fobEurVisible" trigger="click" @visibleChange='(visible) => {!visible && handleCloseBatchSet()}'>
                            <template #content>
                                <div class="batch-set-edit-popover">
                                    <a-input-number v-model:value="batchSet.fob_eur" :placeholder="$t('def.input')" @keydown.enter="handleBatchSpec('fob_eur')" :min='0' :autofocus='true' :precision="2"/>
                                    <div class="btns">
                                        <a-button type="primary" ghost @click="handleCloseBatchSet">{{ $t('def.cancel') }}</a-button>
                                        <a-button type="primary" @click="handleBatchSpec('fob_eur')">{{ $t('def.sure') }}</a-button>
                                    </div>
                                </div>
                            </template>
                            <a-button type="link">FOB(EUR)</a-button>
                        </a-popover>
                        <a-popover v-model:visible="batchSet.fobUsdVisible" trigger="click" @visibleChange='(visible) => {!visible && handleCloseBatchSet()}'>
                            <template #content>
                                <div class="batch-set-edit-popover">
                                    <a-input-number v-model:value="batchSet.fob_usd" :placeholder="$t('def.input')" @keydown.enter="handleBatchSpec('fob_usd')" :min='0' :autofocus='true' :precision="2"/>
                                    <div class="btns">
                                        <a-button type="primary" ghost @click="handleCloseBatchSet">{{ $t('def.cancel') }}</a-button>
                                        <a-button type="primary" @click="handleBatchSpec('fob_usd')">{{ $t('def.sure') }}</a-button>
                                    </div>
                                </div>
                            </template>
                            <a-button type="link">FOB(USD)</a-button>
                        </a-popover>
                        <!-- <a-popover v-model:visible="batchSet.priceVisible" trigger="click" @visibleChange='(visible) => {!visible && handleCloseBatchSet()}'>
                            <template #content>
                                <div class="batch-set-edit-popover">
                                    <a-input-number v-model:value="batchSet.price" placeholder="请输入建议零售价" @keydown.enter="handleBatchSpec('price')" :min='0' :autofocus='true' :precision="2"/>
                                    <div class="btns">
                                        <a-button type="primary" ghost @click="handleCloseBatchSet">取消</a-button>
                                        <a-button type="primary" @click="handleBatchSpec('price')">确定</a-button>
                                    </div>
                                </div>
                            </template>
                            <a-button type="link">建议零售价</a-button>
                        </a-popover> -->
                    </div>
                    <a-button class="spec-add" type="primary" ghost @click="handleAddSpecItem"><i class="icon i_add"/>{{ $t('i.add_specs') }}</a-button>
                </div>
            </div>
            </template>
        </div>
    </div>
    <div class="form-block" v-if="specific.mode === 1 || indep_flag"> <!-- 单规格时的 价格信息 -->
        <div class="form-title">
            <div class="title">{{ $t('i.price_information') }}</div>
        </div>
        <div class="form-content">
            <div class="form-item">
                <div class="key">{{ $t('i.cost_price') }}</div>
                <div class="value input-number-unit">
                    <a-input-number v-model:value="form.original_price" :min="0" :precision="2" placeholder="0.00"/>
                    <a-select v-model:value="form.original_price_currency">
                        <a-select-option v-for="(val,key) in monetaryList" :key="key" :value="key">{{ val }}</a-select-option>
                    </a-select>
                </div>
            </div>
            <!-- <div class="form-item">
                <div class="key">建议零售价</div>
                <div class="value input-number">
                    <a-input-number v-model:value="form.price" :min="0" :precision="2" placeholder="0.00"/>
                    <span>€</span>
                </div>
            </div> -->
            <div class="form-item required">
                <div class="key">FOB(EUR)</div>
                <div class="value input-number">
                    <a-input-number v-model:value="form.fob_eur" :min="0" :precision="2" placeholder="0.00"/>
                    <span>€</span>
                </div>
            </div>
            <div class="form-item required">
                <div class="key">FOB(USD)</div>
                <div class="value input-number">
                    <a-input-number v-model:value="form.fob_usd" :min="0" :precision="2" placeholder="0.00"/>
                    <span>$</span>
                </div>
            </div>
        </div>
    </div>
    <div class="form-btns">
        <a-button type="primary" @click="handleSubmit">{{ $t('def.sure') }}</a-button>
        <a-button type="primary" ghost @click="routerChange('back')">{{ $t('def.cancel') }}</a-button>
    </div>
</div>
</template>

<script>
import Core from '../../core';
import CategoryTreeSelectMultiple from '@/components/popup-btn/CategoryTreeSelectMultiple.vue'
import ItemHeader from './components/ItemHeader.vue'
import ItemSelect from '@/components/popup-btn/ItemSelect.vue';

// import VueTinymce from '@jsdawn/vue3-tinymce';

export default {
    name: 'ItemEdit',
    components: {
        CategoryTreeSelectMultiple,
        ItemHeader,
        ItemSelect,
        // VueTinymce,
    },
    props: {},
    data() {
        return {
            Core,
            loginType: Core.Data.getLoginType(),
            // 加载
            loading: false,
            itemTypeMap: Core.Const.ITEM.TYPE_MAP,
            flagEntityMap: Core.Const.ITEM.FLAG_ENTITY_MAP,
            indep_flag: 0,
            monetaryList: Core.Const.ITEM.MONETARY_TYPE_MAP,
            set_id: '',
            detail: {},
            form: {
                id: '',
                name: '',
                name_en: '',
                type:'',
                code: '',
                model: '',
                logo: '',
                imgs: '',
                flag_entity: undefined,
                category_ids: [],
                price: undefined,
                original_price_currency: undefined,
                original_price: undefined,
                config: '',
                man_hour: '',
                sales_area_ids: undefined,
                drawing_code: "",
                fob_eur: '',
                fob_usd: '',
                accessory_id:'',
                accessory_name:'',
                accessory_name_en:'',
                accessory_code:'',
                accessory_amount: '',
            },
            salesList: [],
            // 商品分类
            item_category: {},
            configTemp: [],

            specific: { // 规格
                mode: 1,
                list: [], // [{id: '', name: '', key: '', option: [], addVisible: false, addValue: ''}]
                data: [], // [{code: '', price: '', original_price: [], ……, attr_list}]
            },
            batchSet: { // 批量设置
                priceVisible: false,
                price: '',

                originalVisible: false,
                original_price: '',

                fobEurVisible: false,
                fob_eur: '',

                fobUsdVisible: false,
                fob_usd: '',
            },

            upload: { // 上传图片
                action: Core.Const.NET.FILE_UPLOAD_END_POINT,
                coverList: [],
                detailList: [],
                headers: {
                    ContentType: false
                },
                data: {
                    token: Core.Data.getToken(),
                    type: 'img',
                },
            },
            tinymce_setting: { // 富文本
                menubar: false,  // 隐藏菜单栏
                branding: false, // 隐藏右下角技术支持

                toolbar: ' fontsizeselect forecolor backcolor | bold italic underline strikethrough | formatselect alignleft aligncenter alignright alignjustify | numlist bullist | indent outdent | superscript subscript | removeformat | fullscreen',
                // toolbar: 'undo redo | fullscreen | formatselect alignleft aligncenter alignright alignjustify | link unlink | numlist bullist | image media table | fontsizeselect forecolor backcolor | bold italic underline strikethrough | indent outdent | superscript subscript | removeformat |',
                toolbar_mode: 'sliding',

                // quickbars_selection_toolbar:
                // 'removeformat | bold italic underline strikethrough | fontsizeselect forecolor backcolor',
                // plugins: 'link image media table lists fullscreen quickbars',

                fontsize_formats: '12px 14px 16px 18px',
                default_link_target: '_blank',
                link_title: false,
                nonbreaking_force_tab: true,
                // 设置中文语言
                language: 'zh_CN',
                language_url: '/ext/tinymce_zh_CN.js',
                content_style: 'body{font-size: 14px}'
            },
        };
    },
    watch: {},
    computed: {
        specificColumns() {
            let column = []
            column = this.specific.list.map((item, index) => ({
                id: item.id,
                title: this.$i18n.locale === 'zh'? item.name: item.key ,
                dataIndex: item.key,
                key: 'select',
                option: item.option,
                minWidth: '150px',
            }))
            column = column.filter(item => item.title && item.dataIndex)
            column.unshift(
                {title: this.$t('i.code'), key: 'input', dataIndex: 'code', fixed: 'left'},
                {title: this.$t('n.name'), key: 'input', dataIndex: 'name'},
                {title: this.$t('n.name_en'), key: 'input', dataIndex: 'name_en'},
            )
            column.push(
                {title: this.$t('i.cost_price'), key: 'money', dataIndex: 'original_price'},
                {title: 'FOB(EUR)', key: 'money', dataIndex: 'fob_eur', fixed: 'right', unit: '€'},
                {title: 'FOB(USD)', key: 'money', dataIndex: 'fob_usd', fixed: 'right', unit: '$'},
                {title: this.$t('n.operation'), key: 'operation', dataIndex: 'operation', fixed: 'right'},
                // {title: '建议零售价', key: 'money', dataIndex: 'price', fixed: 'right'},
            )
            return column
        }
    },
    created() {
        this.form.id = Number(this.$route.query.id) || 0
        this.set_id = Number(this.$route.query.set_id) || 0
        this.indep_flag = Number(this.$route.query.indep_flag) || 0
        if (this.form.id) {
            this.getItemDetail();
        }
        this.getSalesAreaList();
        console.log('getSalesAreaList')
    },
    mounted() {},
    methods: {
        routerChange(type, item) {
            let routeUrl
            switch (type) {
                case 'back':
                    this.$router.go(-1)
                    break;
                case 'detail':  // 详情
                    routeUrl = this.$router.resolve({
                        path: "/item/item-detail",
                        query: {id: item.id}
                    })
                    window.open(routeUrl.href, '_self')
                    break;
            }
        },
        // 获取商品详情
        getItemDetail() {
            this.loading = true;
            if (this.set_id && !this.indep_flag) {
                console.log('多规格商品:')
                // 多规格商品
                Core.Api.Item.listBySet({set_id: this.set_id}).then(res => {
                    console.log('getItemGroup res', res)
                    let list = res.list
                    let mainItem = list.find(i => i.flag_default === 1)
                    console.log('getItemGroup mainItem', mainItem)
                    this.setFormData(mainItem)
                    this.setSpecificData(list)
                }).catch(err => {
                    console.log('getItemGroup err', err)
                }).finally(() => {
                    this.loading = false;
                });
            } else {
                console.log('单规格商品 或 开启信息个性化的多规格商品')
                // 单规格商品
                Core.Api.Item.detail({
                    id: this.form.id,
                }).then(res => {
                    console.log('getItemDetail res', res)
                    this.setFormData(res.detail)
                }).catch(err => {
                    console.log('getItemDetail err', err)
                }).finally(() => {
                    this.loading = false;
                });
            }
        },

        setFormData(res) {
            this.loading = true
            this.detail = res
            let config = []
            let _config = []
            this.item_category = res.category
            try { this.configTemp = JSON.parse(res.category.config) } catch (err) { this.configTemp = [] }
            try { _config = JSON.parse(res.config) } catch (err) { _config = [] }
            for (let i = 0; i < this.configTemp.length; i++) {
                const item = this.configTemp[i];
                config.push({
                    name: item.name,
                    key: item.key,
                    value: item.type === 'select' ? undefined : '',
                    type: item.type
                })
            }
            for (let i = 0; i < config.length; i++) {
                const target = config[i];
                let _target = _config.find(item => item.key === target.key)
                target.value = _target ? _target.value : ''
            }

            for (const key in this.form) {
                this.form[key] = res[key]
            }
            console.log('setFormData config:', config)
            this.form.config = config
            this.form.type = res.type
            console.log('type',res.type)
            this.form.price = Core.Util.countFilter(res.price)
            this.form.fob_eur = Core.Util.countFilter(res.fob_eur)
            this.form.fob_usd = Core.Util.countFilter(res.fob_usd)
            this.form.man_hour = Core.Util.countFilter(res.man_hour)
            this.form.category_ids = this.detail.category_list ? this.detail.category_list.map(i => i.category_id): []
            // this.form.type = JSON.stringify(res.type)
            this.form.original_price = Core.Util.countFilter(res.original_price)
            this.form.sales_area_ids = this.detail.sales_area_list ? this.detail.sales_area_list.map(i => i.id): []
            this.form.drawing_code = res.drawing_code
            if (this.form.logo) {
                let logos = this.form.logo.split(',')
                this.upload.coverList = logos.map((item, index) => ({
                    uid: index + 1,
                    name: item,
                    url: Core.Const.NET.FILE_URL_PREFIX + item,
                    short_path: item,
                    status: 'done',
                }))
            }
            if (this.form.imgs) {
                let imgs = this.form.imgs.split(',')
                this.upload.detailList = imgs.map((item, index) => ({
                    uid: index + 1,
                    name: item,
                    url: Core.Const.NET.FILE_URL_PREFIX + item,
                    short_path: item,
                    status: 'done',
                }))
            }

            if (this.form.type === Core.Const.ITEM.TYPE.PRODUCT){
                Core.Api.ItemAccessory.list({type: 10}).then(res => {

                    if (res.list.length > 0){
                        this.form.accessory_code = res.list[0].target_uid
                        this.form.accessory_name = res.list[0].target_name
                        this.form.accessory_name_en = res.list[0].target_name_en

                        this.form.accessory_id = res.list[0].target_id
                        this.form.accessory_amount = res.list[0].amount
                    }
                })

            }
            this.loading = false

        },
        setSpecificData(itemList) {
            this.loading = true
            this.specific.mode = 2
            Core.Api.AttrDef.listBySet({set_id: this.set_id}).then(res => {
                let list = res.list.map(item => ({
                    id: item.id,
                    key: item.key,
                    name: item.name,
                    option: item.value_en.split(',').map((it, index) =>({
                            key: it,
                            zh: item.value.split(',')[index],
                            en: it,
                        })),
                    addValue:{
                        key: '',
                        zh: '',
                        en: '',
                    },
                    addVisible: false,
                }))
                console.log('setSpecificData list:', list)
                let data = itemList.map(item => {
                    let params = {}
                    for (const attr of list) {
                        let element = item.attr_list.find(i => i.attr_def_id === attr.id)
                        console.log(item)
                        // console.log(element.value)
                        // params[attr.key] = element.value
                        if (element != undefined){
                            params[attr.key] = {
                                value:element.value,
                                value_en:element.value_en
                            }
                        } else {
                            params[attr.key] = {
                                value:'',
                            }
                        }
                    }
                    return {
                        ...params,
                        code: item.code,
                        name: item.name,
                        name_en: item.name_en,
                        price: Core.Util.countFilter(item.price),
                        fob_eur: Core.Util.countFilter(item.fob_eur),
                        fob_usd: Core.Util.countFilter(item.fob_usd),
                        original_price_currency: item.original_price_currency,
                        original_price: Core.Util.countFilter(item.original_price),
                        target_id: item.id,
                        attr_list: item.attr_list,
                    }
                })
                console.log('setSpecificData data:', data)
                this.specific.list = list
                this.specific.data = data
            })
        },
        handleDelete(id){
            let _this = this;
            this.$confirm({
                title: _this.$t('pop_up.sure_delete'),
                okText: _this.$t('def.sure'),
                okType: 'danger',
                cancelText: this.$t('def.cancel'),
                onOk() {
                    Core.Api.Item.delete({id}).then(() => {
                        _this.$message.success(_this.$t('pop_up.delete_success'));
                        _this.getItemDetail();
                    }).catch(err => {
                        console.log("handleDelete err", err);
                    })
                },
            });
        },
        // 保存、新建 商品
        handleSubmit() {
            let form = Core.Util.deepCopy(this.form)
            let specData = Core.Util.deepCopy(this.specific.data)
            let attrDef = Core.Util.deepCopy(this.specific.list)
            console.log('form:', form)
            if (typeof this.checkFormInput(form, specData, attrDef) === 'function') { return }
            if (this.upload.coverList.length) {
                let coverList = this.upload.coverList.map(item => {
                    return item.short_path || item.response.data.filename
                })
                form.logo = coverList[0]
            }
            if (this.upload.detailList.length) {
                let detailList = this.upload.detailList.map(item => {
                    return item.short_path || item.response.data.filename
                })
                form.imgs = detailList.join(',')
            }
            form.sales_area_ids = form.sales_area_ids.join(',')
            form.man_hour = Math.round(form.man_hour * 100)
            form.config = JSON.stringify(form.config)
            let apiName = 'save'
            if (this.specific.mode === 1 || this.indep_flag) { // 单规格
                apiName = this.indep_flag ? 'update' : 'save'
                form.price = Math.round(form.price * 100)
                form.fob_eur = Math.round(form.fob_eur * 100)
                form.fob_usd = Math.round(form.fob_usd * 100)
                form.original_price = Math.round(form.original_price * 100)
            } else { // 多规格
                apiName = 'batchSave'
                form.attr_ids = attrDef.map(i => i.id).join(',')
                form.children = specData.map(data => {
                    return {
                        id: data.target_id,
                        code: data.code,
                        name: data.name,
                        name_en: data.name_en,
                        price: Math.round(data.price * 100),
                        fob_eur: Math.round(data.fob_eur * 100),
                        fob_usd: Math.round(data.fob_usd * 100),
                        original_price: Math.round(data.original_price * 100),
                        original_price_currency: data.original_price_currency,
                        attr_params: attrDef.map((attr,index) => {
                            let id = ''
                            if (data.attr_list && data.attr_list.length) {
                                let _attr = data.attr_list.find(i => i.attr_def_id === attr.id)
                                if (_attr) {
                                    id = _attr.id
                                }
                            }
                            return {
                                attr_def_id: attr.id,
                                attr_def_name: attr.name,
                                id,
                                name: data[attr.key].value ? data[attr.key].value: data[attr.key],
                                value: data[attr.key].value ? data[attr.key].value: data[attr.key],
                                value_en: data[attr.key].value_en ? data[attr.key].value_en: data[attr.key],
                                target_id: data.target_id || '',
                                target_type: 1,
                            }
                        }),
                    }
                })
            }
            console.log('handleSubmit form:', form)
            Core.Api.Item[apiName](form).then(() => {
                this.$message.success(this.$t('pop_up.save_success'))
                this.routerChange('back')
            }).catch(err => {
                console.log('handleSubmit err:', err)
            })
        },
        // 保存时检查表单输入
        checkFormInput(form, specData, attrDef) {
            if (!form.name) {
                return this.$message.warning(this.$t('def.enter'))
            }
            if (!form.type) {
                return this.$message.warning(this.$t('def.enter'))
            }
            if (!form.model) {
                return this.$message.warning(this.$t('def.enter'))
            }
            if (!form.category_ids) {
                return this.$message.warning(this.$t('def.enter'))
            }
           /* if (!form.man_hour) {
                return this.$message.warning('请输入工时')
            }*/
            if (!form.sales_area_ids) {
                return this.$message.warning(this.$t('def.enter'))
            }
            if (!form.drawing_code) {
                return this.$message.warning(this.$t('def.enter'))
            }
            if (this.specific.mode === 1 || this.indep_flag) { // 单规格
                if (!form.code) {
                    return this.$message.warning(this.$t('def.enter'))
                }
                /* if (!form.price) {
                    return this.$message.warning('请输入商品建议零售价')
                }
                if (!form.original_price) {
                    return this.$message.warning('请输入商品成本价格')
                }
                if (form.original_price > form.price) {
                    return this.$message.warning('商品成本价格应小于商品建议零售价')
                } */
                if (!form.fob_eur) {
                    return this.$message.warning(this.$t('def.enter'))
                }
                if (!form.fob_usd) {
                    return this.$message.warning(this.$t('def.enter'))
                }
            } else { // 多规格
                // 规格定义 检查
                for (let i = 0; i < attrDef.length; i++) {
                    const item = attrDef[i];
                    if (!item.name) {
                        return this.$message.warning(this.$t('def.enter'))
                    }
                    if (!item.key) {
                        return this.$message.warning(this.$t('def.enter'))
                    }
                    if (!item.option.length) {
                        return this.$message.warning(this.$t('def.enter'))
                    }
                }
                // 规格信息 检查
                let attrs = []
                for (let i = 0; i < specData.length; i++) {
                    const item = specData[i];
                    if (!item.code) {
                        return this.$message.warning(this.$t('def.enter'))
                    }
                    /* if (!item.price) {
                        return this.$message.warning('请输入商品建议零售价')
                    }
                    if (!item.original_price) {
                        return this.$message.warning('请输入商品成本价格')
                    }
                    if (item.original_price > item.price) {
                        return this.$message.warning('商品成本价格应小于商品建议零售价')
                    } */
                    if (!item.fob_eur) {
                        return this.$message.warning(this.$t('def.enter'))
                    }
                    if (!item.fob_usd) {
                        return this.$message.warning(this.$t('def.enter'))
                    }
                    let str = ''
                    for (let j = 0; j < this.specific.list.length; j++) {
                        const {name, key} = this.specific.list[j];
                        if (!item[key]) {
                            return this.$message.warning(this.$t('def.enter'))
                        }
                        str += item[key]
                    }
                }
                if (Core.Util.hasSameItem(specData.map(i => i.code))) {
                    return this.$message.warning(this.$t('i.code_a'))
                }
                if (Core.Util.hasSameItem(attrs)) {
                    return this.$message.warning(this.$t('i.spec_a'))
                }
                console.log('attrs:', attrs)
            }
            if (this.configTemp.length) {
                for (let i = 0; i < this.configTemp.length; i++) {
                    let item = this.configTemp[i]
                    if (item.required && !form.config[i].value) {
                        return this.$message.warning(`${['select','radio'].includes(item.type) ? this.$t('def.select') : this.$t('def.input')}${item.name}`)
                    }
                }
            }
            return 0
        },

        // 校验图片
        handleImgCheck(file) {
            const isCanUpType = ['image/jpeg', 'image/png', 'image/gif', 'image/bmp'].includes(file.type)
            if (!isCanUpType) {
                this.$message.warning(this.$t('n.file_incorrect'));
            }
            const isLt10M = (file.size / 1024 / 1024) < 10;
            if (!isLt10M) {
                this.$message.warning(this.$t('n.picture_smaller'));
            }
            return isCanUpType && isLt10M;
        },
        // 上传图片
        handleCoverChange({ file, fileList }) {
            console.log("handleCoverChange status:", file.status, "file:", file)
            if (file.status == 'done') {
                if (file.response && file.response.code > 0) {
                    return this.$message.error(file.response.message)
                }
            }
            this.upload.coverList = fileList
        },
        handleDetailChange({ file, fileList }) {
            console.log("handleDetailChange status:", file.status, "file:", file)
            if (file.status == 'done') {
                if (file.response && file.response.code > 0) {
                    return this.$message.error(file.response.message)
                }
            }
            this.upload.detailList = fileList
        },

        // 商品分类选择
        handleCategorySelect(val, node) {
            this.form.category_ids = val
            this.item_category = node
            try {
                this.configTemp = JSON.parse(node.config)
                console.log('this.configTemp:', this.configTemp)
            } catch (error) {
                this.configTemp = []
            }

            let _config = Core.Util.deepCopy(this.form.config)
            let config = []
            for (let i = 0; i < this.configTemp.length; i++) {
                const item = this.configTemp[i];
                config.push({
                    name: item.name,
                    key: item.key,
                    type: item.type,
                    value: item.type === 'select' ? undefined : '',
                })
            }
            for (let i = 0; i < config.length; i++) {
                const target = config[i];
                let _target = _config.find(item => item.key === target.key)
                target.value = _target ? _target.value : ''
            }
            console.log('handleCategorySelect config:', config)
            this.form.config = config
        },

        // 商品规格模式改变
        handleSpecificModeChange() {
            if (this.specific.mode === 2) {
                this.specific.data = [{
                    target_id: this.form.id,
                    code: this.form.code,
                    name: this.form.name,
                    name_en: this.form.name_en,
                    price: this.form.price,
                    fob_eur: this.form.fob_eur,
                    fob_usd: this.form.fob_usd,
                    original_price: this.form.original_price,
                    original_price_currency: this.form.original_price_currency
                }]
            } else if (this.specific.mode === 1) {
                this.form.code = this.specific.data[0].code
                this.form.name = this.specific.data[0].name
                this.form.name_en = this.specific.data[0].name_en
                this.form.price = this.specific.data[0].price
                this.form.fob_eur = this.specific.data[0].fob_eur
                this.form.fob_usd = this.specific.data[0].fob_usd
                this.form.original_price = this.specific.data[0].original_price
            }
        },

        // 规格定义
        // 规格名
        handleAddSpec() { // 添加规格定义
            this.specific.list.push({id: '', name: '', key: '', option: [], addVisible: false,addValue: {key:'', zh:'', en:''}})
        },
        handleRemoveSpec(index) { // 删除规格定义
            let item = this.specific.list[index]
            if (item.id) {
                Core.Api.AttrDef.delete({id: item.id})
            }
            this.specific.list.splice(index, 1)
        },
        handleSpecEditBlur(index, key) {
            let item = this.specific.list[index]
            if (key === 'name') {
                if (!item.name) {
                    return this.$message.warning(this.$t('def.specification_name'))
                }
                let names = this.specific.list.map(i => i.name).filter((val,i) => val && i !== index)
                if (names.includes(item.name)) {
                    this.specific.list[index].name = ''
                    return this.$message.warning(this.$t('def.specification_be_unique'))
                }
            } else {
                let reg = /^[a-z]+$/g
                if (!item.key) {
                    return this.$message.warning(this.$t('def.specification_keyword'))
                }
                if (!reg.test(item.key)) {
                    this.specific.list[index].key = ''
                    return this.$message.warning(this.$t('def.keyword_lowercase'))
                }
                let keys = this.specific.list.map(i => i.key).filter((val,i) => val && i !== index)
                if (keys.includes(item.key)) {
                    this.specific.list[index].key = ''
                    return this.$message.warning(this.$t('def.keyword_unique'))
                }
            }
            if (item.key.trim() && item.name.trim()) {
                let value = ""
                let value_en = ""
                item.option.forEach(it => {
                    value += it.zh + ","
                    value_en += it.en + ","
                });
                var reg =/,$/gi;
                value = value.replace(reg, "")
                value_en = value_en.replace(reg, "")
                let _item = { id: item.id, key: item.key, name: item.name, value: value, value_en: value_en }
                Core.Api.AttrDef.save(_item).then(res => {
                    console.log('handleSpecEditBlur res:', res)
                    this.specific.list[index].id = res.detail.id
                    console.log(" this.specific", this.specific)
                    // this.getItemDetail();
                })
            }
        },
        // 规格值
        handleAddSpecOption(index) {
            let target = this.specific.list[index]
            let item = Core.Util.deepCopy(this.specific.list[index].addValue)

            if (!item.zh) {
                return this.$message.warning(this.$t('def.enter_specification_value'))
            }
            if (!item.en) {
                return this.$message.warning(this.$t('def.enter_specification_value_en'))
            }

            if (target.option.includes(item.zh)) {
                return this.$message.warning(this.$t('def.specification_value_repeated'))
            }
            if (target.option.includes(item.en)) {
                return this.$message.warning(this.$t('def.specification_value_repeated_en'))
            }
            item.key = item.en;

            console.log("addValue", item)
            target.option.push(item)
            console.log("this.specific.list[index]", target)
            this.handleCloseSpecOption(index)
            if (target.id && target.key.trim() && target.name.trim()) {
                let value = ""
                let value_en = ""
                target.option.forEach(it => {
                    value += it.zh + ","
                    value_en += it.en + ","
                });
                var reg =/,$/gi;
                value = value.replace(reg, "")
                value_en = value_en.replace(reg, "")
                let _item = { id: target.id, key: target.key, name: target.name, value: value, value_en:value_en }
                Core.Api.AttrDef.save(_item)
            }
        },
        handleCloseSpecOption(index) {
            this.specific.list[index].addValue.zh = ''
            this.specific.list[index].addValue.en = ''
            this.specific.list[index].addValue.key = ''
            this.specific.list[index].addVisible = false
        },
        handleRemoveSpecOption(index, i) {
            let item = this.specific.list[index]
            let _do = function() {
                item.option.splice(i, 1)
                let value = ""
                let value_en = ""
                item.option.forEach(it => {
                    value += it.zh + ","
                    value_en += it.en + ","
                });
                var reg =/,$/gi;
                value = value.replace(reg, "")
                value_en = value_en.replace(reg, "")
                if (item.id && item.key.trim() && item.name.trim()) {
                    let _item = { id: item.id, key: item.key, name: item.name, value: value, value_en:value_en}
                    Core.Api.AttrDef.save(_item)
                }
            }
            if (this.specific.data.map(i => i[item.key]).includes(item.option[i])) {
                this.$confirm({
                    title: this.$t('def.specification_value_remove'),
                    okText: this.$t('def.ok'),
                    okType: 'danger',
                    cancelText: this.$t('def.cancel'),
                    onOk: () => {
                        for (const element of this.specific.data) {
                            if (element[item.key] === item.option[i]) {
                                element[item.key] = undefined
                            }
                        }
                        _do()
                    },
                });
            } else {
                _do()
            }
        },
        getSalesAreaList() {
            Core.Api.SalesArea.list({page:0}).then(res => {
                this.salesList = res.list
            });
        },
        // 规格商品
        handleAddSpecItem() { // 添加商品规格
            let maxLen = 1
            for (let i = 0; i < this.specific.list.length; i++) {
                const len = this.specific.list[i].option.length || 1;
                maxLen = maxLen*len
            }
            // if (this.specific.data.length >= maxLen) {
            //     return this.$message.warning('当前商品规格已达最大规格组合数，请添加规格定义')
            // }
            this.specific.data.push({
                code: '',
                name: '',
                name_en: '',
                price: '',
                original_price: '',
                fob_eur: '',
                fob_usd: '',
            })
        },

        // 批量设置
        handleCloseBatchSet() {
            this.batchSet = {
                priceVisible: false,
                price: '',
                originalVisible: false,
                original_price: '',
                fobEurVisible: false,
                fob_eur: '',
                fobUsdVisible: false,
                fob_usd: '',
            }
        },
        handleBatchSpec(key) {
            if (!this.batchSet[key] && this.batchSet[key] !== 0) {
                return this.$message.warning(this.$t('def.set_price'))
            }
            this.specific.data = this.specific.data.map(item => {
                item[key] = this.batchSet[key]
                return item
            })
            this.handleCloseBatchSet()
        },
        specChange(record, key, item){
            record[key] = {
                value : item.zh,
                value_en : item.en
            }
            // value.value = item.zh
            console.log("record",record)
        },
        // 添加商品
        handleAddItemShow(ids, items) {
            this.form.accessory_id = items[0].id
            this.form.accessory_name = items[0].name
            this.form.accessory_name_en = items[0].name_en

            this.form.accessory_code = items[0].code
            this.form.accessory_amount = 0
        },
        // 添加商品
        handleDeleteItem() {
            this.form.accessory_id = ''
            this.form.accessory_name = ''
            this.form.accessory_name_en = ''
            this.form.accessory_code = ''
            this.form.accessory_amount = 0
        },
    }
};
</script>

<style lang="less">
#ItemEdit {
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
                        color: #8090A6;
                        margin-left: 5px;
                        margin-top: 7px;
                    }
                    .ant-select {
                        margin-left: 10px;
                        width: 60px;
                    }
                }
            }
        }
    }
    .form-item.specific-config,
    .form-item.specific-items {
        align-items: flex-start;
        > .key {
            line-height: 32px;
        }
        > .value {
            // width: calc(~'100% - 200px');
            max-width: calc(~'100% - 200px');
            .value-price {
                margin-right: 5px;
                width: 60px;
            }
        }
    }
    .form-item.specific-items {
        margin-top: 30px;
    }
    .spec-item {
        padding-bottom: 10px;
        .name ,.option {
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
            .fac();
            box-sizing: border-box;
            height: 50px;
            background: #FFFFFF;
            border: 1px solid #E5E8EB;
            border-radius: 1px;
            > .ant-input {
                width: 194px;
                margin-right: 8px;
            }
            > .ant-btn {
                font-size: 12px;
                transition: opacity 0.3s ease;
                visibility: hidden;
                opacity: 0;
            }
            &:hover > .ant-btn {
                visibility: visible;
                opacity: 1;
            }
        }
        .option {
            display: flex;
            margin-bottom: 20px;
            > p {
                padding-left: 34px;
                padding-right: 50px;
                height: 32px;
                line-height: 32px;
                margin-top: 8px;
            }
            .option-list {
                display: flex;
                flex-wrap: wrap;
                width: calc(~'100% - 64px - 4em');
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
                    border: 1px solid #E5E8EB;
                    box-shadow: 0 0 0 0;
                }
                .close {
                    position: absolute;
                    color: #C2C2C2;
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
        background: #FFFFFF;
        font-size: 12px;
    }
    .specific-table {
        th {
            background-color: #fff;
        }
        .ant-input-number,
        .ant-select:not(.ant-input-number + .ant-select) {
            width: 120px;
        }
        .code {
            width: 150px;
        }
        .ant-table-container .ant-table-content  {
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
                    background: #F8FAFC;
                }
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
.specific-option-edit-popover, .batch-set-edit-popover {
    margin: 0 -4px;
    display: flex;
    .flex(flex-start,flex-end);
    .ant-input, .ant-input-number {
        width: 180px;
        margin-bottom: 8px;
    }
    .content-length {
        font-size: 10px;
        line-height: 14px;
        color: #8090A6;
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
