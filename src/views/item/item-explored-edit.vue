<template>
<div id="ItemEdit" class="edit-container">
    <a-spin :spinning="loading" class='loading-incontent' v-if="loading"></a-spin>
    <div class="title-container">
        <div class="title-area">编辑爆炸图</div>
    </div>

    <ItemHeader :detail='detail' :showSpec='indep_flag ? true : false'/>

    <a-collapse ghost expand-icon-position="right">
        <template #expandIcon ><i class="icon i_expan_l"/> </template>
        <a-collapse-panel key="itemInfo" header="详情信息" class="gray-collapse-panel" >
            <a-row class="panel-content info-container">
                <a-col :xs='24' :sm='24' :lg='12' :xl='8' :xxl='6' class="info-block">
                    <div class="info-item">
                        <div class="key">商品编码</div>
                        <div class="value">{{detail.code || '-'}}</div>
                    </div>
                    <div class="info-item">
                        <div class="key">商品类型</div>
                        <div class="value"> {{ $Util.itemTypeFilter(detail.type) }}</div>
                    </div>
                    <div class="info-item">
                        <div class="key">商品分类</div>
                        <div class="value">{{detail.category ? detail.category.name : '-'}}</div>
                    </div>
                    <div class="info-item">
                        <div class="key">销售区域</div>
                        <div class="value">{{ detail.sales_area_name || '-'}}</div>
                    </div>
                </a-col>
                <a-col :xs='24' :sm='24' :lg='12' :xl='8' :xxl='6' class="info-block" v-if="indep_flag">
                    <div class="info-item">
                        <div class="key">成本价格</div>
                        <div class="value">{{$Util.priceUnitFilter(detail.original_price_currency)}} {{$Util.countFilter(detail.original_price)}}</div>
                    </div>
                    <div class="info-item">
                        <div class="key">FOB(EUR)</div>
                        <div class="value">€{{$Util.countFilter(detail.fob_eur)}}</div>
                    </div>
                    <div class="info-item">
                        <div class="key">FOB(USD)</div>
                        <div class="value">${{$Util.countFilter(detail.fob_usd)}}</div>
                    </div>
                </a-col>
                <a-col :xs='24' :sm='24' :lg='12' :xl='8' :xxl='12' class="info-block">
                    <template v-for="(item, index) of config" :key="index">
                        <a-col :xs='24' :sm='24' :lg='12' :xl='12' :xxl='8' class="info-item"
                            :class="item.type" v-if="item.value">
                            <div class="key">{{item.name}}</div>
                            <div class="value" v-if="item.type == 'rich_text'" v-html='item.value'></div>
                            <div class="value" v-else>{{item.value || '-'}}</div>
                        </a-col>
                    </template>
                </a-col>
            </a-row>
        </a-collapse-panel>
    </a-collapse>
    <div class="gray-panel">
        <div class="panel-tabs">
            <a-tabs v-model:activeKey="currentTab" @change="changTab">
                <a-tab-pane :key="index" :tab="item.name || '-'" v-for="(item, index) of tabsArray">
                </a-tab-pane>
            </a-tabs>
        </div>
        <div class="btn-area">
            <a-button class="panel-btn" v-if="tabsArray.length > 0">
                删除爆炸图
            </a-button>
            <a-button type="primary" class="panel-btn" @click="clickShowAdd(true)">
                新增爆炸图
            </a-button>
        </div>
        <div class="panel-content">
            <a-table :columns="specificColumns" :data-source="pointerList" :scroll="{ x: true }"
                :row-key="record => record.id" :pagination='false'>
                <template #bodyCell="{ column, record, index }">
                    <template v-if="column.dataIndex === 'name'">
                        {{ (record.target_detail || {}).name }}
                    </template>
                    <template v-if="column.dataIndex === 'model'">
                        {{ (record.target_detail || {}).model }}
                    </template>
                    <template v-if="column.key === 'operation'">
                        <a-button type='link' @click="showEdit(index)"> <i class="icon i_edit_l"/>修改</a-button>
                        <a-button type='link' @click="clickDeletePoint(index)"> <i class="icon i_delete"/>删除</a-button>
                    </template>
                   <!-- {{ text }}
                   {{ column }}
                   {{ record }} -->
                </template>
            </a-table>
        </div>
    </div>
    <!-- 编辑爆炸图 -->
    <div class="gray-panel" v-show="detailImageUrl">
        <div class="panel-title">点位详情</div>
        <div class="btn-area">
            <a-button class="panel-btn" @click="clickDeletePoint(-1)">清空点位</a-button>
            <a-button class="panel-btn" @click="clickAdd" type="primary">新增点位</a-button>
        </div>
        <div class="panel-content text-c">
            <div class="image-contain" @mouseup="mouseupHandler" @mousemove="mousemoveHandler">
                <img :src="detailImageUrl" ref="exploreImg" alt="">
                <canvas ref="exploreCanvas"></canvas>
                <div class="pointer-start" v-for="(item, index) in pointerList" :key="index" 
                    :style="{'left': `${item.start_point.x}px`, 'top': `${item.start_point.y }px`}"
                    @mousedown="pointMousedown(index, 'start_point')" @mouseup="pointMouseup" @mousemove.stop=""></div>

                <div class="pointer-end" v-for="(item, index) in pointerList" :key="index" 
                    :style="{'left': `${item.end_point.x}px`, 'top': `${item.end_point.y}px`}"
                    @mousedown="pointMousedown(index, 'end_point')" @mouseup="pointMouseup"
                    @dblclick="showEdit(index)" @mousemove.stop="">
                    {{index + 1}}
                    <div class="component" v-show="moveIndex !== index" @mousedown.stop="">
                        <div class="component-contain">
                            <div class="contain-header"><i class="icon i_close" style="color: #fff" @click.stop="clickDeletePoint(index)"/></div>
                            <div class="contain-name">
                                <i class="icon i_skew-bg" />
                                <span class="icon-name">产品名称</span>
                                {{ (item.target_detail || {}).name }}
                            </div>
                            <div class="contain-type">
                                <div class="type-left">型号:&nbsp;{{ (item.target_detail || {}).model}}</div>
                                <div class="edit-btn" @click="showEdit(index)">编辑</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="foot-btn">
                <a-button type="primary" @click="clickSave">保存</a-button>
                <a-button @click="clickCancel">取消</a-button>
            </div>
        </div>
    </div>
    <!-- 绑定配件弹窗 -->
    <div class="form-block form-hide">
        <ItemSelect 
            ref="itemSelect"
            btn-class="panel-btn"
            :radioMode="true"
            :disabled-checked='checkedIds'
            @select="(ids,items) => handleAddShow(TARGET_TYPE.ITEM, ids, items)"
        >
            添加商品
        </ItemSelect>
    </div>
    <AddExploreImage :modalShow="showAddModal" @addExplore="handlerAdd" @closeModal="clickShowAdd(false)"/>
</div>
</template>
<script>
import { get } from 'lodash';
import Core from '../../core';
import ItemHeader from './components/ItemHeader.vue'
import ItemSelect from '@/components/popup-btn/ItemSelect.vue';
import AddExploreImage from "./components/AddExploreImage.vue";
import resData from './test.json';

const TARGET_TYPE = Core.Const.BOM.TARGET_TYPE;
const TEST_IMAGE = 'https://rebuild-mel-erp.oss-cn-hangzhou.aliyuncs.com/img/700ad6f5592c78946f85a22c19551a1c6bc7c3a1dc77b19edab6012d2e2d0b33.png';
export default {
    components: {
        ItemHeader,
        ItemSelect,
        AddExploreImage
    },
    computed: {
        priceKey() {
            let priceKey = this.$auth('DISTRIBUTOR') ? 'fob_' : 'purchase_price_'
            console.log('priceKey:', priceKey)
            return priceKey
        }
    },
    data(){
        return {
            TARGET_TYPE,
            TEST_IMAGE,
            // 载入
            loading: false,

            activeKey: ['itemInfo'],

            // 商品
            id: null,
            indep_flag: 0,
            detail: {},

            specific: { // 规格
                list: [], // 规格定义
                data: [], // 规格商品
            },
            // 上传图片
            upload: {
                action: Core.Const.NET.FILE_UPLOAD_END_POINT,
                coverList: [
                ],
                headers: {
                    ContentType: false
                },
                data: {
                    token: Core.Data.getToken(),
                    type: 'img',
                },
            },
            detailImageUrl: '',

            canvas: null,
            ctx: null,

            isStart: false,

            pointerList: [], // 点位列表
            // pointerListData: [], // 点位列表初始数据
            editPointer: {}, // 编辑点位
            moveIndex: null,
            moveType: null, // 0:起点,1:终点

            savePointNum: 0,
            errorArray: [],

            tabsArray: [],
            currentTab: null,

            showAddModal: false,
        }
    },
    computed: {
        specificColumns() {
            let column = []
            column = this.specific.list.map((item, index) => ({
                id: item.id,
                title: item.name,
                dataIndex: item.key,
                key: 'select',
                option: item.option,
                minWidth: '150px',
            }))
            column = column.filter(item => item.title && item.dataIndex)
            column.unshift(
                {title: '商品名称', key: 'name', dataIndex: 'name'},
                {title: '商品型号', key: 'model', dataIndex: 'model'},
                // {title: '商品编码', key: 'input', dataIndex: 'code', fixed: 'left'},
            )
            column.push(
                {title: '操作', key: 'operation'},
            )
            return column
        },
        // 已经添加到BOM表中的ids
        checkedIds() {
            let arr = [], id;

            id = get(this.editPointer, "target_detail.id", null);
            id ? arr.push(id) : "";
            return arr;
        },
    },
    mounted (){
        this.canvas = this.$refs.exploreCanvas;
        this.ctx = this.canvas.getContext("2d");
        this.id = Number(this.$route.query.id) || 0
        this.indep_flag = Number(this.$route.query.indep_flag) || 0

        this.getItemDetail();
    },
    methods: {
        changTab(key) {
            if(!this.tabsArray[key].item_component_list) {
                this.tabsArray[key]['item_component_list'] = [];
            }
            this.pointerList = get(this.tabsArray, `[${key}].item_component_list`, []);
            this.loadImage(get(this.tabsArray, `[${key}].img`, ""));
        },
        clickShowAdd(show) {
            this.showAddModal = show;
        },
        /** 添加｜编辑弹窗确认回调 */
        handlerAdd(info) {
            // addItemComponent
            Core.Api.Item.addItemComponent({...info, ...{ item_id: this.id }}).then(()=>{
                this.loadImage(info.img);
                this.$message.success(info.id ? "修改成功" : "新增成功");
                this.clickShowAdd(false);
                this.getItemExploreList();
            }).catch(err => {
                console.log('handlerAdd err', err);
            });
        },
        /** 获取 商品详情 */ 
        getItemDetail() {
            this.loading = true;
            Core.Api.Item.detail({
                id: this.id
            }).then(res => {
                let detail = res.detail || {}
                detail.sales_area_name = detail.sales_area_list ? detail.sales_area_list.map(i => i.name).join(',') : ''
                this.detail = detail;
            }).catch(err => {
                console.log('getItemDetail err', err)
            }).finally(() => {
                this.getItemExploreList();
                // this.tabsArray = resData;
                // this.currentTab = 0;
                // this.changTab(0);
                // this.loading = false;
            });
        },
        /** 获取 商品爆炸图 */ 
        getItemExploreList() {
            this.pointerList = [];
            this.tabsArray = [];
            Core.Api.Item.getItemComponent({
                id: this.id
            }).then((res)=>{
                this.tabsArray = get(res, "list.list" , []);
                this.parsePoint();
                this.currentTab = 0;
                if(this.tabsArray.length > 0) {
                    this.changTab(0);
                }
            }).catch( err => {
                console.log('getItemExploreList err', err);
            }).finally(()=>{
                this.loading = false;
            });
        },

        parsePoint () {
            this.tabsArray.forEach(item => {
                let list = get(item, "item_component_list", []);
                list.forEach(point => {
                    point.start_point = point.start_point ? JSON.parse(point.start_point) : { x: 50, y: 50 };
                    point.end_point = point.end_point ? JSON.parse(point.end_point) : { x: 50, y: 150 };
                })
            })
            console.log("parsePoint>>>", this.tabsArray)
        },

        // 加载图片，获取宽高
        loadImage(str){
            let img = new Image(), url = Core.Const.NET.FILE_URL_PREFIX + str;
            const ths = this;
            
            img.onload = ()=>{
                ths.imageLoadCallback(img.naturalWidth, img.naturalHeight);
                ths.detailImageUrl = url;
                img.onload = null;
            };
            img.src = url;
        },
        imageLoadCallback(width, height) {
            if(width > 800 || height > 800) {
                let rate = width / height;

                this.canvas.width = rate >= 1 ? 800 : width / height * 800;
                this.canvas.height = rate <= 1 ? 800 : height / width * 800;
            } else {
                this.canvas.width = width;
                this.canvas.height = height;
            }
            // if(this.pointerList.length > 0) {
                this.canvasUpdata();
            // }
        },

        /** 点位鼠标点下 */
        pointMousedown (index, type) {
            this.moveIndex = index;
            this.moveType = type;
            this.isStart = true;
        },
        /** 点位鼠标抬起 */
        pointMouseup () {
            this.moveIndex = null;
            this.moveType = null;
            this.isStart = false;
        },

        /** 容器鼠标抬起 */
        mouseupHandler(e){
            this.moveIndex = null;
            this.moveType = null;
            this.isStart = false;
        },
        /** 容器鼠标移动 */
        mousemoveHandler(e) {
            if(this.isStart === false) return;
            let className = e.target.classList[0];
            if(className) return;
            this.pointerList[this.moveIndex][this.moveType].x = e.offsetX;
            this.pointerList[this.moveIndex][this.moveType].y = e.offsetY;
            const ths = this;
            window.requestAnimationFrame(()=>{
                ths.canvasUpdata();
            },16.7)
        },
        canvasUpdata(){
            if(!this.canvas) return;
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.lineWidth = 1;
            this.ctx.strokeStyle = '#1890ff';
            this.ctx.beginPath();
            for (var i = 0; i < this.pointerList.length; i++) {
                var p1 = this.pointerList[i].start_point;
                var p2 = this.pointerList[i].end_point;
                this.ctx.moveTo(p1.x, p1.y);
                this.ctx.lineTo(p2.x, p2.y);
            }
            this.ctx.stroke();
        },

        /** 点击添加点位 */
        clickAdd(){
            this.editPointer = null;
            this.$refs.itemSelect.handleModalShow();
        },

        /** 删除点位 */
        clickDeletePoint (index = -1) {
            if(index === -1) {
                this.pointerList = [];
            } else {
                this.pointerList.splice(index, 1);
            }
            this.canvasUpdata();
        },

        /** 编辑点位详情 */
        showEdit (index) {
            this.editPointer = this.pointerList[index];
            this.$refs.itemSelect.handleModalShow();
        },

        // 添加材料
        handleAddShow(type, ids, items) {
            let obj;
            if(this.editPointer === null) {
                obj = {
                    id: null,
                    start_point: { x: 50, y: 50 },
                    end_point: { x: 50, y: 150 },
                    set_id: get(this.tabsArray, `[${this.currentTab}].id`, null),
                    target_id: null,
                    target_type: null,
                    target_detail: null,
                }
                this.pointerList.push(obj);
                this.canvasUpdata();
            } else {
                obj = this.editPointer;
            }
            items.map(item => {
                obj.target_id = item.id;
                obj.target_type = type;
                obj.target_detail = item;
            });
        },
        /** 点击保存 */
        clickSave () {
            let emptyArray = [];

            this.pointerList.forEach((item, index) => {
                if(!item.target_id) emptyArray.push(index + 1);
            });
            
            if(emptyArray.length > 0) {
                this.$message.warning(`第${emptyArray.join(',')}点位尚未设置配件。`)
                return;
            };
            const ths = this;

            this.errorArray = [];
            this.savePointNum = this.pointerList.length;
            const param = {
                item_component_set_list: this.tabsArray,
                item_id: this.id,
            }
            console.log("pointerList>>>", param)
            Core.Api.Item.bindItemComponent(param).then(res => {
                this.$message.success(`点位保存成功`);
            }).catch(err => {
                this.$message.error('点位保存失败');
            });
        },
        /** 点击取消 */
        clickCancel () {
            // this.pointerList = Core.Util.deepCopy(this.pointerListData);
            this.canvasUpdata();
        },
        /** 解除绑定 */
        deleteComponent () {
            const param = {
                end_point: 0,
                id: 0,
                item_id: 0,
                start_point: 0,
                target_id: 0,
                target_type: 0
            };
            Core.Api.Item.deleteItemComponent(param).then(res => {})
        },
    }
}
</script>

<style lang="less" scoped>
.form-block .form-content .value .contain {
    width: 100%;
    height: 100%;
    .contain-action {
        text-align: center;
        margin-bottom: 24px;
    }
}
.delete-point {
    text-decoration:underline;
    cursor: pointer;
    &:hover {
        color: red;
    }
}
.form-hide {
    width: 0;
    height: 0;
    overflow: hidden;
}
.gray-panel {
    .panel-title {
        display: inline-block;
        padding: 0 0 0 10px;
        width: calc(100% - 300px);
        height: 40px;
        font-weight: 500;
        font-size: 12px;
        color: #000000;
    }
    .panel-tabs {
        display: inline-block;
        width: calc(100% - 300px);
    }
    .btn-area {
        display: inline-block;
        width:  300px;
        text-align: right;
    }
    .image-contain {
        display: inline-block;
        position: relative;
        max-width: 800px;
        max-height: 800px;
        min-height: 100px;

        .pointer-end, .pointer-start {
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
            position: absolute;
            width: 20px;
            height: 20px;
            line-height: 20px;
            text-align: center;
            font-size: 12px;
            color: @TC_L;
            border: 1px solid @BG_LP;
            background-color: @BG_LP;
            .component {
                position: relative;
                display: inline-block;
                width: 150px;
                height: 100px;
                text-align: left;
                .component-contain {
                    position: absolute;
                    display: flex;
                    flex-wrap: wrap;
                    z-index: 2;
                    padding-bottom: 12px;
                    top: 4px;
                    left: -26px;
                    width: 250px;
                    border-radius: 2px;
                    background-color: @BG_LP;
                    border: 1px solid @BG_LP;
                    font-size: 0;
                    &:before, &:after {
                        content: "";
                        display: block;
                        border-width: 5px;
                        position: absolute;
                        top: -10px;
                        left: 30px;
                        border-style: solid dashed dashed;
                        border-color: transparent transparent @BG_LP  transparent;
                        font-size: 0;
                        line-height: 0;
                    } 
                    &:after {
                        top: -9px;
                        left: 30px;
                        border-color: transparent transparent @BG_LP transparent;
                    }
                    .contain-header {
                        padding-top: 4px;
                        padding-right: 6px;
                        width: 100%;
                        height: 16px;
                        text-align: right;
                        .i_close {
                            float: right;
                            color: @TC_L;
                            font-size: 12px;
                        }
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
                        .i_skew-bg {
                        //     position: relative;
                        //     display: inline-block;
                        //     width: 53px;
                        //     height: 16px;
                        //     line-height: 16px;
                            font-size: 16px;
                        //     font-style: italic;
                        //     text-align: center;
                            color: @TC_L;
                        }
                        .icon-name {
                            position: absolute;
                            top: 0;
                            left: 16px;
                            font-style: italic;
                            font-size: 12px;
                            font-weight: bold;
                            color: @TC_LP;
                            transform-origin: 50% 50%;
                            transform: scale(90%, 90%);
                        }
                    }
                    .contain-type {
                        display: flex;
                        margin-top: 22px;
                        padding: 0 16px;
                        width: 100%;
                    }
                    .type-left {
                        padding-right: 6px;
                        width: calc(100% - 48px);
                        color: @TC_L;
                        font-size: 16px;
                        overflow: hidden; //超出的文本隐藏
                        text-overflow: ellipsis; //溢出用省略号显示
                        white-space: nowrap;
                    }
                    .edit-btn {
                        width: 48px;
                        height: 34px;
                        line-height: 34px;
                        border-radius: 2px;
                        font-size: 14px;
                        text-align: center;
                        color: @BG_LP;
                        background-color: @BG_panel;
                        border: 1px solid @BG_LP;
                    }
                }
            }
        }
        img {
            width: 100%;
            height: 100%;
            -webkit-user-drag: none;
        }
        canvas {
            position: absolute;
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;
        }
    }
    .foot-btn {
        margin-top: 24px;
        width: 100%;
        text-align: center;
    }
}
.text-c {
    text-align: center;
}
</style>