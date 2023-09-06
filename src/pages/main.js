import React from "react";
import styles from "../assets/css/main.module.css"
import Sidebar from "../components/sidebar.js";
import axios from "axios";
import {Button, Modal} from "react-bootstrap";
import {DownloadTableExcel} from "react-export-table-to-excel";

class Main extends React.Component {
    constructor(props) {
        super(props);
        this.tableRef = React.createRef()
        this.state = {
            startDate: "",
            endDate: "",
            res: [],
            show: false,
            audioUrl: null,
            agentCallData: []
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
        axios.get("http://172.16.3.185:8080/api/calldateBetween", {
            params: {
                dateTime: start,
                dateTime2: end
            }
        }).then(res => {
            console.log(res.data)
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
    fetchAudio = async (cid) => {
        try {
            const response = await axios.get("http://172.16.3.185:8080/api/audio", {
                responseType: 'blob',
                params: {
                    id: cid
                }
            });
            const blob = response.data;
            const url = URL.createObjectURL(blob);
            this.setState({
                audioUrl: url
            });
        } catch (error) {
            console.log(error)
        }
    };
    fetchAgentCallData = (cid) => {
        try {
            axios.get("http://172.16.3.185:8080/api/agentCallData", {
                params: {
                    callDataId: cid
                }
            }).then((response) => {
                this.setState({
                    agentCallData: response.data
                })
            })
        } catch (error) {
            console.log(error)
        }
    }
    openAgentCallData = (cid) => {
        this.fetchAgentCallData(cid)
        this.setState({
            show: true
        })
    }

    render() {
        return (
            <div className={styles.page}>
                <Sidebar/>
                <div className={styles.main}>
                    <audio controls className={styles.audio} src={this.state.audioUrl}/>
                    <div className={"p-3"}>
                        <div className={"w-100 d-flex align-items-center"}>
                            <div>
                                <input name={"date"} type={"date"} onChange={this.handleStartDateChange}/>
                                <input name={"date"} type={"date"} className={"ms-1"}
                                       onChange={this.handleEndDateChange}/>
                                <input type={"button"} className={"ms-2"} onClick={this.handleSubmit}
                                       value={"Показать"}/>
                            </div>
                        </div>
                        <div className={`w-100 mt-3 table-responsive`}>
                            <table className={"table"} ref={this.tableRef}>
                                <thead>
                                <tr>
                                    <th scope="col">Дата</th>
                                    <th scope="col">Источник</th>
                                    <th scope="col">Адресат</th>
                                    <th scope="col">Ответ</th>
                                    <th scope="col">Язык</th>
                                    <th scope="col">Продолжительность</th>
                                    <th scope="col">Оценка</th>
                                    <th scope="col">Подключился</th>
                                    <th scope="col">Отключился</th>
                                    <th scope="col">Ожидание</th>
                                    <th scope="col">Время разговора</th>
                                    <th scope="col">Подробнее</th>
                                    <th scope="col">Запись</th>
                                </tr>
                                </thead>
                                <tbody>
                                {
                                    this.state.res.map(cur => (
                                        <tr>
                                            <td>{cur.calldate.replace('T', " ")}</td>
                                            <td>{cur.src}</td>
                                            <td>{cur.dst}</td>
                                            <td>{cur.disposition}</td>
                                            <td>{cur.language}</td>
                                            <td>{cur.duration}</td>
                                            <td>{cur.rating}</td>
                                            <td>{cur.connect}</td>
                                            <td>{cur.disconnect}</td>
                                            <td>{cur.waiting}</td>
                                            <td>{cur.durationConsult}</td>
                                            <td>
                                                <button onClick={() => this.openAgentCallData(cur.uniqueid)}>Показать
                                                    историю
                                                </button>
                                            </td>
                                            <td>
                                                {
                                                    cur.disposition === "CANCEL" ? "Не состоялся" :
                                                        <button onClick={() => this.fetchAudio(cur.uniqueid)}>Прослушать
                                                        </button>
                                                }
                                            </td>
                                        </tr>
                                    ))
                                }
                                </tbody>
                            </table>
                            {this.state.res.length !== 0 && <button onClick={this.handleUpdate}>Обновить</button>}
                            <DownloadTableExcel
                                filename="users table"
                                sheet="users"
                                currentTableRef={this.tableRef.current}
                            >
                                <button className={"ms-1"}> Export excel</button>
                            </DownloadTableExcel>
                        </div>
                    </div>
                </div>
                <Modal show={this.state.show}>
                    <Modal.Header>
                        <Modal.Title>
                            История звонка
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className={"w-100 table-responsive"}>
                            <table className={"w-100 table"}>
                                <thead>
                                <tr>
                                    <th scope="col">Агент</th>
                                    <th scope="col">Ответ</th>
                                </tr>
                                </thead>
                                <tbody>
                                {
                                    this.state.agentCallData.map(cur => (
                                        <tr>
                                            <td>{cur.agentid}</td>
                                            <td>{cur.disposition}</td>
                                        </tr>
                                    ))
                                }
                                </tbody>
                            </table>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => this.setState({show: false})}>
                            Закрыть
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        )
    }
}

export default Main