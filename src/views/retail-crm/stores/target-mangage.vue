<template>
    <div class="target-manage">
        <div class="area-select list-container">
            <p class="title">目标管理</p>
            <div class="tree-area">
                <a-tree
                    class="tree"
                    v-model:selectedKeys="searchform.selectedKeys"
                    :treeData="treeData"
                    :checkable="false"
                    :showLine="false"
                    :showIcon="false"
                    defaultExpandAll
                >
                </a-tree>
            </div>
        </div>
        <div class="area list-container">
            <div class="top-search">
                <div class="tab-area">
                    <a-radio-group v-model:value="searchform.timeKey">
                        <a-radio-button value="month">月度</a-radio-button>
                        <a-radio-button value="quarter">季度</a-radio-button>
                        <a-radio-button value="year">年度</a-radio-button>
                    </a-radio-group>
                </div>
                <div class="opreation">
                    <a-button>取消</a-button>
                    <a-button type="primary" @click="handleEdit">编辑</a-button>
                    <a-button type="primary" @click="handleSave">保存</a-button>
                </div>
            </div>
            <div class="all-pointer">
                <div class="item-title">12月总目标</div>
                <div class="content-area all-content">
                    <div class="chart-area" v-for="item in data">
                        <WhEcharts :options="item.options" height="100%" width="100%"> </WhEcharts>
                    </div>
                </div>
            </div>
            <a-tree :treeData="treeData_two" :checkable="false" :showLine="{ showLeafIcon: false }" defaultExpandAll>
                <!-- 自定义树状内容 -->
                <template #title="{ title, key }">
                    <div class="tree-title">
                        <div class="item-title">{{ title }}</div>
                        <div class="content-area">
                            <div class="chart-area" v-for="item in data">
                                <WhEcharts :options="item.options" height="100%" width="100%"> </WhEcharts>
                                <div class="edit-area">
                                    <div class="target">
                                        <div class="target-title">目标：</div>
                                        <div class="target-value">{{ item.target }}</div>
                                    </div>
                                    <div class="completed">
                                        <div class="completed-title">已完成：</div>
                                        <div class="completed-value" v-if="!edit">{{ item.value }}</div>
                                        <a-input v-model:value="item.value" v-else></a-input>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </template>
                <template #switcherIcon="{ expanded, switcherCls, title, children }">
                    <caret-down-outlined v-if="expanded" />
                    <caret-right-outlined v-else-if="switcherCls" />
                </template>
            </a-tree>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import WhEcharts from '@/components/echarts/index.vue';
import { CaretDownOutlined, CaretRightOutlined } from '@ant-design/icons-vue';

const edit = ref(false);
const searchform = reactive({
    timeKey: 'month',
    timeValue: '',
    selectedKeys: ['0'],
});
const treeData = [
    {
        title: '总目标',
        key: '0',
        children: [
            {
                title: '江苏大区',
                key: '0-0',
                children: [
                    {
                        title: '南京',
                        key: '0-0-0',
                        children: [
                            { title: '南京1店', key: '0-0-0-0' },
                            { title: '南京2店', key: '0-0-0-1' },
                        ],
                    },
                    { title: '苏州', key: '0-0-1' },
                    { title: '无锡', key: '0-0-2' },
                ],
            },
            { title: '浙江大区', key: '0-1' },
            { title: '江西大区', key: '0-2' },
        ],
    },
];
const treeData_two = [
    {
        title: '江苏大区',
        key: '0-0',
        children: [
            {
                title: '南京',
                key: '0-0-0',
                children: [
                    { title: '南京1店', key: '0-0-0-0' },
                    { title: '南京2店', key: '0-0-0-1' },
                ],
            },
            { title: '苏州', key: '0-0-1' },
            { title: '无锡', key: '0-0-2' },
        ],
    },
    { title: '浙江大区', key: '0-1' },
    { title: '江西大区', key: '0-2' },
];
// 测试
const data = [
    {
        title: '满意度',
        value: 30,
        target: 100,
    },
    {
        title: '注册',
        value: 40,
        target: 100,
    },
    {
        title: '试驾',
        value: 50,
        target: 100,
    },
    {
        title: '订单',
        value: 60,
        target: 100,
    },
    {
        title: '交付',
        value: 70,
        target: 100,
    },
];
const color = ['#F7BA1E', '#0061FF', '#00B42A', '#FF7D00', '#F53F3F'];

data.forEach((item, index) => {
    item.options = {
        title: {
            text: item.title,
            left: 'center',
            top: 0,
            textStyle: {
                color: '#1D2129',
                fontSize: 14,
                fontWeight: 600,
            },
        },
        percentPrecision: 0,
        emphasis: {},
        series: [
            {
                type: 'pie',
                radius: [32, 40],
                // center
                center: ['50%', '40%'],
                top: 20,
                avoidLabelOverlap: false, // 避免标注重叠
                data: [
                    {
                        name: '已完成',
                        value: item.value,
                        itemStyle: {
                            color: color[index],
                        },
                        label: {
                            show: true,
                            position: 'center',
                            formatter: '{d}%',
                            fontSize: 14,
                            fontWeight: 400,
                            color: '#1D2129',
                        },
                    },
                    {
                        name: '目标',
                        value: item.target - item.value,
                        label: {
                            show: false,
                        },
                        itemStyle: {
                            color: '#F7F8FA',
                        },
                    },
                ],
            },
        ],
    };
});

const options = reactive({
    title: {
        text: '总目标',
        left: 'center',
        top: 0,
        textStyle: {
            color: '#1D2129',
            fontSize: 14,
            fontWeight: 600,
        },
    },
    labelLine: {
        show: false,
    },
    series: [
        {
            type: 'pie',
            radius: [50, 60],
            top: 20,
            avoidLabelOverlap: false, // 避免标注重叠
            data: [
                {
                    name: '已完成',
                    value: 30,
                    itemStyle: {
                        color: '#F7BA1E',
                    },
                    label: {
                        show: true,
                        position: 'center',
                        formatter: '{d}%',
                        fontSize: 14,
                        fontWeight: 400,
                        color: '#1D2129',
                    },
                },
                {
                    name: '目标',
                    value: 100 - 30,
                    label: {
                        show: false,
                    },
                    itemStyle: {
                        color: '#F7F8FA',
                    },
                },
            ],
        },
    ],
});

const handleEdit = () => {
    edit.value = true;
};
const handleSave = () => {
    edit.value = false;
};
</script>

<style lang="less" scoped>
.target-manage {
    height: 100%;
    display: flex;
    .area-select {
        width: 190px;
        height: 100%;
        padding: 20px;
        border-right: 1px solid #e5e6eb !important;
        margin: 0 !important;
        .title {
            font-size: 16px;
            font-weight: bold;
            color: #333;
            margin-bottom: 20px;
        }
        .tree-area {
            :deep(.ant-tree-switcher) {
                display: none;
            }
            :deep(.ant-tree-treenode) {
                position: relative;
                margin-left: 16px;
                .ant-tree-indent {
                    // 前面添加竖线
                    &::before {
                        content: '';
                        position: absolute;
                        left: -16px;
                        top: 0;
                        bottom: 0;
                        width: 1px;
                        background-color: #f0f0f0;
                    }
                }
            }
            :deep(.ant-tree-treenode-selected) {
                color: #0061ff !important;
                background: transparent !important;
                .ant-tree-indent {
                    display: inline-block !important;
                    // 在前面添加外蓝内白的圆圈
                    &::after {
                        content: '';
                        position: absolute;
                        left: -19px;
                        top: 50%;
                        transform: translateY(-50%);
                        width: 8px;
                        height: 8px;
                        border-radius: 50%;
                        border: 2px solid #0061ff;
                        background-color: #fff;
                    }
                }
                .ant-tree-node-content-wrapper {
                    background-color: transparent !important;
                }
            }
        }
    }
    .area {
        flex: 1;
        height: 100%;
        margin: 0 !important;
        overflow-y: auto;
        padding: 20px;
        .top-search {
            display: flex;
            justify-content: space-between;
            margin-bottom: 20px;
        }
        .all-pointer {
            .all-content {
                background: var(--Brand-1, #e6efff);
            }
        }
    }
}
</style>

<style lang="less" scoped>
.item-title {
    color: var(--Color-text-1, #1d2129);
    font-family: PingFang SC;
    font-size: 16px;
    font-style: normal;
    font-weight: 600;
    line-height: normal;
    margin-bottom: 16px;
}
.content-area {
    border-radius: 4px;
    border: 1px solid rgba(51, 129, 255, 0.3);
    width: 100%;
    height: 240px;
    margin-bottom: 20px;
    padding: 16px;
    display: flex;
    justify-content: space-between;
}
.chart-area {
    height: 208px;
    padding: 16px;
    border-radius: 6px;
    border: 1px solid var(--Color-border-1, #f2f3f5);
    background: #fff;
    flex: 1;
    margin-right: 20px;
    position: relative;
    &:last-child {
        margin-right: 0;
    }
    .edit-area {
        display: flex;
        flex-direction: column;
        align-items: center;
        position: absolute;
        bottom: 10px;
        left: 50%;
        transform: translateX(-50%);
        .target,
        .completed {
            display: flex;
            align-items: center;
            .target-title,
            .completed-title {
                min-width: 60px;
            }
            .completed-value,
            .target-value {
                min-width: 30px;
                text-align: center;
            }
        }
    }
}
:deep(.ant-tree-treenode) {
    width: 100%;
    .ant-tree-node-content-wrapper {
        flex: 1;
    }
    &:last-child {
        .ant-tree-switcher {
            &::after {
                display: none;
            }
        }
    }
}
:deep(.ant-tree-switcher-leaf-line) {
    &::after {
        border-bottom: 4px solid #d9d9d9 !important;
    }
    &::before {
        border-right: 4px solid #d9d9d9 !important;
    }
}
:deep(.ant-tree-switcher) {
    &::after {
        position: absolute;
        top: 25px;
        right: 12px;
        bottom: -4px;
        border-right: 4px solid #d9d9d9;
        content: '';
    }
}
:deep(.ant-tree-indent-unit-start) {
    &::before {
        border-right: 4px solid #d9d9d9 !important;
    }
}
:deep(.ant-tree-node-selected) {
    background: transparent !important;
}
</style>
