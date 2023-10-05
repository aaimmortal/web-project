import React from "react";
import Sidebar from "../components/sidebar";
import styles from '../assets/css/agent.module.css'
import {Table} from "react-bootstrap";
import axios from "axios";
import {DownloadTableExcel} from "react-export-table-to-excel";

class Agent extends React.Component {
    constructor(props) {
        super(props);
        this.tableRef = React.createRef()
        this.state = {
            data: [],
            startDate: "",
            endDate: "",
            startTime: "00:00",
            endTime: "23:59",
            searchValue: "",
        }
    }

    getNameByNumber = (number) => {
        if (number === "7001") return 'Каламкас'
        if (number === "7002") return 'Аружан'
    }
    getActionByName = (action) => {
        switch (action) {
            case "Login":
                return 'Подключился'
            case "Logout":
                return 'Отключился'
            case "PAUSED":
                return 'Вышел на перерыв'
            case "UNPAUSED":
                return 'Вышел с перерыва'
            default:
                return "-"
        }
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
    handleStartTimeChange = (e) => {
        this.setState({
            startTime: e.target.value
        })
    }
    handleEndTimeChange = (e) => {
        this.setState({
            endTime: e.target.value
        })
    }
    handleInputChange = (e) => {
        this.setState({
            searchValue: e.target.value
        })
    }
    handleSubmit = () => {
        const start = `${this.state.startDate} ${this.state.startTime}:00`
        const end = `${this.state.endDate} ${this.state.endTime}:59`
        axios.get("http://172.16.3.185:8080/api/wfm", {
            params: {
                dateTime: start,
                dateTime2: end
            }
        }).then(res => {
            this.setState({
                data: res.data
            })
            console.log(res)
        }).catch(err => {
            console.log(err.response.data)
        })
    }

    componentDidMount() {
    }

    render() {
        return (
            <div className={styles.page}>
                <Sidebar/>
                <div className={"w-100 p-3"}>
                    <div className={"w-100 d-flex justify-content-between"}>
                        <div>
                            <input name={"date"} type={"date"} onChange={this.handleStartDateChange}/>
                            <input name={"date"} type={"date"} className={styles.inputDateTime}
                                   onChange={this.handleEndDateChange}/>
                            <input name={"date"} type={"time"} className={styles.inputDateTime}
                                   onChange={this.handleStartTimeChange}/>
                            <input name={"date"} type={"time"} className={styles.inputDateTime}
                                   onChange={this.handleEndTimeChange}/>
                            <input type={"button"} className={styles.inputDateTime} onClick={this.handleSubmit}
                                   value={"Показать"}/>
                            <DownloadTableExcel filename="users table" sheet="users"
                                                currentTableRef={this.tableRef.current}>
                                <button className={styles.inputDateTime}> Экспорт эксель</button>
                            </DownloadTableExcel>
                        </div>
                        <div>
                            <input type={"search"} placeholder={"Найти по агенту"}
                                   onChange={this.handleInputChange}/>
                            <button>Найти</button>
                        </div>
                    </div>
                    <div className={"w-100 p-3"} style={{width: "1300px"}}>
                        <Table responsive={true} striped bordered hover ref={this.tableRef}>
                            <thead>
                            <tr>
                                <th>Агент</th>
                                <th>Дата</th>
                                <th>Статус</th>
                                <th>Время перерыва</th>
                            </tr>
                            </thead>
                            <tbody>
                            {
                                this.state.data.map(cur => (
                                    <tr>
                                        <td>{this.getNameByNumber(cur.agentid)}</td>
                                        <td>{cur.date.replace('T', " ")}</td>
                                        <td>{this.getActionByName(cur.action)}</td>
                                        <td>{cur.pausedDuration}</td>
                                    </tr>
                                ))
                            }
                            </tbody>
                        </Table>
                    </div>
                </div>
            </div>
        )
    }
}

export default Agent