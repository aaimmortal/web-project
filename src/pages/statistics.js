import React from "react";
import styles from "../assets/css/statistics.module.css"
import Sidebar from "../components/sidebar";
import axios from "axios";
import 'chart.js/auto';
import {Pie} from 'react-chartjs-2';
import {DownloadTableExcel} from 'react-export-table-to-excel'

class Statistics extends React.Component {
    constructor(props) {
        super(props);
        this.tableRef = React.createRef()
        this.state = {
            avgRating: 0,
            avgWaiting: 0,
            avgDurationConsult: 0,
            kz: 0,
            ru: 0,
            answered: 0,
            canceled: 0,
            dateTime: "",
            dateTime2: "",
            dispositionCountByAccount: {},
            dispositionCount: [],
            all: [],
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
        this.callDate()
    }
    callDate = () => {
        const start = this.state.dateTime === "" ? "" : `${this.state.dateTime} 00:00:00`
        const end = this.state.dateTime2 === "" ? "" : `${this.state.dateTime2} 23:59:59`
        axios.get("http://172.16.3.185:8080/api/dispositionCountByAccount",
            {
                params: {
                    dateTime: start,
                    dateTime2: end
                }
            }).then(res => {
            const r = {}
            res.data.forEach(cur => {
                r[cur.src] = {
                    ...r[cur.src],
                    [cur.disposition]: cur.count
                }
            })
            this.setState({
                dispositionCountByAccount: r
            })
        })
        axios.get("http://172.16.3.185:8080/api/dispositionCount", {
            params: {
                dateTime: start,
                dateTime2: end
            }
        }).then(res => {
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
        axios.get("http://172.16.3.185:8080/api/calldateBetween", {
            params: {
                dateTime: start,
                dateTime2: end
            }
        }).then(res => {
            console.log(res.data)
            const len = res.data.length
            const avgRating = res.data.reduce((accumulator, currentValue) => accumulator + currentValue.rating, 0) / len
            const avgWaiting = res.data.reduce((accumulator, currentValue) => accumulator + currentValue.waiting, 0) / len
            const avgDurationConsult = res.data.reduce((accumulator, currentValue) => accumulator + currentValue.durationConsult, 0) / len
            let kz = 0, ru = 0
            res.data.forEach(cur => {
                if (cur.language === "kz") kz++
                else ru++
            })
            this.setState({
                all: len,
                avgRating: avgRating,
                avgWaiting: avgWaiting,
                avgDurationConsult: avgDurationConsult,
                kz: kz,
                ru: ru
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
    handleStartDateChange = (e) => {
        this.setState({
            dateTime: e.target.value
        })
    }
    handleEndDateChange = (e) => {
        this.setState({
            dateTime2: e.target.value
        })
    }
    handleSubmit = () => {
        this.callDate()
    }

    render() {
        return (
            <div className={styles.page}>
                <Sidebar/>
                <div className={"w-100 p-3"}>
                    <div className={"w-100 d-flex align-items-center"}>
                        <div>
                            <input name={"date"} type={"date"} onChange={this.handleStartDateChange}/>
                            <input name={"date"} type={"date"} className={"ms-1"}
                                   onChange={this.handleEndDateChange}/>
                            <input type={"button"} className={"ms-2"} onClick={this.handleSubmit}
                                   value={"Показать"}/>
                        </div>
                    </div>
                    <div className={styles.left_right}>
                        <div className={styles.left}>
                            <h3>Сводная статистика</h3>
                            <p className={styles.left_item}>Всего звонков {this.state.all}</p>
                            <p className={styles.left_item}>Принятые {this.state.answered}</p>
                            <p className={styles.left_item}>Не дождались ответа {this.state.canceled}</p>
                            <p className={styles.left_item}>Средняя оценка: {this.state.avgRating}</p>
                            <p className={styles.left_item}>Среднее время ожидания: {this.state.avgWaiting} сек.</p>
                            <p className={styles.left_item}>Среднее время консультаций: {this.state.avgDurationConsult} сек.</p>
                            <p className={styles.left_item}>Казахский: {this.state.kz}</p>
                            <p className={styles.left_item}>Русский: {this.state.ru}</p>
                        </div>
                        <div className={styles.right}>
                            <Pie data={this.state.data} options={this.options}/>
                        </div>
                    </div>
                    <div className={"w-100 table-responsive mt-5"}>
                        <table className={"table"} ref={this.tableRef}>
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
                        <DownloadTableExcel
                            filename="users table"
                            sheet="users"
                            currentTableRef={this.tableRef.current}
                        >
                            <button> Export excel</button>
                        </DownloadTableExcel>
                    </div>
                </div>
            </div>
        )
    }
}

export default Statistics