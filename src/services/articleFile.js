import request from '@/utils/request'
import configPath from '@/configs/path'

const controller = '/zjzx-article/article_file'

export default {

	/**
	 * 根据文章id获取附件信息
	 * @return {[promise]}     [axios]
	 */
	getFileByArticle(articleid) {
		return request ({
      url: controller + '/getFileByArticle',
      params: { articleid }
    })
	},

}
