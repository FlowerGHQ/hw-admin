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
                        <a-select v-model:value="form.distributor_id" :placeholder="$t('search.select_distributor')" @change="onDistributorChange">
                            <a-select-option v-for="distributor of distributorList" :key="distributor.id" :value="distributor.id">{{ distributor.name }}</a-select-option>
                        </a-select>
                    </div>
                </div>
                <div class="form-item required"  v-if="$auth('ADMIN','DISTRIBUTOR') && !form.id">
                    <div class="key">{{ $t('n.agent') }}</div>
                    <div class="value">
                        <a-select v-model:value="form.agent_id" :placeholder="$t('search.select_agent')">
                            <a-select-option v-for="agent of agentList" :key="agent.id" :value="agent.id">{{ agent.name }}</a-select-option>
                        </a-select>
                    </div>
                </div>
                <div class="form-item required">
                    <div class="key">{{ $t('n.name') }}：</div>
                    <div class="value">
                        <a-input v-model:value="form.name" :placeholder="$t('def.input')"/>
                    </div>
                </div>

                <div class="form-item required">
                    <div class="key">{{ $t('d.short_name') }}:</div>
                    <div class="value">
                        <a-input v-model:value="form.short_name" :placeholder="$t('def.input')"/>
                    </div>
                </div>
                <div class="form-item required">
                    <div class="key">{{ $t('d.pay_type') }}:</div>
                    <div class="value">
                        <a-select v-model:value="form.pay_type" :placeholder="$t('def.select_payment_term')">
                            <a-select-option v-for="(val, key) in PAY_TIME_LIST" :key="val['key']" :value="val['key']">{{ val[$i18n.locale]  }}</a-select-option>
                        </a-select>
                    </div>
                </div>
                <div class="form-item required">
                    <div class="key">{{ $t('n.contact') }}:</div>
                    <div class="value">
                        <a-input v-model:value="form.contact_name" :placeholder="$t('def.input')"/>
                    </div>
                </div>
                <!-- 手机号 -->
                <div class="form-item required">
                    <div class="key">{{ $t('n.phone') }}:</div>
                    <div class="value">
                        <a-input v-model:value="form.contact_phone" :placeholder="$t('def.input')"/>
                    </div>
                </div>
                <!-- 邮箱号 -->
                <div class="form-item required">
                    <div class="key">{{$t('dis.mail_number')}}:</div>
                    <div class="value">                        
                        <a-input v-model:value="form.contact_email" :placeholder="$t('def.input')"/>
                    </div>
                </div>
                <!-- 门店地址 -->
                <div class="form-item required">
                    <div class="key">{{$t('dis.store_address')}}:</div>
                    <div class="value">
                        <!-- 参考 customer -> customer-edit -->
                        <addressCascader 
                            v-model:value="areaMap" 
                            :defArea="{
                                country:form.country,
                                province:form.province,
                                city: form.city,
                            }"/>  
                        <a-input v-model:value="form.address" style="margin-top: 10px;" :placeholder="$t('dis.input_detail_address')"/>
                    </div>
                </div>
                <!-- 营业时间 -->
                <div class="form-item required">
                    <div class="key">{{$t('dis.business_hours')}}:</div>
                    <div class="value">
                        <a-time-picker 
                            style="width: 49%" 
                            v-model:value="work.business_start" 
                            format="HH:mm" 
                            :placeholder="$t('dis.work_go')"/>
                        <a-time-picker 
                            style="width: 49%; margin-left:1%" 
                            format="HH:mm" 
                            v-model:value="work.business_end"  
                            :placeholder="$t('dis.work_end')"/>
                
                        <a-input v-model:value="form.business_remark" style="margin-top: 10px;" :placeholder="$t('dis.input_business_hours')"/>
                    </div>
                </div>
                <!-- 官网地址 -->
                <div class="form-item required">
                    <div class="key">{{$t('dis.store_website')}}:</div>
                    <div class="value">
                        <a-input v-model:value="form.website_url" :placeholder="$t('def.input')"/>
                    </div>
                </div>
                <!-- 使用语言 -->
                <div class="form-item required">
                    <div class="key">{{$t('dis.use_language')}}:</div>
                    <div class="value">
                        <a-select v-model:value="form.language"  :placeholder="$t('dis.select_language')">
                            <a-select-option 
                                v-for="(item, index) in Core.Const.language" 
                                :key="index"
                                :value="item.key">
                                    {{ item[$i18n.locale]  }}
                                </a-select-option>                                        
                        </a-select>  
                    </div>
                </div>
                <!-- 区域 -->
                <div class="form-item required">
                    <div class="key">{{ $t("crm_c.group") }}:</div>
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
                            <a-select-option v-for="(val,key) in monetaryList" :key="key" :value="key">{{ key }}</a-select-option>
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
                        <a-upload name="file" class="image-uploader"
                                  list-type="picture-card" accept='image/*'
                                  :file-list="upload.fileList" :action="upload.action"
                                  :headers="upload.headers" :data='upload.data'
                                  :before-upload="handleImgCheck"
                                  @change="handleLogoChange">
                            <div class="image-inner" v-if="upload.fileList.length < 1">
                                <i class="icon i_upload"/>
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
import addressCascader from '@/components/common/AddressCascader.vue'
import dayjs from 'dayjs'

const LOGIN_TYPE = Core.Const.LOGIN.TYPE
export default {
    name: 'StoreEdit',
    components: {
        addressCascader
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
                pay_type: null, // 付款方式 
                contact_name: '', // 联系人
                contact_phone: '', // 手机号
                contact_email: null, // 邮箱
                country: '', // 国家
                province: '', // 省份           
                city: '',   // 城市             
                address: null, // 详情地址
                business_time: null, // 营业时间 样式是 9:00~18:00
                business_remark: "周一~周五", // 营业时间备注
                website_url: null, // 门店官网
                language: null, // 语言
                group_id: null, // 区域
                currency: undefined, // 货币
                logo: '', // logo
                flag_stock_change_use_pda: null, // 启用PDA
            },
            work:{
                business_start: null,
                business_end: null,
            },
            agentSearchFrom: {
                distributor_id: ''
            },
            monetaryList: Core.Const.ITEM.MONETARY_TYPE_MAP,
            upload: {
                action: Core.Const.NET.FILE_UPLOAD_END_POINT,
                fileList: [],
                headers: {
                    ContentType: false
                },
                data: {
                    token: Core.Data.getToken(),
                    type: 'img',
                },
            },
            areaMap: {}, // 门店地址选择
            groupOptions: [], // 区域数据
        };
    },
    watch: {},
    computed: {},
    mounted() {
        this.handleGroupTreeFetch()
        this.form.id = Number(this.$route.query.id) || 0
        this.form.agent_id = Number(this.$route.query.agent_id) || undefined
        if (this.form.id) {
            this.getStoreDetail();
        }
        if (this.loginType === LOGIN_TYPE.ADMIN) {
            this.getDistributorList();
        }
        if (this.loginType === LOGIN_TYPE.DISTRIBUTOR) {
            this.getAgentList();
        } else if (this.loginType === LOGIN_TYPE.AGENT) {
            this.form.agent_id = Core.Data.getOrgId()
        }
    },
    methods: {
        routerChange(type, item) {
            switch (type) {
                case 'back':
                    this.$router.go(-1)
                    break;
            }
        },
        /* fetch start*/
          // 区域接口数据
          handleGroupTreeFetch() {
            Core.Api.CRMGroupMember.structureByUser().then((res) => {
                // console.log("区域",res);
                this.groupOptions = res.list;
            });
        },
        // 获取门店详情
        getStoreDetail() {
            this.loading = true;
            Core.Api.Store.detail({
                id: this.form.id,
            }).then(res => {
                console.log('getStoreDetail res', res)
                this.detail = res.detail
                for (const key in this.form) {
                    this.form[key] = res.detail[key]
                }
                if (this.form.logo) {
                    this.upload.fileList = [{
                        uid: 1,
                        name: this.form.logo,
                        url: Core.Const.NET.FILE_URL_PREFIX + this.form.logo,
                        short_path: this.form.logo,
                        status: 'done',
                    }]
                }
            }).catch(err => {
                console.log('getStoreDetail err', err)
            }).finally(() => {
                this.loading = false;
            });
        },
        /* fetch end*/
        getDistributorList() {
            Core.Api.Distributor.listAll().then(res => {
                this.distributorList = res.list
            })
        },
        // 获取选择用 零售商列表
        getAgentList(){
            Core.Api.Agent.listAll(this.agentSearchFrom).then(res => {
                this.agentList = res.list
                console.log('getAgentList res', res)
            })
        },
        onDistributorChange(val) {
            this.form.agent_id = undefined
            this.agentSearchFrom.distributor_id = val
            this.getAgentList()

        },
        // 提交编辑
        handleSubmit() {
            let formCopy = Core.Util.deepCopy(this.form)

            if (this.upload.fileList.length) {
                let file_url = this.upload.fileList.map(item => {
                    return item.short_path || item.response.data.filename
                })
                if (file_url.length > 0) {
                    formCopy.logo = file_url[0]
                }
            }

            // 地区显示
            if (!Core.Util.isEmptyObj(this.areaMap)) {                
                formCopy.country = this.areaMap.country.name              
                if (this.areaMap.province) {
                    formCopy.province = this.areaMap.province.name
                }
                if(this.areaMap.city){
                    formCopy.city = this.areaMap.city.name
                }
            }
            
            console.log('formCopy:', formCopy)
            if(this.checkInput(formCopy)) return            
            console.log('formCopy完成:', formCopy)
          
            Core.Api.Store.save({
                ...formCopy,
            }).then(() => {
                this.$message.success(this.$t('pop_up.save_success'))
                this.routerChange('back')
            }).catch(err => {
                console.log('handleSubmit err:', err)
            })
        },
        handleImgCheck(file) {
            const isCanUpType = ['image/jpeg', 'image/png', 'image/gif', 'image/bmp'].includes(file.type)
            if (!isCanUpType) {
                this.$message.warning(this.$t('n.file_incorrect'));
            }
            const isLt10M = (file.size / 1024 / 1024) < 10;
            if (!isLt10M) {
                this.$message.warning(this.$t('n.picture_smaller'));
            }
            return isCanUpType && isLt10M;
        },
        // 上传图片
        handleLogoChange({file, fileList}) {
            console.log("handleCoverChange status:", file.status, "file:", file)
            if (file.status == 'done') {
                if (file.response && file.response.code > 0) {
                    return this.$message.error(file.response.message)
                }
            }
            this.upload.fileList = fileList
        },
        // 表单检查
        checkInput(formCopy){
            if (!formCopy.distributor_id && this.$auth('ADMIN')) {
                return this.$message.warning(this.$t('def.enter'))
            }
            if (!formCopy.agent_id && this.$auth('ADMIN','DISTRIBUTOR') ) {
                return this.$message.warning(this.$t('def.enter'))
            }
            if (!formCopy.name) {
                return this.$message.warning(this.$t('def.enter'))
            }
            if (!formCopy.currency) {
                return this.$message.warning(this.$t('def.enter'))
            }
            if (!formCopy.short_name) {
                return this.$message.warning(this.$t('def.enter'))
            }
            if (!formCopy.contact_name) {
                return this.$message.warning(this.$t('def.enter'))
            }
            if (!formCopy.contact_phone) {
                return this.$message.warning(this.$t('def.enter'))
            }
            // 邮箱
            if (!formCopy.contact_email) {
                return this.$message.warning(this.$t('def.enter'))
            }
            // 门店地址
            if (!(Object.values(this.areaMap).filter(i => i).length)) {
                return this.$message.warning(this.$t('def.enter') + `(${this.$t('dis.store_address')})`)
            }
            // 营业时间
            if(!this.workTimeFilter(formCopy)) return
            // 门店官网
            if (!formCopy.website_url) {
                return this.$message.warning(this.$t('def.enter') + `(${this.$t('dis.store_website')})`)
            }
            // 使用语言
            if (!formCopy.language) {
                return this.$message.warning(this.$t('def.enter') + `(${this.$t('dis.language')})`)
            }
            // 区域
            if (!formCopy.group_id) {
                return this.$message.warning(this.$t('def.enter') + `(${this.$t('crm_c.group')})`)
            }

            return false
        },
        // 上班时间转化需要的样式
        workTimeFilter(formCopy){
            console.log("时间",  this.work);
            if (!this.work.business_start) {
                this.$message.warning(this.$t('dis.work_go'))
                return false
            }
            if (!this.work.business_end) {
                this.$message.warning(this.$t('dis.work_end'))
                return false
            }
            let start =  dayjs(this.work.business_start).format('HH:mm')
            let end = dayjs(this.work.business_end).format('HH:mm')
            formCopy.business_time = `${start}~${end}`
            return true
        }
    }
}
</script>

<style lang="less" scoped>
// #DistributorEdit {}
</style>
