
<template>
    <a-drawer :keyboard="true" :maskClosable="true" :width="440" title="添加关注点" :visible="visible" :closable="false">
        <template #extra>
            <img @click="closeDrawer" class="add-tag-close-icon" src="../images/close-icon.png" alt="">
        </template>
        <template #footer>
            <a-button @click="handleReset">重置</a-button>
            <a-button type="primary" @click="handleSubmit">确定</a-button>
        </template>
        <div class="add-tag-tip">
            标签最多只能选3个，点击选中可取消
        </div>
        <div class="tag-item-wrap">
            <div class="tag-select-wrap">
                <div v-for="(item, index) in multipleChoiceList" :key="index" @click="handleSelectStatus(item.name)"
                    :class="item.isClick ? 'tag-select-item is-click' : 'tag-select-item'">
                    {{ item.name }}
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
        visible: {
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
            multipleChoiceList: Static.multipleChoiceList,
        };
    },
    computed: {

    },
    methods: {
        closeDrawer() {
            this.$emit('update:visible', false);
        },
        handleSelectStatus(name) {
            const selectedItems = this.multipleChoiceList.filter(item => item.isClick);
            const selectedItem = this.multipleChoiceList.find(item => item.name === name);
            if (selectedItem.isClick) {
                selectedItem.isClick = false;
            } else if (selectedItems.length < 3) {
                selectedItem.isClick = true;
            }
        },
        // 提交
        handleSubmit() {
            // Core.Api.User.labelUpdate({
            //     target_id: this.id,
            //     // target_type: 2,
            //     label_list: this.selectedTagList
            // }).then(res => {

            // }).catch(err => {
            //     Core.Logger.error('handleSubmit err', err)
            // })
            this.$emit('submit');
        },
        // 重置
        handleReset() {
            this.multipleChoiceList = [
                {
                    name: '续航',
                    isClick: false
                },
                {
                    name: '服务',
                    isClick: false
                },
                {
                    name: '质量',
                    isClick: false
                },
                {
                    name: '外观',
                    isClick: false
                },
                {
                    name: '性能',
                    isClick: false
                },
                {
                    name: '舒适',
                    isClick: false
                },
                {
                    name: '安全',
                    isClick: false
                },
                {
                    name: '储物空间',
                    isClick: false
                },
                {
                    name: '智能',
                    isClick: false
                },
                {
                    name: '改装',
                    isClick: false
                },
                {
                    name: '销售政策',
                    isClick: false
                },
                {
                    name: '售后政策',
                    isClick: false
                },
                {
                    name: '价格',
                    isClick: false
                },
                {
                    name: '品牌顾虑',
                    isClick: false
                },
                {
                    name: '售后',
                    isClick: false
                },
                {
                    name: '保值率',
                    isClick: false
                },
                {
                    name: '提车时间',
                    isClick: false
                },
            ]
            this.selectedTagList = []
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
        color: #1D2129;
        font-size: 16px;
        font-weight: 400;
    }

    .tag-select-wrap {
        width: 100%;
        display: flex;
        flex-wrap: wrap;
    }

    input {
        width: 410px;
        height: 32px;
        border-radius: 4px;
        border: 1px solid #F2F3F5;
        background: #FFF;
        font-size: 15px;
        text-align: center;
        outline: none;
        margin-top: 12px;
    }

    .tag-select-item {
        margin-right: calc((100% - 130px * 3) / 2);
        margin-top: 11px;
        width: 130px;
        height: 32px;
        color: #4E5969;
        font-size: 15px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 4px;
        border: 1px solid #F2F3F5;
        background: #FFF;
        cursor: pointer;

        &:nth-of-type(3n) {
            margin-right: 0;
        }

        &.is-click {
            border-radius: 8rpx;
            border: 1px solid #99C0FF;
            color: #3381FF;
            background-color: #E6EFFF;
            font-weight: 600;
        }
    }

}

.ant-drawer-footer {
    display: flex;
    justify-content: flex-end;
}

.ant-btn {
    width: 80px;
    height: 32px;
}
</style>