const axios = require('axios');
const fs = require('fs');

const SERVER_URL = process.env.npm_package_config_host + ":" + process.env.npm_package_config_port;
const v = process.env.npm_package_config_apiVersion

async function generateDiagram(diagramName, scriptLocation) {
  try {
    const scriptPath = scriptLocation ? scriptLocation : './scripts/diag-script.py';
    const scriptContent = fs.readFileSync(scriptPath, 'utf8');

    const response = await axios.post(`${SERVER_URL}/${v}/generate-diagram`, {
      python_code: scriptContent,
      name: diagramName
    });

    console.log(response.data);
  } catch (error) {
    console.error('Error generating diagram:', error.response ? error.response.data : error.message);
  }
}

async function getDiagram(fileId, diagramLocation) {
  try {
    const response = await axios.get(`${SERVER_URL}/${v}/get-diagram?file_id=${fileId}`, {
      responseType: 'arraybuffer',
    });
    const pathToWrite = diagramLocation ? `${diagramLocation}/${fileId}.png` : `${fileId}.png`
    console.log(`Writing to: ${pathToWrite}`);
    fs.writeFileSync(pathToWrite, response.data);
    console.log(`Diagram '${pathToWrite}' retrieved successfully.`);
  } catch (error) {
    console.error('Error getting diagram:', error.message);
    console.error('Error getting diagram:', error.response ? error.response.data : error.message);
  }
}

async function getStatus() {
    try {
      const url = `${SERVER_URL}/status`
      console.log(`Checking url: ${url}`)
      const response = await axios.get(url);
      console.log(`Result: '${JSON.stringify(response.data, null, 2)}'`);
    } catch (error) {
      console.error('Server is not running:', error.response ? error.response.data : error.message);
    }
  }

async function main() {
  const command = process.argv[2];

  if (command === 'generate-diagram') {
    const diagramName = process.argv[3];
    const scriptLocation = process.argv[4] || "";
    if (!diagramName) {
      console.error('Please provide a diagram name without spaces.');
      process.exit(1);
    }
    await generateDiagram(diagramName, scriptLocation);
  } else if (command === 'get-diagram') {
    const fileId = process.argv[3];
    const diagramLocation = process.argv[4] || "";
    if (!fileId) {
      console.error('Please provide a diagram fileId without spaces.');
      process.exit(1);
    }
    await getDiagram(fileId, diagramLocation);
  } else if (command === 'status') {
    await getStatus();
  } else {
    console.error('Invalid command. Usage: node index.js [generate-diagram <diagramName> | get-diagram <fileId> <diagramLocation>] | status]');
    process.exit(1);
  }
}

main();