'use strict'

/**
 * 义务类型错误类
 */

class APIError {
	constructor(code='internal: unknown_error', message='未知的异常') {
    this.success = false
    this.code = code
    this.message = message
	}
}

module.exports = APIError
