import { useState, useEffect } from 'react';
import {
  Button,
  Form,
  Input,
  notification,
  Select,
} from "antd";
import { useNavigate } from 'react-router-dom';
import { useForm } from 'antd/es/form/Form';
import { createRate, getDrugStores } from './request';
import CustomSelect from '../../shared/CustomSelect';
import { getClassList } from '../drug-store-class/request';

const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

const Create = () => {
  const navigate = useNavigate();
  const [form] = useForm();
  const [isLoading, setLoading] = useState(false);
  const [classification, setClassificaion] = useState([]);

  const getClassification = async () => {
    const { items } = await getClassList({ size: 10000 });
    setClassificaion(items.map((item: any) => ({
      value: item.id,
      label: `value: ${item.value}, sales per day: ${item.sales_per_day}`
    })));
  }

  const fetchDrugStores = async (name: string) => {
    const { items } = await getDrugStores({ name });
    return items.map((drug: any) => ({
      label: drug.name,
      value: drug.id
    }));
  }

  useEffect(() => {
    getClassification();
  }, []);

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  const handleCLass = async (values: any) => {
    setLoading(true);
    const request = await createRate({
      classification_id: values.class_id,
      drug_store_id: values.drugStore.value
    });
    if (request?.status === 201) {
      form.resetFields();
      setLoading(false);
      notification.success({
        message: "Rate has been created successfully",
        duration: 3
      });
      return navigate('/rate?page=1&page_size=20');
    } else {
      setLoading(false);
      notification.error({
        message: request,
        duration: 3
      })
    }

  };

  return (
    <div>
      <p style={{
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 16
      }}>
        Create Drug Store Classification
      </p>

      <Form
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 14 }}
        layout="horizontal"
        autoComplete="off"
        onFinishFailed={onFinishFailed}
        onFinish={(values) => handleCLass(values)}
        form={form}
      >
        <Form.Item
          name="class_id"
          label="Classification"
          rules={[{ required: true, message: 'This field is required' }]}
        >
          <Select
            allowClear
            options={classification}
          />
        </Form.Item>
        <Form.Item
          name="drugStore"
          label="Drug Store"
          rules={[{ required: true, message: 'This field is required' }]}
        >
          <CustomSelect
            fetchOptions={fetchDrugStores}
          />
        </Form.Item>
        <Form.Item {...tailLayout}>
          <Button
            loading={isLoading}
            style={{ marginRight: 16 }}
            onClick={() => navigate('/rate?page=1&page_size=20')}
          >
            Back
          </Button>
          <Button
            loading={isLoading}
            type="primary"
            htmlType="submit"
          >
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Create;