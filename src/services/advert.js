import request from '@/utils/request'
import configPath from '@/configs/path'
import axios from 'axios'
const controller = '/zjzx-advert/advert'

export default {

  /**
   * [发布广告]
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
      data: { record: ad }
    })
  },

  /**
   * [根据标题，内容，公司搜索]
   * @param  {[object]} query [查询条件对象]
   * @param  {[type]} page [当前页]
   * @param  {[type]} size [分页大小]
   * @param  {[type]} key  [关键词]
   * @return {[promise]}      [axios]
   */
  getAdvertPage(query) {
    return request ({
      url: controller + '/getAdvertPage',
      params: { 
        page: query.page, 
        size: query.size, 
        keyword: query.keyword 
      }
    })
  },

  /**
   * [广告详情]
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
   * [获取app内嵌广告]
   * @param  {[type]} id [当前广告id]
   * @return {[type]}    [description]
   */
  getNextAdvert(curentid) {
    return request ({
      url: controller + '/getNextAdvert',
      params: { curentid }
    })
  },

  /**
   * 删除广告
   * @param  {[array]} ids [删除的广告数组]
   * @return {[type]}     [description]
   */
  deleteAdverts(ids) {
    return request ({
      url: controller + '/deleteAdverts',
      method: 'post',
      data: { ids:String(ids) }
    })
  }
}
