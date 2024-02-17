<template>
    <a-button class="EditBomBtn" @click.stop="handleModalShow()" :ghost="ghost" :type="btnType" :class="btnClass">
        <slot>{{ btnText }}</slot>
    </a-button>
    <a-modal
        v-model:visible="modalShow"
        :title="form.id ? '编辑BOM表' : '新增BOM表'"
        class="EditBomModal"
        :after-close="handleModalClose"
    >
        <div class="modal-content">
            <div class="form-item required">
                <div class="key">BOM表名称:</div>
                <div class="value">
                    <a-input v-model:value="form.name" placeholder="请输入BOM名称" />
                </div>
            </div>
            <div class="form-item required afs">
                <div class="key">对应商品:</div>
                <div class="value">
                    <ItemSelect
                        btnType="primary"
                        :btnText="$t('i.select_item')"
                        btnClass="item-select-btn"
                        @select="handleSelectItem"
                        :radioMode="true"
                    />
                    <div class="item-select-display" v-if="!$Util.isEmptyObj(selectItem)">
                        <img :src="$Util.imageFilter(selectItem.logo)" />
                        <a-tooltip :title="selectItem.name" placement="right">
                            <a-button type="link" @click="routerChange('item', selectItem)">{{
                                selectItem.name
                            }}</a-button>
                        </a-tooltip>
                        <span>编码：{{ selectItem.code || '-' }}</span>
                        <span>品号：{{ selectItem.model || '-' }}</span>
                    </div>
                </div>
            </div>
            <!--            <div class="form-item">
                <div class="key">版本号:</div>
                <div class="value">
                    <a-input-number v-model:value="form.version_num" placeholder="请输入版本号" :min="0" :precision="0" style="width: 100%;"/>
                </div>
            </div>-->
            <div class="form-item textarea">
                <div class="key">版本号:</div>
                <div class="value">
                    <a-textarea
                        v-model:value="form.version"
                        placeholder="请输入版本号"
                        :auto-size="{ minRows: 2, maxRows: 6 }"
                        :maxlength="99"
                    />
                    <span class="content-length">{{ form.version.length }}/99</span>
                </div>
            </div>
        </div>
        <template #footer>
            <a-button @click="modalShow = false">取消</a-button>
            <a-button @click="handleModalSubmit" type="primary">确定</a-button>
        </template>
    </a-modal>
</template>

<script>
import Core from '../../../core';
import ItemSelect from '../../../components/popup-btn/ItemSelect.vue';

export default {
    name: 'EditBomModel',
    components: {
        ItemSelect,
    },
    emits: ['submit'],
    props: {
        btnText: {
            type: String,
            default: '新增BOM表',
        },
        btnType: {
            type: String,
            default: 'primary',
        },
        btnClass: {
            type: String,
        },
        ghost: {
            type: Boolean,
            default: false,
        },
        detail: {
            type: Object,
        },
    },
    data() {
        return {
            modalShow: false,
            selectItem: {},
            form: {
                id: '',
                name: '',
                item_id: '',
                version: '',
                // version_num: '',
            },
        };
    },
    watch: {},
    computed: {},
    mounted() {},
    methods: {
        routerChange(type, item = {}) {
            let routeUrl = '';
            switch (type) {
                case 'item':
                    routeUrl = this.$router.resolve({
                        path: '/item/item-detail',
                        query: { id: item.id },
                    });
                    window.open(routeUrl.href, '_blank');
                    break;
            }
        },
        // 新增编辑bom
        handleModalShow() {
            if (this.detail) {
                for (const key in this.form) {
                    this.form[key] = this.detail[key];
                }
                if (this.detail.item_id && this.detail.item) {
                    this.selectItem = this.detail.item;
                }
            }
            console.log('this.form:', this.form);
            this.modalShow = true;
        },
        handleModalClose() {
            this.modalShow = false;
            Object.assign(this.form, this.$options.data().form);
            this.selectItem = {};
        },
        handleModalSubmit() {
            let form = Core.Util.deepCopy(this.form);
            form.item_id = this.selectItem.id;
            if (!form.name) {
                return this.$message.warning('请输入BOM表名称');
            }
            if (!form.item_id) {
                return this.$message.warning('请选择BOM表对应商品');
            }
            let obj = {
                ...form,
                type: 1, // 1.生产，2.售后
            };
            Core.Api.Bom.save(obj)
                .then(() => {
                    this.$message.success(this.$t('pop_up.save_success'));
                    this.handleModalClose();
                    this.$emit('submit');
                })
                .catch(err => {
                    console.log('handleModalSubmit err', err);
                });
        },
        handleSelectItem(ids, items) {
            console.log('handleSelectItem ids, items:', ids, items);
            this.selectItem = items[0];
        },
    },
};
</script>

<style lang="less">
.EditBomModal {
    .item-select-btn {
        height: 32px;
        line-height: 32px;
    }
    .item-select-display {
        margin-top: 12px;
        display: flex;
        position: relative;
        flex-direction: column;
        align-items: flex-start;
        width: 100%;
        box-sizing: border-box;
        padding-left: 72px;
        > img {
            width: 60px;
            height: 60px;
            object-fit: cover;
            position: absolute;
            left: 0;
        }
        .ant-btn {
            font-size: 14px;
            line-height: 16px;
            height: 16px;
            margin-bottom: 12px;
        }
        > span {
            font-size: 12px;
            line-height: 16px;
            color: #8090a6;
        }
    }
}
</style>
