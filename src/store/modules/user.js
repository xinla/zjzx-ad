import userService from '@/services/user'
import { getToken, setToken, removeToken } from '@/utils/auth'

const user = {
  state: {
    token: getToken(),
    id:'',
    name: '',
    avatar: '',
    roles: ['admin']
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_ID: (state, id) => {
      state.id = id
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    }
  },

  actions: {
    // 登录
    Login({ commit }, userInfo) {
      // const username = userInfo.username.trim()
      return new Promise((resolve, reject) => {
        // console.log(userInfo)
        userService.loginByMobile(userInfo.username, userInfo.password).then(response => {
          // console.log(response.data)
          // return
          const data = response.data.result
          setToken(data.token)
          commit('SET_TOKEN', data.token)
          commit('SET_ID', data.user.id)
          localStorage.id = data.user.id
          localStorage.logid = data.user.logid
          localStorage.token = data.token
          commit('SET_NAME', data.username)
          commit('SET_AVATAR', GoTruth.$Tool.headerImgFilter(data.user.imageurl))
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户信息
    GetInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        // console.log(state.id)
        userService.getUserById(localStorage.id).then(response => {
          const data = response.data.result
          // console.log(data)
          // return
          /*if (data.roles && data.roles.length > 0) { // 验证返回的roles是否是一个非空数组
            commit('SET_ROLES', data.roles)
          } else {
            reject('getInfo: roles must be a non-null array !')
          }*/
          commit('SET_ID', data.user.id)
          commit('SET_NAME', data.username)
          commit('SET_AVATAR', GoTruth.$Tool.headerImgFilter(data.user.imageurl))
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 登出
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        userService.logOut().then(() => {
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          removeToken()
          localStorage.clear()
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        removeToken()
        resolve()
      })
    }
  }
}

export default user
