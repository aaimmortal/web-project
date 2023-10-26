import React from "react";
import styles from "../assets/css/topbar.module.css";
import {Button, Modal, Form} from "react-bootstrap";
import axios from "axios";
import {
    AiOutlineQuestionCircle,
    AiOutlineBell,
    AiOutlineMail,
    AiOutlineMessage,
    AiOutlinePlus,
    AiOutlineSearch
} from 'react-icons/ai'

class Topbar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            openChangeAvatar: false,
            file: null,
            login: JSON.parse(localStorage.getItem("user")).sub,
            avatar: require('../assets/images/default.png'),
            changeAvatar: require('../assets/images/default.png')
        }
    }

    componentDidMount() {
        axios.get('http://172.16.3.185:8080/api/getImage', {
            params: {
                login: this.state.login
            },
            responseType: 'blob'
        }).then(res => {
            if (res.data !== "No image found") {
                const blob = new Blob([res.data]);
                const imageUrl = URL.createObjectURL(blob);
                this.setState({
                    avatar: imageUrl
                });
            }
        })
    }

    changeOpenChangeAvatar = () => {
        this.setState({
            openChangeAvatar: true
        })
    }
    upload = () => {
        const data = new FormData();
        data.append("login", this.state.login);
        data.append("file", this.state.file);
        axios.post('http://172.16.3.185:8080/api/upload', data).then(res => {
            console.log(res.data)
            this.setState({
                avatar: URL.createObjectURL(this.state.file)
            })
        }).catch(err => {
            console.log(err)
        })
    }
    handleFileChange = (e) => {
        this.setState({
            file: e.target.files[0],
            changeAvatar: URL.createObjectURL(e.target.files[0])
        })
    }

    render() {
        return (
            <div className={styles.topbar}>
                <div className={styles.logo}>
                    <h2>HelpDesk 2.0</h2>
                    <div className={styles.icons}>
                        <AiOutlinePlus className={styles.icon}/>
                        <AiOutlineSearch className={styles.icon}/>
                    </div>
                </div>
                <div className={styles.info}>
                    <div className={styles.date}>
                        <div style={{color: "#d1d1d1", fontWeight: "bold"}}>Чт</div>
                        <div>30</div>
                    </div>
                    <div className={styles.calendar}>
                        <span>Календарь</span>
                        <br/>
                        <span style={{color: "#d1d1d1", fontWeight: "bold"}}>Создать событие</span>
                    </div>
                    <div className={styles.info1}>
                        <span style={{color: "#d1d1d1", fontWeight: "bold"}}>Затрачено сегодня </span>
                        <br/>
                        <span>73ч 0м</span>
                    </div>
                </div>
                <div className={styles.icons}>
                    <AiOutlineBell className={styles.icon}/>
                    <AiOutlineMail className={styles.icon}/>
                    <AiOutlineMessage className={styles.icon}/>
                    <AiOutlineQuestionCircle className={styles.icon}/>
                </div>
                <div className={styles.avatar}>
                    <img className={styles.avatar_img} src={this.state.avatar}/>
                    <img onClick={this.changeOpenChangeAvatar} className={styles.camera}
                         src={require('../assets/images/camera.png')}/>
                </div>
                <Modal show={this.state.openChangeAvatar}>
                    <Modal.Header>
                        <Modal.Title>
                            Изменить фотографию
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body className={"d-flex justify-content-center align-items-center"}>
                        <img className={styles.changeAvatar} src={this.state.changeAvatar}/>
                        <div>
                            <Form.Group controlId="formFile" className="d-flex p-3">
                                <Form.Control type="file" onChange={this.handleFileChange}/>
                                <Button className={"ms-1"} onClick={this.upload}
                                        variant={"outline-primary"}>Изменить</Button>
                            </Form.Group>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="outline-danger" onClick={() => this.setState({openChangeAvatar: false})}>
                            Закрыть
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        )
    }
}

export default Topbar