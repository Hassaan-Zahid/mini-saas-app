import Pusher from 'pusher-js';
import { createContext, useContext, useEffect, useState } from 'react';

const PusherContext = createContext();

export const PusherProvider = ({ children }) => {
    const [pusher, setPusher] = useState(null);

    useEffect(() => {
        const pusherClient = new Pusher(process.env.REACT_APP_PUSHER_KEY, {
            cluster: process.env.REACT_APP_PUSHER_CLUSTER,
            forceTLS: true
        });

        setPusher(pusherClient);

        return () => {
            pusherClient.disconnect();
        };
    }, []);

    return (
        <PusherContext.Provider value={pusher}>
            {children}
        </PusherContext.Provider>
    );
};

export const usePusher = () => useContext(PusherContext);