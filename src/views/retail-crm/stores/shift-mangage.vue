<template>
    <div>
        <div class="classes">
            <p class="title">
                班次管理<a-button type="primary" style="float: right" @click="creatTemplate">创建班次模板</a-button>
            </p>
            <div class="select">
                <span class="select-item select-title">未分配门店</span>
                <a-dropdown class="select-item" :trigger="['click']">
                    <a class="ant-dropdown-link" :style="{ color: group ? '#1D2129' : '#86909C' }" @click.prevent>
                        {{ group || '所属区域' }}&nbsp;<DownOutlined style="color: #86909c" />
                    </a>
                    <template #overlay>
                        <a-menu @click="selectGroup" style="max-height: 350px; overflow-y: auto">
                            <a-menu-item v-for="item in regionsList" :key="item.id">
                                <a href="javascript:;">{{ item.name }}</a>
                            </a-menu-item>
                        </a-menu>
                    </template>
                </a-dropdown>
                <a-dropdown class="select-item" :disabled="!searchForm.group_id" :trigger="['click']">
                    <a class="ant-dropdown-link" :style="{ color: city ? '#1D2129' : '#86909C' }" @click.prevent>
                        {{ city || '所属城市' }}&nbsp;<DownOutlined style="color: #86909c" />
                    </a>
                    <template #overlay>
                        <a-menu @click="selectCity" style="max-height: 350px; overflow-y: auto">
                            <a-menu-item v-for="item in cityList" :key="item.city">
                                <a href="javascript:;">{{ item.city }}</a>
                            </a-menu-item>
                        </a-menu>
                    </template>
                </a-dropdown>
            </div>
            <div class="drag">
                <template v-for="(item, index) in arr" :key="item.id">
                    <div
                        class="drag-box"
                        :id="index"
                        draggable="true"
                        @dragstart="event => dragStart(event, item)"
                        @dragend="dragend"
                    >
                        <img src="@/assets/images/retail-crm/store-image.png" />
                        <p class="drag-box-name">{{ item.name }}</p>
                        <p class="drag-box-area">{{ item.name }}</p>
                    </div>
                </template>
            </div>
        </div>
        <div class="template">
            <p class="title" style="margin-bottom: 4px">模板管理</p>
            <div class="template-container">
                <div
                    :class="`template-container-item template-container-item${item.id}`"
                    v-for="(item, index) in templateNum"
                    :key="index"
                    @dragleave="e => dragLeave(e, item.id)"
                    @dragenter="e => dragEnter(e, item.id)"
                    @dragover="dragOver"
                    @drop="e => drop(e, index)"
                >
                    <div class="time">
                        <div class="time-title">
                            <div class="time-title-text">
                                {{ item.title
                                }}<img
                                    class="time-title-edit"
                                    src="@/assets/images/retail-crm/edit.png"
                                    @click="edit(item.id, item.title)"
                                />
                            </div>
                            <div class="time-title-delete" @click="deleteTemplate(item.id)">
                                <img class="time-title-deleteImg" src="@/assets/images/retail-crm/delete.png" />删除
                            </div>
                        </div>
                        <div class="time-container">
                            <div
                                class="time-item"
                                :style="{ background: Core.Const.RETAIL_CRM.TIME_MAP[itemTime.name].background }"
                                v-for="(itemTime, indexTime) in item.timeList"
                                :key="index"
                            >
                                <div
                                    class="time-item-top"
                                    :style="{ background: Core.Const.RETAIL_CRM.TIME_MAP[itemTime.name].color }"
                                ></div>
                                <p
                                    class="time-item-name"
                                    :style="{ color: Core.Const.RETAIL_CRM.TIME_MAP[itemTime.name].color }"
                                >
                                    {{ itemTime.name }}
                                </p>
                                <a-time-range-picker
                                    style="background-color: #fff !important"
                                    format="HH:mm"
                                    :bordered="false"
                                    v-model:value="itemTime.time"
                                />
                            </div>
                        </div>
                    </div>
                    <div class="drop">
                        <p v-if="item.storeList.length > 0">配置门店（{{ item.storeList.length }}）</p>
                        <div :class="`drop-box drop-box-${index}`">
                            <div
                                class="drag-box"
                                v-for="(itemStore, indexStore) in item.storeList"
                                :key="itemStore.id"
                                draggable="true"
                                @dragstart="event => dragStart(event, itemStore)"
                                @dragend="dragend"
                            >
                                <img src="@/assets/images/retail-crm/store-image.png" />
                                <p class="drag-box-name">{{ itemStore.name }}</p>
                                <div class="drag-box-area">
                                    {{ itemStore.name }}
                                    <div
                                        style="float: right"
                                        class="delete"
                                        @click="deleteStore(index, itemStore.id)"
                                    ></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <a-modal v-model:visible="visible" title="模板名称修改" @ok="handleOk">
            <a-input v-model:value="templateName" />
        </a-modal>
        <a-modal v-model:visible="visibleDelete" centered title="">
            <template #footer>
                <div style="text-align: center">
                    <a-button @click="visibleDelete = false">取消</a-button>
                    <a-button type="primary" danger @click="handleDelete">确定</a-button>
                </div>
            </template>
            <p class="modal-title"><img src="@/assets/images/retail-crm/warning.png" />确认删除该排班模板？</p>
            <p class="modal-content">删除后，该模板内的门店，都会回到未分配门店</p>
        </a-modal>
    </div>
</template>

<script>
import Core from '@/core';
import { DownOutlined } from '@ant-design/icons-vue';
import dayjs from 'dayjs';
export default {
    name: 'ShiftMangage',
    components: {
        DownOutlined,
    },
    data() {
        return {
            Core,
            visible: false,
            visibleDelete: false,
            city: '',
            searchForm: {
                group_id: undefined,
                city: undefined,
            },
            regionsList: [],
            arr: [
                { id: 1, name: '门店1' },
                { id: 2, name: '门店2' },
                { id: 3, name: '门店3' },
                { id: 4, name: '门店4' },
            ],
            templateNum: [
                {
                    id: 1,
                    title: '商场门店班次模板1',
                    timeList: [
                        { name: '早', time: [dayjs('09:00', 'HH:mm'), dayjs('18:00', 'HH:mm')] },
                        { name: '上', time: [dayjs('09:00', 'HH:mm'), dayjs('18:00', 'HH:mm')] },
                        { name: '中', time: [dayjs('09:00', 'HH:mm'), dayjs('18:00', 'HH:mm')] },
                        { name: '下', time: [dayjs('09:00', 'HH:mm'), dayjs('18:00', 'HH:mm')] },
                        { name: '晚', time: [dayjs('09:00', 'HH:mm'), dayjs('18:00', 'HH:mm')] },
                    ],
                    storeList: [],
                },
            ],
            startIndex: null,
            editId: null,
            deleteId: null,
            templateName: '',
            lastEnterEle: null,
        };
    },
    watch: {},
    computed: {
        group() {
            if (this.searchForm.group_id) {
                let list = [];
                list = this.regionsList.filter(el => {
                    return this.searchForm.group_id == el.id;
                });
                return list[0]?.name || '';
            } else {
                return '';
            }
        },
        // 区域城市
        cityList() {
            let list = [];
            list = this.regionsList.filter(el => {
                return this.searchForm.group_id == el.id;
            });
            return list[0]?.city_list || [];
        },
    },
    mounted() {
        this.getRegionsData();
    },
    methods: {
        selectGroup(e) {
            if (this.searchForm.group_id === e.key) return;
            this.searchForm.group_id = e.key;
            this.city = '';
        },
        selectCity(e) {
            this.city = e.key;
        },
        // 获取区域
        getRegionsData() {
            Core.Api.RETAIL.regionsList({
                key: '',
            })
                .then(res => {
                    this.regionsList = res.list;
                })
                .catch(err => {});
        },
        creatTemplate() {
            let id = 1;
            if (this.templateNum.length > 0) {
                id = Number(this.templateNum[this.templateNum.length - 1].id + 1);
                console.log(id);
            }
            this.templateNum.push({
                id,
                title: '商场门店班次模板' + id,
                timeList: [
                    { name: '早', time: [dayjs('09:00', 'HH:mm'), dayjs('18:00', 'HH:mm')] },
                    { name: '上', time: [dayjs('09:00', 'HH:mm'), dayjs('18:00', 'HH:mm')] },
                    { name: '中', time: [dayjs('09:00', 'HH:mm'), dayjs('18:00', 'HH:mm')] },
                    { name: '下', time: [dayjs('09:00', 'HH:mm'), dayjs('18:00', 'HH:mm')] },
                    { name: '晚', time: [dayjs('09:00', 'HH:mm'), dayjs('18:00', 'HH:mm')] },
                ],
                storeList: [],
            });
        },
        deleteTemplate(id) {
            this.deleteId = id;
            this.visibleDelete = true;
        },
        handleOk() {
            console.log('handleOk');
            const index = this.templateNum.findIndex(item => item.id === this.editId);
            this.templateNum[index].title = this.templateName;
            this.visible = false;
        },
        handleDelete() {
            this.templateNum = this.templateNum.filter(a => a.id !== this.deleteId);
            this.visibleDelete = false;
        },
        edit(id, name) {
            this.editId = id;
            this.templateName = name;
            this.visible = true;
        },
        deleteStore(index, id) {
            this.templateNum[index].storeList = this.templateNum[index].storeList.filter(a => a.id !== id);
        },
        dragStart(event, item) {
            const parentNode = event.target.parentNode;
            const classList = parentNode.classList;
            if (classList[0] === 'drop-box') {
                this.startIndex = Number(classList[1].split('-')[2]);
            } else {
                this.startIndex = null;
            }
            // 设置拖拽数据
            event.dataTransfer.setData('text/plain', JSON.stringify(item));
        },
        dragEnter(event, id) {
            event.preventDefault(); // 阻止默认行为，使元素可放置
            this.lastEnterEle = event.target;
            console.log(this.startIndex);
            const element = document.querySelector(`.template-container-item${id}`);
            if (element.style.backgroundColor === '' || element.style.border === '') {
                // 添加拖拽进入样式
                element.style.backgroundColor = '#F7F8FA';
                element.style.border = '1px solid #0061FF';
            }
        },
        dragLeave(event, id) {
            event.preventDefault(); // 阻止默认行为，使元素可放置
            if (this.lastEnterEle === event.target) {
                // 清除样式
                const element = document.querySelector(`.template-container-item${id}`);
                element.style.backgroundColor = '';
                element.style.border = '';
            }
        },
        dragOver(event) {
            event.preventDefault(); // 阻止默认行为，使元素可放置
        },
        drop(event, index) {
            event.preventDefault(); // 阻止默认行为，使元素可放置
            const data = JSON.parse(event.dataTransfer.getData('text/plain')); // 获取拖拽数据
            // const draggedElement = document.getElementById(data);
            // const droppedElement = document.querySelector(`.drop-box-${index}`)
            // droppedElement.appendChild(draggedElement); // 将拖拽元素放置到目标元素中
            if (this.startIndex || this.startIndex === 0) {
                this.templateNum[this.startIndex].storeList = this.templateNum[this.startIndex].storeList.filter(
                    a => a.id !== data.id,
                );
            }
            const indexS = this.templateNum[index].storeList.findIndex(item => item.id === data.id); // 防止重复
            if (indexS === -1) {
                this.templateNum[index].storeList.push(data);
            }
            // 清除样式
            const element = document.querySelector(`.template-container-item${this.templateNum[index].id}`);
            element.style.backgroundColor = '';
            element.style.border = '';
        },
        dragend(event) {
            console.log('完成拖动', event, this.startIndex);
        },
    },
};
</script>

<style lang="less" scoped>
.classes,
.template {
    border-radius: 6px;
    padding: 20px;
    background-color: #fff;
    .title {
        color: #1d2129;
        font-size: 18px;
        font-weight: 600;
        margin-bottom: 20px;
    }
    .select {
        margin-bottom: 20px;
        &-title {
            color: #1d2129;
            font-size: 16px;
            font-weight: 600;
        }
        .ant-dropdown-link {
            color: #86909c;
        }
        &-item {
            &:nth-child(n) {
                margin-right: 40px;
            }
        }
    }
    .drag {
        display: flex;
    }
}
.drag-box {
    padding: 12px;
    background-color: #fff;
    margin-right: 14px;
    margin-bottom: 14px;
    border-radius: 4px;
    border: 1px solid #f2f3f5;
    cursor: pointer;
    &:hover {
        transform: scale(1.03);
        border: 1px solid #0061ff;
    }
    &:last-child {
        margin-right: 0;
    }
    > img {
        width: 198px;
        height: 112px;
        border-radius: 4px;
        margin-bottom: 12px;
        -webkit-user-drag: none; /* Safari */
        -khtml-user-drag: none; /* Konqueror HTML */
        -moz-user-drag: none; /* Firefox */
        -o-user-drag: none; /* Opera (not tested) */
        user-drag: none;
        -webkit-user-select: none; /* Safari */
        -khtml-user-select: none; /* Konqueror HTML */
        -moz-user-select: none; /* Firefox */
        -o-user-select: none; /* Opera (not tested) */
        user-select: none;
    }
    &-name {
        color: #1d2129;
        font-size: 14px;
        font-weight: 600;
        margin-bottom: 4px;
    }
    &-area {
        color: #86909c;
        font-size: 12px;
    }
}
.classes {
    margin-bottom: 16px;
}
.template {
    .time {
        &-title {
            display: flex;
            justify-content: space-between;
            &-text {
                display: flex;
                align-items: center;
                color: #1d2129;
                font-size: 16px;
                font-weight: 500;
            }
            &-edit {
                height: 16px;
                width: 16px;
                margin-left: 8px;
                cursor: pointer;
            }
            &-delete {
                display: flex;
                align-items: center;
                color: #86909c;
                font-size: 14px;
                cursor: pointer;
            }
            &-deleteImg {
                height: 16px;
                width: 16px;
                margin-right: 8px;
            }
        }
        .time-container {
            .time-item {
                padding: 24px 8px 15px 8px;
                background-color: rgba(255, 247, 232, 0.5);
                position: relative;
                .time-item-name {
                    font-size: 16px;
                    font-weight: 600;
                    text-align: center;
                    margin-bottom: 13px;
                }
                .time-item-top {
                    display: inline-block;
                    position: absolute;
                    top: 0;
                    left: 0;
                    height: 6px;
                    width: 100%;
                }
            }
        }
    }
    &-container {
        display: flex;
        flex-wrap: wrap;
        &-item {
            width: 536px;
            margin-top: 16px;
            margin-right: 16px;
            border-radius: 4px;
            padding: 16px 16px 2px 16px;
            border: 1px solid #f2f3f5;
            .time {
                width: 100%;
                .time-container {
                    display: flex;
                    flex-wrap: wrap;
                    padding: 20px 0 6px 0;
                    .time-item {
                        margin-right: 14px;
                        margin-bottom: 14px;
                        width: calc((100% - 28px) / 3);
                        &:nth-child(3n) {
                            margin-right: 0;
                        }
                    }
                }
            }
        }
    }
    .drop-box {
        display: flex;
        flex-wrap: wrap;
        padding-top: 12px;
        // background-color: #FFF;
    }
}
.delete {
    width: 16px;
    height: 16px;
    background-image: url(../../../assets/images/retail-crm/delete.png);
    background-repeat: no-repeat;
    background-size: 100% 100%;
    cursor: pointer;
    &:hover {
        background-image: url(../../../assets/images/retail-crm/delete-hover.png);
    }
}
.modal-title {
    display: flex;
    align-items: center;
    justify-content: center;
    color: #1d2129;
    font-size: 16px;
    font-weight: 500;
    margin-bottom: 24px;
    > img {
        width: 20px;
        height: 20px;
        margin-right: 8px;
    }
}
.modal-content {
    color: #1d2129;
    font-size: 14px;
    text-align: center;
}
</style>
