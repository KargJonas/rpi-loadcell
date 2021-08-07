import './Settings.scss';

export default function Settings({ closeSettings, open, maxValues }) {
  // let maxValues = 400;

  let _maxValues = maxValues;

  if (!open) return null;

  return (
    <div className='settings'>
      <button onClick={() => closeSettings({ maxValues: _maxValues })}>Close</button>
      <h1>Settings</h1>

      <label htmlFor="max-values">Max Data Points</label>
      <br />
      <input type="number" id="max-values" defaultValue={_maxValues} onChange={(e) => _maxValues = e.target.values | 0}></input>
    </div>
  );
}