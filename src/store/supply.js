import Core from '@/core';

// ’供应链相关
export const SUPPLY_CHAIN = {
    namespaced: true,
    state: {
        // 供应链存储-真数据/校验通过
        supplyChain: !Core.Data.getSupplyChain() ? {} : JSON.parse(Core.Data.getSupplyChain()),
        // 供应链存储-草稿数据
        supplyDraftChain: !Core.Data.getSupplyDraftChain() ? {} : JSON.parse(Core.Data.getSupplyDraftChain()),
        // 第几步
        step: !Core.Data.getStep() ? 0 : Core.Data.getStep(),
        // 是否已经阅读了
        isRead: !Core.Data.getRead() ? false : Core.Data.getRead(),
        // 是否已经 提交了
        isSubmitEd: !Core.Data.getSubmitEd() ? false : Core.Data.getSubmitEd(),
    },
    mutations: {
        // 供应链存储-真数据/校验通过
        setSupplyChain(state, value) {
            state.supplyChain = value;
            // 判断是否为json
            if (typeof value == 'object') {
                Core.Data.setSupplyChain(JSON.stringify(value));
            }
            // 如果为字符串，直接存储
            if (typeof value == 'string') {
                Core.Data.setSupplyChain(value);
            }
        },
        // 供应链存储-草稿数据
        setSupplyDraftChain(state, value) {
            state.supplyDraftChain = value;
            // 判断是否为json
            if (typeof value == 'object') {
                Core.Data.setSupplyDraftChain(JSON.stringify(value));
            }
            // 如果为字符串，直接存储
            if (typeof value == 'string') {
                Core.Data.setSupplyDraftChain(value);
            }
        },
        // 设置第几步
        setStep(state, value) {
            state.step = value;
            Core.Data.setStep(value);
        },
        // 设置是否已经阅读
        setRead(state, value) {
            state.isRead = value;
            Core.Data.setRead(value);
        },
        // 是否已经 提交了
        setSubmitEd(state, value) {
            state.isSubmitEd = value;
            Core.Data.setSubmitEd(value);
        },
    },
    actions: {
        // 供应链存储-真数据/校验通过
        setSupplyChain({ commit }, value) {
            commit('setSupplyChain', value);
        },
        // 供应链存储-草稿数据
        setSupplyDraftChain({ commit }, value) {
            commit('setSupplyDraftChain', value);
        },
        // 设置第几步
        setStep({ commit }, value) {
            commit('setStep', value);
        },
        // 上一步，一共2步
        prevStep({ commit }) {
            let step = Core.Data.getStep() || 0;
            if (step == 0) return;
            step--;
            commit('setStep', step);
        },
        // 下一步
        nextStep({ commit }) {
            let step = Core.Data.getStep() || 0;
            if (step == 2) return;
            step++;
            commit('setStep', step);
        },
        // 设置是否已经阅读
        setRead({ commit }, value) {
            commit('setRead', value);
        },
        // 是否已经 提交了
        setSubmitEd({ commit }, value) {
            commit('setSubmitEd', value);
        },
        // 清空所有数据
        clearAll({ commit }) {
            commit('setSupplyChain', {});
            commit('setSupplyDraftChain', {});
            commit('setStep', 0);
            commit('setRead', false);
            commit('setSubmitEd', false);
        },
    },
    getters: {
        isSubmitEd: state => state.isSubmitEd,
        SETP: state => state.step,
        ISREAD: state => state.isRead,
        supplyType: state => state?.supplyChain?.form?.type ?? undefined,
    },
};
