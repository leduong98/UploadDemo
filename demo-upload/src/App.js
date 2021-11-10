import 'antd/dist/antd.css';
import {Button, message, Upload} from "antd";
import {UploadOutlined} from '@ant-design/icons';
import axios from "axios";

function App() {

  const propsConfigUpload = (info) => {
    if (info.file.status === 'done') {
      message.success(`Success!`, 3)
    } else if (info.file.status === 'error') {
      message.error(`Error!`,
        3)
    }
  }

  const handleUpload = async options =>{
    const {onSuccess, onError, file} = options;
    const fmData = new FormData();
    try {
      fmData.append("file", file);
      const res = await axios.post(
        "/api/candidate/uploadMaster",
        fmData
      );
      onSuccess("ok")
    } catch (err) {
      onError({ err });
    }
  };

  return (
    <div className="App">
      <Upload accept = ".xlsx, .xls, .pdf" customRequest={handleUpload} onChange={propsConfigUpload}>
        <Button icon={<UploadOutlined />}>Upload Excel</Button>
      </Upload>
    </div>
  );
}

export default App;
