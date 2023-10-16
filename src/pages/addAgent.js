import React from "react";
import styles from '../assets/css/addAgent.module.css'
import Sidebar from "../components/sidebar";
import axios from "axios";
import {Button, Form} from "react-bootstrap";

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
            <div className={styles.page}>
                <Sidebar/>
                <div className={"container w-100 d-flex justify-content-center align-items-center"}>
                    <Form.Group>
                        <h1> Добавить агента</h1>
                        <hr/>
                        <div className={"d-flex flex-column"}>
                            <Form.Control type={"text"} placeholder={"Логин"} onChange={this.handleLoginChange}/>
                            <Form.Control className={"mt-2"} type={"password"} placeholder={"Пароль"}
                                   onChange={this.handlePasswordChange}/>
                            <Form.Control className={"mt-2"} type={"password"} placeholder={"Повторите пароль"}
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
                </div>
            </div>
        )
    }
}

export default AddAgent