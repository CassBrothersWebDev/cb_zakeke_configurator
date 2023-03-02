export function addEmail (email) {
    console.log(`${email} is to be added to mailing list`);

    /*
    const options = {
        method: 'POST',
        headers: {
          accept: 'application/json',
          revision: '2023-02-22',
          'content-type': 'application/json',
          Authorization: 'Klaviyo-API-Key pk_5c498a2eebb4ddf1e821aada5baafbb025'
        },
        body: JSON.stringify({data: [{type: 'profile', id: email}]})
      };
      
      fetch('https://a.klaviyo.com/api/lists/YmPSxe/relationships/related_resource/', options)
        .then(response => response.json())
        .then(response => console.log(response))
        .catch(err => console.error(err));
        */
} 