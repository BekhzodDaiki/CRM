import { Button, Form, Input } from "antd";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { createClassification } from "./request";




const Create = () => {
  const [isLoading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();


  const onFinish = async (value: any) => {
    console.log('value: ', value);
    setLoading(true);
    const request = await createClassification(value);
    setLoading(false);
    if (request === 201) {
      navigate('/company/setting?page=1&page_size=20');
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div>
      <h3 style={{ textAlign: "center" }}>Создать Классификацию</h3>
      <Form
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        style={{ maxWidth: 600 }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item
          label="Value"
          name="value"
          rules={[{ required: true, message: "Please input your value!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Sales per day"
          name="sales_per_day"
          rules={[{ required: true, message: "Please input your Sales per day!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <div className="back-submit-wrapper">
            <Button type="dashed" htmlType="submit">
              <Link to="/company/setting?page=1&page_size=20">Назад</Link>
            </Button>
            <Button loading={isLoading} type="primary" htmlType="submit">
              Создать
            </Button>
          </div>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Create;
