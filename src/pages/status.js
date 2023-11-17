import React from "react";
import Wrapper from "../components/Wrapper";
import {isExpired} from "react-jwt";
import {goto, toggle} from "../redux/reducer";
import {connect} from "react-redux";
import {Card, Table} from "react-bootstrap";
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import styles from "../assets/css/status.module.css"
import axios from "axios";

class Status extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            agentStatus: [],
            online: 0,
            paused: 0,
            offline: 0
        }
    }

    componentDidMount() {
        const token = localStorage.getItem("jwt")
        if (isExpired(token)) {
            window.location.href = "http://localhost:3000/"
        }
        this.connectWebSocket()
        axios.get("http://172.16.3.185:8080/api/agentStatus").then(res => {
            let online = 0
            let pause = 0
            let offline = 0
            const final = res.data.map(cur => {
                if (cur.status !== "Не доступен") online++
                if (cur.paused === "Да") pause++
                if (cur.status === "Не доступен") offline++
                let status = cur.status
                let statusColor
                switch (status) {
                    case "Не используется":
                        statusColor = "#8496a9"
                        break
                    case "В разговоре":
                        statusColor = "#5cb85c"
                        break
                    case "Не доступен":
                        statusColor = "#d9534f"
                        break
                    case "На удержаний":
                        statusColor = "#5bc0de"
                        break
                    default:
                        statusColor = "#d9534f"
                        break
                }
                let paused = cur.paused
                let pausedColor
                switch (paused) {
                    case "Да":
                        pausedColor = "#f0ad4e"
                        break
                    default:
                        pausedColor = "#0275d8"
                        break
                }
                return {
                    ...cur,
                    statusColor: statusColor,
                    pausedColor: pausedColor
                }
            })
            this.setState({
                agentStatus: final,
                online: online,
                paused: pause,
                offline: offline
            })
        })
    }

    componentWillMount() {
        const token = localStorage.getItem("jwt")
        console.log(token)
        if (isExpired(token)) {
            window.location.href = "http://localhost:3000/"
        }
        this.props.goto("GOTO", window.location.pathname)
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

    connectWebSocket = () => {
        const socket = new SockJS('http://172.16.3.185:8080/ws');
        const stompClient = Stomp.over(socket);

        stompClient.connect({}, frame => {
            console.log('Connected: ' + frame);
            stompClient.subscribe('/topic/agentStatus', message => {
                axios.get("http://172.16.3.185:8080/api/agentStatus").then(res => {
                    let online = 0
                    let pause = 0
                    let offline = 0
                    const final = res.data.map(cur => {
                        if (cur.status !== "Не доступен") online++
                        if (cur.paused === "Да") pause++
                        if (cur.status === "Не доступен") offline++
                        let status = cur.status
                        let statusColor
                        switch (status) {
                            case "Не используется":
                                statusColor = "#8496a9"
                                break
                            case "В разговоре":
                                statusColor = "#5cb85c"
                                break
                            case "Не доступен":
                                statusColor = "#d9534f"
                                break
                            case "На удержаний":
                                statusColor = "#5bc0de"
                                break
                            default:
                                statusColor = "#d9534f"
                                break
                        }
                        let paused = cur.paused
                        let pausedColor
                        switch (paused) {
                            case "Да":
                                pausedColor = "#f0ad4e"
                                break
                            default:
                                pausedColor = "#0275d8"
                                break
                        }
                        return {
                            ...cur,
                            statusColor: statusColor,
                            pausedColor: pausedColor
                        }
                    })
                    this.setState({
                        agentStatus: final,
                        online: online,
                        paused: pause,
                        offline: offline
                    })
                })
            });
        }, error => {
            console.error('WebSocket connection error: ', error);
        });
    }

    render() {
        return (
            <div>
                <Wrapper>
                    <div>
                        <Card>
                            <Card.Header style={{color: "black"}}>На линий: {this.state.online} / На паузе: {this.state.paused} / Не доступен: {this.state.offline}</Card.Header>
                        </Card>
                        <Table responsive={true} striped bordered hover className={"mt-3"}>
                            <thead>
                            <tr>
                                <th>ФИО</th>
                                <th>Агент</th>
                                <th>Статус</th>
                                <th>На паузе</th>
                                <th>Время последнего звонка</th>
                            </tr>
                            </thead>
                            <tbody>
                            {
                                this.state.agentStatus.map(cur => (
                                    <tr>
                                        <td>{cur.name}</td>
                                        <td>{cur.agentId}</td>
                                        <td style={{backgroundColor: cur.statusColor}}>{cur.status}</td>
                                        <td style={{backgroundColor: cur.pausedColor}}>{cur.paused}</td>
                                        <td>{cur.lastCall}</td>
                                    </tr>
                                ))
                            }
                            </tbody>
                        </Table>
                    </div>
                </Wrapper>
            </div>
        )
    }
}

export default connect(Status.mapStateToProps, Status.mapDispatchToProps)(Status)