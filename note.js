const addBtn = document.getElementById('add')

const notes = JSON.parse(localStorage.getItem('notes'))

const noteDiv = document.querySelector('.takeNote');


if(notes)
{
    notes.forEach(note => addNewNote(note))
}

addBtn.addEventListener('click', () => addNewNote() )

function addNewNote(text = '')
{
    const note = document.createElement('div')
    note.classList.add('note')

    note.innerHTML=
    `
    <div class="tools">
    <button class="speech" ><i class="fa fa-microphone"></i></button>
    <button class="stop" ><i class="fa fa-microphone-slash"></i></button>
        <button class="edit"><i class="fa fa-edit"></i>
        </button>
        <button class="delete"><i class="fa fa-trash-o"></i>
        </button>
        </div>

        <div class="main ${text ? "" : "hidden"}"></div>
       
        <textarea class="${text ? "hidden" : ""}"></textarea>

    `
    const editBtn = note.querySelector('.edit')
    const deleteBtn = note.querySelector('.delete')
    const main = note.querySelector('.main')
    const textArea = note.querySelector('textarea')
    

    textArea.value = text
    main.innerHTML = marked(text)

    if("webkitSpeechRecognition" in window){

        console.log("available")

        let speechRecognition = new webkitSpeechRecognition();

        let final_transcript =  " ";

        speechRecognition.continuous=true;
        //speechRecognition.interimResults = true;
        
        speechRecognition.onstart = () =>{
            console.log("You can speak now")

        };

        speechRecognition.onerror = () =>{
            console.log("Error")

        };

        speechRecognition.onend = () => {
            // Hide the Status Element
            //document.querySelector("#status").style.display = "none";
            console.log("speech end")
          };

        speechRecognition.onresult = (Event) => {

             //let interim_transcript = " ";

            for (let i = Event.resultIndex; i < Event.results.length; ++i){
                if(Event.results[i].isFinal){
                    final_transcript += Event.results[i][0].transcript;

                }
                else{
                     //interim_transcript += Event.results[i][0].transcript;
                    
                    console.log("not included interim")
                }
            }

            note.querySelector('.main').innerHTML= final_transcript;
            // note.querySelector('.main').innerHTML = interim_transcript;
        };

        note.querySelector('.speech').onclick = () => {
            speechRecognition.start();
            console.log("speech started")
        }

        note.querySelector('.stop').onclick = () => {
            speechRecognition.stop();
            console.log("speech has stoped");
        }

         updateLS();


        
        

    }

    else{
        console.log("speech not available try typing")
    }
   

    
    
    
   
    
    deleteBtn.addEventListener('click', () => {
        note.remove()
        updateLS()   })

    editBtn.addEventListener('click', () => {
        main.classList.toggle('hidden')
        textArea.classList.toggle('hidden')
        
    })

    textArea.addEventListener('input', (e) => {
        const{value} = e.target
        main.innerHTML = marked(value)
        updateLS()
    })

    




    
    noteDiv.appendChild(note);
    // document.body.appendChild(note)
}

function updateLS()
{
    const notesText = document.querySelectorAll('textarea')
    const notes =[]
    notesText.forEach(note => notes.push(note.value))
    localStorage.setItem('notes', JSON.stringify(notes))
}