import request from '@/utils/request'

const controller = '/zjzx-article/article_comment'

export default {
	/**
	 * 获取评论/回复详情
	 * @param  { itemid:"评论/回复id" } query [description]
	 * @return {[type]}      [description]
	 */
	getCommentById(itemid) {
		return request({
			url: controller + '/getCommentById',
			params: { itemid }
		})
	}
}
