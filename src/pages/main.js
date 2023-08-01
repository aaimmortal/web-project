import React from "react";
import styles from "../assets/css/main.module.css"
import Sidebar from "../components/sidebar.js";
import {isExpired} from "react-jwt";
import logo from '../assets/images/audio_logo.svg'

class Main extends React.Component {
    componentDidMount() {
        // const token = localStorage.getItem("jwt")
        // console.log(token)
        // if (isExpired(token)) {
        //     window.location.href = "http://localhost:3000/login"
        // }
    }

    render() {
        return (
            <div className={styles.page}>
                <Sidebar/>
                <div className={"container w-100 h-100"}>
                    <div>
                        <h2>Выберите дату</h2>
                        <div>
                            <input name={"date"} type={"date"}/>
                            <button type={"button"} className={"ms-2"} data-toggle="modal" data-target="#exampleModal">Показать</button>
                        </div>
                    </div>

                </div>
                <div className="modal fade" tabIndex="-1" role="dialog" id="exampleModal" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Modal title</h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <p>Modal body text goes here.</p>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-primary">Save changes</button>
                                <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Main