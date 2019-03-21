import request from '@/utils/request'

const controller = '/zjzx-article/article_classify'

export default {

	/**
	 * 获取文章分类列表
	 * @return {[promise]}     [axios]
	 */
	getArticleClassifyList() {
		return request ({
      url: controller + '/getArticleClassifyList',
    })
	},

}
