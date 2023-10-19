import React from "react";
import styles from "../assets/css/main.module.css"
import Sidebar from "../components/sidebar.js";
import axios from "axios";
import {Button, Card, Form, Modal, Table} from "react-bootstrap";
import {DownloadTableExcel} from "react-export-table-to-excel";
import {connect} from "react-redux";
import {goto, toggle} from "../redux/reducer";

class Main extends React.Component {
    constructor(props) {
        super(props);
        this.tableRef = React.createRef()
        this.state = {
            playing: false,
            pos: 0,
            startDate: "",
            endDate: "",
            startTime: "00:00",
            endTime: "23:59",
            res: [],
            show: false,
            audioUrl: null,
            agentCallData: [],
            search: "Найти по фио",
            searchValue: "",
            agents: {
                7001: "Каламкас",
                7002: "Аружан"
            }
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
    componentDidMount() {
        // const token = localStorage.getItem("jwt")
        // console.log(token)
        // if (isExpired(token)) {
        //     window.location.href = "http://localhost:3000/login"
        // }
        this.props.goto("GOTO", window.location.pathname)
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
    handleSearchChange = (e) => {
        this.setState({
            search: e.target.value
        })
    }
    handleSearchByNumber = () => {
        if (this.state.search === "Найти по номеру источника") {
            const filteredData = this.state.res.filter(item => item.src.includes(this.state.searchValue))
            this.setState({
                res: filteredData
            })
        } else {
            let target = ""
            for (const key in this.state.agents) {
                if (this.state.agents[key] === this.state.searchValue) {
                    target = key
                    break
                }
            }
            const filteredData = this.state.res.filter(item => item.dst === target)
            this.setState({
                res: filteredData
            })
        }
    }
    handleInputChange = (e) => {
        this.setState({
            searchValue: e.target.value
        })
    }
    handleSubmit = () => {
        const start = `${this.state.startDate} ${this.state.startTime}:00`
        const end = `${this.state.endDate} ${this.state.endTime}:59`
        axios.get("http://172.16.3.185:8080/api/calldateBetween", {
            params: {
                dateTime: start,
                dateTime2: end
            }
        }).then(res => {
            this.setState({
                res: res.data
            })
        }).catch(err => {
            console.log(err.response.data)
        })
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
            return URL.createObjectURL(blob)
        } catch (error) {
            return null
        }
    };
    formatTime = (seconds) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const remainingSeconds = seconds % 60;

        const formattedHours = hours.toString().padStart(2, '0');
        const formattedMinutes = minutes.toString().padStart(2, '0');
        const formattedSeconds = remainingSeconds.toString().padStart(2, '0');

        return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
    }
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
    getDispositionInRussian = (disposition) => {
        if (disposition === "ANSWERED" || disposition === "ANSWER") return "ОТВЕЧЕН"
        else if (disposition === "CANCEL") return "ОТМЕНЕН"
        else if (disposition === "NO ANSWER" || disposition === "NOANSWER") return "НЕТ ОТВЕТА"
    }
    getAgentById = (id) => {
        if (id === "7001") return "Каламкас"
        else if (id === "7002") return "Аружан"
    }
    openAgentCallData = (cid) => {
        this.fetchAgentCallData(cid)
        this.setState({
            show: true
        })
    }
    handleDownload = async (id) => {
        const link = document.createElement('a');
        link.href = await this.fetchAudio(id);
        link.download = 'downloaded-audio.wav';
        link.click();
    }
    setAudioSrc = async (id) => {
        const audioElement = document.getElementById(id)
        const url = this.fetchAudio(id)
        audioElement.setAttribute("src", await url);
    }

    render() {
        return (
            <div className={styles.page}>
                <Sidebar/>
                <div style={{width:"85%"}} className={"p-3"}>
                    <Card>
                        <Card.Header>Введите детали</Card.Header>
                        <Card.Body>
                            <Form.Group className={"d-flex"}>
                                <Form.Control type={"date"} onChange={this.handleStartDateChange}/>
                                <Form.Control type={"date"} className={styles.inputDateTime}
                                              onChange={this.handleEndDateChange}/>
                                <Form.Control type={"time"} className={styles.inputDateTime}
                                              onChange={this.handleStartTimeChange}/>
                                <Form.Control type={"time"} className={styles.inputDateTime}
                                              onChange={this.handleEndTimeChange}/>
                                <Button variant={"outline-primary"} onClick={this.handleSubmit}
                                        className={styles.inputDateTime}>Показать</Button>
                                <DownloadTableExcel filename="users table" sheet="users"
                                                    currentTableRef={this.tableRef.current}>
                                    <Button variant={"outline-success"}
                                            className={styles.inputDateTime}> Экспорт</Button>
                                </DownloadTableExcel>
                            </Form.Group>
                            <Form.Group className={"mt-3 d-flex align-items-center"} style={{width: ""}}>
                                <Form.Select aria-label="Default select example" onChange={this.handleSearchChange}>
                                    <option>Найти по фио</option>
                                    <option>Найти по номеру источника</option>
                                </Form.Select>
                            </Form.Group>
                            <Form.Group className={"mt-3 d-flex"}>
                                <Form.Control type={"search"} placeholder={this.state.search}
                                              onChange={this.handleInputChange}/>
                                <Button variant={"outline-primary"} onClick={this.handleSearchByNumber}>Найти</Button>
                            </Form.Group>
                        </Card.Body>
                    </Card>
                    <div className={`mt-3`} style={{width: "1230px"}}>
                        <Table responsive={true} striped bordered hover>
                            <thead>
                            <tr>
                                <th scope="col">Дата</th>
                                <th scope="col">Источник</th>
                                <th scope="col">Язык</th>
                                <th scope="col">ФИО</th>
                                <th scope="col">Статус</th>
                                <th scope="col">Продолжительность</th>
                                <th scope="col">Ожидание</th>
                                <th scope="col">Перенап</th>
                                <th scope="col">Подключился</th>
                                <th scope="col">Отключился</th>
                                <th scope="col">Разговор</th>
                                <th scope="col">Оценка</th>
                                <th scope="col">Сбросил</th>
                                <th scope="col">Скачать</th>
                                <th scope="col">Аудио</th>
                            </tr>
                            </thead>
                            <tbody>
                            {
                                this.state.res.map(cur => (
                                    <tr>
                                        <td>{cur.calldate.replace('T', " ")}</td>
                                        <td>{cur.src}</td>
                                        <td>{cur.language}</td>
                                        <td>{this.state.agents[cur.dst]}</td>
                                        <td>{this.getDispositionInRussian(cur.disposition)}</td>
                                        <td>{this.formatTime(cur.duration)}</td>
                                        <td>{this.formatTime(cur.waiting)}</td>
                                        <td>
                                            <button onClick={() => this.openAgentCallData(cur.uniqueid)}>Показать
                                                историю
                                            </button>
                                        </td>
                                        <td>{cur.connect != null && cur.connect.replace('T', " ")}</td>
                                        <td>{cur.disconnect != null && cur.disconnect.replace('T', " ")}</td>
                                        <td>{this.formatTime(cur.durationConsult)}</td>
                                        <td>{cur.rating}</td>
                                        <td>{cur.dropped === 1 ? "Агент" : "Пользователь"}</td>
                                        <td>
                                            {
                                                (cur.disposition === "CANCEL" || cur.disposition === "NO ANSWER") ? "Не состоялся" :
                                                    <button
                                                        onClick={() => this.handleDownload(cur.uniqueid)}>Скачать
                                                    </button>
                                            }
                                        </td>
                                        <td>
                                            {
                                                (cur.disposition === "CANCEL" || cur.disposition === "NO ANSWER") ? "Не состоялся" :
                                                    <div className={"d-flex"}>
                                                        <button
                                                            onClick={() => this.setAudioSrc(cur.uniqueid)}>Прослушать
                                                        </button>
                                                        <audio id={cur.uniqueid} controls type="audio/wav"/>
                                                    </div>
                                            }
                                        </td>
                                    </tr>
                                ))
                            }
                            </tbody>
                        </Table>
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
                            <Table className={"w-100 table"}>
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
                                            <td>{this.getAgentById(cur.agentid)}</td>
                                            <td>{this.getDispositionInRussian(cur.disposition)}</td>
                                        </tr>
                                    ))
                                }
                                </tbody>
                            </Table>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => this.setState({show: false})}>
                            Закрыть
                        </Button>
                    </Modal.Footer>
                </Modal>
                <Table className={styles.hiddenTable} ref={this.tableRef}>
                    <thead>
                    <tr>
                        <th scope="col">Дата</th>
                        <th scope="col">Источник</th>
                        <th scope="col">Язык</th>
                        <th scope="col">ФИО</th>
                        <th scope="col">Статус</th>
                        <th scope="col">Продолжительность</th>
                        <th scope="col">Ожидание</th>
                        <th scope="col">Подключился</th>
                        <th scope="col">Отключился</th>
                        <th scope="col">Разговор</th>
                        <th scope="col">Оценка</th>
                        <th scope="col">Сбросил</th>
                    </tr>
                    </thead>
                    <tbody>
                    {
                        this.state.res.map(cur => (
                            <tr>
                                <td>{cur.calldate.replace('T', " ")}</td>
                                <td>{cur.src}</td>
                                <td>{cur.language}</td>
                                <td>{this.state.agents[cur.dst]}</td>
                                <td>{this.getDispositionInRussian(cur.disposition)}</td>
                                <td>{this.formatTime(cur.duration)}</td>
                                <td>{this.formatTime(cur.waiting)}</td>
                                <td>{cur.connect != null && cur.connect.replace('T', " ")}</td>
                                <td>{cur.disconnect != null && cur.disconnect.replace('T', " ")}</td>
                                <td>{this.formatTime(cur.durationConsult)}</td>
                                <td>{cur.rating}</td>
                                <td>{cur.dropped === 1 ? "Агент" : "Пользователь"}</td>
                            </tr>
                        ))
                    }
                    </tbody>
                </Table>
            </div>
        )
    }
}

export default connect(Main.mapStateToProps, Main.mapDispatchToProps)(Main)