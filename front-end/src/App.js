import './App.css';
import { useEffect, useState } from 'react';
import { CreateSocket, CloseSocket, OpenSocket } from './services/SlaveService';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

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

  const [analogInputs, setAnalogInputs] = useState(
    Array.from({ length: 5 }, () => ({ name: "", r0: "", r1: "", r2: "" }))
  );

  const addInput = (newData) => {
    setAnalogInputs((prevInputs) => {
      // Add new data to the front and slice to maintain only the last 5 elements
      const updatedInputs = [{ ...newData }, ...prevInputs.slice(0, 4)];
      return updatedInputs;
    });
  };

  const [data, setData] = useState([
    {
      name: '01/02/2024',
      uv: 4000,
      pv: 2400,
    },
    {
      name: 'Page B',
      uv: 3000,
      pv: 1398,
    },
    {
      name: 'Page C',
      uv: 2000,
      pv: 9800,
    },
    {
      name: 'Page D',
      uv: 2780,
      pv: 3908,
    },
    {
      name: 'Page E',
      uv: 1890,
      pv: 4800,
    },
    {
      name: 'Page F',
      uv: 2390,
      pv: 3800,
    },
    {
      name: 'Page G',
      uv: 3490,
      pv: 4300,
    },
    // ... more initial data
  ]);

  // useEffect(() => {

  //   const connectSockets = () => {
  //     const webSockets = urls.map((url) => {
  //       const webSocket = CreateSocket(url);
  //       OpenSocket(webSocket);

  //       // Handle incoming messages
  //       webSocket.onmessage = (event) => {
  //         console.log("---------mmmm")
  //         console.log(event.data)
  //         setMessages((prevMessages) => [...prevMessages, JSON.parse(event.data)]);
  //       };

  //       // Handle connection close and attempt to reconnect
  //       webSocket.onclose = () => {
  //         console.log(`Connection closed for ${url}. Attempting to reconnect...`);
  //         setTimeout(() => {
  //           console.log(`Reconnecting to ${url}...`);
  //           connectSockets(); // Attempt to reconnect
  //         }, 5000); // Retry after 5 seconds
  //       };

  //       return webSocket;
  //     });

  //     setSockets(webSockets);
  //   };

  //   connectSockets();

  //   return () => {
  //     sockets.forEach((webSocket) => CloseSocket(webSocket))
  //   }

  // }, [])

  useEffect(() => {
    const webSocket = CreateSocket('ws://localhost:8090/ws');

    OpenSocket(webSocket);

    webSocket.onmessage = (event) => {
      console.log("---------message--------")
      console.log(event.data)
      const parts = event.data.split(" ");
      const values = parts.slice(1, 4).map(Number); // Convert to integers
      const timestamp = parts.slice(4).join(" "); // Join the remaining parts for the timestam
      console.log("values", values)
      console.log("trimestamp", timestamp)
      //setMessages((prevMessages) => [...prevMessages, JSON.parse(event.data)]);
    };
  }, [])

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setData((prevData) =>
  //       prevData.map((entry) => ({
  //         ...entry,
  //         uv: Math.floor(Math.random() * 5000), // Randomly update `uv`
  //         pv: Math.floor(Math.random() * 5000), // Randomly update `pv`
  //       }))
  //     );
  //   }, 4000); // Update every 2 seconds

  //   return () => clearInterval(interval); // Cleanup on unmount
  // }, []);

  return (
    // <div style={{ height: 400, width: 600, margin: "10px" }} >
    //   <ResponsiveContainer width="100%" height="100%">
    //     <LineChart
    //       //width={500}
    //       //height={300}
    //       data={data}
    //       margin={{
    //         top: 5,
    //         right: 30,
    //         left: 20,
    //         bottom: 5,
    //       }}
    //     >
    //       <CartesianGrid strokeDasharray="3 3" />
    //       <XAxis dataKey="name" />
    //       <YAxis />
    //       <Tooltip />
    //       <Legend />
    //       <Line type="monotone" dataKey="pv" stroke="#8884d8" activeDot={{ r: 8 }} />
    //       <Line type="monotone" dataKey="uv" stroke="#82ca9d" />
    //     </LineChart>
    //   </ResponsiveContainer>
    //   <div><label>affaafa1f</label></div>
    //   <div style={{ borderTop: "1px solid lightgray", margin: "20px 0px", borderRadius: "2px" }}></div>
    //   <div></div>
    //   <div style={{ borderTop: "1px solid lightgray", margin: "20px 0px", borderRadius: "2px" }}></div>
    //   <div></div>
    // </div>
    <h1>sqq</h1>
  );
}

export default App;
