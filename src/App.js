import './App.css';
import React, {useState} from 'react';

function App() {
  const [theory, setTheory] = useState("");
  const [fact, setFact] = useState("");

  const onChangeHandler = event => {
     setTheory(event.target.value);
  };

  function handle(e){
      if(!e.keyCode || e.keyCode === 13){
          setFact();
          document.querySelectorAll(".lds-roller")[0].style.setProperty('display', 'block');
          e.preventDefault(); // Ensure it is only this code that runs
          var xhr = new XMLHttpRequest();
          xhr.onreadystatechange = function () {
              if (xhr.readyState === XMLHttpRequest.DONE) {
                  document.querySelectorAll(".lds-roller")[0].style.setProperty('display', 'none');
                  setFact(this.response);
              }  
          };
          xhr.open("POST", 'http://fact-checker-env.eba-jjs6wwzd.us-east-1.elasticbeanstalk.com/', true);
          xhr.setRequestHeader('Content-Type', 'application/json');
          xhr.send(JSON.stringify({
              theory: theory
          }));
      }
  }

  return (
    <div className="App">
      <h1 className="title">Fact Checker</h1>
      <input placeholder="Paste text to be reviewed here and click “really?”" className="theory" onChange={onChangeHandler} value={theory}></input>
      <div className="button" onClick={handle}> Really? </div>
      <div className="fact">{fact}</div>

      <div className="lds-roller"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
    </div>
  );
}

export default App;
