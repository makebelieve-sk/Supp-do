// Создание контекста для удаления вкладки записи
import {createContext} from "react";

const onRemove = () => {};

export const DeleteTabContext = createContext(onRemove);