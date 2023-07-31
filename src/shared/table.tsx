import { Table } from 'antd';
import { useNavigate } from 'react-router-dom';

export const CustomTable = ({
  dataColumn,
  onChange,
  data,
  loading,
  url,
  page,
  total,
  height = '40vh',
  pageSize = 20
}: any) => {
  const navigate = useNavigate();
  return (
    <Table
      scroll={{ y: height }}
      columns={dataColumn}
      dataSource={data}
      onChange={onChange}
      loading={loading}
      onRow={(record: any, rowIndex: any) => {
        return {
          onClick: (event) => {
            if (url) {
              return navigate(`${url}${record.id}/`)
            }
          }
        }
      }}
      pagination={{
        pageSize,
        current: page,
        total: total,
        hideOnSinglePage: true,
        showSizeChanger: false
      }}
    />
  );
};