// debugger
var currentHost = window.location.origin;

// OAuth

// params = {}
// let regex = /([^&=]+)=([^&]*)/g, m

// while(m = regex.exec(location.href)){
//     params[decodeURIComponent(m[1])] = decodeURIComponent(m[2])
// }

// if(Object.keys(params).length > 0){
//     localStorage.setItem('authInfo', JSON.stringify(params))
// }

// //hide the access token
// // window.history.pushState({},document.title,"/" + "dashboard.html")
// if (location.href.includes("access_token")){
//     window.history.pushState({},document.title,"/" + "dashboard.html")
// }
// // window.history.pushState({},document.title,"/")

// let info = JSON.parse(localStorage.getItem('authInfo'))
// console.log(info);

// fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
//     headers:{
//         "Authorization": `Bearer ${info['access_token']}`
//     }
// }).then((data) => data.json())
// .then((info) => {
//     console.log(info);
//     handshake(info.name)
// })

// Check if the URL contains the "access_token" parameter
if (location.href.includes("access_token")) {
  let params = {};
  let regex = /([^&=]+)=([^&]*)/g,
    m;

  // Extract parameters from the URL
  while ((m = regex.exec(location.href))) {
    params[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
  }

  // If parameters exist, store them in localStorage
  if (Object.keys(params).length > 0) {
    localStorage.setItem("authInfo", JSON.stringify(params));
  }

  // Hide the access token from the URL
  window.history.pushState({}, document.title, "/" + "dashboard.html");

  // Retrieve auth information from localStorage
  let info = JSON.parse(localStorage.getItem("authInfo"));
  console.log(info);

  // Fetch user information using the access token
  fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
    headers: {
      Authorization: `Bearer ${info["access_token"]}`,
    },
  })
    .then((data) => data.json())
    .then((info) => {
      console.log(info);
      localStorage.setItem("userEmail", info.email);
      localStorage.setItem("userName", info.name);
      localStorage.setItem("userAccessToken", params["access_token"]);
      handshake(info.email); // Call the handshake function with the user's name
    })
    .catch((error) => {
      console.error("Error fetching user info:", error);
    });
} else if (localStorage.getItem("userName")) {
  handshake(localStorage.getItem("userEmail"));
  console.log("No access token found in the URL. Skipping OAuth processing.");
}

// function logOut(){

//     localStorage.removeItem('authInfo');
//     localStorage.removeItem('userId');
//     // window.location.href = 'http://localhost:5503/index.html';
//     window.location.href = `${currentHost}/index.html`

// }

function logOut() {
  fetch(
    "https:oauth2.googleapis.com/revoke?token=" +
      localStorage.getItem("userAccessToken"),
    {
      method: "POST",
      headers: {
        "content-type": "application/x-www-form-urlencoded",
      },
    }
  ).then((data) => {
    console.log(data);
    localStorage.clear();
    location.href = `${currentHost}/index.html`;
    // open('index.html')
  });
}

// ========================================================================================
//maken audioId scope global so that used in transcription() method get the data in makeRowsClickable() method
let audioId;

// Variable for printing username only once
var flag = true;

// Function for handshake request
function handshake(email) {
  // URL of the endpoint
  const url = "https://vagdeviwin.azurewebsites.net/api/user/shakehand";

  // Request data
  const requestData = {
    UserId: email,
  };

  // Options for the fetch request
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestData),
  };

  // Sending the POST request
  fetch(url, options)
    .then((response) => response.json())
    .then((data) => {
      console.log("shakehand api response data", data);
      // Sort the array data (new to old)
      const res = data.sessions.sort(
        (a, b) => new Date(b.stagedTime) - new Date(a.stagedTime)
      );
      console.log(res);

      localStorage.setItem("userId", email); // Save the userId in localstorage

      displayObjectData(data);

      // Print username only one time
      while (flag) {
        displayUserName();
        flag = false;
      }
    })
    .catch((error) => {
      console.error("Error:", error); // Log any errors
    });
}

// Function to display the user name
function displayUserName() {
  // Print the user email on the upload screen
  const name = document.getElementById("nameContainer");
  const nameDiv = document.createElement("div");
  nameDiv.textContent = localStorage.getItem("userId");
  const greet = document.createElement("p");
  name.appendChild(nameDiv);
}

// Function to display object data in the table
function displayObjectData(objectData) {
  // Create tbody element and using id dataContainer
  const dataContainer = document.getElementById("dataContainer");

  // Clear the previous tags
  dataContainer.innerHTML = "";

  // Printing table heading
  let table_head = document.createElement("thead");
  let table_row = document.createElement("tr");

  // 0th col print
  let table_heading0 = document.createElement("th");
  table_row.appendChild(table_heading0);
  table_head.appendChild(table_row);
  dataContainer.appendChild(table_head);

  // 1st col print
  let table_heading1 = document.createElement("th");
  table_heading1.textContent = "Serial no";
  table_row.appendChild(table_heading1);
  table_head.appendChild(table_row);
  dataContainer.appendChild(table_head);

  // 2nd col print
  let table_heading2 = document.createElement("th");
  table_heading2.textContent = "File name";
  table_row.appendChild(table_heading2);
  table_head.appendChild(table_row);
  dataContainer.appendChild(table_head);

  // 3rd col print
  let table_heading3 = document.createElement("th");
  table_heading3.textContent = "Staged time";
  table_row.appendChild(table_heading3);
  table_head.appendChild(table_row);
  dataContainer.appendChild(table_head);

  // 4th col print
  let table_heading4 = document.createElement("th");
  table_heading4.textContent = "State";
  table_row.appendChild(table_heading4);
  table_head.appendChild(table_row);
  dataContainer.appendChild(table_head);

  var tbody = document.createElement("tbody");

  // Iterating the object which is received from the server after successful handshake
  for (const key in objectData) {
    var counter = 1;
    const value = objectData[key];
    value.forEach((item) => {
      var tableRow = document.createElement("tr");

      var tableData = document.createElement("td");
      // let delete_btn = document.createElement("button");
      let delete_btn = document.createElement("i");
      // delete_btn.setAttribute("id", "delete-btn");
      delete_btn.setAttribute("class", "ri-delete-bin-line");
      delete_btn.addEventListener("click", (event) => {
        event.stopPropagation();
        window.location.href = "https://openai.com/index/chatgpt/";
      });
      // delete_btn.setAttribute('onClick', 'deleteRecord()')
      // delete_btn.textContent = "delete";
      // tableData.textContent = counter;
      tableData.appendChild(delete_btn);
      tableRow.appendChild(tableData);
      // counter++;

      // Serial no printing
      var tableData = document.createElement("td");
      tableData.textContent = counter;
      tableRow.appendChild(tableData);
      counter++;

      for (const key in item) {
        if (key == "fileName") {
          // Get the filename after excluding userId
          var fileName = item[key];
          const index = fileName.indexOf("/") + 1;
          fileName = fileName.substring(index);

          // Print the data dynamically in the table
          var tableData = document.createElement("td");
          tableData.textContent = fileName;
          tableRow.appendChild(tableData);
        } else if (key == "stagedTime") {
          const stagedTime = item[key];
          var tableData = document.createElement("td");
          tableData.textContent = stagedTime;
          tableRow.appendChild(tableData);
        } else {
          continue;
        }
      }

      tbody.appendChild(tableRow);
    });
    dataContainer.appendChild(tbody);
  }

  makeRowsClickable();
}

// Function to handle file upload
async function uploadFile() {
  let upload_btn = document.querySelector("#upload-btn");
  upload_btn.textContent = "Uploading";

  const fileInput = document.getElementById("wavAudio");
  const file = fileInput.files[0];

  if (file) {
    // const chunkSize = 2 * 1024 * 1024; //5MB chunks
    // const totalChunks = Math.ceil(file.size / chunkSize);
    // console.log(totalChunks);
    // const userid = localStorage.getItem("userId");

    // for (let i = 0; i < totalChunks; i++) {
    //   debugger;
    //   const start = i * chunkSize;
    //   const end = Math.min(start + chunkSize, file.size);
    //   const chunk = file.slice(start, end);

    //   const formData = new FormData();
    //   formData.append("chunk", chunk);
    //   formData.append("userid", userid);
    //   formData.append("chunkIndex", i);
    //   formData.append("totalChunks", totalChunks);
    //   formData.append("fileName", file.name);

    //   // Upload the chunk
    //   await fetch(
    //     "https://vagdeviwin.azurewebsites.net/api/audio/uploadChunk",
    //     {
    //       method: "POST",
    //       body: formData,
    //     }
    //   )
    //     .then((response) => response.json())
    //     .then((data) => {
    //       console.log(`Chunk ${i + 1} of ${totalChunks} uploaded successfully`);
    //     })
    //     .catch((error) => {
    //       console.error(`Error uploading chunk ${i + 1}:`, error);
    //     });
    // }
    // console.log("All chunks uploaded");
    // debugger;

    // debugger
    console.log(file);
    // Create a FormData object
    const formData = new FormData();
    formData.append("file", file);
    console.log(formData);
    const userid = localStorage.getItem("userId");
    formData.append("userid", userid);
    console.log(formData);
    console.log(formData.file);

    // URL of the upload endpoint
    const url = "https://vagdeviwin.azurewebsites.net/api/audio/upload";

    // Sending the file via POST request
    const response = await fetch(url, {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        // debugger
        //delay the set of code for 6sec
        function delay(ms) {
          return new Promise((resolve) => setTimeout(resolve, ms));
        }

        async function main() {
          //clear the file input
          fileInput.value = "";

          //change the upload button text
          let upload_btn = document.querySelector("#upload-btn");
          upload_btn.textContent = "Upload successfully";

          //delay for 5 seconds
          await delay(5000);

          //again change the upload button text
          upload_btn = document.querySelector("#upload-btn");
          upload_btn.textContent = "Upload";

          console.log(data);

          //handshake for add the new audio file
          handshake(userid);
        }
        main();

        // let upload_btn = document.querySelector("#upload-btn")
        // upload_btn.textContent = "Upload"

        // console.log(data);
        // handshake(userid)
      })
      .catch((error) => {
        debugger;
        console.error("Error uploading file:", error); // Log any errors
      });
  } else {
    console.error("No file selected");
  }
}

// document.addEventListener('DOMContentLoaded', () => {
//     makeRowsClickable()
// })

function makeRowsClickable() {
  //get all rows in the table except column heading
  const rows = document.querySelectorAll(".table tbody tr");
  console.log(rows);
  rows.forEach((row) => {
    console.log(row);
    const secondCell = row.querySelector("td:nth-child(3)");
    const secondCellData = secondCell.textContent;
    console.log(secondCell);
    console.log(secondCellData);
    row.addEventListener("click", () => {
      // removes the background color of all the rows
      rows.forEach((r) => r.classList.remove("bgRow"));

      audioId = secondCellData;
      //   alert(`${audioId}`);

      // add the background color of the clicked row
      row.classList.add("bgRow");

      //   debugger;
      //"Get transcription" button disabled using disabled-btn class
      let disabled_btn = document.querySelector("#fetchButton1");
      disabled_btn.className = "disabled-btn";

      //remove attribute from "Get transcription" button so that user cannot open modal
      disabled_btn.removeAttribute("data-bs-toggle");

      //when you click the next row then the previous row text("Please wait") will clear
      document.querySelectorAll(".wait-msg").forEach((el) => el.remove());

      //add Please wait text to the clicked row
      let message = document.createElement("td");
      message.textContent = "Please wait";
      message.className = "wait-msg";
      row.append(message);

      transcription(message);
    });
  });
}

//get transcription

// async function transcription(){
//     makeRowsClickable()

// // const formData = new FormData()
// // formData.append('audioId', 'dummy_tone_5.wav')
// // const userid = localStorage.getItem("userId");
// // formData.append('userId', userid);
// // console.log(formData.userId)

// // const audioId = 'dummy_tone_9.wav'
// const userId = localStorage.getItem('userId')

// // const url = 'https://vagdeviwin.azurewebsites.net/api/audio/transcription/?audioId=dummy_tone_9.wav&userId=shirish.nigam.744444@gmail.com'

// const url = `https://vagdeviwin.azurewebsites.net/api/audio/transcription/?audioId=${audioId}&userId=${userId}`

// fetch(url, {
//     method: 'GET',
//     // body: formData
//     header: {
//         'Content-Type' : 'application/json'
//     }
// }).then(response => response.json())
// .then(data => {
//     console.log(data)
// })
// .catch(error => {
//     console.error('error hai', error)
// })
// }

async function transcription(message) {
  // makeRowsClickable();
  debugger;
  const userId = localStorage.getItem("userId");
  const url = `https://vagdeviwin.azurewebsites.net/api/audio/transcription/?audioId=${audioId}&userId=${userId}`;

  // Fetch transcription data
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch transcription data");
    }

    const data = await response.json();
    console.log(data);
    console.log(data.transcription);

    //When the data comes from the server then the text changed from "please wait" to "Click "Get transcription" button"
    message.textContent = 'Click "Get transcription" button';

    let disabled_btn = document.querySelector("#fetchButton1");
    console.log(disabled_btn);

    //disabled-btn class removed so that "Get transcription" button clickable
    disabled_btn.classList.remove("disabled-btn");

    //now set attributes so that modal will be appear
    disabled_btn.setAttribute("data-bs-toggle", "modal");
    disabled_btn.setAttribute("data-bs-target", "#exampleModal");

    //target the moda and fill the response text
    const transcriptionData = document.querySelector(".modal-body");
    transcriptionData.textContent = data.transcription;
  } catch (error) {
    console.error("Error fetching transcription:", error);
  }
}

//remove the unneccessary static text
let bodyContainer = document.querySelector("body");
bodyContainer.removeChild(bodyContainer.childNodes[0]);

//delete the records
// let delete_btn = document.querySelector("#delete-btn")
// console.log(delete_btn);
// delete_btn.addEventListener('click', (event) =>{
//     event.stopPropagation()
//     window.location.href = "https://openai.com/index/chatgpt/"
// })
