import { useState, useEffect } from "react";
import { Button, Form, Input, message } from "antd";
import { Link, useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import {
  createCompany,
  getSingleCompany,
  updateSingleCompany,
} from "./request";
import { ICompany, ICompanyForm } from "../../../../shared/types";
import { useForm } from "antd/es/form/Form";
import _ from "lodash";

type FieldType = {
  username?: string;
  password?: string;
  name?: string;
  bitrix_id?: string;
};

const Create = () => {
  const [isLoading, setLoading] = useState<boolean>(false);
  const [form] = useForm();
  const navigate = useNavigate();
  const { id } = useParams();
  const [initialValues, setInitialValues] = useState({
    bitrix_id: "",
    company_name: "",
    username: "",
    id: -1,
  });
  // id: 9, username: '13212312', company_name: '123123', bitrix_id:
  const onFinish = async ({ bitrix_id, name, password, username }: any) => {
    setLoading(true);
    console.log("passsss: ", password);
    let modifiedData = {
      user: {},
    };
    let isModified = false;
    if (initialValues.bitrix_id !== bitrix_id) {
      isModified = true;
      modifiedData = {
        bitrix_id,
      };
    }
    if (initialValues.company_name !== name) {
      isModified = true;
      modifiedData = {
        ...modifiedData,
        name,
      };
    }
    if (initialValues.username !== username) {
      isModified = true;
      modifiedData = {
        ...modifiedData,
        user: {
          username,
        },
      };
    }
    if (password) {
      isModified = true;
      modifiedData = {
        ...modifiedData,
        user: {
          ...modifiedData.user,
          password,
        },
      };
    }
    if (isModified) {
      const request = await updateSingleCompany(id, modifiedData);
      if (request === 200) {
        navigate("/company/user?page=1&page_size=20");
      }
    }
    setLoading(false);
  };

  const fetchCompany = async () => {
    const request = await getSingleCompany(id);
    if (request !== "error") {
      setInitialValues(request);
      form.setFieldsValue(request);
      form.setFieldValue("name", request.company_name);
    }
  };

  useEffect(() => {
    fetchCompany();
  }, []);

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div className="edit-form-wrapper">
      <h3 style={{ textAlign: "center", marginBottom: 24 }}>
        Изменить Компанию
      </h3>
      <Form
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        style={{ maxWidth: 600 }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
        form={form}
        disabled={isLoading}
      >
        <Form.Item<FieldType> label="Username" name="username">
          <Input />
        </Form.Item>
        <Form.Item<FieldType> label="Пароль" name="password">
          <Input />
        </Form.Item>
        <Form.Item<FieldType> label="Название Компании" name="name">
          <Input />
        </Form.Item>
        <Form.Item<FieldType> label="Bitrix ID" name="bitrix_id">
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
