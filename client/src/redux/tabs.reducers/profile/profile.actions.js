// Инициализация экшенов для раздела "Профиль"
import {
    EDIT_PROFILE,
    SET_ERROR_RECORD_PROFILE,
} from "./profile.constants";

const ActionCreatorProfile = {
    // Изменение профиля
    editProfile: (editProfile) => {
        return {
            type: EDIT_PROFILE,
            payload: editProfile,
        }
    },
    // Установка ошибки для записи
    setErrorRecordProfile: (error) => {
        return {
            type: SET_ERROR_RECORD_PROFILE,
            payload: error
        }
    },
}

export default ActionCreatorProfile;