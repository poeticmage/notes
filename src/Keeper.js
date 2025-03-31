import './App.css';
import React from "react";

function Note(props){
  // const[]=React.useState();
    const[buttdel,buttMousedel]=React.useState({width:"36px",height:"36px",fontSize:"1.1em",color:"#dcd8bc"});
    const[exp,expanded]=React.useState(false);
    function mouseOverdel(){
        buttMousedel({width:"72px",height:"72px",fontSize:"2.2em",color:"white"});
      }
      function mouseOutdel(){
        buttMousedel({width:"36px",height:"36px",fontSize:"1.1em",color:"#dcd8bc"});
      }
      function deleteN(){
        mouseOutdel();
        props.delButton();
      }

      function fullForm(){ //console.log("expanded");
        expanded(e=>!e);
      }
      function editform(e){ //console.log("expanded");
        e.stopPropagation();
        props.extractingnote();
        expanded(false);
      }
      function undoeff(){
        expanded(false);
      }

    return <div className={!exp?"note":"expanded"} onClick={fullForm} onDoubleClick={editform} onMouseLeave={undoeff}>
        <h1>{props.heading}</h1>
        <p>{props.para}</p>
        {exp&&<button className="deletebutton" onClick={deleteN} onMouseOver={mouseOverdel} onMouseOut={mouseOutdel} style={buttdel}>🗑</button>}
    </div>
}
export default Note;