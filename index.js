class ToDo {
    static allTodos = [];

    constructor(title, description, dueDate, priority, projectName = ""){
        this.title = title
        this.description = description
        this.dueDate = new Date(dueDate).toLocaleDateString('nl-NL', {weekday: "short", month: "short", day: "numeric", year: "numeric"})
        this.priority = priority
        this.id = crypto.randomUUID()
        this.projectName = projectName

        ToDo.allTodos.push(this)
    }

    static removeTodo(id) {
        const [removableItem] = ToDo.allTodos.filter(todo => todo.id === id)
        if(removableItem){
             let indexRemovableItem = ToDo.allTodos.indexOf(removableItem)
             ToDo.allTodos.splice(indexRemovableItem, 1)
        }
    }

    static getTodoById(id){
        return ToDo.allTodos.find(todo => todo.id === id)
    }

    update({ title, description, dueDate, priority, projectName }) {
        if (title) this.title = title;
        if (description) this.description = description;
        if (dueDate) this.dueDate = new Date(dueDate).toLocaleDateString('nl-NL', {weekday: "short", month: "short", day: "numeric", year: "numeric"});
        if (priority) this.priority = priority;
        this.projectName = !projectName ? "" : projectName;
      }

}

class Project {
    static allProjects = [];

    constructor(title){
        this.title = title
        this.toDoList = []

        this.id = crypto.randomUUID()
        Project.allProjects.push(this)
    }

    addTodo(title, description, dueDate, priority) {
        this.toDoList.push(new ToDo(title, description, dueDate, priority, this.title))
    }

    static updateToDo(targetedProject, id, toBeUpdatedProject, { title, description, dueDate, priority, projectName}) {
        targetedProject.removeTodo(id)
        !toBeUpdatedProject ? new ToDo(title, description, dueDate, priority) : toBeUpdatedProject.addTodo(title, description, dueDate, priority)
    }

    updateProjectName(title){
        this.title = title
    }

    removeTodo(id){
        const index = this.toDoList.findIndex(todo => todo.id === id)
        this.todolist.splice(index, 1)
        ToDo.removeTodo(id)
    }

    get todolist(){
        return this.toDoList
    }

    static getProjectByName(title){
        return Project.allProjects.find(project => project.title === title)
    }

    static removeProject(id) {
        const [removableItem] = Project.allProjects.filter(project => project.id === id)
        if(removableItem){
            removableItem.toDoList.forEach(todo => ToDo.removeTodo(todo.id))            
            let indexRemovableItem = Project.allProjects.indexOf(removableItem)
            Project.allProjects.splice(indexRemovableItem, 1)
            UI.update()
        }
    }
}

class UI{
    static renderToDos(projectName, todos){
        const tasksContainer = document.querySelector(".tasks-container > ul")
        tasksContainer.innerHTML = ""
        const title = document.querySelector('.title-main')
        let todosToBeRendered = [];

        if (projectName === undefined || projectName === ""){
            todosToBeRendered = ToDo.allTodos
            title.firstChild.textContent = "All Tasks"
        }else if(projectName === "Overdue"){
            todosToBeRendered = todos
            title.firstChild.textContent = projectName
        } else if(projectName){
            todosToBeRendered = ToDo.allTodos.filter(todo => todo.projectName === projectName)
            title.firstChild.textContent = projectName
        }

        let priorityColor = {
            low: "#d1e1f4",
            normal: "#ead1b3",
            high: "#eec0c0"
        }

        todosToBeRendered.forEach(todo => {
            const li = document.createElement('li')
            li.classList.add('task-item')
            li.setAttribute("data-id", todo.id)
            li.innerHTML = `
            <div>
                <button class="delete-task" style="background-color:${priorityColor[todo.priority]};" type="submit" role="checkbox"></button>
                <div class="task-item-data">
                    <h3 class="task-title">${todo.title}</h3>
                    <p class="task-description">${todo.description}</p>
                    <p class="due-date">
                        <span><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="#000" width="16"><path d="M232-132q-26 0-43-17t-17-43v-496q0-26 17-43t43-17h80v-92h32v92h276v-92h28v92h80q26 0 43 17t17 43v496q0 26-17 43t-43 17H232Zm0-28h496q12 0 22-10t10-22v-336H200v336q0 12 10 22t22 10Zm-32-396h560v-132q0-12-10-22t-22-10H232q-12 0-22 10t-10 22v132Zm0 0v-164 164Z"></path></svg> ${todo.dueDate}</span>
                        <span>${todo.projectName ? '| ' + todo.projectName : ''}</span>
                    </p>
                </div>
            </div>
            `
            tasksContainer.append(li)
        })
    }

    static renderProjects(){
        const projectContainer = document.querySelector(".projects")
        projectContainer.innerHTML = ""

        Project.allProjects.forEach(project => {
            const taskCount = project.toDoList?.length || 0;
            const li = document.createElement('li')
            li.setAttribute("data-id", project.id)
            li.classList.add('project')
            li.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="#777" width="20"><path d="M172.309-180.001q-30.308 0-51.308-21t-21-51.308v-455.382q0-30.308 21-51.308t51.308-21h219.613l80 80h315.769q30.308 0 51.308 21t21 51.308v375.382q0 30.308-21 51.308t-51.308 21H172.309Zm0-59.999h615.382q5.385 0 8.847-3.462 3.462-3.462 3.462-8.847v-375.382q0-5.385-3.462-8.847-3.462-3.462-8.847-3.462H447.385l-80-80H172.309q-5.385 0-8.847 3.462-3.462 3.462-3.462 8.847v455.382q0 5.385 3.462 8.847 3.462 3.462 8.847 3.462ZM160-240v-480 480Z"></path></svg>
                <span class="project-title">${project.title}</span>
                <div class="project-meta">
                    <span class="total-tasks">${taskCount}</span>
                    <span class="project-settings"><svg fill="#000000" height="20" width="20" version="1.1" id="Icons" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 32 32" xml:space="preserve"><g><path d="M16,10c1.7,0,3-1.3,3-3s-1.3-3-3-3s-3,1.3-3,3S14.3,10,16,10z"/><path d="M16,13c-1.7,0-3,1.3-3,3s1.3,3,3,3s3-1.3,3-3S17.7,13,16,13z"/><path d="M16,22c-1.7,0-3,1.3-3,3s1.3,3,3,3s3-1.3,3-3S17.7,22,16,22z"/></g></svg></span>
                </div>
            `
            projectContainer.append(li)
        })
    }

    static renderNoteCount(projectName, todos){
        const counter = document.querySelector('.note-counter')
        let todosToBeRendered = []
        if (projectName === undefined || projectName === ""){
            todosToBeRendered = ToDo.allTodos
        }else if(projectName === "Overdue"){
            todosToBeRendered = todos
        } else if(projectName){
            todosToBeRendered = ToDo.allTodos.filter(todo => todo.projectName === projectName)
        }
        counter.textContent = ` (${todosToBeRendered.length})`
    }

    static update(projectName, todos){
        this.renderToDos(projectName, todos)
        this.renderProjects()
        this.renderNoteCount(projectName, todos)
        saveJson()
    }
}

function saveJson(){
    localStorage.setItem("todos", JSON.stringify(ToDo.allTodos))
    localStorage.setItem("projects", JSON.stringify(Project.allProjects))
}

function loadJson(){
    const todos = JSON.parse(localStorage.getItem("todos"))
    const projects = JSON.parse(localStorage.getItem("projects"))

    if(!projects || !todos) return

    projects.forEach(project => {
        const newProject = new Project(project.title)
        project.toDoList.forEach(todo => {
            newProject.addTodo(todo.title, todo.description, todo.dueDate, todo.priority)
        })
        console.log(newProject)
    })

    console.log(projects)
    todos.filter(todo => {
        return !todo.projectName
    }).forEach(todo => {
        new ToDo(todo.title, todo.description, todo.dueDate, todo.priority, todo.projectName)
    })

    UI.update()
}

// const projectVacation = new Project("Vacation")
// const levenHerpakken = new Project("Leven terug")

// projectVacation.addTodo("Backpack", "Laptop, 2 outfits, powerbank", new Date("12-25-2025"), "low")
// projectVacation.addTodo("Reis", "Ticket, app downloaden, Koffer halen, verzekering afsluiten", new Date("02-31-2025"), "high")
// projectVacation.addTodo("kados", "Youssef = telefoon, esma = schoolboeken, niger = outfitje", new Date("01-5-2026"), "normal")
// levenHerpakken.addTodo("Werk zoeken", "Meer solliciteren", new Date("01-13-2025"), "normal")

// const newToDo = new ToDo("Werk zoeken", "Meer solliciteren", new Date("05-21-2025"), "high")

// levenHerpakken.addTodo("Gym pakken", "Vaker naar de gym, Juiste gear halen", new Date("10-02-2025"), "normal")
// levenHerpakken.addTodo("Arabisch leren", "Vaker op Aljazeera", new Date("01-12-2025"), "low")


loadJson()


const addTaskButtons = document.querySelectorAll('[data-id = addTask]')
const createProjectButton = document.querySelector('[data-task = createProject]')
const overlay = document.getElementById("overlay")

const UiForProjectsSelection = () => {
    const selectElement = document.createElement("select")
    selectElement.setAttribute("name", "projectName")
    selectElement.setAttribute("id", "projectName")
    selectElement.setAttribute("required", true)
    
    const placeholder = document.createElement("option")
    placeholder.setAttribute("disabled", true)
    placeholder.textContent = "Select Project"
    selectElement.append(placeholder)
    
    const optionElement = document.createElement("option")
    optionElement.setAttribute("value", "")
    optionElement.textContent = "Tasks"
    selectElement.setAttribute("selected", true)
    selectElement.appendChild(optionElement)
    const projectOrganised = document.createElement('optgroup')
    projectOrganised.label = "My projects"


    
    Project.allProjects.forEach(project => {
        const optionElement = document.createElement("option")
        optionElement.setAttribute("value", project.title)
        optionElement.textContent = project.title
        projectOrganised.appendChild(optionElement)
    })
    selectElement.appendChild(projectOrganised)
    
    document.querySelector('.buttons').before(selectElement)
}

function addForm(e){
    addTaskButtons.forEach(button => {
        button.dataset.switch = "true"
    })
    createProjectButton.dataset.switch = "true"
    overlay.classList.add("show")

    const form = document.createElement('form')
    form.classList.add("addTaskForm")
    form.innerHTML = `<input required type="text" name="title" id="title" placeholder="Title">
    <textarea type="text" id="description" name="description" placeholder="Notes"></textarea>
    <input required name="duedate" type="date">
    <select name="priority" id="priority">
        <option value="no_priority">No priority</option>
        <option value="low">Low</option>
        <option value="normal">Normal</option>
        <option value="high">High</option>
    </select>
    <div class="buttons">
        <button type="button" value="cancel">Cancel</button>
        <button type="submit" id="addTask">Add Task</button>
    </div>`
    document.getElementById("overlay").insertAdjacentElement("beforebegin", form)

    const cancelButton = document.querySelector("[value=cancel]")
    cancelButton.addEventListener('click', (e) => {
        form.remove()
        addTaskButtons.forEach(button => {
            button.dataset.switch = "false"
        })
        createProjectButton.dataset.switch = "false"
        overlay.classList.remove("show")


    })

    form.addEventListener("submit", (e) => {
        e.preventDefault()

        let obj = {}

        const formData = new FormData(form)
        
        for (const [key, value] of formData) {
            obj[key] = value;
        }

        if( obj.projectName ){
                const project = Project.getProjectByName(obj.projectName)
                project.addTodo(obj.title, obj.description, obj.duedate, obj.priority)
        } else (
            new ToDo(obj.title, obj.description, obj.duedate, obj.priority)
        )
        UI.update()
        addTaskButtons.forEach(button => {
            button.dataset.switch = "false"
        })
        createProjectButton.dataset.switch = "false"
        overlay.classList.remove("show")

        form.remove();


    })
}
addTaskButtons.forEach(button => {
    button.addEventListener("click", () => {
        if(button.dataset.switch === "false"){
            addForm()
            UiForProjectsSelection()
        }
})
})



// Removing todos and renaming todos


document.querySelector(".tasks-container").addEventListener('click', (e) => {
    if(e.target.closest(".delete-task")){
        const targetedLi = e.target.closest("li")
        const idOfLi = targetedLi?.getAttribute("data-id")
        const [filteredProject] = Project.allProjects.filter(project => project.toDoList.some(todo => todo.id === idOfLi))
        filteredProject ? filteredProject.removeTodo(idOfLi) : ToDo.removeTodo(idOfLi)
        UI.update()
        return
    }
    
    if(e.target.closest("li")){
        const id = e.target.closest(".task-item").getAttribute("data-id")
        const targetedToDo = ToDo.getTodoById(id)
        const date = new Date(targetedToDo.dueDate)
        year = date.getFullYear()
        month = String(date.getMonth() + 1).padStart(2, "0")
        day = String(date.getDate()).padStart(2, "0");

        const formattedDate = `${year}-${month}-${day}`

        const form = document.createElement('form')
        form.classList.add("addTaskForm")
        form.innerHTML = `<input required type="text" name="title" value="${targetedToDo.title}" id="title" placeholder="Title">
        <textarea type="text" id="description" name="description" placeholder="Notes">${targetedToDo.description}</textarea>
        <input required name="dueDate" value="${formattedDate}" type="date">
        <select name="priority" id="priority">
            <option value="no_priority">No priority</option>
            <option value="low">Low</option>
            <option value="normal">Normal</option>
            <option value="high">High</option>
        </select>
        <div class="buttons">
            <button type="button" value="cancel">Cancel</button>
            <button type="submit" id="addTask">Change Task</button>
        </div>`
        document.getElementById("overlay").insertAdjacentElement("beforebegin", form)
        UiForProjectsSelection()
        document.querySelector("#priority").value = targetedToDo.priority
        document.querySelector("#projectName").value = targetedToDo.projectName || "";

        overlay.classList.add("show")



        const cancelButton = document.querySelector("[value=cancel]")
        cancelButton.addEventListener('click', (e) => {
            form.remove()
            overlay.classList.remove("show")

        })


        form.addEventListener("submit", (e) => {
            e.preventDefault()

            let obj = {}

            const formData = new FormData(form)
            
            for (const [key, value] of formData) {
                obj[key] = value;
            }

            if(targetedToDo.projectName === "" && obj.projectName){
                ToDo.removeTodo(id)
                const project =  Project.getProjectByName(obj.projectName)
                project.addTodo(obj.title, obj.description, obj.dueDate, obj.priority)
            }else if(targetedToDo.projectName !== obj.projectName){
                const project1 = Project.getProjectByName(targetedToDo.projectName)
                const project2 = Project.getProjectByName(obj.projectName)
                Project.updateToDo(project1, id, project2, obj)
            }else{
                targetedToDo.update(obj)
            }
            
            UI.update()

            overlay.classList.remove("show")
            form.remove();


        })
        return
    }
})

const projectContainer = document.querySelector(".projects")

projectContainer.addEventListener('click', (e) => {
    // Check if a project setting (SVG) was clicked
    if (e.target.closest("svg")) {
      const li = e.target.closest('.project');
      const projectID = li.getAttribute('data-id');
  
      // Only add the menu if it doesn't exist already
      if (!li.querySelector('.project-menu')) {
        li.insertAdjacentHTML("beforeend", `<div class="project-menu">
            <button class="delete-project" data-id="${projectID}">Delete</button>
            <button class="rename-project" data-id="${projectID}">Rename</button>
        </div>`);
      }
      return; // Stop further processing
    }
  
    // Delegate click for delete project button
    if (e.target.matches('.delete-project')) {
      const projectID = e.target.getAttribute('data-id');
      Project.removeProject(projectID);
      return;
    }
    
    // Delegate click for rename project button
    if (e.target.matches('.rename-project')) {
        overlay.classList.add("show")
        const li = e.target.closest('li')
        const projectTitle = li.querySelector(".project-title").textContent
        console.log(projectTitle)
        
        const form = document.createElement('form')
        form.classList.add("addTaskForm")
        form.innerHTML = `
            <input required type="text" name="title" id="title" placeholder="Project name">
            <div class="buttons">
                <button type="button" value="cancel">Cancel</button>
                <button type="submit" id="addTask">Change Project name</button>
            </div>`

        document.getElementById("overlay").insertAdjacentElement("beforebegin", form)
        document.querySelector('.project-menu').remove()
      
        const cancelButton = document.querySelector("[value=cancel]")
        cancelButton.addEventListener('click', (e) => {
            form.remove()
        
            createProjectButton.dataset.switch = "false"
            overlay.classList.remove("show")

        })

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        let obj = {}

        const formData = new FormData(form)
        
        for (const [key, value] of formData) {
            obj[key] = value;
        }


        const project = Project.getProjectByName(projectTitle)

        project.updateProjectName(obj.title)
        project.toDoList.forEach(todo => todo.projectName = obj.title)

        UI.update(obj.title)
        
        addTaskButtons.forEach(button => {
            button.dataset.switch = "false"
        })
        createProjectButton.dataset.switch = "false"
        overlay.classList.remove("show")

        form.remove();
    })
      return;
    }
  
    // If a project li is clicked (but not on the SVG or the menu buttons)
    const li = e.target.closest('.project');
    if (li && li.dataset.id) {
      const projectName = li.querySelector(".project-title").textContent.trim();
      UI.update(projectName);
    }
  });

const viewAllTasksButton = document.querySelector("[data-id = showAllTasks]")

viewAllTasksButton.addEventListener("click", (e) => {

    UI.update()
})

createProjectButton.addEventListener('click', (e) => {
    if(createProjectButton.dataset.switch === "true") return
    addTaskButtons.forEach(button => {
        button.dataset.switch = "true"
    })
    createProjectButton.dataset.switch = "true"
        overlay.classList.add("show")


    const form = document.createElement('form')
    form.classList.add("addTaskForm")
    form.innerHTML = `
    <input required type="text" name="title" id="title" placeholder="Project name">
    <div class="buttons">
        <button type="button" value="cancel">Cancel</button>
        <button type="submit" id="addTask">Add Project</button>
    </div>`

    document.getElementById("overlay").insertAdjacentElement("beforebegin", form)

    const cancelButton = document.querySelector("[value=cancel]")
    cancelButton.addEventListener('click', (e) => {
        form.remove()
        addTaskButtons.forEach(button => {
            button.dataset.switch = "false"
        })
        createProjectButton.dataset.switch = "false"
        overlay.classList.remove("show")

    })

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        let obj = {}

        const formData = new FormData(form)
        
        for (const [key, value] of formData) {
            obj[key] = value;
        }

        
        new Project(obj.title)
        UI.update()
        
        addTaskButtons.forEach(button => {
            button.dataset.switch = "false"
        })
        createProjectButton.dataset.switch = "false"
        overlay.classList.remove("show")

        form.remove();
    })
})

document.querySelector("[data-id=overdueTasks]").addEventListener('click', (e) => {
    const displayedTodos = ToDo.allTodos.filter(todo => {
        const timeInMiliSeconds = Date.parse(todo.dueDate)
        if (timeInMiliSeconds < Date.now()) {
            return true
        }
    })
    UI.update("Overdue", displayedTodos)
})


