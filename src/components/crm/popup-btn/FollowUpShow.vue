<template>
    <a-button class="FollowUpShow" @click.stop="handleModalShow" :ghost="ghost" :type="btnType" :class="btnClass">
        <slot><i class="icon i_add"></i> {{ btnText }}</slot>
    </a-button>
    <template class="modal-container">
        <template v-if="isMoreCss">
            <a-drawer
                :width="500"
                :title="$t('crm_t.add_track_record')"
                :visible="TrackRecordShow"
                @close="handleTrackRecordClose"
                :closable="false"
            >
                <template #extra>
                    <!-- 取消 -->
                    <a-button style="margin-right: 10px" @click="handleTrackRecordClose">{{
                        $t('def.cancel')
                    }}</a-button>
                    <!-- 确定 -->
                    <a-button type="primary" @click="handleTrackRecordSubmit">{{ $t('def.ok') }}</a-button>
                </template>
                <!-- 跟进方式 -->
                <div class="form-item required">
                    <div class="key">{{ $t('crm_t.type') }}：</div>
                    <div class="value">
                        <a-select v-model:value="trackRecordForm.type" :placeholder="$t('def.select')">
                            <a-select-option v-for="item of TYPE_MAP" :key="item.value" :value="item.value">{{
                                lang === 'zh' ? item.zh : item.en
                            }}</a-select-option>
                        </a-select>
                    </div>
                </div>
                <!-- 内容记录 -->
                <div class="form-item textarea required">
                    <div class="key">{{ $t('crm_t.content') }}：</div>
                    <div class="value">
                        <a-textarea
                            v-model:value="trackRecordForm.content"
                            :placeholder="$t('def.input') + $t('crm_t.content')"
                            :auto-size="{ minRows: 2, maxRows: 6 }"
                            :maxlength="500"
                        />
                        <span class="content-length">{{ trackRecordForm.content?.length }}/500</span>
                    </div>
                </div>
                <!-- 详情图 -->
                <div class="form-item img-upload">
                    <div class="key">{{ $t('i.picture') }}：</div>
                    <div class="value">
                        <a-upload
                            name="file"
                            class="image-uploader"
                            list-type="picture-card"
                            accept="image/*"
                            :file-list="upload.detailList"
                            :action="upload.action"
                            :headers="upload.headers"
                            :data="upload.data"
                            :before-upload="handleImgCheck"
                            @change="handleCoverChange"
                        >
                            <div class="image-inner" v-if="upload.coverList.length < 10">
                                <i class="icon i_upload" />
                            </div>
                        </a-upload>
                        <div class="tip">{{ $t('n.size') }}：800*800px</div>
                    </div>
                </div>
                <!-- 上传文件 -->
                <div class="form-item file-upload">
                    <div class="key">{{ $t('f.file') }}：</div>
                    <div class="value">
                        <a-upload
                            name="file"
                            :file-list="fileUpload.fileList"
                            :action="fileUpload.action"
                            :headers="fileUpload.headers"
                            :data="fileUpload.data"
                            @change="handleFileChange"
                        >
                            <a-button
                                class="file-upload-btn"
                                type="primary"
                                ghost
                                v-if="fileUpload.fileList.length < 10"
                            >
                                <i class="icon i_upload" /> {{ $t('f.upload') }}
                            </a-button>
                        </a-upload>
                    </div>
                </div>
                <!-- 添加联系人 -->
                <div class="form-item">
                    <div class="key">{{ $t('crm_t.contact_customer') }}：</div>
                    <div class="value">
                        <div v-if="trackRecordForm.contact_customer_id === ''">
                            <CustomerSelect
                                @select="handleAddCustomerShow"
                                :radioMode="true"
                                btn-class="select-item-btn"
                                btnType="link"
                                addCustomerBtn="true"
                                :targetId="targetId"
                                :targetType="targetType"
                                :groupId="groupId"
                            >
                                <i class="icon i_edit" /> {{ $t('crm_c.add') }}
                            </CustomerSelect>
                        </div>
                        <div v-else>
                            {{ trackRecordForm.contact_customer_name }}
                            <CustomerSelect
                                @select="handleAddCustomerShow"
                                :radioMode="true"
                                btn-class="select-item-btn"
                                btnType="link"
                                addCustomerBtn="true"
                                :targetId="targetId"
                                :targetType="targetType"
                            >
                                <i class="icon i_edit" /> {{ $t('crm_c.edit') }}
                            </CustomerSelect>
                        </div>
                    </div>
                </div>
                <!-- 跟进时间-->
                <div class="form-item">
                    <div class="key">{{ $t('crm_t.track_time') }}：</div>
                    <div class="value">
                        <a-date-picker
                            v-model:value="trackRecordForm.track_time"
                            valueFormat="YYYY-MM-DD HH:mm:ss"
                            :show-time="defaultTime"
                            :placeholder="$t('def.select')"
                        />
                    </div>
                </div>
                <!-- 跟进结果 -->
                <div class="form-item">
                    <div class="key">{{ $t('crm_t.intent') }}：</div>
                    <div class="value">
                        <a-select v-model:value="trackRecordForm.intent" :placeholder="$t('def.select')" allowClear>
                            <a-select-option v-for="item of DEGREE_INTENT" :key="item.key" :value="item.value">
                                {{ lang === 'zh' ? item.zh : item.en }}
                            </a-select-option>
                        </a-select>
                    </div>
                </div>
                <!-- 意向度 -->
                <div class="form-item">
                    <div class="key">{{ $t('crm_c.intentionality') }}：</div>
                    <div class="value">
                        <a-select v-model:value="trackRecordForm.intention" :placeholder="$t('def.select')" allowClear>
                            <a-select-option v-for="item of CHINA_INTENT" :key="item.key" :value="item.value">
                                <a-tooltip placement="top" :title="item.con">
                                    <span>{{ item.zh }}:{{ item.con }}</span>
                                </a-tooltip>
                            </a-select-option>
                        </a-select>
                    </div>
                </div>
                <!-- 下次跟进时间 -->
                <div class="form-item">
                    <div class="key">{{ $t('crm_t.next_track_time') }}：</div>
                    <div class="value">
                        <a-date-picker
                            v-model:value="trackRecordForm.next_track_time"
                            valueFormat="YYYY-MM-DD HH:mm:ss"
                            :show-time="defaultTime"
                            :placeholder="$t('def.select')"
                        />
                    </div>
                </div>
                <!-- 下次跟进计划 -->
                <div class="form-item textarea">
                    <div class="key">{{ $t('crm_t.next_track_plan') }}：</div>
                    <div class="value">
                        <a-textarea
                            v-model:value="trackRecordForm.next_track_plan"
                            :placeholder="$t('def.input') + $t('crm_t.next_track_plan')"
                            :auto-size="{ minRows: 2, maxRows: 6 }"
                            :maxlength="500"
                        />
                        <span class="content-length">{{ trackRecordForm.next_track_plan?.length }}/500</span>
                    </div>
                </div>
            </a-drawer>
        </template>
        <template v-else>
            <a-modal
                v-model:visible="TrackRecordShow"
                :title="$t('crm_t.add_track_record')"
                :after-close="handleTrackRecordClose"
            >
                <!-- 跟进方式 -->
                <div class="form-item required">
                    <div class="key">{{ $t('crm_t.type') }}：</div>
                    <div class="value">
                        <a-select v-model:value="trackRecordForm.type" :placeholder="$t('def.select')">
                            <a-select-option v-for="item of TYPE_MAP" :key="item.value" :value="item.value">{{
                                lang === 'zh' ? item.zh : item.en
                            }}</a-select-option>
                        </a-select>
                    </div>
                </div>
                <!-- 内容记录 -->
                <div class="form-item textarea required">
                    <div class="key">{{ $t('crm_t.content') }}：</div>
                    <div class="value">
                        <a-textarea
                            v-model:value="trackRecordForm.content"
                            :placeholder="$t('def.input') + $t('crm_t.content')"
                            :auto-size="{ minRows: 2, maxRows: 6 }"
                            :maxlength="500"
                        />
                        <span class="content-length">{{ trackRecordForm.content.length }}/500</span>
                    </div>
                </div>
                <!-- 详情图 -->
                <div class="form-item img-upload">
                    <div class="key">{{ $t('i.picture') }}</div>
                    <div class="value">
                        <a-upload
                            name="file"
                            class="image-uploader"
                            list-type="picture-card"
                            accept="image/*"
                            :file-list="upload.detailList"
                            :action="upload.action"
                            :headers="upload.headers"
                            :data="upload.data"
                            :before-upload="handleImgCheck"
                            @change="handleCoverChange"
                        >
                            <div class="image-inner" v-if="upload.coverList.length < 10">
                                <i class="icon i_upload" />
                            </div>
                        </a-upload>
                        <div class="tip">{{ $t('n.size') }}：800*800px</div>
                    </div>
                </div>
                <!-- 上传文件 -->
                <div class="form-item file-upload">
                    <div class="key">{{ $t('f.file') }}:</div>
                    <div class="value">
                        <a-upload
                            name="file"
                            :file-list="fileUpload.fileList"
                            :action="fileUpload.action"
                            :headers="fileUpload.headers"
                            :data="fileUpload.data"
                            @change="handleFileChange"
                        >
                            <a-button
                                class="file-upload-btn"
                                type="primary"
                                ghost
                                v-if="fileUpload.fileList.length < 10"
                            >
                                <i class="icon i_upload" /> {{ $t('f.upload') }}
                            </a-button>
                        </a-upload>
                    </div>
                </div>
                <!-- 添加联系人 -->
                <div class="form-item">
                    <div class="key">{{ $t('crm_t.contact_customer') }}：</div>
                    <div class="value">
                        <div v-if="trackRecordForm.contact_customer_id === ''">
                            <CustomerSelect
                                @select="handleAddCustomerShow"
                                :radioMode="true"
                                btn-class="select-item-btn"
                                btnType="link"
                                addCustomerBtn="true"
                                :targetId="targetId"
                                :targetType="targetType"
                                :groupId="groupId"
                            >
                                <i class="icon i_edit" /> {{ $t('crm_c.add') }}
                            </CustomerSelect>
                        </div>
                        <div v-else>
                            {{ trackRecordForm.contact_customer_name }}
                            <CustomerSelect
                                @select="handleAddCustomerShow"
                                :radioMode="true"
                                btn-class="select-item-btn"
                                btnType="link"
                                addCustomerBtn="true"
                                :targetId="targetId"
                                :targetType="targetType"
                            >
                                <i class="icon i_edit" /> {{ $t('crm_c.edit') }}
                            </CustomerSelect>
                        </div>
                    </div>
                </div>
                <!-- 跟进时间-->
                <div class="form-item">
                    <div class="key">{{ $t('crm_t.track_time') }}：</div>
                    <div class="value">
                        <a-date-picker
                            v-model:value="trackRecordForm.track_time"
                            valueFormat="YYYY-MM-DD HH:mm:ss"
                            :show-time="defaultTime"
                            :placeholder="$t('def.select')"
                        />
                    </div>
                </div>
                <!-- 意向程度 -->
                <div class="form-item">
                    <div class="key">{{ $t('crm_t.intent') }}</div>
                    <div class="value">
                        <a-select v-model:value="trackRecordForm.intent" :placeholder="$t('def.select')" allowClear>
                            <a-select-option v-for="item of DEGREE_INTENT" :key="item.key" :value="item.value">
                                {{ lang === 'zh' ? item.zh : item.en }}
                            </a-select-option>
                        </a-select>
                    </div>
                </div>
                <!-- 下次跟进时间 -->
                <div class="form-item">
                    <div class="key">{{ $t('crm_t.next_track_time') }}：</div>
                    <div class="value">
                        <a-date-picker
                            v-model:value="trackRecordForm.next_track_time"
                            valueFormat="YYYY-MM-DD HH:mm:ss"
                            :show-time="defaultTime"
                            :placeholder="$t('def.select')"
                        />
                    </div>
                </div>
                <!-- 下次跟进计划 -->
                <div class="form-item textarea">
                    <div class="key">{{ $t('crm_t.next_track_plan') }}：</div>
                    <div class="value">
                        <a-textarea
                            v-model:value="trackRecordForm.next_track_plan"
                            :placeholder="$t('def.input') + $t('crm_t.next_track_plan')"
                            :auto-size="{ minRows: 2, maxRows: 6 }"
                            :maxlength="500"
                        />
                        <span class="content-length">{{ trackRecordForm.content.length }}/500</span>
                    </div>
                </div>
                <!-- 标签展示 -->
                <div class="form-item textarea">
                    <div class="key">{{ $t('sl.show') }}：</div>
                    <div class="value">
                        <LabelList :targetId="$route.query.id" :targetType="CUSTOMER" />
                    </div>
                </div>
                <template #footer>
                    <!-- 确定按钮 -->
                    <a-button @click="handleTrackRecordSubmit" type="primary">{{ $t('def.ok') }}</a-button>
                    <!-- 取消按钮 -->
                    <a-button @click="handleTrackRecordClose">{{ $t('def.cancel') }}</a-button>
                </template>
            </a-modal>
        </template>
    </template>
</template>

<script>
import Core from '../../../core';
import dayjs from 'dayjs';
import { get } from 'lodash';
import CustomerSelect from '@/components/crm/popup-btn/CustomerSelect.vue';
import LabelList from '@/components/crm/common/LabelList.vue';

const WAYBILL = Core.Const.WAYBILL;

export default {
    name: 'FollowUpShow',
    components: { CustomerSelect, LabelList },
    props: {
        btnText: {
            type: String,
            default: '写跟进',
        },
        btnType: {
            type: String,
            default: 'primary',
        },
        btnClass: {
            type: String,
        },
        ghost: {
            type: Boolean,
            default: false,
        },
        targetType: {
            type: Number,
            default: 0,
        },
        targetId: {
            type: Number,
            default: 0,
        },
        // 数据详情
        detail: {
            type: Object,
        },
        groupId: {
            type: Number,
        },
        isMoreCss: {
            type: Boolean,
        },
    },
    data() {
        return {
            TYPE_MAP: Core.Const.CRM_TRACK_RECORD.TYPE_MAP,
            INTENT_MAP: Core.Const.CRM_TRACK_RECORD.INTENT_MAP,
            defaultTime: Core.Const.TIME_PICKER_DEFAULT_VALUE.BEGIN,
            DEGREE_INTENT: Core.Const.CRM_TRACK_RECORD.DEGREE_INTENT, // 意向程度list
            CUSTOMER: Core.Const.CRM_LABEL.CATEGORY.CUSTOMER,
            loginType: Core.Data.getLoginType(),
            // 加载
            loading: false,
            TrackRecordShow: false,
            trackRecordForm: {
                id: '',
                type: undefined,
                content: '',
                contact_customer_id: '',
                track_time: undefined,
                intent: undefined,
                intention: undefined,
                next_track_time: undefined,
                next_track_plan: undefined,
                image_attachment_list: [],
                file_attachment_list: [],
            },

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
                    type: 'img',
                },
            },
            fileUpload: {
                action: Core.Const.NET.FILE_UPLOAD_END_POINT,
                fileList: [],
                headers: {
                    ContentType: false,
                },
                data: {
                    token: Core.Data.getToken(),
                    type: 'file',
                },
            },
            // 意向度
            CHINA_INTENT: Core.Const.CRM_TRACK_RECORD.CHINA_INTENT,
        };
    },
    watch: {},
    computed: {
        lang() {
            return this.$store.state.lang;
        },
    },
    created() {},
    mounted() {},
    methods: {
        handleModalShow() {
            if (this.detail) {
                let detail = Core.Util.deepCopy(this.detail); // 深拷贝防止影响结果
                // 点击编辑执行这里面语句
                for (const key in this.trackRecordForm) {
                    this.trackRecordForm[key] = detail[key];
                }
                this.trackRecordForm['intent'] = detail['intent'] ? detail['intent'] : undefined; // 这返回的数据有 0 的情况（意向程度）
                this.trackRecordForm.track_time = detail.track_time
                    ? dayjs.unix(detail.track_time).format('YYYY-MM-DD HH:mm:ss')
                    : undefined;
                this.trackRecordForm.next_track_time = detail.next_track_time
                    ? dayjs.unix(detail.next_track_time).format('YYYY-MM-DD HH:mm:ss')
                    : undefined;
                this.trackRecordForm.contact_customer_name = detail.contact ? detail.contact.name : '-';

                // 让编辑照片显示(还有个bug删除需要后端一起配置)
                this.trackRecordForm.image_attachment_list.forEach(el => {
                    this.upload.detailList.push({
                        uid: el.id,
                        name: el.name,
                        url: this.$Util.imageFilter(el.path),
                        thumbUrl: this.$Util.imageFilter(el.path),
                    });
                });
                // 让编辑文件显示
                this.trackRecordForm.file_attachment_list.forEach(el => {
                    this.fileUpload.fileList.push({
                        uid: el.id,
                        name: el.name,
                        url: Core.Const.NET.FILE_URL_PREFIX + el.path,
                    });
                });
            }

            this.TrackRecordShow = true;
        },
        handleTrackRecordSubmit() {
            let form = Core.Util.deepCopy(this.trackRecordForm);
            let track_time = form.track_time;
            if (!form.type) {
                return this.$message.warning(this.$t('def.enter'));
            }
            if (!form.content) {
                return this.$message.warning(this.$t('def.enter'));
            }

            if (typeof track_time === 'string') {
                track_time = dayjs(form.track_time).unix();
            }
            let next_track_time = form.next_track_time;
            if (typeof next_track_time === 'string') {
                next_track_time = dayjs(form.next_track_time).unix();
            }
            Core.Api.CRMTrackRecord.save({
                id: form.id,
                target_id: this.targetId,
                target_type: this.targetType,
                type: form.type,
                content: form.content,
                contact_customer_id: form.contact_customer_id,
                track_time: track_time,
                intent: form.intent,
                intention: form.intention,
                next_track_time: next_track_time,
                next_track_plan: form.next_track_plan,
                image_attachment_list: form.image_attachment_list,
                file_attachment_list: form.file_attachment_list,
            })
                .then(() => {
                    this.$message.success(this.$t('pop_up.save_success'));
                    this.handleTrackRecordClose();
                    this.$emit('submit');
                    location.reload();
                })
                .catch(err => {
                    console.log('handleSubmit err:', err);
                });
        },
        handleTrackRecordClose() {
            this.TrackRecordShow = false;
            Object.assign(this.trackRecordForm, this.$options.data().trackRecordForm);
            this.upload.detailList = []; // 清空上传照片数据
            this.fileUpload.fileList = []; // 清空上传的文件
        },
        // 校验图片
        handleImgCheck(file) {
            const isCanUpType = ['image/jpeg', 'image/png', 'image/gif', 'image/bmp'].includes(file.type);
            if (!isCanUpType) {
                this.$message.warning(this.$t('n.file_incorrect'));
            }
            const isLt10M = file.size / 1024 / 1024 < 10;
            if (!isLt10M) {
                this.$message.warning(this.$t('n.picture_smaller'));
            }

            // this.loadImage(TEST_IMAGE);
            // return false;
            return isCanUpType && isLt10M;
        },
        // 上传图片
        handleCoverChange({ file, fileList }) {
            // 上传成功后在添加
            if (file.status == 'done') {
                if (file.response && file.response.code > 0) {
                    return this.$message.error(file.response.message);
                }
                let imageAttachment = {
                    // id: file.uid,
                    uid: file.uid,
                    name: file.name,
                    path: file.response.data.filename,
                    type: file.response.data.filename.split('.').pop(),
                };
                // this.shortPath = get(fileList,'[0].response.data.filename', null);
                // if(this.shortPath) {
                //     // this.form.img = this.shortPath;
                //     // this.loadImage(this.detailImageUrl);
                // }
                this.trackRecordForm.image_attachment_list.push(imageAttachment);
            }
            // 删除的时候
            if (file.status == 'removed') {
                this.trackRecordForm.image_attachment_list = this.trackRecordForm.image_attachment_list.filter(el => {
                    return el.id != file.uid;
                });
            }

            this.upload.detailList = fileList;
            console.log(
                'handleCoverChange------------follow',
                file,
                'fileList',
                fileList,
                'this.upload.detailList ',
                this.upload.detailList,
                'this.trackRecordForm.image_attachment_list',
                this.trackRecordForm.image_attachment_list,
                'this.upload.coverList',
                this.upload.coverList,
            );
        },
        // 上传文件
        handleFileChange({ file, fileList }) {
            if (file.status == 'done') {
                if (file.response && file.response.code > 0) {
                    return this.$message.error(file.response.message);
                }
                console.log('file', file);
                let fileAttachment = {
                    // id: file.uid,
                    uid: file.uid,
                    name: file.name,
                    path: file.response.data.filename,
                    type: file.response.data.filename.split('.').pop(),
                };
                // this.form.path = file.response.data.filename
                // this.form.type = this.form.path.split('.').pop()
                // if (fileAttachment.path){
                //     this.submitDisabled = false
                // }
                this.trackRecordForm.file_attachment_list.push(fileAttachment);
            }

            // 删除的时候
            if (file.status == 'removed') {
                this.trackRecordForm.file_attachment_list = this.trackRecordForm.file_attachment_list.filter(el => {
                    return el.id != file.uid;
                });
            }

            this.fileUpload.fileList = fileList;
        },
        // 添加商品
        handleAddCustomerShow(ids, items) {
            this.trackRecordForm.contact_customer_id = items[0].id;
            this.trackRecordForm.contact_customer_name = items[0].name;
        },
    },
};
</script>

<style lang="less" scoped>
.FollowUpShow {
    margin-right: 8px;

    .main {
        font-size: 12px;
        font-weight: 500;
        color: #3c3c3c;
        line-height: 20px;

        .ant-btn {
            height: 20px;
            font-size: 12px;
            margin-left: 8px;
        }
    }

    .desc,
    .time {
        font-size: 12px;
        font-weight: 500;
        color: #6c6c6c;
        line-height: 20px;
        margin: 6px 0;
    }
}

.waybill-show-modal {
    .ant-steps-item-container {
        .ant-steps-item-content {
            width: calc(~'100% - 30px');
        }
    }
}

.ant-btn {
    width: 100px;
    height: 32px;
}

.ant-drawer-title {
    font-weight: 600;
    color: #000022;
}

.key {
    color: #8090a6 !important;
}

.ant-select-selection-placeholder {
    color: #363d42;
}

input::-webkit-input-placeholder {
    /* 修改placeholder颜色  */
    font-size: 12px;
    color: #363d42 !important;
}
</style>
