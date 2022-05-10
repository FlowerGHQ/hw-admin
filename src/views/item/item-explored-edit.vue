<template>
<div id="ItemEdit" class="edit-container">
    <a-spin :spinning="loading" class='loading-incontent' v-if="loading"></a-spin>
    <div class="title-container">
        <div class="title-area">编辑爆炸图</div>
    </div>
    <ItemHeader :detail='detail' :showSpec='indep_flag ? true : false'/>
    <!-- 图片信息 -->
    <div class="form-block"> 
        <div class="form-title">
            <div class="title">图片信息</div>
        </div>
        <div class="form-content">
            <div class="form-item img-upload">
                <div class="key">爆炸图</div>
                <div class="value">
                    <a-upload name="file" class="image-uploader"
                        list-type="picture-card" accept='image/*'
                        :file-list="upload.coverList" :action="upload.action"
                        :headers="upload.headers" :data='upload.data'
                        :before-upload="handleImgCheck"
                        @change="handleCoverChange">
                        <div class="image-inner" v-if="upload.coverList.length < 1">
                            <i class="icon i_upload"/>
                        </div>
                    </a-upload>
                    <div class="tip">建议尺寸：800*800像素</div>
                </div>
            </div>
        </div>
    </div>
    <!-- 编辑爆炸图 -->
    <div class="form-block" v-show="detailImageUrl"> 
        <div class="form-title">
            <div class="title">编辑信息</div>
        </div>
        <div class="form-content">
            <div class="value">
                <div class="contain">
                    <div class="image-contain" @mouseup="mouseupHandler" @mousemove="mousemoveHandler">
                        <img :src="detailImageUrl" ref="exploreImg" alt="">
                        <canvas ref="exploreCanvas"></canvas>
                        <div class="pointer-start" v-for="(item, index) in pointerList" :key="index" 
                            :style="{'left': `${item.start.x - 4}px`, 'top': `${item.start.y - 4}px`}"
                            @mousedown="pointMousedown(index, 'start')" @mouseup="pointMouseup" @mousemove.stop=""></div>

                        <div class="pointer-end" v-for="(item, index) in pointerList" :key="index" 
                            :style="{'left': `${item.end.x - 10}px`, 'top': `${item.end.y - 10}px`}"
                            @mousedown="pointMousedown(index, 'end')" @mouseup="pointMouseup"
                            @dblclick="showEdit(index)" @mousemove.stop="">
                            {{index + 1}}
                            <!-- <div class="component" v-show="moveIndex === null"> -->

                            <div class="component" v-show="moveIndex !== index">
                                <div class="component-contain">
                                    <template v-if="item.target_id">
                                        <!-- <span>{{item.target_detail.name}}</span>
                                        <span>&nbsp;|&nbsp;</span> -->
                                        <!-- <span>{{item.target_detail.}}</span> -->
                                        <!-- <div>€{{$Util.countFilter(item.target_detail[priceKey + 'eur'])}} | ${{$Util.countFilter(item.target_detail[priceKey + 'usd'])}}</div> -->
                                    </template>
                                    <div @mousedown.stop="">
                                        <a-button size="small" type="primary" @click="showEdit(index)">编辑</a-button>
                                        <a-button size="small" @click="clickDeletePoint(index)">删除</a-button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="contain-action">
                        <a-button @click="clickAdd" type="primary">新增点位</a-button>
                        <a-button @click="clickDeletePoint(-1)">清空点位</a-button>
                        <a-button @click="clickSave">保存</a-button>
                        <a-button @click="clickCancel">撤销</a-button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- 绑定配件弹窗 -->
    <div class="form-block form-hide">
        <ItemSelect ref="itemSelect" @select="(ids,items) => handleAddShow(TARGET_TYPE.ITEM,ids,items)" btn-class="panel-btn" :radioMode="true" :disabled-checked='checkedIds'>
            添加商品
        </ItemSelect>
    </div>
</div>
</template>
<script>
import { get } from 'lodash';
import Core from '../../core';
import ItemHeader from './components/ItemHeader.vue'
import ItemSelect from '@/components/popup-btn/ItemSelect.vue';

const TARGET_TYPE = Core.Const.BOM.TARGET_TYPE;
const TEST_IMAGE = 'https://rebuild-mel-erp.oss-cn-hangzhou.aliyuncs.com/img/700ad6f5592c78946f85a22c19551a1c6bc7c3a1dc77b19edab6012d2e2d0b33.png';
export default {
    components: {
        ItemHeader,
        ItemSelect,
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

            activeKey: ['itemSpec'],

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
            details: {},
            detailImageUrl: '',
            shortPath: '',

            canvas: null,
            ctx: null,

            isStart: false,

            pointerList: [], // 点位列表
            pointerListData: [], // 点位列表初始数据
            editPointer: {}, // 编辑点位
            moveIndex: null,
            moveType: null, // 0:起点,1:终点

            savePointNum: 0,
            errorArray: [],
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
                {title: '商品编码', key: 'input', dataIndex: 'code', fixed: 'left'},
            )
            column.push(
                {title: '操作', key: 'operation'},
            )
            return column
        },
        // 已经添加到BOM表中的ids
        checkedIds() {
            // let checkedIds = this.details.items.map(i=>i.target_id);
            // console.log('checkedIds:', checkedIds)
            // return checkedIds
            return []
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
                this.getItemComponent();
            });
        },
        /** 获取 商品详情 */ 
        getItemComponent() {
            Core.Api.Item.getItemComponent({
                id: this.id
            }).then(res => {
                console.log("getItemComponent res", res);
                let list = (res.list || {}).list || [];
                this.pointerListData = list.map(item=>{
                    item.start = JSON.parse(item.start_point);
                    item.end = JSON.parse(item.end_point);
                    return item;
                })
                this.pointerList = Core.Util.deepCopy(this.pointerListData);
                this.detailImageUrl = TEST_IMAGE;
                if(this.detailImageUrl) {
                    this.loadImage(this.detailImageUrl);
                }
            }).catch(err => {
                console.log('getItemComponent err', err)
            }).finally(() => {
                this.loading = false;
            });
        },

        // 校验图片
        handleImgCheck(file) {
            const isCanUpType = ['image/jpeg', 'image/png', 'image/gif', 'image/bmp'].includes(file.type)
            if (!isCanUpType) {
                this.$message.warning('文件格式不正确');
            }
            const isLt10M = (file.size / 1024 / 1024) < 10;
            if (!isLt10M) {
                this.$message.warning('请上传小于10MB的图片');
            }

            this.loadImage(TEST_IMAGE);
            return false;
            // return isCanUpType && isLt10M;
        },
        // 上传图片
        handleCoverChange({ file, fileList }) {
            if (file.status == 'done') {
                if (file.response && file.response.code < 0) {
                    return this.$message.error(file.response.message)
                }
                this.shortPath = get(fileList,'[0].response.data.filename', null);
                if(this.shortPath) {
                    this.detailImageUrl = Core.Const.NET.FILE_URL_PREFIX + this.shortPath;
                    this.loadImage(this.detailImageUrl);
                }
            }
            this.upload.coverList = fileList;
        },

        // 加载图片，获取宽高
        loadImage(url){
            let img = new Image();
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
            if(this.pointerList.length > 0) {
                this.canvasUpdata();
            }
        },

        /** 点击添加点位 */
        clickAdd(){
            this.pointerList.push({
                id: null,
                start: { x: 50, y: 50 },
                end: { x: 50, y: 150 },
                target_id: null,
                target_type: null,
                target_detail: null,
            });
            this.canvasUpdata();
        },
        /** 
         * @description 删除点位 
         * @param index 序列： -1则删除全部
         * */
        clickDeletePoint (index = -1) {
            if(index === -1) {
                this.pointerList = [];
            } else {
                this.pointerList.splice(index, 1);
            }
            this.canvasUpdata();
        },

        /** 
         * @description 点位鼠标点下 
         * @param e event
         * @param index 序列
         * @param type 起/始点
         * */
        pointMousedown (index, type) {
            this.moveIndex = index;
            this.moveType = type;
            this.isStart = true;
        },
        /** 
         * @description 点位鼠标抬起 
         * @param e event
         * @param index 序列
         * @param type 起/始点
         * */
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
            // this.ctx.strokeStyle = '#000000';
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
        /** 编辑点位详情 */
        showEdit (index) {
            this.editPointer = this.pointerList[index];
            this.$refs.itemSelect.handleModalShow();
        },

        // 添加材料
        handleAddShow(type, ids, items) {
            items.map(item => {
                this.editPointer.target_id = item.id;
                this.editPointer.target_type = type;
                this.editPointer.target_name = item.name;
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
            this.pointerList.forEach((item, index)=>{
                item.index = index + 1;
                ths.bindComponent(item);
            })
        },
        /** 点击取消 */
        clickCancel () {
            this.pointerList = Core.Util.deepCopy(this.pointerListData);
            this.canvasUpdata();
        },
        /** 请求绑定 */
        bindComponent (info) {
            const param = {
                id: info.id,
                img: TEST_IMAGE,
                item_id: this.id,
                start_point: JSON.stringify(info.start),
                end_point: JSON.stringify(info.end),
                target_id: info.target_id,
                target_type: info.target_type
            };
            Core.Api.Item.bindItemComponent(param).then(res => {
            }).catch(err => {
                this.errorArray.push(info.index);
            }).finally(() => {
                this.savePointNum--;
                if(this.savePointNum === 0 && this.errorArray.length > 0) {
                    this.$message.error(`${this.errorArray.join(',')}点位保存失败`);
                } else if (this.savePointNum === 0){
                    if(this.savePointNum === 0) this.$message.success('保存成功');
                }
            });
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
    .image-contain {
        display: inline-block;
        position: relative;
        margin-bottom: 80px;
        max-width: 800px;
        max-height: 800px;
        min-height: 100px;

        .pointer-end, .pointer-start {
            position: absolute;
            z-index: 10;
            border-radius: 50px;
            user-select: none;
            opacity: 0.6;
            transition: opacity 0.2s ease;
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
            border: 1px solid @BG_LP;
            background-color: white;
            .component {
                position: relative;
                display: inline-block;
                width: 150px;
                height: 100px;
                text-align: center;
                .component-contain {
                    position: absolute;
                    z-index: 2;
                    padding: 12px 24px;
                    top: 10px;
                    left: -26px;
                    width: 100%;
                    border-radius: 5px;
                    background-color: #ffffff;
                    border: 1px solid @BG_LP;
                    &:before, &:after {
                        content: "";
                        display: block;
                        border-width: 12px;
                        position: absolute;
                        top: -24px;
                        left: 22px;
                        border-style: solid dashed dashed;
                        border-color: transparent transparent @BG_LP  transparent;
                        font-size: 0;
                        line-height: 0;
                    } 
                    &:after {
                        top: -23px;
                        left: 22px;
                        border-color: transparent transparent #ffffff transparent;
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
</style>