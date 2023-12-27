import './App.css';
import React, { useState } from 'react';
import html2canvas from 'html2canvas';
import toast, { Toaster } from 'react-hot-toast';

//import serious from './serious.png';
//import funny from './funny.png';
//import funny_disabled from './funny-disabled.png';
//import serious_disabled from './serious-disabled.png';

import twitterX from './twitter-x.png';
import copyClip from './copy-clip.png';
import screenshot from './screenshot.png';
import magnifingGlass from './magnifying-glass.png';
import deleteIcon from './delete.png';

function App() {
  const [theory, setTheory] = useState("");
  const [fact, setFact] = useState("");
  const [logoAnimation, setlogoAnimation] = useState(false);
  //const [mode, setMode] = useState(true); // true is funny

  const onChangeHandler = event => {
    setTheory(event.target.value);
  };

  function handle(e){
    if(!e.key || e.key === "Enter"){
      setFact("");
      e.preventDefault(); // Ensure it is only this code that runs
      var xhr = new XMLHttpRequest();
      setlogoAnimation(true);
      xhr.onreadystatechange = function () {
          if (xhr.readyState === XMLHttpRequest.DONE) {
            setFact(JSON.parse(this.response));
            setlogoAnimation(false);
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

  function copyText(onlyX) {
    let textToCopy = fact.fact + "\n https://www.vereally.com/" ;
    if (onlyX) {
      textToCopy = fact.fact.split("X - ")[1].split("SUMMARY")[0] + " https://www.vereally.com/";
    }
    navigator.clipboard.writeText(textToCopy);
    toast.success('Text copied to clipboard');
  }

  function saveImage() {
    /*
      html2canvas(document.body).then(function(canvas) {
                document.body.appendChild(canvas);
            });
    */
    html2canvas(document.querySelectorAll(".App")[0]).then(function(canvas) {
        saveAs(canvas.toDataURL(), 'vereally.png');
    });
  }

  function saveAs(uri, filename) {
    var link = document.createElement('a');
    if (typeof link.download === 'string') {
        link.href = uri;
        link.download = filename;
        //Firefox requires the link to be in the body
        document.body.appendChild(link);
        //simulate click
        link.click();
        //remove the link when done
        document.body.removeChild(link);
    } else {
        window.open(uri);
    }
  }

  return (
    <div className="App">
      <div className="header-container">
        <div className={logoAnimation ? "logo logo-animation" : "logo"} />
        <h1 className="title">VEREALLY</h1>
      </div>
      <div className="input-containter">
        <img className="magnifying-glass" src={magnifingGlass} />
        {theory ? <img className="clean-input" src={deleteIcon} onClick={()=>{setTheory("")}} /> : ""}
        <input placeholder="Enter your text and let’s check it" className="theory" onChange={onChangeHandler} onKeyPress={handle} value={theory}></input>
      </div>
      <div className="button" onClick={handle}> Really? </div>

      {/* 
        <div className="responseStyle"> 
          <img src={mode ? serious_disabled : serious} onClick={(e)=>{setMode(false);}} alt="serious mode" />
          <img src={mode ? funny : funny_disabled} onClick={(e)=>{setMode(true);}} alt="funny mode" />
        </div>
        {
        (fact.indexOf(seperator)===-1) ? fact : 
          (mode) ? fact.split(seperator)[1].trim() : fact.split(seperator)[0].trim()
        }
      */}
      
      {fact ?  
      <div className="fact-container">
        <div className="fact fact-tldr"> TLDR - {fact.tldr? fact.tldr.trim() : ""} </div>
        <br />
        <div className="fact fact-title"> X </div>
        <div className="fact"> {fact.x} </div>
        <br />
        <div className="fact fact-title"> SUMMARY </div>
        <div className="fact"> {fact.sum} </div>
        
        <div className="icons-container">
          <br />
          <img className="copy-button" src={twitterX} onClick={()=>{copyText(true)}} />
          <img className="copy-button" src={copyClip} onClick={()=>{copyText(false)}} />
          <img className="copy-button" src={screenshot} onClick={()=>{saveImage()}} />
        </div>
      </div>
      : ""}

      {fact && fact.sources ? <div className="source-container">
          <br />
          <div className="fact-sources-title">{fact && fact.sources ? "Sources:" : ""}</div>
          <div className="fact-sources">{fact && fact.sources ? fact.sources.map((source, id)=> <div key={id} className="fact-card">
              <div className="fact-card-title">{source.title}</div>
              
              <a href={source.url} className="fact-card-url">{source.url}</a>
            </div>) : ""}
          </div>
        </div> : ""}

        {/*<div className="fact-card-content">{source.content}</div>*/}
            
      <div className="footer"> Powered by People Who Aim for Justice </div>

      <Toaster />
    </div>
  );
}

export default App;
