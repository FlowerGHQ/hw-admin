<template>
    <a-button class="CreateArea" type="primary" @click.stop="handleModalShow">
        <slot>{{ $t("s.create_area") }}</slot>
    </a-button>
    <template v-if="isDrawer && !showAddPop" class="modal-container">
        <a-drawer v-model:visible="isDrawer" class="custom-class" :closable="false" placement="right">
            <template #title>
                <div class="title">
                    <div>{{ $t('s.create_area') }}</div>
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
                    <a-input :placeholder="$t('s.search_place')" />
                </div>
            </div>

            <div class="region-tree form-item required ">
                <div class="key">
                    {{ $t('crm_region.name') }}
                </div>
                <div class="value">
                    <div class="add-city" @click="showAddCity">{{ $t('crm_st.add_city') }}</div>
                       <a-tree show-line :tree-data="nowAddressList" :fieldNames="{ title: 'name', key: 'name' }">
                    </a-tree>
                </div>
            </div>
        </a-drawer>
    </template>
    <template v-if="showAddPop">
        <a-modal v-model:visible="showAddPop" :title="$t('crm_st.add_city')" :width="360" @ok="addCityOk">
            <div class="aa">
                <a-tree show-line :tree-data="addressOptions" :fieldNames="{ title: 'name', key: 'name' }" checkable
                    v-model:checkedKeys="checkedAddCity" @check="checkCity">
                </a-tree>
            </div>
        </a-modal>
    </template>
</template>

<script>
import { CloseOutlined, CarryOutOutlined } from '@ant-design/icons-vue';
import axios from 'axios';

export default {

    name: "CreateArea",
    data() {
        return {

            isDrawer: false,
            addressOptions: '',
            showAddPop: false,
            cityNowList: [
                {
                    id: 1, // 关联区域信息表id
                    city: "北京",//城市名称
                    select: false   //已选择true,未选择false
                }, {
                    id: 2, // 关联区域信息表id
                    city: "唐山",//城市名称
                    select: true   //已选择true,未选择false
                }, {
                    id: 3, // 关联区域信息表id
                    city: "杭州市",//城市名称
                    select: false   //已选择true,未选择false
                }, {
                    id: 4, // 关联区域信息表id
                    city: "石家庄",//城市名称
                    select: true   //已选择true,未选择false
                }, {
                    id: 5, // 关联区域信息表id
                    city: "邢台",//城市名称
                    select: true   //已选择true,未选择false
                }, {
                    id: 6, // 关联区域信息表id
                    city: "沧州",//城市名称
                    select: false   //已选择true,未选择false
                }, {
                    id: 7, // 关联区域信息表id
                    city: "镇江市",//城市名称
                    select: false   //已选择true,未选择false
                }, {
                    id: 8, // 关联区域信息表id
                    city: "台州市",//城市名称
                    select: false   //已选择true,未选择false
                }, {
                    id: 9, // 关联区域信息表id
                    city: "香港",//城市名称
                    select: true   //已选择true,未选择false
                }
            ],
            // 接口传来选中-选项
            checkedKeys: [],
            // 现有选中情况-变化-添加城市点击情况记录
            checkedAddCity: []
        }
    },
    components: {
        CloseOutlined, CarryOutOutlined
    },
    props: {

    },
    watch: {

    },
    computed: {

        // 初始化已有城市树形结构
        nowAddressList() {
            let list = [];
            this.addressOptions.forEach(el1 => {
                if (el1.children.filter(el2 => this.checkedKeys.includes(el2.name)).length > 0)
                    list.push({
                        key:el1.name,
                        name:el1.name,
                        children: el1.children.filter(el2 => this.checkedKeys.includes(el2.name))
                    })
            })
            return list;
        }
    },
    mounted() {
        this.getRoughlyAddressList();
    },
    methods: {

        showAddCity() {
            this.showAddPop = true;
            this.checkedAddCity = [...this.checkedKeys]
        },
        handleModalShow() {
            this.isDrawer = true;
            console.log('this.isDrawer-----------------this.isDrawer', this.isDrawer);
            this.getList();
        },

        closeClick() {
            this.isDrawer = false;
        },
        // 获取 地址选择列表
        getRoughlyAddressList() {
            console.log('getRoughlyAddressList');
            let url = '/ext/China.json'
            axios.get(url).then(response => {
                this.addressOptions = response.data;
            })
        },
        // 选择复选框
        checkCity(checkkeys, e) {
            console.log('checkCity', checkkeys, e, 'pos', e.node.pos);
            let posList = [], key = e.node.key;
            posList = e.node.pos.split('-');
            console.log('postList', posList);
            if (e.checked && posList.length == 2) {
                console.log('添加一级目录所有城市', e.node.key);
                this.updateList(1, key);
            } else if (e.checked && posList.length == 3) {
                // 添加二级目录单个城市
                console.log('添加二级目录单个城市', e.node.key);
                this.updateList(2, key);

            } else if (!e.checked && posList.length == 2) {
                // 去除一级目录所有城市
                console.log('去除一级目录所有城市', e.node.key);
                this.updateList(3, key);

            } else if (!e.checked && posList.length == 3) {
                console.log('去除二级目录单个城市', e.node.key);
                this.updateList(4, key);

            }
        },
        // 选中城市情况
        updateList(type, key) {
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
                this.checkedAddCity.push(key);
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

        },

        getList() {
            let listCheck = [];
            let listDisable = [];
            this.cityNowList.forEach((el, ind) => {
                if (!el.select) {
                    listCheck.push(el.city);
                } else {
                    listDisable.push(el.city)
                }
            })
            this.checkedKeys = [...listCheck];
            this.checkedAddCity = [...listCheck];
            this.addressOptions = this.addressOptions.map(($1, ind) => {
                $1.children.forEach($2 => {
                    if (listDisable.includes($2.name)) {
                        $2.disableCheckbox = true;
                        $1.disabled = true;
                        console.log('$2.name', $2.name, $2);
                    }
                })
                return $1;
            })
        },
        // 点击保存添加城市
        addCityOk() {
            this.showAddPop = false;
            // 发送请求?
            this.checkedKeys = [...this.checkedAddCity]
        }

    }

}
</script>

<style lang="less" scoped>
.title {
    .fac(space-between);
    color: var(--color-text-1, #1D2129);
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
    color: var(--color-text-1, #1D2129);
    font-family: PingFang SC;
    font-size: 16px;
    font-style: normal;
    font-weight: 600;
    line-height: normal;
}

.region-con {
    height: 32px;
    margin: 20px 0px;
}

.region-tree {
    .fsb(flex-start);
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
    border: 1px solid var(--brand-6, #0061FF);
    line-height: 32px;
    text-align: center;
    box-sizing: border-box;

    color: var(--brand-6, #0061FF);
    font-family: PingFang SC;
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    margin-bottom: 20px;
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
</style>