import { Input } from "antd";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const SearchFilter = ({
  width = '36vw',
  placeholder,
  searchKey,
  setLoading,
  baseUrl,

}: any) => {
  const [timer, setTimer] = useState(null);
  const navigate = useNavigate();
  // const [searchKey, setSearchKey] = useState();
  return (
    <Input
      style={{ width, marginBottom: 20 }}
      placeholder={`Введите аптеку ${placeholder}`}
      // value={searchKey}
      onChange={({ target: { value } }: any) => {
        setLoading(true);
        if (timer) {
          clearTimeout(timer);
        }
        const newTimer = setTimeout(async () => {
          setLoading(false);
          navigate(`/${baseUrl}/?${searchKey}=${value}&page=1`);
          
        }, 500)
        // @ts-ignore
        setTimer(newTimer)
      }}
    />
  );
}

export default SearchFilter;