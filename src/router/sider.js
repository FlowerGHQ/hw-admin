import routes from './routes'
console.log('routes:', routes)
import Const from "../core/const"

const LOGIN_TYPE = Const.LOGIN.TYPE

let ADMIN_ROUTER = [], DISTRIBUTOR_ROUTER = [], AGENT_ROUTER = [], STORE_ROUTER = []

routes = routes.filter(item => {
    return item.meta && !item.meta.hidden
})
routes = routes.map(first => {
    if (first.children) {
        first.children = first.children.filter(second => {
            return second.meta && !second.meta.hidden
        })
    }
    return first
})

console.log('sider routes:', routes)

const SIDER = {
    ADMIN_ROUTER,
    DISTRIBUTOR_ROUTER,
    AGENT_ROUTER,
    STORE_ROUTER
}

export default SIDER