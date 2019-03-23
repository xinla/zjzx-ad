import request from '@/utils/request'

const controller = '/zjzx-article/article_classify'

export default {

	/**
	 * 获取文章分类列表(显示的)
	 * @return {[promise]}     [axios]
	 */
	getArticleClassifyList() {
		return request ({
      url: controller + '/getArticleClassifyList',
    })
	},

	/**
	 * 获取文章分类列表(所有的)
	 * @return {[promise]}     [axios]
	 */
	getAllClassifyList() {
		return request ({
      url: controller + '/getAllClassifyList',
    })
	},

	/**
	 * 添加文章分类
	 * @param {[type]} classifyname [分类名称]
	 */
	setClassify(classifyname) {
		return request ({
      url: controller + '/setClassify',
      params: { classifyname }
    })
	},

	/**
	 * 修改文章分类
	 * @param  {[type]} classifyname [被修改的记录id]
	 * @param  {[type]} classifyname [新的分类名称]
	 * @return {[type]}              [description]
	 */
	updateClassify(id, classifyname) {
		return request ({
      url: controller + '/updateClassify',
      params: { id, classifyname }
    })
	},

	/**
	 * 删除文章分类
	 * @param  {[type]} ids [”id1,id2....”]
	 * @return {[type]}     [description]
	 */
	deleteClassify(ids) {
		return request ({
      url: controller + '/deleteClassify',
      method: 'post',
      data: { ids }
    })
	},

	/**
	 * 隐藏文章分类
	 * @param  {[type]} ids [description]
	 * @return {[type]}     [description]
	 */
	hideClassify(ids) {
		return request ({
      url: controller + '/hideClassify',
      method: 'post',
      data: { ids }
    })
	},

	/**
	 * 显示文章分类
	 * @param  {[type]} ids [description]
	 * @return {[type]}     [description]
	 */
	showClassify(ids) {
		return request ({
      url: controller + '/showClassify',
      method: 'post',
      data: { ids }
    })
	},

	/**
	 * 分类排序
	 * @param  {[[{id:”分类id”,”order”:”序号”}]]} sort [description]
	 * @return {[type]}     [description]
	 */
	sortClassify(sort) {
		return request ({
      url: controller + '/sortClassify',
      method: 'post',
      data: {
      	obj:{
      		recordList: sort
      	}
      }
    })
	},
}
