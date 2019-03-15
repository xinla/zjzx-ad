import request from '@/utils/request'
import configPath from '@/configs/path'

const controller = configPath.fileServer + '/file'

export default {
	/**
	 * 上传视频
	 * @param  {[type]} file [description]
	 * @return {[type]}      [description]
	 */
	uploadVideo(file) {
		return request({
			url: controller + '/uploadVideo',
			method: 'post',
			data: file
		})
	}
}
