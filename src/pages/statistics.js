import React from "react";
import styles from "../assets/css/statistics.module.css"
import Sidebar from "../components/sidebar";
import axios from "axios";
import 'chart.js/auto';
import {Pie} from 'react-chartjs-2';

class Statistics extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dispositionCountByAccount: {},
            dispositionCount: [],
            allCalldata: [],
            data: {
                labels: ['Принятые', 'Не дождались ответа'],
                datasets: [
                    {
                        data: [0, 0],
                        backgroundColor: ['#FF6384', '#36A2EB']
                    }
                ]
            }
        }
    }

    renderComponents = () => {
        axios.get("http://172.16.3.185:8080/api/dispositionCountByAccount").then(res => {
            const r = {}
            res.data.forEach(cur => {
                r[cur.src] = {
                    ...r[cur.src],
                    [cur.disposition]: cur.count
                }
            })
            console.log(r)
            this.setState({
                dispositionCountByAccount: r
            })
        })
        axios.get("http://172.16.3.185:8080/api/dispositionCount").then(res => {
            this.setState({
                dispositionCount: res.data
            })
            const foundCancel = res.data.find(val => val.disposition === "CANCEL")
            const foundAnswered = res.data.find(val => val.disposition === "ANSWERED")
            this.setState({
                data: {
                    ...this.state.data,
                    datasets: [
                        {
                            data: [foundAnswered != null ? foundAnswered.count : 0, foundCancel != null ? foundCancel.count : 0],
                            backgroundColor: ['#FF6384', '#36A2EB']
                        }
                    ]
                }
            })
        })
        axios.get("http://172.16.3.185:8080/api/getAllCalldata").then(res => {
            this.setState({
                allCalldata: res.data
            })
        })
    }

    componentDidMount() {
        this.renderComponents()
    }


    options = {
        maintainAspectRatio: false, // Disable the default aspect ratio
        responsive: true, // Allow the chart to be responsive
    };
    update = () => {
        this.renderComponents()
    }

    render() {
        return (
            <div className={styles.page}>
                <Sidebar/>
                <div className={"w-100 p-3"}>
                    <div className={styles.left_right}>
                        <div className={styles.left}>
                            <h3>Сводная статистика</h3>
                            <p className={styles.left_item}>Всего звонков {this.state.allCalldata.length}</p>
                            <p className={styles.left_item}>Принятые {this.state.dispositionCount.length !== 0 && this.state.dispositionCount.find(val => val.disposition === "ANSWERED").count}</p>
                            <p className={styles.left_item}>Не дождались
                                ответа {this.state.dispositionCount.find(val => val.disposition === "CANCEL") == null ? 0 : this.state.dispositionCount.find(val => val.disposition === "CANCEL").count}</p>
                        </div>
                        <div className={styles.right}>
                            <Pie data={this.state.data} options={this.options}/>
                        </div>
                    </div>
                    <div className={"w-100 table-responsive mt-5"}>
                        <table className={"table"}>
                            <thead>
                            <tr>
                                <th>Агент</th>
                                <th>Принятые</th>
                                <th>Не дождались ответа</th>
                            </tr>
                            </thead>
                            <tbody>
                            {
                                Object.entries(this.state.dispositionCountByAccount).map(([key, value]) => (
                                    <tr>
                                        <td>{key}</td>
                                        <td>{this.state.dispositionCountByAccount[key].hasOwnProperty('ANSWER') ? value.ANSWER : 0}</td>
                                        <td>{this.state.dispositionCountByAccount[key].hasOwnProperty('CANCEL') ? value.CANCEL : 0}</td>
                                    </tr>
                                ))
                            }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        )
    }
}

export default Statistics