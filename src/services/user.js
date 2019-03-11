import request from '@/utils/request'
import configPath from '@/configs/path'

const controller = '/zjzx-user/user'
const token = localStorage.token
const userid = localStorage.id

export default {

	/**
	 * [getCode 获取手机验证码]
	 * @param  {[type]} mobile [手机号]
	 * @return {[type]}        [description]
	 */
	getCode(mobile) {
		return request({
			url: controller + '/getCode',
			params: { mobile }
		})
	},

	/**
	 * [testCode 校验手机验证码]
	 * @param  {[type]} mobile [手机号]
	 * @param  {[type]} code   [校验码]
	 * @return {[type]}        [description]
	 */
	testCode(mobile, code) {
		return request({
			url: controller + '/testCode',
			params: { mobile, code }
		})
	},

	/**
	 * [loginByMobile 手机号登录]
	 * @param  {[type]} mobile [description]
	 * @param  {[type]} code   [description]
	 * @return {[type]}        [description]
	 */
	loginByMobile(mobile, code) {
		return request({
			url: controller + '/loginByMobile',
			params: { mobile, code }
		})
	},

	/**
	 * [getUserById 获取用户的信息]
	 * @param  {[type]} userid [description]
	 * @return {[type]}        [description]
	 */
	getUserById(targetuserid) {
		return request({
			url: controller + '/getUserById',
			params: { targetuserid }
		})
	},

	/**
	 * [updateUser 更新用户信息]
	 * @param  {[type]} user [description]
	 * @return {[type]}      [description]
	 */
	updateUser(user) {
		return request({
			url: controller + '/updateUser',
			method: 'post',
			data: { token, userid, record: JSON.stringify(user) }
		})
	},

	/**
	 * [logOut 用户退出]
	 * @return {[type]} [description]
	 */
	logOut() {
		return request({
			url: controller + '/logOut',
			params: { logid: localStorage.logid, token, userid }
		})
	},

	/**
	 * [testUserName 判断用户名是否存在]
	 * @param  {[type]} username [description]
	 * @return {status:"success" exist:"是否存在"  0:不存在，1:存在}
	 */
	testUserName(username) {
		return request({
			url: controller + '/testUserName',
			params: { username }
		})
	}
}