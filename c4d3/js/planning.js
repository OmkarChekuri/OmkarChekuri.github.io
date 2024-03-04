// C4D3 is free software: you can redistribute it and/or modify it under
// the terms of the GNU Affero General Public License as published by the Free
// Software Foundation, either version 3 of the License, or (at your option) any
// later version.
//
// This file is distributed in the hope that it will be useful, but WITHOUT
// ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
// FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more
// details.
//
// You should have received a copy of the GNU Affero General Public License
// along with this program. If not, see <http://www.gnu.org/licenses/>.


// Get the default value of the slider
var slideCol = document.getElementById("myRange");


//change the value of text area to default slider value 
var PixelSize = document.getElementById("fontValue");
PixelSize.innerHTML = slideCol.value;



//get the text area element for the tex whose font size need to be changed
var paragraph1 = document.getElementById("text");
//var content1 = document.getElementById("text").textContent;


//get the html element for the tex which need to be truncated
var paragraph2 = document.getElementById("sentance");
var content2 = document.getElementById("sentance").textContent;

//get the svg element of the rectangle
var diagram = document.getElementById("rect");

//get the opValue element
var opacityText = document.getElementById("opValue");

//update all the elements based on new slider value
slideCol.oninput = function () {
    PixelSize.innerHTML = this.value;
    paragraph1.style.fontSize = this.value + "px";
    paragraph2.innerHTML = content2.substring(0, this.value);
    diagram.style.fillOpacity = this.value + "%";
    opacityText.innerHTML = "Opacity:" + this.value/100 ;

}



/* var fontControl = document.getElementById("value");

  fontControl.onchange = function () {
      var slideColl = document.getElementById("myRange");
      slideColl.value = (fontControl.innerText) + "px";

  } */

var pixelchange = document.getElementById("fontValue");


pixelchange.oninput = function () {
    slideCol.value = this.value;
    paragraph1.style.fontSize = this.value + "px";
    paragraph2.innerHTML = content2.substring(0, this.value);
    diagram.style.fillOpacity = this.value + "%";



}


function applychange(){
//update all the elements based on new slider value
slideCol.oninput = function () {
    PixelSize.innerHTML = this.value;
    paragraph1.style.fontSize = this.value + "px";
    paragraph2.innerHTML = content2.substring(0, this.value);
    diagram.style.fillOpacity = this.value + "%";

}

}

//print alert for html body

function PrintAlert() {
    alert("This document is now being printed");
}

//get the default color of the radio button
var RectColor = document.getElementsByClassName("color");

RectColor.oninput = function(){
    document.getElementById("rect").style.fill = rgb(87, 50, 65);

}



function handleClick(myRadio) {

    document.getElementById("rect").style.fill = myRadio.value;

    /* alert('Old value: ' + currentValue);
    alert('New value: ' + myRadio.value);
    currentValue = myRadio.value; */
    
}