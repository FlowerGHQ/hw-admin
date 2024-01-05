
import Core from '@/core'


// ’供应链相关
export const SUPPLY_CHAIN  = {
	namespaced: true,
	state:{
		// 供应链存储-真数据/校验通过
		supplyChain:Core.Data.getSupplyChain() === '' ? {} : JSON.parse(Core.Data.getSupplyChain()),
		// 供应链存储-草稿数据
		supplyDraftChain:Core.Data.getSupplyDraftChain() === '' ? {} :JSON.parse(Core.Data.getSupplyDraftChain()),
		// 供应链存储-详情数据
		supplyDetailsChain: Core.Data.getSupplyDetailsChain() === '' ? {} : JSON.parse(Core.Data.getSupplyDetailsChain()),
		// 第几步
		step:!Core.Data.getStep()? 0 : Core.Data.getStep(),
		// 是否已经阅读了
		isRead:!Core.Data.getRead()? false : Core.Data.getRead(),
	},
	mutations:{
		// 供应链存储-真数据/校验通过
		setSupplyChain(state,value){
			state.supplyChain = value
			Core.Data.setSupplyChain(value)
		},
		getSupplyChain(state){
			return state.supplyChain
		},
		// 供应链存储-草稿数据
		setSupplyDraftChain(state,value){
			state.supplyDraftChain = value
			Core.Data.setSupplyDraftChain(value)
		},
		getSupplyDraftChain(state){
			return state.supplyDraftChain
		},
		// 供应链存储-详情数据
		setSupplyDetailsChain(state,value){
			state.supplyDetailsChain = value
			Core.Data.setSupplyDetailsChain(value)
		},
		getSupplyDetailsChain(state){
			return state.supplyDetailsChain
		},
		// 设置第几步
		setStep(state,value){
			state.step = value
			Core.Data.setStep(value)
		},
		getStep(state){
			return state.step
		},
		// 设置是否已经阅读
		setRead(state,value){
			state.isRead = value
			Core.Data.setRead(value)
		},
		getRead(state){
			return state.isRead
		},
		
	},
	actions:{
		// 供应链存储-真数据/校验通过
		setSupplyChain({commit},value){
			commit('setSupplyChain',value)
		},
		getSupplyChain({commit}){
			commit('getSupplyChain')
		},
		// 供应链存储-草稿数据
		setSupplyDraftChain({commit},value){
			commit('setSupplyDraftChain',value)
		},
		getSupplyDraftChain({commit}){
			commit('getSupplyDraftChain')
		},
		// 供应链存储-详情数据
		setSupplyDetailsChain({commit},value){
			commit('setSupplyDetailsChain',value)
		},
		getSupplyDetailsChain({commit}){
			commit('getSupplyDetailsChain')
		},
		// 设置第几步
		setStep({commit},value){
			commit('setStep',value)
		},
		getStep({commit}){
			commit('getStep')
		},
		// 设置是否已经阅读
		setRead({commit},value){
			commit('setRead',value)
		},
		getRead({commit}){
			commit('getRead')
		}
	},
	getters:{
		isSubmitEd:state => Object.keys(state.supplyDetailsChain).length > 0 ? true : false,
	}
}