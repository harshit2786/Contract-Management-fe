import { useEffect, useState } from "react"

const WS_URL = `${import.meta.env.VITE_BACKEND_WS_ADDRESS}/ws/notification`

export const useSocket = () => {
    const [socket, setSocket] = useState<WebSocket | null>(null);

    useEffect(() => {
        const ws = new WebSocket(WS_URL);
        ws.onopen = () => {
            console.log("Connected");
            setSocket(ws);
        }
        ws.onclose = () => {
            console.log("Disconnected");
            setSocket(null);
        }
        return () => {
            ws.close();
        }
    }, []);
    return socket;
}
