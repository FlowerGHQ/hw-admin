<template>
    <div id="store-edit">
        <div class="edit-container">
            <div class="title-container">
                <div class="title-area">{{ form.id ? $t('crm_st.edit_st') : $t('crm_st.add_st') }}</div>
                <a-button type="primary" v-if="$auth('customer.detail')">{{ $t('def.save') }}</a-button>
            </div>
            <div class="form-block">
                <div class="form-title">
                    <div class="title-colorful">{{ $t('n.information') }}</div>
                </div>
                <div class="form-content">
                    <div class="form-item required">
                        <div class="key">{{ $t('n.store_n') }}：</div>
                        <div class="value">
                            <a-input v-model:value="form.name" :placeholder="$t('def.input')" />
                        </div>
                    </div>

                    <div class="form-item">
                        <div class="key">{{ $t('n.store_pic') }}：</div>
                        <div class="value">
                            <a-upload :file-list="upload.detailList" class="image-uploader" name="file" accept="image/*"
                                list-type="picture-card" :headers="upload.headers" :data="upload.data"
                                :action="upload.action" :before-upload="handleImgCheck" @change="handleCoverChange">
                                <div class="image-inner" v-if="upload.detailList.length < 10">
                                    <i class="icon i_upload" />
                                </div>
                            </a-upload>
                        </div>
                    </div>

                    <div class="form-item required">
                        <div class="key">{{ $t('crm_st.type') }}：</div>
                        <div class="value">
                            <a-select v-model:value="form.country_code" :placeholder="$t('def.input')"
                                @select="setPhoneCountryCode" :disabled="form.id > 0 && detail.country_code != ''"
                                show-search option-filter-prop="key" allow-clear>
                                <a-select-option v-for="item of phoneCountryCodeList"
                                    :key="item.phoneAreaCode + item.name + item.enName" :value="item.code">

                                    <span class="phoneCountryCode">{{ item.phoneAreaCode }}</span>
                                    {{ lang === 'zh' ? item.name : item.enName }}
                                </a-select-option>
                            </a-select>
                        </div>
                    </div>
                    <!-- 门店级别 -->
                    <div class="form-item required">
                        <div class="key">{{ $t('crm_st.level') }}：</div>
                        <div class="value">
                            <a-select v-model:value="form.country_code" :placeholder="$t('def.input')"
                                @select="setPhoneCountryCode" :disabled="form.id > 0 && detail.country_code != ''"
                                show-search option-filter-prop="key" allow-clear>
                                <a-select-option v-for="item of phoneCountryCodeList"
                                    :key="item.phoneAreaCode + item.name + item.enName" :value="item.code">

                                    <span class="phoneCountryCode">{{ item.phoneAreaCode }}</span>
                                    {{ lang === 'zh' ? item.name : item.enName }}
                                </a-select-option>
                            </a-select>
                        </div>
                    </div>
                    <!-- 区域 -->
                    <div class="form-item required">
                        <div class="key">{{ $t('crm_c.group') }}：</div>
                        <div class="value">
                            <a-input v-model:value="form.email" :placeholder="$t('def.input')"
                                @blur="handleCustomerEmailBlur"
                                :disabled="form.id > 0 && detail.email || form.country_code == undefined" />
                        </div>
                    </div>

                    <div class="form-item">
                        <div class="key"></div>
                        <div class="value">
                            <a-input v-model:value="form.email" :placeholder="$t('crm_st.sel_reg')"
                                @blur="handleCustomerEmailBlur"
                                :disabled="form.id > 0 && detail.email || form.country_code == undefined" />
                        </div>
                    </div>

                    <!-- 地址 -->
                    <div class="form-item required">
                        <div class="key">{{ $t('crm_c.address') }}：</div>
                        <div class="value">

                            <a-tree-select class="CategoryTreeSelect" v-model:value="form.group_id"
                                :placeholder="$t('def.select')" :dropdown-style="{ maxHeight: '412px', overflow: 'auto' }"
                                :tree-data="groupOptions" tree-default-expand-all @select="setGroupId" />

                        </div>
                    </div>

                    <!-- 城市 -->
                    <div class="form-item ">
                        <div class="key"></div>
                        <div class="value">

                            <a-tree-select class="CategoryTreeSelect" v-model:value="form.group_id"
                                :placeholder="$t('def.select')" :dropdown-style="{ maxHeight: '412px', overflow: 'auto' }"
                                :tree-data="groupOptions" tree-default-expand-all @select="setGroupId" />
                        </div>
                    </div>


                    <!-- 详细地址 -->
                    <div class="form-item ">
                        <div class="key"></div>
                        <div class="value">
                            <a-tree-select class="CategoryTreeSelect" v-model:value="form.group_id"
                                :placeholder="$t('def.select')" :dropdown-style="{ maxHeight: '412px', overflow: 'auto' }"
                                :tree-data="groupOptions" tree-default-expand-all @select="setGroupId" />
                        </div>
                    </div>
                    <!-- 营业状态 -->
                    <div class="form-item required ">
                        <div class="key">{{ $t('crm_st.status') }}：</div>
                        <div class="value">
                            <a-input v-model:value="form.email" :placeholder="$t('def.input')"
                                @blur="handleCustomerEmailBlur" />
                        </div>
                    </div>
                    <!-- 开业时间 -->
                    <div class="form-item ">
                        <div class="key">{{ $t('crm_st.open_time') }}：</div>
                        <div class="value">
                            <a-input v-model:value="form.email" :placeholder="$t('def.input')"
                                @blur="handleCustomerEmailBlur" />
                        </div>
                    </div>

                    <!-- 营业时间 -->
                    <div class="form-item ">
                        <div class="key">{{ $t('dis.business_hours') }}：</div>
                        <div class="value">
                            <a-input v-model:value="form.email" :placeholder="$t('def.input')"
                                @blur="handleCustomerEmailBlur" />
                        </div>
                    </div>

                    <!-- 所属公司 -->
                    <div class="form-item ">
                        <div class="key">{{ $t('crm_st.com_affil') }}：</div>
                        <div class="value">
                            <a-input v-model:value="form.email" :placeholder="$t('def.input')"
                                @blur="handleCustomerEmailBlur" />
                        </div>
                    </div>

                    <!-- 联系手机 -->
                    <div class="form-item ">
                        <div class="key">{{ $t('crm_st.con_phone') }}：</div>
                        <div class="value">
                            <a-input v-model:value="form.email" :placeholder="$t('def.input')"
                                @blur="handleCustomerEmailBlur" />
                        </div>
                    </div>

                    <!-- 联系邮箱 -->
                    <div class="form-item ">
                        <div class="key">{{ $t('crm_st.con_email') }}：</div>
                        <div class="value">
                            <a-input v-model:value="form.email" :placeholder="$t('def.input')"
                                @blur="handleCustomerEmailBlur" />
                        </div>
                    </div>
                </div>
            </div>

            <!-- 门店配置 -->
            <div class="form-block">
                <div class="form-title">
                    <div class="title-colorful">{{ $t('s.sto_con') }}</div>
                </div>
                <div class="form-content">
                    <div class="form-item ">
                        <div class="key">{{ $t('crm_st.sto_area') }}：</div>
                        <div class="value">
                            <a-input v-model:value="form.name" :placeholder="$t('def.input')" />
                        </div>
                    </div>
                    <!-- 车位数 -->
                    <div class="form-item ">
                        <div class="key">{{ $t('crm_st.park_space') }}：</div>
                        <div class="value">
                            <a-input v-model:value="form.name" :placeholder="$t('def.input')" />
                        </div>
                    </div>

                    <!-- 地上车位 -->
                    <div class="form-item ">
                        <div class="key">{{ $t('crm_st.above_ground_park') }}：</div>
                        <div class="value">
                            <a-input v-model:value="form.name" :placeholder="$t('def.input')" />
                        </div>
                    </div>

                    <!-- 充电桩数 -->
                    <div class="form-item ">
                        <div class="key">{{ $t('crm_st.charg_station') }}：</div>
                        <div class="value">
                            <a-input v-model:value="form.name" :placeholder="$t('def.input')" />
                        </div>
                    </div>

                    <!-- 地上充电桩数 -->
                    <div class="form-item ">
                        <div class="key">{{ $t('crm_st.above_ground_park') }}：</div>
                        <div class="value">
                            <a-input v-model:value="form.name" :placeholder="$t('def.input')" />
                        </div>
                    </div>


                    <!-- 地下充电桩数 -->
                    <div class="form-item ">
                        <div class="key">{{ $t('crm_st.above_ground_park') }}：</div>
                        <div class="value">
                            <a-input v-model:value="form.name" :placeholder="$t('def.input')" />
                        </div>
                    </div>

                </div>
            </div>

            <!-- 门店人员 -->
            <div class="form-block">
                <div class="form-title" style="margin-right: 20px;">
                    <div class="title-colorful">{{ $t('s.sto_person') }}</div>
                </div>

                <div class="form-content">
                    <!-- 门店人员-表格 -->
                    <CrmEditStorePeo />
                </div>

            </div>

        </div>

    </div>
</template>

<script>
import Core from "../../../core";
import CrmEditStorePeo from '../../../components/crm/panel/CrmEditStorePeo.vue';
export default {

    name: "store-edit",
    components: {
        CrmEditStorePeo,
    },
    data() {
        return {
            form: {
                id: ''
            },

            // 上传图片
            upload: {
                // 上传图片
                action: Core.Const.NET.FILE_UPLOAD_END_POINT,
                coverList: [],
                detailList: [],
                headers: {
                    ContentType: false,
                },
                data: {
                    token: Core.Data.getToken(),
                    type: "img",
                },
            },
            trackRecordForm: {
                image_attachment_list: [],
            },

        }
    },
    watch: {

    },
    computed: {

    },
    mounted() {
        this.form.id = Number(this.$route.query.id) || 0
    },
    methods: {
        // 校验图片
        handleImgCheck(file) {
            const isCanUpType = [
                "image/jpeg",
                "image/png",
                "image/gif",
                "image/bmp",
            ].includes(file.type);
            if (!isCanUpType) {
                this.$message.warning(this.$t("n.file_incorrect"));
            }
            const isLt10M = file.size / 1024 / 1024 < 10;
            if (!isLt10M) {
                this.$message.warning(this.$t("n.picture_smaller"));
            }

            // this.loadImage(TEST_IMAGE);
            // return false;
            return isCanUpType && isLt10M;
        },
        // 上传图片
        handleCoverChange({ file, fileList }) {
            // 上传成功后在添加   
            console.log('handleCoverChange--------------------file', file, 'fileList', fileList);
            if (file.status == "done") {
                if (file.response && file.response.code > 0) {
                    return this.$message.error(file.response.message);
                }
                let imageAttachment = {
                    // id: file.uid,
                    uid: file.uid,
                    name: file.name,
                    path: file.response.data.filename,
                    type: file.response.data.filename.split(".").pop(),
                };
                // this.shortPath = get(fileList,'[0].response.data.filename', null);
                // if(this.shortPath) {
                //     // this.form.img = this.shortPath;
                //     // this.loadImage(this.detailImageUrl);
                // }
                this.trackRecordForm.image_attachment_list.push(imageAttachment);
                console.log('imageAttachment', imageAttachment);
            }
            // 删除的时候
            if (file.status == "removed") {
                this.trackRecordForm.image_attachment_list = this.trackRecordForm.image_attachment_list.filter(el => {
                    return el.id != file.uid
                })
            }

            this.upload.detailList = fileList;
            console.log('handleCoverChange------------follow', file, 'fileList', fileList, 'this.upload.detailList ', this.upload.detailList, 'this.trackRecordForm.image_attachment_list', this.trackRecordForm.image_attachment_list, 'this.upload.coverList', this.upload.coverList);
        },
    }

}
</script>

<style lang="less" scoped>
.edit-container {
    .key {
        width: 120px !important;
        text-align: right;
        padding-right: 20px !important;
        box-sizing: border-box;
    }

}
</style>