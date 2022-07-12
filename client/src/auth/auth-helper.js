import { signoutAPI } from './api-auth'

const auth = {
    authenticate(jwt, cb) {
        if (window) {
            sessionStorage.setItem('jwt', JSON.stringify(jwt))
            cb()
        }
    },
    
    isAuthenticated() {
        if (!window) {
            return false
        } else {
            const jwt = sessionStorage.getItem('jwt')
            return JSON.parse(jwt)
        }
    },

    clearJWT(cb) {
        if (typeof(window) !== undefined) {
            sessionStorage.removeItem('jwt')
            cb()
            signoutAPI()
        }
    },

    updateJWT(user, cb) {
        if (typeof(window) !== undefined) {
            if (sessionStorage.getItem('jwt')) {
                let auth = JSON.parse(sessionStorage.getItem('jwt'))
                auth.user = user
                sessionStorage.setItem('jwt', JSON.stringify(auth))
                cb()
            }
        }
    }
}

export default auth