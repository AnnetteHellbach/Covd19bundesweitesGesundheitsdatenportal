const AWS = require("aws-sdk");
const crypto = require("crypto");

// Generate unique id with no external dependencies
const generateUUID = () => crypto.randomBytes(16).toString("hex");

// Generate Timestamp 
const buildTimestamp = () => new Date().toISOString().
  replace(/T/, ' ').      // replace T with a space
  replace(/\..+/, '')     // delete the dot and everything after
  
// Initialising the DynamoDB SDK
const documentClient = new AWS.DynamoDB.DocumentClient();

exports.handler = async event => {
  console.log(event);
  const { zipCode, age, preExistingConditions, temperature, dryCaught, sniff, bodyache, headache} = event;
  const params = {
    TableName: "events", // The name of your DynamoDB table
    Item: { // Creating an Item with a unique id and with the passed title
      id: generateUUID(),
      timestamp: buildTimestamp(),
      zipCode: zipCode,
      age: age,
      preExistingConditions: preExistingConditions,
      temperature : temperature,
      dryCaught: dryCaught,
      sniff: sniff,
      bodyache: bodyache,
      headache: headache
    }
  };
  try {
    // Utilising the put method to insert an item into the table (https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/GettingStarted.NodeJs.03.html#GettingStarted.NodeJs.03.01)
    const data = await documentClient.put(params).promise();
    const response = {
      statusCode: 200
    };
    return response; // Returning a 200 if the item has been inserted 
  } catch (e) {
    return {
      statusCode: 500,
      body: JSON.stringify(e)
    };
  }
};