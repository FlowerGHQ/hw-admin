<template>
    <div class="fittings-three">
        <div class="explosion-diagram">
            <div class="explosion-diagram-tip">
                <a-tooltip class="cursor" title="①上传配件，②上传爆炸图，③配置点位">
                    <div class="tip-wrap">
                        <img class="tip-icon" :src="tipIcon" alt="" />
                        <div class="tip-text">
                            {{ $t(/*操作说明*/ "item-bom.operation_instructions") }}
                        </div>
                    </div>
                </a-tooltip>

                <div v-if="isExplosionImg" class="operation">
					<a-button class="delete-btn" @click="onOperation('delete')">{{ $t('item-bom.delete_explosive') }}</a-button>
					<a-button class="replace-btn" @click="onOperation('replace')">{{ $t('item-bom.alternate_explosive') }}</a-button>
					<a-button class="save-btn" type="primary" @click="onOperation('save')">{{ $t('item-bom.save') }}</a-button>
				</div>
            </div>
            <div class="explosion-diagram-bottom">
				<div v-if="isExplosionImg" class="explosion-diagram-content">
					<div class="content-left /*点位*/">
						<div class="left-list">
							<div class="left-list-header">{{ $t('item-bom.point_list') }}</div>
							<div v-if="sidebarDataGroup.length === 0" class="left-list-emtpy-text">
								{{ $t('item-bom.current_point_tips') }}
							</div>
                            <div v-else class="sidebar-points">                     
                                <div 
                                    v-for="(item, itemIndex) in sidebarDataGroup" 
                                    :key="itemIndex"
                                    class="sidebar"
                                    :class="{ 'silder-bottom-10': (i + 1) !== item.length }"
                                    >
                                    <div 
                                        v-for="(ground, i) in item" 
                                        :key="i" 
                                        class="sidebar-item"
                                        :class="{ 'silder-bottom-border': (i + 1) !== ground.length }"
                                    >
                                        <div class="silder-index-left">                                            
                                            <div class="silder-index-text">
                                                {{ $t('item-bom.point') }}
                                                {{ ground.index }}
                                            </div>                                    
                                        </div>
                                    
                                        <div class="silder-operate">
                                            <div class="silder-copy" @click="onSilderCopy(ground, i)">
                                                <MySvgIcon icon-class="copy" class="f-s-16"/>
                                            </div>
                                            <div class="silder-delete" @click="onSilderDelete(ground, i)">
                                                <MySvgIcon icon-class="delete" class="f-s-16"/>
                                            </div>                
                                        </div>
                                    </div>
                                </div>
                            </div>
						</div>
					</div>
					<div class="content-right /*爆炸图*/">
						<div class="point-contain" @mouseup="mouseUpHandler" @mousemove="mousemoveHandler">
							<img ref="exploreImg" src="https://horwin.oss-cn-hangzhou.aliyuncs.com/img/33f7c35baa7bbc83466ff2dd7d2006d063b28740b783e81cb5bc227f63541194.png" alt="">
							<canvas class="explore-canvas" ref="exploreCanvas"></canvas>

							<template v-for="(item, itemIndex) in pointerList">            
								<div      
									v-for="(itemStart, itemStartIndex) in item.start" :key="index"     
									class="pointer-start" 
									:style="{'left': `${itemStart?.x}px`, 'top': `${itemStart?.y }px`}"
									@mousedown="pointMousedown(itemIndex, 'start', itemStartIndex)"
									@mousemove.stop=""
								>
								</div>
							</template>
							<template v-for="(item, itemIndex) in pointerList" :key="itemIndex">            
								<div    
									v-if="item?.end"
									class="pointer-end"
									:style="{'left': `${item?.end?.x}px`, 'top': `${item?.end?.y }px`}"
									@mousedown="pointMousedown(itemIndex, 'end')"
									@mousemove.stop=""
								>
									{{item.index || 0}}
								</div>
							</template>
						</div>
					</div>
				</div>
				<!-- 空状态 -->
                <div v-else class="empty-upload-container">
                    <img :src="uploadPic" alt="" />
                    <div class="empty-upload-flex-wrap">
                        <div class="empty-upload-tip">
                            {{ $t("item-bom.upload_text") }}
                        </div>
                        <a-button class="empty-upload-btn" type="primary" @click="onUploadExplosion">
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
                :data-source="tableData"
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
                    <div class="ordinal" v-if="column.key === 'ordinal' /*序号*/">
                        <a-input
                            v-model:value="record.ordinal"
                            :placeholder="$t('item-bom.point_configure_number')"
                        />
                    </div>
                    <span v-if="column.key === 'name' /*商品名称*/">
                        <a-tooltip>
                            <template #title>{{ text }}</template>
                            <div
                                class="one-spils cursor"
                                :style="{
                                    width: text?.length > 6 ? 7 * 12 + 'px' : '',
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
                                    width: text?.length > 5 ? 6 * 12 + 'px' : '',
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
                            <div class="disable-add-btn" @click="onAddFittings" type="primary">
                                {{ $t("item-bom.add_fittings") }}
                            </div>
                        </div>
                    </div>
                </template>
            </a-table>
        </div>
        <!-- <button @click="btn">添加点位</button> -->
    </div>
</template>

<script setup>
import { onMounted, ref, getCurrentInstance, computed } from "vue";
import Core from "@/core";
import MySvgIcon from "@/components/MySvgIcon/index.vue";
import {
    pointerList,
    exploreCanvas,
    exploreImg,      
    init, 
    mousemoveHandler, 
    mouseUpHandler, 
    pointMousedown, 
    onSilderCopy, 
    onSilderDelete,    
    sidebarDataGroup,
    btn,
}   from './bom-explosion'

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

    if (isExplosionImg) {
        result.unshift(  {
            // 序号
            width: 250,
            title: proxy.$t("item-bom.ordinal"),
            dataIndex: "ordinal",
            key: "ordinal",
        })
    }
    return result;
});
const tableData = ref([]);
const isExplosionImg = ref(false) // 是否有爆炸图

// 分页
const channelPagination = ref({
    current: 1,
    pageSizeOptions: ["20", "40", "60", "80", "100"],
    pageSize: 20,
    showQuickJumper: true, // 是否可以快速跳转至某页
    showSizeChanger: true, // 是否可以改变 pageSize
    total: 0,
    showTotal: (total) => `${proxy.$t("n.all_total")} ${total} ${proxy.$t("in.total")}`,
});

onMounted(() => {
    if (isExplosionImg.value) {
        init()
    }
    // getTableDataFetch();
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
// 上传爆炸图
const onUploadExplosion = () => {
    console.log("上传爆炸图");
};
// 添加配件
const onAddFittings = () => {
    console.log("添加配件"); 
};
// 按钮操作
const onOperation = () => {

}

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
	font-family: PingFang SC;
    .explosion-diagram {
        width: 100%;
        min-height: 158px;
        border: 1px solid #e2e2e2;
        padding: 20px 20px 40px 20px;

        .explosion-diagram-tip {
            display: flex;
			justify-content: space-between;
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
                    font-size: 16px;
                    font-weight: 400;
                }
            }

            .operation {				
				font-weight: 400;					
				font-size: 14px;
				.delete-btn {
					color: #666;
				}
				.replace-btn {
					color: #666;
				}
				.save-btn {
					color: #FFF;
				}
            }
        }
        .explosion-diagram-bottom {
			.explosion-diagram-content {
				margin-top: 31px;
				display: flex;
				.content-left {
					min-width: 206px;
					max-width: 206px;
					.left-list {
						border: 1px solid #EEE;
						border-radius: 4px;
						.left-list-header {
							padding: 6px;
							box-sizing: border-box;						
							color: #000;
							font-size: 14px;
							font-weight: 400;
							background-color: #F2F3F5;
						}
						.left-list-emtpy-text {
							padding: 10px 27px;
							box-sizing: border-box;
							text-align: center;
							color: #BFBFBF;
							text-align: center;							
							font-size: 14px;
							font-weight: 400;
						}
                        .sidebar-points {
                            padding: 0 10px;
                            box-sizing: border-box;
                            .sidebar {
                                width: 100%;
                                margin-top: 10px;
                                padding: 0 10px;
                                box-sizing: border-box;
                                border-radius: 4px;
                                background-color: #F8F8F8;    
                                
                                &.silder-bottom-10 {
                                    margin-bottom: 10px;
                                }
                                .sidebar-item {
                                    padding: 10px 0;
                                    box-sizing: border-box;
                                    display: flex;
                                    align-items: center;
                                    justify-content: space-between;
                                    
                                    &.silder-bottom-border {
                                        border-bottom: 1px solid #E2E2E2;                
                                    }
    
                                    .silder-index-left {
                                        display: flex;
                                        align-items: center;
                                        .silder-index {
                                            width: 20px;
                                            height: 20px;
                                            line-height: 20px;
                                            text-align: center;
                                            background-color: #F2F3F5;
                                            border-radius: 50%;
        
                                            color: #666;                                    
                                            font-size: 12px;
                                            font-weight: 500;
        
                                        }
                                        .silder-index-text {                                            
                                            color: #1D2129;
                                            font-size: 14px;
                                            font-weight: 400;
                                        }
                                    }
                                    .silder-operate {
                                        display: flex;
                                        .silder-copy {
                                            margin-right: 10px;
                                        }
                                        .silder-delete {
                            
                                        }
                                    }
                                }
                            }
                        }
					}
				}
				.content-right {
                    flex: 1;
					.point-contain {
        
						display: inline-block;
                        position: relative;
                        left: 50%;
                        transform: translateX(-50%);

						.explore-canvas {
							position: absolute;
                            top: 0;
                            right: 0;
                            bottom: 0;
                            left: 0;
						}
						.pointer-start, .pointer-end  {
							position: absolute;
							z-index: 10;
							border-radius: 50px;
							user-select: none;
							opacity: 0.6;
							transition: opacity 0.15s ease;
							transform: translate(-50%, -50%);
							cursor: pointer;
							&:hover {
								z-index: 20;
								opacity: 1;
							}
						}
						.pointer-start {
							width: 8px;
							height: 8px;
							background-color: @BG_LP;
						}
						.pointer-end {
							width: 20px;
							height: 20px;
							line-height: 20px;
							text-align: center;
							background-color: @BG_LP;
							color: #fff;
						}
					}
				}
			}
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
            font-size: 16px;
            font-weight: 600;
            margin-bottom: 10px;
        }

        .table-title {
            color: #1d2129;            
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

.f-s-16 {
    font-size: 16px;
}
</style>
