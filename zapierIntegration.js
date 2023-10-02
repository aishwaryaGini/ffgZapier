const options = {
  url: 'https://data.donorfy.com/api/v1/' + bundle.inputData.apiKey + '/constituents/search',
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  params: {
    'searchFor': bundle.inputData.firstName
  }
}

return z.request(options)
  .then((response) => {
      const results = response.json;

      let matchingConstituents = [];
      const firstName = bundle.inputData.firstName;
      const surname = bundle.inputData.surname;
      //check if there were multiple constituents with the same firstname
      for (let i = 0; i < results.length; i++) {
        if (results.length > 1) {
          constituent = results[i];
          if (constituent['FirstName'] === firstName && constituent['LastName'] === surname) {
            matchingConstituents.push(constituent);
          }
        }
      } 
  
      // there is more than 1 constituent with the same first name and surname
      if (matchingConstituents.length > 1) {
        console.log("matching constituents: " + matchingConstituents);
        return [{"status": 200, "numberOfConstituents": matchingConstituents.length}];
      }
      //otherwise we  know there was exactly one constituent returned
      return [{"status": 200, "numberOfConstituents": 1, "constituentId": matchingConstituents[0]["ConstituentId"]}];
  })
   .catch((error) => {
      //returns 404 when no constituent was found that matched the search criteria
      return [{"status": 404}];
  });
