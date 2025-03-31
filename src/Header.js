import './App.css';
import React from "react";

function Header(){
    const[glit,glitter]=React.useState(false);
    function mouseOverHeader(){
        glitter(true);
      }
      function mouseOutHeader(){
        glitter(false);
      }

    return <header>
        <h1 style={{fontFamily:"'Pacifico', cursive", fontWeight: "bold"}} onMouseOver={mouseOverHeader}onMouseOut={mouseOutHeader} className={glit?"glitter":""}>WELCOME TO Notes App </h1>
    </header>;
}
export default Header;