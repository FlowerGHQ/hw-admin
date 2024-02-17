<template>
    <div id="ItemCategoryConfig" class="edit-container">
        <div class="title-container">
            <div class="title-area">{{ $t('i.edit_b') }}</div>
        </div>
        <div class="form-block" v-for="(item, index) of config" :key="index">
            <div class="form-title">
                <div class="title">{{ $t('i.configuration_item') }}{{ index + 1 }}</div>
            </div>
            <div class="form-content">
                <div class="form-item required">
                    <div class="key">{{ $t('n.name') }}</div>
                    <div class="value">
                        <a-input v-model:value="item.name" :placeholder="$t('def.input')" />
                    </div>
                </div>
                <div class="form-item required">
                    <div class="key">{{ $t('i.key') }}</div>
                    <div class="value">
                        <a-input v-model:value="item.key" :placeholder="$t('i.english')" />
                    </div>
                </div>
                <div class="form-item required">
                    <div class="key">{{ $t('i.required') }}</div>
                    <div class="value">
                        <a-radio-group v-model:value="item.required">
                            <a-radio :value="1">{{ $t('i.yes') }}</a-radio>
                            <a-radio :value="0">{{ $t('i.no') }}</a-radio>
                        </a-radio-group>
                    </div>
                </div>
                <div class="form-item required">
                    <div class="key">{{ $t('n.type') }}</div>
                    <div class="value">
                        <a-radio-group v-model:value="item.type">
                            <a-radio value="input">{{ $t('i.input_box') }}</a-radio>
                            <a-radio value="textarea">{{ $t('i.text_area') }}</a-radio>
                            <a-radio value="rich_text">{{ $t('i.rich_text') }}</a-radio>
                            <a-radio value="select">{{ $t('i.selection_box') }}</a-radio>
                            <a-radio value="radio">{{ $t('i.radio_button') }}</a-radio>
                        </a-radio-group>
                    </div>
                </div>
                <div class="form-item required afs" v-if="['select', 'radio'].includes(item.type)">
                    <div class="key">{{ $t('i.options') }}</div>
                    <div class="value">
                        <a-button type="link" @click="handleAddSelectItem(index)"
                            ><i class="icon i_add" />{{ $t('i.add_options') }}</a-button
                        >
                        <div class="select-input" v-for="(inner, i) of item.select" :key="i">
                            <a-input
                                v-model:value="item.select[i]"
                                :placeholder="$t('def.input')"
                                @change="e => handleSelectItemChange(e, index, i)"
                            />
                            <a-button type="link" class="danger" @click="handleRemoveSelectItem(index, i)"
                                ><i class="icon i_delete" />{{ $t('def.remove') }}</a-button
                            >
                        </div>
                    </div>
                </div>
            </div>
            <div class="form-delete icon i_close_b" @click="handleRemoveConfig(index)"></div>
        </div>
        <div class="form-block add">
            <div class="form-title"></div>
            <div class="form-content">
                <a-button type="primary" @click="handleAddConfig"
                    ><i class="icon i_add" />{{ $t('i.add_configuration') }}</a-button
                >
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

const configTemp = {
    required: 0,
    name: '',
    key: '',
    type: 'input',
    select: [],
};

export default {
    name: 'ItemCategoryConfig',
    components: {},
    props: {},
    data() {
        return {
            loginType: Core.Data.getLoginType(),
            // 加载
            loading: false,

            id: '',
            detail: {},
            config: [Core.Util.deepCopy(configTemp)],
        };
    },
    watch: {},
    computed: {},
    mounted() {
        this.id = Number(this.$route.query.id) || 0;
        this.getCategoryDetail();
    },
    methods: {
        routerChange(type, item) {
            let routeUrl;
            switch (type) {
                case 'back':
                    this.$router.go(-1);
                    break;
            }
        },
        getCategoryDetail() {
            Core.Api.ItemCategory.detail({ id: this.id })
                .then(res => {
                    console.log('getCategoryDetail res:', res);
                    this.detail = res.detail;
                    try {
                        if (res.detail.config) {
                            this.config = JSON.parse(res.detail.config);
                        } else {
                            this.config = [Core.Util.deepCopy(configTemp)];
                        }
                    } catch (error) {
                        console.log('getCategoryDetail error:', error);
                        this.config = [Core.Util.deepCopy(configTemp)];
                    }
                })
                .catch(err => {
                    console.log('getCategoryDetail err:', err);
                });
        },

        // 添加 配置项
        handleAddConfig() {
            this.config.push(Core.Util.deepCopy(configTemp));
        },
        // 删除 配置项
        handleRemoveConfig(index) {
            this.config.splice(index, 1);
        },

        // 添加 内容选项
        handleAddSelectItem(index) {
            this.config[index].select.push('');
        },
        // 删除 内容选项
        handleRemoveSelectItem(index, i) {
            this.config[index].select.splice(i, 1);
        },
        handleSelectItemChange(e, index, i) {
            console.log('handleSelectItemChange e:', e);
            this.config[index].select[i] = e.data.target.value;
        },

        // 保存、新建 商品
        handleSubmit() {
            let config = Core.Util.deepCopy(this.config);
            console.log('handleSubmit config:', config);
            let keys = [];
            for (const item of config) {
                if (keys.includes(item.key)) {
                    return this.$message.warning(this.$t('i.key_unique'));
                } else {
                    keys.push(item.key);
                }
                if (!item.name) {
                    return this.$message.warning(this.$t('i.configuration_name'));
                }
                if (!item.key) {
                    return this.$message.warning(this.$t('i.key_value'));
                }
            }
            Core.Api.ItemCategory.save({
                id: this.detail.id,
                name: this.detail.name,
                parent_id: this.detail.parent_id,
                type: 10,
                config: JSON.stringify(config),
            })
                .then(() => {
                    this.$message.success(this.$t('pop_up.save_success'));
                    this.routerChange('back');
                })
                .catch(err => {
                    console.log('handleSubmit err:', err);
                });
        },
    },
};
</script>

<style lang="less">
#ItemCategoryConfig {
    .form-block {
        position: relative;
        .form-delete {
            .fcc();
            cursor: pointer;
            position: absolute;
            font-size: 22px;
            right: 24px;
            top: 16px;
            color: #8090a6;
            &:hover {
                opacity: 0.7;
            }
        }
        .select-input {
            display: flex;
            margin-top: 8px;
            // + .select-input {}
            .ant-btn-link {
                margin-left: 12px;
            }
        }
        .ant-btn-link {
            font-size: 12px;
            .icon {
                font-size: 12px;
            }
        }
    }
    .form-block.add {
        padding: 24px 0;
        .ant-btn {
            border-radius: 2px;
        }
    }
}
</style>
