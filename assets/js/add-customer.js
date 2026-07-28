document.querySelectorAll("input").forEach(input=>{

    if(input.readOnly) return;

    input.value="";

});

document.querySelectorAll("textarea").forEach(t=>{

    t.value="";

});

document.querySelectorAll("select").forEach(s=>{

    s.selectedIndex=0;

});

document.querySelector(".btn-success").addEventListener("click",()=>{

    const name=document.querySelector("input[placeholder='Enter Customer Name']");

    if(name.value.trim()===""){

        alert("Customer Name is required");

        name.focus();

        return;

    }

    alert("Customer Created Successfully");

    window.location.href="customers.html";

});

document.querySelector(".btn-outline-secondary").addEventListener("click",()=>{

    if(confirm("Discard customer creation?")){

        window.location.href="customers.html";

    }

});
