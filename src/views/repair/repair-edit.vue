<template>
    <div id="RepairEdit" class="edit-container">
        <!-- 标题 -->
        <div class="title-container">
            <div class="title-area">{{ form.id ? $t('r.repair_edit') : $t('r.repair_create') }}</div>
        </div>
        <!-- 顶部提示 -->
        <div class="tips-container">
            <div class="tips-block">
                <img src="../../assets/images/warn-tip.png" alt="">
                <div class="tips-text" v-for="item in tipList" :key="index">
                    {{ item }}
                </div>
            </div>
        </div>
        <!-- 车辆信息 -->
        <div class="head-container">
            <div class="color-block"></div>
            <div class="head-wrap">
                {{ $t(/*车辆信息*/'r.vehicle_information') }}
            </div>
        </div>
        <!-- 车架号 -->
        <div class="form-container">
            <div class="form-wrap required">
                <div class="key">{{ $t('search.vehicle_no') }}:</div>
                <div class="value">
                    <a-textarea v-model:value="form.vehicle_no" :placeholder="$t('search.enter_vehicle_no')"
                        :auto-size="{ minRows: 1, maxRows: 5 }" />
                </div>
                <a-button type="primary">{{ $t('i.addition') }}</a-button>
            </div>
        </div>
        <div class="detail-container">
            <div class="item-table-container">
                <div class="item-table-head">
                    <div class="item-table-title">
                        {{ $t(/*商品信息*/'i.product_information') }}
                    </div>
                    <div class="item-table-tip">
                        {{ $t(/*商品信息*/'r.top_long_tip') }}
                    </div>
                </div>
                <a-table style="margin-top: 6px;" :columns="itemTableColumns" :data-source="itemTableData"
                    :scroll="{ x: true }" :row-key="record => record.id" :pagination='false' @change="handleTableChange">
                    <template #headerCell="{ column }">
                        <div v-html="column.title"></div>
                    </template>
                    <template #bodyCell="{ column, text, record }">
                        <template v-if="column.dataIndex === 'warranty_status'">
                            <a-tooltip v-if="text === 3" placement="top" :title="$t('r.tooltip_text')">
                                <div class="status status-bg status-box" :class="$Util.threePagFilter(text, 'color')">
                                    {{ $Util.threePagFilter(text, $i18n.locale) }}
                                </div>
                            </a-tooltip>
                            <div class="status status-bg status-box" v-else :class="$Util.threePagFilter(text, 'color')">
                                {{ $Util.threePagFilter(text, $i18n.locale) }}
                            </div>
                        </template>
                        <!-- 通用展示 -->
                        <template v-if="column.key === 'item'">
                            {{ text || '-' }}
                        </template>
                        <template v-if="column.key === 'frame_uid'">
                            <a-tooltip placement="top" :title='text'>
                                {{ text || '-' }}
                            </a-tooltip>
                        </template>
                        <!-- 行驶公里数 -->
                        <template v-if="column.key === 'input'">
                            <a-input v-model:value="mileage" style="width: 140px; margin-right: 4px;"
                                :placeholder="$t(/*请输入里程数*/'search.enter_mile')" /> {{ $t(/*公里*/'r.km') }}
                        </template>
                        <template v-if="column.key === 'operation'">
                            <a-button type="link" class="danger" @click="handleDeleteItemTable">{{ $t('def.delete')
                            }}</a-button>
                        </template>
                    </template>
                </a-table>
                <div class="table-footer">
                    {{ $t('n.all_total') }}
                    <span class="table-footer-num">5</span>
                    {{ $t('r.records') }}，{{ $t('r.filtered_duplicate') }}
                    <span class="table-footer-num">2</span>
                    {{ $t('in.total') }}，
                    {{ $t('r.Execute_intermediate') }}
                    <span class="table-footer-num">2</span>
                    {{ $t('in.total') }}，{{ $t('search.special') }}
                    <span class="table-footer-num">2</span>
                    {{ $t('in.total') }}，{{ $t('r.spec_tip') }}
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Core from '../../core';
import dayjs from 'dayjs';

const REPAIR = Core.Const.REPAIR
import ChinaAddressCascader from '@/components/common/ChinaAddressCascader.vue'
import AddressCascader from '@/components/common/AddressCascader.vue'

export default {
    name: 'RepairEdit',
    components: { ChinaAddressCascader, AddressCascader },
    props: {},
    data() {
        return {
            REPAIR,
            loginType: Core.Data.getLoginType(),
            // 加载
            loading: false,
            detail: {
                status: 0,
                repair_user_id: undefined, // 工单负责人
                plan_time: undefined, // 计划时间
                repair_message: "", // 处理信息、工单备注
                priority: 0, // 紧急程度
            }, // 工单详情
            create_time: [],
            defaultTime: Core.Const.TIME_PICKER_DEFAULT_VALUE.BEGIN,
            deviceList: REPAIR.DEVICE_LIST, // 工单类型
            typeList: REPAIR.TYPE_LIST, // 工单分类
            categoryList: REPAIR.CATEGORY_LIST, // 维修工单类别
            partsList: REPAIR.PARTS_LIST, // 零配件类别
            methodList: REPAIR.METHOD_LIST, // 维修类别
            serviceList: REPAIR.SERVICE_TYPE_LIST,//工单帐类
            channelList: REPAIR.CHANNEL_LIST, // 维修方式
            priorityList: REPAIR.PRIORITY_LIST, // 紧急程度
            customerList: [], // 车主列表
            isExist: '', // 车辆编号输入框提示
            form: {
                id: '',
                device_type: 1,  // 工单类型
                type: 1,  // 工单分类
                category: 1, // 维修工单类别
                name: '', // 工单名称
                desc: '', // 问题描述
                service_type: '',//保内维修、保外维修
                mileage: '',//行程公里数
                channel: 1, // 维修方式、维修途径
                repair_method: 1, // 维修类别
                vehicle_no: '', // 车架号
                customer_id: undefined,  // 相关客户-id
                customer_name: "",  // 相关客户-名称
                customer_phone: "", // 客户电话
                customer_email: "", // 客户邮箱
                customer_address: "", // 维修地址
                remark: "", // 工单备注
                repair_user_id: undefined, // 工单负责人
                plan_time: undefined, // 计划时间
                // finish_time: undefined, // 完成时间
                repair_message: "", // 处理信息、工单备注
                priority: 0, // 紧急程度
            },
            defAddr: [],
            arrival_time: '',
            areaMap: {},
            area: {
                country: '',
                country_en: '',
                province: '',
                province_en: '',
                city: '',
                city_en: '',
                county: '',
            },
            tipList: [
                "1. 当前新增工单时，请填写出现同一工单类型的车架号信息",
                "2. 同一车型的车架号会生成一个工单",
                "3. 提交后的工单在没有审核前，可以点击取消并重新编辑工单，也可直接作废该工单，作废的工单不可再次编辑；取消的工单在【已关闭】状态的工单列表中查找",
            ],
            showTextarea: false, // 初始值为false，表示显示输入框
            itemTableData: [
                {
                    id: 1,
                    frame_uid: 'R45LA1C20P2000043',
                    item_name: '液压升降小推车--MAUTO',
                    item_code: 'HW800T-1/02N6',
                    model: 'SK3',
                    item_spec: '银色；100/80-14’’',
                    warranty_status: 1,
                },
                {
                    id: 2,
                    frame_uid: 'R45LA1C20P2000043',
                    item_name: '液压升降小推车--MAUTO',
                    item_code: 'HW800T-1/02N6',
                    model: 'SK3',
                    item_spec: '银色；100/80-14’’',
                    warranty_status: 3,
                },
                {
                    id: 3,
                    frame_uid: 'R45LA1C20P2000043',
                    item_name: '液压升降小推车--MAUTO',
                    item_code: 'HW800T-1/02N6',
                    model: 'SK3',
                    item_spec: '银色；100/80-14’’',
                    warranty_status: 2,
                },
                {
                    id: 4,
                    frame_uid: 'R45LA1C20P2000043',
                    item_name: '液压升降小推车--MAUTO',
                    item_code: 'HW800T-1/02N6',
                    model: 'SK3',
                    item_spec: '银色；100/80-14’’',
                    warranty_status: 3,
                },
            ],
            mileage: undefined,
        };
    },
    watch: {},
    computed: {
        itemTableColumns() {
            let columns = [
                { title: this.$t('search.vehicle_no'), dataIndex: 'frame_uid', key: 'frame_uid' }, // 车架号
                { title: this.$t('r.item_name'), dataIndex: 'item_name', key: 'item' }, // 商品名称
                { title: this.$t('i.code'), dataIndex: 'item_code', key: 'item' }, // 商品编码
                { title: this.$t('r.car_type'), dataIndex: 'model', key: 'item' }, // 车型
                { title: this.$t('i.commercial_specification'), dataIndex: 'item_spec', key: 'item' }, // 商品规格
                {
                    title: `<span style="color: red; margin-right: 2px;">*</span> ${this.$t('r.km_travelled')}`,
                    dataIndex: 'mileage',
                    key: 'input'
                },
                { title: this.$t('r.three_pack_aging'), dataIndex: 'warranty_status' }, // 三包时效
                { title: this.$t('def.operate'), key: 'operation' }
            ]
            return columns
        },
    },
    mounted() {
        this.form.id = Number(this.$route.query.id) || 0
        if (this.form.id) {
            this.getRepairDetail();
        }
        this.getCustomerList();
    },
    methods: {
        // 页面跳转
        routerChange(type, item) {
            let routeUrl
            switch (type) {
                case 'back':
                    this.$router.go(-1)
                    break;
                case 'customer':  // 新建客户
                    routeUrl = this.$router.resolve({
                        path: "/eos-customer/eos-customer-edit",
                    })
                    window.open(routeUrl.href, '_blank')
                    break;
                case 'detail':  // 维修单详情
                    routeUrl = this.$router.replace({
                        path: "/repair/repair-detail",
                        query: {
                            id: item.id
                        }
                    })
                    // window.open(routeUrl.href, '_blank')
                    break;
            }
        },

        // 获取 车主列表
        getCustomerList(val) {
            Core.Api.Customer.list(
            ).then(res => {
                this.customerList = res.list
                if (val == 'refresh') {
                    this.$message.success(this.$t('r.refreshed'))
                }
            })
        },
        // 获取工单详情
        getRepairDetail() {
            this.loading = true;
            Core.Api.Repair.detail({
                id: this.form.id,
            }).then(res => {
                console.log('getRepairDetail res', res)
                this.detail = res
                this.form.id = res.id
                for (const key in this.form) {
                    this.form[key] = res[key]
                }
                this.form.customer_id = this.form.customer_id || undefined
                this.form.repair_user_id = this.form.repair_user_id || undefined
                this.form.plan_time = this.form.plan_time ? dayjs.unix(this.form.plan_time).format('YYYY-MM-DD HH:mm:ss') : undefined
                // this.form.finish_time = this.form.finish_time ? dayjs.unix(this.form.finish_time).format('YYYY-MM-DD HH:mm:ss') : undefined
            }).catch(err => {
                console.log('getRepairDetail err', err)
            }).finally(() => {
                this.loading = false;
            });
        },

        // 表单提交
        async handleSubmit() {
            let form = Core.Util.deepCopy(this.form)
            let area = Core.Util.deepCopy(this.area)
            if (!Core.Util.isEmptyObj(this.areaMap)) {
                area.country = this.areaMap.country.name
                area.country_en = this.areaMap.country.name_en
                area.city = this.areaMap.city.name
                area.city_en = this.areaMap.city.name_en
                if (this.areaMap.province) {
                    area.province = this.areaMap.province.name
                    area.province_en = this.areaMap.province.name_en
                } else {
                    area.province = ""
                    area.province_en = ""
                }
                if (this.areaMap.county) {
                    area.county = this.areaMap.county.name
                    area.county_en = this.areaMap.county.county_en
                } else {
                    area.county = ""
                    area.county_en = ""
                }
            }

            form.plan_time = form.plan_time ? dayjs(form.plan_time).unix() : 0

            let checkRes = this.checkFormInput(form);
            if (!checkRes) {
                return
            }
            let apiName = form.id ? 'update' : 'create'
            if (form.device_type !== REPAIR.DEVICE.FINISHED_AUTOMOBILE) {
                form.customer_address = ''
                form.customer_email = ''
                form.customer_name = ''
                form.customer_phone = ''
            }

            await Core.Api.Repair[apiName]({
                ...form,
                ...area,
                arrival_time: this.arrival_time
            }).then(res => {
                this.$message.success(this.$t('pop_up.save_success'))
                this.routerChange('detail', res.detail)
            }).catch(err => {
                console.log();
                console.log('handleSubmit err:', err)
            })
        },
        handleVehicleBlur() {  // 获取 车架号
            if (!this.form.vehicle_no) {
                return this.isExist = ''
            }
            Core.Api.Entity.detailByUid({
                uid: this.form.vehicle_no,
            }).then(res => {
                this.isExist = res.detail == null ? 2 : 1
                this.arrival_time = res.detail.arrival_time
                console.log('arrival_time')
                console.log("handleVehicleBlur res", res)
            }).catch(err => {
                console.log('handleVehicleBlur err', err)
            }).finally(() => {
            });
        },
        // 检查表单输入
        checkFormInput(form) {

            if (!form.type) {
                console.log('form.type');
                return this.$message.warning(this.$t('def.enter'))
            }
            if (!form.priority) {
                console.log('form.priority');
                return this.$message.warning(this.$t('def.enter'))
            }
            if (!form.service_type) {
                console.log('form.service_type');
                return this.$message.warning(this.$t('def.enter'))
            }
            if (!form.mileage && form.mileage !== 0 && form.device_type === Core.Const.REPAIR.DEVICE.FINISHED_AUTOMOBILE) {
                console.log('form.mileage');
                return this.$message.warning(this.$t('def.enter'))
            }
            if (!form.name) {
                console.log('form.name');
                return this.$message.warning(this.$t('def.enter'))
            }
            if (!form.desc) {
                console.log('form.desc');
                return this.$message.warning(this.$t('def.enter'))
            }
            if (!form.channel && form.device_type === Core.Const.REPAIR.DEVICE.FINISHED_AUTOMOBILE) {
                console.log('form.channel');
                return this.$message.warning(this.$t('def.enter'))
            }
            if (!form.repair_method && form.device_type === Core.Const.REPAIR.DEVICE.FINISHED_AUTOMOBILE) {
                console.log('form.repair_method');
                return this.$message.warning(this.$t('def.enter'))
            }
            if (!form.vehicle_no && form.device_type === Core.Const.REPAIR.DEVICE.FINISHED_AUTOMOBILE) {
                console.log('form.vehicle_no');
                return this.$message.warning(this.$t('def.enter'))
            }
            // if (this.isExist === false && form.device_type === Core.Const.REPAIR.DEVICE.FINISHED_AUTOMOBILE) {
            //     return this.$message.warning(this.$t('def.enter'))
            // }
            if (form.id && form.device_type === REPAIR.DEVICE.FINISHED_AUTOMOBILE) {
                // if (!form.customer_id) {
                //     console.log('form.customer_id');
                //     return this.$message.warning(this.$t('def.enter'))
                // }
                // if (form.channel == 1 && !form.customer_address) {
                //     console.log('form.customer_address');
                //     return this.$message.warning(this.$t('def.enter'))
                // }
                // if (!form.repair_user_id) {
                //     this.$message.warning('请选择工单负责人')
                // }
                if (!form.customer_name) {
                    console.log('form.customer_name');
                    return this.$message.warning(this.$t('def.enter'))
                }
                // if (!form.customer_phone) {
                //     console.log('form.customer_phone');
                //     return this.$message.warning(this.$t('def.enter'))
                // }
                // if (!form.customer_email) {
                //     console.log('form.customer_email');
                //     return this.$message.warning(this.$t('def.enter'))
                // }
                // if (!this.areaMap.country && !this.areaMap.city) {
                //     return this.$message.warning(this.$t('def.enter'))
                // }
            }
            return 1
        },

        // 选择客户
        handleCustomerSelect(id) {
            let item = this.customerList.find(i => i.id === id)
            console.log('customerList', this.customerList)
            this.form.customer_name = item.name ? item.name : ''
            this.form.customer_phone = item.phone ? item.phone : ''
            this.form.customer_email = item.email ? item.email : ''
            this.area.country = item.country
            this.area.country_en = item.country_en
            this.area.province = item.province
            this.area.province_en = item.province_en
            this.area.city = item.city
            this.area.city_en = item.city_en
            this.area.county = item.county
            this.form.customer_address = item.address ? item.address : ''
            // this.defAddr = [item.country,item.province, item.city, item.county]
            console.log('this.addr', this.defAddr)
            console.log('this.area', this.area);

        },
        handleTypeChange() {
            switch (this.form.type) {
                case REPAIR.TYPE.TYPE_COMMON: {
                    this.form.service_type = '';
                    break;
                }
                case REPAIR.TYPE.TYPE_SPECIAL: {
                    this.form.service_type = REPAIR.SERVICE_TYPE.IN_REPAIR_TIME;
                    break;
                }
            }
        },

        /* handleAddressSelect(address) {
             this.form.province = address[0]
             this.form.city = address[1]
             this.form.county = address[2]
         }*/
        handleDeleteItemTable() {
            let _this = this;
            this.$confirm({
                title: _this.$t('pop_up.sure_delete'),
                okText: _this.$t('def.sure'),
                okType: 'danger',
                cancelText: this.$t('def.cancel'),
                onOk() {
                    console.log(111);
                },
            });
        },
    }
};
</script>

<style lang="less" scoped>
#RepairEdit {
    :deep(.ant-table-cell) {
        color: #1D2129;
        font-size: 12px;
    }

    .tips-container {
        width: 100%;
        padding: 20px;
        box-sizing: border-box;

        .tips-block {
            width: 100%;
            padding: 16px 0 0 46px;
            box-sizing: border-box;
            min-height: 98px;
            border-radius: 8px;
            border: 1px solid rgba(255, 125, 0, 0.30);
            background: #FFF8F2;
            position: relative;

            >img {
                position: absolute;
                top: 20px;
                left: 20px;
                width: 20px;
                height: 20px;
            }

            .tips-text {
                color: #FF7D00;
                font-size: 15px;
                font-weight: 400;
                line-height: 24px;
            }
        }
    }

    .head-container {
        width: 100%;
        display: flex;
        padding: 32px 20px 24px;
        box-sizing: border-box;

        .color-block {
            width: 3px;
            height: 48px;
            background-color: #0061FF;
        }

        .head-wrap {
            width: calc(100% - 3px);
            height: 48px;
            background-color: #F9FBFF;
            display: flex;
            align-items: center;
            padding-left: 24px;
            box-sizing: border-box;
            color: #1D2129;
            font-size: 16px;
            font-weight: 600;
        }
    }

    .form-container {
        width: 100%;
        padding: 0 20px 0;
        box-sizing: border-box;

        .form-wrap {
            display: flex;
            align-items: center;

            .key {
                margin-right: 16px;
                color: #000;
                font-size: 14px;
            }

            .value {
                width: 400px;
                height: 32px;

                textarea {
                    &::-webkit-scrollbar {
                        /*滚动条整体样式*/
                        width: 6px;
                        height: 52px;
                    }


                    &::-webkit-scrollbar-thumb {
                        /*滚动条内部滑块*/
                        border-radius: 10px;
                        background-color: #D9D9D9;
                        transition: background-color 0.3s;


                        &:hover {
                            background: #bbb;
                        }
                    }


                    &::-webkit-scrollbar-track {
                        /*滚动条内部轨道*/
                        // opacity: 0.9;
                        background: #F5F5F5;
                    }
                }
            }

            .ant-btn {
                width: 80px;
                height: 32px;
                margin-left: 16px;
            }

            .key::before {
                opacity: 0;
                content: '*';
                color: @TC_required;
                padding-right: 2px;
            }

            &.required {

                // 必填标志
                .key::before {
                    opacity: 1;
                }
            }
        }
    }

    .detail-container {
        width: 100%;
        min-height: 650px;
        background-color: #FFF;
        padding: 0 20px 20px 20px;
        box-sizing: border-box;

        .item-table-container {
            margin-top: 24px;
            padding-left: 68px;
            box-sizing: border-box;
            width: 100%;

            .item-table-head {
                display: flex;
                align-items: center;

                .item-table-title {
                    color: #1D2129;
                    font-size: 16px;
                    font-weight: 600;
                }

                .item-table-tip {
                    color: #86909C;
                    font-size: 12px;
                    margin-left: 10px;
                }
            }

            .table-footer {
                color: #86909C;
                font-size: 12px;
                font-weight: 400;
                margin-top: 12px;

                .table-footer-num {
                    color: #F5222D;
                    font-weight: 600;
                }
            }
        }
    }


    .form-item {
        .value {
            .fac();

            .ant-input-number {
                margin-right: 10px;
            }

            .unit {
                font-size: 12px;
                line-height: 16px;
                color: #363D42;
            }

        }

        i.icon {
            display: inline-block;
            width: 24px;
            text-align: right;
            font-size: 18px;

        }

        .i_confirm {
            color: @green;
            font-size: 18px;
        }

        .i_close_c {
            color: @red;
            font-size: 18px;

        }

        .not_exist {
            text-align: center;
            align-items: center;
        }
    }
}
</style>
