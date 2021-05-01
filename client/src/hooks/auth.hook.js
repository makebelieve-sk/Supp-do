// Хук, отвечающий за регистрацию/вход/выход и запись пользвотеля в хранилища
import {useState, useEffect, useCallback} from "react";
import {LaptopOutlined, MenuUnfoldOutlined, StockOutlined, UserOutlined} from "@ant-design/icons";
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
import {StatisticRoute} from "../routes/route.Statistic";
import {UserRoute} from "../routes/route.User";
import {RoleRoute} from "../routes/route.Role";
import {HelpRoute} from "../routes/route.Help";

const storageName = "user";   // Название объект пользователя в локальном хранилище браузера
const jwt = "token";   // Название поля в куки для сохранения токена пользователя

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
                        route: StatisticRoute
                    }
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
                                // model: LogRoute
                            }
                        ]
                    },
                    {
                        title: "Помощь",
                        key: "help",
                        model: HelpRoute
                    }
                ]
            },
            {
                title: "Личный кабинет",
                key: "personal-area",
                icon: <UserOutlined/>,
                children: [
                    // {
                    //     title: "Сменить пароль",
                    //     key: "change-password",
                    //     url: "/change-password"
                    // },
                    {
                        title: "Выйти",
                        key: "logout",
                        url: "/login"
                    }
                ]
            },
        ]));
    }, []);

    // Функция выхода
    const logout = useCallback(() => {
        setToken(null);
        setUser(null);

        // Удаляем все данные пользователя из хранилища браузера
        localStorage.removeItem(storageName);

        Cookies.remove(jwt);    // Удаляем токен из куки

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