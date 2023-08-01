import { useEffect, useState } from 'react';
import { Input, Popconfirm, Switch, Table, message } from "antd";
import { ColumnsType, TableProps } from "antd/es/table";
import { IBase, ICompanyDrugs } from "../../../shared/types";
import { useNavigate, useSearchParams } from "react-router-dom";
import RowSelectionTable from '../../../shared/RowSelectionTable';
import { addOfferDrug, getSearchedDrugs, getSingleOfferDrugs, removeCompanyDrug, removeOfferDrug } from '../request';
import SearchFilter from '../../../shared/SearchFiler';
import { CheckCircleTwoTone, CloseCircleTwoTone } from '@ant-design/icons';
import CompanyProject from '..';


const Pill = () => {
  const navigate = useNavigate();
  const [timer, setTimer] = useState(null);
  const [searchParams] = useSearchParams();
  const [isLoading, setLoading] = useState(false);
  // const [selected, setSelected] = useState([]);
  const [pillList, setPillList] = useState({
    page: 1,
    size: 20,
    total: 0,
    items: []
  });
  const [selectedProjectId, setSelectedProjectId] = useState({
    value: 0,
    label: '',
  });

  const onChangePillTable: TableProps<IBase>['onChange'] = ({ current }) => {
    navigate(`/project?page=${current}&size=20`);
  };

  const getList = async () => {
    const request = await getSingleOfferDrugs({
      ...Object.fromEntries(searchParams.entries()),
      offer_id: selectedProjectId.value
    });
    // const request = await getSingleOfferDrugs(props.id, Object.fromEntries(searchParams.entries()));
    setPillList(request);
    setLoading(false);
  }

  useEffect(() => {
    if (selectedProjectId && selectedProjectId.value) {
      setLoading(true);
      getList();
    } else {
      setPillList({
        page: 1,
        size: 20,
        total: 0,
        items: []
      })
    }

  }, [selectedProjectId]);

  const cancel = (e: React.MouseEvent<HTMLElement>) => {
    console.log(e);
  };

  const confirm = async (id: number) => {
    setLoading(true);
    await removeCompanyDrug(id);
    getList();
    setLoading(false);
  };

  const columns: ColumnsType<ICompanyDrugs> = [
    {
      title: 'ID',
      dataIndex: 'id',
    },
    {
      title: 'Наименование',
      dataIndex: 'name',
    },
    {
      title: 'Активный',
      dataIndex: 'is_active',
      render: (is_active) => {
        return (
          <Switch
            defaultChecked={is_active}
            disabled={true}
          />
        );
      }
    },
    {
      title: 'Действие',
      render: ({ id }: ICompanyDrugs) => {
        return (
          <Popconfirm
            title="Уверены отвязать лекарство?"
            onConfirm={() => confirm(id)}
            // @ts-ignore
            onCancel={() => cancel()}
            okText="Yes"
            cancelText="No"
          >
            <CloseCircleTwoTone
              style={{ fontSize: '24px' }}
              twoToneColor="#f5222d"
            />
          </Popconfirm>
        );
      }
    }

  ];

  console.log('selected: ', selectedProjectId);

  return (
    <>
      <h3 style={{ textAlign: 'center' }}>Мои Лекарства</h3>
      <div>
        <div style={{ marginBottom: 8 }}>
          <span style={{ marginRight: 8 }}>Выберите проект: </span>
          <CompanyProject
            onChange={setSelectedProjectId}
            value={selectedProjectId}
          />
        </div>
        {selectedProjectId && selectedProjectId.value ? (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ marginRight: 15 }}>Поиск лекарство: </div>
            <Input
              style={{ width: '30vw', marginBottom: 20, marginTop: 8 }}
              placeholder="Поиск лекарство"
              // value={searchKey}
              onChange={({ target: { value } }: any) => {
                setLoading(true);
                if (timer) {
                  clearTimeout(timer);
                }
                if (value) {
                  const newTimer = setTimeout(async () => {
                    const request = await getSearchedDrugs({ name: value, page_size: 100, page: 1 })
                    // navigate(`/${baseUrl}/?${searchKey}=${value}&page=1`);
                    setPillList(request);
                    setLoading(false);
                  }, 500)
                  // @ts-ignore
                  setTimer(newTimer)
                } else {
                  getList();
                }
              }}
            />
          </div>) : null}
        <RowSelectionTable
          columns={columns}
          dataList={pillList.items || []}
          dataType={null}
          onChange={onChangePillTable}
          isLoading={isLoading}
          data={pillList}
          // setSelected={setSelected}
          current={Number(searchParams.get('page'))}
          rowSelection={false}
          height={'50vh'}
        />
      </div>
    </>
  );
};

export default Pill;