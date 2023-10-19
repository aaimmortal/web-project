import {TbDeviceDesktopAnalytics, TbReportSearch} from "react-icons/tb";
import {AiOutlineBarChart, AiOutlineUserAdd} from "react-icons/ai";
import {FaUsers} from "react-icons/fa";
import {BiLogOut, BiTime} from "react-icons/bi";
import {HiOutlineDocument} from "react-icons/hi";
import React from "react";

const initialState = {
    current: "/main",
    menuItems: [
        {
            id: 1,
            name: "Аналитика",
            open: false,
            icon: <TbDeviceDesktopAnalytics/>,
            sub: [
                {
                    id: 2,
                    path: "/main",
                    name: "Детальный отчет",
                    icon: <TbReportSearch/>,
                    sub: []
                },
                {
                    id: 3,
                    path: "/statistics",
                    name: "Статистика",
                    icon: <AiOutlineBarChart/>,
                    sub: []
                }
            ]
        },

        {
            id: 4,
            name: "WFM",
            icon: <FaUsers/>,
            open: false,
            sub: [
                {
                    id: 5,
                    path: "/wfm",
                    name: "WFM график",
                    open: false,
                    icon: <BiTime/>,
                    sub: []
                },
                {
                    id: 6,
                    path: "/agents",
                    name: "WFM отчет",
                    open: false,
                    icon: <HiOutlineDocument/>,
                    sub: []
                },
            ]
        },
        {
            id: 7,
            path: "/register",
            name: "Добавить пользовтеля",
            open: false,
            icon: <AiOutlineUserAdd/>,
            sub: []
        },
        {
            id: 8,
            path: "/",
            name: "Выйти",
            open: false,
            icon: <BiLogOut/>,
            sub: []
        },
    ]
}
export const toggle = (type, id) => ({type: type, id: id});
export const goto = function (type, path) {
    return {type: type, path: path}
};
const handleToggle = function (state, id) {
    const updated = state.menuItems.map(menuItem => {
        if (menuItem.id === id) {
            menuItem.open = !menuItem.open
            return menuItem
        }
        return menuItem
    })
    return {
        menuItems: updated,
        current: state.current
    }
}
const handleGoTo = function (state, path) {
    console.log({
        menuItems: state.menuItems,
        current: path
    })
    return {
        menuItems: state.menuItems,
        current: path
    }
}
const counterReducer = function (state = initialState, action) {
    switch (action.type) {
        case 'TOGGLE':
            return handleToggle(state, action.id)
        case 'GOTO':
            return handleGoTo(state, action.path)
        default:
            return state;
    }
};

export default counterReducer;