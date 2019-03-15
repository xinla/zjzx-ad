import request from '@/utils/request'
import configPath from '@/configs/path'
import axios from 'axios'

const controller = '/zjzx-article/article'
const token = localStorage.token
const userid = localStorage.id

export default {

  /**
   * [发布文章]
   * @param  {[object]} record [文章信息]
   * @return {[promise]}     [axios]
   */
	publishArticle(record, files) {
    return request ({
      url: controller + '/publishArticle',
      method: 'post',
      data: { userid, token, record, files }
    })
  },

  /**
   * [文章列表 根据标题，内容，公司搜索]
   * @param  {[object]} query [查询条件对象]
   * @param  {[type]} page [当前页]
   * @param  {[type]} size [分页大小]
   * @param  {[type]} key  [关键词]
   * @return {[promise]}      [axios]
   */
  articlePage(query) {
    return request ({
      url: controller + '/articlePage',
      params: { 
        page: query.page, 
        size: query.size, 
        keyword: query.keyword,
        author: query.author,
        type: query.type,
        classify: query.classify,
        state: 3
      }
    })
  },

  /**
   * 获取用户的文章
   * @param  {[object]} query [查询条件对象]
   * @return {[type]}       [description]
   */
  getArticleByUser(query) {
    return request ({
      url: controller + '/getArticleByUser',
      params: { 
        userid,
        page: query.page, 
        size: query.size, 
        type: query.type,
        keyword: query.keyword,
        classify: query.classify,
      }
    })
  },

  /**
   * [文章详情]
   * @param  {[type]} recordid [”文章标识”]
   * @return {[type]}    [description]
   */
  getArticleById(recordid) {
    return request ({
      url: controller + '/getArticleById',
      params: { recordid }
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
   * 删除文章
   * @param  {[array]} ids [删除的文章数组]
   * @return {[type]}     [description]
   */
  deleteArticleByIds(ids) {
    return request ({
      url: controller + '/deleteArticleByIds2',
      params: { userid, token, ids:String(ids) }
    })
  }
}
