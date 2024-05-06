<template>
    <a-tree-select
        class="CategoryTreeSelect"
        v-model:value="value"
        :placeholder="$t('def.select')"
        :dropdown-style="{ maxHeight: '412px', overflow: 'auto' }"
        :tree-data="treeData"
        multiple
        tree-default-expand-all
    />
</template>

<script>
import Core from '../../core';

export default {
    components: {},
    props: {
        parentId: {
            type: Number,
            default: 0,
        },
        categoryId: {
            type: [Number, Array, String],
        },
        category: {
            type: Object,
        },
        /* placeholder: {
            type: String,
        },*/
        type: {
            type: String,
            default: 'item', //商品
        },
    },
    emit: ['change'],
    data() {
        return {
            treeData: [],
            value: [],
        };
    },
    watch: {
        parentId(n) {
            this.getFirstItemCategory(n);
        },
        categoryId(n) {
            if (!n) {
                this.value = [];
            } else if (n && n !== this.value) {
                this.value = this.categoryId;
            }
        },
    },
    computed: {},
    created() {},
    mounted() {
        this.getFirstItemCategory(this.parentId);
        console.log('mounted this.categoryId:', this.categoryId);
        if (this.categoryId) {
            this.value = this.categoryId;
        }
    },
    methods: {
        getFirstItemCategory() {
            let key = '';
            switch (this.type) {
                case 'item':
                    key = 'ItemCategory';
                    break;
                case 'material':
                    key = 'MaterialCategory';
                    break;
            }
            Core.Api[key].tree({ parent_id: this.parentId }).then(res => {
                // let list = res.list.map(item => (
                //     // id: item.id,
                //     // parent_id: this.parentId,
                //     // key: item.id,
                //     // value: item.id,
                //     // title: item.name,
                //     // config: item.config,
                //     // children: item.children,
                //     this.getItemCategoryChildren(item)
                // ))
                this.treeData = res.list;
                console.log('treeData', this.treeData);
            });
        },
        // async getItemCategory(parent_id, treeNode, resolve) {
        //     let key = ''
        //     switch (this.type) {
        //         case 'item': key = 'ItemCategory'; break
        //         case 'material': key = 'MaterialCategory'; break
        //     }
        //     let {list} = await Core.Api[key].tree({parent_id})
        //     console.log('list:', list)
        //     list = list.map(item => ({
        //         id: item.id,
        //         parent_id: parent_id,
        //         key: item.id,
        //         value: item.id,
        //         title: item.name,
        //         isLeaf: !item.has_children,
        //     }))
        //     treeNode.dataRef.children = list
        //     resolve(list)
        //     return list
        // },
        // onLoadData(treeNode) {
        //     console.log('treeNode:', treeNode)
        //     let parent_id = treeNode.dataRef.id
        //     return new Promise(resolve => {
        //         this.getItemCategory(parent_id, treeNode, resolve)
        //     });
        // },

        handleSelect(value, node, extra) {
            console.log('handleSelect value, node, extra:', value, node, extra);
            this.$emit('change', value, node);
        },
    },
};
</script>
