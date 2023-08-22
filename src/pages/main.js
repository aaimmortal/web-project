import React from "react";
import styles from "../assets/css/main.module.css"
import Sidebar from "../components/sidebar.js";
import {isExpired} from "react-jwt";
import axios from "axios";

class Main extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            startDate: "",
            endDate: "",
            res: []
        }
    }

    componentDidMount() {
        // const token = localStorage.getItem("jwt")
        // console.log(token)
        // if (isExpired(token)) {
        //     window.location.href = "http://localhost:3000/login"
        // }
    }

    handleStartDateChange = (e) => {
        this.setState({
            startDate: e.target.value
        })
    }
    handleEndDateChange = (e) => {
        this.setState({
            endDate: e.target.value
        })
    }
    handleSubmit = () => {
        const start = `${this.state.startDate} 00:00:00`
        const end = `${this.state.endDate} 23:59:59`
        console.log(start)
        console.log(end)
        axios.get("http://172.16.3.185:8080/api/calldateBetween", {
            params: {
                dateTime: start,
                dateTime2: end
            }
        }).then(res => {
            console.log(res)
            this.setState({
                res: res.data
            })
        }).catch(err => {
            console.log(err.response.data)
        })
    }
    handleUpdate = () => {
        this.handleSubmit()
    }

    render() {
        return (
            <div className={styles.page}>
                <Sidebar/>
                <div className={`${styles.page} p-3 w-100 h-100`}>
                    <div className={"w-25"}>
                        <div>
                            <h4>Выберите дату начала</h4>
                            <input name={"date"} type={"date"} onChange={this.handleStartDateChange}/>
                        </div>
                        <div>
                            <h4>Выберите дату конца</h4>
                            <input name={"date"} type={"date"} onChange={this.handleEndDateChange}/>
                        </div>
                        <button type={"button"} className={""} onClick={this.handleSubmit}>Показать</button>
                    </div>
                    <div className={`w-100 table-responsive`}>
                        <table className={"table"}>
                            <thead>
                            <tr>
                                <th scope="col">Дата</th>
                                <th scope="col">Источник</th>
                                <th scope="col">Адресат</th>
                                <th scope="col">Ответ</th>
                                <th scope="col">Продолжительность</th>
                            </tr>
                            </thead>
                            <tbody>
                            {
                                this.state.res.map(cur => (
                                    <tr>
                                        <td>{cur.calldate}</td>
                                        <td>{cur.src}</td>
                                        <td>{cur.dst}</td>
                                        <td>{cur.disposition}</td>
                                        <td>{cur.duration}</td>
                                    </tr>
                                ))
                            }
                            </tbody>
                        </table>
                        {this.state.res.length !== 0 && <button onClick={this.handleUpdate}>Обновить</button>}
                    </div>
                </div>
            </div>
        )
    }
}

export default Main