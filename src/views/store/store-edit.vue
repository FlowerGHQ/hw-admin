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
                <div class="form-item required">
                    <div class="key">{{ $t('n.phone') }}:</div>
                    <div class="value">
                        <a-input v-model:value="form.contact_phone" :placeholder="$t('def.input')"/>
                    </div>
                </div>
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

const LOGIN_TYPE = Core.Const.LOGIN.TYPE
export default {
    name: 'StoreEdit',
    components: {},
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
                distributor_id: undefined,
                agent_id: undefined,
                name: '',
                currency: undefined,
                short_name: '',
                contact_name: '',
                contact_phone: '',
                logo: '',
                type: 0,
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
        };
    },
    watch: {},
    computed: {},
    mounted() {
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
            let form = Core.Util.deepCopy(this.form)
            if (this.upload.fileList.length) {
                let file_url = this.upload.fileList.map(item => {
                    return item.short_path || item.response.data.filename
                })
                if (file_url.length > 0) {
                    form.logo = file_url[0]
                }
            }
            console.log('form:', form)
            if (!form.distributor_id && this.$auth('ADMIN')) {
                return this.$message.warning(this.$t('def.enter'))
            }
            if (!form.agent_id && this.$auth('ADMIN','DISTRIBUTOR') ) {
                return this.$message.warning(this.$t('def.enter'))
            }
            if (!form.name) {
                return this.$message.warning(this.$t('def.enter'))
            }
            if (!form.currency) {
                return this.$message.warning(this.$t('def.enter'))
            }
            if (!form.short_name) {
                return this.$message.warning(this.$t('def.enter'))
            }
            if (!form.contact_name) {
                return this.$message.warning(this.$t('def.enter'))
            }
            if (!form.contact_phone) {
                return this.$message.warning(this.$t('def.enter'))
            }
            Core.Api.Store.save(form).then(() => {
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
    }
}
</script>

<style lang="less" scoped>
// #DistributorEdit {}
</style>
