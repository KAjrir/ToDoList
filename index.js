class ToDo {
    static allTodos = [];

    constructor(title, description, dueDate, priority, projectName = ""){
        this.title = title
        this.description = description
        this.dueDate = new Date(dueDate).toLocaleDateString('en-US', {weekday: "short", month: "short", day: "numeric"})
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

    get todolist(){
        return this.toDoList
    }

    static getProjectByName(title){
        return Project.allProjects.find(project => project.title === title)
    }

    static removeProject(id) {
        const [removableItem] = Project.allProjects.filter(project => project.id === id)
        if(removableItem){
             let indexRemovableItem = Project.allProjects.indexOf(removableItem)
             Project.allProjects.splice(indexRemovableItem, 1)
        }
    }
}

class UI{
    static renderToDos(projectName){
        const tasksContainer = document.querySelector(".tasks-container > ul")
        tasksContainer.innerHTML = ""

        const todosToBeRendered = projectName === undefined ? ToDo.allTodos : ToDo.allTodos.filter(todo => todo.projectName === projectName)

        todosToBeRendered.forEach(todo => {
            const li = document.createElement('li')
            li.classList.add('task-item')
            li.setAttribute("data-id", todo.id)
            li.innerHTML = `
            <div>
                <button class="delete-task" type="submit" role="checkbox"></button>
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
        projectContainer.insertAdjacentHTML("beforeend", `
            <li data-task="createProject">+ Create a new project</li>
          `);
    }

    static renderNoteCount(projectName){
        const counter = document.querySelector('.note-counter')
        const todosToBeRendered = projectName === undefined ? ToDo.allTodos : ToDo.allTodos.filter(todo => todo.projectName === projectName)
        counter.textContent = todosToBeRendered.length
    }

    static update(projectName){
        this.renderToDos(projectName)
        this.renderProjects()
        this.renderNoteCount(projectName)
    }
}


const projectVacation = new Project("Vacation")
const levenHerpakken = new Project("Leven terug")

projectVacation.addTodo("Backpack", "Laptop, 2 outfits, powerbank", new Date("12-25-2025"), "Urgent")
projectVacation.addTodo("Reis", "Ticket, app downloaden, Koffer halen, verzekering afsluiten", new Date("12-31-2025"), "Urgent")
projectVacation.addTodo("kados", "Youssef = telefoon, esma = schoolboeken, niger = outfitje", new Date("01-5-2026"), "Urgent")

levenHerpakken.addTodo("Werk zoeken", "Meer solliciteren", new Date("09-13-2025"), "urgent")
levenHerpakken.addTodo("Gym pakken", "Vaker naar de gym, Juiste gear halen", new Date("10-02-2025"), "normal")
levenHerpakken.addTodo("Arabisch leren", "Vaker op Aljazeera", new Date("07-12-2025"), "low")

const newToDo = new ToDo("Werk zoeken", "Meer solliciteren", new Date("09-13-2025"), "urgent")

UI.update()


const addTaskButtons = document.querySelectorAll('[data-id = addTask]')
const UiForProjectsSelection = () => {
    const selectElement = document.createElement("select")
    selectElement.setAttribute("name", "projectname")
    selectElement.setAttribute("id", "projectname")
    selectElement.setAttribute("required", true)
    
    const placeholder = document.createElement("option")
    placeholder.setAttribute("value", "")
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
    const form = document.createElement('form')
    form.classList.add("addTaskForm")
    form.innerHTML = `<input required type="text" name="title" id="title" placeholder="Title">
    <textarea type="text" id="description" name="description" placeholder="Notes"></textarea>
    <input required name="duedate" type="date">
    <select name="priority" id="priority">
        <option value="">No priority</option>
        <option value="low">Low</option>
        <option value="normal">Normal</option>
        <option value="high">High</option>
    </select>
    <div class="buttons">
        <button type="button" value="cancel">Cancel</button>
        <button type="submit" id="addTask">Add Task</button>
    </div>`
    
    document.body.appendChild(form)
    const cancelButton = document.querySelector("[value=cancel]")
    cancelButton.addEventListener('click', (e) => {
        form.remove()
        addTaskButtons.forEach(button => {
            button.dataset.switch = "false"
        })
    })

    form.addEventListener("submit", (e) => {
        e.preventDefault()

        let obj = {}

        const formData = new FormData(form)
        
        for (const [key, value] of formData) {
            obj[key] = value;
        }

        if( obj.projectname ){
                const project = Project.getProjectByName(obj.projectname)
                project.addTodo(obj.title, obj.description, obj.duedate, obj.priority)
        } else (
            new ToDo(obj.title, obj.description, obj.duedate, obj.priority)
        )
        UI.update()
        addTaskButtons.forEach(button => {
            button.dataset.switch = "false"
        })
        form.remove();


    })
}
addTaskButtons.forEach(button => {
    button.addEventListener("click", () => {
        if(button.dataset.switch === "false"){
            addForm()
        }
        UiForProjectsSelection()
})
})

document.querySelector(".tasks-container").addEventListener('click', (e) => {
    const targetedLi = e.target.closest("li")
    const idOfLi = targetedLi.getAttribute("data-id")
    console.log(idOfLi)
    ToDo.removeTodo(idOfLi)
    UI.update()
})

const projectContainer = document.querySelector(".projects")

projectContainer.addEventListener('click', (e) => {
    const li = e.target.closest('li')
    const projectSettings = e.target.closest('.project-settings')

    // if(projectSettings){
    //     console.log("maniak SPAN")
    // }

    if(li.dataset.id) {
        const projectName = li.querySelector(".project-title").textContent.trim()
        UI.update(projectName)
    }

    


})

const viewAllTasksButton = document.querySelector("[data-id = showAllTasks]")

viewAllTasksButton.addEventListener("click", (e) => {
    UI.update()
})