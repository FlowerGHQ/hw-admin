<template>
    <div id="RefundCreate" class="edit-container">
        <div class="title-container"><div class="title-area">{{ form.id ? '退款编辑' : '新建退款' }}</div></div>
        <div class="form-block">
            <div class="form-title">
                <div class="title-colorful">基本信息</div>
            </div>
            <div class="form-content">
                <div class="form-item required" >
                    <div class="key">金额(元)：</div>
                        <div class="value input-number">
                            <a-input-number v-model:value="form.money" :min="0" :precision="2" placeholder="0.00"/>
                            <span class="money">元</span>
                        </div>
                </div>
                <div class="form-item  textarea">
                    <div class="key">退款原因</div>
                    <div class="value">
                        <a-textarea v-model:value="form.apply_message" placeholder="请请填写退款原因" :auto-size="{ minRows: 4, maxRows: 6 }" :maxlength='500'/>
                        <span class="content-length">{{form.apply_message.length}}/500</span>
                    </div>
                </div>
                <div class="form-item img-upload">
                    <div class="key">上传图片</div>
                    <div class="value">
                        <a-upload name="file" class="image-uploader"
                            list-type="picture-card" accept='image/*'
                            :file-list="upload.fileList" :action="upload.action"
                            :headers="upload.headers" :data='upload.data'
                            :before-upload="handleImgCheck"
                            @change="handleLogoChange">
                            <div class="image-inner" v-if="upload.fileList.length < 5">
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

export default {
    name: 'UserEdit',
    components: {},
    props: {},
    data() {
        return {
            // 加载
            loading: false,
            detail: {},
            form: {
                id: '',
                apply_imgs: '',
                apply_message: '',
                money: '',
                name: '',
                order_id: '',
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
    created() {},
    mounted() {
        this.form.id = Number(this.$route.query.id) || 0
        this.form.order_id = Number(this.$route.query.order_id) || 0
        this.form.money =  Core.Util.countFilter(Number(this.$route.query.money))

        console.log('Core.Util.countFilter(1, 60, 1)', Core.Util.countFilter(1, 60, 1, true))
        if (this.form.id > 0) {
            this.getRefundDetail();
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
        getRefundDetail() {
            this.loading = true;
            Core.Api.Refund.detail({
                id: this.form.id
            }).then(res => {
                console.log('getRefundDetail res', res)
                this.detail = res.detail
                for (const key in this.form) {
                    this.form[key] = res.detail[key]
                }
                if (this.form.apply_imgs) {
                    let imgs = this.form.apply_imgs.split(',')
                    this.upload.fileList = imgs.map((item, index) => ({
                        uid: index + 1,
                        name: item,
                        url: Core.Const.NET.FILE_URL_PREFIX + item,
                        short_path: item,
                        status: 'done',
                    }))
                }
               // this.upload.fileList = res.detail.apply_imgs.split(",")

            }).catch(err => {
                console.log('getRefundDetail err', err)
            }).finally(() => {
                this.loading = false;
            });
        },
        handleTypeSelect(val) {
            this.type = val
        },
        handleSubmit() {
            let form = Core.Util.deepCopy(this.form)
            console.log('form:', form)
            if (this.upload.fileList.length) {
                let fileList = this.upload.fileList.map(item => {
                    return item.short_path || item.response.data.filename
                })
                form.apply_imgs = fileList.join(',')
            }
            let judge = "update"
            if (!form.id) {
                judge = "create"
                if (!form.money) {
                    return this.$message.warning('请填写退款金额')
                }
                // if (!form.apply_message) {
                //     return this.$message.warning('请填写退款相关信息')
                // }
                // if (!form.applyImgs) {
                //     return this.$message.warning('请上传相关图片')
                // }
            }
            // console.log(judge)
            Core.Api.Refund[judge]({
                ...form,
            }).then(() => {
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
            console.log("handleCoverChange status:", file.status, "file:", file)
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
 #RefundCreate {
     .form-block {
         .money{
             font-size: 10px;
             color: #8090A6;
             margin-left: 5px;
         }

     }
 }
</style>