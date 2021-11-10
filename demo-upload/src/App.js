import 'antd/dist/antd.css';
import {Button, message, Upload} from "antd";
import {UploadOutlined} from '@ant-design/icons';
import axios from "axios";
import {useEffect, useState} from "react";
import Modal from "antd/es/modal/Modal";

function App() {

  const [hover, setHover] = useState(false)

  const [file, setFile] = useState([]);

  const [downloaded, setDownloaded] = useState(false);

  const [updated, setUpdated] = useState(false)

  const [selectedFile, setSelectedFile] = useState()

  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleOk = () => {
    setDownloaded(true)
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  function getList() {
    return fetch('http://localhost:8080/files/')
      .then(data => data.json())
  }

  useEffect(() => {
      getList().then(r => setFile(r))
  },[updated])


  // download file đang bug
  useEffect( () => {
    if (downloaded === true){
    let stringUrl = 'http://localhost:8080/files/'+ selectedFile
      fetch(stringUrl)
      .then(data => data.json())
      .then(r => console.log(r))}
  }, [downloaded])

  const propsConfigUpload = (info) => {
    console.log("=====", info)
    if (info.file.status === 'done') {
      message.success(`Success!`, 3)
      setUpdated(!updated)
    } else if (info.file.status === 'error') {
      message.error(`Error!`,
        3)
    }
  }

  const handleUpload = async options => {
    const {onSuccess, onError, file} = options;
    const fmData = new FormData();
    const config = {
      headers: {'Access-Control-Allow-Origin': '*'}
    };
    try {
      fmData.append("file", file);
      const res = await axios.post(
        "http://localhost:8080/files",
        fmData, config
      );
      onSuccess("ok")
    } catch (err) {
      onError({err});
    }
  };

  const handleSelected = (e) => {
    setSelectedFile(e.target.id)
    setIsModalVisible(true);
  }

  const toggleHover = () => {
    setHover(!hover)
  }

  let linkStyle;
  if (hover) {
    linkStyle = {color: 'red'}
  } else {
    linkStyle = {color: 'blue'}
  }

  return (
    <div className="App">
     <Upload accept=".xlsx, .xls, .pdf, image/*" customRequest={handleUpload} onChange={propsConfigUpload}>
       <Button icon={<UploadOutlined/>}>Upload Excel</Button>
       </Upload>
       <ul>
     {file.map((e) =>
       <li style={linkStyle} onClick={handleSelected}  onMouseEnter={toggleHover} onMouseLeave={toggleHover} id={e.filename}>{e.filename}</li>
       )}
       </ul>
       <Modal title="Basic Modal" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
        <p>Có muốn tải file: {selectedFile}</p>
      </Modal>
    </div>
  );
}

export default App;
