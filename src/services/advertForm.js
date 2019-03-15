import request from '@/utils/request'
import configPath from '@/configs/path'

const controller = '/zjzx-advert/advert_form'

export default {

	/**
	 * [saveForm 保存广告表单]
	 * @param  {[object]} ad [description]
	 *  advertid	广告id	int
			truename	姓名	varchar
			mobile	手机号	varchar
			province	省份	varchar
			city	城市	varchar
	 * @return {[promise]}     [axios]
	 */
	saveForm(ad) {
		return request ({
      url: controller + '/saveForm',
      method: 'post',
      data: ad
    })
	},

	/**
	 * [getNewSign 获取最新报名用户]
	 * @param  {[type]} id [广告id]
	 * @return {[type]}    [description]
	 */
	getNewSign(id) {
		return request ({
      url: controller + '/getNewSign',
      method: 'post',
      data: { id }
    })
	},

}
