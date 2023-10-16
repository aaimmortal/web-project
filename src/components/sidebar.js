import React from "react";
import {TbReportSearch} from "react-icons/tb";
import {FaUsers} from "react-icons/fa";
import {BiLogOut, BiTime} from "react-icons/bi";
import {AiOutlineBarChart, AiOutlineUserAdd, AiOutlineMenu} from "react-icons/ai";
import {IoIosArrowDropdownCircle} from "react-icons/io"
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
                    open: false,
                    icon: <TbReportSearch/>
                },
                {
                    path: "/statistics",
                    name: "Статистика",
                    icon: <AiOutlineBarChart/>,
                    open: false,
                },
                {
                    path: "/agents",
                    name: "Учет рабочего времени операторов",
                    icon: <FaUsers/>,
                    open: false,
                    sub: [
                        {
                            name: "A1",
                        },
                        {
                            name: "A2",
                        }
                    ]
                },
                {
                    path: "/wfm",
                    name: "График учета рабочего времени операторов",
                    open: false,
                    icon: <BiTime/>
                },
                {
                    path: "/register",
                    name: "Добавить пользовтеля",
                    open: false,
                    icon: <AiOutlineUserAdd/>
                },
                {
                    path: "/",
                    name: "Выйти",
                    open: false,
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
    handleToggle = (path) => {
        const nav = this.state.menuItems.find(menuItem => menuItem.path === path)
        console.log(nav)
        nav.open = !nav.open
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
                                    <div className={"d-flex"}>
                                        <div className={styles.icon_text}>{menuItem.name}</div>
                                        {(menuItem.sub != null && menuItem.sub.length > 0) && (
                                            <IoIosArrowDropdownCircle className={styles.logo} onClick={this.handleToggle(menuItem.path)}/>
                                        )}
                                    </div>
                                    <div className={`${menuItem.open === true ? styles.activeSub: styles.sub}`}>
                                        {
                                            (menuItem.sub != null && menuItem.sub.length > 0) && (
                                                menuItem.sub.map(subMenu => (
                                                    <div className={styles.subInner}><hr/>{subMenu.name}</div>
                                                ))
                                            )
                                        }
                                    </div>
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