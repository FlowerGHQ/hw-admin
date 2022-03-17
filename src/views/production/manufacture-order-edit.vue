<template>
    <div id="ManufactureEdit" class="edit-container">
        <div class="title-container">
            <div class="title-area">{{ form.id ? '生产单编辑' : '新建生产单' }}</div>
        </div>
        <div class="form-block">
            <div class="form-title">
                <div class="title">基本信息</div>
            </div>
            <div class="form-content">
                <div class="form-item required">
                    <div class="key">生产单名称：</div>
                    <div class="value">
                        <a-input v-model:value="form.name" placeholder="请输入生产单名称"/>
                    </div>
                </div>
                <div class="form-item required">
                    <div class="key">生产产品：</div>
                    <div class="value">
                        <ItemSelect @select="handleSelectItem" :disabled-checked='[form.item_id]'
                                    :radio-mode='true' btn-type='primary' btnText="选择商品" btn-class="select-item-btn"/>
                        <div v-if="!$Util.isEmptyObj(selectItem)">
                            <img :src="$Util.imageFilter(selectItem.logo)" alt="" style="max-width: 60px"/>
                            {{selectItem.name}}
                        </div>
                    </div>
                </div>
<!--                <div class="form-item required">
                    <div class="key">BOM表：</div>
                    <div class="value">
                        <a-select v-model:value="form.bom_id" placeholder="请选择BOM表">
                            <a-select-option v-for="item of bomList" :key="item.id" :value="item.id">{{ item.name }}</a-select-option>
                        </a-select>
                    </div>
                </div>-->
                <div class="form-item required">
                    <div class="key">生产数量：</div>
                    <div class="value">
                        <a-input-number v-model:value="form.amount" :min="0"/>
                        <span>件</span>
                    </div>
                </div>
                <div class="form-item required">
                    <div class="key">领料仓库：</div>
                    <div class="value">
                        <a-select v-model:value="form.warehouse_id" placeholder="请选择领料仓库">
                            <a-select-option v-for="item of warehouseList" :key="item.id" :value="item.id">{{ item.name }}</a-select-option>
                        </a-select>
                    </div>
                </div>
                <div class="form-item textarea">
                    <div class="key">备注：</div>
                    <div class="value">
                        <a-textarea v-model:value="form.remark" placeholder="填写备注" :auto-size="{ minRows: 3, maxRows: 6 }" :maxlength='200'/>
                    </div>
                </div>
            </div>
        </div>
        <div class="form-btns">
            <a-button @click="handleSubmit" type="primary">确定</a-button>
            <a-button @click="routerChange('back')" type="primary" ghost>取消</a-button>
        </div>
    </div>
</template>

<script>
import Core from '../../core';
import ItemSelect from '@/components/popup-btn/ItemSelect.vue';

export default {
    name: 'ManufactureEdit',
    components: {
        ItemSelect,
    },
    props: {},
    data() {
        return {
            // 加载
            loading: false,
            detail: {},
            form: {
                id: '',
                name: '',
                item_id: '',
                bom_id: undefined,
                amount: '',
                remark: undefined,
                warehouse_id: undefined,
            },
            warehouseList: [],
            bomList: [],
            selectItem: {},

        };
    },
    watch: {},
    computed: {},
    mounted() {
        this.form.id = Number(this.$route.query.id) || 0
        if (this.form.id) {
            this.getStoreDetail();
        }
        this.getBomList();
        this.getWarehouseList();
    },
    methods: {
        routerChange(type, item) {
            switch (type) {
                case 'back':
                    this.$router.go(-1)
                    break;
            }
        },
        handleSelectItem(ids, items) {
            console.log('handleSelectItem', ids, items);
            this.form.item_id = ids[0]
            this.selectItem = items[0]
        },
        getBomList() {
            Core.Api.Production.list().then(res => {
                this.bomList = res.list
            })
        },
        getWarehouseList() {
            Core.Api.Warehouse.listAll().then(res => {
                this.warehouseList = res.list
            })
        },
        handleSubmit() {
            let form = Core.Util.deepCopy(this.form)
            if (!form.name) {
                return this.$message.warning('请输入生产单名称')
            }
            if (!form.item_id) {
                return this.$message.warning('请选择生产产品')
            }
            if (!form.amount) {
                return this.$message.warning('请输入数量')
            }
            Core.Api.ProductionOrder.save(form).then(() => {
                this.$message.success('保存成功')
                this.routerChange('back')
            }).catch(err => {
                console.log('handleSubmit err:', err)
            })
        },
    }
}
</script>

<style lang="less">
#ManufactureEdit {
    .value {
        .fac();
        display: flex;
        .select-item-btn {
            height: 32px;
            margin-right: 10px;
        }
        .img {
            max-width: 40px
        }

    }
}

</style>