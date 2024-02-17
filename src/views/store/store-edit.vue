<template>
    <div id="StoreEdit" class="edit-container">
        <div class="title-container">
            <div class="title-area">{{ form.id ? $t('s.edit') : $t('s.new_store') }}</div>
        </div>
        <div class="form-block">
            <div class="form-title">
                <div class="title">{{ $t('n.information') }}</div>
            </div>
            <div class="form-content">
                <div class="form-item required" v-if="$auth('ADMIN') && !form.id">
                    <div class="key">{{ $t('n.distributor') }}</div>
                    <div class="value">
                        <a-select
                            v-model:value="form.distributor_id"
                            :placeholder="$t('search.select_distributor')"
                            @change="onDistributorChange"
                        >
                            <a-select-option
                                v-for="distributor of distributorList"
                                :key="distributor.id"
                                :value="distributor.id"
                                >{{ distributor.name }}</a-select-option
                            >
                        </a-select>
                    </div>
                </div>
                <div class="form-item" v-if="$auth('ADMIN', 'DISTRIBUTOR') && !form.id">
                    <div class="key">{{ $t('n.agent') }}</div>
                    <div class="value">
                        <a-select v-model:value="form.agent_id" :placeholder="$t('search.select_agent')">
                            <a-select-option v-for="agent of agentList" :key="agent.id" :value="agent.id">{{
                                agent.name
                            }}</a-select-option>
                        </a-select>
                    </div>
                </div>
                <div class="form-item required">
                    <div class="key">{{ $t('n.name') }}：</div>
                    <div class="value">
                        <a-input v-model:value="form.name" :placeholder="$t('def.input')" />
                    </div>
                </div>

                <div class="form-item required">
                    <div class="key">{{ $t('d.short_name') }}:</div>
                    <div class="value">
                        <a-input v-model:value="form.short_name" :placeholder="$t('def.input')" />
                    </div>
                </div>
                <div class="form-item">
                    <div class="key">{{ $t('d.pay_type') }}:</div>
                    <div class="value">
                        <a-select v-model:value="form.pay_type" :placeholder="$t('def.select_payment_term')">
                            <a-select-option
                                v-for="(val, key) in PAY_TIME_LIST"
                                :key="val['key']"
                                :value="val['key']"
                                >{{ val[$i18n.locale] }}</a-select-option
                            >
                        </a-select>
                    </div>
                </div>
                <div class="form-item">
                    <div class="key">{{ $t('n.contact') }}:</div>
                    <div class="value">
                        <a-input v-model:value="form.contact_name" :placeholder="$t('def.input')" />
                    </div>
                </div>
                <!-- 手机号 -->
                <div class="form-item">
                    <div class="key">{{ $t('n.phone') }}:</div>
                    <div class="value">
                        <a-input v-model:value="form.contact_phone" :placeholder="$t('def.input')" />
                    </div>
                </div>
                <!-- 邮箱号 -->
                <div class="form-item">
                    <div class="key">{{ $t('dis.mail_number') }}:</div>
                    <div class="value">
                        <a-input v-model:value="form.contact_email" :placeholder="$t('def.input')" />
                    </div>
                </div>
                <!-- 门店地址 -->
                <div class="form-item required">
                    <div class="key">{{ $t('dis.store_address') }}:</div>
                    <div class="value">
                        <!-- 参考 customer -> customer-edit -->
                        <addressCascader v-model:value="areaMap" :def-area="showArea" @select="addressSelect" />
                        <a-input
                            ref="input"
                            v-model:value="form.address"
                            style="margin-top: 10px"
                            :placeholder="$t('dis.input_detail_address')"
                        />
                    </div>
                </div>
                <!-- 营业时间 -->
                <div class="form-item">
                    <div class="key">{{ $t('dis.business_hours') }}:</div>
                    <div class="value">
                        <a-time-picker
                            style="width: 49%"
                            v-model:value="work.time.morning.begin"
                            format="HH:mm"
                            :placeholder="$t('dis.work_morning_go')"
                        />
                        <a-time-picker
                            style="width: 49%; margin-left: 1%"
                            format="HH:mm"
                            v-model:value="work.time.morning.end"
                            :placeholder="$t('dis.work_morning_end')"
                        />
                        <div style="height: 8px"></div>
                        <a-time-picker
                            style="width: 49%"
                            v-model:value="work.time.afternoon.begin"
                            format="HH:mm"
                            :placeholder="$t('dis.work_afternoon_go')"
                        />
                        <a-time-picker
                            style="width: 49%; margin-left: 1%"
                            format="HH:mm"
                            v-model:value="work.time.afternoon.end"
                            :placeholder="$t('dis.work_afternoon_end')"
                        />

                        <a-select
                            style="margin-top: 8px"
                            v-model:value="work.week_days"
                            mode="multiple"
                            allowClear
                            :placeholder="$t('dis.week')"
                        >
                            <a-select-option
                                v-for="(item, index) in Core.Const.DATATIMES.week"
                                :key="index"
                                :value="item.key"
                            >
                                {{ item[$i18n.locale] }}
                            </a-select-option>
                        </a-select>

                        <a-input
                            v-model:value="form.business_time_remark"
                            style="margin-top: 10px"
                            :placeholder="$t('dis.input_business_hours')"
                        />
                    </div>
                </div>
                <!-- 官网地址 -->
                <div class="form-item">
                    <div class="key">{{ $t('dis.store_website') }}:</div>
                    <div class="value">
                        <a-input v-model:value="form.official_website" :placeholder="$t('def.input')" />
                    </div>
                </div>
                <!-- 区域 -->
                <div class="form-item required">
                    <div class="key">{{ $t('crm_c.group') }}:</div>
                    <div class="value">
                        <a-tree-select
                            v-model:value="form.group_id"
                            :placeholder="$t('def.select')"
                            :dropdown-style="{ maxHeight: '412px', overflow: 'auto' }"
                            :tree-data="groupOptions"
                            tree-default-expand-all
                        />
                    </div>
                </div>
                <!-- 是否可试驾 -->
                <!-- <div class="form-item required">
                    <div class="key">{{ $t("dis.is_test_drive") }}:</div>
                    <div class="value">
                        <a-select style="width: 50%"  :placeholder="$t('dis.select_language')">
                            <a-select-option value="jack">可预约试驾</a-select-option>
                            <a-select-option value="lucy">不可预约试驾</a-select-option>               
                        </a-select>  
                    </div>
                </div> -->
                <!-- 货币 -->
                <div class="form-item required">
                    <div class="key">{{ $t('p.currency') }}:</div>
                    <div class="value">
                        <a-select v-model:value="form.currency" :placeholder="$t('def.input')">
                            <a-select-option v-for="(val, key) in monetaryList" :key="key" :value="key">{{
                                key
                            }}</a-select-option>
                        </a-select>
                    </div>
                </div>
                <div class="form-item required">
                    <div class="key">{{ $t('n.pda') }}:</div>
                    <div class="value">
                        <div class="value">
                            <a-radio-group v-model:value="form.flag_stock_change_use_pda">
                                <a-radio :value="Core.Const.FLAG.YES">{{ $t('i.yes') }}</a-radio>
                                <a-radio :value="Core.Const.FLAG.NO">{{ $t('i.no') }}</a-radio>
                            </a-radio-group>
                        </div>
                    </div>
                </div>
                <div class="form-item img-upload">
                    <div class="key">Logo:</div>
                    <div class="value">
                        <a-upload
                            name="file"
                            class="image-uploader"
                            list-type="picture-card"
                            accept="image/*"
                            :file-list="upload.fileList"
                            :action="upload.action"
                            :headers="upload.headers"
                            :data="upload.data"
                            :before-upload="handleImgCheck"
                            @change="handleLogoChange"
                        >
                            <div class="image-inner" v-if="upload.fileList.length < 1">
                                <i class="icon i_upload" />
                            </div>
                        </a-upload>
                        <div class="tip">{{ $t('n.size') }}: 400*400px</div>
                    </div>
                </div>
            </div>
        </div>
        <div class="form-btns">
            <a-button @click="handleSubmit" type="primary" v-if="$auth('store.save')">{{ $t('def.sure') }}</a-button>
            <a-button @click="routerChange('back')" type="primary" ghost>{{ $t('def.cancel') }}</a-button>
        </div>
    </div>
</template>

<script>
import Core from '../../core';
import addressCascader from '@/components/common/AddressCascader.vue';
import dayjs from 'dayjs';

const LOGIN_TYPE = Core.Const.LOGIN.TYPE;
export default {
    name: 'StoreEdit',
    components: {
        addressCascader,
    },
    props: {},
    data() {
        return {
            Core,
            PAY_TIME_LIST: Core.Const.DISTRIBUTOR.PAY_TIME_LIST,
            loginType: Core.Data.getLoginType(),
            LOGIN_TYPE,
            // 加载
            loading: false,
            detail: {},
            agentList: [],
            distributorList: [],
            form: {
                id: '',
                distributor_id: undefined, // 分销商
                agent_id: undefined, // 零售商
                name: '',
                short_name: '', // 简称
                pay_type: undefined, // 付款方式
                contact_name: '', // 联系人
                contact_phone: '', // 手机号
                contact_email: undefined, // 邮箱
                country: '', // 国家
                province: '', // 省份
                city: '', // 城市
                county: '', // 区
                address: '', // 详情地址
                business_time: undefined, // 营业时间
                business_time_remark: '', // 营业时间备注
                official_website: undefined, // 门店官网
                group_id: undefined, // 区域
                currency: undefined, // 货币
                logo: '', // logo
                flag_stock_change_use_pda: undefined, // 启用PDA
            },
            work: {
                time: {
                    morning: {},
                    afternoon: {},
                },
                week_days: [],
            },
            agentSearchFrom: {
                distributor_id: '',
            },
            monetaryList: Core.Const.ITEM.MONETARY_TYPE_MAP,
            upload: {
                action: Core.Const.NET.FILE_UPLOAD_END_POINT,
                fileList: [],
                headers: {
                    ContentType: false,
                },
                data: {
                    token: Core.Data.getToken(),
                    type: 'img',
                },
            },
            areaMap: {}, // 门店地址选择
            showArea: {
                country: '', // 国家
                province: '', // 省份
                city: '', // 城市
                county: '',
            }, // 回显门店地址选择
            groupOptions: [], // 区域数据
        };
    },
    watch: {},
    computed: {},
    mounted() {
        this.handleGroupTreeFetch();
        this.form.id = Number(this.$route.query.id) || 0;
        this.form.agent_id = Number(this.$route.query.agent_id) || undefined;
        if (this.form.id) {
            this.getStoreDetail();
        }
        if (this.loginType === LOGIN_TYPE.ADMIN) {
            this.getDistributorList();
        }
        if (this.loginType === LOGIN_TYPE.DISTRIBUTOR) {
            this.getAgentList();
        } else if (this.loginType === LOGIN_TYPE.AGENT) {
            this.form.agent_id = Core.Data.getOrgId();
        }
    },
    methods: {
        routerChange(type, item) {
            let routeUrl = '';
            switch (type) {
                case 'back': // 编辑
                    routeUrl = this.$router.resolve({
                        path: '/distributor/store-list',
                    });
                    window.open(routeUrl.href, '_self');
                    break;
            }
        },
        /* fetch start*/
        // 区域接口数据
        handleGroupTreeFetch() {
            Core.Api.CRMGroupMember.structureByUser().then(res => {
                console.log('区域', res);
                this.groupOptions = res.list;
            });
        },
        // 获取门店详情
        getStoreDetail() {
            this.loading = true;
            Core.Api.Store.detail({
                id: this.form.id,
            })
                .then(res => {
                    console.log('getStoreDetail res', res);
                    this.detail = res.detail;
                    for (const key in this.form) {
                        this.form[key] = res.detail[key];
                    }
                    // 回显地址
                    for (const key in this.showArea) {
                        this.showArea[key] = res.detail[key];
                    }
                    // 营业时间回显
                    if (!this.$Util.isEmptyObj(JSON.parse(this.form.business_time))) {
                        let timeData = JSON.parse(this.form.business_time);

                        this.work.time.morning.begin = dayjs(`1970-00-0 ${timeData.time.morning.begin}`);
                        this.work.time.morning.end = dayjs(`1970-00-0 ${timeData.time.morning.end}`);

                        this.work.time.afternoon.begin = dayjs(`1970-00-0 ${timeData.time.afternoon.begin}`);
                        this.work.time.afternoon.end = dayjs(`1970-00-0 ${timeData.time.afternoon.end}`);

                        this.work.week_days = timeData.week_days;
                    }

                    if (this.form.logo) {
                        this.upload.fileList = [
                            {
                                uid: 1,
                                name: this.form.logo,
                                url: Core.Const.NET.FILE_URL_PREFIX + this.form.logo,
                                short_path: this.form.logo,
                                status: 'done',
                            },
                        ];
                    }
                })
                .catch(err => {
                    console.log('getStoreDetail err', err);
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        /* fetch end*/
        getDistributorList() {
            Core.Api.Distributor.listAll().then(res => {
                this.distributorList = res.list;
            });
        },
        // 获取选择用 零售商列表
        getAgentList() {
            Core.Api.Agent.listAll(this.agentSearchFrom).then(res => {
                this.agentList = res.list;
                console.log('getAgentList res', res);
            });
        },
        onDistributorChange(val) {
            this.form.agent_id = undefined;
            this.agentSearchFrom.distributor_id = val;
            this.getAgentList();
        },
        // 提交编辑
        handleSubmit() {
            let formCopy = Core.Util.deepCopy(this.form);
            if (this.upload.fileList.length) {
                let file_url = this.upload.fileList.map(item => {
                    return item.short_path || item.response.data.filename;
                });
                if (file_url.length > 0) {
                    formCopy.logo = file_url[0];
                }
            }

            // 地区显示
            if (!Core.Util.isEmptyObj(this.areaMap)) {
                formCopy.country = this.$i18n.locale == 'en' ? this.areaMap.country.name_en : this.areaMap.country.name;
                if (this.areaMap.province) {
                    formCopy.province =
                        this.$i18n.locale == 'en' ? this.areaMap.province.name_en : this.areaMap.province.name;
                }
                if (this.areaMap.city) {
                    formCopy.city = this.$i18n.locale == 'en' ? this.areaMap.city.name_en : this.areaMap.city.name;
                }
                if (this.areaMap.county) {
                    formCopy.county =
                        this.$i18n.locale == 'en' ? this.areaMap.county.name_en : this.areaMap.county.name;
                }
            }

            // console.log('formCopy:', formCopy, this.areaMap)
            this.workTimeFilter(formCopy);
            if (this.checkInput(formCopy)) return;
            // console.log('formCopy完成:', formCopy)

            Core.Api.Store.save({
                ...Core.Util.searchFilter(formCopy),
            })
                .then(() => {
                    this.$message.success(this.$t('pop_up.save_success'));
                    this.routerChange('back');
                })
                .catch(err => {
                    console.log('handleSubmit err:', err);
                });
        },
        handleImgCheck(file) {
            const isCanUpType = ['image/jpeg', 'image/png', 'image/gif', 'image/bmp'].includes(file.type);
            if (!isCanUpType) {
                this.$message.warning(this.$t('n.file_incorrect'));
            }
            const isLt10M = file.size / 1024 / 1024 < 10;
            if (!isLt10M) {
                this.$message.warning(this.$t('n.picture_smaller'));
            }
            return isCanUpType && isLt10M;
        },
        // 上传图片
        handleLogoChange({ file, fileList }) {
            console.log('handleCoverChange status:', file.status, 'file:', file);
            if (file.status == 'done') {
                if (file.response && file.response.code > 0) {
                    return this.$message.error(file.response.message);
                }
            }
            this.upload.fileList = fileList;
        },
        // 表单检查
        checkInput(formCopy) {
            if (!formCopy.distributor_id && this.$auth('ADMIN')) {
                return this.$message.warning(this.$t('def.enter') + `(${this.$t('n.distributor')})`);
            }
            // if (!formCopy.agent_id && this.$auth('ADMIN','DISTRIBUTOR') ) {
            //     return this.$message.warning(this.$t('def.enter'))
            // }
            if (!formCopy.name) {
                return this.$message.warning(this.$t('def.enter') + `(${this.$t('n.name')})`);
            }
            if (!formCopy.short_name) {
                return this.$message.warning(this.$t('def.enter') + `(${this.$t('d.short_name')})`);
            }
            // if (!formCopy.contact_name) {
            //     return this.$message.warning(this.$t('def.enter'))
            // }
            // if (!formCopy.contact_phone) {
            //     return this.$message.warning(this.$t('def.enter'))
            // }
            // 邮箱
            // if (!formCopy.contact_email) {
            //     return this.$message.warning(this.$t('def.enter'))
            // }
            // 门店地址
            if (!formCopy.country) {
                if (!Object.values(this.areaMap).filter(i => i).length) {
                    return this.$message.warning(this.$t('def.enter') + `(${this.$t('dis.store_address')})`);
                }
            }
            // 营业时间
            // if(this.workTimeFilter(formCopy)) return true
            // // 门店官网
            // if (!formCopy.official_website) {
            //     return this.$message.warning(this.$t('def.enter') + `(${this.$t('dis.store_website')})`)
            // }
            // 区域
            if (!formCopy.group_id) {
                return this.$message.warning(this.$t('def.enter') + `(${this.$t('crm_c.group')})`);
            }
            if (!formCopy.currency) {
                // 货币
                return this.$message.warning(this.$t('def.enter') + `(${this.$t('p.currency')})`);
            }

            return false;
        },
        // 上班时间转化需要的样式
        workTimeFilter(formCopy) {
            // console.log("时间1", this.work);
            if (this.$Util.isEmptyObj(this.work.time.morning)) {
                // return this.$message.warning(this.$t('dis.work_morning_go'))
                return false;
            }
            if (this.$Util.isEmptyObj(this.work.time.afternoon)) {
                // return this.$message.warning(this.$t('dis.work_afternoon_end'))
                return false;
            }

            // if (this.work.week_days.length == 0) {
            //     return this.$message.warning(this.$t('dis.week'))
            // }
            let works = {
                time: {
                    morning: {},
                    afternoon: {},
                },
                week_days: [],
            };

            works.time.morning.begin = dayjs(this.work.time.morning.begin).format('HH:mm');
            works.time.morning.end = dayjs(this.work.time.morning.end).format('HH:mm');

            works.time.afternoon.begin = dayjs(this.work.time.afternoon.begin).format('HH:mm');
            works.time.afternoon.end = dayjs(this.work.time.afternoon.end).format('HH:mm');

            works.week_days = this.work.week_days.length ? [...this.work.week_days] : undefined;
            formCopy.business_time = JSON.stringify(works);
            return false;
        },
        // 选择地址
        addressSelect(data) {
            // console.log("测试",data);
            let address = '';
            // 县 / 区
            if (data.county) {
                address += (this.$i18n.locale == 'en' ? data.county.name_en : data.county.name) + ',';
            }
            // 城市
            if (data.city) {
                address += (this.$i18n.locale == 'en' ? data.city.name_en : data.city.name) + ',';
            }
            // 省份
            if (data.province) {
                address += (this.$i18n.locale == 'en' ? data.province.name_en : data.province.name) + ',';
            }
            // 国家
            address += this.$i18n.locale == 'en' ? data.country.name_en : data.country.name;
            this.form.address = address;

            this.$refs.input.focus();
        },
    },
};
</script>

<style lang="less" scoped>
// #DistributorEdit {}
</style>
