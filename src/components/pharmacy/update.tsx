import { useState, useEffect } from 'react';
import {
  Button,
  Form,
  Input,
  notification,
  Select,
  Switch,
} from "antd";
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'antd/es/form/Form';
import _ from 'lodash';
import { getDrugStores, getSingleOfferDrugStore, updateRate } from './request';
import { IClassification } from '../../shared/types';
import { getClassList } from '../drug-store-class/request';
import CustomSelect from '../../shared/CustomSelect';
import { getOffers } from '../../shared/request';

const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};


const Update = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form] = useForm();
  const [isLoading, setLoading] = useState(false);
  const [initialData, setInitialData] = useState({
    classification: { id: 0 },
    drugstores: { id: 0 }
  });
  const [changedBoolean, setChangedBoolean] = useState({
    company_owner: false,
    is_agree: false,
 });
  const [offerDrugStore, setOfferDrugStore] = useState([]);

  const getSingle = async () => {
    const { items } = await getClassList({ size: 10000 });
    setOfferDrugStore(items.map((item: any) => ({
      value: item.id,
      label: `value: ${item.value}, sales per day: ${item.sales_per_day}`
    })));
    const request = await getSingleOfferDrugStore(Number(id));
    setInitialData(request);
    form.setFieldsValue(request);
  }

  useEffect(() => {
    getSingle();
  }, []);

  const onChangeBoolean = (name: string, checked: boolean) => {
    if (name === 'company_owner') {
       setChangedBoolean((values) => ({
          ...values,
          company_owner: checked,
       }))
    }
    else if (name === 'is_agree') {
       setChangedBoolean((values) => ({
          ...values,
          is_agree: checked,
       }))
    }
 };

  const fetchDrugStores = async (name: string) => {
    const { items } = await getDrugStores({ name });
    return items.map((drug: any) => ({
      label: drug.name,
      value: drug.id
    }));
  }

  const fetchOffer = async (name: string) => {
    const { items } = await getOffers({ name });
    return items.map((drug: any) => ({
      label: drug.name,
      value: drug.id
    }));
  }

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  const handleOfferDrugStore = async (values: any) => {
    let modifiedData = {};
    if (values.class_id !== initialData.classification.id) {
      modifiedData = {
        classification_id: values.class_id
      }
    }
    if (typeof values.drugStore !== 'string') {
      modifiedData = {
        ...modifiedData,
        drug_store_id: values.drugStore.value
      }
    }

    if (Object.keys(modifiedData).length) {
      const request = await updateRate(Number(id), modifiedData);
      if (request?.status === 200) {
        setLoading(false);
        notification.success({
          message: "Rate has been updated successfully",
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
    }
  };


  return (
    <div>
      <p style={{
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 16
      }}>
        Update Offe Drug Store
      </p>

      <Form
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 14 }}
        layout="horizontal"
        autoComplete="off"
        onFinishFailed={onFinishFailed}
        onFinish={(values) => handleOfferDrugStore(values)}
        form={form}
      >
        <Form.Item
          name="drugstore"
          label="Drug Store"
        // rules={[{ required: true, message: 'This field is required' }]}
        >
          <CustomSelect
            fetchOptions={fetchDrugStores}
          />
        </Form.Item>
        <Form.Item
          name="offer"
          label="Offer"
        // rules={[{ required: true, message: 'This field is required' }]}
        >
          <CustomSelect
            fetchOptions={fetchOffer}
          />
        </Form.Item>
        <Form.Item
          name="company_owner"
          label="Is company owner"
        // rules={[{ required: true, message: 'This field is required' }]}
        >
          <Switch
            disabled={isLoading}
            onChange={(checked: boolean) => onChangeBoolean('company_owner', checked)}
            checked={changedBoolean.company_owner || false}
          />
        </Form.Item>
        <Form.Item
          name="is_agree"
          label="Is agree"
        // rules={[{ required: true, message: 'This field is required' }]}
        >
          <Switch
            disabled={isLoading}
            onChange={(checked: boolean) => onChangeBoolean('is_agree', checked)}
            checked={changedBoolean.is_agree || false}
          />
        </Form.Item>

        <Form.Item {...tailLayout}>
          <Button
            loading={isLoading}
            style={{ marginRight: 16 }}
            onClick={() => navigate('/offer-drug-store?page=1&page_size=20')}
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

export default Update;