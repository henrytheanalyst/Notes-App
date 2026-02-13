 const notesInput=document.getElementById("notesInput");
        const addBtn=document.getElementById("addBtn");
        const noteRecords=document.getElementById("noteRecords");
        const filteredBtns=document.querySelectorAll(".filter-btn");
        const STORAGE_KEY="henry_v1_notesapp_v1";
        let currentFilter="all";
        let notes=[];
        let editingId=null;

        function saveNotes(){
            localStorage.setItem(STORAGE_KEY,JSON.stringify(notes))
        }
        function loadNotes(){
            try {
                const raw=localStorage.getItem(STORAGE_KEY);
                if(!raw)return;
                notes=JSON.parse(raw);
                if(!Array.isArray(notes))notes=[]
            } catch (error) {
                console.error("Error parsing the notes",error);
                
            }
        }
        function renderNotes(){
            noteRecords.innerHTML="";
            let filtered=notes;

            if(currentFilter==="pending"){
                filtered=notes.filter(n=>!n.completed)
            }
            else if(currentFilter==="completed"){
                filtered=notes.filter(n=>n.completed)
            }
            else{
                filtered=notes
            }

            filtered.forEach(note=>{
                const li=document.createElement("li");
                const span=document.createElement("span");
                span.textContent=note.text;
                if(note.completed)span.classList.add("completed");
                const checkBox=document.createElement("input");
                checkBox.type="checkbox";
                checkBox.checked=note.completed;
                checkBox.addEventListener("change",()=>{
                    note.completed=checkBox.checked;
                    saveNotes()
                    renderNotes()
                })

                const editBtn=document.createElement("button");
                editBtn.textContent="Edit"
                editBtn.addEventListener("click",()=>{
                    notesInput.value=note.text;
                    editingId=note.id;
                    addBtn.textContent="Update Note"
                })
                
                const delBtn=document.createElement("button");
                delBtn.textContent="Del";
                delBtn.addEventListener("click",()=>{
                    notes=notes.filter(n=>n.id !== note.id);
                    saveNotes();
                    renderNotes()
                })

                const contentDiv=document.createElement("div");
                contentDiv.className="contentDiv";
                contentDiv.append(checkBox,span);

                const actions=document.createElement("div");
                actions.className="actions";
                actions.append(editBtn,delBtn);

                li.append(contentDiv,actions);
                noteRecords.appendChild(li)
            })
            
        }
        function addOrUpdate(){
                const text=notesInput.value.trim();
                if(!text)return;

                if(editingId){
                    notes=notes.map(n=>n.id === editingId ? {...n,text}: n)
                    editingId=null;
                    addBtn.textContent="Add Note"
                }
                else{
                    notes.push({
                        id:Date.now(),
                        text,
                        completed:false
                    })
                }

                notesInput.value="";
                saveNotes();
                renderNotes()
            }

            addBtn.addEventListener("click",addOrUpdate);

            notesInput.addEventListener("keydown",e=>{
                if(e.key==="Enter"){
                    addOrUpdate()
                }
            });

            filteredBtns.forEach(btn=>{
                btn.addEventListener("click",()=>{
                    filteredBtns.forEach(b=>b.classList.remove("active"));
                    btn.classList.add("active");
                    currentFilter=btn.dataset.filter;
                    renderNotes()
                })
            })

            loadNotes();
            renderNotes()

