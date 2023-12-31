import { Input } from 'antd';
const { TextArea } = Input;

function TxItemList(props: { data: any }) {
  console.log('TxItemList-props:', props);
  const { data } = props;
  const tx = (data && data[0] && data[0].des) || '';
  console.log('tx- disabled :', tx);
  return (
    <div className="textarea">
      <TextArea rows={15} value={tx || ''} />
    </div>
  );
}

export default TxItemList;
