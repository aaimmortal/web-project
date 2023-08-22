import React from "react";
import styles from "../../src/assets/css/audio.module.css"
import Sidebar from "../components/sidebar";
import logo from '../../src/assets/images/audio_logo.svg'
import axios from "axios";
import JSZip from "jszip";

class Audio extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            startDate: "",
            endDate: "",
            audios: []
        }
    }

    handleStartDateChange = (e) => {
        this.setState({
            startDate: e.target.value
        })
    }
    handleEndDateChange = (e) => {
        this.setState({
            endDate: e.target.value
        })
    }
    handleSubmit = () => {
        const start = `${this.state.startDate} 00:00:00`
        const end = `${this.state.endDate} 23:59:59`
        axios.get("http://172.16.3.185:8080/api/getAudioBetween", {
            params: {
                dateTime: start,
                dateTime2: end
            }, responseType: 'blob'
        }).then(res => {
            const zip = new JSZip();
            return zip.loadAsync(res.data)
        }).then(zip => {
            const audioPromises = [];
            zip.forEach((relativePath, file) => {
                audioPromises.push(file.async('blob').then(blob => ({name: relativePath, blob})));
            });
            return Promise.all(audioPromises);
        }).then(res => {
            console.log(res)
            this.setState({
                audios: res
            })
        }).catch(err => {
            console.log(err.response)
        })
    }

    render() {
        return (
            <div className={styles.page}>
                <Sidebar/>
                <div className={`${styles.page} p-3 w-100 h-100`}>
                    <div className={"w-25"}>
                        <div>
                            <h4>Выберите дату начала</h4>
                            <input name={"date"} type={"date"} onChange={this.handleStartDateChange}/>
                        </div>
                        <div>
                            <h4>Выберите дату конца</h4>
                            <input name={"date"} type={"date"} onChange={this.handleEndDateChange}/>
                        </div>
                        <button type={"button"} onClick={this.handleSubmit}>Показать</button>
                    </div>
                    <div className={`w-100`}>
                        {
                            this.state.audios.map((audio, ind) => (
                                <div className={`d-flex mt-2`}>
                                    <img src={logo} width={65}/>
                                    <div className={"d-flex w-100 align-items-center"}>
                                        <audio controls={true} className={"w-100 bg-light"} type="audio/mpeg">
                                            <source src={URL.createObjectURL(audio.blob)} type={"audio/wav"}/>
                                        </audio>
                                    </div>

                                </div>
                            ))
                        }
                        {this.state.audios.length !== 0 && <button onClick={this.handleUpdate}>Обновить</button>}
                    </div>
                </div>
            </div>
        )
    }
}

export default Audio