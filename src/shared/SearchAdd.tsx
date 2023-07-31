import { PlusOutlined } from "@ant-design/icons";
import { Button, Input } from "antd";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface SearchAddType {
  search: boolean,
  label: string,
  searchKey: string,
  baseUrl: string,
  // requestUrl: Function,
  // handleResponse: Function,
  addUrl: string
}

const SearchAdd = ({
  search,
  label,
  searchKey,
  baseUrl,
  // requestUrl,
  // handleResponse,
  addUrl
}: SearchAddType) => {
  const navigate = useNavigate();
  const [timer, setTimer] = useState(null);
  return (
    <div
      style={{
        paddingBottom: 24,
        display: 'flex',
        justifyContent: 'space-between',
      }}
    >
      {search ?
        <Input
          style={{ width: '36vw' }}
          placeholder={`Enter the ${label}`}
          onChange={({ target: { value } }) => {
            if (timer) {
              clearTimeout(timer);
            }
            const newTimer = setTimeout(async () => {
              navigate(`/${baseUrl}/?${searchKey}=${value}&page=1`);
            }, 500)
            // @ts-ignore
            setTimer(newTimer)
          }}
        /> :
        ''
      }
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={() => navigate(addUrl)}
      >
        Add
      </Button>
    </div>
  );
};

export default SearchAdd;