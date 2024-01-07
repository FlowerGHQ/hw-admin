
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
		// 是否已经 提交了
		isSubmitEd:!Core.Data.getSubmitEd()? false : Core.Data.getSubmitEd(),
	},
	mutations:{
		// 供应链存储-真数据/校验通过
		setSupplyChain(state,value){
			state.supplyChain = value
			// 判断是否为json
			if (typeof value == 'object') {
				Core.Data.setSupplyChain(JSON.stringify(value))
			}
			// 如果为字符串，直接存储
			if (typeof value == 'string') {
				Core.Data.setSupplyChain(value)
			}
		},
		getSupplyChain(state){
			return state.supplyChain
		},
		// 供应链存储-草稿数据
		setSupplyDraftChain(state,value){
			state.supplyDraftChain = value
			// 判断是否为json
			if (typeof value == 'object') {
				Core.Data.setSupplyDraftChain(JSON.stringify(value))
			}
			// 如果为字符串，直接存储
			if (typeof value == 'string') {
				Core.Data.setSupplyDraftChain(value)
			}
		},
		getSupplyDraftChain(state){
			return state.supplyDraftChain
		},
		// 供应链存储-详情数据
		setSupplyDetailsChain(state,value){
			state.supplyDetailsChain = value
			// 判断是否为json
			if (typeof value == 'object') {
				Core.Data.setSupplyDetailsChain(JSON.stringify(value))
			}
			// 如果为字符串，直接存储
			if (typeof value == 'string') {
				Core.Data.setSupplyDetailsChain(value)
			}
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
		// 是否已经 提交了
		setSubmitEd(state,value){
			state.isSubmitEd = value
			Core.Data.setSubmitEd(value)
		},
		getSubmitEd(state){
			return state.isSubmitEd
		}
		
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
		// 上一步，一共2步
		prevStep({commit}){
			let step = Core.Data.getStep() || 0
			if (step == 0) return;
			step--;
			commit('setStep',step)
		},
		// 下一步
		nextStep({commit}){
			let step = Core.Data.getStep() || 0
			if (step == 2) return;
			step++;
			commit('setStep',step)
		},
		// 设置是否已经阅读
		setRead({commit},value){
			commit('setRead',value)
		},
		getRead({commit}){
			commit('getRead')
		},
		// 是否已经 提交了
		setSubmitEd({commit},value){
			commit('setSubmitEd',value)
		},
		getSubmitEd({commit}){
			commit('getSubmitEd')
		}
	},
	getters:{
		isSubmitEd:state => state.isSubmitEd,
		SETP : state => state.step,
		ISREAD : state => state.isRead,
	}
}