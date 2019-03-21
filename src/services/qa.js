import request from '@/utils/request'

const controller = '/zjzx-system/interlocution'

export default {
	/**
	 * 获取问题详情
	 * @param  { itemid:“问题id” } query [description]
	 * @return {[type]}      [description]
	 */
	getQuestionById(itemid) {
		return request({
			url: controller + '/getQuestionById',
			params: { itemid }
		})
	}
}
