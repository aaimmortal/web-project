import React from "react";
import {TbMapPins, TbReportSearch} from "react-icons/tb";
import {FaCar, FaRoute, FaUsers} from "react-icons/fa";
import {BiLogOut, BiMap} from "react-icons/bi";
import {AiOutlineUserAdd, AiOutlineMenu} from "react-icons/ai";
import {NavLink} from "react-router-dom";
import styles from "../assets/css/sidebar.module.css"

class Sidebar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpen: false,
            menuItems: [
                {
                    path: "/main",
                    name: "Отчеты",
                    icon: <TbReportSearch/>
                },
                {
                    path: "#",
                    name: "Запись звонков",
                    icon: <TbMapPins/>
                },
                {
                    path: "#",
                    name: "Список пользователей",
                    icon: <FaUsers/>
                },
                {
                    path: "#",
                    name: "История",
                    icon: <FaRoute/>
                },
                {
                    path: "#",
                    name: "Главное меню",
                    icon: <BiMap/>
                },
                {
                    path: "/register",
                    name: "Добавить пользовтеля",
                    icon: <AiOutlineUserAdd/>
                },
                {
                    path: "/login",
                    name: "Выйти",
                    icon: <BiLogOut/>
                },
            ]
        };
    }

    componentDidMount() {
        window.addEventListener('resize', () => this.setState({isOpen: false}))
    }

    changeIsOpen = () => {
        this.setState({
            isOpen: !this.state.isOpen
        })
    }

    render() {
        return (
            <div className={`${styles.background}  ${this.state.isOpen && styles.activeBack}`}>
                <div className={styles.top_section}>
                    <AiOutlineMenu className={styles.logo} onClick={this.changeIsOpen}/>
                </div>
                <div className={`${styles.menuItems} ${this.state.isOpen && styles.active}`}>
                    {
                        this.state.menuItems.map((menuItem, index) => (
                            <NavLink to={menuItem.path} key={index} className={styles.menuItem}>
                                <hr/>
                                <div>
                                    <div className={styles.icon}>{menuItem.icon}</div>
                                    <div className={styles.icon_text}>{menuItem.name}</div>
                                </div>
                            </NavLink>
                        ))
                    }
                </div>
            </div>

        )
    }
}

export default Sidebar