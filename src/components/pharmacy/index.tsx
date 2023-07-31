import { ColumnsType, TableProps } from "antd/es/table";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import SearchAdd from "../../shared/SearchAdd";
import { CustomTable } from "../../shared/table";
import { IOfferDrugStore, IDrugStore } from "../../shared/types";
import { getOfferDrugStoreList } from "./request";
import { Tag } from "antd";

const Rate = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isLoading, setLoading] = useState(false);
  const [classList, setClassList] = useState({
    items: [],
    page: 1,
    size: 20,
    total: 0,
  });

  const getListOfferDrugStore = async () => {
    const request = await getOfferDrugStoreList(Object.fromEntries(searchParams.entries()));
    setClassList(request);
    setLoading(false);
  };

  useEffect(() => {
    setLoading(true);
    getListOfferDrugStore();
  }, [searchParams]);
  
  const onChange: TableProps<IOfferDrugStore>['onChange'] = ({ current }) => {
    navigate(`/class?page=${current}`);
  };

  const columns: ColumnsType<IOfferDrugStore> = [
    {
      title: 'ID',
      dataIndex: 'id',
    },
    {
      title: 'Drug Store',
      dataIndex: 'drugstore',
      render: ({ name }: IDrugStore) => name,
    },
    {
      title: 'Offer',
      dataIndex: 'offer',
      render: ({ name }: IDrugStore) => name,
    },
    {
      title: 'Company owner',
      dataIndex: 'company_owner',
      render: (cOwner: boolean) => cOwner ? <Tag color="geekblue">Yes</Tag> : <Tag color="red">No</Tag> ,
    },
    {
      title: 'Is agree',
      dataIndex: 'is_agree',
      render: (isAgree: boolean) => isAgree ? <Tag color="geekblue">Yes</Tag> : <Tag color="red">No</Tag> ,
    },
  ];

  return (
    <div>
      <p style={{
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 16
      }}>
        Offer Drug Storesss
      </p>
      <SearchAdd
        search={false}
        label="offer-drug-store"
        addUrl="create/"
        searchKey="name"
        baseUrl="offer-drug-store"
      />
      <CustomTable
        dataColumn={columns}
        data={[]}
        // data={classList.items.map(
        //   ((drug: IOfferDrugStore) => ({
        //     ...drug,
        //     key: drug.id
        //   }))
        // )}
        onChange={onChange}
        loading={isLoading}
        url={'/offer-drug-store/'}
        total={classList.total}
      />
    </div>
  );
};

export default Rate;