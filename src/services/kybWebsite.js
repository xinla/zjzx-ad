import request from '@/utils/request'

const controller = 'zjzx-website/website'
const userid = localStorage.id

export default {

	/**
	 * 添加/更新资讯
	 * title："标题"，
		 content："内容",
		 imagepath:"图片路径",
		 creatorid:"创建人id",
		 id:"标识"   //如果有id表示更新此记录
	 * @return {[promise]}     [axios]
	 */
	setInformation(news) {
		return request ({
      url: controller + '/setInformation',
      method:'post',
      data: { 
      	title: news.title,
      	content: news.content,
      	imagepath: news.images,
      	id: news.id,
      	creatorid: userid,
      }
    })
	},

	/**
	 * 获取资讯分页
	 * @param  {page:"当前页", size:"分页大小", keyword:"关键字"} query [description]
	 * @return {[type]}       [description]
	 */
	getInformationPage(query) {
		return request ({
      url: controller + '/getInformationPage',
      params: query
    })
	},

	/**
	 * 获取最新资讯
	 * @return {[type]} [description]
	 */
	getNewInformation() {
		return request ({
      url: controller + '/getNewInformation',
    })
	},

	/**
	 * 资讯删除
	 * @param  {[type]} recordid [记录id]
	 * @return {[type]}          [description]
	 */
	deleteInformation(recordid) {
		return request ({
      url: controller + '/deleteInformation',
      params: { recordid }
    })
	},

	/**
	 * 获取资讯详情
	 * @param  {[type]} recordid [记录id]
	 * @return {[type]}          [description]
	 */
	getInformationById(recordid) {
		return request ({
      url: controller + '/getInformationById',
      params: { recordid }
    })
	},

	/**
	 * 添加在线留言
	 * membername："会员姓名"，
		 mobile："手机号码",
		 content:"留言内容"
	 * @return {[type]}       [description]
	 */
	saveOnlinemessage(membername, mobile, content) {
		return request ({
      url: controller + '/saveOnlinemessage',
      method: 'post',
      data: { membername, mobile, content }
    })
	},

	/**
	 * 获取在线留言列表
	 * @param  {page："当前页"， size："分页大小", key:"关键字"} query [description]
	 * @return {[type]}       [description]
	 */
	getOnlinemessagePage(query) {
		return request ({
      url: controller + '/getOnlinemessagePage',
      params: query
    })
	},
}
