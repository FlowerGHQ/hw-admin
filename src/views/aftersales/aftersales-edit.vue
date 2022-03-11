<template>
<div id="AftersalesEdit" class="edit-container">
    <div class="title-container"><div class="title-area">{{form.id ? '编辑售后单' : '新建售后单'}}</div></div>
    <div class="form-block">
        <div class="form-title">
            <div class="title-colorful">基本信息</div>
        </div>
        <div class="form-content">
            <div class="form-item required">
                <div class="key">采购单单号:</div>
                <div class="value">
                    <a-input v-model:value="form.order_sn" placeholder="请输入采购单单号" @blur="getPurchaseDetail"/>
                </div>
            </div>
            <div class="form-item required">
                <div class="key">售后类型:</div>
                <div class="value">
                    <a-select placeholder="请选择售后类型" v-model:value="form.type">
                        <a-select-option v-for="(val,key) in typeMap" :key="key" :value="key">{{ val }}</a-select-option>
                    </a-select>
                </div>
            </div>
            <div class="form-item required" >
                <div class="key">申请退款金额:</div>
                <div class="value input-number">
                    <a-input-number v-model:value="form.refund_money" placeholder="申请退款金额"/>
                    <span>元</span>
                </div>
            </div>
            <div class="form-item textarea">
                <div class="key">备注:</div>
                <div class="value">
                    <a-input v-model:value="form.remark" placeholder="请输入备注" type="textarea" :auto-size='{ minRows: 2, maxRows: 10 }' :max-length='99'/>
                    <span class="content-length">{{form.remark.length}}/99</span>
                </div>
            </div>
            <div class="form-item img-upload">
                <div class="key">图片凭证:</div>
                <div class="value">
                    <a-upload name="file" class="image-uploader"
                        list-type="picture-card" accept='image/*'
                        :file-list="upload.fileList" :action="upload.action"
                        :headers="upload.headers" :data='upload.data'
                        :before-upload="handleImgCheck"
                        @change="handleImgChange">
                        <div class="image-inner" v-if="upload.fileList.length < 5">
                            <i class="icon i_upload"/>
                        </div>
                    </a-upload>
                </div>
            </div>
        </div>
    </div>
    <div class="form-block">
        <div class="form-title">
            <div class="title-colorful">基本信息</div>
        </div>
        <div class="form-content">
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

export default {
    name: 'AftersalesEdit',
    components: {},
    props: {},
    data() {
        return {
            loginType: Core.Data.getOrgType(), // 当前登录的用户的 组织类型
            ORG_TYPE: Core.Const.LOGIN.ORG_TYPE,

            // 加载
            loading: false,

            id: '',
            detail: {},

            typeMap: Core.Const.AFTERSALES.TYPE_MAP,
            form: {
                id: '',
                type: undefined,

                sn: '',
                order_sn: '',

                refund_money: '',
                refund_money_currency: '',
                remark: '',
                image: '',
            },

            upload: { // 上传图片
                action: Core.Const.NET.FILE_UPLOAD_END_POINT,
                fileList: [],
                headers: { ContentType: false },
                data: {
                    token: Core.Data.getToken(),
                    type: 'img',
                },
            },
        };
    },
    watch: {},
    computed: {},
    created() {
        let q = this.$route.query

        this.id = Number(q.id) || 0
        if (this.id) {
            this.getOrderDetail();
        }
    },
    methods: {
        routerChange(type, item) {
            switch (type) {
                case 'back':
                    let routeUrl = this.$router.resolve({
                        path: "/aftersales/aftersales-list",
                    })
                    window.open(routeUrl.href, '_self')
                    break;
            }
        },
        getOrderDetail() {
            this.loading = true;
            Core.Api.Aftersales.detail({
                id: this.id,
            }).then(res => {
                console.log('getOrderDetail res', res)
                let d = res.detail
                this.detail = d
                for (const key in this.form) {
                    this.form[key] = d[key]
                }
                if (this.form.images) {
                    let images = this.form.images.split(',')
                    this.upload.fileList = images.map((item, index) => ({
                        uid: index + 1,
                        name: item,
                        url: Core.Const.NET.FILE_URL_PREFIX + item,
                        short_path: item,
                        status: 'done',
                    }))
                }
            }).catch(err => {
                console.log('getOrderDetail err', err)
            }).finally(() => {
                this.loading = false;
            });
        },
        getPurchaseDetail() {

        },
        handleSubmit() {
            let form = Core.Util.deepCopy(this.form)
            if (this.upload.fileList.length) {
                let list = this.upload.fileList.map(item => {
                    return list.short_path || item.response.data.filename
                })
                form.images = list.join(',')
            }
            if (!form.order_sn) {
                return this.$message.warning('请输入采购单单号')
            }
            if (!form.type) {
                return this.$message.warning('请选择售后类型')
            }
            Core.Api.Aftersales.save(form).then(() => {
                this.$message.success('保存成功')
                this.routerChange('back')
            }).catch(err => {
                console.log('handleSubmit err:', err)
            })
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
            return isCanUpType && isLt10M;
        },
        // 上传图片
        handleImgChange({ file, fileList }) {
            console.log("handleImgChange status:", file.status, "file:", file)
            if (file.status == 'done') {
                if (file.response && file.response.code < 0) {
                    return this.$message.error(file.response.message)
                }
            }
            this.upload.fileList = fileList
        },
    }
};
</script>

<style lang="less" scoped>
// #AftersalesEdit {}
</style>
