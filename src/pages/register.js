import React from "react";
import Sidebar from "../components/sidebar";
import styles from "../assets/css/register.module.css"
import axios from "axios";
import {connect} from "react-redux";
import {goto, toggle} from "../redux/reducer";

class Register extends React.Component {
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
    register = (e) => {
        e.preventDefault()
        axios.post('http://localhost:8080/api/user', {
            login: this.state.login,
            password: this.state.password,
            repeatPassword: this.state.repeatPassword
        }).then(response => {
            this.setState({
                text: response.data
            })
        }).catch(error => {
            this.setState({
                text: "Error in the server"
            })
            console.error(error);
        });
        this.setState({
            login: "",
            password: "",
            repeatPassword: "",
            text: "User created"
        })
    }

    render() {
        return (
            <div className={styles.back}>
                <Sidebar/>
                <div className={"container w-100 d-flex justify-content-center"}>
                    <form>
                        <p> Зарегистрировать пользователя</p>
                        <hr/>
                        <div className={"d-flex flex-column"}>
                            <input type={"text"} placeholder={"Логин"} onChange={this.handleLoginChange}
                                   value={this.state.login}/>
                            <input className={"mt-2"} type={"password"} placeholder={"Пароль"}
                                   onChange={this.handlePasswordChange} value={this.state.password}/>
                            <input className={"mt-2"} type={"password"} placeholder={"Повторите пароль"}
                                   onChange={this.handleRepeatPasswordChange} value={this.state.repeatPassword}/>
                        </div>
                        <label>
                            <input type="checkbox" name="happy" value="yes"/> Пользователь
                        </label>
                        <br/>
                        <label>
                            <input type="checkbox" name="happy" value="yes"/> Админ
                        </label>
                        <br/>
                        <label>
                            <input type="checkbox" name="happy" value="yes"/> Менеджер
                        </label>
                        <br/>
                        <button onClick={this.register}>Зарегистрировать</button>
                        {
                            this.state.text !== "" && (
                                <div
                                    className={this.state.text === "User created" ? styles.alert_success : styles.alert_error}>
                                    {this.state.text}
                                </div>
                            )
                        }
                    </form>
                </div>
            </div>
        );
    }
}

export default connect(Register.mapStateToProps, Register.mapDispatchToProps)(Register)