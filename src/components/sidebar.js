import React from "react";
import {AiOutlineMenu} from "react-icons/ai";
import styles from "../assets/css/sidebar.module.css"
import LinkItem from "./LinkItem";
import {connect} from "react-redux";
import {toggle} from "../redux/reducer";

class Sidebar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpen: false,
            menuItems: this.props.menuItems
        };
    }

    static mapStateToProps(state) {
        return {
            menuItems: state.menuItems,
        };
    }

    static mapDispatchToProps(dispatch) {
        return {
            toggle: (id) => dispatch(toggle(id)),
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
                        this.props.menuItems.map((menuItem, index) => (
                            <LinkItem menuItem={menuItem}/>
                        ))
                    }
                </div>
            </div>

        )
    }
}

export default connect(Sidebar.mapStateToProps, Sidebar.mapDispatchToProps)(Sidebar)