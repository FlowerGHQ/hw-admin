
<template>
    <a-drawer class="add-tag-drawer" :keyboard="true" :maskClosable="true" :width="470" title="添加标签" :visible="visible"
        :closable="false">
        <template #extra>
            <img @click="closeDrawer" class="add-tag-close-icon" src="../images/close-icon.png" alt="">
        </template>
        <template #footer>
            <a-button @click="handleReset">重置</a-button>
            <a-button type="primary" @click="handleSubmit">确定</a-button>
        </template>
        <div class="add-tag-tip">
            每项只能只能单选一个标签
        </div>
        <div class="add-tag-drawer-item">
            <div class="add-tag-drawer-key">
                用车城市：
            </div>
            <div class="add-tag-drawer-value">
                <China2Address @search="handleCitySearch" :defArea="[form.province, form.city]" ref='CountryCascader' />
            </div>
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
                    <input v-if="selectItem.type === 5 && item.isShow" placeholder="请输入摩托车型号" v-model="selectItem.name"
                        type="text">
                </template>
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
        list: {
            type: Array,
            default: []
        }
    },
    data() {
        return {
            Core,
            form: {
                province: '',
                city: '',
            },
            renderList: [],
            detailList: [],
        };
    },
    computed: {

    },
    mounted() {
        this.renderList = Core.Util.deepCopy(Static.renderList)
        this.transformLabelData();
    },
    methods: {
        // 关闭drawer
        closeDrawer() {
            this.$emit('update:visible', false);
        },
        // 选择用车城市
        handleCitySearch(e) {
            this.form.province = e.province
            this.form.city = e.city
        },
        // 更新选中状态
        handleSelectStatus(clickedTitle, clickedOption) {
            for (const item of this.renderList) {
                if (item.title === clickedTitle) {
                    const clickedList = item.list; // 保存点击项所在的 list
                    for (const option of clickedList) {
                        if (option.name === clickedOption) {
                            option.isClick = !option.isClick; // 取反
                        } else {
                            option.isClick = false; // 其他项设为 false
                        }
                    }
                }
            }
            // 如果选中有摩托车那一项 就将摩托车型号的isShow变为展示状态
            if (this.renderList[1].list[0].isClick) {
                this.renderList[2].list[0].isClick = true
                this.renderList[2].isShow = true
            } else {
                this.renderList[2].list[0].isClick = false
                this.renderList[2].isShow = false
            }
        },
        // 提交数据转化
        convertDataStructure(renderList) {
            const labelList = [];
            renderList.forEach((item) => {
                if (item.isShow) {
                    item.list.forEach((listItem) => {
                        if (listItem.isClick) {
                            labelList.push({
                                name: listItem.name,
                                type: listItem.type,
                            });
                        }
                    });
                }
            });
            if (this.form.city) {
                labelList.push({
                    name: this.form.city,
                    type: Core.Const.INTENTION.TAG_TYPE.CITY
                })
            }
            return labelList;
        },
        // 提交
        handleSubmit() {
            this.selectedTagList = this.convertDataStructure(this.renderList)
            Core.Logger.log('selectedTagList', this.selectedTagList)
            Core.Api.CustomService.updateLabel({
                // target_id: this.id,
                target_id: 3074,
                label_list: this.selectedTagList
            }).then(res => {
                Core.Logger.log('handleSubmit res', res);
                this.$message.success('修改成功！')
                this.$emit('submit');
                this.closeDrawer();
            }).catch(err => {
                Core.Logger.log('handleSubmit err', err)
            })
        },
        // 重置
        handleReset() {
            this.renderList = Core.Util.deepCopy(Static.renderList)
            this.form.city = ''
            this.selectedTagList = []
        },
        // 转化回显数据
        transformLabelData() {
            if (this.list.length) {
                this.list.forEach(item => {
                    if (item.type === Core.Const.INTENTION.TAG_TYPE.TAG) {
                        this.detailList = item.label_list
                    } else if (item.type === Core.Const.INTENTION.TAG_TYPE.CITY) {
                        this.form.city = item.label_list[0].name
                    } else if (item.type === Core.Const.INTENTION.TAG_TYPE.MODEL) {
                        this.renderList[2].isShow = true
                        this.renderList[2].list[0].name = item.label_list[0].name
                        this.renderList[2].list[0].isClick = true
                    }
                })
            }
            this.detailList.forEach((label) => {
                this.renderList.forEach((item) => {
                    item.list.forEach((listItem) => {
                        if (listItem.name === label.name && listItem.type === label.type) {
                            listItem.isClick = true;
                            item.isShow = true;
                        }
                        if (label.type === Core.Const.INTENTION.TAG_TYPE.CITY) {
                            this.form.city = label.name
                        }
                    });
                });
            });
        },
    },
}
</script>
<style lang="less">
.add-tag-drawer {
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