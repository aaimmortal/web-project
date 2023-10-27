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
import TimelineHeaders from "react-calendar-timeline/lib/lib/headers/TimelineHeaders";
import DateHeader from "react-calendar-timeline/lib/lib/headers/DateHeader";
import SidebarHeader from "react-calendar-timeline/lib/lib/headers/SidebarHeader";

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
            start: moment().startOf("day").toDate(),
            end: moment().startOf("day").add(23, "hour").toDate(),
            weekStart: moment().startOf("day").toDate(),
            weekEnd: moment().startOf("day").add(23, "hour").toDate(),
            time1: "",
            time2: "",
            weekTime1: "",
            weekTime2: "",
            currentPage: 0,
            weeks: [
                {
                    id: 0,
                    title: 'Пн.'
                },
                {
                    id: 1,
                    title: 'Вт.'
                },
                {
                    id: 2,
                    title: 'Ср.'
                },
                {
                    id: 3,
                    title: 'Чт.'
                },
                {
                    id: 4,
                    title: 'Пт.'
                },
                {
                    id: 5,
                    title: 'Сб.'
                },
                {
                    id: 6,
                    title: 'Вс.'
                },
            ],
            week: "",
            selectedAgentByWeek: "7001",
            weekItems: [],
            weekGroups: [],
            weekKey: false,
            active: 0,
            currentDay: ""
        }
    }

    componentDidMount() {
        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
        const day = String(currentDate.getDate()).padStart(2, '0');
        const formattedDate = `${year}-${month}-${day}`;
        this.setState({
            currentDay: formattedDate
        })
    }

    componentWillMount() {
        // const token = localStorage.getItem("jwt")
        // console.log(token)
        // if (isExpired(token)) {
        //     window.location.href = "http://localhost:3000/"
        // }
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
    handleWeekChange = (e) => {
        this.setState({
            week: e.target.value
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
                                background: (temp[i][j].action === "Login" || temp[i][j].action === "UNPAUSED") ? '#5bc0de' : '#f0ad4e'
                            }
                        }
                    })
                }
            }
            this.setState({
                items: items,
                groups: groups,
                start: moment(this.state.date + " " + time1),
                end: moment(this.state.date + " " + time2),
                key: !this.state.key
            })
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
    handleSelectedAgentByWeek = (e) => {
        this.setState({
            selectedAgentByWeek: e.target.value
        })
    }
    handleWeekTime1Change = (e) => {
        this.setState({
            weekTime1: e.target.value
        })
    }
    handleWeekTime2Change = (e) => {
        this.setState({
            weekTime2: e.target.value
        })
    }
    getDays = async () => {
        const time1 = this.state.weekTime1 === "" ? "00:00:00" : `${this.state.weekTime1}:00`
        const time2 = this.state.weekTime2 === "" ? "23:59:59" : `${this.state.weekTime2}:59`
        const [year, week] = this.state.week.split('-W');
        if (year && week) {
            const startDate = new Date(year, 0, 2); // January 1st of the selected year
            const daysInWeek = 7;
            const startOfWeek = new Date(startDate);
            startOfWeek.setDate(startOfWeek.getDate() + (week - 1) * daysInWeek);
            const days = [];
            for (let i = 0; i < daysInWeek; i++) {
                const date = new Date(startOfWeek);
                date.setDate(date.getDate() + i);
                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based, so add 1 and pad with '0'
                const day = String(date.getDate()).padStart(2, '0');
                const formattedDate = `${year}-${month}-${day}`;
                days.push(formattedDate);
            }
            const agent = this.state.selectedAgentByWeek
            const groups = []
            const items = []
            for (let c = 0; c < days.length; c++) {
                const response = await axios.get("http://172.16.3.185:8080/api/wfmGraph", {
                    params: {
                        agents: agent,
                        date: days[c]
                    }
                })
                if (response.status === 200) {
                    const temp = response.data
                    groups.push({
                        id: c,
                        title: this.state.weeks[c].title + " " + days[c]
                    })
                    for (let i = 0; i < temp.length; i++) {
                        for (let j = 0; j < temp[i].length - 1; j++) {
                            items.push({
                                id: j,
                                group: c,
                                start_time: moment(this.state.currentDay + " " + temp[i][j].date.split('T')[1]),
                                end_time: moment(this.state.currentDay + " " + temp[i][j + 1].date.split('T')[1]),
                                itemProps: {
                                    style: {
                                        background: (temp[i][j].action === "Login" || temp[i][j].action === "UNPAUSED") ? '#5bc0de' : '#f0ad4e'
                                    }
                                }
                            })
                        }
                    }

                }
            }
            this.setState({
                weekGroups: groups,
                weekItems: items,
                weekKey: !this.state.weekKey,
                weekStart: moment(this.state.currentDay + " " + time1),
                weekEnd: moment(this.state.currentDay + " " + time2)
            })
        }
    };
    changeActive = (e) => {
        this.setState({
            active: e
        })
    }

    render() {
        return (
            <div>
                <Topbar/>
                <div className={styles.page}>
                    <Sidebar/>
                    <div className={styles.slider}>
                        <div className={this.state.active === 0 ? styles.active : styles.NotActive}>
                            <nav className={"shadow-sm"}>
                                <div className={`${styles.sliderMenuItemActive}`}>График по дням</div>
                                <div onClick={() => this.changeActive(1)}>График по неделям</div>
                            </nav>
                            <Card className={styles.card}>
                                <Card.Header>Введите детали</Card.Header>
                                <Card.Body className={styles.cardBody}>
                                    <Select
                                        options={this.state.options}
                                        isMulti
                                        value={this.selectedOptions}
                                        onChange={this.handleSelectChange}
                                    />
                                    <Form.Group className={styles.form}>
                                        <Form.Control className={styles.inputDate} type={"date"}
                                                      onChange={this.handleDateChange}/>
                                        <Form.Control className={styles.inputDate} type={"time"}
                                                      onChange={this.handleStartTimeChange}/>
                                        <Form.Control className={styles.inputDate} type={"time"}
                                                      onChange={this.handleEndTimeChange}/>
                                        <Button variant={"outline-primary"} className={"ms-1"}
                                                onClick={this.handleSubmit}>Показать</Button>
                                    </Form.Group>
                                </Card.Body>
                            </Card>
                            <div className={"mt-3"}>
                                <Timeline
                                    minZoom={60 * 60 * 1000 * 24}
                                    maxZoom={60 * 60 * 1000 * 24}
                                    key={this.state.key}
                                    groups={this.state.groups}
                                    items={this.state.items}
                                    canMove={false}
                                    canResize={false}
                                    defaultTimeStart={this.state.start}
                                    defaultTimeEnd={this.state.end}
                                >
                                    <TimelineHeaders style={{backgroundColor: "#34495e"}}>
                                        <SidebarHeader>
                                            {({getRootProps}) => {
                                                return <div {...getRootProps({
                                                    style: {
                                                        color: "white",
                                                        display: "flex",
                                                        justifyContent: "center",
                                                        alignItems: "center"
                                                    }
                                                })}>Операторы</div>
                                            }}
                                        </SidebarHeader>
                                        <DateHeader unit="primaryHeader"/>
                                        <DateHeader/>
                                    </TimelineHeaders>
                                </Timeline>
                            </div>
                        </div>
                        <div className={this.state.active === 1 ? styles.active : styles.NotActive}>
                            <nav className={"shadow-sm"}>
                                <div onClick={() => this.changeActive(0)}>График по дням</div>
                                <div className={`${styles.sliderMenuItemActive}`}>График по неделям</div>
                            </nav>
                            <Card className={"mt-2"}>
                                <Card.Header>Введите детали</Card.Header>
                                <Card.Body className={"d-flex align-items-center"}>
                                    <Form.Select onChange={this.handleSelectedAgentByWeek} className={styles.select}>
                                        {
                                            this.state.options.map(cur => (
                                                <option>{cur.value}</option>
                                            ))
                                        }
                                    </Form.Select>
                                    <Form.Group className={"d-flex"}>
                                        <Form.Control className={styles.inputDate} type={"week"}
                                                      onChange={this.handleWeekChange}/>
                                        <Form.Control className={styles.inputDate} type={"time"}
                                                      onChange={this.handleWeekTime1Change}/>
                                        <Form.Control className={styles.inputDate} type={"time"}
                                                      onChange={this.handleWeekTime2Change}/>
                                        <Button variant={"outline-primary"} className={"ms-1"}
                                                onClick={this.getDays}>Показать</Button>
                                    </Form.Group>
                                </Card.Body>
                            </Card>
                            <div className={"mt-3"}>
                                <Timeline
                                    minZoom={60 * 60 * 1000 * 24}
                                    maxZoom={60 * 60 * 1000 * 24}
                                    key={this.state.weekKey}
                                    groups={this.state.weekGroups}
                                    items={this.state.weekItems}
                                    canMove={false}
                                    canResize={false}
                                    defaultTimeStart={this.state.weekStart}
                                    defaultTimeEnd={this.state.weekEnd}
                                >
                                    <TimelineHeaders style={{backgroundColor: "#34495e"}}>
                                        <SidebarHeader>
                                            {({getRootProps}) => {
                                                return <div {...getRootProps({
                                                    style: {
                                                        color: "white",
                                                        display: "flex",
                                                        justifyContent: "center",
                                                        alignItems: "center"
                                                    }
                                                })}>Дни недели</div>
                                            }}
                                        </SidebarHeader>
                                        <DateHeader style={{display: "none"}} unit="primaryHeader"/>
                                        <DateHeader/>
                                    </TimelineHeaders>
                                </Timeline>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default connect(Wfm.mapStateToProps, Wfm.mapDispatchToProps)(Wfm)