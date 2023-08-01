import React from "react";
import styles from '../assets/css/login.module.css'
import axios from "axios";

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
        axios.post('http://10.12.145.19:8080/api/login', {
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
                window.location.href = `http://10.12.145.19:3000/main`
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
                <div>
                    <div className={styles.banner}>
                        <p>Мониторинг записей телефонных звонков </p>
                    </div>
                    <div className={"w-100 d-flex justify-content-center"}>
                        <form>
                            <h5> Введите имя пользователя и пароль</h5>
                            <hr/>
                            <div className={"d-flex flex-column"}>
                                <input type={"text"} placeholder={"Логин"} onChange={this.handleLoginChange}/>
                                <input className={"mt-2"} type={"password"} placeholder={"Пароль"}
                                       onChange={this.handlePasswordChange}/>
                            </div>
                            <button onClick={this.login}>Подключиться</button>
                            {
                                this.state.errorText !== "" && (
                                    <div className={styles.alert_error}>
                                        {this.state.errorText}
                                    </div>
                                )
                            }
                        </form>
                    </div>
                </div>
            </div>
        )
    }
}

export default Login