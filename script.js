let firstSender

const pickFile = () => {
    document.getElementsByClassName("filePicker")[0].click()
}

const openFile = (event) => {
    var input = event.target
    var reader = new FileReader()
    reader.onload = function(){
        convertIntoMessages(reader.result)
    }
    reader.readAsText(input.files[0])
}

const convertIntoMessages = (someString) => {
    let message = "", messages = []
    for(let i=0; i<someString.length; i++){
        message = message.concat(someString[i])
        if(someString.charAt(i) == '\n'){
            messages.push(message)
            message = ""
        }
    }
    getDataFromMessages(messages)
}

const getDataFromMessages = (allMessages) => {
    firstSender = ""
    let messagesData = [], messageDate, messageSender, messageContent, currentData = "", dataNumber = 0, currentMessage
    for(let i=0; i<allMessages.length; i++){
        for(let j=0; j<allMessages[i].length; j++){
            if(dataNumber == 0 && allMessages[i][j] == "-"){
                if(currentData.slice(0, 10).match(/^\d{2}([./-])\d{2}\1\d{4}$/)){
                    messageDate = currentData.slice(0, -1)
                    currentData = ""
                    dataNumber++
                }
            }else if(dataNumber == 1 && allMessages[i][j] == ":"){
                messageSender = currentData.substring(1)
                currentData = ""
                dataNumber++
                if(firstSender == ""){
                    firstSender = messageSender
                }
            }else if(allMessages[i][j] == "\n"){
                if(currentData[0] == " "){
                    messageContent = currentData.substring(1)
                }else{
                    messageContent = currentData
                }
                currentData = ""
                dataNumber = 0
                currentMessage = {
                    date: messageDate,
                    sender: messageSender,
                    content: messageContent
                }
                messagesData.push(currentMessage)
            }else{
                currentData = currentData.concat(allMessages[i][j])
            }
        }
    }
    buildChat(messagesData)
}

const buildChat = (modifiedMessages) => {
    let messagesClass = ""
    document.getElementsByClassName("chat-container")[0].innerHTML = ""
    document.getElementsByClassName("chooseFirst")[0].style.display = "none"
    for(let i=0; i<modifiedMessages.length; i++){
        if(modifiedMessages[i].sender == firstSender){
            messagesClass = "message myMessage"
        }else if(modifiedMessages[i].sender == undefined){
            messagesClass = "message undefined"
        }else{
            messagesClass = "message"
        }
        document.getElementsByClassName("chat-container")[0].innerHTML += `
        <div class="${messagesClass}">
            <div>
                <p class="sender">${modifiedMessages[i].sender}</p>
                <p class="content" dir="auto">${modifiedMessages[i].content}</p>
                <p class="date">${modifiedMessages[i].date}</p>
            </div>
        </div>
        `
    }
}

function searchMessages(){
    var searchable, txtValue
    var input = document.getElementsByClassName("searchInput")[0]
    var filter = input.value.toUpperCase()
    var container = document.getElementsByClassName("chat-container")[0]
    var items = container.getElementsByClassName("message")
    for(let i=0; i<items.length; i++){
        searchable = items[i].getElementsByClassName("content")[0]
        txtValue = searchable.textContent || searchable.innerText
        if(txtValue.toUpperCase().indexOf(filter) > -1){
            items[i].classList.remove("removed")
            setTimeout(() => {
                items[i].classList.remove("filtered")
            },200)
        }else{
            items[i].classList.add("filtered")
            setTimeout(() => {
                items[i].classList.add("removed")
            },200)
        }
    }
    setTimeout(() => {
        let filteredMessages = 0
        for(let i=0; i<items.length; i++){
            if(items[i].classList.contains("removed") || items[i].classList.contains("filtered")){
                filteredMessages++
            }
        }
        if(filteredMessages == items.length && items.length > 0){
            document.getElementsByClassName("noMessage")[0].style.display = "flex"
        }else{
            document.getElementsByClassName("noMessage")[0].style.display = "none"
        }
    }, 200)
}