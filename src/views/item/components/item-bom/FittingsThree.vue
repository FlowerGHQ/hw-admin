<template>
    <div class="fittings-three">
        <!-- 爆炸图 -->
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
					<a-button 
                        class="delete-btn m-r-10" 
                        @click="onOperation('delete')"
                    >
                        {{ /*删除*/ $t('item-bom.delete_explosive') }}
                    </a-button>

                    <a-upload
                        class="m-r-10"
                        name="file"                              
                        accept='image/*'
                        :file-list="uploadOptions.coverList"
                        :action="uploadOptions.action"
                        :headers="uploadOptions.headers"
                        :data='uploadOptions.data'
                        :maxCount="1"
                        :showUploadList="false"
                        @change="(event) => onUploadExplosion(event, explosionImgItem.id)"
                    >
                        <a-button class="replace-btn">
                            {{ /* 替换爆炸图 */ $t('item-bom.alternate_explosive') }}
                        </a-button>
                    </a-upload>					
					<a-button class="save-btn" type="primary" @click="onOperation('save')">
                        {{ $t('item-bom.save') }}
                    </a-button>
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
							<img ref="exploreImg" :src="explosionImgItem.img" alt="">
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
                        <a-upload 
                            name="file"                              
                            accept='image/*'
                            :file-list="uploadOptions.coverList"
                            :action="uploadOptions.action"
                            :headers="uploadOptions.headers"
                            :data='uploadOptions.data'
                            :maxCount="1"
                            :showUploadList="false"
                            @change="(event) => onUploadExplosion(event, 0)"
                        >
                            <a-button class="empty-upload-btn" type="primary">
                                {{ $t(/*上传爆炸图*/ "item-bom.upload_explosion") }}
                            </a-button>
                        </a-upload>
                    </div>
                </div>
            </div>
        </div>
        <!-- 表格 -->
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
                    <div class="ordinal" v-if="column.key === 'index' /*序号*/">
                        <a-input
                            v-model:value="record.index"
                            :placeholder="$t('item-bom.point_configure_number')"
                            @blur="onOperation('blur', record)"
                        />
                    </div>
                    <span v-if="column.key === 'sync_name' /*商品名称*/">
                        <a-tooltip placement="topLeft">
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
                    <span v-if="column.key === 'sales_area_list' /*销售区域*/">
                        <a-tooltip placement="topLeft">
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
                    <span v-if="column.key === 'effective_time' /*创建时间*/">
                        {{ $Util.timeFilter(text) }}
                    </span>
                    <span v-if="column.key === 'comment' /*备注*/">
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
import { onMounted, ref, getCurrentInstance, computed, nextTick } from "vue";
import Core from "@/core";
import MySvgIcon from "@/components/MySvgIcon/index.vue";
import {
    pointerList,
    sidebarData,
    exploreCanvas,
    exploreImg,
    init,
    mousemoveHandler,
    mouseUpHandler,
    pointMousedown,
    onSilderCopy,
    onSilderDelete,
    initLine,
    sidebarDataGroup,
}   from './bom-explosion'

const emptyImage =
    "http://horwin-app.oss-cn-hangzhou.aliyuncs.com/png/12516f00dce1e02da63e405e578c65ea6c82e4c4f5e8c750dc64afa1c1ca7450.png";
const tipIcon =
    "http://horwin-app.oss-cn-hangzhou.aliyuncs.com/png/fdbe378097b4f3f08dbf97bd49d7dae700b138d2827db87d6bc5001d46fa3364.png";
const uploadPic =
    "http://horwin-app.oss-cn-hangzhou.aliyuncs.com/png/b3f294686cc11e3cacbe2c7ea720b740574c051623cd75a00efec3e6aece72d6.png";

const { proxy } = getCurrentInstance();

const props = defineProps({
    activeObj: {
        type: Object,
        default: () => {}
    }
})
console.log("测试的id", props.id);
const loading = ref(false);

const tableColumns = computed(() => {
    const result = [      
        {
            // 商品名称
            title: proxy.$t("item-bom.product_name"),
            dataIndex: "sync_name",
            key: "sync_name",
        },
        {
            // 商品编码
            title: proxy.$t("item-bom.commodity_code"),
            dataIndex: "sync_id",
            key: "sync_id",
        },
        {
            // 版本号
            title: proxy.$t("item-bom.version_number"),
            dataIndex: "version_num",
            key: "version_num",
        },
        {
            // 用量
            title: proxy.$t("item-bom.dosage"),
            dataIndex: "amount",
            key: "amount",
        },
        {
            // 销售区域
            title: proxy.$t("item-bom.sales_area"),
            dataIndex: "sales_area_list1",
            key: "sales_area_list",
        },
        {
            // 创建时间
            title: proxy.$t("item-bom.create_time"),
            dataIndex: "effective_time",
            key: "effective_time",
        },
        {
            // 备注
            title: proxy.$t("item-bom.remark"),
            dataIndex: "comment",
            key: "comment",
        },
    ];

    if (isExplosionImg.value) {
        // 有爆炸图才添加序号(前端自定义自己删除)
        result.unshift(  {
            // 序号
            width: 250,
            title: proxy.$t("item-bom.ordinal"),
            dataIndex: "index",
            key: "index",
        })
    }
    return result;
});
const tableData = ref([
    // {
    //     "id": 885, //Bom商品ID
    //     "bom_id": 6, //BOMId
    //     "bom_category_id": 0, //分类id
    //     "production_code": "", //生产编码
    //     "target_id": 279, //商品id
    //     "target_type": 1, //商品类型    
    //     "amount": 1, //用量
    //     "comment": "萨基发生纠纷萨科JFK吉萨反抗军萨福克就是部分你就撒开积分", //备注
    //     "version_num": 0, //版本信息
    //     "effective_time": 1670169600, //版本生效时间
    //     "weight": 0, 
        
    //     "create_time": 1702454601, 
        
    //     "update_time": 1702454601, 
        
    //     "sync_id": "47100-TLA3-E000", //同步编号
    //     "sync_name": "后牌照支架", //同步名称
    //     "sync_type": 1, //同步类型
    //     "sync_time": 1702454601, //同步时间
    //     // "sales_area_list": [
    //     //     {
    //     //         "id": 6, //销售区域id
    //     //         "continent": "亚洲", //洲
    //     //         "continent_en": "Asia", //洲
    //     //         "country": "韩国", //销售区域国家
    //     //         "country_en": "Korea", //销售区域英文名称
    //     //         "country_code": "KOR", //销售区域code
    //     //         "name": "韩国", //销售区域名称
    //     //         "name_en": "",                 
    //     //         "weight": 0,                 
    //     //         "create_time": 1651045507,                 
    //     //         "update_time": 1657594395             
    //     //     },
    //     //     {
    //     //         "id": 7, //销售区域id
    //     //         "continent": "欧洲", //洲
    //     //         "continent_en": "Europe", //洲
    //     //         "country": "比利时", //销售区域国家
    //     //         "country_en": "Belgium", //销售区域英文名称
    //     //         "country_code": "BEL", //销售区域code
    //     //         "name": "比利时", //销售区域名称
    //     //         "name_en": "",                 
    //     //         "weight": 0,                 
    //     //         "create_time": 1653358167,                 
    //     //         "update_time": 1657594335             
    //     //     }
    //     // ]
    // }
]);
const isExplosionImg = ref(false) // 是否有爆炸图
const explosionImgItem = ref({ img: "", }) // 爆炸图照片 https://horwin.oss-cn-hangzhou.aliyuncs.com/img/33f7c35baa7bbc83466ff2dd7d2006d063b28740b783e81cb5bc227f63541194.png

const uploadOptions = ref({
    action: Core.Const.NET.FILE_UPLOAD_END_POINT,
    coverList: [],
    headers: {
        ContentType: false
    },
    data: {
        token: Core.Data.getToken(),
        type: 'img',
    },
}) // 上传参数

const addTagItem = ref({
    target_id: 6, // bom_category.id (分类id)
    target_type: 3, // bom分类(固定死这里)
    item_component_set_list: []
})  // 最后保存按钮


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
    getExplosionImgFetch({ target_id: 6 })
});
/* Fetch start*/
// 获取表格list
const getTableDataFetch = (parmas = {}) => {
    loading.value = true;
    let obj = {
        bom_id: "", // 版本id
        bom_category_id: 6, // 分类 id
        name: "", // search 商品名称
        code_list: [], // search 商品编号
        page: 1, //页数
        page_size: 20, //页数大小
        ...parmas,
    };

    Core.Api.ITEM_BOM.partsList(obj)
        .then((res) => {
            loading.value = false;
            channelPagination.value.total = res.count;
            tableData.value = res.list;
            
            addTagItem.value.item_component_set_list[0]?.item_component_list.forEach($1 => {
                // 给配件表格添加index
                tableData.value.forEach($2 => {
                    if (Number($1.target_id) === Number($2.id)) {
                        $2.index = $1.index
                    }
                })
            });
        })
        .catch((err) => {
            console.log("getTableDataFetchError", err);
            loading.value = false;
        });
};
// 新增编辑爆炸图Fetch
const saveImgeFetch = (parmas = {}) => {
    let obj = {
        img: undefined,        
        target_id: undefined, // (分类id)
        target_type: 3, // bom分类(固定死这里)
        // id: 0,  // 不传id新增 传id是替换
        ...parmas
    }
    Core.Api.ITEM_BOM.saveOrEdit(obj)
        .then((res) => {
            getExplosionImgFetch({ target_id: obj.target_id })
        })
        .catch((err) => {
            console.log("saveImgeFetchError", err);
        });
}
// 删除|编辑|添加点位Fetch
const editPointFetch = (parmas = {}, type) => {
    let obj = {            
        target_id: undefined, // bom_category.id (分类id)
        target_type: 3, // bom分类(固定死这里)
        item_component_set_list: [],
        ...parmas
    }
    Core.Api.ITEM_BOM.editPoint(obj)
        .then((res) => {
            console.log("deleteExplosionImgFetchSuccess", res);

            if (type === 'delete') {
                proxy.$message.success("删除成功")
                sidebarData.value = []
                pointerList.value = []
            } else if (type === 'add') {
                proxy.$message.success("保存成功")
            }

            getExplosionImgFetch({ target_id: obj.target_id })
        })
        .catch((err) => {
            console.log("deleteExplosionImgFetchError", err);
        });
}
// 获取爆炸图list Fetch
const getExplosionImgFetch = (parmas = {}) => {
    let obj = {
        target_id: undefined, // bom_category.id
        target_type: 3, //  bom分类(固定死这里)
        ...parmas
    }
    Core.Api.ITEM_BOM.getExplosionImg(obj)
        .then((res) => {
            console.log("获取爆炸图信息", res);
            if (res.list.list[0]?.img) {
                addTagItem.value.item_component_set_list = [res.list.list[0]] // 回显
                isExplosionImg.value = true
                explosionImgItem.value = res.list.list[0]
                
                proxy.$nextTick(() => {
                    init(res.list.list[0]?.item_component_list)                  
                })
            } else {
                isExplosionImg.value = false
                explosionImgItem.value = undefined
            }

            getTableDataFetch();
        })
        .catch((err) => {
            console.log("getExplosionImgFetchError", err);
        });
}

/* Fetch end*/

/* methods start*/
// 上传爆炸图
const onUploadExplosion = ({ file, fileList }, type) => {
    console.log("上传爆炸图", file, fileList, type);
    // console.log("上传爆炸图", file, fileList);
    if (file.status == 'done') {
        if (file.response && file.response.code > 0) {
            return proxy.$message.error(file.response.message)
        }
        saveImgeFetch({
            img: Core.Const.NET.FILE_URL_PREFIX + file.response.data.filename,
            id: type,
            target_id: 6
        })
    }
    uploadOptions.value.coverList = fileList;
};
// 添加配件
const onAddFittings = () => {
    console.log("添加配件"); 
};
// 按钮操作
const onOperation = (type, record) => {
    switch(type) {
        case 'delete':            
            proxy.$confirm({
                title: "确定要删除爆炸图?",
                okText: proxy.$t('def.sure'),
                cancelText: proxy.$t('def.cancel'),
                okType: 'danger',
                onOk() {
                    editPointFetch({ target_id: 6 }, 'delete')
                },
                onCancel () {
                }
            });
        break;
        case 'save':
            console.log("addTagItem", addTagItem.value);
            console.log("pointerList", pointerList.value);
            const datas = addTagItem.value.item_component_set_list[0]


            const copyPointerList = Core.Util.deepCopy(pointerList.value)

            copyPointerList.forEach(item => {
                item.end_point = JSON.stringify(item.end)
                item.start_point = JSON.stringify(item.start)
                // 删除字段
                Reflect.deleteProperty(item, 'end');
                Reflect.deleteProperty(item, 'start');
                Reflect.deleteProperty(item, 'blurId');
            })

            datas.item_component_list = copyPointerList

            console.log("save", addTagItem.value);
            editPointFetch(addTagItem.value, 'add')

        break;
        case 'blur':
            // console.log("失去焦点", record);
            // console.log("爆炸图数据", explosionImgItem.value);            
            
            addTagItem.value.item_component_set_list = [{
                ...explosionImgItem.value,
            }]

            const data = addTagItem.value.item_component_set_list[0]?.item_component_list

            // 找到添加是否是对应的数据不是push是删除了在push
            const findIndex = data.findIndex(el => el.blurId == record.id)            
                                    
            let addPointItem = {
                blurId: record.id,  // 用于记录来区分在之后是否要替换
                index: record.index,
                set_id: explosionImgItem.value.id, // 爆炸图id
                target_id: record.id, // 配件id
                start_point: JSON.stringify([{ x: 0, y: 0 }]),
                end_point: JSON.stringify({ x: 0, y: 100 }),
            }

            if (findIndex !== -1) {
                data.splice(findIndex, 1, addPointItem)
            } else {
                data.push(addPointItem)
            }
            console.log("失去焦点结果", addTagItem.value);
                  
            pointerList.value = data
            initLine(pointerList.value)
        break;
    }
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
.set-width {
    width: 100px;
}
.f-s-16 {
    font-size: 16px;
}
.m-r-10 {
    margin-right: 10px;
}
</style>
