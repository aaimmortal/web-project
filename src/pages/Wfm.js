import React from "react";
import styles from '../assets/css/wfm.module.css'
import Sidebar from "../components/sidebar";
import axios from "axios";
import Timeline from 'react-calendar-timeline'
import moment from "moment";
import 'react-calendar-timeline/lib/Timeline.css'
import Select from 'react-select';
import {Button, Card, Form} from "react-bootstrap";
import {goto, toggle} from "../redux/reducer";
import {connect} from "react-redux";
import {isExpired} from "react-jwt";
import Topbar from "../components/topbar";

class Wfm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            searchAgent: "7001",
            date: "",
            items: [],
            groups: [],
            selectedOptions: [],
            options: [
                {label: '7001', value: '7001'},
                {label: '7002', value: '7002'},
            ],
            key: true,
            show: false,
            start: moment().startOf("day").toDate(),
            end: moment().startOf("day").add(1, "day").toDate(),
            time1: "",
            time2: ""
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

    handleDateChange = (e) => {
        this.setState({
            date: e.target.value
        })
    }

    handleSubmit = () => {
        const time1 = this.state.time1 === "" ? "00:00:00" : `${this.state.time1}:00`
        const time2 = this.state.time2 === "" ? "23:59:59" : `${this.state.time2}:59`
        const agents = this.state.selectedOptions.map(cur => cur.value).join(" ")
        axios.get("http://172.16.3.185:8080/api/wfmGraph", {
            params: {
                agents: agents,
                date: this.state.date
            }
        }).then(res => {
            const temp = res.data
            const items = []
            const groups = []
            for (let i = 0; i < temp.length; i++) {
                groups.push({
                    id: i,
                    title: this.state.selectedOptions[i].value
                })
                for (let j = 0; j < temp[i].length - 1; j++) {
                    items.push({
                        id: j,
                        group: i,
                        start_time: moment(temp[i][j].date),
                        end_time: moment(temp[i][j + 1].date),
                        itemProps: {
                            style: {
                                background: (temp[i][j].action === "Login" || temp[i][j].action === "UNPAUSED") ? 'green' : 'red'
                            },
                            className: '',
                        }
                    })
                }
            }
            this.setState({
                items: items,
                groups: groups,
                start: moment(this.state.date + " " + time1),
                end: moment(this.state.date + " " + time2),
                show: true,
                key: !this.state.key
            })
            console.log(moment(this.state.date))
        })
    }
    handleSelectChange = (selected) => {
        this.setState({
            selectedOptions: selected
        });
    };
    handleStartTimeChange = (e) => {
        this.setState({
            time1: e.target.value
        })
    }
    handleEndTimeChange = (e) => {
        this.setState({
            time2: e.target.value
        })
    }
    handleWeekChange = (e) => {
        console.log(e.target.value)
    }

    render() {
        return (
            <div>
                <Topbar/>
                <div className={styles.page}>
                    <Sidebar/>
                    <div style={{width: "85%"}} className={"p-3"}>
                        <Card>
                            <Card.Header>Введите детали</Card.Header>
                            <Card.Body className={"w-100 d-flex align-items-center"}>
                                <Select
                                    options={this.state.options}
                                    isMulti
                                    value={this.selectedOptions}
                                    onChange={this.handleSelectChange}
                                />
                                <Form.Group className={"d-flex"}>
                                    <Form.Control className={styles.inputDate} type={"date"}
                                                  onChange={this.handleDateChange}/>
                                    <Form.Control className={styles.inputDate} type={"time"}
                                                  onChange={this.handleStartTimeChange}/>
                                    <Form.Control className={styles.inputDate} type={"time"}
                                                  onChange={this.handleEndTimeChange}/>
                                    <Form.Control className={styles.inputDate} type={"week"}
                                                  onChange={this.handleWeekChange}/>
                                    <Button variant={"outline-primary"} className={"ms-1"}
                                            onClick={this.handleSubmit}>Показать</Button>
                                </Form.Group>
                            </Card.Body>
                        </Card>
                        <div className={"mt-3"}>
                            {
                                this.state.show && <Timeline
                                    key={this.state.key}
                                    style={{maxWidth: "1260px"}}
                                    groups={this.state.groups}
                                    items={this.state.items}
                                    canMove={false}
                                    canResize={false}
                                    defaultTimeStart={this.state.start}
                                    defaultTimeEnd={this.state.end}
                                />
                            }
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default connect(Wfm.mapStateToProps, Wfm.mapDispatchToProps)(Wfm)