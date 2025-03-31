import './App.css';
import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import Keeper from "./Keeper";
import axios from "axios";//To Connect with Server...
import sweetalert from "sweetalert2";


function App() {
  const[signintext,signF]=React.useState({username:"",password:""});
  const[signed,signedfunc]=React.useState(false);
  const[userShow,userShowF]=React.useState("");
  //
  const[button,buttMouse]=React.useState({fontSize: "1.1em"});
  const[inputbutton,inpbuttMouse]=React.useState({width: "36px",height: "36px",fontSize:"1.1em"});
  const[obj,inp]=React.useState({title:"",content:""});
  const[arr,sub]=React.useState([]);
  const[nt,setnt]=React.useState([]);
  // const[trig,statetrigger]=React.useState(false);
  const[inputBar,inputBarVis]=React.useState(false);
  const[signBar,signBarVis]=React.useState(false);
  // const[edIndex,editNote]=React.useState(null);

  
  
  function mouseOver(){
    buttMouse({fontSize: "2.1em",color: "#6C6A64"});
  }
  function mouseOut(){
    buttMouse({fontSize: "1.1em",color:"black"});
  }
function inpmouseOver(){ //console.log("gliiter");
  inpbuttMouse({width: "72px",height: "72px",fontSize:"2.2em"});
}
function inpmouseOut(){
  inpbuttMouse({width: "36px",height: "36px",fontSize:"1.1em"});
}

  function inputButt(){
    if(signBar) return;
    return inputBarVis(true);
  }
  function signButt(){
    textSubmit();
    inputBarVis(false);
    return signBarVis(true);
  }
  function noSign(){
    signBarVis(false);
  }


  function textGrab(e){
      const x=e.target.value; //console.log(x);
      const y=e.target.name;
      inp(old=>{
      if(y==="input"){return({title:x,content:old.content});}
      if(y==="textarea"){return({title:old.title,content:x});}
    });
  }

  async function textSubmit(){ 
   
    var x1=obj?.title?obj.title.trim():""; var x2=obj?.content?obj.content.trim():""; //console.log(x1+" "+x2);
    var time=new Date().toLocaleDateString()+new Date().toLocaleTimeString();
    if(x2!==""){ 
      if(x1==="") x1="Untitled"+time;
      const newArr=[...arr,{title:x1,content:x2}];
      sub(newArr); 
      setnt(old => [...old, {title:x1, content:x2}]);
      inp({title:"",content:""});
      inputBarVis(false);
      // statetrigger(e=>!e);
      
    }
    if(x1===""&&x2==="") inputBarVis(false);
    inpbuttMouse({width: "36px",height: "36px",fontSize:"1.1em"});
  }
  
  function deletenote(e){
    if(window.confirm("Delete This Note?")){
      setnt(old=>{
        var newNotes = [...old];
        newNotes.splice(e, 1); 
        return newNotes;
      });
    }
  }

  function extractF(e){
    // editNote(e);
    setnt(old=>{
      var newNotes = [...old];
      inp(newNotes[e] || { title: "", content: "" });
      newNotes.splice(e, 1); 
      return newNotes;
    });
    inputBarVis(true);

  }

  function f(e,index){
    return <Keeper key={index} heading={e.title} para={e.content} delButton={()=>deletenote(index)} extractingnote={()=>extractF(index)}/>
  }


// Back end - front end interaction

 async function senddata(){
  const username=userShow;
  const userdata=JSON.stringify(nt);
   axios.put(`https://notesappbackend-eight.vercel.app/loginPut/${username}`,userdata,{
    headers: {"Content-Type": "application/json" } //The Top option in postman for put requests
  });
}

 function signgrab(e){
  var x=e.target.name; var y=e.target.value;
  signF(old=>{
    if(x==="username") return {username:y,password:old.password};
    if(x==="password") return {username:old.username,password:y};
  });

 }
 
 async function signinfire(){
  const username=signintext.username.replace(/\s+/g, "");; const password=signintext.password;
  if(username===""||password===""){
    window.alert("username, passwords should not be spaces...");
    return;
  }
  try{
    const getInfo= await axios.get("https://notesappbackend-eight.vercel.app/loginGet",{
      params:{username,password}
    });
    const data=getInfo.data;
    if(data.username==="") window.alert("NEW USER? User name taken- Get a different user name. OLD USER? Wrong password-Try Harder");
    else{      //console.log("Data received:", data.note.length);
      setnt(old => [...data.note, ...old]);
      signBarVis(false);
      signedfunc(true);
      userShowF(data.username);
      sweetalert.fire({
        title:"Congrats",
        text: `${data.username} is Logged In`,
        icon: "success"
        
      });
    }
  }
  catch(e){
    console.error("at login "+e);
    window.alert(`Sign-in/up failed, try again ${e}`);//
  }

 }

 async function logoutButt(){
  await senddata();
  signedfunc(false);
  sessionStorage.clear(); 
  window.location.replace("https://notes-sepia-ten.vercel.app/"); ///react
  await sweetalert.fire({
    title:"Congrats",
    text: `${userShow} is Logged Out`,
    icon: "success"
    
  });

 }

     //Offline update
  window.addEventListener("offline",async ()=>{
    if(signed){
      await textSubmit();
      inputBarVis(false);
      await senddata();
      await sweetalert.fire({
        title:"Offline",
        text: `Offline. Check You Data`,
        icon: "info"
        
      });
    }
  });
//USE EfFFECT AWAIT for unloaded and refresh

  React.useEffect(()=>{
    const saveOnUnload=(e)=>{
      if(signed){
        window.alert("Succesfully Updated");   
         textSubmit();
         senddata();
        //signedfunc(false);  Log out
       }
    };
    window.addEventListener("beforeunload", saveOnUnload);
    return () => {
      window.removeEventListener("beforeunload", saveOnUnload);
    };
  }, [signed, nt]);

  return (
    <div >
      <Header/>
      <div className="button-container"><h1>{!signed&&<button className="loginbutton" title="Sign in/up" onClick={signButt} >♺</button>}
        {signed&&<button className="loginbutton" title="Log Out" onClick={logoutButt} >🖜</button>}</h1>
      <h1><button className="buttoncs" style={button} onClick={inputButt} onMouseOver={mouseOver}onMouseOut={mouseOut} >+</button></h1> 
      </div>
    <div style={{position:"absolute"}}> 
      {inputBar&&(
        <form autoComplete="off">
          <input name="input" placeholder="What is it?" onChange={textGrab} value={obj.title} maxLength={70}></input>
          <textarea name="textarea" placeholder="Write your thoughts..." rows="3" className="webkitscroll" maxLength={5000} onChange={textGrab} value={obj.content} />
          <button type="button" className="buttoncs" onClick={textSubmit} style={inputbutton} onMouseOver={inpmouseOver}onMouseOut={inpmouseOut}>+</button>
       </form>
      )}

    {signBar && <div className="overlay"></div>}
    {signBar&&(
        <form className="signForm">
          <button type="button" className="buttoncsX" onClick={noSign}>x</button>
          <input name="username" placeholder="Your User Name: all small, no space..."   maxLength={30} onChange={signgrab} value={signintext.username}></input>
          <input name="password" placeholder="Your Password..."   maxLength={20} onChange={signgrab} value={signintext.password}></input>
          <button type="button" className="buttoncsL" onClick={signinfire}>+</button>
       </form>
      )} 


      {nt.map(f)}
    </div> 
      <Footer/>
     
    </div>
  );
}

export default App;
