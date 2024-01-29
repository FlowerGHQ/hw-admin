<template>
    <a-tree-select class="CategoryTreeSelect" v-model:value="value" :placeholder="$t('def.select')"
        :dropdown-style="{ maxHeight: '412px', overflow: 'auto' }" :tree-data="treeData" @select='handleSelect'
        :field-names="fieldNames" tree-default-expand-all />
</template>

<script>
import Core from '../../core';

export default {
    components: {},
    props: {
        parentId: {
            type: Number,
            default: 0
        },
        categoryId: {
            type: Number,
        },
        category: {
            type: Object,
        },
        inventoryType: {
            type: Number,
            default: 1,
        },
        type: {
            type: String,
            default: 'item', //商品
        }
    },
    emit: ['change'],
    data() {
        return {
            treeData: [],
            fieldNames: {},
            value: undefined,
            form: {},
        }
    },
    watch: {
        parentId(n) {
            this.getFirstItemCategory(n)
        },
        categoryId(n) {
            if (!n) {
                this.value = undefined
            } else if (n && n !== this.value) {
                this.value = this.categoryId
            }
        },
        inventoryType(n) {
            this.getFirstItemCategory()
        },

        '$i18n.locale': {
            deep: true,
            immediate: true,
            handler(n) {
                console.log('$i18n.locale', n)
                let fieldNames = { label: 'name_en', value: 'id', children: 'children', }
                switch (n) {
                    case 'zh': fieldNames.label = 'name'; break;
                    case 'en': fieldNames.label = 'name_en'; break;
                    default:
                        fieldNames.label = 'name'; // 设置默认值
                        break;
                }
                this.fieldNames = fieldNames
            }
        },
    },
    computed: {},
    created() { },
    mounted() {
        this.getFirstItemCategory(this.parentId)
        console.log('mounted this.categoryId:', this.categoryId)
        if (this.categoryId) {
            this.value = this.categoryId
        }
    },
    methods: {
        resetVal() {
            this.value = undefined
        },
        getFirstItemCategory() {
            let key = ''
            let api = 'tree'
            switch (this.type) {
                case 'item':
                    key = 'ItemCategory'
                    this.form = { parent_id: this.parentId }; 
                    break;
                case 'list-item':
                    key = 'ItemCategory'
                    api = 'treeList'
                    this.form = { parent_id: this.parentId }; 
                    break;
                case 'material':
                    key = 'MaterialCategory'
                    this.form = {
                        parent_id: this.parentId,
                        type: this.inventoryType,
                    }; 
                    break;
            }
            Core.Api[key][api]({ ...this.form }).then(res => {
                this.treeData = res.list
                console.log("treeData", this.treeData)
            })
        },
        handleSelect(value, node, extra) {
            console.log('handleSelect value, node, extra:', value, node, extra)
            this.$emit('change', value, node)
        }
    },
}
</script>
