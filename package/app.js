var spawn = require('child_process').spawn
const data = require('./package.json').model
const args = process.env.npm_config_models ? process.env.npm_config_models.split(',') : getAll(data)

function getAll (data) {
  let arr = []
  for (let i in data) {
    arr.push(i)
  }
  return arr
}
for (let i in data) {
  if (args.indexOf(i) > -1) {
    const arg = '--model=' + data[i]
    spawn(process.platform === 'win32' ? 'npm.cmd' : 'npm', ['run', 'build', arg])
    // ls.stdout.on('data', (data) => {
    // })
    // ls.stderr.on('data', (data) => {
    //   console.log(`stderr: ${data}`)
    // })
    // ls.on('close', (code) => {
    //   console.log(`子进程退出码：${code}`)
    // })
  }
}
