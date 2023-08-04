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
                    <!--    <a-tree show-line :tree-data="addressOptions" :fieldNames="{ title: 'name', key: 'name' }">
                    </a-tree> -->
                </div>
            </div>
        </a-drawer>
    </template>
    <template v-if="showAddPop">
        <a-modal v-model:visible="showAddPop" :title="$t('crm_st.add_city')" :width="360">
            <div class="aa">
                <a-tree show-line :tree-data="addressOptions" :fieldNames="{ title: 'name', key: 'name' }" checkable
                v-model:checkedKeys="checkedKeys" v-model:selectedKeys="selectedKeys" @check="checkCity">

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
            checkedKeys: ["甘肃省"],
            selectedKeys:['甘肃省']
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
        /*  checkedKeys() {
             let listCheck = [], listDisable = [];
             this.cityNowList.forEach((el, ind) => {
                 if (!el.select) {
                     listCheck.push(el.city);
                 } else {
                     listDisable.push(el.city)
                 }
             })
             console.log('checkedKeys', listCheck, listDisable);
             
             return { listCheck, listDisable }
         }, */
        /*   addressOptionsIntegList() {
              let list = [];
              console.log('this.checkedKeys.listDisable',this.checkedKeys.listDisable);
              list = this.addressOptions.map(($1, ind) => {
                  $1.children.forEach($2 => {
                      if (this.checkedKeys.listDisable.includes($2.name)) {
                          $2.disableCheckbox = true;
                          $1.disabled = true;
                          console.log('$2.name',$2.name,$2);
                      }
                  })
                  return $1;
              })
  
              console.log('list--------------addressOptionsIntegList', list);
              return list;
          } */
    },
    mounted() {
        this.getRoughlyAddressList();
    },
    methods: {

        showAddCity() {
            this.showAddPop = true;
        },
        handleModalShow() {
            this.isDrawer = true;
            console.log('this.isDrawer-----------------this.isDrawer', this.isDrawer);
            this.getList()
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
            if (!e.checked) {

            }
        },
       /*  getList() {
            let listCheck = [];
            this.cityNowList.forEach((el, ind) => {
                if (!el.select) {
                    listCheck.push(el.city);
                }
            })
            this.checkedKeys = listCheck;
        } */

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