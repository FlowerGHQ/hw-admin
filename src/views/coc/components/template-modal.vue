<template>
    <div class="tamplate-modal">
        <a-modal v-model:visible="dialogVisible" destroyOnClose @ok="handleOk" @cancel="handleCancel">
            <template #title>
                <span v-if="modalType === 'add'">{{ $t('coc.coc_modal_add_title') }}</span>
                <span v-if="modalType === 'edit'">{{ $t('coc.coc_modal_edit_title') }}</span>
                <span v-if="modalType === 'detail'">
                    {{ $t('coc.coc_modal_view_title') }}
                </span>
            </template>
            <template #footer>
                <a-button @click="handleCancel" v-if="!isDisable">
                    {{ $t('coc.coc_btn_cancel') }}
                </a-button>
                <a-button type="primary" @click="handleOk" v-if="!isDisable">
                    {{ $t('coc.coc_btn_comfirm') }}
                </a-button>
            </template>
            <!-- 内容form表单 -->
            <a-form
                ref="refForm"
                :form="searchForm"
                :layout="formLayout"
                :label-col="labelCol"
                :wrapper-col="wrapperCol"
                :model="searchForm"
                :rules="rules"
            >
                <a-form-item :label="$t('coc.coc_lable_name')" :label-col="labelCol" name="name">
                    <a-input
                        v-model:value="searchForm.name"
                        :disabled="isDisable"
                        :placeholder="$t('coc.coc_placeholder_name')"
                    />
                </a-form-item>
                <a-form-item :label="$t('coc.coc_lable_version')" :label-col="labelCol" name="version_number">
                    <a-input
                        v-model:value="searchForm.version_number"
                        :disabled="isDisable"
                        :placeholder="$t('coc.coc_placeholder_version')"
                    />
                </a-form-item>
                <a-form-item :label="$t('coc.coc_lable_validity_date')" :label-col="labelCol" name="coc_validity_date">
                    <a-range-picker
                        :show-time="{ format: 'HH:mm' }"
                        v-model:value="searchForm.coc_validity_date"
                        :disabled="isDisable"
                        valueFormat="YYYY-MM-DD HH:mm:ss"
                        :placeholder="[$t('coc.coc_start_date'), $t('coc.coc_start_date')]"
                    />
                </a-form-item>
                <a-form-item :label="$t('coc.coc_lable_apply_vehicle')" :label-col="labelCol" name="model">
                    <!-- select -->
                    <a-select
                        v-model:value="searchForm.model"
                        mode="multiple"
                        showArrow
                        showSearch
                        :disabled="isDisable"
                        :placeholder="$t('coc.coc_placeholder_apply_vehicle')"
                        @select="handleSelectChange"
                        :options="
                            option.map((item, index) => {
                                return {
                                    label: `${item.label} - ${item.key}`,
                                    value: item.key,
                                    key: item.key,
                                };
                            })
                        "
                        :filter-option="filterOption"
                    >
                        <!-- <a-select-option
              v-for="(item, index) in filterOption"
              :key="item.key"
              :value="item.key">
              {{ item.label }} - {{ item.key }}
            </a-select-option> -->
                        <!-- <template #tagRender="{ value, label, closable, onClose, option }">
              <a-tag> {{ label }} - {{ value }} </a-tag>
            </template> -->
                    </a-select>
                </a-form-item>
                <a-form-item
                    :label="$t('coc.coc_lable_template')"
                    :label-col="labelCol"
                    name="upload"
                    class="upload-item"
                >
                    <!-- 上传组件 正方形带+ -->
                    <a-upload
                        name="file"
                        ref="uploader"
                        :multiple="false"
                        :disabled="isDisable"
                        :file-list="searchForm.fileList"
                        :action="upload.action"
                        :headers="upload.headers"
                        :data="upload.data"
                        :max-count="1"
                        :showUploadList="false"
                        @change="handleFileChange"
                        :before-upload="handleFileCheck"
                    >
                        <div class="tips_upload" v-if="searchForm.fileList && searchForm.fileList.length == 0">
                            <div class="upload-area">
                                <plus-outlined></plus-outlined>
                                <div class="ant-upload-text">
                                    {{ $t('coc.coc_placeholder_upload') }}
                                </div>
                            </div>
                            <div class="tips">
                                注：请把以下字段放到模版里对应的位置再上传： &#123;&#123;车架号&#125;&#125;
                                &#123;&#123;电机号&#125;&#125; &#123;&#123;生产时间&#125;&#125;
                            </div>
                        </div>

                        <div v-else class="upload-file-list">
                            <div v-for="(item, index) in searchForm.fileList" :key="index" class="file-list-item">
                                <div class="file-item">
                                    <file-word-outlined></file-word-outlined>
                                    <div class="file-name">{{ item.name }}</div>
                                </div>
                                <div class="file-reupload-delete">
                                    <a-button type="link" @click="handleFileReupload(item)" v-if="!isDisable">
                                        {{ $t('coc.coc_reupload') }}
                                    </a-button>
                                    <a-button
                                        type="link"
                                        @click.stop.prevent="handleFileDelete(item)"
                                        danger
                                        v-if="!isDisable"
                                    >
                                        {{ $t('coc.coc_btn_delete') }}
                                    </a-button>
                                    <!-- 查看按钮 -->
                                    <a-button type="link" @click.stop.prevent="handleFileview(item)" v-if="isDisable">
                                        {{ $t('coc.coc_btn_view') }}
                                    </a-button>
                                </div>
                            </div>
                        </div>
                    </a-upload>
                </a-form-item>
                <a-form-item
                    :label="$t('coc.coc_lable_template_img')"
                    :label-col="labelCol"
                    class="upload-item"
                    v-if="type === 'add'"
                >
                    <div class="coc_lable_template_img">
                        <a-image :preview="true" :src="defaultTemplate" />
                    </div>
                </a-form-item>
            </a-form>
        </a-modal>
    </div>
</template>
<script setup>
import Core from '@/core';
import defaultTemplate from '@/assets/images/coc/template-img.png';
import { useI18n } from 'vue-i18n';
import { defineEmits, reactive, ref, onMounted, watch, getCurrentInstance, computed } from 'vue';
// import TemplateUpload from "./template-upload.vue";
const Util = Core.Util;
const { FILE_UPLOAD_END_POINT, OSS_POINT } = Core.Const.NET;
const { getCateGoryList, viewCocTemplate, addCocTemplate } = Core.Api.COC;
const { dayjsReview, timeFilter, dayjsToTimestamp } = Util;
import { PlusOutlined, FileWordOutlined } from '@ant-design/icons-vue';
const $t = useI18n().t;
const $message = getCurrentInstance().proxy.$message;
const props = defineProps({
    dialogVisible: {
        type: Boolean,
        default: false,
    },
    modalType: {
        type: String,
        default: '',
    },
    isDisable: {
        type: Boolean,
        default: false,
    },
    recordItem: {
        type: Object,
        default: () => {},
    },
});
const $emit = defineEmits(['update:dialogVisible', 'search']);
const formLayout = ref('horizontal');
const labelCol = ref({ style: { width: '100px' } });
const wrapperCol = ref({ span: 18 });
const option = ref([]);
const refForm = ref(null);
const type = computed(() => {
    return props.modalType;
});
const upload = reactive({
    action: FILE_UPLOAD_END_POINT,
    headers: {
        ContentType: false,
    },
    data: {
        token: Core.Data.getToken(),
        type: 'file',
    },
});
// validate
const validateDate = async (rule, value) => {
    if (value && value.length > 0) {
        return Promise.resolve();
    }
    return Promise.reject($t('coc.coc_validity_date_required'));
};
const validateModel = async (rule, value) => {
    if (value && value.length > 0) {
        return Promise.resolve();
    }
    return Promise.reject($t('coc.coc_apply_vehicle_required'));
};
const validateUpload = async (rule, value) => {
    console.log('校验的值', searchForm);
    if (searchForm.fileList.length > 0 && searchForm.fileList) {
        return Promise.resolve();
    }
    return Promise.reject($t('coc.coc_template_required'));
};
const rules = reactive({
    name: [
        {
            required: true,
            message: () => $t('coc.coc_name_required'),
            trigger: ['change', 'blur'],
        },
    ],
    version_number: [
        {
            required: true,
            message: () => $t('coc.coc_version_required'),
            trigger: ['change', 'blur'],
        },
    ],
    coc_validity_date: [
        {
            required: true,
            trigger: ['change', 'blur'],
            validator: validateDate,
        },
    ],
    model: [
        {
            required: true,
            trigger: ['change', 'blur'],
            validator: validateModel,
        },
    ],
    upload: [
        {
            required: true,
            trigger: ['change', 'blur'],
            validator: validateUpload,
        },
    ],
});
const searchForm = reactive({
    name: '',
    version_number: '',
    coc_validity_date: [],
    model: [],
    fileList: [],
    id: '',
});
const filterOption = (input, option) => {
    return option.value.toLowerCase().indexOf(input.toLowerCase()) >= 0;
};
watch([() => props.modalType, () => props.recordItem], val => {
    console.log('val', val);
    if (val[0] === 'add') {
        getCateGory();
    } else {
        if (val[1].id) {
            getCateGory(val[1].id);
        }
    }
    if (val[1]) {
        searchForm.name = val[1].name;
        searchForm.version_number = val[1].version_number;
        searchForm.coc_validity_date =
            val[1].effective_start_time && val[1].effective_start_time
                ? [dayjsReview(val[1].effective_start_time), dayjsReview(val[1].effective_end_time)]
                : [];
        searchForm.model = val[1].model && val[1].model.length > 0 ? val[1].model.split(',') : [];
        searchForm.fileList =
            val[1].file_name && val[1].file_url
                ? [
                      {
                          response: {
                              data: {
                                  filename: val[1].file_url,
                                  name: val[1].file_name,
                              },
                          },
                          name: val[1].file_name,
                          url: OSS_POINT + '/' + val[1].file_url,
                      },
                  ]
                : [];
        searchForm.id = val[1].id;
    }
});
// 上传前检查文件
const handleFileCheck = file => {
    if (
        file.type !== 'application/msword' &&
        file.type !== 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ) {
        $message.error($t('coc.coc_error_file_type'));
        return false;
    }
    return true;
};
// 上传文件
const handleFileChange = info => {
    searchForm.fileList = info.fileList;
};
const handleFileReupload = item => {
    // 因为是computed，所以需要重新赋值，
    // 不能直接修改upload.fileList
    searchForm.fileList = [];
};
const handleFileDelete = item => {
    searchForm.fileList = [];
};
const handleFileview = item => {
    let url = 'http://view.officeapps.live.com/op/view.aspx?src=' + item.url;
    console.log('url', url);
    window.open(url, '_blank');
};

// 选择
const handleSelectChange = value => {
    console.log('value', value);
};

// methods
// 获取下拉框数据
const getCateGory = async (id = '') => {
    const res = await getCateGoryList({ coc_template_id: id });
    option.value = res;
};

const hanleeEdit = form => {
    addCocTemplate(form).then(res => {
        console.log('props.modalType', props.modalType);
        if (props.modalType === 'edit') {
            $message.success($t('coc.coc_edit_success'));
        } else if (props.modalType === 'add') {
            $message.success($t('coc.coc_add_success'));
        }
        console.log('res', searchForm);
        $emit('update:dialogVisible', false);
        $emit('search');
    });
};
// modal
const handleOk = () => {
    refForm.value
        .validate()
        .then(res => {
            console.log(searchForm);
            let params = {
                ...searchForm,
                file_url: searchForm.fileList[0].response.data.filename,
                file_name: searchForm.fileList[0].name,
                effective_start_time: dayjsToTimestamp(searchForm.coc_validity_date[0]),
                effective_end_time: dayjsToTimestamp(searchForm.coc_validity_date[1]),
                model: searchForm.model.length > 1 ? searchForm.model.join(',') : searchForm.model[0],
            };
            if (props.modalType === 'add') params.id = '';
            delete params.fileList;
            delete params.coc_validity_date;
            console.log('params', params);
            hanleeEdit(params);
        })
        .catch(err => {
            console.log(err);
            console.log('校验失败');
        });
};
const handleCancel = () => {
    $emit('update:dialogVisible', false);
};
onMounted(() => {
    getCateGory();
});
</script>

<style lang="less" scoped>
:deep(.ant-form-item-label) {
    label {
        display: inline-flex;
        white-space: normal;
        height: 100%;
        margin-right: 8px;
        // 与右侧内容对齐
        align-items: center;
        align-items: flex-start;
    }
}
:deep(.ant-upload) {
    width: 100%;
}
:deep(.ant-picker-range) {
    width: 100%;
}
.upload-file-list {
    width: 100%;
    .file-list-item {
        padding: 0 10px;
        border: 1px dashed var(--Color-border-2, #e5e6eb);
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        .file-item {
            display: flex;
            align-items: center;
            .file-name {
                // 超出部分省略号
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                width: 200px;
            }
            .anticon-file-word {
                margin-right: 8px;
                font-size: 18px;
            }
        }
    }
}
.upload-item {
    .tips_upload {
        display: flex;
        align-items: center;
        height: 100%;
        .upload-area {
            display: flex;
            min-width: 80px;
            height: 80px;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            gap: 10px;
            border-radius: 2px;
            border: 1px dashed var(--Color-border-2, #e5e6eb);
            background: var(--Color-fill-1, #f7f8fa);
        }
        .tips {
            height: 80px;
            font-size: 12px;
            margin-left: 20px;
            // 超出换行
            white-space: normal;
        }
    }
}
.coc_lable_template_img {
    width: 80px;
    height: 80px;
    border-radius: 4px;
    border: 1px solid #eaecf1;
    background: #fff;
    cursor: pointer;
    .ant-image {
        width: 100%;
        height: 100%;
    }
}
.ant-form-item-control-input-content > span {
    display: block;
    width: 100%;
}
</style>
