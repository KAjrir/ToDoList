const testForm = document.querySelector('form')
const title = document.querySelector('#title')
const button = document.querySelector('#addTask')

// button.addEventListener("click", (e) => {
//     e.preventDefault()
//     const datum = new Date(testForm.value)
//     const formatted = datum.toLocaleDateString('en-US', {
//         weekday: "short",
//         month: "short",
//         day: "numeric",
//     })

//     console.log(formatted)
//     console.log(testForm.value, title.value)
// })

testForm.addEventListener("submit", (e) => {
    e.preventDefault()

    let obj = {}

    const formData = new FormData(testForm)
    
    for (const [key, value] of formData) {
        obj[key] = value;
    }

    console.log(obj)

})


array = [2,3,4,2,3,5]