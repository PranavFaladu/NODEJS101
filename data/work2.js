const { Console } = require("console")
const os = require("os")

console.log(os.arch())
console.log(os.platform())

console.log(`Total Memory: ${Math.round(os.totalmem()/1024**3)} GB`)

console.log(`Free Memory: ${os.freemem()/1024**3} GB`)

console.log(`Use Memory: ${os.totalmem - os.freemem()/1024**3} GB`)

console.log(`Use Memory: ${((os.totalmem - os.freemem())/os.totalmem())*100} `)


// 1 byte = 8 bits
// 1 kb = 1024 bytes
// 1 mb = 1024 kb
// 1 gb = 1024 mb 

console.log(`Home Directory : ${os.homedir()}`)
console.log(`Temporary Directory : ${os.tmpdir()}`)

console.log(`uptime: ${os.uptime()/(60*60*24)} days`)