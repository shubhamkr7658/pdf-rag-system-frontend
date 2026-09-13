const API_URL = "https://pdf-rag-system-4.onrender.com";

async function askQuestion(){

    const question=document.getElementById("question").value;

    if(question===""){
        alert("Enter a question");
        return;
    }
document.getElementById("answer").innerHTML="<div class='loading'>⏳ Thinking...</div>";

    try{

        const response=await fetch(API_URL,{

            method:"POST",

            headers:{
                "Content-Type":"application/json"
            },

            body:JSON.stringify({

                input:question

            })

        });

        const data=await response.json();

        document.getElementById("answer").innerHTML=data.ai;

    }

    catch(err){

        document.getElementById("answer").innerHTML="Server Error";

        console.log(err);

    }

}
