import React from "react";
import styles from '../assets/css/agent.module.css'
import sharedStyles from '../assets/css/shared.module.css'
import {Button, Card, Form, Table} from "react-bootstrap";
import axios from "axios";
import {DownloadTableExcel} from "react-export-table-to-excel";
import {goto, toggle} from "../redux/reducer";
import {connect} from "react-redux";
import {isExpired} from "react-jwt";
import Wrapper from "../components/Wrapper";

class Agent extends React.Component {
    componentDidMount() {
        const token = localStorage.getItem("jwt")
        console.log(token)
        if (isExpired(token)) {
            window.location.href = "http://localhost:3000/"
        }

        axios.get("http://172.16.3.185:8088/ari/endpoints",
            {
                auth: {
                    username: 'myuser',
                    password: 'mypassword'
                },
                headers: {
                    "Authorization": "Basic bXl1c2VyOm15cGFzc3dvcmQ="
                },
                'Access-Control-Allow-Credentials': true
            }).then(res => {
            console.log(res)
        }).catch(err => {
            console.log(err)
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

    getNameByNumber = (number) => {
        switch (number) {
            case "7001":
                return 'Каламкас'
            case "7002":
                return 'Аружан'
            default:
                return "-"
        }
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
    handleSearch = () => {
        let target = ""
        for (const key in this.state.agents) {
            if (this.state.agents[key] === this.state.searchValue) {
                target = key
                break
            }
        }
        const filteredData = this.state.data.filter(item => item.agentid === target)
        this.setState({
            data: filteredData
        })
    }

    render() {
        return (
            <div>
                <Wrapper>
                    <Card>
                        <Card.Header>Введите детали</Card.Header>
                        <Card.Body>
                            <Form.Group className={sharedStyles.formGroup}>
                                <Form.Control type={"date"} onChange={this.handleStartDateChange}/>
                                <Form.Control type={"date"} className={sharedStyles.input}
                                              onChange={this.handleEndDateChange}/>
                                <Form.Control type={"time"} className={sharedStyles.input}
                                              onChange={this.handleStartTimeChange}/>
                                <Form.Control type={"time"} className={sharedStyles.input}
                                              onChange={this.handleEndTimeChange}/>
                                <Button type={"button"} variant={"outline-primary"} className={sharedStyles.input}
                                        onClick={this.handleSubmit}>Показать</Button>
                                <DownloadTableExcel filename="users table" sheet="users"
                                                    currentTableRef={this.tableRef.current}>
                                    <Button variant={"outline-success"}
                                            className={sharedStyles.input}> Экспорт</Button>
                                </DownloadTableExcel>
                            </Form.Group>
                            <Form.Group className={`${sharedStyles.formGroup} mt-3`}>
                                <Form.Control type={"search"} placeholder={"Найти по агенту"}
                                              onChange={this.handleInputChange}/>
                                <Button variant={"outline-primary"} onClick={this.handleSearch}>Найти</Button>
                            </Form.Group>
                        </Card.Body>
                    </Card>
                    <div className={"p-3"}>
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
                </Wrapper>
            </div>
        )
    }
}

export default connect(Agent.mapStateToProps, Agent.mapDispatchToProps)(Agent)