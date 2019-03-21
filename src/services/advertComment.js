import request from '@/utils/request'

const controller = '/zjzx-advert/advert_comment'

export default {

	/**
	 * [doAdvertComment 广告评论]
	 * @param  {[type]} advertId  [”广告id”]
	 * @param  {[type]} content   [”广告内容”]
	 * @param  {[type]} creatorId [”评论人id”]
	 * @return {[promise]}     [axios]
	 */
	doAdvertComment(advertId, content, creatorId) {
		return request ({
      url: controller + '/doAdvertComment',
      method: 'post',
      params: { advertId, content, creatorId }
    })
	},

	/**
	 * [getCommentPage 获取广告评论分页]
	 * @param  {[type]} advertId [广告id]
	 * @param  {[type]} page     [当前页]
	 * @param  {[type]} size     [分页大小]
	 * @return {[type]}          [description]
	 */
	getCommentPage(advertId, page, size) {
		return request ({
      url: controller + '/getCommentPage',
      method: 'post',
      params: { advertId, page, size }
    })
	}
}