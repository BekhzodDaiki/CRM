import { useState } from 'react';
import { Button, Form, Input, message } from "antd";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { createCompany } from "./request";
import { ICompany, ICompanyForm } from "../../../../shared/types";


type FieldType = {
  username?: string;
  password?: string;
  name?: string;
  bitrix_id?: string;
};

const Create = () => {
  const [isLoading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const onFinish = async ({
    bitrix_id,
    name,
    password,
    username,
  }: ICompanyForm) => {
    setLoading(true);
    const request = await createCompany({
      name,
      bitrix_id,
      user: {
        username,
        password,
      },
    });
    setLoading(false);
    if (request === 201) {
      navigate('/company?page=1&page_size=20');
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div>
      <h3 style={{ textAlign: "center" }}>Создать Компанию</h3>
      <Form
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        style={{ maxWidth: 600 }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item<FieldType>
          label="Username"
          name="username"
          rules={[{ required: true, message: "Please input your username!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item<FieldType>
          label="Пароль"
          name="password"
          rules={[{ required: true, message: "Please input your password!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item<FieldType>
          label="Имя"
          name="name"
          rules={[{ required: true, message: "Please input your name!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item<FieldType>
          label="Bitrix ID"
          name="bitrix_id"
          rules={[{ required: true, message: "Please input your bitrix_id!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <div className="back-submit-wrapper">
            <Button type="dashed" htmlType="submit">
              <Link to="/company/user?page=1&page_size=20">Назад</Link>
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
