// Управление содержимым вкладки с таблицей
import {useSelector} from "react-redux";

import {Card, Skeleton} from "antd";
import {TableComponent} from "../contentComponent/table.components/tableComponent";

export const BodyManager = ({specKey}) => {
    const {loadingSkeleton} = useSelector(state => state.reducerLoading.loadingSkeleton);

    return <div className="container-dto">
        <Skeleton loading={loadingSkeleton} active>
            <Card className="card-dto">
                <TableComponent specKey={specKey}/>
            </Card>
        </Skeleton>
    </div>
};