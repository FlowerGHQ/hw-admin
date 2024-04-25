import Core from '@/core';

// 平台端权限
export const ADMIN_AUTH_TAB = {
    namespaced: true,
    state: {
        TABPOSITION: Core.Data.getTabPosition()?.tabPosition || null,
        SHOWCLASSIFY: null
    },
    mutations: {       
        SETTABPOSITION(state, value) {
            state.TABPOSITION = value?.tabPosition;            
            Core.Data.setTabPosition(value);
        },
        SETSHOWCLASSIFY(state, value) {
            state.SHOWCLASSIFY = value;
        },
    },
    actions: {        
    },
    getters: {
      
    },
};