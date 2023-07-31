import Icon from "@ant-design/icons/lib/components/Icon";
import { Table } from "antd";

const RowSelectionTable = ({
  columns,
  dataList,
  dataType,
  onChange,
  isLoading,
  data,
  setSelected,
  pageSize=20,
  current=1,
  height="42vh",
  rowSelection=true
}: any) => {
  const rowSelectionFunc = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: any) => {
      // @ts-ignore
      setSelected(selectedRowKeys);
    },

  };

  const tableLoading = {
    spinning: isLoading,
    indicator: <Icon type="loading"  />,
  }
  return (
    <div>
      <Table
        scroll={{ y: height }}
        columns={columns}
        dataSource={dataList.map(
          ((datum: any) => ({
            ...datum,
            key: datum.id
          }))
        )}
        onChange={onChange}
        // loading={isLoading}
        loading={tableLoading}
        // onRow={(record: any, rowIndex: any) => {
        //   return {
        //     onClick: (event) => {
        //       return navigate(`/position/${record.id}/`)
        //     }
        //   }
        // }}
        //@ts-ignore
        rowSelection={rowSelection ? rowSelectionFunc : false}
        pagination={{
          pageSize,
          current,
          total: data.total,
          hideOnSinglePage: true,
          showSizeChanger: false
        }}
      />
    </div>
  );
};

export default RowSelectionTable;
