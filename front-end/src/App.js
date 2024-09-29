import './App.css';
import { useEffect, useState } from 'react';
import { CreateSocket, CloseSocket, OpenSocket } from './services/SlaveService';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { BarChart, Bar, Rectangle } from 'recharts';
import { PieChart, Pie, Sector, Cell } from 'recharts';

function App() {

  const [sockets, setSockets] = useState([]);
  const [messages, setMessages] = useState([]);

  const [socket, setSocket] = useState();
  const [message, setMessage] = useState();

  const urls = [
    'ws://localhost:8090/ws',
    'ws://localhost:8091/ws',
    'ws://localhost:8092/ws',
    'ws://localhost:8093/ws',
  ]

  // ANALOG INPUTS
  const [analogInputs, setAnalogInputs] = useState([])
  const [minAnalogInput, setMinAnalogInput] = useState([])
  const [avgAnalogInput, setAvgAnalogInput] = useState([])
  const [maxAnalogInput, setMaxAnalogInput] = useState([])

  //DIGITAL INPUTS
  const [digitalInputs, setDigitalInputs] = useState([])
  const [digitalInputTimestamp, setDigitalInputTimestamp] = useState(null)
  const [digitalInputCurrentValue, setDigitalInputCurrentValue] = useState()
  const [timer, setTimer] = useState(0);

  // COILS 
  const [coils, setCoils] = useState({})
  const [coilsTimestamp, setCoilsTimestamp] = useState();

  useEffect(() => {
    const webSocket = CreateSocket('ws://localhost:8090/ws');
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
        setDigitalInputCurrentValue(values[0] === "false" ? 0 : 1)
        setDigitalInputs((prevInputs) => [
          { timestamp: timestamp, "Register0": register0Value },
          ...prevInputs.slice(0, 5),
        ]);

        // console.log(register0Value)
        // console.log(digitalInputs > 0 ? digitalInputs[5]["Register0"] : "nope")
        // console.log("HI, 111111")
        // if (digitalInputs[5]["Register0"] !== register0Value) {
        //   console.log("HI, 222222222")
        //   setTimer(0);
        // }
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
    const value = coils["Register" + index] === 1 ? 0 : 1
    console.log("value", value)
    if (socket) {
      const message = 'value: ' + value + " registerIndex " + index
      socket.send(message);
    }
  };

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
          <label style={{ marginLeft: "30px", border: "1px solid #8884d8", padding: "10px" }} >Register0 DURATION: {timer} s</label>
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
                  backgroundColor: coils["Register" + index] === "true" ? '#FFCCCB' : 'black',
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
      </div>
      <div style={{ borderTop: "1px solid lightgray", margin: "40px 70px", borderRadius: "2px" }}></div>
    </div >
  );
}

export default App;
