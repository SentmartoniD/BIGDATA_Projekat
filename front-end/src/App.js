import './App.css';
import { useEffect, useState } from 'react';
import { CreateSocket, CloseSocket, OpenSocket} from './services/SlaveService';

function App() {

  const [sockets, setSockets] = useState([]);
  const [messages, setMessages] = useState([]);

  const urls = [
    'ws://localhost:8091',
    'ws://localhost:8092',
    'ws://localhost:8093',
    'ws://localhost:8094',
  ]

  useEffect(() => {

    // const connectSOckets = () => {
    //   const webSockets = urls.map((url) => CreateSocket(url));
    //   setSockets(webSockets)
  
    //   sockets.forEach((webSocket) => OpenSocket(webSocket))
  
    //   // KAKO DA ZANM ZA KOJEG SOCKETA JE PORUKA
    //   sockets.forEach((webSocket) => 
    //     webSocket.onmessage = (event) => {
    //       setMessages((prevMessages) => [...prevMessages, JSON.parse(event.data)]);
    //     }
    //   )

    //   sockets.forEach((webSocket) => {
    //     webSocket.onclose = () => {
    //         console.log(`Attempting to reconnect to ${webSocket.url}...`);
    //         setTimeout(() => connectSOckets(), 5000); 
    //     }
    //   })
    // }

    const connectSockets = () => {
      const webSockets = urls.map((url) => {
          const webSocket = CreateSocket(url);
          OpenSocket(webSocket);
          
          // Handle incoming messages
          webSocket.onmessage = (event) => {
              setMessages((prevMessages) => [...prevMessages, JSON.parse(event.data)]);
          };

          // Handle connection close and attempt to reconnect
          webSocket.onclose = () => {
              console.log(`Connection closed for ${url}. Attempting to reconnect...`);
              setTimeout(() => {
                  console.log(`Reconnecting to ${url}...`);
                  connectSockets(); // Attempt to reconnect
              }, 5000); // Retry after 5 seconds
          };

          return webSocket;
      });

      setSockets(webSockets);
    };

    connectSockets();

    return () => {
      sockets.forEach((webSocket) => CloseSocket(webSocket))
    }

  }, [])

  return (
    <div style={{display: 'flex', flexDirection: "coulmn", gap: "10px"}} >
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  );
}

export default App;
