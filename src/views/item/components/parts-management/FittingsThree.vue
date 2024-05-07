<template>
    <div class="fittings-three">
        <!-- 爆炸图 -->
        <div class="explosion-diagram">
            <div class="explosion-diagram-bottom">
                <div v-if="isExplosionImg" class="explosion-diagram-content">
                    <div class="content-right /*爆炸图*/">
                        <div class="point-contain" @mouseup="mouseUpHandler" @mousemove="mousemoveHandler">
                            <!-- init中有创建了一个img在这 -->
                            <canvas class="explore-canvas" id="exploreCanvas" ref="exploreCanvas"></canvas>

                            <template v-for="(item, itemIndex) in pointerList">
                                <template v-for="(itemStart, itemStartIndex) in item.start_point" :key="itemStartIndex">
                                    <div
                                        class="pointer-start"
                                        :style="{ left: `${itemStart?.x}px`, top: `${itemStart?.y}px` }"
                                        @mousedown="pointMousedown(itemIndex, 'start_point', itemStartIndex)"
                                        @mousemove.stop=""
                                    ></div>
                                    <!-- 子节点 -->
                                    <template v-if="itemStart.child_node?.length">
                                        <div
                                            v-for="(child_node, childNodeIndex) in itemStart.child_node"
                                            :key="childNodeIndex"
                                            class="pointer-start"
                                            :style="{ left: `${child_node?.x}px`, top: `${child_node?.y}px` }"
                                            @mousedown="
                                                pointMousedown(itemIndex, 'child_node', itemStartIndex, childNodeIndex)
                                            "
                                            @mousemove.stop=""
                                        ></div>
                                    </template>
                                </template>
                            </template>
                            <template v-for="(item, itemIndex) in pointerList" :key="itemIndex">
                                <div
                                    v-for="(itemEnd, itemEndIndex) in item.end_point"
                                    :key="itemEndIndex"
                                    class="pointer-end"
                                    :class="{
                                        'opacity-1':
                                            siderChildNodeLabel === itemEnd.label ||
                                            siderBarItemLabel === itemEnd.label,
                                    }"
                                    :style="{ left: `${itemEnd?.x}px`, top: `${itemEnd?.y}px` }"
                                    @mousedown="pointMousedown(itemIndex, 'end_point', itemEndIndex)"
                                    @mousemove.stop=""
                                    @mouseenter.stop="onPointerEnd(item, 'enter', itemEnd)"
                                    @mouseleave.stop="onPointerEnd(item, 'leave', itemEnd)"
                                >
                                    {{ item.index || 0 }}
                                    <div
                                        class="component"
                                        :class="{
                                            'component-change':
                                                siderChildNodeLabel === itemEnd.label ||
                                                siderBarItemLabel === itemEnd.label,
                                        }"
                                        @mousedown.stop=""
                                    >
                                        <div class="component-contain">
                                            <div class="contain-name">
                                                <span class="icon-name">{{ $t('item-bom.product_name') }}:</span>
                                                {{ item.sync_name || '-' }}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </template>
                        </div>
                    </div>
                </div>
                <!-- 空状态 -->
                <div v-else class="empty-upload-container">
                    <img :src="uploadPic" alt="" />
                </div>
            </div>
        </div>
        <!-- 表格 -->
        <div class="fittings-table-container">
            <div class="fittings-all">
                <div class="fittings-title">
                    {{ $t('item-bom.accessories_list') }}
                </div>
            </div>
            <a-table
                :row-key="record => record.id"
                :data-source="tableData"
                :columns="tableColumns"
                :scroll="{ x: true }"
                :pagination="channelPagination"
                :loading="loading"
                :row-class-name="onRowClassName"
                @change="handleTableChange"
            >
                <template #headerCell="{ title, column }">
                    <div class="table-title">{{ title }}</div>
                </template>
                <template #bodyCell="{ text, record, index, column }">
                    <div class="ordinal" v-if="column.key === 'index' /*序号*/">
                        {{ text || '-' }}
                    </div>
                    <span v-if="column.key === 'sync_name' /*商品名称*/">
                        <a-tooltip placement="topLeft">
                            <template #title>{{ lang === 'zh' ? text : record.item?.name_en || '-' }}</template>
                            <div
                                class="one-spils cursor"
                                :style="{
                                    width: text?.length > 6 ? 7 * 12 + 'px' : '',
                                }"
                            >
                                {{ lang === 'zh' ? text : record.item?.name_en || '-' }}
                            </div>
                        </a-tooltip>
                    </span>
                    <span v-if="column.key === 'version'">
                        {{ activeObj.version_name }}
                    </span>
                    <span v-if="column.key === 'create_time' /*创建时间*/">
                        {{ $Util.timeFilter(text, 3) }}
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
            </a-table>
        </div>
        <!-- <button @click="btn">添加点位</button> -->
    </div>
</template>

<script setup>
import { onMounted, ref, getCurrentInstance, computed, nextTick, watch, onUnmounted, inject } from 'vue';
import Core from '@/core';
import MySvgIcon from '@/components/MySvgIcon/index.vue';
import {
    pointerList,
    sidebarData,
    exploreCanvas,
    init,
    mousemoveHandler,
    mouseUpHandler,
    pointMousedown,
    onSilderCopy,
    onSilderDelete,
    initLine,
    sidebarDataGroup,
} from './bom-explosion';
const classifyShowModal = inject('classifyShowModal');

const emptyImage =
    'http://horwin-app.oss-cn-hangzhou.aliyuncs.com/png/12516f00dce1e02da63e405e578c65ea6c82e4c4f5e8c750dc64afa1c1ca7450.png';
const tipIcon =
    'http://horwin-app.oss-cn-hangzhou.aliyuncs.com/png/fdbe378097b4f3f08dbf97bd49d7dae700b138d2827db87d6bc5001d46fa3364.png';
const uploadPic =
    'http://horwin-app.oss-cn-hangzhou.aliyuncs.com/png/b3f294686cc11e3cacbe2c7ea720b740574c051623cd75a00efec3e6aece72d6.png';

const { proxy } = getCurrentInstance();

const props = defineProps({
    activeObj: {
        type: Object,
        default: () => {},
    },
    searchParams: {
        type: Object,
        default: () => {},
    },
});
const loading = ref(false);

const lang = computed(() => {
    return proxy.$store.state.lang;
});
const tableColumns = computed(() => {
    const result = [
        {
            // 序号
            width: 250,
            title: proxy.$t('item-bom.ordinal'),
            dataIndex: 'index',
            key: 'index',
        },
        {
            // 商品名称
            title: proxy.$t('item-bom.product_name'),
            dataIndex: 'name',
            key: 'name',
        },
        {
            // 商品编码
            title: proxy.$t('item-bom.commodity_code'),
            dataIndex: 'code',
            key: 'code',
        },
        {
            // 版本号
            title: proxy.$t('item-bom.version_number'),
            dataIndex: ['bom', 'version'],
            key: 'version',
        },
        {
            // 用量
            title: proxy.$t('item-bom.dosage'),
            dataIndex: 'amount',
            key: 'amount',
        },
        // {
        //     // 销售区域
        //     title: proxy.$t('item-bom.sales_area'),
        //     dataIndex: 'sale_area',
        //     key: 'sale_area',
        // },
        {
            // 创建时间
            title: proxy.$t('item-bom.create_time'),
            dataIndex: 'create_time',
            key: 'create_time',
        },
        {
            // 备注
            title: proxy.$t('item-bom.remark'),
            dataIndex: 'comment',
            key: 'comment',
        },
    ];

    // if (isExplosionImg.value) {
    //     // 有爆炸图才添加序号(前端自定义自己删除)
    //     result.unshift({
    //         // 序号
    //         width: 250,
    //         title: proxy.$t('item-bom.ordinal'),
    //         dataIndex: 'index',
    //         key: 'index',
    //     });
    // }
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
    //     // "sale_area": [
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
const isExplosionImg = ref(false); // 是否有爆炸图
const explosionImgItem = ref({ img: '' }); // 爆炸图照片 https://horwin.oss-cn-hangzhou.aliyuncs.com/img/33f7c35baa7bbc83466ff2dd7d2006d063b28740b783e81cb5bc227f63541194.png
const pointEndTargetId = ref(null); // 移入的点位id是多少用于判断table的样式样式

const uploadOptions = ref({
    action: Core.Const.NET.FILE_UPLOAD_END_POINT,
    coverList: [],
    headers: {
        ContentType: false,
    },
    data: {
        token: Core.Data.getToken(),
        type: 'img',
    },
}); // 上传参数

const addTagItem = ref({
    target_id: props.activeObj.category_id, // bom_category.id (分类id)
    target_type: 3, // bom分类(固定死这里)
    item_component_set_list: [],
}); // 最后保存按钮

// 分页
const channelPagination = ref({
    current: 1,
    pageSizeOptions: ['20', '40', '60', '80', '100'],
    pageSize: 20,
    showQuickJumper: true, // 是否可以快速跳转至某页
    showSizeChanger: true, // 是否可以改变 pageSize
    total: 0,
    showTotal: total => `${proxy.$t('n.all_total')} ${total} ${proxy.$t('in.total')}`,
});
const isSearch = ref(false);
const childNodeItemHeight = ref(0); // 子节点的高度

watch(
    () => props.activeObj,
    newVal => {
        console.log('监听 activeObj', newVal);
        getExplosionImgFetch({ target_id: newVal.category_id });
    },
    {
        deep: true,
    },
);
watch(
    () => props.searchParams,
    newVal => {
        console.log('监听 searchParams', newVal, Object.keys(newVal).length);
        if (Object.keys(newVal).length === 0) {
            // 重置操作
            isSearch.value = false;
        } else {
            isSearch.value = true;
        }
        channelPagination.value.current = 1;
        channelPagination.value.pageSize = 20;
        getTableDataFetch();
    },
    {
        deep: true,
    },
);
onMounted(() => {
    getExplosionImgFetch({ target_id: props.activeObj.category_id }, true);
});

onUnmounted(() => {
    console.log('销毁');
    isSearch.value = false;
});
/* Fetch start*/
// 获取表格list(依靠爆炸图数据在执行这里)
const getTableDataFetch = (parmas = {}) => {
    loading.value = true;
    console.log(props.activeObj);
    let obj = {
        // id: props.activeObj.version_id, // 版本id
        bom_category_id: props.activeObj.category_id, // 分组id
        // sync_id: props.activeObj.sync_id, //同步id
        // bom_item_category_id: props.activeObj.bom_item_category_id,
        page: channelPagination.value.current,
        page_size: channelPagination.value.pageSize,
        ...props.searchParams,
        ...parmas,
    };

    Core.Api.ITEM_BOM.ManagerListParts(obj)
        .then(res => {
            loading.value = false;
            channelPagination.value.total = res.count;
            tableData.value = res.list;

            addTagItem.value.item_component_set_list[0]?.item_component_list.forEach($1 => {
                // 给配件表格添加index
                tableData.value.forEach($2 => {
                    if (Number($1.target_id) === Number($2.id)) {
                        $2.index = $1.index || '';
                        $2.create_time = $1.create_time || '';
                        $1['sync_name'] = $2.sync_name;
                    }
                });
            });
        })
        .catch(err => {
            console.log('getTableDataFetchError', err);
            loading.value = false;
        });
};
// 新增编辑爆炸图Fetch
const saveImgeFetch = (parmas = {}) => {
    let obj = {
        img: undefined,
        target_id: props.activeObj.category_id, // (分类id)
        target_type: 3, // bom分类(固定死这里)
        // id: 0,  // 不传id新增 传id是爆炸图id
        ...parmas,
    };
    Core.Api.ITEM_BOM.saveOrEdit(obj)
        .then(res => {
            getExplosionImgFetch({ target_id: obj.target_id });
        })
        .catch(err => {
            console.log('saveImgeFetchError', err);
        });
};
// 删除|编辑|添加点位Fetch
const editPointFetch = (parmas = {}, type) => {
    let obj = {
        target_id: props.activeObj.category_id, // bom_category.id (分类id)
        target_type: 3, // bom分类(固定死这里)
        item_component_set_list: [],
        ...parmas,
    };
    Core.Api.ITEM_BOM.editPoint(obj)
        .then(res => {
            console.log('deleteExplosionImgFetchSuccess', res);

            if (type === 'delete') {
                proxy.$message.success('删除成功');
                sidebarData.value = [];
                pointerList.value = [];
            } else if (type === 'add') {
                proxy.$message.success('保存成功');
            }

            getExplosionImgFetch({ target_id: obj.target_id });
        })
        .catch(err => {
            console.log('deleteExplosionImgFetchError', err);
        });
};
// 获取爆炸图list Fetch
const getExplosionImgFetch = (parmas = {}, initBool = false /*是否已经初始化*/) => {
    let obj = {
        target_id: props.activeObj.category_id, // bom_category.id(分类id)
        target_type: 3, //  bom分类(固定死这里)
        ...parmas,
    };
    Core.Api.ITEM_BOM.getExplosionImg(obj)
        .then(res => {
            const first_data = res.list.list[0];
            // 过滤数据
            first_data?.item_component_list.forEach(el => {
                el.start_point = !el.start_point ? '' : JSON.parse(el.start_point);
                el.end_point = !el.end_point ? '' : JSON.parse(el.end_point);
            });

            if (first_data?.img) {
                console.log('获取爆炸图信息', res);
                addTagItem.value.item_component_set_list = [first_data]; // 回显
                isExplosionImg.value = true;
                explosionImgItem.value = first_data;

                nextTick(() => {
                    init(first_data?.item_component_list, first_data.img);
                });
            } else {
                isExplosionImg.value = false;
                explosionImgItem.value = undefined;
            }

            getTableDataFetch();
        })
        .catch(err => {
            console.log('getExplosionImgFetchError', err);
        });
};

/* Fetch end*/

/* methods start*/
// 上传爆炸图
const onUploadExplosion = ({ file, fileList }, type) => {
    console.log('上传爆炸图', file, fileList, type);
    // console.log("上传爆炸图", file, fileList);
    if (file.status == 'done') {
        if (file.response && file.response.code > 0) {
            return proxy.$message.error(file.response.message);
        }
        saveImgeFetch({
            img: Core.Const.NET.FILE_URL_PREFIX + file.response.data.filename,
            id: type,
        });
    }
    uploadOptions.value.coverList = fileList;
};
// 添加配件
const onAddFittings = () => {
    console.log('添加配件');
    classifyShowModal();
};
// 按钮操作
const onOperation = (type, record) => {
    switch (type) {
        case 'delete':
            proxy.$confirm({
                title: '确定要删除爆炸图?',
                okText: proxy.$t('def.sure'),
                cancelText: proxy.$t('def.cancel'),
                okType: 'danger',
                onOk() {
                    editPointFetch({ target_id: props.activeObj.category_id }, 'delete');
                },
                onCancel() {},
            });
            break;
        case 'save':
            console.log('addTagItem', addTagItem.value);
            console.log('pointerList', pointerList.value);
            const datas = addTagItem.value.item_component_set_list[0];

            const copyPointerList = Core.Util.deepCopy(pointerList.value).filter(el => {
                // 过滤有点位数据
                return el.start_point?.length && el.end_point?.length;
            });

            copyPointerList.forEach(item => {
                // 删除字段
                Reflect.deleteProperty(item, 'sync_name');

                item.end_point = JSON.stringify(item.end_point);
                item.start_point = JSON.stringify(item.start_point);
            });

            datas.item_component_list = copyPointerList;

            console.log('save', addTagItem.value);
            editPointFetch(
                {
                    ...addTagItem.value,
                    target_id: props.activeObj.category_id, // bom_category.id (分类id)
                },
                'add',
            );

            break;
        // case 'blur':
        //     console.log('失去焦点', record);
        //     console.log('addPointItem', addTagItem.value);
        //     console.log('pointerList', pointerList.value);

        //     const pointData = addTagItem.value.item_component_set_list[0]?.item_component_list; // 这个是点位Array

        //     // 找到添加是否是对应的数据不是push是删除了在push
        //     const findIndex = pointData.findIndex(el => el.target_id == record.id);

        //     let addPointItem = {
        //         sync_name: record.sync_name,
        //         index: record.index,
        //         set_id: explosionImgItem.value.id, // 爆炸图id
        //         target_id: record.id, // 配件id
        //         start_point: [{ x: 0, y: 100 }],
        //         end_point: [{ x: 0, y: 0 }],
        //     };

        //     // 判断之前有替换 | 添加
        //     if (findIndex !== -1) {
        //         pointData.splice(findIndex, 1, {
        //             ...addPointItem,
        //             start_point: pointData[findIndex].start_point,
        //             end_point: pointData[findIndex].end_point,
        //         });
        //     } else {
        //         pointData.push(addPointItem);
        //     }

        //     console.log('pointData', pointData);
        //     pointerList.value = pointData;
        //     initLine(pointerList.value);
        //     break;
    }
};

defineExpose({
    getTableDataFetch,
});

// 分页事件
const handleTableChange = (pagination, filters, sorter) => {
    channelPagination.value.current = pagination.current;
    channelPagination.value.pageSize = pagination.pageSize;
    getTableDataFetch();
};
// table的样式
const onRowClassName = (recode, index) => {
    // console.log("输出", recode.id);
    return recode.id === pointEndTargetId.value ? 'row-style' : '';
};
// 结束点移入事件
const onPointerEnd = (item, type, itemEnd) => {
    // 清除子节点的背景和颜色
    const childNode = document.querySelectorAll('.child-node-text');
    for (var i = 0; i < childNode.length; i++) {
        childNode[i].style.background = '#F8F8F8';
        childNode[i].style.color = '#1D2129';
    }

    switch (type) {
        case 'enter':
            console.log('itme', item, 'type', type, 'itemEnd', itemEnd);
            pointEndTargetId.value = item.target_id;
            siderBarItemLabel.value = itemEnd.label;
            break;
        case 'leave':
            // 清除父节点和子节点的
            siderBarItemLabel.value = null;
            siderChildNodeLabel.value = null;
            // end
            pointEndTargetId.value = null;
            break;
    }
};
// 点击父节点事件

const siderBarItemLabel = ref(null); // 父节点表示
const siderChildNodeLabel = ref(null); // 子节点表示
const onSidebarItem = (event, type, ground) => {
    console.log('ground', ground);
    pointEndTargetId.value = ground.target_id; // 用于显示表格样式显示

    // 清除子节点的背景和颜色
    const childNode = document.querySelectorAll('.child-node-text');
    for (var i = 0; i < childNode.length; i++) {
        childNode[i].style.background = '#F8F8F8';
        childNode[i].style.color = '#1D2129';
    }

    switch (type) {
        case 'parent-node':
            siderChildNodeLabel.value = null;
            siderBarItemLabel.value = ground.label;
            break;
        case 'child-node':
            siderBarItemLabel.value = null;
            siderChildNodeLabel.value = ground.label;

            const target = event.target;
            if (target.className === 'child-node-content') {
                // 判断是否点击到子节点
                const parentElement = target.parentNode;
                parentElement.style.background = 'rgba(0, 97, 255, 0.10)';
                parentElement.style.color = '#0061FF';
                return;
            }
            target.style.background = 'rgba(0, 97, 255, 0.10)';
            target.style.color = '#0061FF';

            break;
    }
};

// 父节点点击事件
const onNodeDelete = (ground, i, type) => {
    onSilderDelete(ground, i, type);

    // 监听删除之后表格(index)跟着变换
    addTagItem.value.item_component_set_list[0]?.item_component_list.forEach($1 => {
        if ($1.start_point.length === 0 && $1.end_point.length === 0) {
            const item = tableData.value.find($2 => Number($2.id) === Number($1.target_id));
            item.index = null;
        }
    });
};

/* methods end*/
</script>

<style lang="less" scoped>
.fittings-three {
    .explosion-diagram {
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
                    color: #fff;
                }
            }
        }
        .explosion-diagram-bottom {
            .explosion-diagram-content {
                margin-top: 31px;
                display: flex;
                .content-left {
                    white-space: nowrap;
                    .left-list {
                        width: 206px;
                        border: 1px solid #eee;
                        border-radius: 4px;
                        .left-list-header {
                            padding: 6px;
                            box-sizing: border-box;
                            color: #000;
                            font-size: 14px;
                            font-weight: 400;
                            background-color: #f2f3f5;
                        }
                        .left-list-emtpy-text {
                            padding: 10px 27px;
                            box-sizing: border-box;
                            text-align: center;
                            color: #bfbfbf;
                            text-align: center;
                            font-size: 14px;
                            font-weight: 400;
                            white-space: pre-wrap;
                        }
                        .sidebar-points {
                            padding: 0 10px;
                            box-sizing: border-box;
                            .sidebar {
                                width: 100%;
                                margin: 10px 0;

                                .sidebar-item {
                                    margin-top: 10px;
                                    padding: 10px;
                                    box-sizing: border-box;
                                    display: flex;
                                    align-items: center;
                                    justify-content: space-between;
                                    border-radius: 4px;
                                    background-color: #f8f8f8;
                                    cursor: pointer;

                                    .silder-index-left {
                                        display: flex;
                                        align-items: center;
                                        .silder-index {
                                            width: 20px;
                                            height: 20px;
                                            line-height: 20px;
                                            text-align: center;
                                            background-color: #f2f3f5;
                                            border-radius: 50%;

                                            color: #666;
                                            font-size: 12px;
                                            font-weight: 500;
                                        }
                                        .silder-index-text {
                                            color: #1d2129;
                                            font-size: 14px;
                                            font-weight: 400;

                                            &.silder-index-text-change {
                                                color: #0061ff;
                                            }
                                        }
                                    }
                                    .silder-operate {
                                        display: flex;
                                        .silder-copy {
                                            margin-right: 10px;
                                        }
                                        .silder-delete {
                                            margin-right: 10px;
                                        }
                                        .silder-node {
                                            display: flex;
                                            align-items: center;
                                        }
                                        .img-icon {
                                            width: 16px;
                                            height: 16px;
                                        }
                                    }

                                    &.sidebar-item-change {
                                        background: rgba(0, 97, 255, 0.1);
                                    }

                                    &:hover {
                                        background: rgba(0, 97, 255, 0.1);
                                        .silder-index-text {
                                            color: #0061ff;
                                        }
                                    }
                                }

                                .child-node {
                                    position: relative;
                                    .child-node-item {
                                        display: flex;
                                        margin: 4px 0;
                                        .line-item {
                                            align-self: center;
                                            display: flex;
                                            align-items: center;
                                            .line {
                                                width: 8px;
                                                height: 1.5px;
                                                background-color: #dadada;
                                            }
                                            .circle {
                                                width: 5px;
                                                height: 5px;
                                                border-radius: 50%;
                                                background-color: #dadada;
                                            }
                                        }
                                        .child-node-text {
                                            width: 100%;
                                            height: 42px;
                                            line-height: 42px;
                                            padding: 0px 10px;
                                            box-sizing: border-box;
                                            margin-left: 4px;
                                            border-radius: 4px;
                                            background-color: #f8f8f8;
                                            display: flex;
                                            justify-content: space-between;
                                            color: #1d2129;

                                            .child-delete {
                                                width: 16px;
                                                height: 16px;
                                                visibility: hidden;
                                            }
                                            &:hover {
                                                background-color: rgba(0, 97, 255, 0.1) !important;
                                                color: #0061ff !important;
                                                .child-delete {
                                                    visibility: visible;
                                                }
                                            }
                                        }
                                    }
                                    .vertical-line {
                                        display: inline-block;
                                        position: absolute;
                                        left: 0;
                                        border-left: 1.5px solid #dadada;
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
                        .pointer-start,
                        .pointer-end {
                            position: absolute;
                            z-index: 10;
                            border-radius: 50px;
                            user-select: none;
                            opacity: 0.7;
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
                            &:hover {
                                width: 14px;
                                height: 14px;
                            }
                        }
                        .pointer-end {
                            width: 20px;
                            height: 20px;
                            line-height: 20px;
                            text-align: center;
                            background-color: @BG_LP;
                            color: #fff;

                            .component {
                                display: none;
                                position: relative;
                                top: 2px;

                                .component-contain {
                                    position: absolute;
                                    display: flex;
                                    flex-wrap: wrap;
                                    padding: 5px 0;
                                    top: 4px;
                                    left: -26px;
                                    border-radius: 2px;
                                    background-color: @BG_LP;
                                    border: 1px solid @BG_LP;
                                    font-size: 0;

                                    &:before,
                                    &:after {
                                        content: '';
                                        display: block;
                                        border-width: 5px;
                                        position: absolute;
                                        top: -10px;
                                        left: 30px;
                                        border-style: solid dashed dashed;
                                        border-color: transparent transparent @BG_LP transparent;
                                        font-size: 0;
                                        line-height: 0;
                                    }
                                    .contain-name {
                                        position: relative;
                                        padding: 0 16px;
                                        width: 100%;
                                        height: 20px;
                                        line-height: 20px;
                                        font-size: 16px;
                                        color: @TC_L;
                                        text-align: left;
                                        overflow: hidden; //超出的文本隐藏
                                        text-overflow: ellipsis; //溢出用省略号显示
                                        white-space: nowrap;
                                        .icon-name {
                                            color: #fff;
                                            font-size: 14px;
                                            font-weight: 500;
                                        }
                                    }
                                }

                                &.component-change {
                                    display: block;
                                }
                            }

                            &:hover {
                                .component {
                                    display: block;
                                }
                            }
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

        .fittings-all {
            display: flex;
            justify-content: space-between;
            align-content: center;
            margin-bottom: 10px;
            .fittings-title {
                color: #1d2129;
                font-size: 16px;
                font-weight: 600;
            }
            .fittings-options {
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

:deep(.row-style) {
    background: rgba(0, 97, 255, 0.1);
}
.opacity-1 {
    opacity: 1 !important;
}
</style>
