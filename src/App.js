import './App.css';
import React, { useState } from 'react';

import serious from './serious.png';
import funny from './funny.png';
import funny_disabled from './funny-disabled.png';
import serious_disabled from './serious-disabled.png';

function App() {
  const [theory, setTheory] = useState("");
  const [fact, setFact] = useState("");
  const [mode, setMode] = useState(true); // true is funny

  const onChangeHandler = event => {
    setTheory(event.target.value);
  };

  const seperator = "%%%SEPERATOR%%%";

  function handle(e,){
    if(!e.key || e.key === "Enter"){
      setFact("");
      document.querySelectorAll(".lds-roller")[0].style.setProperty('display', 'block');
      e.preventDefault(); // Ensure it is only this code that runs
      var xhr = new XMLHttpRequest();
      xhr.onreadystatechange = function () {
          if (xhr.readyState === XMLHttpRequest.DONE) {
            document.querySelectorAll(".lds-roller")[0].style.setProperty('display', 'none');
            setFact(this.response);
          }  
      };
      xhr.open("POST", 'https://rt09w8q66h.execute-api.us-east-1.amazonaws.com/', true);
      xhr.timeout = 90000; // time in milliseconds
      xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest'); 
      xhr.setRequestHeader('X-Referer', window.location.href);
      xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
      xhr.setRequestHeader('Content-Type', 'application/json');
      
      xhr.send(JSON.stringify({
        theory: theory
      }));
    }
  }

  return (
    <div className="App">
      <h1 className="title">Fact Checker</h1>
      <input placeholder="Paste text to be reviewed here and click “really?”" className="theory" onChange={onChangeHandler} onKeyPress={handle} value={theory}></input>
      <div className="button" onClick={handle}> Really? </div>
      <div className="responseStyle"> 
        <img src={mode ? serious_disabled : serious} onClick={(e)=>{setMode(false);}} alt="serious mode" />
        <img src={mode ? funny : funny_disabled} onClick={(e)=>{setMode(true);}} alt="funny mode" />
      </div>
      <div className="fact">{
        (fact.indexOf(seperator)===-1) ? fact : 
          (mode)? fact.split(seperator)[1].trim() : fact.split(seperator)[0].trim()}</div>

      <div className="lds-roller"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
    </div>
  );
}

export default App;
