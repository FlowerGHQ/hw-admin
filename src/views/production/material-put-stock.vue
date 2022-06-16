<template>
    <div id="MaterialEdit" class="edit-container">
        <div class="title-container">
            <div class="title-area">{{ form.id ? '编辑物料' : '新增物料' }}</div>
        </div>
        <div class="form-block"> <!-- 基本信息 -->
            <div class="form-title">
                <div class="title"></div>
            </div>
            <div class="form-content">
                <div class="form-item required">
                    <div class="key">仓库</div>
                    <div class="value">
                        <a-select
                            v-model:value="warehouse_id"
                            show-search
                            placeholder="请输入仓库"
                            :default-active-first-option="false"
                            :show-arrow="false"
                            :filter-option="false"
                            :not-found-content="null"
                            @search="handleWarehouseSearch"
                            @change="handleWarehouseByMaterialChange"
                        >
                            <a-select-option v-for=" item in warehouseOptions" :key="item.id" :value="item.id">
                                {{ item.name }}
                            </a-select-option>
                        </a-select>

                    </div>
                </div>
                <div class="form-item required">
                    <div class="key">物料编码</div>
                    <div class="value">
                        <a-select
                            v-model:value="form.id"
                            show-search
                            placeholder="请输入物料编码"
                            :default-active-first-option="false"
                            :show-arrow="false"
                            :filter-option="false"
                            :not-found-content="null"
                            @search="handleSearch"
                            @change="handleChange"
                        >
                            <a-select-option v-for=" item in options" :key="item.id" :value="item.id">{{
                                    item.code
                                }}-{{ item.name }}
                            </a-select-option>

                        </a-select>

                    </div>
                </div>

                <div class="form-item required">
                    <div class="key">物料名称</div>
                    <div class="value">
                        {{ form.name }}
                    </div>
                </div>
                <div class="form-item required">
                    <div class="key">物料规格</div>
                    <div class="value">
                        {{ form.spec }}
                    </div>
                </div>
                <div class="form-item">
                    <div class="key">物料包装</div>
                    <div class="value">
                        {{ form.encapsulation }}
                    </div>
                </div>
                <div class="form-item required">
                    <div class="key">单位</div>
                    <div class="value">
                        {{ form.unit }}
                    </div>
                </div>
                <div class="form-item">
                    <div class="key">包装尺寸</div>
                    <div class="value">
                        {{ form.encapsulation_size }}
                    </div>
                </div>
                <div class="form-item">
                    <div class="key">毛重</div>
                    <div class="value">
                        {{ form.gross_weight }}
                    </div>
                </div>
                <div class="form-item">
                    <div class="key">备注</div>
                    <div class="value">
                        {{ form.remark }}
                    </div>
                </div>
                <div class="form-item">
                    <div class="key">当前库存</div>
                    <div class="value">
                        {{ form.gross_weight }}
                    </div>
                </div>
                <div class="form-item">
                    <div class="key">当前库存</div>
                    <div class="value">
                        {{ form.gross_weight }}
                    </div>
                </div>
                <div class="form-item">
                    <div class="key">最新库存变动时间</div>
                    <div class="value">
                        {{ form.gross_weight }}
                    </div>
                </div>
                <div class="form-item">
                    <div class="key">入库数量</div>
                    <div class="value">
                        <a-input v-model:value="form.amount" placeholder="请输入数量"/>
                    </div>
                </div>
            </div>
        </div>
        <div class="form-btns">
            <!--            <a-button type="primary" @click="handleSubmit" v-if="$auth('material.save')">确定</a-button>-->
            <a-button type="primary" ghost @click="routerChange('back')">取消</a-button>
        </div>
    </div>
</template>

<script>
import Core from '../../core';
import CategoryTreeSelect from '../../components/popup-btn/CategoryTreeSelect.vue'

export default {
    name: 'MaterialPutStock',
    components: {
        CategoryTreeSelect,
    },
    props: {},
    data() {
        return {
            // 加载
            loading: false,
            warehouse_id: '',
            form: {
                id: '',
                name: '',
                code: '',
                category_id: undefined,
                encapsulation: '', // 物料包装
                spec: '', // 规格
                supplier_ids: undefined, // 供应商
                unit: '',
                encapsulation_size: '',
                remark: '',
                image: '',
            },
            gross_weight: '',
            supplierList: [],
            item_category: {},
            configTemp: [],
            options: [],
            warehouseOptions: [],

        };
    },
    watch: {},
    computed: {},
    created() {
    },
    mounted() {
    },
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
        // 获取物料详情
        getMaterialDetail() {
            this.loading = true;
            Core.Api.Material.detail({
                id: this.form.id,
            }).then(res => {
                console.log('Material.detail res', res)
                this.form = res
                this.form.code = res.code
                this.handleWarehouseByMaterialChange()
                console.log('Material.detail res.code', res.code)
                this.gross_weight = Core.Util.countFilter(res.gross_weight)

            }).finally(() => {
                this.loading = false
            })
        },
        handleSearch(code) {
            Core.Api.Material.list({code: code}).then(res => {
                this.options = res.list
            })
        },
        handleChange() {
            this.id = this.form.id
            this.getMaterialDetail();


        },
        handleWarehouseSearch(name) {
            Core.Api.Warehouse.list({name: name}).then(res => {
                this.warehouseOptions = res.list
            })
        },
        handleWarehouseByMaterialChange() {
            if (!this.form.id) {
                return
            }
            if (!this.warehouse_id) {
                return
            }
            Core.Api.Stock.detailCodeWarehouse({
                material_code: this.form.code,
                warehouse_id: this.warehouse_id
            }).then(res => {

            })
        },
    }
};
</script>

<style lang="less">
</style>
