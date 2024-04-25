<template>
    <div id="WarehouseEdit" class="edit-container">
        <div class="title-container">
            <div class="title-area">{{ form.id ? $t('inv.edit') : $t('inv.add') }}</div>
        </div>
        <div class="form-block">
            <div class="form-title">
                <div class="title-colorful">{{ $t('n.information') }}</div>
            </div>
            <div class="form-content">
                <div class="form-item required">
                    <div class="key">{{ $t('inv.inventory_name') }}：</div>
                    <div class="value">
                        <a-input v-model:value="form.name" :placeholder="$t('def.input')" />
                    </div>
                </div>
                <div class="form-item required">
                    <div class="key">{{ $t('n.type') }}：</div>
                    <div class="value">
                        <a-radio-group v-model:value="form.type" @click="form.category_id = undefined">
                            <a-radio :value="item.key" v-for="item in TYPE_MAP">{{
                                lang === 'zh' ? item.zh : item.en
                            }}</a-radio>
                        </a-radio-group>
                    </div>
                </div>
                <div class="form-item required">
                    <div class="key">{{ $t('inv.category') }}：</div>
                    <div class="value">
                        <CategoryTreeSelect
                            @change="handleCategorySelect"
                            :category="item_category"
                            :category-id="form.category_id"
                            :placeholder="$t('n.choose') + $t('m.material_category')"
                            type="material"
                            :inventory-type="form.type"
                        />
                    </div>
                </div>

                <div class="form-item required">
                    <div class="key">{{ $t('inv.spec_no') }}：</div>
                    <div class="value">
                        <a-input v-model:value="form.spec" :placeholder="$t('def.input')" />
                    </div>
                </div>
                <div class="form-item required">
                    <div class="key">{{ $t('inv.inventory_coding') }}：</div>
                    <div class="value">
                        <a-input v-model:value="form.uid" :placeholder="$t('def.input')" />
                    </div>
                </div>
                <div class="form-item required">
                    <div class="key">{{ $t('inv.inventory_code') }}：</div>
                    <div class="value">
                        <a-input v-model:value="form.model" :placeholder="$t('def.input')" />
                    </div>
                </div>
                <div class="form-item required">
                    <div class="key">{{ $t('inv.admin') }}：</div>
                    <div class="value">
                        <a-input v-model:value="form.admin_name" :placeholder="$t('def.input')" />
                    </div>
                </div>
                <div class="form-item required">
                    <div class="key">{{ $t('inv.production_consumption') }}：</div>
                    <div class="value">
                        <a-radio-group v-model:value="form.flag_production_use">
                            <a-radio :value="is_production_consumption.YES">{{ $t('inv.yes') }}</a-radio>
                            <a-radio :value="is_production_consumption.NO">{{ $t('inv.no') }}</a-radio>
                        </a-radio-group>
                    </div>
                </div>
                <div class="form-item required">
                    <div class="key">{{ $t('inv.outsourcing') }}：</div>
                    <div class="value">
                        <a-radio-group v-model:value="form.flag_outsourcing">
                            <a-radio :value="is_outsourcing.YES">{{ $t('inv.yes') }}</a-radio>
                            <a-radio :value="is_outsourcing.NO">{{ $t('inv.no') }}</a-radio>
                        </a-radio-group>
                    </div>
                </div>
                <div class="form-item required">
                    <div class="key">{{ $t('inv.tax_rate') }}：</div>
                    <div class="value">
                        <a-input style="width: 70px" v-model:value="form.tax" :placeholder="$t('def.input')" />%
                    </div>
                </div>
                <div class="form-item required">
                    <div class="key">{{ $t('inv.cost') }}：</div>
                    <div class="value">
                        <a-input-number
                            v-model:value="form.cost"
                            style="width: 82px"
                            :min="0"
                            :precision="2"
                            :placeholder="$t('n.please_input')"
                        />
                    </div>
                </div>
                <div class="form-item required">
                    <div class="key">{{ $t('inv.abc_type') }}：</div>
                    <div class="value">
                        <a-input v-model:value="form.abc_type" :placeholder="$t('def.input')" />
                    </div>
                </div>
                <div class="form-item required">
                    <div class="key">{{ $t('inv.batch') }}：</div>
                    <div class="value">
                        <a-radio-group v-model:value="form.flag_batch">
                            <a-radio :value="is_batch.YES">{{ $t('inv.yes') }}</a-radio>
                            <a-radio :value="is_batch.NO">{{ $t('inv.no') }}</a-radio>
                        </a-radio-group>
                    </div>
                </div>
                <div class="form-item required">
                    <div class="key">{{ $t('inv.start_date') }}：</div>
                    <div class="value">
                        <a-date-picker
                            v-model:value="form.start_date"
                            valueFormat="YYYY-MM-DD"
                            :placeholder="$t('def.input')"
                        />
                    </div>
                </div>
                <div class="form-item required">
                    <div class="key">{{ $t('inv.create_user') }}：</div>
                    <div class="value">
                        <a-input v-model:value="form.user" :placeholder="$t('def.input')" />
                    </div>
                </div>
                <div class="form-item required">
                    <div class="key">{{ $t('inv.unit_group') }}：</div>
                    <div class="value">
                        <a-input v-model:value="form.uom_group" :placeholder="$t('def.input')" />
                    </div>
                </div>
                <div class="form-item required">
                    <div class="key">{{ $t('inv.primary_unit') }}：</div>
                    <div class="value">
                        <a-input v-model:value="form.uom_primary" :placeholder="$t('def.input')" />
                    </div>
                </div>
                <div class="form-item required">
                    <div class="key">{{ $t('inv.feature_matching') }}：</div>
                    <div class="value">
                        <a-radio-group v-model:value="form.flag_extra_feature">
                            <a-radio :value="feature.YES">{{ $t('inv.yes') }}</a-radio>
                            <a-radio :value="feature.NO">{{ $t('inv.no') }}</a-radio>
                        </a-radio-group>
                    </div>
                </div>
            </div>
        </div>
        <div class="form-btns">
            <a-button @click="handleSubmit" type="primary">{{ $t('def.sure') }}</a-button>
            <a-button @click="routerChange('back')" type="primary" ghost="">{{ $t('def.cancel') }}</a-button>
        </div>
    </div>
</template>

<script>
import Core from '../../core';
import dayjs from 'dayjs';
import CategoryTreeSelect from '@/components/popup-btn/CategoryTreeSelect.vue';

export default {
    name: 'WarehouseEdit',
    components: {
        CategoryTreeSelect,
    },
    props: {},
    data() {
        return {
            loginType: Core.Data.getLoginType(),
            // 加载
            loading: false,
            detail: {},
            inventoryType: Core.Const.INVENTORY.TYPE,
            is_production_consumption: Core.Const.INVENTORY.IS_PRODUCTION_CONSUMPTION,
            is_outsourcing: Core.Const.INVENTORY.IS_OUTSOURCING,
            is_batch: Core.Const.INVENTORY.IS_BATCH,
            feature: Core.Const.INVENTORY.FEATURE,
            TYPE_MAP: Core.Const.INVENTORY.TYPE_MAP,
            item_category: {},
            form: {
                id: '',
                name: '',
                type: '',
                category_id: undefined,
                uid: undefined,
                model: undefined,
                flag_production_use: undefined,
                flag_outsourcing: undefined,
                tax: undefined,
                cost: undefined,
                abc_type: undefined,
                flag_batch: undefined,
                start_date: undefined,
                flag_extra_feature: undefined,
                user: undefined,
                uom_group: undefined,
                uom_primary: undefined,
            },
        };
    },
    watch: {},
    computed: {
        lang() {
            return this.$store.state.lang;
        },
    },

    mounted() {
        this.form.id = Number(this.$route.query.id) || 0;
        if (this.form.id) {
            this.getInventoryDetail();
        }
    },
    methods: {
        routerChange(type, item) {
            switch (type) {
                case 'back':
                    this.$router.go(-1);
                    break;
            }
        },
        getInventoryDetail() {
            this.loading = true;
            Core.Api.Inventory.detail({
                id: this.form.id,
            })
                .then(res => {
                    console.log('getWarehouseDetail res', res);
                    this.detail = res.inventory;
                    this.detail.start_date = this.detail.start_date
                        ? dayjs.unix(this.detail.start_date).format('YYYY-MM-DD')
                        : undefined;
                    for (const key in this.form) {
                        this.form[key] = res.inventory[key];
                    }
                    this.form.start_date = this.detail.start_date
                        ? dayjs.unix(this.detail.start_date).format('YYYY-MM-DD')
                        : undefined;
                    this.form.cost = Core.Util.countFilter(this.form.cost);
                    console.log('defAddr err', this.defAddr);
                })
                .catch(err => {
                    console.log('getWarehouseDetail err', err);
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        handleSubmit() {
            let form = Core.Util.deepCopy(this.form);
            console.log('form', form);
            if (!form.name) {
                return this.$message.warning(this.$t('def.enter'));
            }
            if (!form.uid) {
                return this.$message.warning(this.$t('def.enter'));
            }
            form.cost = Core.Util.countFilter(this.form.cost, 100, 0, true);
            form.start_date = form.start_date ? dayjs(form.start_date).unix() : 0; // 日期转时间戳
            Core.Api.Inventory.save({
                ...form,
            })
                .then(() => {
                    this.$message.success(this.$t('pop_up.save_success'));
                    this.routerChange('back');
                })
                .catch(err => {
                    console.log('handleSubmit err:', err);
                });
        },
        // 物料分类选择
        handleCategorySelect(val, node) {
            this.form.category_id = val;
        },
    },
};
</script>

<style lang="less" scoped>
// #Warehouse Edit {}
</style>
