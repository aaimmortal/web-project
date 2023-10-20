import React from "react";
import styles from '../assets/css/addAgent.module.css'
import Sidebar from "../components/sidebar";
import axios from "axios";
import {Button, Card, Form} from "react-bootstrap";
import {connect} from "react-redux";
import {goto, toggle} from "../redux/reducer";
import {isExpired} from "react-jwt";
import Topbar from "../components/topbar";

class AddAgent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            login: "",
            password: "",
            repeatPassword: "",
            text: ""
        }
    }

    componentDidMount() {
        const token = localStorage.getItem("jwt")
        console.log(token)
        if (isExpired(token)) {
            window.location.href = "http://localhost:3000/"
        }
    }
    componentWillMount() {
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

    handleLoginChange = (e) => {
        this.setState({
            login: e.target.value,
        })
    }
    handlePasswordChange = (e) => {
        this.setState({
            password: e.target.value,
        })
    }

    handleRepeatPasswordChange = (e) => {
        this.setState({
            repeatPassword: e.target.value,
        })
    }
    add = (e) => {
        e.preventDefault()
        if (this.state.password !== this.state.repeatPassword) {
            this.setState({
                text: "Пароли не совпадают"
            })
            return
        }
        axios.get("http://172.16.3.185:8080/api/agents").then(res => {
            const arr = res.data
            if (arr.includes(this.state.login)) {
                this.setState({
                    text: "Агент существует"
                })
                return
            }
        })
        // axios.post('http://172.16.3.185:8080/api/agent', {
        //     agentName: this.state.login,
        //     agentSecret: this.state.password,
        //     agentContext: "internal",
        // }).then(response => {
        //     this.setState({
        //         text: "Агент был добавлен"
        //     })
        // }).catch(error => {
        //     this.setState({
        //         text: "Ошибка в добавлений"
        //     })
        //     console.error(error);
        // });
        // this.setState({
        //     login: "",
        //     password: "",
        //     repeatPassword: "",
        // })
    }

    render() {
        return (
            <div>
                <Topbar/>
                <div className={styles.page}>
                    <Sidebar/>
                    <div style={{width: "80%"}} className={"d-flex justify-content-center align-items-center"}>
                        <Card className={"w-50"}>
                            <Card.Header>Добавить агента</Card.Header>
                            <Card.Body>
                                <Form.Group>
                                    <div className={"d-flex flex-column"}>
                                        <Form.Control type={"text"} placeholder={"Логин"}
                                                      onChange={this.handleLoginChange}/>
                                        <Form.Control className={"mt-2"} type={"password"} placeholder={"Пароль"}
                                                      onChange={this.handlePasswordChange}/>
                                        <Form.Control className={"mt-2"} type={"password"}
                                                      placeholder={"Повторите пароль"}
                                                      onChange={this.handleRepeatPasswordChange}/>
                                    </div>
                                    <br/>
                                    <Button variant={"outline-primary"} onClick={this.add}>Добавить</Button>
                                    {
                                        this.state.text !== "" && (
                                            <div
                                                className={this.state.text === "User created" ? styles.alert_success : styles.alert_error}>
                                                {this.state.text}
                                            </div>
                                        )
                                    }
                                </Form.Group>
                            </Card.Body>
                        </Card>
                    </div>
                </div>
            </div>
        )
    }
}

export default connect(AddAgent.mapStateToProps, AddAgent.mapDispatchToProps)(AddAgent)