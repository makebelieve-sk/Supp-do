// Инициализация ActionCreator`а для состояний авторизации
import {
    SET_ALERT,
    SET_USER,
    SET_MENU,
} from "./auth.constants";

const ActionCreatorAuth = {
    setAlert: (flag) => {
        return {
            type: SET_ALERT,
            payload: flag
        }
    },
    setUser: (user) => {
        return {
            type: SET_USER,
            payload: user
        }
    },
    setMenu: (menu) => {
        return {
            type: SET_MENU,
            payload: menu
        }
    },
}

export default ActionCreatorAuth;