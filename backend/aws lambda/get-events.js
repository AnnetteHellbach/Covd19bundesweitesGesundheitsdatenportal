
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
        s.push ({sniff: item.sniff});
        s.push ({bodyache: item.bodyache});
        s.push ({headache: item.headache});
        s.push ({dryCaught: item.dryCaught});
        s.push ({temperature: item.temperature});

        var a = {
          id : item.id,
          zipCode: item.zipCode,
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