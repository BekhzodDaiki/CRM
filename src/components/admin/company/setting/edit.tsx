import { useState, useEffect } from "react";
import { Button, Form, Input, message } from "antd";
import { Link, useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { getSingleClassification, updateSingleClassification } from "./request";
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
    sales_per_day: "",
    value: "",
    id: -1,
  });
  // id: 9, username: '13212312', company_name: '123123', bitrix_id:
  const onFinish = async ({ sales_per_day, value }: any) => {
    setLoading(true);
    let changedData = {};
    if (sales_per_day !== initialValues.sales_per_day) {
      changedData = {
        ...changedData,
        sales_per_day,
      };
    }
    if (value !== initialValues.value) {
      changedData = {
        ...changedData,
        value,
      };
    }

    if (Object.keys(changedData).length) {
      const request = await updateSingleClassification(id, changedData);
      console.log("requestttt: ", request);
      if (request === 200) {
        navigate("/company/setting?page=1&page_size=20");
      }
    }
    setLoading(false);
    // if (isModified) {
    //   const request = await updateSingleCompany(id, modifiedData);
    //   if (request === 200) {
    //     navigate('/company?page=1&page_size=20')
    //   }
    // }
    // setLoading(false);
  };

  const fetchClassification = async () => {
    const request = await getSingleClassification(Number(id));
    if (request !== "error") {
      setInitialValues(request);
      form.setFieldsValue(request);
    }
    setLoading(false);
  };

  useEffect(() => {
    setLoading(true);
    fetchClassification();
  }, []);

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div className="edit-form-wrapper">
      <h3 style={{ textAlign: "center", marginBottom: 24 }}>
        Изменить Классификацию
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
        <Form.Item label="Value" name="value">
          <Input />
        </Form.Item>
        <Form.Item label="Sales per day" name="sales_per_day">
          <Input />
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <div className="back-submit-wrapper">
            <Button type="dashed" htmlType="submit">
              <Link to="/company/setting?page=1&page_size=20">Назад</Link>
            </Button>
            <Button loading={isLoading} type="primary" htmlType="submit">
              Изменить
            </Button>
          </div>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Create;
