import { getToken } from '../functions/getAuthConfig'

export default function dataUpload(data){

    function handleErrors(response) {
        if (!response.ok) {
            alert(response.status);
        } else if (response.ok) {
            alert('Data uploaded');
        }
        return response;
    }
    getToken().then(token=>{
        var toke = token.replace(/^"(.*)"$/, '$1');
        var oauth = "Token " + toke;

        fetch('http://interviews.busaracenterlab.org/api/v1/mobile/probes-data/create-bulk',{
            method:'POST',
            headers:{
                'Content-Type':'application/json',
                Authorization:oauth
            },
            body:JSON.stringify(data)
        }).then(handleErrors)
            .then(response=>response.json())
            .then((response)=>{
                console.log(response);

            })

    })



}