import request from '@/utils/request'

const controller = '/zjzx-system/feedback'

export default {

	/**
	 * 获取用户反馈
	 * @param  {[type]} userid [description]
	 * @return {[type]}        [description]
	 */
	getUserFeedBack(userid) {
		return request ({
      url: controller + '/getUserFeedBack',
      params: { userid }
    })
	},

	/**
	 * 获所有用户反馈
	 * @param  { page:"当前页", size:"分页大小" } query [description]
	 * @return {[type]}       [description]
	 */
	getFeedBackPage(query) {
		return request ({
      url: controller + '/getFeedBackPage',
      params: query
    })
	},

	/**
	 * 获所反馈详情
	 * @param  {[type]} recordid [记录id]
	 * @return {[type]}          [description]
	 */
	getFeedById(recordid) {
		return request ({
      url: controller + '/getFeedById',
      params: { recordid }
    })
	},

	/**
	 * 反馈回复
	 * @param  {[type]} feedid       [反馈id]
	 * @param  {[type]} replyContent [回复内容]
	 * @return {[type]}              [description]
	 */
	reply(reply) {
		return request ({
      url: controller + '/reply',
      method:'post',
      data: { 
      	feedid: reply.id, 
      	replyContent: reply.content 
      }
    })
	},

	/**
	 * 获取反馈图片
	 * @param  {[type]} recordid [:"记录id"]
	 * @return {[type]}          [description]
	 */
	getFeedImage(recordid) {
		return request ({
      url: controller + '/getFeedImage',
      params: { recordid }
    })
	},
}
