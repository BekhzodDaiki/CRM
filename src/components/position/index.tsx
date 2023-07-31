import { useNavigate, useSearchParams } from "react-router-dom";
import _ from 'lodash';
import Setting from "./setting";
import { Tabs } from "antd";
import Competitor from "./competitors";


const Position = () => {
  const navigate = useNavigate();

  const onChangeTab = (key: string) => {
    console.log(key);
    navigate('/position?page=1&size=20');
  };

  return (
    <Tabs
      onChange={onChangeTab}
      type="card"
      items={[
        {
          label: 'Настройка списка позиции',
          key: 'position',
          children: <Setting />,
        },
        {
          label: 'Конкуренты',
          key: 'competitor',
          children: <Competitor />,
        }
      ]}
    />
  );
};

export default Position;