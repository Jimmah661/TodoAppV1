// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyC_Ey7J_wjFNbkiemABddeMZ69c4lHzxkI",
  authDomain: "todolist-a02f5.firebaseapp.com",
  projectId: "todolist-a02f5",
  storageBucket: "todolist-a02f5.appspot.com",
  messagingSenderId: "216375429741",
  appId: "1:216375429741:web:23c2d86d46ad5b09968d64"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
var database = firebase.firestore();

var submitButton = document.getElementById("submitButton");
var inputField = document.getElementById("todoInput");
var todoList = document.getElementById("todoList");

const addTodo = () => {
  let newTodo = {
    todoContent: inputField.value,
    isCompleted: false,
    dateSubmitted: new Date()
  };
  database.collection('todo').add(newTodo);
  console.log('Todo Added');
  inputField.value = "";
}

const listenForChanges = () => {
  // Open snapshot listener
  database.collection('todo').onSnapshot(querySnapshot => {
    // Check snapshot for changes from the last version
    querySnapshot.docChanges().forEach(change => {

      // If an item was Added to the firestore database run this action
      if (change.type === 'added') {
        // Create List item
        let listItem = document.createElement("LI");
        listItem.setAttribute('id', change.doc.id)
        listItem.setAttribute('class', change.doc.data().isCompleted ? "finishedTodo" : "unfinishedTodo")

        // Create and append P tag with Todo content
        let textNode = document.createElement("p");
        textNode.setAttribute("class", "todoContent");
        textNode.textContent = change.doc.data().todoContent;
        listItem.appendChild(textNode);

        // Create and Append P tag with Date content
        var epochSeconds = change.doc.data().dateSubmitted.seconds;
        let dateNode = document.createElement("p");
        dateNode.setAttribute("class", "todoDate");
        let date = new Date(epochSeconds * 1000);
        dateNode.textContent = `${date.toLocaleTimeString()} - ${date.toLocaleDateString()}`;
        listItem.appendChild(dateNode);

        // Append the new list item to the UL
        document.getElementById('todoList').appendChild(listItem);
      }
      // If an item was Changed run this action
      if (change.type === 'modified') {
        let updateTodo = document.getElementById(change.doc.id)
        updateTodo.setAttribute('class', change.doc.data().isCompleted ? "finishedTodo" : "unfinishedTodo")
        console.log('Item Changed')
      }
      // If an item was Removed run this action
      if (change.type === 'removed') {

        document.getElementById(change.doc.id).remove()
        console.log('Item removed')
      }
    })
  })
}

// Adding event listeners
submitButton.addEventListener("click", addTodo);
window.addEventListener('click', e => {
  if (e.target.tagName === "LI") {
    console.log('Clicked')
    if (e.target.className === "finishedTodo") {
      database.collection('todo').doc(e.target.id).update({isCompleted: false}).then(console.log("Todo has been set to Incomplete"))
    } else {
      database.collection('todo').doc(e.target.id).update({isCompleted: true}).then(console.log("Todo has been set to Complete"))
    }
  }
})
listenForChanges()