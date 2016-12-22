'use strict'

import Promise from 'promise-polyfill'
import setAsap from 'setasap'
import store from '../vuex/store'
import { Toast } from 'mint-ui'
Promise._immediateFn = setAsap

import 'whatwg-fetch'

// Settings configured here will be merged into the final config object.
export default {
  get (url, query) {
    return fetch(queryParser(url, query), config._get)
      .then(checkStatus)
      .then(jsonParser)
      .then(checkSuccess)
      .catch(errorHandler)
  },
  post (url, body) {
    return fetch(url, config._post(body))
      .then(checkStatus)
      .then(jsonParser)
      .then(checkSuccess)
      .catch(errorHandler)
  }
}

const config = {
  _get: {
    credentials: 'same-origin'
  },
  _post (body) {
    if (!body) {
      body = ''
    } else if (typeof body !== 'string') {
      body = JSON.stringify(body)
    }

    return Object.assign({}, this.get, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: body,
    })
  }
}

const checkStatus = function (response) {
  if (response.status >= 200 && response.status < 300) {
    return response
  } else {
    var error = new Error(response.statusText)
    error.response = response
    throw error
  }
}

const jsonParser = function (response) {
  return response.json()

}

const queryParser = function (url, query) {
  if (!query) return url
  let parsedQuery = Object.keys(query).map(key => `${key}=${query[key]}`).join('&')
  return `${url}?${parsedQuery}`
}

const checkSuccess = function (parsed) {

  if(!parsed.success) {
    if(parsed.code == 'Unlogged'){
      store.commit('notLogin')
      store.dispatch('openPopup')
    }
    let error = new Error(parsed.code)
    error.message = parsed.message
    throw error
  } else {
    return parsed
  }
}

const errorHandler = function(err) {
	console.log(err)
  if(err.message){
  	Toast(err.message)
  	return false
  }else{
  	Toast('网络错误')
  	return false
  }
}