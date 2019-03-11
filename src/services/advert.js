import request from '@/utils/request'
import configPath from '@/configs/path'

const controller = '/zjzx-advert/advert'

export default {

  /**
   * [saveAdvert 发布广告]
   * @param  {[object]} ad [文章信息]
   *  title  广告标题  vachar  
      content 文章内容  varchar 
      author  发布人id int 
      cover 封面  varchar 封面图片地址
      images  图片地址  varchar url1,url2,...
      link  广告链接地址  varchar 
      templateid  广告模板id  int 
      company 公司名称  varchar 
      type  广告类型  int 1:普通，2:内联 3：外联
   * @return {[promise]}     [axios]
   */
	saveAdvert(ad) {
    return request ({
      url: controller + '/saveAdvert',
      method: 'post',
      data: { record: ad}
    })
  },

  /**
   * [getAdvertPage 根据标题，内容，公司搜索]
   * @param  {[type]} page [当前页]
   * @param  {[type]} size [分页大小]
   * @param  {[type]} key  [关键词]
   * @return {[promise]}      [axios]
   */
  getAdvertPage(page, size, key) {
    return request ({
      url: controller + '/getAdvertPage',
      method: 'post',
      data: { page, size, key }
    })
  },

  /**
   * [getAdvertById 广告详情]
   * @param  {[type]} id [”广告标识”]
   * @return {[type]}    [description]
   */
  getAdvertById(id) {
    return request ({
      url: controller + '/getAdvertById',
      params: { id }
    })
  },

  /**
   * [getNextAdvert 获取app内嵌广告]
   * @param  {[type]} id [当前广告id]
   * @return {[type]}    [description]
   */
  getNextAdvert(id) {
    return request ({
      url: controller + '/getNextAdvert',
      params: { id }
    })
  }


}
