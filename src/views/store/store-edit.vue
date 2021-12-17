<template>
    <div id="StoreEdit" class="edit-container">
        <div class="title-container">
            <div class="title-area">{{ form.id ? '门店编辑' : '新建门店' }}</div>
        </div>
        <div class="form-block">
            <div class="form-title">
                <div class="title">基本信息</div>
            </div>
            <div class="form-content">
                <div class="form-item required" v-if="loginType == LOGIN_TYPE.ADMIN">
                    <div class="key">所属经销商</div>
                    <div class="value">
                        <a-select v-model:value="form.agent_id" placeholder="请选择所属经销商">
                            <a-select-option v-for="agent of agentList" :key="agent.id" :value="agent.id">{{
                                    agent.name
                                }}
                            </a-select-option>
                        </a-select>
                    </div>
                </div>
                <div class="form-item required">
                    <div class="key">门店名称：</div>
                    <div class="value">
                        <a-input v-model:value="form.name" placeholder="请输入门店名称"/>
                    </div>
                </div>
                <div class="form-item required">
                    <div class="key">联系人：</div>
                    <div class="value">
                        <a-input v-model:value="form.contact_name" placeholder="请输入联系人"/>
                    </div>
                </div>
                <div class="form-item required">
                    <div class="key">联系人电话：</div>
                    <div class="value">
                        <a-input v-model:value="form.contact_phone" placeholder="请输入联系人电话"/>
                    </div>
                </div>
                <div class="form-item img-upload">
                    <div class="key">门店Logo：</div>
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
                        <div class="tip">建议尺寸：400*400像素</div>
                    </div>
                </div>
            </div>
        </div>
        <div class="form-btns">
            <a-button @click="handleSubmit" type="primary">确定</a-button>
            <a-button @click="routerChange('back')" type="primary" ghost>取消</a-button>
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
            loginType: Core.Data.getLoginType(),
            LOGIN_TYPE,
            // 加载
            loading: false,
            detail: {},
            agentList: [],
            form: {
                id: '',
                agent_id: undefined,
                name: '',
                contact_name: '',
                contact_phone: '',
                logo: '',
                type: 0,
            },
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
        if (this.form.id) {
            this.getStoreDetail();
        }
        if (this.loginType === LOGIN_TYPE.ADMIN) {
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
        // 获取选择用 经销商列表
        getAgentList() {
            Core.Api.Agent.listAll().then(res => {
                this.agentList = res.list
            })
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
            if (!form.agent_id) {
                return this.$message.warning('请选择所属经销商')
            }
            if (!form.name) {
                return this.$message.warning('请输入门店名称')
            }
            if (!form.contact_name) {
                return this.$message.warning('请输入联系人')
            }
            if (!form.contact_phone) {
                return this.$message.warning('请输入联系人电话')
            }
            Core.Api.Store.save(form).then(() => {
                this.$message.success('保存成功')
                this.routerChange('back')
            }).catch(err => {
                console.log('handleSubmit err:', err)
            })
        },


        handleImgCheck(file) {
            const isCanUpType = ['image/jpeg', 'image/png', 'image/gif', 'image/bmp'].includes(file.type)
            if (!isCanUpType) {
                this.$message.warning('文件格式不正确');
            }
            const isLt10M = (file.size / 1024 / 1024) < 10;
            if (!isLt10M) {
                this.$message.warning('请上传小于10MB的图片');
            }
            return isCanUpType && isLt10M;
        },
        // 上传图片
        handleLogoChange({file, fileList}) {
            this.upload.fileList = fileList
            console.log("handleCoverChange status:", file.status, "file:", file)
        },
    }
}
</script>

<style lang="less" scoped>
// #DistributorEdit {}
</style>