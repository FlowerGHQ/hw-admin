<template>
    <div class="fittings-three">
        <div class="explosion-diagram">
            <div class="explosion-diagram-tip">
                <a-tooltip title="①上传配件，②上传爆炸图，③配置点位">
                    <div class="tip-wrap">
                        <img class="tip-icon" :src="tipIcon" alt="" />
                        <div class="tip-text">
                            {{
                                $t(
                                    /*操作说明*/ "item-bom.operation_instructions"
                                )
                            }}
                        </div>
                    </div>
                </a-tooltip>

                <div class="operation"></div>
            </div>
            <div class="explosion-diagram-bottom">
                <div class="empty-upload-container">
                    <img :src="uploadPic" alt="" />
                    <div class="empty-upload-flex-wrap">
                        <div class="empty-upload-tip">
                            {{ $t("item-bom.upload_text") }}
                        </div>
                        <a-button
                            class="empty-upload-btn"
                            type="primary"
                            @click="clickShowAdd(true, false)"
                        >
                            {{ $t(/*上传爆炸图*/ "item-bom.upload_explosion") }}
                        </a-button>
                    </div>
                </div>
            </div>
        </div>
        <div class="fittings-table-container">
            <div class="title">
                {{ $t("item-bom.accessories_list") }}
            </div>
            <a-table
                :row-key="(record) => record.id"
                :data-source="realData"
                :columns="tableColumns"
                :scroll="{ x: true }"
                :pagination="channelPagination"
                :loading="loading"
                @change="handleTableChange"
            >
                <template #headerCell="{ title, column }">
                    <div class="table-title">{{ title }}</div>
                </template>
                <template #bodyCell="{ text, record, index, column }">
                    <div class="ordinal" v-if="column.key === 'ordinal'">
                        <!--a-input 可编辑输入框改变页码 -->
                        <a-input
                            v-model:value="record.ordinal"
                            :style="{ width: '100%' }"
                            @change="onOrdinalChange(record, index)"
                        />
                    </div>
                    <span v-if="column.key === 'name' /*商品名称*/">
                        <a-tooltip>
                            <template #title>{{ text }}</template>
                            <div
                                class="one-spils cursor"
                                :style="{
                                    width:
                                        text?.length > 6 ? 7 * 12 + 'px' : '',
                                }"
                            >
                                {{ text }}
                            </div>
                        </a-tooltip>
                    </span>
                    <span v-if="column.key === 'sales_area' /*销售区域*/">
                        <a-tooltip>
                            <template #title>{{ text }}</template>
                            <div
                                class="one-spils cursor"
                                :style="{
                                    width:
                                        text?.length > 5 ? 6 * 12 + 'px' : '',
                                }"
                            >
                                {{ text }}
                            </div>
                        </a-tooltip>
                    </span>
                    <span v-if="column.key === 'create_time' /*创建时间*/">
                        {{ $Util.timeFilter(text) }}
                    </span>
                    <span v-if="column.key === 'remark' /*备注*/">
                        <a-tooltip>
                            <template #title>{{ text }}</template>
                            <div class="one-spils set-width cursor">
                                {{ text }}
                            </div>
                        </a-tooltip>
                    </span>
                </template>
                <template #emptyText>
                    <div class="empty-add-item-container">
                        <img :src="emptyImage" alt="" />
                        <div class="empty-add-item-text-wrap">
                            <div class="empty-add-item-tip">
                                {{ $t("item-bom.explosion_diagram") }}
                            </div>
                            <div
                                class="disable-add-btn"
                                @click="onAddFittings"
                                type="primary"
                            >
                                {{ $t("item-bom.add_fittings") }}
                            </div>
                        </div>
                    </div>
                </template>
            </a-table>
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref, getCurrentInstance, computed } from "vue";
import Core from "@/core";
const emptyImage =
    "http://horwin-app.oss-cn-hangzhou.aliyuncs.com/png/12516f00dce1e02da63e405e578c65ea6c82e4c4f5e8c750dc64afa1c1ca7450.png";
const tipIcon =
    "http://horwin-app.oss-cn-hangzhou.aliyuncs.com/png/fdbe378097b4f3f08dbf97bd49d7dae700b138d2827db87d6bc5001d46fa3364.png";
const uploadPic =
    "http://horwin-app.oss-cn-hangzhou.aliyuncs.com/png/b3f294686cc11e3cacbe2c7ea720b740574c051623cd75a00efec3e6aece72d6.png";

const { proxy } = getCurrentInstance();
const loading = ref(false);

const tableColumns = computed(() => {
    const result = [
        {
            // 序号
            title: proxy.$t("item-bom.ordinal"),
            dataIndex: "ordinal",
            key: "ordinal",
        },
        {
            // 商品编码
            title: proxy.$t("item-bom.commodity_code"),
            dataIndex: "name",
            key: "detail",
        },
        {
            // 版本号
            title: proxy.$t("item-bom.version_number"),
            dataIndex: "name",
            key: "detail",
        },
        {
            // 用量
            title: proxy.$t("item-bom.dosage"),
            dataIndex: "name",
            key: "detail",
        },
        {
            // 销售区域
            title: proxy.$t("item-bom.sales_area"),
            dataIndex: "sales_area",
            key: "sales_area",
        },
        {
            // 创建时间
            title: proxy.$t("item-bom.create_time"),
            dataIndex: "create_time",
            key: "create_time",
        },
        {
            // 备注
            title: proxy.$t("item-bom.remark"),
            dataIndex: "remark",
            key: "remark",
        },
    ];
    return result;
});
const tableData = ref([]);

// 分页
const channelPagination = ref({
    current: 1,
    pageSizeOptions: ["20", "40", "60", "80", "100"],
    pageSize: 20,
    showQuickJumper: true, // 是否可以快速跳转至某页
    showSizeChanger: true, // 是否可以改变 pageSize
    total: 0,
    showTotal: (total) =>
        `${proxy.$t("n.all_total")} ${total} ${proxy.$t("in.total")}`,
});
// tableData增加序号的字段
const realData = computed(() => {
    const result = tableData.value.map((item, index) => {
        return {
            ...item,
            editOrdinal: false,
            ordinal:
                (channelPagination.value.current - 1) *
                    channelPagination.value.pageSize +
                1 +
                index,
        };
    });
    return result;
});
console.log("realData", realData);
onMounted(() => {
    getTableDataFetch();
});
/* Fetch start*/
// 获取表格list
const getTableDataFetch = (parmas = {}) => {
    loading.value = true;
    let obj = {
        flag_spread: 1,
        page: 1,
        page_size: 20,
        status: "0",
        ...parmas,
    };

    Core.Api.Item.list(obj)
        .then((res) => {
            channelPagination.value.total = res.count;
            tableData.value = res.list;
            loading.value = false;
        })
        .catch((err) => {
            console.log("getTableDataFetch", err);
            loading.value = false;
        });
};
/* Fetch end*/

/* methods start*/
// 添加配件
const onAddFittings = () => {
    console.log("添加配件");
};
// 分页事件
const handleTableChange = (pagination, filters, sorter) => {
    const pager = { ...channelPagination.value };
    pager.current = pagination.current;
    if (pagination.pageSize !== channelPagination.value.pageSize) {
        pager.current = 1;
        pager.pageSize = pagination.pageSize;
    }
    channelPagination.value = pager;
    getTableDataFetch({
        page_size: channelPagination.value.pageSize,
        page: channelPagination.value.current,
    });
};
/* methods end*/
</script>

<style lang="less" scoped>
.fittings-three {
    .explosion-diagram {
        width: 100%;
        min-height: 158px;
        border: 1px solid #e2e2e2;
        padding: 20px 20px 40px 20px;

        .explosion-diagram-tip {
            display: flex;
            .tip-wrap {
                display: flex;
                align-items: center;
                .tip-icon {
                    width: 16px;
                    height: 16px;
                }
                .tip-text {
                    margin-left: 5px;
                    color: #666;
                    font-family: PingFang SC;
                    font-size: 16px;
                    font-weight: 400;
                }
            }

            .operation {
            }
        }
        .explosion-diagram-bottom {
            .empty-upload-container {
                width: 100%;
                display: flex;
                justify-content: center;
                align-items: center;
                .empty-upload-flex-wrap {
                    margin-left: 10px;
                    display: flex;
                    flex-direction: column;
                    align-items: flex-start;
                }
                > img {
                    width: 99px;
                    height: 78px;
                }

                .empty-upload-tip {
                    color: #333;
                    font-size: 14px;
                    font-style: normal;
                    font-weight: 400;
                    line-height: normal;
                    margin-bottom: 10px;
                }

                .empty-upload-btn {
                    // margin-bottom: 40px;
                }
            }
        }
    }
    .fittings-table-container {
        margin-top: 20px;
        .title {
            color: #1d2129;
            font-family: PingFang SC;
            font-size: 16px;
            font-weight: 600;
            margin-bottom: 10px;
        }

        .table-title {
            color: #1d2129;
            font-family: PingFang SC;
            font-size: 14px;
            font-weight: 500;
        }

        .empty-add-item-container {
            margin-top: 20px;
            margin-bottom: 10px;
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            > img {
                width: 143px;
                height: 78px;
            }
            .empty-add-item-text-wrap {
                margin-left: 16px;
                .empty-add-item-tip {
                    color: #333;
                    font-size: 14px;
                    font-style: normal;
                    font-weight: 400;
                    line-height: normal;
                    margin-bottom: 10px;
                }
                .disable-add-btn {
                    height: 32px;
                    border-radius: 4px;
                    opacity: 0.39;
                    background: #0061ff;
                    padding: 4px 15px;
                    box-sizing: border-box;
                    .fcc();
                    color: #fff;
                    font-size: 14px;
                    font-style: normal;
                    font-weight: 400;
                    cursor: not-allowed;
                }
            }
        }

        .table-title {
            color: #1d2129;
            font-family: PingFang SC;
            font-size: 14px;
            font-weight: 500;
        }

        .empty-add-item-container {
            margin-top: 20px;
            margin-bottom: 10px;
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            > img {
                width: 143px;
                height: 78px;
            }
            .empty-add-item-text-wrap {
                margin-left: 16px;
                .empty-add-item-tip {
                    color: #333;
                    font-size: 14px;
                    font-style: normal;
                    font-weight: 400;
                    line-height: normal;
                    margin-bottom: 10px;
                }
                .disable-add-btn {
                    height: 32px;
                    border-radius: 4px;
                    opacity: 0.39;
                    background: #0061ff;
                    padding: 4px 15px;
                    box-sizing: border-box;
                    .fcc();
                    color: #fff;
                    font-size: 14px;
                    font-style: normal;
                    font-weight: 400;
                    cursor: not-allowed;
                }
            }
        }
    }
}
</style>
