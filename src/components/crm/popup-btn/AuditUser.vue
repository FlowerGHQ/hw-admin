<template>
    <a-steps :current="999">
        <a-step v-for="(item, index) in auditUserList">
            <template #icon>
                <user-outlined />
            </template>
            <template #title>
                {{ item.name }}
                <a-button type="link" class="danger" @click="handleDeleteCustomer(index)" v-if="$auth('crm-bo.save')"
                    ><i class="icon i_close_c" />
                </a-button>
            </template>
        </a-step>

        <a-step status="finish">
            <template #icon>
                <UserSelect
                    @select="handleAddCustomerShow"
                    :group-id="groupId"
                    :radioMode="true"
                    btn-class="select-item-btn"
                    btnType="link"
                    :btnText="btnText"
                >
                    <i class="icon i_edit" /> {{ btnText }}
                </UserSelect>
            </template>
        </a-step>
    </a-steps>
</template>

<script>
import Core from '@/core';

import UserSelect from '@/components/crm/popup-btn/UserSelect.vue';

import { UserOutlined } from '@ant-design/icons-vue';

export default {
    components: {
        UserOutlined,
        UserSelect,
    },
    emits: ['select', 'option'],
    props: {
        defAuditUserList: {
            type: Array,
            default: () => {
                return [];
            },
        },
        btnText: {
            type: String,
            default: '审核人',
        },
        groupId: {
            type: Number,
            default: 0,
        },
    },
    data() {
        return {
            Core,
            loading: false,
            modalShow: false,

            auditUserIdList: [],
            auditUserList: [],
        };
    },
    watch: {
        defAuditUserList: function (n) {
            console.log('handleAddCustomerShow auditUserList', this.defAuditUserList);
            this.auditUserList = Core.Util.deepCopy(this.defAuditUserList);
        },
    },
    computed: {},
    created() {},
    mounted() {},
    methods: {
        // 添加联系人
        handleAddCustomerShow(ids, items) {
            // this.auditUserIdList.push(ids[0])
            this.auditUserList.push(items[0]);
            console.log('handleAddCustomerShow auditUserList', items[0]);
            this.$emit('list', this.auditUserList);
        },
        handleDeleteCustomer(index) {
            // this.auditUserIdList.splice(index, 1)
            console.log('handleDeleteCustomer index', index);
            this.auditUserList.splice(index, 1);
            console.log('handleDeleteCustomer auditUserList', this.auditUserList);
            this.$emit('list', this.auditUserList);
        },
    },
};
</script>
