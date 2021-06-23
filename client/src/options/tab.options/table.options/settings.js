// Настройки таблицы
import Cookies from "js-cookie";

import {updateValueInStorage} from "../../../helpers/functions/general.functions/workWithCookies";
import {ActionCreator} from "../../../redux/combineActions";
import {StorageVars} from "../../index";

// Объект настроек таблицы
const tableSettings = {
    pagination: {
        showTotal: (total, range) => `Записи с ${range[0]} по ${range[1]} из ${total}`,
        showSizeChanger: true,
        pageSizeOptions: [10, 20, 50, 100],
        onShowSizeChange: (_, size) => {
            const cookieValue = Cookies.get(StorageVars.pageSize);

            if (cookieValue) {
                const cookie = JSON.parse(Cookies.get(StorageVars.pageSize));

                updateValueInStorage(cookie, StorageVars.pageSize, size, ActionCreator.ActionCreatorMain.setPageSize);
            }
        }
    },
    size: "small",
    scroll: { x: 500 }
}

export default tableSettings;