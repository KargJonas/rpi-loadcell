import './InfoBox.scss';

export default function InfoBox({ info }) {
  if (!info) return null;
  // const formattedInfo = info.map(i => <li>{i.label}: {i.value}</li>);
  // const formattedInfo = Object.keys(info).map((key) = >)

  const list = [];

  for (const [key, value] of Object.entries(info)) {
    list.push(<li key={key}>{key}: {value}</li>);
  }

  return (
    <div className='info-box'>
      <ul>{list}</ul>
    </div>
  );
}