import React from "react";
import styles from "../assets/css/statistics.module.css"
import Sidebar from "../components/sidebar";
import axios from "axios";
import 'chart.js/auto';
import {Pie} from 'react-chartjs-2';
import {DownloadTableExcel} from 'react-export-table-to-excel'
import {Button, Card, Form, ListGroup, Table} from "react-bootstrap";
import {goto, toggle} from "../redux/reducer";
import {connect} from "react-redux";

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
                labels: ['Принятые', 'Потерянные', 'Принятые несвоевременно'],
                datasets: [
                    {
                        data: [0, 0],
                        backgroundColor: ['#FF6384', '#36A2EB', '#edc46b']
                    }
                ]
            }
        }
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
            const keys = Object.keys(r);
            let answerCount = 0
            let cancelCount = 0
            let noAnswerCount = 0
            keys.forEach(key => {
                answerCount += r[key].hasOwnProperty('ANSWER') ? r[key].ANSWER : 0
                cancelCount += r[key].hasOwnProperty('CANCEL') ? r[key].CANCEL : 0
                noAnswerCount += r[key].hasOwnProperty('NOANSWER') ? r[key].NOANSWER : 0
            });
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

            console.log(r)
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
        this.props.goto("GOTO", window.location.pathname)
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
    getNameByNumber = (number) => {
        if (number === "7001") return 'Каламкас'
        if (number === "7002") return 'Аружан'
    }

    render() {
        return (
            <div className={styles.page}>
                <Sidebar/>
                <div style={{width:"85%"}} className={"p-3"}>
                    <Card className={"w-100 "}>
                        <Card.Header>Введите детали</Card.Header>
                        <Card.Body>
                            <Form.Group className={"d-flex"}>
                                <Form.Control type={"date"} onChange={this.handleStartDateChange}/>
                                <Form.Control type={"date"} className={"ms-1"}
                                              onChange={this.handleEndDateChange}/>
                                <Form.Control type={"time"} className={styles.inputDateTime}
                                              onChange={this.handleStartTimeChange}/>
                                <Form.Control type={"time"} className={styles.inputDateTime}
                                              onChange={this.handleEndTimeChange}/>
                                <Button variant={"outline-primary"} onClick={this.handleSubmit}
                                        className={"ms-2"}>Показать</Button>
                            </Form.Group>
                        </Card.Body>
                    </Card>
                    <div className={styles.left_right}>
                        <Card className={styles.left}>
                            <Card.Header>Сводная статистика</Card.Header>
                            <ListGroup variant="flush">
                                <ListGroup.Item className={styles.left_item}>Всего
                                    звонков {this.state.all}</ListGroup.Item>
                                <ListGroup.Item
                                    className={`${styles.left_item} ${styles.desc} ${styles.answered}`}>Принятые {this.state.answered}</ListGroup.Item>
                                <ListGroup.Item
                                    className={`${styles.left_item} ${styles.desc} ${styles.canceled}`}>Потерянные {this.state.canceled}</ListGroup.Item>
                                <ListGroup.Item className={`${styles.left_item} ${styles.desc} ${styles.noAnswer}`}>Принятые
                                    несвоевременно {this.state.noAnswer}</ListGroup.Item>
                                <ListGroup.Item className={styles.left_item}>Средняя
                                    оценка: {this.state.avgRating.toFixed(2)}</ListGroup.Item>
                                <ListGroup.Item className={styles.left_item}>Среднее время
                                    ожидания: {this.state.avgWaiting.toFixed(2)} сек.</ListGroup.Item>
                                <ListGroup.Item className={styles.left_item}>Среднее время
                                    консультаций: {this.state.avgDurationConsult.toFixed(2)} сек.</ListGroup.Item>
                                <ListGroup.Item className={styles.left_item}>Казахский: {this.state.kz}</ListGroup.Item>
                                <ListGroup.Item className={styles.left_item}>Русский: {this.state.ru}</ListGroup.Item>
                            </ListGroup>
                        </Card>
                        <Card className={styles.right}>
                            <Pie data={this.state.data} options={this.options}/>
                        </Card>
                    </div>
                    <div className={"w-100 table-responsive mt-5"}>
                        <Table responsive={true} striped bordered hover ref={this.tableRef}>
                            <thead>
                            <tr>
                                <th>Агент</th>
                                <th>Принятые</th>
                                <th>Потерянные</th>
                                <th>Принятые несвоевременно</th>
                                <th>Все принятые</th>
                                <th>Все потерянные</th>
                                <th>Все принятые несвоевременно</th>
                                <th>Ср. оценка</th>
                                <th>Ср. время ож.</th>
                                <th>Ср. время конс.</th>
                                <th>Каз</th>
                                <th>Рус</th>
                            </tr>
                            </thead>
                            <tbody>
                            {
                                Object.entries(this.state.dispositionCountByAccount).map(([key, value]) => (
                                    <tr>
                                        <td>{this.getNameByNumber(key)}</td>
                                        <td>{this.state.dispositionCountByAccount[key].hasOwnProperty('ANSWER') ? value.ANSWER : 0}</td>
                                        <td>{this.state.dispositionCountByAccount[key].hasOwnProperty('CANCEL') ? value.CANCEL : 0}</td>
                                        <td>{this.state.dispositionCountByAccount[key].hasOwnProperty('NOANSWER') ? value.NOANSWER : 0}</td>
                                        <td>{this.state.answered}</td>
                                        <td>{this.state.canceled}</td>
                                        <td>{this.state.noAnswer}</td>
                                        <td>{this.state.avgRating.toFixed(2)}</td>
                                        <td>{this.state.avgWaiting.toFixed(2)}</td>
                                        <td>{this.state.avgDurationConsult.toFixed(2)}</td>
                                        <td>{this.state.kz}</td>
                                        <td>{this.state.ru}</td>
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
                            <Button variant={"outline-success"}> Export excel</Button>
                        </DownloadTableExcel>
                    </div>
                </div>
            </div>
        )
    }
}

export default connect(Statistics.mapStateToProps, Statistics.mapDispatchToProps)(Statistics)