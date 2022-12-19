import queryString from 'query-string';
import Cookies from 'js-cookie';

const BASE_URI = "https://assam.tea.ie.u-ryukyu.ac.jp/uiux/";
const WEBSOCKET_URI = "wss://assam.tea.ie.u-ryukyu.ac.jp/uiux/ws2";
const COOKIE_TOKEN_NAKE = 'chat_token';

export const websock = new WebSocket(WEBSOCKET_URI);

export interface User {
    name: string,
    nickname: string,
    is_teacher: boolean,
    room_id: number
}

export interface Message {
    id: number;
    state: string;
    datetime: Date;
    sender_id: number;
    reciever_id: number;
    text: string;
    type: string;
    title: string;
    sender_username?: string;
}

export interface SendMessage {
    reciever_id?: number;
    token?: string;
    text: string;
    type?: string;
}

export interface ExchangeToken {
    token: string;
}

interface Response<T> {
    ok: boolean;
    res?: T;
    err?: string;
};

export async function request<RTYPE>(endpoint: string, method: string = "GET")
    : Promise<Response<RTYPE>> {
    let res;
    try {
        const token = Cookies.get(COOKIE_TOKEN_NAKE)!;
        //console.log(token);
        res = await fetch(BASE_URI + endpoint, {
            method: method,
            mode: "cors",
            credentials: "include",
            cache: "no-cache",
            headers: {
                token
            }
        });
        
    } catch(e : unknown) {
        console.log("error on fetch:", e);
        return { ok: false, err: String(e) };
    }
    try {
        if (!res.ok) {
            if(res.status === 401) {
                Cookies.remove(COOKIE_TOKEN_NAKE);
            }

            return { ok: false, err: `${res.status} ${await res.text()}`  };
        }
        const json = await res.json();
        const ret = {
            ok: true,
            res: json
        };
        return ret;

    } catch (e : unknown) {
        console.log("err on parsing json", e);
        return { ok: false, err: String(e) };
    }
}

export async function me(): Promise<Response<User>> {
    return request<User>("me/");
}

export async function getMessages(user_id?: string):
    Promise<Response<Array<Message>>> {

    if (user_id) {
        return request<Array<Message>>(`messages/?for_user=${user_id}`);
    } else {
        return request<Array<Message>>("messages/");
    }
}

export async function deleteMessages(class_id?: number): Promise<Response<{ ok: boolean }>> {
    return request<{ ok: boolean }>("messages/", "DELETE");
}

export async function exchangeToken(token:string) :Promise<Response<ExchangeToken>> {
    return await request<ExchangeToken>(`exchange_token/${token}/`);
}

export function getLoginUrl(room_id : number) {
    const THIS_URL = window.location.href;
    const LOGIN_URI = BASE_URI+`login/{room_id}/`;

    return LOGIN_URI+`?redirect=${THIS_URL}`;
}

export async function logout() {
    const res = await request<string>('logout/');
    console.log("logout",res);
    window.location.reload();
    return res;
}


export function setCallbacks(funcs: {
    onopen?: () => void,
    onclose?: () => void,
    onmessage?: (message: Message) => void
}
): void {
    if (funcs.onopen)
        websock.onopen = funcs.onopen;
    if (funcs.onclose)
        websock.onclose = funcs.onclose;
    if (funcs.onmessage) {
        websock.onmessage = (res) => {
            const mes: Message = JSON.parse(res.data);
            funcs.onmessage!(mes);
        }
    }
}

export function sendMessage(message:SendMessage): boolean {
    if (readyState() !== WebSocket.OPEN) {
        return false;
    }
    const token = Cookies.get(COOKIE_TOKEN_NAKE)!;
    message.token = token;        
    websock.send(JSON.stringify(message));
    return true;
}

export function readyState(): number {
    return websock.readyState;
}

export async function  init() { 
    const query = queryString.parse(window.location.search);
  
    if(query.class_id) {
        Cookies.set('class_id', query.class_id as string);
    }
    if(query.token) {
        console.log("exchange token");
        const res = await exchangeToken(query.token as string);
        if(res.ok && res.res) {
            //console.log("token", res.res.token);
            Cookies.set(COOKIE_TOKEN_NAKE, res.res.token);
        }else{
            console.log("bad token", res);
        }
        console.log("url",window.location.pathname);
        window.location.href = window.location.pathname as string;
    } 
}