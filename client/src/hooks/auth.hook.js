// Хук, отвечающий за регистрацию/вход/выход и запись пользователя в хранилище и куки
import {useState, useEffect, useCallback} from "react";
import {LaptopOutlined, MenuUnfoldOutlined, StockOutlined} from "@ant-design/icons";
import Cookies from "js-cookie";

import store from "../redux/store";
import {ActionCreator} from "../redux/combineActions";

import {ProfessionRoute} from "../routes/route.profession";
import {DepartmentRoute} from "../routes/route.Department";
import {PersonRoute} from "../routes/route.Person";
import {EquipmentPropertyRoute} from "../routes/route.EquipmentProperty";
import {EquipmentRoute} from "../routes/route.Equipment";
import {TaskStatusRoute} from "../routes/route.taskStatus";
import {AnalyticRoute} from "../routes/route.Analytic";
import {StatisticRatingRoute} from "../routes/route.StatisticRating";
import {UserRoute} from "../routes/route.User";
import {RoleRoute} from "../routes/route.Role";
import {HelpRoute} from "../routes/route.Help";
import {LogRoute} from "../routes/route.Log";

const storageName = "user";   // Название объект пользователя в локальном хранилище браузера
const jwt = "token";   // Название поля в куки для сохранения токена пользователя
const pageSize = "pageSize";   // Название поля в куки для сохранения количества записей на странице таблицы

export const useAuth = () => {
    const [token, setToken] = useState(null);
    const [user, setUser] = useState(null);

    // Функция входа в систему
    const login = useCallback((token, user) => {
        // Добавляем данные о пользователе в хранилище браузера
        localStorage.setItem(storageName, JSON.stringify({token, user}));

        Cookies.set(jwt, token);    // Записываем токен в куки

        // Обновляем состояние токена, устанавливаем Cookies.get(jwt), чтобы запросы на сервер шли с токеном
        setToken(Cookies.get(jwt));
        setUser(user);  // Обновляем состояние объекта пользователя

        // Сохраняем пользователя в хранилище
        store.dispatch(ActionCreator.ActionCreatorAuth.setUser(user));

        // Заполняем боковое меню приложения
        store.dispatch(ActionCreator.ActionCreatorAuth.setMenu([
            {
                title: "Аналитика",
                key: "analytic-section",
                icon: <StockOutlined/>,
                children: [
                    {
                        title: "Аналитика",
                        key: "analytic",
                        route: AnalyticRoute
                    },
                    {
                        title: "Статистика",
                        key: "statistic",
                        route: StatisticRatingRoute
                    }
                ]
            },
            {
                title: "Справочники",
                key: "directory",
                icon: <MenuUnfoldOutlined/>,
                children: [
                    {
                        title: "Управление персоналом",
                        key: "personManagement",
                        children: [
                            {
                                title: "Профессии",
                                key: "professions",
                                model: ProfessionRoute
                            },
                            {
                                title: "Подразделения",
                                key: "departments",
                                model: DepartmentRoute
                            },
                            {
                                title: "Персонал",
                                key: "people",
                                model: PersonRoute
                            }
                        ]
                    },
                    {
                        title: "Оборудование",
                        key: "equipmentKey",
                        children: [
                            {
                                title: "Характеристики оборудования",
                                key: "equipmentProperties",
                                model: EquipmentPropertyRoute
                            },
                            {
                                title: "Перечень оборудования",
                                key: "equipment",
                                model: EquipmentRoute
                            },
                            {
                                title: "Состояние заявок",
                                key: "tasks",
                                model: TaskStatusRoute
                            }
                        ]
                    },
                ]
            },
            {
                title: "Администрирование",
                key: "admin",
                icon: <LaptopOutlined/>,
                children: [
                    {
                        title: "Управление пользователями",
                        key: "userManagement",
                        children: [
                            {
                                title: "Пользователи",
                                key: "users",
                                model: UserRoute
                            },
                            {
                                title: "Роли",
                                key: "roles",
                                model: RoleRoute
                            },
                            {
                                title: "Журнал действий пользователя",
                                key: "logs",
                                model: LogRoute
                            }
                        ]
                    },
                    {
                        title: "Помощь",
                        key: "help",
                        model: HelpRoute
                    }
                ]
            }
        ]));

        const cookiesPageSizeOptions = Cookies.get(pageSize);

        // Если в куках есть значение pageSize, то обновляем редакс, иначе обновляем и редакс и куки
        if (cookiesPageSizeOptions) {
            const pageSizeObject = JSON.parse(Cookies.get(pageSize));

            store.dispatch(ActionCreator.ActionCreatorTab.setPageSize(pageSizeObject));
        } else {
            const pageSizeDefault = 10;

            const pageSizeObject = {
                professions: pageSizeDefault,
                departments: pageSizeDefault,
                people: pageSizeDefault,
                tasks: pageSizeDefault,
                equipmentProperties: pageSizeDefault,
                equipment: pageSizeDefault,
                logDO: pageSizeDefault,
                help: pageSizeDefault,
                users: pageSizeDefault,
                roles: pageSizeDefault,
                statisticRating: pageSizeDefault,
                statisticList: pageSizeDefault,
                logs: pageSizeDefault,
            }

            // Записываем объект количества записей на странице таблицы в куки
            Cookies.set(pageSize, pageSizeObject);
            store.dispatch(ActionCreator.ActionCreatorTab.setPageSize(pageSizeObject));
        }
    }, []);

    // Функция выхода
    const logout = useCallback(() => {
        setToken(null);
        setUser(null);

        // Удаляем все данные пользователя из хранилища браузера
        localStorage.removeItem(storageName);

        Cookies.remove(jwt);    // Удаляем токен из куки
        Cookies.remove(pageSize);    // Удаляем токен из куки

        // Возвращаем начальное состояние redux
        store.dispatch({type: "USER_LOGOUT", payload: undefined});

    }, []);

    // Происходит вызов функции входа с уже полученными параметрами из хранилища браузера
    useEffect(() => {
        const data = JSON.parse(localStorage.getItem(storageName));

        data && data.token ? login(data.token, data.user) : logout();
    }, [login, logout]);

    return {login, logout, token, user};
}