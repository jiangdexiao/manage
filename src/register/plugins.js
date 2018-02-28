import {ajax} from '../utils/'
import config from '../apis/'

let plugins = {}
for (let [i,con] of config.entries()) {
  if (typeof con === 'object' && con.list && Array.isArray(con.list)) {
    for (let [j,item] of con.list.entries()) {
      plugins['api_' + con.module + '_' + item.method] = (function (n, m) {
        return function ({path = item.path, type = item.type,baseurl = item.baseurl, data,pathParams, headers, opts} = {}) {
          // request[n].list[m].type, request[n].list[m].path, data, fn, opts
          return ajax.call(this, {
            path,
            type,
            data,
            pathParams,
            headers,
            opts,
            baseurl
          })
        }
      })(i, j)
    }
  }
}
export default plugins