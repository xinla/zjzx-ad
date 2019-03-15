import request from '@/utils/request'
import configPath from '@/configs/path'

const controller = 'http://wx.zjzx.xyz/zjzx-fictitious-user/user'
const token = localStorage.token
const userid = localStorage.id

export default {
	/**
	 * 设置子用户
	 * @param {[type]} username [description]
	 * @param {[type]} mobile   [description]
	 * @param {[type]} imageurl [description]
	 */
	setChildUser(user) {
		return request({
			url: controller + '/setChildUser',
			method: 'post',
			data: { 
				puserid: userid, 
				username: user.username, 
				mobile: user.mobile, 
				imageurl: user.imageurl 
			}
		})
	},

	/**
	 * 更新子用户
	 * @param  {[type]} username [description]
	 * @param  {[type]} mobile   [description]
	 * @param  {[type]} imageurl [description]
	 * @return {[type]}          [description]
	 */
	updateChildUser(childId, user) {
		return request({
			url: controller + '/updateChildUser',
			method: 'post',
			data: { 
				puserid: userid, 
				id:childId,
				username: user.username, 
				mobile: user.mobile, 
				imageurl: user.imageurl 
			}
		})
	},

	/**
	 * 根据用户id获取子名称列表
	 * @param  {[type]} userid [description]
	 * @return {[type]}        [description]
	 */
	getChildUserList() {
		return request({
			url: controller + '/getChildUserList',
			method: 'post',
			data: { userid }
		})
	},

	/**
	 * 根据文章id获取子用户名称(废弃)
	 * @param  {[type]} id           [description]
	 * @param  {[type]} userid       [description]
	 * @param  {[type]} fictiousname [description]
	 * @return {[type]}              [description]
	 */
	/*getFictitiousUserByArticle(articleid) {
		return request({
			url: controller + '/getFictitiousUserByArticle',
			method: 'post',
			data: { articleid }
		})
	},*/

	/**
	 * 校验子用户是否被设置
	 * @param  {[type]} username [description]
	 * @return {[type]}              [description]
	 */
	testUserName(username) {
		return request({
			url: controller + '/testUserName',
			method: 'post',
			data: { username }
		})
	},

	/**
	 * 删除子用户(废弃)
	 * @param  {[type]} id [description]
	 * @return {[type]}    [description]
	 */
	/*deleteById(id) {
		return request({
			url: controller + '/deleteById',
			method: 'post',
			data: { id }
		})
	},*/

	/**
	 * 获取随机子用户
	 * @param  {[type]} userid [description]
	 * @return {[type]}        [description]
	 */
	getRandomFictiousname(userid) {
		return request({
			url: controller + '/getRandomFictiousname',
			method: 'post',
			data: { userid }
		})
	},

	/**
	 * 获取发布文章的子用户名
	 * @param  {[type]} userid    [description]
	 * @param  {[type]} articleid [description]
	 * @return {[type]}           [description]
	 */
	getArticleUserNamerequest(userid, articleid) {
		return request({
			url: controller + '/getArticleUserNamerequest',
			method: 'post',
			data: { userid, articleid }
		})
	},

}
