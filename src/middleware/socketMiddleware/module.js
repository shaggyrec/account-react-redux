export const SOCKETS_CONNECTING = 'SOCKETS_CONNECTING';
export const SOCKETS_DISCONNECTING = 'SOCKETS_DISCONNECTING';
export const SOCKETS_MESSAGE_SENDING = 'SOCKETS_MESSAGE_SENDING';
export const SOCKETS_MESSAGE_RECEIVING = 'SOCKETS_MESSAGE_RECEIVING';
export const SOCKETS_MESSAGE_RECEIVE = 'SOCKETS_MESSAGE_RECEIVE';
export const SOCKETS_CONNECT = 'SOCKETS_CONNECT';
export const SOCKETS_DISCONNECT = 'SOCKETS_DISCONNECT';
export const SOCKETS_MESSAGE_DELETE = 'SOCKETS_MESSAGE_DELETE'

const initialState = {
    loaded: false,
    message: 'Just created',
    messages: [],
    connected: false,
}

export function socketsConnecting() {
    return {type: SOCKETS_CONNECTING};
}
export function socketsConnect(channelId) {
    return {
        type: SOCKETS_CONNECT,
        payload: channelId
    }

}
export function socketsDisconnecting() {
    return {type: SOCKETS_DISCONNECTING};
}
export function socketsDisconnect() {
    return {type: SOCKETS_DISCONNECT};
}

export function socketsMessageReceiving(receiveMessage) {
    return {type: SOCKETS_MESSAGE_RECEIVING, message_receive: receiveMessage};
}

export function socketsMessageDelete (index){
    return {
        type: 'SOCKETS_MESSAGE_DELETE',
        index:index
    }
}

export default function reducer(state = initialState, action = {}) {
    let messages = []
    switch (action.type) {
        case SOCKETS_CONNECTING:
            return Object.assign({}, state, {
                loaded: true,
                message: 'Connecting...',
                messages:[],
                connected: false
            });
        case SOCKETS_DISCONNECTING:
            return Object.assign({}, state, {
                loaded: true,
                message: 'Disconnecting...',
                connected: true
            });
        case SOCKETS_MESSAGE_SENDING:
            return Object.assign({}, state, {
                loaded: true,
                message: 'Send message',
                connected: true
            });
        case SOCKETS_MESSAGE_RECEIVING:
            messages = state.messages
            messages.unshift(action.message_receive)
            return Object.assign({}, state, {
                loaded: true,
                message: 'Message receive',
                messages: messages,
                connected: true
            })
        case SOCKETS_MESSAGE_DELETE:
            messages = state.messages
            messages.splice(action.index, 1)
            return Object.assign({}, state, {
                loaded: true,
                message: 'Message receive',
                messages: messages,
                connected: true
            })
        default:
            return state;
    }
}