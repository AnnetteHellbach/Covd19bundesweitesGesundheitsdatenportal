
const AWS = require("aws-sdk");
const documentClient = new AWS.DynamoDB.DocumentClient();

exports.handler = async event => {
  const params = {
    TableName: "events" // The name of your DynamoDB table
  };
  try {
    // Utilising the scan method to get all items in the table
    const data = await documentClient.scan(params).promise();
    const body = [];
    
    data.Items.forEach( (item) => {
        var s = [];
        s.push ({cold: item.cold});
        s.push ({headache: item.headache});
        s.push ({dryCough: item.dryCough});
        s.push ({temperature: item.temperature});
        s.push ({limbPain: item.limbPain});
        s.push ({throatItches: item.throatItches});
        s.push ({nauseous: item.nauseous});

        var a = {
          id : item.id,
          zipCode: item.zipCode,
          age: item.age,
          feeling: item.feeling,
          preExistingConditions: item.preExistingConditions,
          timestamp: item.timestamp,
          symptoms: s,
        }
        body.push(a);
    });
    

    const response = {
      statusCode: 200,
      body: body
    };
    return response;
  } catch (e) {
    return {
      statusCode: 500
    };
  }
};