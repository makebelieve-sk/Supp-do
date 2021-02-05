import {ContentTab} from "../components/helpers/contentTab";

const initialState = {
    tabs: [{title: 'Профессии', content: ContentTab, key: 'professions'}],
    activeKey: 'professions',
    prevActiveTab: null,

    professions: [],
    rowDataProfession: null,

    departments: [],
    rowDataDepartment: null,

    people: [],
    rowDataPerson: null,

    tasks: [],
    rowDataTask: null,

    equipmentProperties: [],
    rowDataEquipmentProperty: null,

    loadingSkeleton: false,
};

export default initialState;