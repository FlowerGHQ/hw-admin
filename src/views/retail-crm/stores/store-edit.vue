<template>
    <div id="store-edit">
        <a-spin :spinning="loading" class="loading-incontent" v-if="loading"></a-spin>
        <div class="edit-container">
            <div class="title-container">
                <div class="title-area">
                    {{ form.id ? $t('crm_st.edit_st') : $t('crm_st.add_st') }}
                </div>
                <a-button type="primary" v-if="$auth('customer.detail')" @click="handelSave">{{
                    $t('def.save')
                }}</a-button>
            </div>
            <div class="form-block">
                <div class="form-title">
                    <div class="title-colorful">{{ $t('n.information') }}</div>
                </div>
                <div class="form-content">
                    <!-- 门店名称 -->
                    <div class="form-item required">
                        <div class="key">{{ $t('n.store_n') }}：</div>
                        <div class="value">
                            <a-input v-model:value="form.name" :placeholder="$t('def.input')" />
                        </div>
                    </div>
                    <!-- 图片 -->
                    <div class="form-item">
                        <div class="key">{{ $t('n.store_pic') }}：</div>
                        <div class="value">
                            <a-upload
                                :file-list="upload.detailList"
                                class="image-uploader"
                                name="file"
                                accept="image/*"
                                list-type="picture-card"
                                :headers="upload.headers"
                                :data="upload.data"
                                :action="upload.action"
                                :before-upload="handleImgCheck"
                                @change="handleCoverChange"
                            >
                                <div class="image-inner" v-if="upload.detailList.length < 1">
                                    <i class="icon i_upload" />
                                </div>
                            </a-upload>
                        </div>
                    </div>
                    <!-- 门店类型 -->
                    <div class="form-item required">
                        <div class="key">{{ $t('crm_st.type') }}：</div>
                        <div class="value">
                            <a-select v-model:value="form.type" :placeholder="$t('def.select')" allow-clear>
                                <a-select-option v-for="item of STORE_TYPE" :key="item.key" :value="item.value">
                                    {{ lang === 'zh' ? item.zh : item.en }}
                                </a-select-option>
                            </a-select>
                        </div>
                    </div>
                    <!-- 门店级别 -->
                    <div class="form-item required">
                        <div class="key">{{ $t('crm_st.level') }}：</div>
                        <div class="value">
                            <a-select v-model:value="form.level" :placeholder="$t('def.select')" allow-clear>
                                <a-select-option v-for="item of STORE_LEVEL" :key="item.key" :value="item.value">
                                    {{ lang === 'zh' ? item.zh : item.en }}
                                </a-select-option>
                            </a-select>
                        </div>
                    </div>
                    <!-- 区域 -->
                    <div class="form-item required">
                        <div class="key">{{ $t('crm_c.group') }}：</div>
                        <div class="value">
                            <a-select v-model:value="form.group_id" :placeholder="$t('def.select')" allowClear>
                                <!-- <a-select-option :value="0">
                                    {{ lang === "zh" ? "全部" : "all" }}
                                </a-select-option> -->
                                <a-select-option v-for="item of regionsList" :key="item.id" :value="item.value">{{
                                    item.name
                                }}</a-select-option>
                            </a-select>
                        </div>
                    </div>
                    <!-- 城市 
                    <div class="form-item">
                        <div class="key">{{ $t('crm_o.city') }}：</div>
                        <div class="value">
                            <a-select v-model:value="form.group_id" :placeholder="$t('def.select')" allowClear>
                                
                                <a-select-option v-for="item of regionsList" :key="item.id" :value="item.value">{{
                                    item.name
                                }}</a-select-option>
                            </a-select>
                        </div>
                    </div>
                    -->

                    <!-- 城市 -->
                    <div class="form-item required">
                        <div class="key">{{ $t('crm_o.city') }}：</div>
                        <div class="value">
                            <!-- <China2Address @search="handleOtherSearch" :defArea="[form.province, form.city]" -->
                            <!-- ref='CountryCascader' /> -->
                            <a-select
                                v-model:value="form.city"
                                :disabled="form.group_id == undefined"
                                :placeholder="$t('def.select')"
                                allowClear
                            >
                                <a-select-option v-for="item of cityList" :key="item.id" :value="item.city">{{
                                    item.city
                                }}</a-select-option>
                            </a-select>
                        </div>
                    </div>

                    <!-- 详细地址 -->
                    <div class="form-item required">
                        <div class="key">{{ $t('crm_c.address') }}：</div>
                        <div class="value">
                            <a-input v-model:value="form.address" :placeholder="$t('def.input')" />
                        </div>
                    </div>
                    <!-- 营业状态 -->
                    <div class="form-item required">
                        <div class="key">{{ $t('crm_st.status') }}：</div>
                        <div class="value">
                            <a-select v-model:value="form.status" :placeholder="$t('def.select')" allow-clear>
                                <a-select-option v-for="item of STORE_STATUS" :key="item.key" :value="item.value">
                                    {{ lang === 'zh' ? item.zh : item.en }}
                                </a-select-option>
                            </a-select>
                        </div>
                    </div>
                    <!-- 开业时间 -->
                    <div class="form-item">
                        <div class="key">{{ $t('crm_st.open_time') }}：</div>
                        <div class="value">
                            <a-date-picker
                                v-model:value="form.open_time"
                                :show-time="{
                                    hideDisabledOptions: true,
                                }"
                                valueFormat="YYYY-MM-DD"
                            />
                        </div>
                    </div>

                    <!-- 营业时间 -->
                    <div class="form-item">
                        <div class="key">{{ $t('dis.business_hours') }}：</div>
                        <div class="value">
                            <a-time-range-picker v-model:value="form.business_time" valueFormat="HH:mm:ss" />
                        </div>
                    </div>

                    <!-- 联系手机 -->
                    <div class="form-item">
                        <div class="key">{{ $t('crm_st.con_phone') }}：</div>
                        <div class="value">
                            <a-input v-model:value="form.contact_phone" :placeholder="$t('def.input')" />
                        </div>
                    </div>

                    <!-- 联系邮箱 -->
                    <div class="form-item">
                        <div class="key">{{ $t('crm_st.con_email') }}：</div>
                        <div class="value">
                            <a-input v-model:value="form.contact_email" :placeholder="$t('def.input')" />
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
                    <div class="form-item">
                        <div class="key">{{ $t('crm_st.sto_area') }}：</div>
                        <div class="value">
                            <a-input v-model:value="form.square" :placeholder="$t('def.input')" />
                        </div>
                    </div>
                    <!-- 车位数 -->
                    <div class="form-item">
                        <div class="key">{{ $t('crm_st.park_space') }}：</div>
                        <div class="value">
                            <a-input-number v-model:value="all_park_count" disabled style="width: 100%" />
                        </div>
                    </div>

                    <!-- 地上车位 -->
                    <div class="form-item">
                        <div class="key">{{ $t('crm_st.above_ground_park') }}：</div>
                        <div class="value">
                            <a-input-number
                                v-model:value="form.ground_park_count"
                                style="width: 100%"
                                :placeholder="$t('def.input')"
                                :min="0"
                            />
                        </div>
                    </div>

                    <!-- 地下车位 -->
                    <div class="form-item">
                        <div class="key">{{ $t('crm_st.under_ground_park') }}：</div>
                        <div class="value">
                            <a-input-number
                                v-model:value="form.underground_park_count"
                                style="width: 100%"
                                :placeholder="$t('def.input')"
                                :min="0"
                            />
                        </div>
                    </div>

                    <!-- 充电桩数 -->
                    <div class="form-item">
                        <div class="key">{{ $t('crm_st.charg_station') }}：</div>
                        <div class="value">
                            <a-input-number v-model:value="all_charge_pile_count" disabled style="width: 100%" />
                        </div>
                    </div>

                    <!-- 地上充电桩数 -->
                    <div class="form-item">
                        <div class="key">{{ $t('crm_st.above_charg_station') }}：</div>
                        <div class="value">
                            <a-input-number
                                v-model:value="form.ground_charge_pile_count"
                                style="width: 100%"
                                :placeholder="$t('def.input')"
                                :min="0"
                            />
                        </div>
                    </div>

                    <!-- 地下充电桩数 -->
                    <div class="form-item">
                        <div class="key">{{ $t('crm_st.under_charg_station') }}：</div>
                        <div class="value">
                            <a-input-number
                                v-model:value="form.underground_charge_pile_count"
                                style="width: 100%"
                                :placeholder="$t('def.input')"
                                :min="0"
                            />
                        </div>
                    </div>

                    <!-- 经度 -->
                    <div class="form-item">
                        <div class="key">{{ $t('crm_st.longitude') }}：</div>
                        <div class="value">
                            <a-input v-model:value="form.localtion.longitude" :placeholder="$t('def.input')" />
                        </div>
                    </div>

                    <!-- 纬度 -->
                    <div class="form-item">
                        <div class="key">{{ $t('crm_st.latitude') }}：</div>
                        <div class="value">
                            <a-input v-model:value="form.localtion.latitude" :placeholder="$t('def.input')" />
                        </div>
                    </div>
                </div>
            </div>

            <!-- 门店人员 -->
            <div class="form-block">
                <div class="form-title" style="margin-right: 20px">
                    <div class="title-colorful">{{ $t('s.sto_person') }}</div>
                </div>

                <div class="form-content">
                    <!-- 门店人员-表格 -->
                    <CrmEditStorePeo :id="form.id" :isMan="true" @userid="getUserId" />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Core from '../../../core';
import CrmEditStorePeo from '../../../components/crm/panel/CrmEditStorePeo.vue';
import China2Address from '@/components/common/China2Address.vue';
import dayjs from 'dayjs';

export default {
    name: 'store-edit',
    data() {
        return {
            // 请求（回显）表单
            form: {
                id: '', //店铺主键id 传递时更新
                name: '',
                logo: '', //logo--img
                type: undefined,
                level: undefined,
                province: '',
                city: undefined,
                address: '',
                status: undefined,
                open_time: '',
                business_time: '',
                contact_email: '',
                contact_phone: '',
                group_id: '',
                square: '', // 面积
                ground_park_count: '', // 地上停车位数量
                underground_park_count: '', //地下停车位数量
                ground_charge_pile_count: '', // 地上充电桩数量
                underground_charge_pile_count: '', //地下充电桩数量

                localtion: {
                    latitude: '', // 纬度
                    longitude: '', // 经度
                },
                user_id: '', //店长用户id
            },

            STORE_STATUS: Core.Const.RETAIL.STORE_STATUS, // 门店状态
            STORE_LEVEL: Core.Const.RETAIL.STORE_LEVEL, // 门店等级
            STORE_TYPE: Core.Const.RETAIL.STORE_TYPE, // 门店类型
            // 区域列表
            regionsList: [],
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
                    type: 'img',
                },
            },
            trackRecordForm: {
                image_attachment_list: [],
            },
            loading: false,
        };
    },
    watch: {
        form: {
            deep: true,
            handler(oldValue, newValue) {
                console.log('searchForm', oldValue, newValue);
                if (newValue.group_id == undefined || oldValue.group_id != newValue.group_id) {
                    this.form.city = undefined;
                }
                console.log('newValue.group_id', newValue.group_id);
            },
        },
    },
    computed: {
        // 总充电桩数
        all_charge_pile_count() {
            return this.form.ground_charge_pile_count + this.form.underground_charge_pile_count;
        },
        // 总车位数
        all_park_count() {
            return this.form.ground_park_count + this.form.underground_park_count;
        },
        lang() {
            return this.$store.state.lang;
        },
        // 区域城市
        cityList() {
            let list = [];
            list = this.regionsList.filter(el => {
                return this.form.group_id == el.id;
            });
            return list[0]?.city_list || [];
        },
    },
    components: {
        China2Address,
        CrmEditStorePeo,
    },
    mounted() {
        this.form.id = Number(this.$route.query.id) || 0;
        if (this.form.id) {
            this.getStoreDetail();
        }
        this.getRegionsData();
    },
    methods: {
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
                console.log('imageAttachment', imageAttachment);
            }
            console.log(
                'file----1212',
                file,
                'this.trackRecordForm.image_attachment_list',
                this.trackRecordForm.image_attachment_list,
            );
            // 删除的时候
            if (file.status == 'removed') {
                this.trackRecordForm.image_attachment_list = this.trackRecordForm.image_attachment_list.filter(el => {
                    return el.uid != file.uid;
                });
            }

            this.upload.detailList = fileList;
        },
        // 获取区域
        getRegionsData() {
            Core.Api.RETAIL.regionsList({
                key: '',
            })
                .then(res => {
                    console.log('getRegionsData res:', res);
                    this.regionsList = res.list;
                })
                .catch(err => {
                    console.log('getRegionsData err:', err);
                });
        },
        // 保存
        handelSave() {
            console.log('保存', this.form);
            let form = Core.Util.deepCopy(this.form);
            let time = {
                time: {
                    morning: { begin: '', end: '' },
                    afternoon: { begin: '', end: '' },
                },
            };
            time.time.morning.begin = form.business_time?.[0];
            time.time.afternoon.end = form.business_time?.[1];
            form.business_time = JSON.stringify(time);
            form.localtion = JSON.stringify(form.localtion);

            if (this.trackRecordForm.image_attachment_list.length) {
                form.logo = JSON.stringify(this.trackRecordForm.image_attachment_list[0]);
                // form.logo = this.trackRecordForm.image_attachment_list[0].path;
            } else {
                form.logo = '';
            }
            form.open_time = form.open_time ? dayjs(form.open_time).unix() : '';
            // form.open_time = form.open_time ? dayjs.unix(form.open_time[0]).format("YYYY-MM-DD") : undefined // 日期转时间戳
            console.log('保存form', form);
            if (!form.name) {
                return this.$message.warning(this.$t('def.enter'));
            } else if (!form.type) {
                return this.$message.warning(this.$t('def.enter'));
            } else if (!form.level) {
                return this.$message.warning(this.$t('def.enter'));
            } else if (!form.group_id) {
                return this.$message.warning(this.$t('def.enter'));
            } else if (!form.city && !form.address) {
                return this.$message.warning(this.$t('def.enter'));
            } else if (!form.square) {
                form.square = 0;
            }

            if (!form.status) {
                return this.$message.warning(this.$t('def.enter'));
            }
            const age = /^[0-9]*$/;
            console.log(age.test(form.square));
            if (!age.test(form.square)) {
                return this.$message.warning(this.$t('crm_st.square_text'));
            }
            //判断面积是否为空
            form.square === '' ? (form.square = 0) : '';
            Core.Api.RETAIL.editStore(form)
                .then(res => {
                    this.$message.success(this.$t('pop_up.save_success'));
                    this.routerChange('back');
                    console.log('保存完成', res);
                })
                .catch(err => {
                    console.log('editStore err:', err);
                })
                .finally(() => {});
        },
        routerChange(type, item) {
            switch (type) {
                case 'back': // 详情
                    let routeUrl = this.$router.resolve({
                        path: '/stores-vehicle/stores-list',
                    });
                    window.open(routeUrl.href, '_self');
                    break;
                /*   case 'back':
                  this.$router.go(-1)
                  break;  */
            }
        },

        /*  handleOtherSearch(params) {
             console.log('params---------store-list', params);
             for (const key in params) {
                 this.form[key] = params[key]
             }
         }, */
        getUserId(data) {
            console.log('getUserId', data);
            this.form.user_id = data;
        },

        // 获取门店详情
        getStoreDetail() {
            this.loading = true;
            Core.Api.RETAIL.storeDetail({
                id: this.form.id,
            })
                .then(res => {
                    console.log('getStoreDetail res:', res);
                    let d = res;
                    d.open_time = d.open_time ? dayjs.unix(d.open_time).format('YYYY-MM-DD') : undefined;
                    d.business_time = d.business_time
                        ? [
                              JSON.parse(d.business_time).time.morning.begin,
                              JSON.parse(d.business_time).time.afternoon.end,
                          ]
                        : undefined;
                    d.localtion = d.localtion
                        ? JSON.parse(d.localtion)
                        : {
                              latitude: '', // 纬度
                              longitude: '', // 经度
                          };
                    let obj_img = d.logo ? JSON.parse(d.logo) : '';
                    if (obj_img) {
                        this.trackRecordForm.image_attachment_list.push(obj_img);
                    }

                    // 让编辑文件显示
                    this.trackRecordForm.image_attachment_list.forEach(el => {
                        this.upload.detailList.push({
                            uid: el.uid,
                            name: el.name,
                            url: Core.Const.NET.FILE_URL_PREFIX + el.path,
                        });
                    });
                    for (const key in this.form) {
                        if (d[key] !== 0) {
                            this.form[key] = d[key];
                        } else {
                            this.form[key] = undefined;
                        }
                    }

                    console.log('this.form', this.form, 'd', d);
                })
                .catch(err => {
                    console.log('getStoreDetail err:', err);
                })
                .finally(() => {
                    this.loading = false;
                });
        },
    },
};
</script>

<style lang="less" scoped>
.edit-container {
    .form-block {
        // background: #FFF;
    }
    .key {
        width: 120px !important;
        text-align: right;
        padding-right: 20px !important;
        box-sizing: border-box;
    }
}
.form-content {
    width: 100%;
    padding-right: 10%;
}
</style>
