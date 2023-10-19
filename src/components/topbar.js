import React from "react";
import styles from "../assets/css/topbar.module.css";
import {Button, Modal, Form} from "react-bootstrap";

class Topbar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            openChangeAvatar: false
        }
    }

    changeOpenChangeAvatar = () => {
        this.setState({
            openChangeAvatar: true
        })
    }

    render() {
        return (
            <div className={styles.topbar}>
                <div>
                    <h2>Logo</h2>
                </div>
                <div className={styles.avatar}>
                    <img className={styles.avatar_img} src={require('../assets/images/satoru.jpg')}/>
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
                        <div>
                            <img className={styles.changeAvatar} src={require('../assets/images/camera.png')}/>
                            <Form.Group controlId="formFile" className="mb-3">
                                <Form.Label>Default file input example</Form.Label>
                                <Form.Control type="file" />
                            </Form.Group>
                            <Button variant={"outline-primary"}>Изменить</Button>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => this.setState({openChangeAvatar: false})}>
                            Закрыть
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        )
    }
}

export default Topbar