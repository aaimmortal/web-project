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
            start: moment().startOf("day").toDate(),
            end: moment().startOf("day").add(1, "day").toDate()
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

    handleDateChange = (e) => {
        this.setState({
            date: e.target.value
        })
    }

    handleSubmit = () => {
        axios.get("http://172.16.3.185:8080/api/agents").then(res => {
            console.log(res.data)
        })
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
                            }
                        }
                    })
                }
            }
            this.setState({
                items: items,
                groups: groups,
                start: moment(this.state.date),
                end: moment(this.state.date).add(1, "day").toDate()
            })
        })
    }
    handleSelectChange = (selected) => {
        this.setState({
            selectedOptions: selected
        });
    };

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
                                    <Form.Control name={"date"} className={styles.inputDate} type={"date"}
                                                  onChange={this.handleDateChange}/>
                                    <Button variant={"outline-primary"} className={"ms-1"}
                                            onClick={this.handleSubmit}>Показать</Button>
                                </Form.Group>
                            </Card.Body>
                        </Card>
                        <div className={"mt-3"}>
                            <Timeline
                                style={{maxWidth: "1200px"}}
                                groups={this.state.groups}
                                items={this.state.items}
                                canMove={false}
                                canResize={false}
                                defaultTimeStart={this.state.start}
                                defaultTimeEnd={this.state.end}
                            />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default connect(Wfm.mapStateToProps, Wfm.mapDispatchToProps)(Wfm)