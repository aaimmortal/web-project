import React from "react";
import styles from '../assets/css/wfm.module.css'
import Sidebar from "../components/sidebar";
import axios from "axios";
import Timeline from 'react-calendar-timeline'
import moment from "moment";
import 'react-calendar-timeline/lib/Timeline.css'

class Wfm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            searchAgent: "7001",
            date: "",
            res: [],
            items: [],
            groups: [
                {
                    id: 1,
                    title: "7001"
                }
            ]

        }
    }

    handleSearchChange = (e) => {
        this.setState({
            searchAgent: e.target.value
        })
    }
    handleDateChange = (e) => {
        this.setState({
            date: e.target.value
        })
    }
    items = [
        {
            id: 1,
            group: 1,
            title: 'item 1',
            start_time: moment("2023-10-10T14:30:00"),
            end_time: moment("2023-10-10T14:30:00").add(1, 'hour'),
        },
        {
            id: 2,
            group: 2,
            title: 'item 2',
            start_time: moment().add(-0.5, 'hour'),
            end_time: moment().add(0.5, 'hour')
        },
        {
            id: 3,
            group: 1,
            title: 'item 3',
            start_time: moment().add(2, 'hour'),
            end_time: moment().add(3, 'hour')
        }
    ]

    handleSubmit = () => {
        axios.get("http://172.16.3.185:8080/api/wfmGraph", {
            params: {
                agentid: this.state.searchAgent,
                date: this.state.date
            }
        }).then(res => {

            const temp = res.data
            const items = []
            for (let i = 0; i < temp.length - 1; i++) {
                items.push({
                    id: i,
                    group: 1,
                    title: temp[i].action === "UNPAUSED" ? "Login" : temp[i].action,
                    start_time: moment(temp[i].date),
                    end_time: moment(temp[i + 1].date),
                    itemProps: {
                        style: {
                            background: (temp[i].action === "Login" || temp[i].action ===  "UNPAUSED") ? 'green' : 'red'
                        }
                    }
                })
            }
            this.setState({
                res: res.data,
                items: items
            })
            console.log(items)
        })
    }

    render() {
        return (
            <div className={styles.page}>
                <Sidebar/>
                <div className={"w-100 p-3"}>
                    <div className={"w-100"}>
                        <select onChange={this.handleSearchChange}>
                            <option>7001</option>
                            <option>7002</option>
                        </select>
                        <input name={"date"} className={styles.inputDate} type={"date"}
                               onChange={this.handleDateChange}/>
                        <input type={"button"} className={styles.inputDate} onClick={this.handleSubmit}
                               value={"Показать"}/>
                    </div>
                    <div className={"mt-3"} style={{maxWidth: "100%"}}>
                        <Timeline
                            style={{width: "1200px"}}
                            groups={this.state.groups}
                            items={this.state.items}
                            defaultTimeStart={moment().add(-12, 'hour')}
                            defaultTimeEnd={moment().add(12, 'hour')}
                        />
                    </div>
                </div>
            </div>
        )
    }
}

export default Wfm