console.log(document);

const numOfLinks = document.getElementsByTagName("a");

const outLinks = Array.from(numOfLinks).filter(element => {
  return element.href.indexOf("127.0.0.1") < 0;
});

console.log(numOfLinks.length);

console.log(outLinks.length);

const footer = document.getElementById("footer");

var a = document.createElement("a");
var linkText = document.createTextNode("my title text");
a.appendChild(linkText);
a.title = "my title text";
a.href = "http://example.com";
footer.appendChild(a);

const containers = document.getElementsByClassName("container");

console.log(
  Array.from(containers[1].childNodes).filter(node => node.nodeName == "P")
);
