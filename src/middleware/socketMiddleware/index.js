import * as socketActions from './module';

export default function createSocketMiddleware() {
    let socket = null;
    const onOpen = (token) => evt => {
        console.log('WS is onOpen');
        // console.log('token ' + token);
        // console.log('evt ' + evt.data);
    };
    const onClose = (store) => evt => {
        console.log('WS is onClose');
        console.log('evt ' + evt.data);
        store.dispatch(socketActions.socketsDisconnect());
    }

    const onMessage = (ws, store) => evt => {
        // Parse the JSON message received on the websocket
        //console.log(evt.data)
        const data = JSON.parse(evt.data.replace(/#!NGINXNMS!#|#!NGINXNME!#/g,'').replace(/'/g,'"'))

        const msg = data.text.MESSAGE[0].params
        if(msg.data) {
            store.dispatch(socketActions.socketsMessageReceiving(msg));
        }
    }

    return store => next => action => {
        switch (action.type) {
            case 'SOCKETS_CONNECT':
                if (socket !== null) {
                    console.log('SOCKETS_DISCONNECTING');
                    store.dispatch(socketActions.socketsDisconnecting());
                    socket.close();
                }
                console.log('SOCKETS_CONNECTING')
                const timestampt = +(new Date())
                socket = new WebSocket('wss://test.edem-v-gosti.ru/bitrix/subws/?CHANNEL_ID=' + action.payload + '&tag=1&rnd=' + timestampt)
                store.dispatch(socketActions.socketsConnecting())
                socket.onmessage = onMessage(socket, store)
                socket.onclose = onClose(store)
                socket.onopen = onOpen(action.token)
                break;
            case 'SOCKETS_DISCONNECT':
                if (socket !== null) {
                    console.log('SOCKETS_DISCONNECTING');
                    store.dispatch(socketActions.socketsDisconnecting());
                    socket.close();
                }
                socket = null;
                break;
            default:
                return next(action);
        }
    };
}