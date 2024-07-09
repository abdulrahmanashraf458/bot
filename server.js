const { spawn } = require('child_process');
const path = require("path");
const fastify = require("fastify")({
  logger: true,
});

// إطلاق البوت Python عند بدء الخادم
const botProcess = spawn('python3', ['bot.py']);

botProcess.stdout.on('data', (data) => {
  console.log(`stdout: ${data}`);
});

botProcess.stderr.on('data', (data) => {
  console.error(`stderr: ${data}`);
});

botProcess.on('close', (code) => {
  console.log(`child process exited with code ${code}`);
});

// إعداد الملفات الثابتة
fastify.register(require("@fastify/static"), {
  root: path.join(__dirname, "public"),
  prefix: "/", // optional: default '/'
});

fastify.get("/", function (request, reply) {
  reply.sendFile('index.html');
});

const start = async () => {
  try {
    await fastify.listen(process.env.PORT || 3000, '0.0.0.0');
    console.log(`Server is running on ${process.env.PORT || 3000}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
