// Get references to the containers
const container1 = document.getElementById("s2Box1");
const container2 = document.getElementById("s2Box2");

// Add a click event listener to the first container
container1.addEventListener("click", function() {
  // Show the second container
  container2.style.display = "block";
});


var pic1 = document.getElementById("pic1");
var pic2 = document.getElementById("pic2");
var currentPic = pic1;

function togglePicture() {
  if (currentPic == pic1) {
    pic1.style.display = "none";
    pic2.style.display = "inline-block";
    currentPic = pic2;
  } else {
    pic2.style.display = "none";
    pic1.style.display = "inline-block";
    currentPic = pic1;
  }
}