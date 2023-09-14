import React from "react";
import styles from "../assets/css/statistics.module.css"
import Sidebar from "../components/sidebar";
import axios from "axios";
import 'chart.js/auto';
import {Pie} from 'react-chartjs-2';
import {DownloadTableExcel} from 'react-export-table-to-excel'
import {Table} from "react-bootstrap";

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
            startTime: "00:00",
            endTime: "23:59",
            data: {
                labels: ['Принятые', 'Потерянные', 'Не дождались ответа'],
                datasets: [
                    {
                        data: [0, 0],
                        backgroundColor: ['#FF6384', '#36A2EB', '#edc46b']
                    }
                ]
            }
        }
    }

    renderComponents = () => {
        this.callDate()
    }
    callDate = () => {
        const start = this.state.dateTime === "" ? "" : `${this.state.dateTime} ${this.state.startTime}:00`
        const end = this.state.dateTime2 === "" ? "" : `${this.state.dateTime2} ${this.state.endTime}:59`
        axios.get("http://172.16.3.185:8080/api/dispositionCountByAccount",
            {
                params: {
                    dateTime: start,
                    dateTime2: end
                }
            }).then(res => {
            const r = {}
            res.data.forEach(cur => {
                r[cur.src.split(' ').join('')] = {
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
            const foundNoAnswer = res.data.find(val => val.disposition === "NO ANSWER")
            const answerCount = foundAnswered != null ? foundAnswered.count : 0
            const cancelCount = foundCancel != null ? foundCancel.count : 0
            const noAnswerCount = foundCancel != null ? foundNoAnswer.count : 0
            this.setState({
                data: {
                    ...this.state.data,
                    datasets: [
                        {
                            data: [answerCount, cancelCount, noAnswerCount],
                        }
                    ]
                },
                answered: answerCount,
                canceled: cancelCount,
                noAnswer: noAnswerCount
            })
        })
        axios.get("http://172.16.3.185:8080/api/calldateBetween", {
            params: {
                dateTime: start,
                dateTime2: end
            }
        }).then(res => {
            const len = res.data.length
            const avgRating = res.data.reduce((accumulator, currentValue) => currentValue.rating !== 0 ? accumulator + currentValue.rating : accumulator, 0) / len
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
    handleStartTimeChange = (e) => {
        this.setState({
            startTime: e.target.value
        })
    }
    handleEndTimeChange = (e) => {
        this.setState({
            endTime: e.target.value
        })
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
                            <input name={"date"} type={"time"} className={styles.inputDateTime}
                                   onChange={this.handleStartTimeChange}/>
                            <input name={"date"} type={"time"} className={styles.inputDateTime}
                                   onChange={this.handleEndTimeChange}/>
                            <input type={"button"} className={"ms-2"} onClick={this.handleSubmit}
                                   value={"Показать"}/>
                        </div>
                    </div>
                    <div className={styles.left_right}>
                        <div className={styles.left}>
                            <h3>Сводная статистика</h3>
                            <p className={styles.left_item}>Всего звонков {this.state.all}</p>
                            <p className={styles.left_item}>Принятые {this.state.answered}</p>
                            <p className={styles.left_item}>Потерянные {this.state.canceled}</p>
                            <p className={styles.left_item}>Не дождались ответа {this.state.noAnswer}</p>
                            <p className={styles.left_item}>Средняя оценка: {this.state.avgRating.toFixed(2)}</p>
                            <p className={styles.left_item}>Среднее время
                                ожидания: {this.state.avgWaiting.toFixed(2)} сек.</p>
                            <p className={styles.left_item}>Среднее время
                                консультаций: {this.state.avgDurationConsult.toFixed(2)} сек.</p>
                            <p className={styles.left_item}>Казахский: {this.state.kz}</p>
                            <p className={styles.left_item}>Русский: {this.state.ru}</p>
                        </div>
                        <div className={styles.right}>
                            <Pie data={this.state.data} options={this.options}/>
                        </div>
                    </div>
                    <div className={"w-100 table-responsive mt-5"}>
                        <Table responsive={true} striped bordered hover ref={this.tableRef}>
                            <thead>
                            <tr>
                                <th>Агент</th>
                                <th>Принятые</th>
                                <th>Потерянные</th>
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
                                        <td>{this.state.dispositionCountByAccount[key].hasOwnProperty('NOANSWER') ? value.NOANSWER : 0}</td>
                                    </tr>
                                ))
                            }
                            </tbody>
                        </Table>
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