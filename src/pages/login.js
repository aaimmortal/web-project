import React from "react";
import styles from '../assets/css/login.module.css'
import sharedStyles from '../assets/css/shared.module.css'
import axios from "axios";
import {Button, Card, Form} from "react-bootstrap";

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            login: "",
            password: "",
            errorText: ""
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
    login = (e) => {
        e.preventDefault()
        axios.post('http://172.16.3.185:8080/api/login', {
            login: this.state.login,
            password: this.state.password
        }).then(response => {
            if (response.status === 200) {
                const token = response.data;
                const payload = token.split('.')[1];
                const decodedPayload = atob(payload);
                console.log(JSON.parse(decodedPayload));
                localStorage.setItem("jwt", token)
                localStorage.setItem("user", decodedPayload)
                window.location.href = `http://localhost:3000/main`
            } else {
                this.setState({
                    errorText: "Invalid login or password!"
                })
            }
        }).catch(error => {
            this.setState({
                errorText: "Invalid login or password!"
            })
            console.error(error);
        });
    }

    render() {
        return (
            <div className={styles.page}>
                <div className={"w-100 h-100 d-flex justify-content-center align-items-center"}>
                    <Card>
                        <Card.Body className={"p-5"}>
                            <Form.Floating>
                                <h5> Введите имя пользователя и пароль</h5>
                                <hr/>
                                <div>
                                    <Form.Control type={"text"} placeholder={"Логин"}
                                                  onChange={this.handleLoginChange}/>
                                    <Form.Control className={"mt-2"} type={"password"} placeholder={"Пароль"}
                                                  onChange={this.handlePasswordChange}/>
                                </div>
                                <Button variant={"outline-primary"} className={"mt-3"}
                                        onClick={this.login}>Подключиться</Button>
                                {
                                    this.state.errorText !== "" && (
                                        <div className={sharedStyles.alert_error}>
                                            {this.state.errorText}
                                        </div>
                                    )
                                }
                            </Form.Floating>

                        </Card.Body>
                    </Card>
                </div>
            </div>
        )
    }
}

export default Login