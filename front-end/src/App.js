import './App.css';
import { useEffect, useState } from 'react';
import { CreateSocket, CloseSocket, OpenSocket } from './services/SlaveService';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { BarChart, Bar, Rectangle } from 'recharts';
import { PieChart, Pie, Sector, Cell } from 'recharts';

function App() {

  const [socket, setSocket] = useState();

  const url = 'ws://localhost:8090/ws'

  // ANALOG INPUTS
  const [analogInputs, setAnalogInputs] = useState([])
  const [minAnalogInput, setMinAnalogInput] = useState([])
  const [avgAnalogInput, setAvgAnalogInput] = useState([])
  const [maxAnalogInput, setMaxAnalogInput] = useState([])

  //DIGITAL INPUTS
  const [digitalInputs, setDigitalInputs] = useState([])
  const [digitalInputCurrentValue, setDigitalInputCurrentValue] = useState(0)
  const [timer, setTimer] = useState(0);

  // COILS 
  const [coils, setCoils] = useState({})
  const [coilsTimestamp, setCoilsTimestamp] = useState();

  //HOLDINGS
  const [holdings, setHoldings] = useState([])
  const [holdingRegister0, setHoldingRegister0] = useState()
  const [holdingRegister1, setHoldingRegister1] = useState()
  const [holdingRegister2, setHoldingRegister2] = useState()
  const [holdingRegister3, setHoldingRegister3] = useState()
  const [holdingRegister4, setHoldingRegister4] = useState()
  const [holdingRegister5, setHoldingRegister5] = useState()

  useEffect(() => {
    const webSocket = CreateSocket(url);
    OpenSocket(webSocket);
    setSocket(webSocket)

    webSocket.onmessage = (event) => {
      const parts = event.data.split(" ");
      if (parts[0] === "AnalogInputs") {
        const values = parts.slice(1, 13).map(Number);
        const timestamp = parts.slice(13).join(" ");
        setAnalogInputs((prevInputs) => [
          { timestamp: timestamp, Register0: Number(values[0]), Register1: Number(values[1]), Register2: Number(values[2]) },
          ...prevInputs.slice(0, 5),
        ]);
        setMinAnalogInput([values[3], values[4], values[5]])
        setAvgAnalogInput([values[6], values[7], values[8]])
        setMaxAnalogInput([values[9], values[10], values[11]])
      }
      if (parts[0] === "DigitalInputs") {
        const values = parts.slice(1, 2).map(String);
        const timestamp = parts.slice(2).join(" ");
        const register0Value = values[0] === "false" ? 0 : 1;

        // console.log("digitalInputCurrentValue", digitalInputCurrentValue)

        // console.log("register0Value", register0Value)
        // console.log("digitalInputs", digitalInputs[digitalInputs.length - 1])
        // if (digitalInputCurrentValue !== register0Value) {
        //   console.log("usao!")
        //   setTimer(0)
        // }
        // setDigitalInputCurrentValue(register0Value)

        setDigitalInputCurrentValue((prevValue) => {
          // Use the previous value for comparison
          if (prevValue !== register0Value) {
            setTimer(0); // Reset the timer if the value has changed
          }
          return register0Value; // Update to the new value
        });

        setDigitalInputs((prevInputs) => [
          { timestamp: timestamp, "Register0": register0Value },
          ...prevInputs.slice(0, 5),
        ]);
      }
      if (parts[0] === "Coils") {
        const values = parts.slice(1, 9).map(String);
        const timestamp = parts.slice(9).join(" ");
        setCoilsTimestamp(timestamp)
        setCoils(
          {
            timestamp: timestamp,
            "Register0": values[0], "Register1": values[1], "Register2": values[2], "Register3": values[3],
            "Register4": values[4], "Register5": values[5], "Register6": values[6], "Register7": values[7],
          });
      }
      if (parts[0] === "Holdings") {
        const values = parts.slice(1, 7).map(Number);
        const timestamp = parts.slice(7).join(" ");
        console.log(timestamp)
        setHoldings((prevInputs) => [
          { timestamp: timestamp, Register0: Number(values[0]), Register1: Number(values[1]), Register2: Number(values[2]), Register3: Number(values[3]), Register4: Number(values[4]), Register5: Number(values[5]) },
          ...prevInputs.slice(0, 5),
        ]);
      }
    };

    return () => {
      webSocket.close();
    };
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => prev + 1);
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const handleChangeState = (index) => {
    const value = coils["Register" + index] === "true" ? 0 : 1
    if (socket) {
      const message = 'Coil value: ' + value + " registerIndex " + index
      socket.send(message);
    }
  };

  const handleHoldingChange = (index) => {
    let registerValue;
    if (index === 0)
      registerValue = holdingRegister0
    else if (index === 1)
      registerValue = holdingRegister1
    else if (index === 2)
      registerValue = holdingRegister2
    else if (index === 3)
      registerValue = holdingRegister3
    else if (index === 4)
      registerValue = holdingRegister4
    else if (index === 5)
      registerValue = holdingRegister5
    if (socket) {
      const message = "Holdings value: " + registerValue + " registerIndex: " + index
      socket.send(message);
    }
  }

  return (
    <div>
      <h1 style={{ marginLeft: "500px" }} >SCADA HMI SMIMULATOR</h1>
      <div>
        <h2 style={{ marginLeft: "40px" }} >ANALOG INPUTS</h2>
        <div style={{ height: 300, width: 1200, margin: "10px" }} >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={analogInputs}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="timestamp"
                tick={{ fontSize: 9 }}
                reversed={false}
              />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="Register0" stroke="#8884d8" activeDot={{ r: 8 }} />
              <Line type="monotone" dataKey="Register1" stroke="#c98b16" />
              <Line type="monotone" dataKey="Register2" stroke="#1b9ca6" />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div style={{ marginLeft: "50px", marginTop: "30px" }} >
          <div>
            <label style={{ marginLeft: "40px", color: "#8884d8" }} >Register0 :</label>
            <label style={{ marginLeft: "30px", border: "1px solid #8884d8", padding: "10px", fontSize: "14px" }} >MIN VALUE: {minAnalogInput.length > 0 ? minAnalogInput[0].toFixed(2) : 0}</label>
            <label style={{ marginLeft: "30px", border: "1px solid #8884d8", padding: "10px", fontSize: "14px" }} >AVG VALUE: {avgAnalogInput.length > 0 ? avgAnalogInput[0].toFixed(2) : 0}</label>
            <label style={{ marginLeft: "30px", border: "1px solid #8884d8", padding: "10px", fontSize: "14px" }} >MAX VALUE: {maxAnalogInput.length > 0 ? maxAnalogInput[0].toFixed(2) : 0}</label>
          </div>
          <div style={{ marginTop: "30px" }} >
            <label style={{ marginLeft: "40px", color: "#c98b16" }} >Register0 :</label>
            <label style={{ marginLeft: "30px", border: "1px solid #c98b16", padding: "10px", fontSize: "14px" }} >MIN VALUE: {minAnalogInput.length > 0 ? minAnalogInput[1].toFixed(2) : 0}</label>
            <label style={{ marginLeft: "30px", border: "1px solid #c98b16", padding: "10px", fontSize: "14px" }} >AVG VALUE: {avgAnalogInput.length > 0 ? avgAnalogInput[1].toFixed(2) : 0}</label>
            <label style={{ marginLeft: "30px", border: "1px solid #c98b16", padding: "10px", fontSize: "14px" }} >MAX VALUE: {maxAnalogInput.length > 0 ? maxAnalogInput[1].toFixed(2) : 0}</label>
          </div>
          <div style={{ marginTop: "30px" }} >
            <label style={{ marginLeft: "40px", color: "#1b9ca6" }} >Register0 :</label>
            <label style={{ marginLeft: "30px", border: "1px solid #1b9ca6", padding: "10px", fontSize: "14px" }} >MIN VALUE: {minAnalogInput.length > 0 ? minAnalogInput[2].toFixed(2) : 0}</label>
            <label style={{ marginLeft: "30px", border: "1px solid #1b9ca6", padding: "10px", fontSize: "14px" }} >AVG VALUE: {avgAnalogInput.length > 0 ? avgAnalogInput[2].toFixed(2) : 0}</label>
            <label style={{ marginLeft: "30px", border: "1px solid #1b9ca6", padding: "10px", fontSize: "14px" }} >MAX VALUE: {maxAnalogInput.length > 0 ? maxAnalogInput[2].toFixed(2) : 0}</label>
          </div>
        </div>
        <div style={{ borderTop: "1px solid lightgray", margin: "40px 70px", borderRadius: "2px" }}></div>
      </div>
      <div style={{ marginTop: "10px" }} >
        <h2 style={{ marginLeft: "40px" }} >DIGITAL INPUTS</h2>
        <div style={{ height: 300, width: 1200 }} >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={digitalInputs}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="timestamp" />
              <YAxis ticks={[0, 1]} />
              <Tooltip />
              <Legend />
              {/* <Bar dataKey="pv" fill="#8884d8" activeBar={<Rectangle fill="pink" stroke="blue" />} /> */}
              <Bar dataKey="Register0" fill="#82ca9d" activeBar={<Rectangle fill="gold" stroke="purple" />} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div style={{ marginLeft: "50px", marginTop: "30px" }} >
          <label style={{ marginLeft: "30px", border: "1px solid #8884d8", padding: "10px" }} >Register0 STATE DURATION: {timer} s</label>
        </div>
      </div>
      <div style={{ borderTop: "1px solid lightgray", margin: "40px 70px", borderRadius: "2px" }}></div>
      <div >
        <h2 style={{ marginLeft: "40px" }} >COILS</h2>
        <h3 style={{ marginLeft: "40px" }} >Coils timestamp: {coilsTimestamp}</h3>
        {/* <div style={circleStyle}>
          {[0].bit === "true" ? 1 : 0}
        </div> */}
        <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap' }} >
          {coils !== null ? (
            Array.from({ length: 8 }, (_, index) => (
              <div>
                <div key={index} style={{
                  width: '100px',
                  height: '100px',
                  borderRadius: '50%',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: coils["Register" + index] === "true" ? '#FFC229' : 'black',
                  color: 'white',
                  fontSize: '24px',
                  fontWeight: 'bold',
                  margin: '20px 40px 10px 20px'
                }} >
                  {coils["Register" + index] === "true" ? 1 : 0}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', margin: '10px 0' }} >
                  <label style={{ marginBottom: "5px", marginLeft: "30px" }} >{"Register" + index}</label>
                  <button className='button-73' onClick={() => handleChangeState(index)} >CHANGE STATE</button>
                </div>
              </div>
            ))
          ) : (
            <></>
          )}
        </div>
      </div>
      <div style={{ borderTop: "1px solid lightgray", margin: "40px 70px", borderRadius: "2px" }}></div>
      <div>
        <h2 style={{ marginLeft: "40px" }} >HOLDINGS</h2>
        <div style={{ height: 300, width: 1200, margin: "10px" }} >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={holdings}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="timestamp"
                tick={{ fontSize: 9 }}
                reversed={false}
              />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="Register0" stroke="#9f33ff" activeDot={{ r: 8 }} />
              <Line type="monotone" dataKey="Register1" stroke="#ffd733" />
              <Line type="monotone" dataKey="Register2" stroke="#b5ff33" />
              <Line type="monotone" dataKey="Register3" stroke="#c98b16" />
              <Line type="monotone" dataKey="Register4" stroke="#33b8ff" />
              <Line type="monotone" dataKey="Register5" stroke="#ff3358" />

            </LineChart>
          </ResponsiveContainer>
        </div>
        <div style={{ marginLeft: "50px", marginTop: "30px" }} >
          <div>
            <label style={{ color: "#9f33ff" }} >Register0 : </label>
            <input type='number' value={holdingRegister0} onChange={(e) => setHoldingRegister0(e.target.value)} ></input>
            <button onClick={() => handleHoldingChange(0)} >Change Register0</button>
            <label style={{ marginLeft: "30px", color: "#ffd733" }} >Register1 : </label>
            <input type='number' value={holdingRegister1} onChange={(e) => setHoldingRegister1(e.target.value)} ></input>
            <button onClick={() => handleHoldingChange(1)} >Change Register1</button>
            <label style={{ marginLeft: "30px", color: "#b5ff33" }} >Register2 : </label>
            <input type='number' value={holdingRegister2} onChange={(e) => setHoldingRegister2(e.target.value)} ></input>
            <button onClick={() => handleHoldingChange(2)} >Change Register2</button>
          </div>
          <div style={{ marginTop: "20px" }} >
            <label style={{ color: "#c98b16" }} >Register3 : </label>
            <input type='number' value={holdingRegister3} onChange={(e) => setHoldingRegister3(e.target.value)} ></input>
            <button onClick={() => handleHoldingChange(3)} >Change Register3</button>
            <label style={{ marginLeft: "30px", color: "#33b8ff" }} >Register4 : </label>
            <input type='number' value={holdingRegister4} onChange={(e) => setHoldingRegister4(e.target.value)} ></input>
            <button onClick={() => handleHoldingChange(4)} >Change Register4</button>
            <label style={{ marginLeft: "30px", color: "#ff3358" }} >Register5 : </label>
            <input type='number' value={holdingRegister5} onChange={(e) => setHoldingRegister5(e.target.value)} ></input>
            <button onClick={() => handleHoldingChange(5)} >Change Register5</button>
          </div>
        </div>
      </div>
      <div style={{ borderTop: "1px solid lightgray", margin: "40px 70px", borderRadius: "2px" }}></div>
    </div >
  );
}

export default App;
