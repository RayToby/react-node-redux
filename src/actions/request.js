import fetch from 'isomorphic-fetch';
export function obj2params (obj) {
    let result = ''
    for (let item in obj) {
        result += `&${item}=${encodeURIComponent(obj[item])}`
    }
    return result ? result.slice(1) : result
}
  
export const post = (url, paramsObj) => {
    return _fetch(url, 'POST', paramsObj)
}
  
export const get = (url, paramsObj) => {
    return _fetch(url, 'GET', paramsObj)
}
  
export const _fetch = (url, method, paramsObj) => {
    return fetch(url, {
        method: method,
        /* 携带cookie */
        credentials: 'include',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json; charset=utf-8',
        },
        body: method === 'POST' ? JSON.stringify(paramsObj) : obj2params(paramsObj)
    }).then(res => {
      if (res.status === 200) return res.json()
      res.text().then(text => {
            return Promise.reject(new Error(`${url}-->${text}-->${res.status}`))
      })
    })
}
