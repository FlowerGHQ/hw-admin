
<template>
    <a-drawer :keyboard="true" :maskClosable="true" :width="400" title="添加标签" :visible="addTagShow" @close="handleTrackRecordClose" :closable="false">
        <template #extra>
            <img @click="addTagShow = false" class="add-tag-close-icon" src="../images/close-icon.png" alt="">
        </template>
        <div class="add-tag-tip">
            每项只能只能单选一个标签
        </div>
        <div class="add-tag-drawer-item">
            <div class="add-tag-drawer-key">
                用车城市：
            </div>
            <div class="add-tag-drawer-value">
                <China2Address @search="handleCitySearch" :defArea="[province, city]" ref='CountryCascader' />
            </div>
            <div class="tag-item-wrap" v-for="(item, index) in renderList" :key="index">
                <div class="tag-item-title" v-if="item.isShow">
                    {{ item.title }}
                </div>
                <div class="tag-select-wrap">
                    <template v-for="selectItem in item.list">
                        <div @click="handleSelectStatus(item.title, selectItem.name)" v-if="selectItem.type === 3"
                            :class="selectItem.isClick ? 'tag-select-item is-click' : 'tag-select-item'">
                            {{ selectItem.name }}
                        </div>
                        <!-- <input v-if="selectItem.type === 5 && item.isShow" placeholder="请输入摩托车型号" v-model="selectItem.name"
                            type="text"> -->
                    </template>
                </div>
            </div>
        </div>
    </a-drawer>
</template>

<script>
import Core from '../../../core'
import China2Address from '../../../components/common/China2Address.vue'
import Static from '../static'
export default {
    name: "AddTag",
    components: {
        China2Address
    },
    props: {
        addTagShow: {
            type: Boolean,
            default: false
        },
    },
    data() {
        return {
            Core,
            form: {
                province: '', 
                city: '',    
            },
            renderList: Static.renderList
        };
    },
    computed: {

    },
    methods: {
        // 选择用车城市
        handleCitySearch(e) {
            this.form.province = e.province
            this.form.city = e.city
        }
    },
}
</script>
<style lang="less">
.ant-drawer-title {
    font-size: 18px;
    font-weight: 600;
    color: #1D2129;
}
.ant-drawer-body {
    padding: 16px 20px 20px 20px;
    box-sizing: border-box;
}
.add-tag-close-icon {
    width: 24px;
    height: 24px;
    cursor: pointer;
}
.add-tag-tip {
    margin-bottom: 16px;
    color: #F77234;
    font-size: 14px;
}
.add-tag-drawer-item {
    width: 100%;
    display: flex;
    align-items: center;
}
.ant-cascader {
    width: 290px;
}
.tag-item-wrap {
    margin-top: 20px;
    .tag-item-title {
        color:#1D2129;
        font-size: 16px;
        margin-bottom: 12px; 
    }
}
</style>