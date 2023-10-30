import React from "react";
import Topbar from "./topbar";
import styles from "../assets/css/wrapper.module.css";
import Sidebar from "./sidebar";

class Wrapper extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }
    render() {
        return (
            <div>
                <Topbar/>
                <div className={styles.page}>
                    <Sidebar/>
                    <div className={`p-3 ${styles.wrapperInner} ${this.props.className}`}>
                        {
                            this.props.children
                        }
                    </div>
                </div>
            </div>
        )
    }
}
export default Wrapper