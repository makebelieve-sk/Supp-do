// Класс таблицы раздела "Характеристики оборудования"
import TableConstructor from "./init";
import {EquipmentPropertyTab} from "../tabs/equipmentProperty";
import {EquipmentPropertyRoute} from "../routes/route.EquipmentProperty";

export default class EquipmentPropertyTable extends TableConstructor {
    render() {
        const options = {
            createTitle: "Создание записи о характеристике оборудования",
            editTitle: "Редактирование записи о характеристике оборудования",
            tab: EquipmentPropertyTab,
            tabKey: "equipmentPropertyItem",
            modelRoute: EquipmentPropertyRoute
        };

        return super.render(options);
    }
}