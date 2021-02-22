// Управление содержимым вкладки с таблицей
import {useSelector} from "react-redux";

import {getContent} from "./content.helpers/content.helper";

export const BodyManager = ({specKey}) => {
    const loadingSkeleton = useSelector(state => state.reducerLoading.loadingSkeleton);

    return getContent(loadingSkeleton, specKey)
};