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
                            <a-upload v-model:file-list="fileList" name="avatar" list-type="picture-card"
                                class="avatar-uploader" :show-upload-list="false"
                                action="https://www.mocky.io/v2/5cc8019d300000980a055e76" :before-upload="beforeUpload"
                                @change="handleChange">
                                <img v-if="imageUrl" :src="imageUrl" alt="avatar" />
                                <div v-else>
                                    <loading-outlined v-if="loading"></loading-outlined>
                                    <plus-outlined v-else></plus-outlined>
                                    <div class="ant-upload-text">Upload</div>
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
                    <div class="title-colorful">{{ $t('crm_c.sto_con') }}</div>
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
                <div class="form-title">
                    <div class="title-colorful">{{ $t('crm_c.sto_person') }}</div>
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
            // 整体输入内容-前两部分


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

    }

}
</script>

<style lang="less" scoped></style>