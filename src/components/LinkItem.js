import React from "react";
import styles from "../assets/css/sidebar.module.css";
import {NavLink} from "react-router-dom";
import {FiChevronDown, FiChevronRight} from "react-icons/fi";
import {connect} from "react-redux";
import {toggle, goto} from "../redux/reducer";

class LinkItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            menuItem: this.props.menuItem,
            menuItems: this.props.menuItems,
            current: this.props.current,
            handleToggle: this.props.toggle,
            handleGoto: this.props.goto
        }
    }

    static mapStateToProps(state) {
        return {
            menuItems: state.menuItems,
            current: state.current
        };
    }

    static mapDispatchToProps(dispatch) {
        return {
            toggle: function (action, id) {
                dispatch(toggle(action, id))
            },
            goto: function (action, path) {
                dispatch(goto(action, path))
            }
        };
    }

    render() {
        return (
            <div>
                <NavLink to={this.state.menuItem.path == null ? "#" : this.state.menuItem.path}
                         className={styles.menuItem}>
                    <hr/>
                    <div className={this.state.current === this.state.menuItem.path && styles.activeItem}>

                        <div className={"d-flex justify-content-between align-items-center"}>
                            <div className={"d-flex align-items-end"}>
                                <div className={styles.icon}>{this.state.menuItem.icon}</div>
                                <div className={styles.icon_text}
                                     onClick={() => this.props.goto('GOTO', this.state.menuItem.path)}>{this.state.menuItem.name}</div>
                            </div>
                            {(this.state.menuItem.sub.length > 0) && (
                                this.state.menuItem.open ? <FiChevronDown className={styles.logo}
                                                                          onClick={() => this.state.handleToggle('TOGGLE', this.state.menuItem.id)}/> :
                                    <FiChevronRight className={styles.logo}
                                                    onClick={() => this.state.handleToggle('TOGGLE', this.state.menuItem.id)}/>

                            )}
                        </div>
                        <div className={`${styles.sub} ${this.state.menuItem.open && styles.activeSub}`}>
                            {
                                (this.state.menuItem.sub.length > 0) && (
                                    this.state.menuItem.sub.map(subMenu => (
                                        <LinkItem menuItem={subMenu} goto={this.props.goto} menuItems={this.props.menuItems} current={this.props.current}/>
                                    ))
                                )
                            }
                        </div>
                    </div>
                </NavLink>
            </div>
        )
    }
}

export default connect(LinkItem.mapStateToProps, LinkItem.mapDispatchToProps)(LinkItem)