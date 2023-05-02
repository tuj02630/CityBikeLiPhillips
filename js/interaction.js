// Get references to the containers
const container1 = document.getElementById("s2Box1");
const container2 = document.getElementById("s2Box2");

// Add a click event listener to the first container
container1.addEventListener("click", function() {
  // Show the second container
  container2.style.display = "block";
});