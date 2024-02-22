const axios = require('axios');
const fs = require('fs');

const SERVER_URL = process.env.npm_package_config_host + ":" + process.env.npm_package_config_port;
const v = process.env.npm_package_config_apiVersion

async function generateDiagram(opts) {
  try {
    const initScript = './scripts/args.py';
    const scriptPath = opts.script ? opts.script : './scripts/diag-script.py';
    const initContent = fs.readFileSync(initScript, 'utf8');
    const scriptContent = fs.readFileSync(scriptPath, 'utf8');
    const body = {
      python_code: initContent + scriptContent,
      out_format: opts.format || 'png'
    }
    const response = await axios.post(`${SERVER_URL}/${v}/generate-diagram`, body);
    console.log(response.data);
  } catch (error) {
    console.error('Error generating diagram:', error.response ? error.response.data : error.message);
  }
}

async function getDiagram(opts) {
  try {
    const fileId = opts.file
    const format = opts.format || 'png'
    const GET_DIAGRAM = `${SERVER_URL}/${v}/get-diagram?file_id=${fileId}&out_format=${format}`
    const response = await axios.get(GET_DIAGRAM, {
      responseType: 'arraybuffer',
    });
    const pathToWrite = opts.outdir ? `${opts.outdir}/${fileId}.${format}` : `${fileId}.${format}`
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
  const args = process.argv.slice(2);
  console.log("args:")
  console.log(args)
  const command = args[0];
  const namedArgs = {};
  args.forEach(arg => {
    if (arg.startsWith('--')) {
        const [key, value] = arg.slice(2).split('=');
        namedArgs[key] = value;
    }
  });

  if (command === 'generate-diagram') {
    if (!namedArgs.script) {
      console.error('Please provide a required script file. example: npm run generate-diagram --script=/path/to/script.py [--format=<[png|jpg|pdf|svg|dot]>]');
      process.exit(1);
    }
    await generateDiagram(namedArgs);
  } else if (command === 'get-diagram') {
    if (!namedArgs.file) {
      console.error('Please provide a diagram fileId. example: npm run get-diagram --file=<fileId> [--outdir=<out dir location>] [--format=<[png|jpg|pdf|svg|dot]>]');
      process.exit(1);
    }
    await getDiagram(namedArgs);
  } else if (command === 'status') {
    await getStatus();
  } else {
    console.error('Invalid command. Usage: npm run [generate-diagram --script=<file location> [--format=<[png|jpg|pdf|svg|dot]>] | get-diagram --file=<fileId> [--outdir=<out dir location>] [--format=<[png|jpg|pdf|svg|dot]>] | status]');
    process.exit(1);
  }
}

main();