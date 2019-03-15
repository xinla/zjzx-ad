import userService from '@/services/user'
import { getToken, setToken, removeToken } from '@/utils/auth'

const user = {
  state: {
    token: localStorage.token,
    id:'',
    name: '',
    avatar: '',
    roles:''
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
      localStorage.token = token
    },
    SET_ID: (state, id) => {
      state.id = id
      localStorage.id = id
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    LOGOUT: state => {
      state.id = ''
      state.token = ''
      localStorage.clear()
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
          // setToken(data.token)
          commit('SET_TOKEN', data.token)
          commit('SET_ID', data.user.id)
          commit('SET_NAME', data.user.username)
          commit('SET_AVATAR', GoTruth.$Tool.headerImgFilter(data.user.imageurl))
          localStorage.logid = data.user.logid
          if (localStorage.id <= 3 || localStorage.id == 2828) {
            commit('SET_ROLES', 'admin')
          } else {
            commit('SET_ROLES', 'editor')
          }
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
          commit('SET_NAME', data.user.username)
          commit('SET_AVATAR', GoTruth.$Tool.headerImgFilter(data.user.imageurl))
          if (localStorage.id <= 3 || localStorage.id == 2828) {
            commit('SET_ROLES', 'admin')
          } else {
            commit('SET_ROLES', 'editor')
          }
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
          // commit('SET_TOKEN', '')
          // commit('SET_ROLES', [])
          // removeToken()
          commit('LOGOUT')
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
