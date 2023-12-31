import './App.css';
import React, { useState, useEffect } from 'react';
import html2canvas from 'html2canvas';
import toast, { Toaster } from 'react-hot-toast';

//import serious from './serious.png';
//import funny from './funny.png';
//import funny_disabled from './funny-disabled.png';
//import serious_disabled from './serious-disabled.png';

import twitterX from './twitter-x.png';
import copyClip from './copy-clip.svg';
import screenshot from './screenshot.svg';
import magnifingGlass from './magnifying-glass.png';
import deleteIcon from './delete.png';

const tldrOptions = {
  "true": "true",
  "false": "false",
  "other": "other"
}

function App() {
  const [theory, setTheory] = useState("");
  const [fact, setFact] = useState("");
  const [logoAnimation, setlogoAnimation] = useState(false);
  const [showSearch, setShowSearch] = useState(true);
  const [disableSearch, setDisableSearch] = useState(false);
  //const [mode, setMode] = useState(true); // true is funny

  const onChangeHandler = event => {
    setTheory(event.target.value);
  };

  useEffect(() => {
    setShowSearch(true);
  },[theory]);

  function handle(e){
    if (theory.trim()=="") {
      return;
    }
    if (disableSearch) {
      return;
    }

    if(!e.key || e.key === "Enter"){
      setFact("");
      setDisableSearch(true);
      e.preventDefault(); // Ensure it is only this code that runs
      var xhr = new XMLHttpRequest();
      setlogoAnimation(true);
      xhr.onreadystatechange = function () {
          if (xhr.readyState === XMLHttpRequest.DONE) {
            try {
              if (xhr.status === 500) {
                setFact({
                  error: "Try again later..."
                });
              } else {
                setFact(JSON.parse(this.response));
              }
              setDisableSearch(false);
              setShowSearch(false);
            } catch (parseError) {
              console.log('Error parsing JSON response: ' + parseError);
            }
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
    html2canvas(document.querySelectorAll(".App")[0], { windowWidth: 1600, windowHeight: 900}).then(function(canvas) {
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

  let tldr = tldrOptions.other;
  if (fact && fact.tldr) {  
    let tldrText = fact.tldr.trim().toLowerCase();
    if (tldrText.indexOf("true") === 0) {
      tldr = tldrOptions.true;
    } else if (tldrText.indexOf("false") === 0) {
      tldr = tldrOptions.false;
    }
  }
  

  return (
    <div className="App">
      <div className="header-container">
        <div className={logoAnimation ? "logo logo-animation" : "logo"} />
        <h1 className="title">VEREALLY</h1>
        <h3 className="sub-title"> Ask whenever you're in doubt </h3>
      </div>
      <div className="input-containter">
        <img className="magnifying-glass" src={magnifingGlass} />
        {theory ? <img className="clean-input" src={deleteIcon} onClick={()=>{setTheory("")}} /> : ""}
        <input placeholder="Enter text to fact check in any language" className={'theory' + (showSearch ? '' :' padding-fix')} onChange={onChangeHandler} onKeyPress={handle} value={theory}></input>
        <div className={'button' + (showSearch ? '' :' hide-search') + (disableSearch? ' disable-search' : '')} onClick={handle}> Really? </div>
      </div>

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
      
      {fact && fact.error ?  
        <div className="fact-container">
          <div className="fact fact-title"> {fact.error} </div>
        </div>
      : ""}

      {fact && !fact.error ?  
        <div className="fact-container">
          <div className={'fact fact-tldr ' + (tldr===tldrOptions.true ? 'tldr-true' : (tldr===tldrOptions.false ? 'tldr-false' : ''))}> 
            {(fact.tldr ? fact.tldr.trim().replace(/\.$/, "") : "")} 
          </div>
          <br />
          <div className="fact fact-title"> X </div>
          <div className="fact"> {fact.x} </div>
          <br />
          <div className="fact fact-title"> SUMMARY </div>
          <div className="fact"> {fact.sum} </div>
          
          <div className="icons-container" data-html2canvas-ignore>
            <br />
            <img className="copy-button twitter-button" src={twitterX} onClick={()=>{copyText(true)}}  title="Copy X text to clipboard"/>
            <img className="copy-button" src={copyClip} onClick={()=>{copyText(false)}} title="Copy all text to clipboard"/>
            <img className="copy-button screen-shoot-button" src={screenshot} onClick={()=>{saveImage()}}   title="Save image"/>
          </div>
        </div>
      : ""}

      {fact && fact.sources ? <div className="source-container" data-html2canvas-ignore>
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
