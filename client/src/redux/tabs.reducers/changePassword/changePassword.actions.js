// Инициализация экшенов для раздела "Смена пароля"
import {
    CHANGE_PASSWORD,
} from "./changePassword.constants";

const ActionCreatorChangePassword = {
    // Установка ошибки
    setErrorChangePassword: (error) => {
        return {
            type: CHANGE_PASSWORD,
            payload: error
        }
    },
}

export default ActionCreatorChangePassword;