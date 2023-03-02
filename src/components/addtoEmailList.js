export function addEmail (user_email) {
    console.log(`${user_email} is to be added to mailing list`);

    
    const options = {
        method: 'POST',
        headers: {
          accept: 'application/json',
          'content-type': 'application/json',
        },
        body: JSON.stringify({email: user_email})
      };
      
      fetch('https://cb-zakeke-emailer-api.herokuapp.com/create-profile', options)
        .then(response => response.json())
        .then(response => {
            if(response.data){
                console.log("New added: " + response.data.id);
            } else {
                console.log("Already exists: " + response.errors[0].id);
            }
        })
        .catch(err => console.error(err));
} 