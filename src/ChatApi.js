import queryString from 'query-string';
import Cookies from 'js-cookie';

const BASE_URI = "https://assam.tea.ie.u-ryukyu.ac.jp/uiux/";
const WEBSOCKET_URI = "wss://assam.tea.ie.u-ryukyu.ac.jp/uiux/ws2";
const COOKIE_TOKEN_NAKE = 'chat_token';

var websock;

export async function request(endpoint, method = "GET")
{
    let res;
    try {
        const token = Cookies.get(COOKIE_TOKEN_NAKE);
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
        
    } catch(e) {
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

    } catch (e) {
        console.log("err on parsing json", e);
        return { ok: false, err: String(e) };
    }
}

export async function me() {
    return request("me/");
}

export async function getMessages(user_id) {

    if (user_id) {
        return request(`messages/?for_user=${user_id}`);
    } else {
        return request("messages/");
    }
}

export async function getMessage(id) {
    return request(`message/${id}/`);
}


export async function deleteMessages(){
    return request("messages/", "DELETE");
}

export async function exchangeToken(token) {
    return await request(`exchange_token/${token}/`);
}

export function getLoginUrl(room_id) {
    const THIS_URL = window.location.href;
    const LOGIN_URI = BASE_URI+`login/${room_id}/`;

    return LOGIN_URI+`?redirect=${THIS_URL}`;
}

export async function logout() {
    const res = await request('logout/');
    console.log("logout",res);
    window.location.reload();
    return res;
}

export function setCallbacks(funcs) {
    if (funcs.onopen)
        websock.onopen = funcs.onopen;
    if (funcs.onclose)
        websock.onclose = funcs.onclose;
    if (funcs.onmessage) {
        websock.onmessage = (res) => {
            const mes = JSON.parse(res.data);
            funcs.onmessage(mes);
        }
    }
}

export function openWebsocket(funcs)
{
    if(!websock || websock.readyState === WebSocket.CLOSED) {
        websock = new WebSocket(WEBSOCKET_URI);
    }

    if(funcs) {
        setCallbacks(funcs);
    }
}


export function sendMessage(message) {
    if (readyState() !== WebSocket.OPEN) {
        return false;
    }
    const token = Cookies.get(COOKIE_TOKEN_NAKE);
    message.token = token;        
    websock.send(JSON.stringify(message));
    return true;
}

export function readyState() {
    return websock.readyState;
}

export async function getToken() { 
    const query = queryString.parse(window.location.search);
  
    if(query.token) {
        console.log("exchange token");
        const res = await exchangeToken(query.token );
        if(res.ok && res.res) {
            //console.log("token", res.res.token);
            Cookies.set(COOKIE_TOKEN_NAKE, res.res.token);
        }else{
            console.log("bad token", res);
        }
        console.log("url",window.location.pathname);
        window.location.href = window.location.pathname ;
    } 
}