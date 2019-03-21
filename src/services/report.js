import request from '@/utils/request'

const controller = '/zjzx-system/report'

export default {
	/**
	 * 获取举报列表
	 * @param  { page:”当前页” size：”分页大小” Keyword:”关键字”	} query [description]
	 * @return {[type]}      [description]
	 */
	getReportPage(query) {
		return request({
			url: controller + '/getReportPage',
			params: query
		})
	},
	
	/**
	 * 举报回复
	 * @param  {reportid:”举报id” reply:”回复信息”} reply [description]
	 * @return {[type]}     [description]
	 */
	reportReply(reply) {
		return request({
			url: controller + '/reportReply',
			method: 'post',
			data: {
				reportid: reply.id,
				reply: reply.content
			}
		})
	},
	/**
	 * 举报删除
	 * @param  {[type]} ids [”记录ids数组”]
	 * @return {[type]}          [description]
	 */
	deleteReports(ids) {
		return request({
			url: controller + '/deleteReports',
			method: 'post',
			data: { ids }
		})
	}
}
