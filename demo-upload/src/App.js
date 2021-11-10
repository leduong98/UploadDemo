import 'antd/dist/antd.css';
import {Button, message, Upload} from "antd";
import {UploadOutlined} from '@ant-design/icons';
import axios from 'axios';

function App() {

  const handleUpload = (e) => {
    let formData = new FormData();
    formData.append("file", e.target.files[0]);

    axios.post("http://localhost:8080/files", formData)
      .then(res => {
        console.log("res", res);
      })
      .catch(err => {
        console.log("err", err);
      });
  }

  return (
    <div className="App">
      <Upload
        onChange={handleUpload()}
      >
        <Button icon={<UploadOutlined/>}>Click to Upload</Button>
      </Upload>
    </div>
  );
}

export default App;
