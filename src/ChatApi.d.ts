
/**
 * User information
 */
export interface User {
    /** google account name of login user */
    name: string, 
    /** alias name of login user */
    nickname: string,
    /** Is login user a teacher? */
    is_teacher: boolean,
    /** the room id where user is logged in */
    room_id: number
}

/**
 * Data type of the message
 */
export interface Message {
    id: number;
    /** mesage status such as deleted, already read. you are free to use */
    state: string;
    /** Submission date */
    datetime: Date;
    /**　alias name of the user who posted this message */
    sender_id: string;
    /** destination user name (alias name) */
    reciever_id: string;
    /** message body */
    text: string;
    /** type of the message. programmers are free to use */
    type: string;
    title: string;
    sender_username?: string;
}

/**
 * Data format of a sending message
 */
export interface SendMessage {
    /** destination */
    reciever_id?: number;
    /** for api. you cannot set this */
    token?: string;
    /** message body */
    text: string;
    /** message type. programmers are free to use */
    type?: string;
}

/**
 * @private for api. no need to use this
 */
export interface ExchangeToken {
    token: string;
}

/**
 * api's response
 */
interface Response<T> {
    /** Was the api call successful? */
    ok: boolean;
    /** return value of the api call on succes */
    res?: T;
    /** error message of the api call if the api call was not succesful */
    err?: string;
};

export async function request<RTYPE>(endpoint: string, method: string = "GET") : Promise<Response<RTYPE>>
export async function me(): Promise<Response<User>>
/** 
 * get messages in the room that the user is logged in 
 * @param user_id - get only the messages that sent to the loggin user if this is set.
 **/
export async function getMessages(user_id?: string): Promise<Response<Array<Message>>> 
/**
 * get a message 
 * @param id - message id you want to get
 */
export async function getMessage(id: number): Promise<Response<Message>> 
/**
 * delete all messages in the room
 */
export async function deleteMessages(): Promise<Response<{ ok: boolean }>> 
/** @private for api  */
export async function exchangeToken(token:string) :Promise<Response<ExchangeToken>> 
/**
 * get the login url
 * @param room_id - the room number the user will be logged in
 */
export function getLoginUrl(room_id : number) : string
/** logout */
export async function logout() :Promise<Response<string>>
/**
 * open a websocket used to distribute the posted message 
 * @param funcs - callback functions 
 */
export function openWebsocket(funcs?: {
    onopen?: () => void,
    onclose?: () => void,
    /**
     * callback function called when a message is posted by a user
     * @param message - posted message
     */
    onmessage?: (message: Message) => void
}): void 
/**
 * see openWesocket
 */
export function setCallbacks(funcs?: {
    onopen?: () => void,
    onclose?: () => void,
    onmessage?: (message: Message) => void
}): void 
/**
 * send a message to all login users
 * @param message - the message to be sent
 */
export function sendMessage(message:SendMessage): boolean
/**
 * ready state of websocket
 * @link https://developer.mozilla.org/en-US/docs/Web/API/WebSocket/readyState
 */
export function readyState(): number
/** @private */
export async function getToken() : void