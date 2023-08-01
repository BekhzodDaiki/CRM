import { ColumnsType, TableProps } from "antd/es/table";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import _ from 'lodash';
import SearchAdd from "../../shared/SearchAdd";
import { CustomTable } from "../../shared/table";
import { IBase } from "../../shared/types";
import { bindDrugsToUser, getDrugs, getCompanyDrugs, removePositionDrug } from "./request";
import { Button, Input, Popconfirm, Table, message } from "antd";
import { CloseCircleTwoTone, MinusOutlined, PlusOutlined } from "@ant-design/icons";


const Setting = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isLoading, setLoading] = useState(false);
  const [selectedDrugs, setSelectedDrugs] = useState([]);
  const [searchKey, setSearchKey] = useState('');
  const [timer, setTimer] = useState(null);
  const [initialData, setInitialData] = useState({
    items: []
  });
  const [positionList, setPosition] = useState({
    items: [],
    page: 1,
    size: 20,
    total: 0,
  });

  const getListPosition = async () => {
    const request = await getCompanyDrugs();
    setInitialData(request);
    setPosition(request);
    setLoading(false);
  };

  useEffect(() => {
    setLoading(true);
    getListPosition();
  }, [searchParams]);

  const onChange: TableProps<IBase>['onChange'] = ({ current }) => {
    navigate(`class?page=${current}`);
  };

  const confirm = async (drugId: number) => {
    setLoading(true);
    const request = await removePositionDrug(drugId);
    message.success('Успешно отвязано');
    getListPosition();
    setLoading(false);
  };

  const cancel = (e: React.MouseEvent<HTMLElement>) => {
    console.log(e);
    message.error('Click on No');
  };


  const columns: ColumnsType<IBase> = [
    {
      title: 'ID',
      dataIndex: 'id',
    },
    {
      title: 'Наименование',
      dataIndex: 'name',
    },
    {
      title: 'Действие',
      render: ({ id }) => {
        return searchKey === '' ? (
          <Popconfirm
            title="Уверены отвязать лекарство?"
            // description="Уверены привязать аптеку?"
            onConfirm={() => confirm(id)}
            // @ts-ignore
            onCancel={cancel}
            okText="Yes"
            cancelText="No"
          >
            <CloseCircleTwoTone
              style={{ fontSize: '24px' }}
              twoToneColor="#f5222d"
            />
          </Popconfirm>
        ) : null;
      }
    }
  ];

  const rowSelection = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: any) => {
      // @ts-ignore
      setSelectedDrugs(selectedRowKeys);
    },

  };

  return (
    <div>
      <p style={{
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 16
      }}>
        Мои позиции
      </p>
      <div
        style={{
          paddingBottom: 24,
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <Input
          style={{ width: '36vw' }}
          placeholder="Enter the drug"
          value={searchKey}
          onChange={({ target: { value } }: any) => {
            setLoading(true);
            setSearchKey(value);
            if (value === '') {
              setSelectedDrugs([]);
              return getListPosition();
            }
            // setSearchKey(value);
            if (timer) {
              clearTimeout(timer);
            }
            const newTimer = setTimeout(async () => {
              const searchedDrug = await getDrugs({ name: value });
              const { items } = searchedDrug;
              // @ts-ignore
              setPosition({ items });
              setLoading(false);
            }, 500)
            // @ts-ignore
            setTimer(newTimer)
          }}
        />
        {searchKey !== '' ? (
          <Button
            type={"primary"}
            // type={searchKey === '' ? 'danger' : "primary"}
            // icon={searchKey === '' ? <MinusOutlined /> : <PlusOutlined />}
            icon={<PlusOutlined />}
            onClick={async () => {
              if (selectedDrugs.length) {
                setLoading(true);
                await bindDrugsToUser(selectedDrugs);
                setLoading(false);
                setSearchKey('');
                getListPosition();
              }
            }}
          // onClick={() => navigate('create/')}
          >
            Add
          </Button>
        ) : ''}
      </div>
      {/* <CustomTable
        dataColumn={columns}
        // data={[]}
        data={positionList.drugs.map(
          ((drug: IBase) => ({
            ...drug,
            key: drug.id
          }))
        )}
        onChange={onChange}
        loading={isLoading}
        url={'/position/'}
        total={positionList.total}
        pageSize={100}
      /> */}
      <Table
        scroll={{ y: '50vh' }}
        columns={columns}
        dataSource={positionList.items.map(
          ((drug: IBase) => ({
            ...drug,
            key: drug.id
          }))
        )}
        onChange={onChange}
        loading={isLoading}
        // onRow={(record: any, rowIndex: any) => {
        //   return {
        //     onClick: (event) => {
        //       return navigate(`/position/${record.id}/`)
        //     }
        //   }
        // }}
        //@ts-ignore

        rowSelection={searchKey ? rowSelection : false}
        pagination={{
          pageSize: 100,
          current: 1,
          total: positionList.total,
          hideOnSinglePage: true,
          showSizeChanger: false
        }}
      />
    </div>
  );
};

export default Setting;