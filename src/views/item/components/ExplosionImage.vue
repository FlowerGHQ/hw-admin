<template>
    <div class="ExplosionImage">
        <div class="explore-head-container">
            <div class="explore-tab-container">
                <div
                    v-for="(item, index) of tabsArray"
                    :key="index"
                    @click="clickChangTab(index)"
                    :class="currentTab === index ? 'explore-tab on-click' : 'explore-tab'"
                >
                    {{ item.name || '-' }}
                </div>
            </div>
            <a-button v-if="detailImageUrl" type="primary" class="add-explosion-btn" @click="clickShowAdd(true, false)">
                {{ $t(/*上传爆炸图*/ 'p.upload_explosion') }}
            </a-button>
        </div>
        <div class="explored-container">
            <!-- 编辑爆炸图 -->
            <div v-show="detailImageUrl">
                <div class="panel-content text-c">
                    <div class="explored-operation-container">
                        <!-- 点位操作控件 -->
                        <div class="point-controller-container">
                            <div class="point-info-row-head">
                                {{ $t(/*点位列表*/ 'i.point_list') }}
                            </div>
                            <div :class="pointerList.length ? 'point-controller' : 'point-controller'">
                                <div
                                    class="point-info-row"
                                    v-if="pointerList.length"
                                    v-for="(item, index) in pointerList"
                                    :key="index"
                                >
                                    <div class="point-info-left">
                                        <!-- <div class="point-pos-num">
                                            {{ index + 1 }}
                                        </div> -->
                                        <div class="point-pos-name">
                                            {{ $t(/*点位*/ 'i.point_position') }}{{ item.index }}
                                        </div>
                                    </div>
                                    <div class="point-info-right">
                                        <img @click="clickDeletePoint(index)" :src="deleteIcon" alt="" />
                                    </div>
                                </div>
                                <div class="point-info-empty" v-else>
                                    {{ $t(/*当前无点位，请添加配件配置点位序号*/ 'i.empty_point_tip') }}
                                </div>
                            </div>
                        </div>
                        <div class="image-contain" @mouseup="mouseupHandler" @mousemove="mousemoveHandler">
                            <img
                                class="canvas-img"
                                v-if="detailImageUrl"
                                :src="detailImageUrl"
                                ref="exploreImg"
                                alt=""
                            />
                            <canvas ref="exploreCanvas"></canvas>
                            <div
                                class="pointer-start"
                                v-for="(item, index) in pointerList"
                                :key="index"
                                :style="{ left: `${item.start.x}px`, top: `${item.start.y}px` }"
                                @mousedown="pointMousedown(index, 'start')"
                                @mouseup="pointMouseup"
                                @mousemove.stop=""
                            ></div>
                            <div
                                class="pointer-end"
                                v-for="(item, index) in pointerList"
                                :key="index"
                                :style="{ left: `${item.end.x}px`, top: `${item.end.y}px` }"
                                @mousedown="pointMousedown(index, 'end')"
                                @mouseup="pointMouseup"
                                @dblclick="showEdit(index)"
                                @mousemove.stop="pointMouseMove(index)"
                                @mouseleave.stop="pointMouseMove(-1)"
                            >
                                {{ item.index || 0 }}
                                <div
                                    class="component-container"
                                    @mousemove.stop="pointMouseMove(index)"
                                    v-show="pointMouseMoveIndex === index"
                                    @mousedown.stop=""
                                >
                                    <div class="component">
                                        <div class="component-contain">
                                            <div class="contain-name">
                                                {{ (item.item || {}).name }}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <!-- 爆炸图操作按钮 -->
                        <div class="btns-area">
                            <a-button class="panel-btn" v-if="isChangedPoint" type="primary" @click="clickSave">
                                {{ $t(/*保存*/ 'def.save') }}
                            </a-button>
                            <a-button class="panel-btn" v-if="tabsArray.length > 0" @click="clickEditExplore">
                                {{ $t(/*替换爆炸图*/ 'i.edit_bom_pic') }}
                            </a-button>
                            <a-button class="panel-btn" v-if="tabsArray.length > 0" @click="clickDeleteExplore">
                                {{ $t(/*删除爆炸图*/ 'i.delete_bom_pic') }}
                            </a-button>
                        </div>
                    </div>
                </div>
            </div>
            <div v-show="!detailImageUrl" class="empty-picture-container">
                <a-tooltip :title="$t(/*①上传配件，②上传爆炸图，③配置点位*/ 'i.operation_procedure')">
                    <div class="tip-wrap">
                        <img class="tip-icon" :src="tipIcon" alt="" />
                        <div class="tip-text">
                            {{ $t(/*操作说明*/ 'i.operation_instruction') }}
                        </div>
                    </div>
                </a-tooltip>
                <div class="empty-upload-container">
                    <img :src="uploadPic" alt="" />
                    <div class="empty-upload-flex-wrap">
                        <div class="empty-upload-tip">
                            {{ $t(/*上传爆炸图，以配置点位*/ 'i.upload_pic_tip') }}
                        </div>
                        <a-button class="empty-upload-btn" type="primary" @click="clickShowAdd(true, false)">
                            {{ $t(/*上传爆炸图*/ 'p.upload_explosion') }}
                        </a-button>
                    </div>
                </div>
            </div>
            <div class="point-table-container">
                <div class="point-table-wrap">
                    <div class="point-table-head">
                        <div class="point-table-head-title">
                            {{ $t(/*点位零件表*/ 'i.point_parts_list') }}
                        </div>
                        <a-button v-if="pointerList.length" @click="clickAdd" type="primary"
                            >{{ $t(/*新增零件*/ 'i.new_part') }}
                        </a-button>
                    </div>
                    <a-table
                        v-if="pointerList.length"
                        :columns="specificColumns"
                        :data-source="pointerList"
                        :scroll="{ x: true }"
                        :row-key="record => record.id"
                        :pagination="false"
                    >
                        <template #bodyCell="{ column, record, index }">
                            <template v-if="column.dataIndex === 'index'">
                                <a-input
                                    v-model:value="record.index"
                                    @blur="saveRowIndex(record)"
                                    :placeholder="$t('search.enter_sn')"
                                ></a-input>
                            </template>
                            <template v-if="column.dataIndex === 'name'">
                                {{ (record.item || {}).name }}
                            </template>
                            <template v-if="column.dataIndex === 'model'">
                                {{ (record.item || {}).model }}
                            </template>
                            <template v-if="column.dataIndex === 'operation'">
                                <a-button type="link" @click="showEdit(index)"
                                    ><i class="icon i_edit" />{{ $t('def.edit') }}</a-button
                                >
                                <a-button type="link" @click="clickDeletePoint(index)"
                                    ><i class="icon i_delete" />{{ $t('def.delete') }}</a-button
                                >
                            </template>
                        </template>
                    </a-table>
                    <div v-if="!pointerList.length" class="empty-table-container">
                        <div class="empty-table-head">
                            <div class="empty-table-head-block">
                                {{ $t('i.point_position') }}
                            </div>
                            <div class="empty-table-head-block">
                                {{ $t('n.name') }}
                            </div>
                            <div class="empty-table-head-block">
                                {{ $t('i.number') }}
                            </div>
                            <div class="empty-table-head-block">
                                {{ $t('i.code') }}
                            </div>
                        </div>
                        <div class="empty-add-item-container">
                            <img :src="addPic" alt="" />
                            <div class="empty-add-item-text-wrap">
                                <div class="empty-add-item-tip">
                                    {{ $t(/*为爆炸图添加配件*/ 'i.add_pic_diagram') }}
                                </div>
                                <a-button v-if="detailImageUrl" @click="clickAdd" type="primary">{{
                                    $t(/*添加配件*/ 'i.add_diagram')
                                }}</a-button>
                                <div class="disable-add-btn" v-else @click="clickUnDetailPic" type="primary">
                                    {{ $t(/*添加配件*/ 'i.add_diagram') }}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- 绑定配件弹窗 -->
        <div class="form-block form-hide">
            <ItemSelect
                ref="itemSelect"
                btn-class="panel-btn"
                :radioMode="true"
                :disabled-checked="checkedIds"
                @select="(ids, items) => handleAddShow(TARGET_TYPE.ITEM, ids, items)"
            >
                {{ $t('i.add') }}
            </ItemSelect>
        </div>
        <AddExploreImage
            :uploadForm="uploadForm"
            :isUploadEdit="isUploadEdit"
            :modalShow="showAddModal"
            @addExplore="handlerAdd"
            @closeModal="clickShowAdd(false)"
        />
    </div>
</template>

<script>
import Core from '../../../core';
import ItemSelect from '@/components/popup-btn/ItemSelect.vue';
import AddExploreImage from './AddExploreImage.vue';
import { get } from 'lodash';
const TARGET_TYPE = Core.Const.BOM.TARGET_TYPE;
export default {
    name: 'DisplayImage',
    components: {
        ItemSelect,
        AddExploreImage,
    },
    props: {
        id: {
            type: Number,
        },
        detailId: {
            type: Number,
        },
    },
    data() {
        return {
            // 加载
            loading: false,
            OSS_URL: Core.Const.NET.FILE_URL_PREFIX,
            // 商品/物料
            TARGET_TYPE,
            // 上传图片
            upload: {
                action: Core.Const.NET.FILE_UPLOAD_END_POINT,
                coverList: [],
                headers: {
                    ContentType: false,
                },
                data: {
                    token: Core.Data.getToken(),
                    type: 'img',
                },
            },
            canvas: null,
            ctx: null,
            detailImageUrl: '',
            imageSize: {
                width: 0,
                height: 0,
            },
            isStart: false,
            pointerList: [], // 点位列表
            pointerListData: [], // 点位列表初始数据
            editPointer: {}, // 编辑点位
            moveIndex: null,
            moveType: null, // 0:起点,1:终点
            savePointNum: 0,
            errorArray: [],
            tabsArray: [],
            currentTab: null,
            showAddModal: false,
            isChangedPoint: false,
            specific: {
                // 规格
                list: [], // 规格定义
                data: [], // 规格商品
            },
            deleteIcon:
                'http://horwin-app.oss-cn-hangzhou.aliyuncs.com/png/8e32624eb3c65e763296a147d72cfdc0c4b50ceafed576e04b358b3a9becda10.png',
            tipIcon:
                'http://horwin-app.oss-cn-hangzhou.aliyuncs.com/png/fdbe378097b4f3f08dbf97bd49d7dae700b138d2827db87d6bc5001d46fa3364.png',
            uploadPic:
                'http://horwin-app.oss-cn-hangzhou.aliyuncs.com/png/b3f294686cc11e3cacbe2c7ea720b740574c051623cd75a00efec3e6aece72d6.png',
            addPic: 'http://horwin-app.oss-cn-hangzhou.aliyuncs.com/png/12516f00dce1e02da63e405e578c65ea6c82e4c4f5e8c750dc64afa1c1ca7450.png',
            pointMouseMoveIndex: undefined,
            isBookWidth: false,
            isUploadEdit: false,
            uploadForm: {},
        };
    },
    computed: {
        specificColumns() {
            let column = [];
            column = this.specific.list.map((item, index) => ({
                id: item.id,
                title: item.name,
                dataIndex: item.key,
                key: 'select',
                option: item.option,
                minWidth: '150px',
            }));
            column = column.filter(item => item.title && item.dataIndex);
            column.unshift(
                { title: this.$t('i.point_position'), key: 'index', dataIndex: 'index' },
                { title: this.$t('n.name'), key: 'name', dataIndex: 'name' },
                { title: this.$t('i.number'), key: 'model', dataIndex: 'model' },
                { title: this.$t('i.code'), key: 'code', dataIndex: 'name' },
                { title: this.$t('i.code'), key: 'code', dataIndex: 'name' },
                { title: this.$t('def.operate'), dataIndex: 'operation', key: 'operation' },
            );
            return column;
        },
        // 已经添加到BOM表中的ids
        checkedIds() {
            return this.pointerList.map(item => {
                return get(item, 'item.id', null);
            });
        },
    },
    mounted() {
        this.canvas = this.$refs.exploreCanvas;
        this.ctx = this.canvas.getContext('2d');
        this.getItemDetail();
    },
    watch: {
        id: {
            handler(val) {
                this.detailImageUrl = '';
                this.$nextTick(() => {
                    this.canvas = this.$refs.exploreCanvas;
                    this.ctx = this.canvas.getContext('2d');
                });
                this.getItemExploreList();
            },
            immediate: true,
            deep: true,
        },
    },
    methods: {
        // 点击切换爆炸图
        clickChangTab(key) {
            this.currentTab = key;
            // if (this.isChangedPoint === true) {
            //     this.changeTabConfirm(key);
            //     return;
            // }
            if (!this.tabsArray[key].item_component_list) {
                this.tabsArray[key]['item_component_list'] = [];
            }
            this.pointerList = this.tabsArray[key].item_component_list;
            this.pointerList.forEach(item => {
                item.isEdit = false;
            });
            console.log('pointerList >> ', this.pointerList);
            this.pointerListData = Core.Util.deepCopy(this.pointerList);
            this.loadImage(get(this.tabsArray, `[${key}].img`, ''));
        },
        changeTabConfirm(key) {
            const ths = this;
            ths.$confirm({
                title: `${ths.tabsArray[ths.currentTab].name},` + ths.$t('i.point'),
                okText: ths.$t('def.sure'),
                okType: 'danger',
                cancelText: ths.$t('def.cancel'),
                onOk() {
                    ths.parsePoint(false);
                    const param = {
                        item_component_set_list: ths.tabsArray,
                        target_id: ths.id || ths.detailId,
                        target_type: Core.Const.ITEM_COMPONENT_SET.TARGET_TYPE.ITEM,
                    };
                    ths.requestSave(param, ths.$t('def.save'), ths.getItemExploreList.bind(ths));
                },
                onCancel() {
                    ths.isChangedPoint = false;
                    ths.clickCancel();
                    ths.clickChangTab(key);
                    ths.parsePoint(true);
                    console.log(ths.tabsArray);
                },
            });
        },
        clickShowAdd(show, isEdit = false) {
            this.showAddModal = show;
            this.isUploadEdit = isEdit;
            if (!isEdit) {
                return;
            }
            this.uploadForm = {
                id: this.tabsArray.filter((item, index) => index === this.currentTab)[0].id,
                name: this.tabsArray.filter((item, index) => index === this.currentTab)[0].name,
                img: this.tabsArray.filter((item, index) => index === this.currentTab)[0].img,
            };
        },
        // 删除当前爆炸图
        clickDeleteExplore() {
            const ths = this;
            this.$confirm({
                title:
                    ths.$t('pop_up.sure') +
                    ths.$t('pop_up.delete') +
                    `${this.tabsArray[this.currentTab].name}` +
                    ths.$t('i.view') +
                    '？ ',
                okText: ths.$t('def.ok'),
                okType: 'danger',
                cancelText: ths.$t('def.cancel'),
                onOk() {
                    const param = {
                        item_component_set_list: ths.tabsArray.filter((item, index) => index !== ths.currentTab),
                        target_id: ths.id || ths.detailId,
                        target_type: Core.Const.ITEM_COMPONENT_SET.TARGET_TYPE.ITEM,
                    };
                    ths.pointerList = [];
                    ths.tabsArray = [];
                    ths.requestSave(param, ths.$t('pop_up.delete'), ths.getItemExploreList.bind(ths));
                },
            });
        },
        // 编辑当前爆炸图
        clickEditExplore() {
            this.clickShowAdd(true, true);
        },
        // 添加｜编辑弹窗确认回调
        handlerAdd(info) {
            // addItemComponent
            Core.Api.Item.addItemComponent({
                ...info,
                ...{ target_id: this.id || this.detailId, target_type: Core.Const.ITEM_COMPONENT_SET.TARGET_TYPE.ITEM },
            })
                .then(() => {
                    this.loadImage(info.img);
                    this.$message.success(
                        info.id
                            ? this.$t('n.amend') + this.$t('pop_up.success')
                            : this.$t('v.save') + this.$t('pop_up.success'),
                    );
                    this.clickShowAdd(false);
                    this.getItemExploreList();
                })
                .catch(err => {
                    console.log('handlerAdd err', err);
                });
        },
        // 获取商品详情
        getItemDetail() {
            this.loading = true;
            Core.Api.Item.detail({
                id: this.detailId,
            })
                .then(res => {
                    let detail = res.detail || {};
                    detail.sales_area_name = detail.sales_area_list
                        ? detail.sales_area_list.map(i => i.name).join(' , ')
                        : '';
                    this.detail = detail;
                })
                .catch(err => {
                    console.log('getItemDetail err', err);
                })
                .finally(() => {
                    this.getItemExploreList();
                });
        },
        // 加载图片，获取宽高
        loadImage(str) {
            let img = new Image(),
                url = `${this.OSS_URL}${str}`;
            const _this = this;
            _this.canvasClear();
            img.onload = () => {
                _this.imageSize.width = img.naturalWidth;
                _this.imageSize.height = img.naturalHeight;
                _this.imageLoadCallback(img.naturalWidth, img.naturalHeight);
                _this.detailImageUrl = url;
                img.onload = null;
            };
            img.src = url;
        },
        canvasClear() {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        },
        imageLoadCallback(width, height) {
            if (width > 800 || height > 800) {
                let rate = width / height;
                this.canvas.width = rate >= 1 ? 700 : (width / height) * 800;
                this.canvas.height = rate <= 1 ? 800 : (height / width) * 800;
                if (height > 385) {
                    this.canvas.height = 385;
                }
            } else {
                this.canvas.width = width;
                this.canvas.height = height;
            }
            this.canvasUpdata();
        },
        // 鼠标移入
        pointMouseMove(index) {
            this.pointMouseMoveIndex = index;
        },
        // 点位鼠标点下
        pointMousedown(index, type) {
            this.moveIndex = index;
            this.moveType = type;
            this.isStart = true;
        },
        // 点位鼠标抬起
        pointMouseup() {
            this.moveIndex = null;
            this.moveType = null;
            this.isStart = false;
        },
        // 容器鼠标抬起
        mouseupHandler(e) {
            this.moveIndex = null;
            this.moveType = null;
            this.isStart = false;
        },
        // 容器鼠标移动
        mousemoveHandler(e) {
            if (this.isStart === false) return;
            let className = e.target.classList[0];
            if (className) return;
            this.pointerList[this.moveIndex][this.moveType].x = e.offsetX;
            this.pointerList[this.moveIndex][this.moveType].y = e.offsetY;
            const ths = this;
            this.isChangedPoint = true;
            window.requestAnimationFrame(() => {
                ths.canvasUpdata();
            }, 16.7);
        },
        // 获取 商品爆炸图
        getItemExploreList() {
            // this.pointerList = [];
            // this.tabsArray = [];
            Core.Api.Item.getItemComponent({
                target_id: this.id || this.detailId,
                target_type: Core.Const.ITEM_COMPONENT_SET.TARGET_TYPE.ITEM,
            })
                .then(res => {
                    this.tabsArray = get(res, 'list.list', []);
                    this.parsePoint(true);
                    this.currentTab ? '' : (this.currentTab = 0);
                    if (this.tabsArray.length > 0) {
                        this.clickChangTab(this.currentTab);
                    }
                })
                .catch(err => {
                    console.log('getItemExploreList err', err);
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        parsePoint(isParse) {
            this.tabsArray.forEach(item => {
                let list = get(item, 'item_component_list', []);
                list.forEach(point => {
                    if (isParse) {
                        point.start = point.start_point ? JSON.parse(point.start_point) : { x: 50, y: 50 };
                        point.end = point.end_point ? JSON.parse(point.end_point) : { x: 50, y: 150 };
                    } else {
                        point.start_point = JSON.stringify(point.start || { x: 50, y: 50 });
                        point.end_point = JSON.stringify(point.end || { x: 50, y: 150 });
                    }
                });
            });
        },
        canvasUpdata() {
            if (!this.canvas) return;
            this.canvasClear();
            this.ctx.lineWidth = 1;
            this.ctx.strokeStyle = '#1890ff';
            this.ctx.beginPath();
            for (var i = 0; i < this.pointerList.length; i++) {
                var p1 = this.pointerList[i].start;
                var p2 = this.pointerList[i].end;
                this.ctx.moveTo(p1.x, p1.y);
                this.ctx.lineTo(p2.x, p2.y);
            }
            this.ctx.stroke();
        },
        // 点击添加点位
        clickAdd() {
            this.editPointer = null;
            this.$refs.itemSelect.handleModalShow();
        },
        // 未上传爆炸图提示信息
        clickUnDetailPic() {
            this.$message.warning(this.$t('i.upload_tip'));
        },
        // 删除点位
        clickDeletePoint(index = -1) {
            this.isChangedPoint = true;
            if (index === -1) {
                this.pointerList = [];
            } else {
                this.pointerList.splice(index, 1);
            }
            this.canvasUpdata();
        },
        // 编辑点位编号
        editRowIndex(row) {
            row.isEdit = !row.isEdit;
        },
        saveRowIndex(row) {
            console.log('row', row);
            this.clickSave();
        },
        // 编辑点位详情
        showEdit(index) {
            this.editPointer = this.pointerList[index];
            this.$refs.itemSelect.handleModalShow();
        },
        // 添加材料
        handleAddShow(type, ids, items) {
            let obj;
            this.isChangedPoint = true;
            if (this.editPointer === null) {
                console.log('handleAddShow before', this.pointerList);
                obj = {
                    id: null,
                    start: { x: 50, y: 50 },
                    end: { x: 50, y: 150 },
                    set_id: get(this.tabsArray, `[${this.currentTab}].id`, null),
                    target_id: null,
                    target_type: null,
                    item: null,
                };
                this.pointerList.push(obj);
                console.log('handleAddShow after', this.pointerList);
                this.canvasUpdata();
            } else {
                obj = this.editPointer;
            }
            items.map(item => {
                obj.target_id = item.id;
                obj.target_type = type;
                obj.item = item;
            });
        },
        // 点击保存
        clickSave() {
            const ths = this;
            this.errorArray = [];
            this.savePointNum = this.pointerList.length;
            console.log('clickSave pointerList', this.pointerList);
            console.log('clickSave tabsArray', this.tabsArray);
            this.parsePoint();
            const param = {
                item_component_set_list: this.tabsArray,
                target_id: ths.id || ths.detailId,
                target_type: Core.Const.ITEM_COMPONENT_SET.TARGET_TYPE.ITEM,
            };
            this.requestSave(param);
        },
        requestSave(param, msg = this.$t('i.save_site'), cb) {
            Core.Api.Item.bindItemComponent(param)
                .then(res => {
                    this.detailImageUrl = '';
                    this.$message.success(`${msg}` + this.$t('pop_up.success'));
                    this.isChangedPoint = false;
                    this.getItemExploreList();
                    if (cb) cb();
                })
                .catch(err => {
                    console.log('requestSave>>', msg, err);
                });
        },
        // 点击取消
        clickCancel() {
            this.pointerListData.forEach((item, index) => {
                this.pointerList[index] = Core.Util.deepCopy(item);
            });
            this.pointerList.slice(this.pointerListData.length);
            this.parsePoint(true);
            this.canvasUpdata();
            this.isChangedPoint = false;
            this.canvasUpdata();
        },
    },
};
</script>

<style lang="less" scoped>
.ExplosionImage {
    :deep(.add-explosion-btn) {
        border-radius: 4px;
        padding: 12px;
        box-sizing: border-box;
        position: relative;
        transform: translateY(-10px);
    }

    .explored-container {
        width: 100%;
        border: 1px solid #e2e2e2;
        border-radius: 0px 4px 4px 4px;

        .explored-operation-container {
            width: 100%;
            display: flex;
            justify-content: space-between;

            .point-controller-container {
                width: 208px;
            }

            .point-info-row-head {
                width: 100%;
                display: flex;
                align-items: center;
                background: #f2f3f5;
                padding: 6px;
                box-sizing: border-box;
                color: #000;
                font-size: 14px;
                font-style: normal;
                font-weight: 400;
                line-height: normal;
            }

            .point-controller {
                width: 100%;
                padding: 20px;
                box-sizing: border-box;
                max-height: 433px;
                overflow-y: scroll;
                background: #fff;
                border: 1px solid #eee;
                border-radius: 4px;

                &.border-none {
                    border: none;
                }

                &::-webkit-scrollbar {
                    /*滚动条整体样式*/
                    width: 6px;
                    height: 45px;
                }

                &::-webkit-scrollbar-thumb {
                    /*滚动条内部滑块*/
                    border-radius: 3px;
                    background-color: #cbcbcb;
                    transition: background-color 0.3s;

                    &:hover {
                        background: #bbb;
                    }
                }

                &::-webkit-scrollbar-track {
                    /*滚动条内部轨道*/
                    // opacity: 0.9;
                    background: #fff;
                }

                .point-info-empty {
                    color: #bfbfbf;
                    text-align: center;
                    font-size: 14px;
                    font-style: normal;
                    font-weight: 400;
                    line-height: normal;
                }

                .point-info-row {
                    margin-bottom: 12px;
                    width: 100%;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;

                    &:hover {
                        .point-info-right {
                            > img {
                                opacity: 1;
                            }
                        }
                    }

                    .point-info-left {
                        display: flex;
                        align-items: center;

                        .point-pos-num {
                            width: 16px;
                            height: 16px;
                            border-radius: 50%;
                            background: #f2f3f5;
                            color: #666;
                            font-size: 12px;
                            font-style: normal;
                            font-weight: 500;
                            margin-right: 4px;
                            .fcc();
                        }

                        .point-pos-name {
                            color: #1d2129;
                            font-size: 14px;
                            font-style: normal;
                            font-weight: 400;
                            line-height: normal;
                        }
                    }

                    .point-info-right {
                        > img {
                            width: 16px;
                            height: 16px;
                            cursor: pointer;
                            opacity: 0;
                        }
                    }
                }
            }

            .point-controller > :last-child {
                margin-bottom: 0;
            }
        }

        .empty-picture-container {
            padding: 20px;
            box-sizing: border-box;

            .tip-wrap {
                display: flex;
                align-items: center;
                width: 85px;

                .tip-icon {
                    width: 16px;
                    height: 16px;
                    margin-right: 5px;
                }

                .tip-text {
                    color: #1d2129;
                    font-size: 16px;
                    font-style: normal;
                    font-weight: 400;
                    line-height: normal;
                }
            }

            .empty-upload-container {
                width: 100%;
                height: 369px;
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

        .point-table-container {
            padding: 20px;
            box-sizing: border-box;
            width: 100%;

            .point-table-wrap {
                width: 100%;
                border: 1px solid #e2e2e2;
                border-radius: 4px;
            }

            .point-table-head {
                width: 100%;
                padding: 10px 20px;
                box-sizing: border-box;
                display: flex;
                justify-content: space-between;
                align-items: center;
                background: #e5efff;

                .point-table-head-title {
                    color: #000;
                    font-size: 16px;
                    font-style: normal;
                    font-weight: 500;
                    line-height: normal;
                }
            }

            :deep(.ant-table-wrapper) {
                padding: 10px;
                box-sizing: border-box;
            }

            .empty-table-container {
                padding: 10px;
                box-sizing: border-box;

                .empty-table-head {
                    width: 100%;
                    background: #f7f8fa;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 10px 16px;
                    box-sizing: border-box;

                    .empty-table-head-block {
                        color: #1d2129;
                        font-size: 14px;
                        font-style: normal;
                        font-weight: 500;
                        width: calc(100% / 4);
                    }
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
    }

    .explore-head-container {
        width: 100%;
        display: flex;
        justify-content: space-between;
    }

    .explore-tab-container {
        display: flex;

        .explore-tab {
            padding: 6px 10px;
            box-sizing: border-box;
            background: #fafafa;
            border: 1px solid #e2e2e2;
            color: #666;
            font-size: 14px;
            font-style: normal;
            font-weight: 400;
            line-height: normal;
            margin-right: 4px;
            cursor: pointer;
            border-radius: 4px 4px 0 0;
            position: relative;
            transform: translateY(1px);
            .fcc();

            &.on-click {
                background: #fff;
                color: #0061ff;
                border-bottom: 1px solid #fff;
            }
        }
    }

    .image-contain {
        display: inline-block;
        position: relative;
        max-width: 857px;
        max-height: 397px;
        min-height: 100px;
        margin: 0 auto;
        padding: 0 20px;
        box-sizing: content-box;

        .canvas-img {
            max-height: 385px;
        }

        .pointer-end,
        .pointer-start {
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

            .component-container {
                padding-top: 10px;
            }

            .component {
                position: relative;
                display: inline-block;
                width: 150px;
                height: 100px;
                text-align: left;

                .component-contain {
                    position: absolute;
                    // display: flex;
                    // flex-wrap: wrap;
                    .fcc();
                    z-index: 2;
                    padding: 10px;
                    top: -44px;
                    left: 26px;
                    // width: 250px;
                    border-radius: 2px;
                    background-color: @BG_LP;
                    border: 1px solid @BG_LP;
                    font-size: 0;

                    // &:before,
                    // &:after {
                    //     content: "";
                    //     display: block;
                    //     border-width: 5px;
                    //     position: absolute;
                    //     top: -10px;
                    //     left: 30px;
                    //     border-style: solid dashed dashed;
                    //     border-color: transparent transparent @BG_LP transparent;
                    //     font-size: 0;
                    //     line-height: 0;
                    // }

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
                            transform: scale(0.9, 0.9);
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

    .btns-area {
        display: flex;
    }

    @media (max-width: 1700px) {
        .btns-area {
            display: flex;
            flex-direction: column;
            align-items: flex-end;
        }

        .panel-btn {
            margin-left: 0;
        }
    }

    .text-c {
        text-align: center;
    }

    .form-block .form-content .value .contain {
        width: 100%;
        height: 100%;

        .contain-action {
            text-align: center;
            margin-bottom: 24px;
        }
    }

    .form-hide {
        width: 0;
        height: 0;
        overflow: hidden;
    }

    .ant-input {
        width: 100px;
    }
}
</style>
