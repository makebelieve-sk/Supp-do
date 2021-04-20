// Инициализация ActionCreator`а для состояний авторизации
import {
    SET_ALERT,
    SET_USER,
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
}

export default ActionCreatorAuth;