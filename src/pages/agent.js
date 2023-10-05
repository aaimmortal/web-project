import React from "react";
import Sidebar from "../components/sidebar";
import styles from '../assets/css/agent.module.css'
import {Table} from "react-bootstrap";
import axios from "axios";

class Agent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: []
        }
    }

    getNameByNumber = (number) => {
        if (number === "7001") return 'Каламкас'
        if (number === "7002") return 'Аружан'
    }

    componentDidMount() {
        axios.get('http://172.16.3.185:8080/api/wfm').then(res => {
            this.setState({
                data: res.data
            })
        })
        axios.get("http://172.16.3.185:8088/ari/api-docs/resources.json", {
            auth: {
                username: 'myuser',
                password: 'mypassword'
            }
        }).then(res => {
            console.log(res)
        })
    }

    render() {
        return (
            <div className={styles.page}>
                <Sidebar/>
                <div className={"w-100 p-3 table-responsive"}>
                    <Table responsive={true} striped bordered hover ref={this.tableRef}>
                        <thead>
                        <tr>
                            <th>Агент</th>
                            <th>Дата</th>
                            <th>Статус</th>
                        </tr>
                        </thead>
                        <tbody>
                        {
                            this.state.data.map(cur => (
                                <tr>
                                    <td>{this.getNameByNumber(cur.agentid)}</td>
                                    <td>{cur.date.replace('T', " ")}</td>
                                    <td>{cur.action}</td>
                                </tr>
                            ))
                        }
                        </tbody>
                    </Table>
                </div>
            </div>
        )
    }
}

export default Agent