<template>
    <div id="MaterialEdit" class="edit-container">
        <div class="title-container">
            <div class="title-area">{{ form.id ? $t('m.edit_material') : $t('m.new_material') }}</div>
        </div>
        <div class="form-block">
            <!-- 基本信息 -->
            <div class="form-title">
                <div class="title">{{ $t('n.information') }}</div>
            </div>
            <div class="form-content">
                <div class="form-item required">
                    <div class="key">{{ $t('m.material_name') }}</div>
                    <div class="value">
                        <a-input v-model:value="form.name" :placeholder="$t('m.enter_material')" :maxlength="60" />
                    </div>
                </div>
                <div class="form-item required">
                    <div class="key">{{ $t('m.material_en_name') }}</div>
                    <div class="value">
                        <a-input
                            v-model:value="form.name_en"
                            :placeholder="$t('m.enter_material_en')"
                            :maxlength="60"
                        />
                    </div>
                </div>
                <!-- 物料分类 -->
                <div class="form-item required">
                    <div class="key">{{ $t('m.material_category') }}</div>
                    <div class="value">
                        <CategoryTreeSelect
                            @change="handleCategorySelect"
                            :category="item_category"
                            :category-id="form.category_id"
                            :placeholder="$t('n.choose') + $t('m.material_category')"
                            type="material"
                        />
                    </div>
                </div>
                <!-- 物料编码 -->
                <div class="form-item required">
                    <div class="key">{{ $t('m.material_code') }}</div>
                    <div class="value">
                        <a-input v-model:value="form.code" :placeholder="$t('n.enter') + $t('m.material_code')" />
                    </div>
                </div>
                <!-- 图面代号 -->
                <!-- <div class="form-item required">
					<div class="key">{{ $t('d.drawing_code') }}</div>
					<div class="value">
						<a-input v-model:value="form.drawing_code" :placeholder="$t('def.input')"/>
					</div>
				</div> -->
                <!-- 类型 -->
                <div class="form-item">
                    <div class="key">{{ $t('m.type') }}</div>
                    <div class="value">
                        <a-select v-model:value="form.type" :placeholder="$t('n.choose') + $t('m.type')">
                            <a-select-option v-for="item in editMsgType" :key="item.key" :value="item.key">
                                {{ item[$i18n.locale] }}
                            </a-select-option>
                        </a-select>
                    </div>
                </div>
                <div class="form-item">
                    <div class="key">{{ $t('m.material_spec') }}</div>
                    <div class="value">
                        <a-input v-model:value="form.spec" :placeholder="$t('n.enter') + $t('m.material_spec')" />
                    </div>
                </div>
                <div class="form-item">
                    <div class="key">{{ $t('m.unit') }}</div>
                    <div class="value">
                        <a-input v-model:value="form.unit" :placeholder="$t('n.enter') + $t('m.unit')" />
                    </div>
                </div>
                <div class="form-item">
                    <div class="key">{{ $t('m.material_picture') }}</div>
                    <div class="value">
                        <a-upload
                            name="file"
                            class="image-uploader"
                            list-type="picture-card"
                            accept="image/*"
                            :file-list="upload.coverList"
                            :action="upload.action"
                            :headers="upload.headers"
                            :data="upload.data"
                            :before-upload="handleImgCheck"
                            @change="handleCoverChange"
                        >
                            <div class="image-inner" v-if="upload.coverList.length < 1">
                                <i class="icon i_upload" />
                            </div>
                        </a-upload>
                    </div>
                </div>
                <!-- 装箱数 -->
                <div class="form-item required">
                    <div class="key">{{ $t('m.boxes') }}</div>
                    <div class="value">
                        <a-input-number v-model:value="form.pack_count" :placeholder="$t('n.enter')" />{{ $t('m.pcs') }}
                    </div>
                </div>
                <div class="form-item">
                    <div class="key">{{ $t('m.color') }}</div>
                    <div class="value">
                        <a-input v-model:value="form.color" :placeholder="$t('n.enter')" />
                    </div>
                </div>
                <div class="form-item">
                    <div class="key">{{ $t('m.package') }}</div>
                    <div class="value">
                        <a-input v-model:value="form.encapsulation" :placeholder="$t('n.enter') + $t('m.package')" />
                    </div>
                </div>
                <div class="form-item">
                    <div class="key">{{ $t('m.size') }}</div>
                    <div class="value">
                        <a-input v-model:value="form.encapsulation_size" :placeholder="$t('n.enter') + $t('m.size')" />
                    </div>
                </div>
                <div class="form-item">
                    <div class="key">{{ $t('m.weight') }}</div>
                    <div class="value">
                        <a-input-number
                            v-model:value="gross_weight"
                            :placeholder="$t('n.enter')"
                            style="width: 80px"
                            :min="0"
                            :precision="2"
                        />
                        kg
                    </div>
                </div>
                <div class="form-item">
                    <div class="key">{{ $t('m.weight') }}</div>
                    <div class="value">
                        <a-input v-model:value="form.remark" :placeholder="$t('def.remark')" />
                    </div>
                </div>
            </div>
        </div>
        <div class="form-btns">
            <a-button type="primary" @click="handleSubmit" v-if="$auth('material.save')">{{ $t('def.sure') }}</a-button>
            <a-button type="primary" ghost @click="routerChange('back')">{{ $t('def.cancel') }}</a-button>
        </div>
    </div>
</template>

<script>
import Core from '../../core';
import CategoryTreeSelect from '../../components/popup-btn/CategoryTreeSelect.vue';

export default {
    name: 'MaterialEdit',
    components: {
        CategoryTreeSelect,
    },
    props: {},
    data() {
        return {
            // 加载
            loading: false,
            form: {
                id: '',
                name: '',
                name_en: '',
                code: '',
                category_id: undefined, // 物料分类
                encapsulation: '', // 物料包装
                spec: '', // 规格
                supplier_ids: undefined, // 供应商
                unit: '',
                encapsulation_size: '',
                remark: '',
                image: '',
                color: '',
                pack_count: '',
                type: null,
                // drawing_code: null, // 图面代号
            },
            gross_weight: '',
            supplierList: [],
            item_category: {},
            configTemp: [],

            upload: {
                // 上传图片
                action: Core.Const.NET.FILE_UPLOAD_END_POINT,
                coverList: [],
                headers: {
                    ContentType: false,
                },
                data: {
                    token: Core.Data.getToken(),
                    type: 'img',
                },
            },
            editMsgType: Core.Const.PRODUCTION.materialMsg.editMsg, // 类型
        };
    },
    watch: {},
    computed: {},
    created() {
        this.form.id = Number(this.$route.query.id) || 0;
        this.getSupplierList();
        if (this.form.id) {
            this.getMaterialDetail();
        }
    },
    mounted() {},
    methods: {
        routerChange(type, item) {
            let routeUrl;
            switch (type) {
                case 'back':
                    this.$router.go(-1);
                    break;
                case 'detail': // 详情
                    routeUrl = this.$router.resolve({
                        path: '/item/item-detail',
                        query: { id: item.id },
                    });
                    window.open(routeUrl.href, '_self');
                    break;
            }
        },
        // 获取物料详情
        getMaterialDetail() {
            this.loading = true;
            Core.Api.Material.detail({
                id: this.form.id,
            })
                .then(res => {
                    console.log('Material.detail res', res);
                    this.form = res;
                    this.gross_weight = Core.Util.countFilter(res.gross_weight);
                    if (this.form.image) {
                        this.upload.coverList = [
                            {
                                uid: 1,
                                name: this.form.name,
                                url: Core.Const.NET.FILE_URL_PREFIX + this.form.image,
                                short_path: this.form.image,
                                status: 'done',
                            },
                        ];
                    }
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        getSupplierList() {
            Core.Api.Supplier.listAll().then(res => {
                this.supplierList = res.list;
            });
        },
        // 保存、新建 物料
        handleSubmit() {
            let form = Core.Util.deepCopy(this.form);

            if (this.upload.coverList.length) {
                let file_url = this.upload.coverList.map(item => {
                    return item.short_path || item.response.data.filename;
                });
                if (file_url.length > 0) {
                    form.image = file_url[0];
                }
            }
            if (typeof this.checkFormInput(form) === 'function') {
                return;
            }
            console.log('handleSubmit form:', form);

            let params = {
                gross_weight: Math.round(this.gross_weight * 100),
                ...form,
            };

            Core.Api.Material.save(Core.Util.searchFilter(params))
                .then(() => {
                    this.$message.success(this.$t('pop_up.save_success'));
                    this.routerChange('back');
                })
                .catch(err => {
                    console.log('handleSubmit err:', err);
                });
        },
        // 保存时检查表单输入
        checkFormInput(form) {
            if (!form.name) {
                return this.$message.warning(`${this.$t('n.enter')}${this.$t('m.material_name')}`);
            }
            if (!form.name_en) {
                return this.$message.warning(`${this.$t('n.enter')}${this.$t('m.material_en_name')}`);
            }
            // 物料分类-必选判断
            if (!form.category_id) {
                return this.$message.warning(`${this.$t('n.choose')}${this.$t('m.material_category')}`);
            }
            if (!form.code) {
                return this.$message.warning(`${this.$t('n.enter')}${this.$t('m.material_code')}`);
            }
            // if (!form.type && form.type !== 0) {
            // 	return this.$message.warning(`${this.$t('n.choose')}${this.$t('m.type')}`);
            // }
            if (!form.pack_count) {
                return this.$message.warning(`${this.$t('n.enter')}${this.$t('m.boxes')}`);
            }
            // if (!form.drawing_code) {
            // 	// 图面代号
            // 	return this.$message.warning(`${this.$t('n.enter')}${this.$t('d.drawing_code')}`);
            // }
            return 0;
        },

        // 物料分类选择
        handleCategorySelect(val, node) {
            this.form.category_id = val;
        },

        // 校验图片
        handleImgCheck(file) {
            const isCanUpType = ['image/jpeg', 'image/png', 'image/gif', 'image/bmp'].includes(file.type);
            if (!isCanUpType) {
                this.$message.warning('文件格式不正确');
            }
            const isLt10M = file.size / 1024 / 1024 < 10;
            if (!isLt10M) {
                this.$message.warning('请上传小于10MB的图片');
            }
            return isCanUpType && isLt10M;
        },
        // 上传图片
        handleCoverChange({ file, fileList }) {
            console.log('handleCoverChange status:', file.status, 'file:', file);
            if (file.status == 'done') {
                if (file.response && file.response.code > 0) {
                    return this.$message.error(file.response.message);
                }
            }
            this.upload.coverList = fileList;
            console.log('coverList', file);
        },
    },
};
</script>

<style lang="less"></style>
