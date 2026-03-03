/* ==========================================================================
  Constants And Variables
========================================================================== */

/* Quering The DOM
========================================================================== */

// Categories DOM
const CATEGORIES_LIST = document.getElementById("categoriesList");
const ADD_CATEGORY_FORM = document.getElementById("addCategoryForm");
// Resize Bars
const LEFT_ASIDE_RESIZE_BAR = document.getElementById("leftAsideResizeBar");
const RIGHT_ASIDE_RESIZE_BAR = document.getElementById("rightAsideResizeBar");
// Categories Data DOM
const CATEGORIES_DATA_CONT = document.getElementById("categoryDataCont");
const CATEGORY_NAME = document.getElementById("categoryName");
const CATEGORY_DATE_CREATED = document.getElementById("categoryDateCreated");
const DELETE_CATEGORY_BTN = document.getElementById("delCategory");
const TASKS_LIST = document.getElementById("tasksList");
const ADD_TASK_FORM = document.getElementById("addTaskForm");
// Task Data DOM
const DEL_TASK_BTN = document.getElementById("delTaskBtn");
const CLOSE_TASK_DETAILS_SIDE_BTN = document.getElementById("closeTaskDetailsSideBtn");
const TASK_TEXT = document.getElementById("taskText");
const TASK_DES = document.getElementById("taskDes");
const SUBTASKS_LIST = document.getElementById("subtasksList");
const LINKS_LIST = document.getElementById("linksList");
const TASK_CREATED_DATE = document.getElementById("taskCreateDate");
const TASK_DETAILS_SIDE = document.getElementById("taskDetailsSide");
const ADD_SUBTASK_FORM = document.getElementById("addSubtaskForm");
const ADD_ATTACHMENT_LINK_FORM = document.getElementById("addAttachmentLinkForm");

const MARKDOWN_OUTPUT = document.getElementById("markdownOutput");
const EDIT_DES_BTN = document.getElementById("editDesBtn");


/* App Variables
========================================================================== */
let mainData;
let resizeData = {currWidth: undefined, anchorPoint: undefined, targetResize: undefined};
let targetCategoryPath;
// Notifications Variables
let colorsObj = {
  green: "#12b76a",
  blue: "#2369f6",
  red: "#f04438",
  orange: "#f79009",
}
// Drag And Drop Variables
let currDraggingGhost = {};
let currDragOverParent = {};
// Starting Up Data
let storageData = localStorage.getItem("todoApp");
let startupData = JSON.parse(storageData);



/* Starting Up
========================================================================== */

// Check If There Is Any Data In The LocalStorage
if (startupData && startupData.data) {
  mainData = startupData;
  targetCategoryPath = mainData.data[mainData.currActiveCategory];
  // Create The Categories List Items
  for (let id of Object.keys(startupData.data)) {
    let obj = {categoryId: id, categoryData: startupData.data[id]};
    createCategoryDOMFunc(obj);
  }
  // Create The Data Of The Active Category
  targetCategoryPath && updateCategoryDataDOMFunc(targetCategoryPath);
  // Active The Category List Item
  mainData.currActiveCategory && document.getElementById(mainData.currActiveCategory).classList.add("active");
} else mainData = {currActiveCategory: undefined, data: {}}; // Default Data Start Up








/* ==========================================================================
  Creating Data Functions
========================================================================== */

/* Create Category Data Function
========================================================================== */
function createCategoryDataFunc(categoryName) {
  // Create The Data
  let categoryId = crypto.randomUUID();
  let obj = {
    categoryName,
    tasksObj: {},
    dateCreatedMS: new Date().getTime(),
    activeTask: undefined,
  };
  // Add The Data
  mainData.data[categoryId] = obj;
  return {categoryId, categoryData: obj};
}



/* Create Task Data Function
========================================================================== */
function createTaskDataFunc(taskText) {
  // Create The Data
  let taskId = crypto.randomUUID();
  let obj = {
    taskText,
    taskDes: "",
    subtasksObj: {},
    taskLinkAttchmentsObj: {},
    dateCreatedMS: new Date().getTime(),
    checked: false,
  };
  // Add The Data
  targetCategoryPath.tasksObj[taskId] = obj;
  return {taskId, taskData: obj};
}



/* Create Subtask Data Function
========================================================================== */
function createSubtaskData(subtaskText) {
  // Create The Data
  let subtaskId = crypto.randomUUID();
  let obj = {
    subtaskText,
    checked: false,
  };
  // Add The Data
  targetCategoryPath.tasksObj[targetCategoryPath.activeTask].subtasksObj[subtaskId] = obj;
  return {subtaskId, subtaskObj: obj};
}



/* Create Attachment Link Data Function
========================================================================== */
function createAttachmentLinkData(dataObj) {
  // Create Attachment Link ID
  let atchLinkId = crypto.randomUUID();
  // Add The Data
  targetCategoryPath.tasksObj[targetCategoryPath.activeTask].taskLinkAttchmentsObj[atchLinkId] = dataObj;
  return {atchLinkId, atchLinkObj: dataObj};
}








/* ==========================================================================
  Creating Data DOM Functions
========================================================================== */

/* Create Category DOM Function
========================================================================== */
function createCategoryDOMFunc(data) {
  // Create Category
  const LI = document.createElement("li");
  LI.id = data.categoryId;
  LI.classList.add("ellipsised-text");
  LI.textContent = data.categoryData.categoryName;
  LI.draggable = true;
  CATEGORIES_LIST.appendChild(LI);
  // Hide No Category Span If Shown
  CATEGORIES_LIST.className = "categories-list";
}



/* Create Task DOM Function
========================================================================== */
function createTaskDOMFunc(data) {
  // Create Task
  const TASK_LI = document.createElement("li");
  const TASK_CHECK_BOX_INPUT = document.createElement("input");
  const TASK_TEXT_WRAPPER_P = document.createElement("p");
  const SUBTASK_TEXT_SPAN = document.createElement("span");
  TASK_LI.id = data.taskId;
  TASK_LI.tabIndex = "1";
  TASK_LI.draggable = true;
  TASK_CHECK_BOX_INPUT.type = "checkbox";
  TASK_CHECK_BOX_INPUT.checked = data.taskData.checked;
  TASK_TEXT_WRAPPER_P.appendChild(SUBTASK_TEXT_SPAN);
  TASK_LI.append(TASK_CHECK_BOX_INPUT, TASK_TEXT_WRAPPER_P);
  TASKS_LIST.appendChild(TASK_LI);
  SUBTASK_TEXT_SPAN.textContent = data.taskData.taskText;
  // Hide No Category Span If Shown
  CATEGORIES_DATA_CONT.className = "category-data-content";
}



/* Create Subtask DOM Function
========================================================================== */
function createSubtaskDOM(data) {
  // Creating The COM
  const SUBTASK_LI = document.createElement("li");
  const SUBTASK_CHECK_BOX_INPUT = document.createElement("input");
  const SUBTASK_TEXT_WRAPPER_P = document.createElement("p");
  const SUBTASK_TEXT_SPAN = document.createElement("span");
  const SUBTASK_DELETE_SPAN = document.createElement("span");
  // Setting Attributes
  SUBTASK_LI.id = data.subtaskId;
  SUBTASK_CHECK_BOX_INPUT.type = "checkbox";
  SUBTASK_CHECK_BOX_INPUT.checked = data.subtaskObj.checked;
  SUBTASK_DELETE_SPAN.classList.add("del-btn");
  // Appending Elements
  SUBTASK_TEXT_WRAPPER_P.appendChild(SUBTASK_TEXT_SPAN);
  SUBTASK_LI.append(SUBTASK_CHECK_BOX_INPUT, SUBTASK_TEXT_WRAPPER_P, SUBTASK_DELETE_SPAN);
  SUBTASKS_LIST.appendChild(SUBTASK_LI);
  // Setting TextContent
  SUBTASK_TEXT_SPAN.textContent = data.subtaskObj.subtaskText;
}



/* Create Attachment Link DOM Function
========================================================================== */
function createAttachmentLinkDOM(data) {
  // Creating The COM
  const ATCH_LINK_LI = document.createElement("li");
  const ATCH_LINK_URL_ANCHOR = document.createElement("a");
  const ATCH_LINK_DELETE_SPAN = document.createElement("span");

  // Setting Attributes
  ATCH_LINK_LI.id = data.atchLinkId;
  ATCH_LINK_URL_ANCHOR.target = "_blank";
  ATCH_LINK_URL_ANCHOR.href = data.atchLinkObj.websiteURL;
  ATCH_LINK_URL_ANCHOR.classList.add("wrapper");
  ATCH_LINK_DELETE_SPAN.classList.add("del-btn");

  // Appending Elements
  ATCH_LINK_LI.append(ATCH_LINK_URL_ANCHOR, ATCH_LINK_DELETE_SPAN);
  LINKS_LIST.appendChild(ATCH_LINK_LI);

  // Setting TextContent
  ATCH_LINK_URL_ANCHOR.textContent = data.atchLinkObj.websiteName;
}








/* ==========================================================================
  Creating Data And DOM EventListeners
========================================================================== */

/* Create Category On "ADD_CATEGORY_FORM" Submition
========================================================================== */
ADD_CATEGORY_FORM.addEventListener("submit", e => {
  e.preventDefault();
  let inpVal = e.target.addCategoryInput.value.trim();
  // Check If The Input Is Not Empty
  if (inpVal !== "") {
    // Check If The Category Name Is Not Exist
    if (Object.values(mainData.data).some(obj => obj.categoryName === inpVal)) {
      createNofit("This category is already exist", "circle-warning", "orange");
    } else {
      // Create Category Data
      let categoryData = createCategoryDataFunc(inpVal);
      // Create Category DOM
      createCategoryDOMFunc(categoryData);
      // Clear The Input
      e.target.addCategoryInput.value = "";
      // Save Data
      saveData();
    }
  } else createNofit("You should write the category name", "circle-warning", "orange");
});



/* Create Task On "ADD_TASK_FORM" Submition
========================================================================== */
ADD_TASK_FORM.addEventListener("submit", e => {
  e.preventDefault();
  let inpVal = e.target.addTaskInput.value.trim();
  // Check If The Input Is Not Empty
  if (inpVal !== "") {
    if (inpVal.length <= 150) {
      // Create Task Data
      let taskData = createTaskDataFunc(inpVal);
      createTaskDOMFunc(taskData);
      // Clear The Input
      e.target.addTaskInput.value = "";
      // Save Data
      saveData();
    } else createNofit("Task characters shouldn't be more than 150", "circle-warning", "orange");
  } else createNofit("You should write a task", "circle-warning", "orange");
});



/* Create Subtask On "ADD_SUBTASK_FORM" Submition
========================================================================== */
ADD_SUBTASK_FORM.addEventListener("submit", e => {
  e.preventDefault();
  let targetInput = e.target.addSubtaskInput;
  if (targetInput.value !== "") {
    if (targetInput.value.length <= 108) {
      let data = createSubtaskData(targetInput.value);
      createSubtaskDOM(data);
      targetInput.value = "";
      saveData();
    } else createNofit("Subtask characters shouldn't be more than 108", "circle-warning", "orange");
  } else createNofit("You should write a subtask", "circle-warning", "orange");
});



/* Create Attachment Link On "ADD_ATTACHMENT_LINK_FORM" Submition
========================================================================== */
ADD_ATTACHMENT_LINK_FORM.addEventListener("submit", e => {
  e.preventDefault();
  let targetInput = e.target.addAttachmentLinkInput;
  if (targetInput.value !== "") {
    if (/.+\s*"([^"]+)"/.test(targetInput.value)) {
      let websiteName = targetInput.value.slice(0, targetInput.value.indexOf("\"")).trim();
      if (websiteName.length <= 50) {
        let obj = {
          websiteName,
          websiteURL: targetInput.value.slice(targetInput.value.indexOf("\"") + 1, -1),
        };
        let data = createAttachmentLinkData(obj);
        createAttachmentLinkDOM(data);
        targetInput.value = "";
        saveData();
      } else createNofit("Website name characters shouldn't be more than 50", "circle-warning", "orange");
    } else createNofit("You should write like this pattern: Website Name \"Website URL\"", "circle-warning", "orange");
  } else createNofit("You should attach a link", "circle-warning", "orange");
});








/* ==========================================================================
  Deleting Items
========================================================================== */

/* Delete Category Button
========================================================================== */
DELETE_CATEGORY_BTN.addEventListener("click", () => {
  // Add "pointer-none" Class To The Delete Buttons
  displayDeleteBtnsFunc(true);
  // Delete Function
  function delFunc() {
    // Remove The Category LI
    const CATEGORY_LI = document.getElementById(mainData.currActiveCategory);
    CATEGORY_LI.remove();
    // Check If There Is No Other Categories
    if (CATEGORIES_LIST.querySelectorAll("li").length <= 0) CATEGORIES_LIST.className = "categories-list no-data";
    // Update DOM Functions
    updateCategoryDataDOMFunc();
    updateTaskDetailsSide();
    controlTaskDetails(false);
    // Update Data
    delete mainData.data[mainData.currActiveCategory];
    mainData.currActiveCategory = undefined;
    saveData();
  }
  createNofit("Are you sure you want to confirm delete", "trash", "red", true, 10000, delFunc);
});



/* Delete Task Button
========================================================================== */
DEL_TASK_BTN.addEventListener("click", () => {
  // Stop The Delete Task Button From Interacting
  DEL_TASK_BTN.classList.add("pointer-none");
  // Add "pointer-none" Class To The Delete Buttons
  displayDeleteBtnsFunc(true);
  // Delete Functoin
  function delFunc() {
    // Remove From DOM
    document.getElementById(targetCategoryPath.activeTask).remove();
    controlTaskDetails(false);
    // Show Empty List Message If There Is No Tasks
    if (!TASKS_LIST.querySelector("li")) CATEGORIES_DATA_CONT.className = "category-data-content no-display";
    // Remove The pointer-none Class
    DEL_TASK_BTN.classList.remove("pointer-none");
    // Remove From Data
    delete targetCategoryPath.tasksObj[targetCategoryPath.activeTask];
    targetCategoryPath.activeTask = undefined;
    saveData();
  }
  // Create Confirm Notification For Deleting
  createNofit("Are you sure you want to confirm delete", "trash", "red", true, 10000, delFunc, () => DEL_TASK_BTN.classList.remove("pointer-none"));
});



/* Listen To dblclick Event To Confirm
   Subtask Deleting Using Function Delegation
========================================================================== */
SUBTASKS_LIST.addEventListener("dblclick", e => {
  // Get The Target Element
  const SUBTASK_LI = e.target.closest("li");
  // Check For The Target Element
  if (SUBTASK_LI) {
    // Active Delete
    SUBTASK_LI.classList.add("active-del");
    // Add "pointer-none" Class To The Delete Buttons
    displayDeleteBtnsFunc(true);
    // Delete Functoin
    function delFunc() {
      // Remove From DOM
      SUBTASK_LI.remove();
      // Remove From Data
      let path = targetCategoryPath.tasksObj[targetCategoryPath.activeTask].subtasksObj;
      delete path[SUBTASK_LI.id];
      saveData();
    }
    // Create Confirm Notification For Deleting
    createNofit("Are you sure you want to confirm delete", "trash", "red", true, 10000, delFunc, () => SUBTASK_LI.classList.remove("active-del"));
  }
});



/* Listen To click Event To Confirm Attachment
   Link Deleting Using Function Delegation
========================================================================== */
LINKS_LIST.addEventListener("click", e => {
  // Check For The Target Element
  if (e.target.classList.contains("del-btn")) {
    // Get The Target Element
    const ATCH_LINK_LI = e.target.parentElement;
    // Add "pointer-none" Class To The Delete Buttons
    displayDeleteBtnsFunc(true);
    // Active Delete
    ATCH_LINK_LI.classList.add("active-del");
    // Delete Functoin
    function delFunc() {
      // Remove From DOM
      ATCH_LINK_LI.remove();
      // Remove From Data
      let path = targetCategoryPath.tasksObj[targetCategoryPath.activeTask].taskLinkAttchmentsObj;
      delete path[ATCH_LINK_LI.id];
      saveData();
    }
    // Create Confirm Notification For Deleting
    createNofit("Are you sure you want to confirm delete", "trash", "red", true, 10000, delFunc, () => ATCH_LINK_LI.classList.remove("active-del"));
  }
});







/* ==========================================================================
  Update DOM
========================================================================== */

/* Update Category Data DOM Function
========================================================================== */
function updateCategoryDataDOMFunc(data = {categoryName: "", tasksObj: undefined, dateCreatedMS: undefined, activeTask: undefined}) {
  // 
  controlTaskDetails(false);
  // Extract The Data
  let {categoryName, dateCreatedMS, tasksObj, activeTask} = data;
  // Update Category Data DOM Info
  CATEGORY_NAME.textContent = categoryName;
  let date = new Date(dateCreatedMS).toLocaleDateString("en-US", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  CATEGORY_DATE_CREATED.textContent = dateCreatedMS ? date : "";
  // Clear The DOM Before Add The Tasks
  TASKS_LIST.querySelectorAll("li").forEach(el => el.remove());
  // tasksObj Conditions
  if (tasksObj) {
    if (Object.keys(tasksObj).length > 0) {
      CATEGORIES_DATA_CONT.className = "category-data-content";
      // Create The Tasks DOM
      for (let id in tasksObj) {
        let obj = {taskId: id, taskData: tasksObj[id]};
        createTaskDOMFunc(obj);
      }
    } else CATEGORIES_DATA_CONT.className = "category-data-content no-display";
  } else CATEGORIES_DATA_CONT.className = "category-data-content no-data";

  // Show The Active Task Details If Exists
  activeTask && updateTaskDetailsSide(mainData.data[mainData.currActiveCategory].tasksObj[data.activeTask]);
}



/* Update Task Details Side
========================================================================== */
function updateTaskDetailsSide(data = {dateCreatedMS: undefined, taskText: undefined, taskDes: "", subtasksObj: {}, taskLinkAttchmentsObj: {}}) {
  let {dateCreatedMS, taskText, taskDes, subtasksObj, taskLinkAttchmentsObj} = data;
  let date = new Date(dateCreatedMS).toLocaleDateString("en-us", {weekday: "short", year: "numeric", month: "short", day: "numeric"});
  TASK_CREATED_DATE.textContent = dateCreatedMS ? date : "";
  // Update TASK_TEXT And TASK_DES Values
  TASK_TEXT.textContent = taskText;
  TASK_DES.value = taskDes;
  MARKDOWN_OUTPUT.innerHTML = taskDes.trim() == "" ? "<span class=\"empty\">There is no description</span>" : convertMarkdownToHTML(taskDes);
  // Subtasks DOM
  SUBTASKS_LIST.textContent = "";
  for (let id in subtasksObj) {
    let obj = {subtaskId: id, subtaskObj: subtasksObj[id]};
    createSubtaskDOM(obj);
  }
  // Attachment Links DOM
  LINKS_LIST.textContent = "";
  for (let id in taskLinkAttchmentsObj) {
    let obj = {atchLinkId: id, atchLinkObj: taskLinkAttchmentsObj[id]};
    createAttachmentLinkDOM(obj);
  }
  // Open Task Details Side If There Is Data
  controlTaskDetails(taskText !== undefined);
}








/* ==========================================================================
  Listen To Click Events On Lists
========================================================================== */

/* Listen To Click Event On The Categories List To Get The Target List
========================================================================== */
CATEGORIES_LIST.addEventListener("click", e => {
  // Check If The Target Element Is LI That Is A Category
  if (e.target.tagName === "LI") {
    let data = mainData.data[e.target.id];
    // Update Active Category Data
    mainData.currActiveCategory = e.target.id;
    // Update The Current Category Path
    targetCategoryPath = mainData.data[mainData.currActiveCategory];
    saveData();
    // Update Active Category DOM
    CATEGORIES_LIST.querySelectorAll("li").forEach(li => li.classList.remove("active"));
    e.target.classList.add("active");
    // Focus To 
    ADD_TASK_FORM.addTaskInput.focus();
    // Update Category Data Function
    updateCategoryDataDOMFunc(data);
  }
});



/* Listen To Click Event On The Tasks List
========================================================================== */
TASKS_LIST.addEventListener("click", e => {
  // Save The Task Check
  if (e.target.tagName === "INPUT") {
    let targetEl = e.target.closest("li");
    let data = targetCategoryPath.tasksObj[targetEl.id];
    data.checked = e.target.checked;
    saveData();
  } else if (e.target.tagName === "LI") {
    let data = targetCategoryPath.tasksObj[e.target.id];
    // Update The Active Task In The Category
    targetCategoryPath.activeTask = e.target.id;
    saveData();
    // Update Task Details Side
    updateTaskDetailsSide(data);
  }
});



/* Listen To Click Event On The Subtasks List
========================================================================== */
SUBTASKS_LIST.addEventListener("click", e => {
  // Save The Task Check
  if (e.target.tagName === "INPUT") {
    let targetLi = e.target.closest("li");
    let currActiveTaskId = mainData.data[mainData.currActiveCategory].activeTask;
    let data = mainData.data[mainData.currActiveCategory].tasksObj[currActiveTaskId].subtasksObj[targetLi.id];
    data.checked = e.target.checked;
    saveData();
  }
});








/* ==========================================================================
  Update Task Details Side Data
========================================================================== */

/* TASK_TEXT Listen To Input Event
========================================================================== */
// Debouncing Part
let taskTextFunc = debonce(text => {
  // Check If The Task Input Is Not Empty To Save
  if (text.length > 0) {
    // Get The Target Task
    let targetTaskId = mainData.data[mainData.currActiveCategory].activeTask;
    const TARGET_TASK = document.getElementById(targetTaskId);
    // Update DOM
    TARGET_TASK.querySelector("p span").textContent = text;
    // Update Data
    mainData.data[mainData.currActiveCategory].tasksObj[targetTaskId].taskText = text;
    saveData();
  }
});

// Calling The Debouncing Part
TASK_TEXT.addEventListener("input", e => taskTextFunc(e.target.textContent));

// TASK_TEXT Listen To Blur Event
TASK_TEXT.addEventListener("blur", e => {
  // Check If The Task Input Is Not Empty To Save
  if (TASK_TEXT.textContent.length === 0) {
    // Get The Data
    let targetTaskId = mainData.data[mainData.currActiveCategory].activeTask;
    let lastRealVal = mainData.data[mainData.currActiveCategory].tasksObj[targetTaskId].taskText;
    // Update DOM
    const TARGET_TASK = document.getElementById(targetTaskId);
    TARGET_TASK.querySelector("p span").textContent = lastRealVal;
    TASK_TEXT.textContent = lastRealVal;
    createNofit("You Shouldn't Leave The Task Empty!", "circle-warning", "orange");
  }
});








/* ==========================================================================
  Others
========================================================================== */

/* Close Task Details Side
========================================================================== */
CLOSE_TASK_DETAILS_SIDE_BTN.addEventListener("click", () => {
  controlTaskDetails(false);
  targetCategoryPath.activeTask = undefined;
  saveData();
});



/* Update Category Name On Input
========================================================================== */

// "CATEGORY_NAME" Listen To Keypress Event
CATEGORY_NAME.addEventListener("keypress", e => {
  // Check If Enter Key Is Pressed
  if (e.key === "Enter") {
    // Prevent The New Line From The Enter Press
    e.preventDefault();
    // Blur And Then Use Blur Event To Complete Checking And Updating
    CATEGORY_NAME.blur();
  }
});

// "CATEGORY_NAME" Listen To Blur Event
CATEGORY_NAME.addEventListener("blur", e => {
  // Check If The Editable Element Is Not Empty
  if (CATEGORY_NAME.textContent.length > 0) {
    // Check If The Category Name Is 30 Characters Or Less
    if (CATEGORY_NAME.textContent.length <= 30) {
      let targetCategoryId = mainData.currActiveCategory;
      // Update DOM
      document.getElementById(targetCategoryId).textContent = CATEGORY_NAME.textContent;
      // Update Data
      mainData.data[targetCategoryId].categoryName = CATEGORY_NAME.textContent;
      saveData();
    } else {
      createNofit("Category name characters shouldn't be more than 30", "circle-warning", "orange");
      CATEGORY_NAME.focus();
    }
  } else {
    createNofit("You Shouldn't Leave This Empty", "circle-warning", "orange");
    CATEGORY_NAME.focus();
  }
});










/* ==========================================================================
  Resize Bars Functionality
========================================================================== */

/* Adding The Event Listeners To The Resizer Bars
========================================================================== */
LEFT_ASIDE_RESIZE_BAR.addEventListener("mousedown", manageResizeBarsEventsFunc);
RIGHT_ASIDE_RESIZE_BAR.addEventListener("mousedown", manageResizeBarsEventsFunc);
RIGHT_ASIDE_RESIZE_BAR.addEventListener("dblclick", () => {
  controlTaskDetails(false);
  // Save Data
  mainData.data[mainData.currActiveCategory].activeTask = undefined;
  saveData();
});



/* Manage The Resize Bars Events Functionality
========================================================================== */
function manageResizeBarsEventsFunc(e) {
  TASK_DETAILS_SIDE.style.transition = "none";
  // Setting Up The Values
  resizeData.targetResize = e.currentTarget.dataset.target;
  resizeData.currWidth = parseInt(getComputedStyle(document.body).getPropertyValue(`${resizeData.targetResize}-width`));
  resizeData.anchorPoint = e.clientX;
  // Adding The Main Event Listener
  document.body.addEventListener("mousemove", updateResizeBarPos);
  // Stop "updateResizeBarPos()" Function
  document.body.addEventListener("mouseup", commonStatements, {once: true});
  document.body.addEventListener("mouseleave", commonStatements, {once: true});
  // Update Resize Bar Common Statements
  function commonStatements(e2) {
    document.body.removeEventListener("mousemove", updateResizeBarPos);
    TASK_DETAILS_SIDE.style.transition = "width .4s";
    if (resizeData.targetResize !== "--right-aside") return;
    if (e2.clientX - e.clientX > 90) {
      controlTaskDetails(false);
    } else controlTaskDetails(true);
    // Stop "commonStatements()" Function
    document.body.removeEventListener("mouseup", commonStatements);
    document.body.removeEventListener("mouseleave", commonStatements);
  }
}



/* Update The Resize Position While Mouse Move Event
========================================================================== */
function updateResizeBarPos(e) {
  let offset = e.clientX - resizeData.anchorPoint;
  offset *= resizeData.targetResize === "--right-aside" ? -1 : 1;
  // Get The Min And Max Values
  let min = parseInt(getComputedStyle(document.body).getPropertyValue(`${resizeData.targetResize}-min-width`));
  let max = parseInt(getComputedStyle(document.body).getPropertyValue(`${resizeData.targetResize}-max-width`));
  // Check For The "offset" If It Is Greater Than The "min" and Smaller Than The "max" Before Updating The Position
  if (resizeData.currWidth + offset < min || resizeData.currWidth + offset > max) return;
  document.body.style.setProperty(`${resizeData.targetResize}-width`, `${resizeData.currWidth + offset}px`);
}









/* ==========================================================================
  App Notifications
========================================================================== */

/* Create Notification Function
 * icoName_Values: trash | checkmark | circle-warning
========================================================================== */
function createNofit(text, ico, color, confirm = false, dur = 3000, confirmCallback, cancelCallback) {
  // Create Notification DOM
  const NOTIFICATION = document.createElement("div");
  const NORMAL_NOTIF_MODE_PART = document.createElement("div");
  const NOTIF_ICO = document.createElement("span");
  const NOTIF_TEXT = document.createElement("p");

  // ==>> Settings Attributes
  // Classes
  NOTIFICATION.classList.add("notif");
  NORMAL_NOTIF_MODE_PART.classList.add("normal-mode");
  NOTIF_ICO.classList.add("ico");
  // Styles
  NOTIFICATION.style.setProperty("--dur", `${dur}ms`);
  NOTIFICATION.style.setProperty("--color", colorsObj[color]);
  NOTIF_ICO.style.backgroundImage = `url(./icons/notif-icons/${ico}-ico.svg)`;
  
  // Appending Elements
  NORMAL_NOTIF_MODE_PART.append(NOTIF_ICO, NOTIF_TEXT);
  NOTIFICATION.appendChild(NORMAL_NOTIF_MODE_PART);
  document.body.appendChild(NOTIFICATION);
  
  // Setting TextContent
  NOTIF_TEXT.textContent = text;
  
  // If Confirm Mode Notification
  if (confirm) {
    // Create DOM
    const CONFIRM_NOTIF_MODE_PART = document.createElement("div");
    const CANCEL_BTN = document.createElement("span");
    const CONFIRM_BTN = document.createElement("span");
    // Setting Attributes
    CONFIRM_NOTIF_MODE_PART.classList.add("confirm-mode");
    CANCEL_BTN.classList.add("cancel-btn");
    CONFIRM_BTN.classList.add("confirm-btn");
    // Remove The Notification And Update The Positions When Click Cancel
    CANCEL_BTN.addEventListener("click", e => removeNotif(e.target.parentElement.parentElement));

    // Appending Children
    CONFIRM_NOTIF_MODE_PART.append(CONFIRM_BTN, CANCEL_BTN);
    NOTIFICATION.appendChild(CONFIRM_NOTIF_MODE_PART);
    // Setting TextContent
    CANCEL_BTN.textContent = "Cancel";
    CONFIRM_BTN.textContent = "Confirm";
    // Callbacks
    CANCEL_BTN.addEventListener("click", cancelCallback);
    CONFIRM_BTN.addEventListener("click", confirmCallback);
    CONFIRM_BTN.addEventListener("click", () => removeNotif(NOTIFICATION));
  } else {
    // Create Close Button If Not Confirm Mode
    const NOTIF_CLOSE_BTN = document.createElement("span");
    NOTIF_CLOSE_BTN.classList.add("close-btn");
    NORMAL_NOTIF_MODE_PART.appendChild(NOTIF_CLOSE_BTN);
    // Remove The Notification And Update The Positions When Click Close Button
    NOTIF_CLOSE_BTN.addEventListener("click", e => removeNotif(e.target.parentElement.parentElement));
    // Callbacks
    NOTIF_CLOSE_BTN.addEventListener("click", cancelCallback);
  }
  
  // Update Notifications Positions
  updateNotifPos();
  // Fix Issus [The Bottom Transistion Appears From Bottom Zero]
  NOTIFICATION.style.transition = "none";

  // Remove The Notifications After dur
  setTimeout(() => {
    removeNotif(NOTIFICATION);
    cancelCallback && cancelCallback();
  }, dur);

  // Return The Notification To Use It In Callbacks
  return NOTIFICATION;
}



/* Remove Notifications Function
========================================================================== */
function removeNotif(notif) {
  notif.classList.add("hide");
  setTimeout(() => {
    notif.remove();
    updateNotifPos();
  }, 200);
  // Remove the "active-del" from the target item if exist
  let activeDel = document.querySelector(".active-del");
  if (activeDel) activeDel.classList.remove("active-del");
  // 
  if (notif.querySelector("span.ico").style.backgroundImage.includes("trash")) displayDeleteBtnsFunc(false);
}



/* Update Notifications Postion Function
========================================================================== */
function updateNotifPos() {
  let offset = 16;
  [...document.querySelectorAll(".notif:not(.hide)")].forEach(el => {
    el.style.setProperty("transition", `bottom .4s`);
    el.style.setProperty("bottom", `${offset}px`);
    offset += el.getBoundingClientRect().height + 16;
  });
}










/* ==========================================================================
  Markdown Update 10/13/2024
========================================================================== */



/* Convert Markdown To HTML Function
========================================================================== */
function convertMarkdownToHTML(markdown) {
    // Convert links
    markdown = markdown.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank">$1</a>');

    // Convert emphasis
    markdown = markdown.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');
    markdown = markdown.replace(/\*(.*?)\*/g, '<em>$1</em>');

    // Convert blockquotes
    markdown = markdown.replace(/^> (.*)$/gm, '<blockquote>$1</blockquote>');

    // Convert unordered lists
    markdown = markdown.replace(/(?:^|\n)-- (.*)/g, '<li class="nested">$1</li>');
    markdown = markdown.replace(/(?:^|\n)- (.*)/g, '<li>$1</li>');
    markdown = markdown.replace(/(?:<li>.*<\/li>)+/g, match => `<ul>${match}</ul>`);

    // Convert todo checkboxes
    markdown = markdown.replace(/\[ \]/g, '<input type="checkbox">');
    markdown = markdown.replace(/\[x\]/g, '<input type="checkbox" checked>');
    markdown = markdown.replace(/\[-\]/g, '<input type="checkbox" checked disabled>');

    return markdown;
}


/* Editing Mode
========================================================================== */
// Start Editing Mode
EDIT_DES_BTN.addEventListener("click", () => {
  EDIT_DES_BTN.parentElement.classList.add("edit-mode");
  TASK_DES.focus();
});

// Prevent Going NewLine When Exist The Editing Mode
TASK_DES.addEventListener("keydown", e => {
  if (e.key == "Enter" && !e.shiftKey)
    e.preventDefault();
});

// Exist The Editing Mode
TASK_DES.addEventListener("keyup", e => {
  if (e.key == "Enter" && !e.shiftKey) {
    if (TASK_DES.value.trim() != "") {
      let markdownResult = convertMarkdownToHTML(TASK_DES.value);
      MARKDOWN_OUTPUT.innerHTML = markdownResult;
    } else MARKDOWN_OUTPUT.innerHTML = "<span class=\"empty\">There is no description</span>";
    TASK_DES.parentElement.classList.remove("edit-mode");
  }
});



/* TASK_DES Listen To Input Event
========================================================================== */
// Debouncing Part
let taskDesFunc = debonce(text => {
  // Update Data
  let targetTaskId = mainData.data[mainData.currActiveCategory].activeTask;
  mainData.data[mainData.currActiveCategory].tasksObj[targetTaskId].taskDes = text;
  saveData();
});

// Calling The Debouncing Part
TASK_DES.addEventListener("input", e => taskDesFunc(e.target.value));









/* ==========================================================================
  Drag And Drop Functionality
========================================================================== */



/* Dragstart
========================================================================== */

// => Adding Dragstart Event
TASKS_LIST.addEventListener("dragstart", dragStartFunc);
CATEGORIES_LIST.addEventListener("dragstart", dragStartFunc);

// => Dragstart Function
function dragStartFunc(e) {
  // Create The Dragging Ghost Image
  const DRAG_GHOST = e.target.cloneNode(true);
  currDragOverParent = e.target.parentElement;
  DRAG_GHOST.id += "-cloned";
  e.target.classList.add("curr-dragging");
  // Add Styling Class To The Ghost Image
  let ghostStyleType = currDragOverParent.classList.contains("tasks-list") ? "task" : "category";
  let activeClass = e.target.classList.contains("active") ? " active" : "";
  DRAG_GHOST.className = `dragging ${ghostStyleType}${activeClass}`;
  // Update Styles
  let targetElData = e.target.getBoundingClientRect();
  DRAG_GHOST.style.top = `${targetElData.top}px`;
  DRAG_GHOST.style.left = `${targetElData.left}px`;
  DRAG_GHOST.style.width = `${targetElData.width}px`;
  document.body.appendChild(DRAG_GHOST);
  // Remove The Default Dragging Ghost Image 
  const empty = document.createElement("span");
  e.dataTransfer.setDragImage(empty, 0, 0);
  // Update "currDraggingGhost" Data
  currDraggingGhost = {id: DRAG_GHOST.id, x: e.clientX - targetElData.left, y: e.clientY - targetElData.top, ghostStyleType};
  // Add Pointer Event None To The Parent Element
  setTimeout(() => currDragOverParent.classList.add("pointer-none"));
}



/* Dragover
========================================================================== */
document.body.addEventListener("dragover", e => {
  e.preventDefault();
  // Check For Current Dragging Element
  if (currDraggingGhost && currDraggingGhost.id) {
    // Update The Dragging Ghost Position
    const DRAG_GHOST = document.getElementById(currDraggingGhost.id);
    DRAG_GHOST.style.top = `${e.clientY - currDraggingGhost.y}px`;
    DRAG_GHOST.style.left = `${e.clientX - currDraggingGhost.x}px`;
    // => Update The Current Element Position
    // Get The After Element Logic
    let afterEl = [...currDragOverParent.querySelectorAll("li:not(.curr-dragging)")].reduce((acc, curr) => {
      let elData = curr.getBoundingClientRect();
      let offset = e.clientY - (elData.top + elData.height / 2);
      if (offset > acc.offset && offset <= 0) {
        return {offset, el: curr}
      } else return acc;
    }, {offset: Number.NEGATIVE_INFINITY});
    // Insert The Current Dragging Element Before The "afterEl"
    currDragOverParent.insertBefore(document.querySelector(".curr-dragging"), afterEl.el);
  }
});



/* Dragend
========================================================================== */
document.body.addEventListener("dragend", e => {
  // Getting The Drag Elements
  const DRAG_GHOST = document.getElementById(currDraggingGhost.id);
  const CURR_DRAGGING = document.querySelector(".curr-dragging");
  // Remove Pointer Event None To The Parent Element
  CURR_DRAGGING.parentElement.classList.remove("pointer-none");
  // Adding The Transition Effect
  let targetElData = e.target.getBoundingClientRect();
  DRAG_GHOST.style.transition = "top .2s, left .2s";
  DRAG_GHOST.style.top = `${targetElData.top}px`;
  DRAG_GHOST.style.left = `${targetElData.left}px`;
  // Remove The Drag Stuff
  setTimeout(() => {
    DRAG_GHOST.remove();
    CURR_DRAGGING.classList.remove("curr-dragging");
  }, 200);
  // => Update And Saving The Data
  // Update Data Function
  let updateDataFunc = (path, obj) => {
    let temp = path[obj];
    path[obj] = {};
    currDragOverParent.querySelectorAll("li").forEach(el => path[obj][el.id] = temp[el.id]);
    saveData();
  };
  // Check For The Target Dragging Type To Get It's Path
  if (currDraggingGhost.ghostStyleType === "task") {
    updateDataFunc(mainData.data[mainData.currActiveCategory], "tasksObj");
  } else if (currDraggingGhost.ghostStyleType === "category") updateDataFunc(mainData, "data");
  // Reset The Dragging Temp Variables
  currDraggingGhost = {};
  currDragOverParent = {};
});
















/* ==========================================================================
  Common Function
========================================================================== */

/* Saving Data Function
========================================================================== */
function saveData() {
  localStorage.setItem("todoApp", JSON.stringify(mainData));
}



/* Control Opening And Closing Task Details Side
========================================================================== */
function controlTaskDetails(open) {
  let max = parseInt(getComputedStyle(document.body).getPropertyValue("--right-aside-max-width"));
  if (open) {
    document.body.style.setProperty("--right-aside-width", `${max}px`);
    RIGHT_ASIDE_RESIZE_BAR.classList.remove("pointer-none");
  } else {
    document.body.style.setProperty("--right-aside-width", `0px`);
    RIGHT_ASIDE_RESIZE_BAR.classList.add("pointer-none");
  }
}



/* Debonce Function
========================================================================== */
function debonce(cb, dur = 400) {
  let timeout;
  return arg => {
    clearInterval(timeout);
    timeout = setTimeout(() => cb(arg), dur);
  };
}



/* Display Delete Buttons Function
========================================================================== */
function displayDeleteBtnsFunc(pointerNone) {
  // Add Or Remove "pointer-none" Class
  function classManipulating(el) {
    if (pointerNone) {
      el.classList.add("pointer-none");
    } else el.classList.remove("pointer-none");
  }
  // Check
  classManipulating(DELETE_CATEGORY_BTN);
  classManipulating(DEL_TASK_BTN);
  classManipulating(SUBTASKS_LIST);
  classManipulating(LINKS_LIST);
}



/* Make keyboard shortcuts
========================================================================== */
window.addEventListener("keydown", e => {
  if (e.key == "Escape") {
    let notificationList = [...document.querySelectorAll(".notif")];
    if (notificationList.length > 0) removeNotif(notificationList[0]);
  }
});