
export const CreateSocket = (url) => {

    const webSocket = new WebSocket(url);
    
    console.log(`WebSocket ${webSocket} created`);

    return webSocket;
}

export const OpenSocket = (webSocket) => {
    webSocket.onopen = () => {
        console.log(`WebSocket connection opened to ${webSocket}`);
      };
}

export const CloseSocket = (webSocket) => {
    webSocket.onclose = () => {
        console.log(`WebSocket connection closed to ${webSocket}`);
      };
}
