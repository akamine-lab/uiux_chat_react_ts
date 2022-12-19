import { useEffect, useState } from 'react';
import './App.css';
import { Auth, UserProvider, useUserContext } from './Auth';
import { Message } from './ChatApi';
import * as chatapi from './ChatApi';


function Chat() {
  const ctx = useUserContext();
  const [messages, setMessages] = useState(Array<Message>);
  const [message_detail, setMessageDetail] = useState<Message>();
  const [send, setSend] = useState("");

  chatapi.openWebsocket({
    onopen:()=>{
      console.log("open a webscoket");
    },
    onmessage:(mes)=>{
      setMessages([...messages, mes]);
    }
  });

  useEffect(() => {
    chatapi.getMessages().then((res) => {
      if (res.res) {
        setMessages([...res.res]);
      }
    });
  }, []);

  const handleChange = (e:any)=>{
    setSend(e.target.value);
  }

  const onSend = () => {
    chatapi.sendMessage({type:"message", text:send});
  }

  const onDelete = () => {
    chatapi.deleteMessages().then((res)=>{
      console.log(res);
      window.location.reload();
    });
  }
  
  const onMessage = async (id:number) => {
    const res = await chatapi.getMessage(id);
    if(res.ok) {
      setMessageDetail(res.res);
    }else {
      console.log(res.err);
    }
  }

  return (
    <div>
      <p>my id = {ctx.user?.nickname}</p>
      <input type="text" value={send} onChange={handleChange}></input>
      <button onClick={onSend}>send</button> <br></br>
      <button onClick={onDelete}>delete all</button>
      <h3>message detail</h3>
        <pre>{JSON.stringify(message_detail, null, "  ")}</pre>
      <h3>messages</h3>
      <div>{messages.map((m) =>
        <div key={m.id} onClick={()=>{onMessage(m.id)}}>{m.sender_id.substring(0,4)}... : {m.text}</div>
      )}</div>
    </div>
  )
}

 
function App() {
  useEffect(()=>{
    chatapi.getToken();
  },[]);
  return (
    <div className="App">
      <UserProvider>
        <Auth></Auth>
        <Chat></Chat>
      </UserProvider>
    </div>
  );
}

export default App;
