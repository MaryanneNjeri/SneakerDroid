
export default function register(userInfo){
    console.log(userInfo)
    function handleErrors(response) {
        if (!response.ok) {
            alert(response.status);
        } else if (response.ok) {
            alert('Registered Successfully');
        }
        return response;
    }

    fetch('http://interviews.busaracenterlab.org/api/v1/mobile/participants/',{
        method:'POST',
        headers:{
            Accept: 'application/json',
            'Content-Type':'application/json',
        },
        body:JSON.stringify(userInfo)
    }).then(handleErrors)
        .then(response=>response.json())
        .then((response)=>{console.log(response)})
}