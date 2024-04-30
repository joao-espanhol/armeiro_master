function loadDoc() {
    const xhttp = new XMLHttpRequest();
    xhttp.onload = function() {
      myFunction(this);
    }
    xhttp.open("GET", "data/materiais.xml");
    xhttp.send();
  }
  function myFunction(xml) {
    const xmlDoc = xml.responseXML;
    const x = xmlDoc.getElementsByTagName("radio");
    let table="";
    for (let i = 0; i <x.length; i++) { 
      table += "<tr><td>" +
      x[i].getElementsByTagName("ref")[0].childNodes[0].nodeValue +
      "</td><td>" +
      x[i].getElementsByTagName("grupo")[0].childNodes[0].nodeValue +
      "</td><td>" +
      x[i].getElementsByTagName("modelo")[0].childNodes[0].nodeValue +
      "</td><td>" +
      x[i].getElementsByTagName("ns")[0].childNodes[0].nodeValue +
      "</td><td>" +
      x[i].getElementsByTagName("bateria")[0].childNodes[0].nodeValue +
      "</td><td>" +
      x[i].getElementsByTagName("antena")[0].childNodes[0].nodeValue +
      "</td><td>" +
      x[i].getElementsByTagName("situacao")[0].childNodes[0].nodeValue +
      "</td><td>" +
      x[i].getElementsByTagName("alteracao")[0].childNodes[0].nodeValue +
      "</td></tr>";
    }
    document.getElementById("corpo-tabela").innerHTML += table;
  }
