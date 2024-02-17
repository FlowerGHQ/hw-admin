<template>
    <a-drawer
        class="add-focus-drawer"
        :keyboard="true"
        :maskClosable="true"
        :width="440"
        title="添加关注点"
        :visible="visible"
        :closable="false"
    >
        <template #extra>
            <img @click="closeDrawer" class="add-tag-close-icon" src="../images/close-icon.png" alt="" />
        </template>
        <template #footer>
            <a-button @click="handleReset">重置</a-button>
            <a-button type="primary" @click="handleSubmit">确定</a-button>
        </template>
        <div class="add-tag-tip">标签最多只能选3个，点击选中可取消</div>
        <div class="tag-item-wrap">
            <div class="tag-select-wrap">
                <div
                    v-for="(item, index) in multipleChoiceList"
                    :key="index"
                    @click="handleSelectStatus(item.name)"
                    :class="item.isClick ? 'tag-select-item is-click' : 'tag-select-item'"
                >
                    {{ item.name }}
                </div>
            </div>
        </div>
    </a-drawer>
</template>

<script>
import Core from '../../../core';
import China2Address from '../../../components/common/China2Address.vue';
import Static from '../static';
export default {
    name: 'AddTag',
    components: {
        China2Address,
    },
    props: {
        id: {
            type: Number,
        },
        visible: {
            type: Boolean,
            default: false,
        },
        list: {
            type: Array,
            default: [],
        },
        isCreate: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            Core,
            form: {
                province: '',
                city: '',
            },
            multipleChoiceList: [],
            detailList: [],
        };
    },
    computed: {},
    mounted() {
        this.multipleChoiceList = Core.Util.deepCopy(Static.multipleChoiceList);
        this.transformLabelData();
    },
    methods: {
        // 关闭drawer
        closeDrawer() {
            this.$emit('update:visible', false);
        },
        // 更新选中状态
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
            this.selectedTagList = this.multipleChoiceList
                .filter(item => item.isClick)
                .map(item => ({
                    name: item.name,
                    type: item.type,
                }));
            Core.Logger.log('selectedTagList', this.selectedTagList);
            if (!this.isCreate) {
                Core.Api.CustomService.updateLabel({
                    target_id: this.id,
                    label_list: this.selectedTagList,
                })
                    .then(res => {
                        Core.Logger.log('handleSubmit res', res);
                        this.$message.success('修改成功！');
                        this.$emit('submit');
                        this.$emit('updateLabel');
                        this.closeDrawer();
                    })
                    .catch(err => {
                        Core.Logger.log('handleSubmit err', err);
                    });
            } else {
                this.$emit('finish', this.selectedTagList);
            }
        },
        // 重置
        handleReset() {
            this.multipleChoiceList = Core.Util.deepCopy(Static.multipleChoiceList);
            this.selectedTagList = [];
        },
        // 转化回显数据
        transformLabelData() {
            if (this.list.length) {
                this.list.forEach(item => {
                    if (item.type === Core.Const.INTENTION.TAG_TYPE.FOCUS) {
                        this.detailList = item.label_list;
                    }
                });
            }
            this.detailList.forEach(label => {
                this.multipleChoiceList.forEach(item => {
                    if (item.name === label.name && item.type === label.type) {
                        item.isClick = true;
                    }
                });
            });
        },
    },
};
</script>
<style lang="less">
.add-focus-drawer {
    .ant-drawer-title {
        font-size: 18px;
        font-weight: 600;
        color: #1d2129;
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
        color: #f77234;
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
            color: #1d2129;
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
            border: 1px solid #f2f3f5;
            background: #fff;
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
            color: #4e5969;
            font-size: 15px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 4px;
            border: 1px solid #f2f3f5;
            background: #fff;
            cursor: pointer;

            &:nth-of-type(3n) {
                margin-right: 0;
            }

            &.is-click {
                border-radius: 8rpx;
                border: 1px solid #99c0ff;
                color: #3381ff;
                background-color: #e6efff;
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
}
</style>
