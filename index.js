class ToDo {
    static allTodos = [];

    constructor(title, description, dueDate, priority, projectName){
        this.title = title
        this.description = description
        this.dueDate = dueDate
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

        this.id = crypto.randomUUID()
        Project.allProjects.push(this)
    }

    addTodo(title, description, dueDate, priority) {
        new ToDo(title, description, dueDate, priority, this.title)
    }

    static removeProject(id) {
        const [removableItem] = Project.allProjects.filter(project => project.id === id)
        if(removableItem){
             let indexRemovableItem = Project.allProjects.indexOf(removableItem)
             Project.allProjects.splice(indexRemovableItem, 1)
        }
    }
}

const projectVacation = new Project("Vacation")
const levenHerpakken = new Project("Leven terug")

projectVacation.addTodo("Backpack", "Laptop, 2 outfits, powerbank", new Date("12-25-2025"), "Urgent")
projectVacation.addTodo("Reis", "Ticket, app downloaden, Koffer halen, verzekering afsluiten", new Date("12-31-2025"), "Urgent")
projectVacation.addTodo("kados", "Youssef = telefoon, esma = schoolboeken, niger = outfitje", new Date("01-5-2026"), "Urgent")

levenHerpakken.addTodo("Werk zoeken", "Meer solliciteren", new Date("09-13-2025"), "urgent")
levenHerpakken.addTodo("Gym pakken", "Vaker naar de gym, Juiste gear halen", new Date("10-02-2025"), "normal")
levenHerpakken.addTodo("Arabisch leren", "Vaker op Aljazeera", new Date("07-22-2025"), "low")



