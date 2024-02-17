<template>
    <a-button class="CreateArea" type="primary" @click.stop="handleModalShow" v-if="!id">
        <slot>{{ $t('s.create_area') }}</slot>
    </a-button>

    <a-button v-else type="link" @click="handleModalShow">{{ $t('def.edit') }}</a-button>
    <template v-if="isDrawer && !showAddPop">
        <a-drawer
            v-model:visible="isDrawer"
            class="custom-class"
            :closable="false"
            placement="right"
            :footer-style="{ textAlign: 'right' }"
            width="400"
        >
            <template #title>
                <div class="title">
                    <div>{{ id ? $t('crm_region.edit') : $t('s.create_area') }}</div>
                    <div class="close" @click="closeClick">
                        <close-outlined />
                    </div>
                </div>
            </template>

            <div class="title-info">
                {{ $t('crm_region.region_info') }}
            </div>

            <div class="form-item required region-con">
                <div class="key">
                    {{ $t('crm_region.name') }}
                </div>
                <div class="value">
                    <a-input :placeholder="$t('s.search_place')" v-model:value="regionalName" />
                </div>
            </div>

            <div class="danger-text" v-if="messageText.length">
                {{ messageText }}
            </div>
            <div class="region-tree form-item">
                <div class="key" style="height: 32px; line-height: 32px">
                    {{ $t('crm_region.city') }}
                </div>
                <div class="value">
                    <div class="add-city" @click="showAddCity">
                        {{ $t('crm_st.add_city') }}
                    </div>
                    <a-tree
                        show-line
                        :tree-data="nowAddressList"
                        defaultExpandAll
                        :fieldNames="{ title: 'name', key: 'name' }"
                    >
                    </a-tree>
                </div>
            </div>

            <template #footer>
                <a-button type="primary" @click="saveRegional">{{ $t('retail.save') }}</a-button>
            </template>
        </a-drawer>
    </template>
    <template v-if="showAddPop">
        <a-modal v-model:visible="showAddPop" :title="$t('crm_st.add_city')" :width="360" @ok="addCityOk">
            <div class="aa">
                <a-tree
                    show-line
                    :tree-data="addressOptions"
                    :fieldNames="{ title: 'name', key: 'name' }"
                    checkable
                    v-model:checkedKeys="checkedAddCity"
                >
                </a-tree>
            </div>
        </a-modal>
    </template>
</template>

<script>
import { CloseOutlined, CarryOutOutlined } from '@ant-design/icons-vue';
import axios from 'axios';
import Core from '../../../../core';

export default {
    name: 'CreateArea',
    data() {
        return {
            // 区域名称
            regionalName: '',
            // 请求区域名称相同提示文字
            messageText: '',
            isDrawer: false,
            addressOptions: [],
            showAddPop: false,
            cityNowList: [],
            // 接口传来选中-选项
            checkedKeys: [],
            // 现有选中情况-变化-添加城市点击情况记录
            checkedAddCity: [],
            // 所有的一级目录
            appOneKey: [],
        };
    },
    components: {
        CloseOutlined,
        CarryOutOutlined,
    },
    props: {
        id: {
            type: Number,
            default: 0,
        },
    },
    watch: {
        regionalName(newvalue, oldValue) {
            this.messageText = '';
        },
    },
    computed: {
        // 初始化已有城市树形结构
        nowAddressList() {
            let list = [];
            this.addressOptions.forEach(el1 => {
                this.appOneKey.push(el1.name);
                if (el1.children.filter(el2 => this.checkedKeys.includes(el2.name)).length > 0)
                    list.push({
                        key: el1.name,
                        name: el1.name,
                        children: el1.children.filter(el2 => this.checkedKeys.includes(el2.name)),
                    });
            });
            return list;
        },
    },
    mounted() {},
    methods: {
        // 点击添加城市-按钮
        showAddCity() {
            this.showAddPop = true;
            this.checkedAddCity = [...this.checkedKeys];
        },
        // 显示城市按钮
        handleModalShow() {
            this.isDrawer = true;
            // 获取城市列表
            let url = '/ext/China.json';
            axios.get(url).then(response => {
                this.addressOptions = response.data;
                this.getList();
            });
        },

        closeClick() {
            this.isDrawer = false;
        },
        // 选择复选框
        // checkCity(checkkeys, e) {
        // let posList = [], key = e.node.key;
        // posList = e.node.pos.split('-');

        /*   if (e.checked && posList.length == 2) {
              console.log('添加一级目录所有城市', e.node.key);
              this.updateList(1, key);
          } else if (e.checked && posList.length == 3) {
              // 添加二级目录单个城市
              console.log('添加二级目录单个城市', e.node.key);
              console.log('checkedAddCity-------------111111111', this.checkedAddCity);
              this.updateList(2, key);
 
          } else if (!e.checked && posList.length == 2) {
              // 去除一级目录所有城市
              console.log('去除一级目录所有城市', e.node.key);
              this.updateList(3, key);
 
          } else if (!e.checked && posList.length == 3) {
              console.log('去除二级目录单个城市', e.node.key);
              this.updateList(4, key);
 
          } */
        // console.log('checkedAddCity-------------', this.checkedAddCity);
        // },
        // 选中城市情况
        /*         updateList(type, key) {
                    console.log('type, key', type, key, 'this.checkedAddCity', this.checkedAddCity);
                    let list = [];
                    if (type == 1) {
                        // type=1 添加一级目录所有城市(防重复添加)
                        this.addressOptions.map(el => {
                            if (el.name == key) {
                                el.children.forEach(el2 => {
                                    if (!this.checkedAddCity.includes(el2.name)) {
                                        this.checkedAddCity.push(el2.name);
                                    }
                                })
                            }
                        })
                    } else if (type == 2) {
                        // if (!this.checkedAddCity.includes(key)) {
                        this.checkedAddCity.push(key);
                        console.log('checkedAddCity-------------9999', this.checkedAddCity);
                        // }
                    } else if (type == 3) {
                        // type=3 去除一级目录所有城市(防重复添加)
                        this.addressOptions.map(el => {
                            if (el.name == key) {
                                list = el.children.map(el2 => el2.name)
                                this.checkedAddCity = this.checkedAddCity.filter(item => !list.includes(item))
                            }
                        })
                    } else if (type == 4) {
                        this.checkedAddCity = this.checkedAddCity.filter(item => item != key);
                    }
        
                }, */
        // 获取区域详情
        async getRegionalDetail() {
            await Core.Api.RETAIL.detailRegion({
                id: this.id,
            })
                .then(res => {
                    console.log('getRegionalDetail res:', res);
                    this.cityNowList = res.city_list;
                    this.regionalName = res.name;
                })
                .catch(err => {
                    console.log('getRegionalDetail err:', err);
                });
        },
        // 获取列表
        async getList() {
            await this.getRegionalDetail();
            let listCheck = [];
            let listDisable = [];

            this.cityNowList.forEach((el, ind) => {
                if (!el.select) {
                    listCheck.push(el.city);
                } else {
                    listDisable.push(el.city);
                }
            });
            this.checkedKeys = [...listCheck];
            this.checkedAddCity = [...listCheck];
            this.addressOptions = this.addressOptions.map(($1, ind) => {
                $1.children.forEach($2 => {
                    if (listDisable.includes($2.name)) {
                        $2.disableCheckbox = true;
                        $1.disabled = true;
                    }
                });
                return $1;
            });
        },
        // 点击保存添加城市
        addCityOk() {
            this.showAddPop = false;
            this.checkedAddCity = this.checkedAddCity.filter((item, index) => {
                return !this.appOneKey.includes(item);
            });

            // 发送请求?
            this.checkedKeys = [...this.checkedAddCity];
        },
        // 保存区域编辑
        saveRegional() {
            /* if (!this.checkedKeys.length) {
        return this.$message.warning(this.$t("def.enter"));
      } */
            if (!this.regionalName) {
                return this.$message.warning(this.$t('def.enter'));
            }
            // debugger:
            Core.Api.RETAIL.saveRegion({
                id: this.id,
                name: this.regionalName,
                city_list: this.checkedKeys,
            })
                .then(res => {
                    this.$message.success(this.$t('pop_up.save_success'));
                    console.log('saveRegional res:', res);
                    this.$emit('refreshc');
                    this.isDrawer = false;
                })
                .catch(err => {
                    console.log('saveRegional err:', err?.data?.message);
                    this.messageText = err?.data?.message;
                });
        },
    },
};
</script>

<style lang="less" scoped>
.title {
    .fac(space-between);
    color: var(--color-text-1, #1d2129);
    text-align: justify;
    font-family: PingFang SC;
    font-size: 18px;
    font-style: normal;
    font-weight: 600;
    line-height: normal;
    letter-spacing: 0.167px;
}

.close {
    cursor: pointer;
    padding: 2px;
}

.title-info {
    color: var(--color-text-1, #1d2129);
    font-family: PingFang SC;
    font-size: 16px;
    font-style: normal;
    font-weight: 600;
    line-height: normal;
}

.region-con {
    height: 32px;
    margin-top: 20px;
}

.danger-text {
    margin-top: -8px;
    color: var(--color-danger-6, #f53f3f);
    font-family: PingFang SC;
    font-size: 12px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
    box-sizing: border-box;
    padding-left: 111px;
}

.region-tree {
    .fsb(flex-start);
    margin-top: 20px;
}

:deep(.ant-tree-checkbox) {
    position: absolute;
    right: 0;
}

:deep(.ant-tree-switcher-noop) {
    // display: none;
    visibility: hidden;
}

:deep(.ant-tree-indent) {
    visibility: hidden;
}

.add-city {
    width: 80px;
    height: 32px;
    border-radius: 4px;
    border: 1px solid var(--brand-6, #0061ff);
    line-height: 32px;
    text-align: center;
    box-sizing: border-box;

    color: var(--brand-6, #0061ff);
    font-family: PingFang SC;
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    margin-bottom: 20px;
    cursor: pointer;
}

.aa {
    :deep(.ant-tree-checkbox) {
        position: absolute;
        right: 0;
    }

    :deep(.ant-tree-switcher-noop) {
        // display: none;
        visibility: hidden;
    }

    :deep(.ant-tree-indent) {
        visibility: hidden;
    }
}

:deep(.ant-tree-node-selected) {
    background: #fff !important;
}
</style>
