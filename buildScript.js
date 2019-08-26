const path = require('path');
const rimraf = require('rimraf');

const { exec } = require('child_process');

const promiseExec = async (command) => {
    return new Promise((resolve, reject) => {
        exec(command, (error, stdout, stderr) => {
            if (error) reject(error.message);
            resolve(stdout ? stdout : stderr);
        });
    });
}

try {
    rimraf.sync(path.join(__dirname, 'build'));
} catch (ex) {
    console.error(ex.message);
}

Promise.all([
    promiseExec('yarn build-server'),
    promiseExec('yarn build-web')
])
.then(() => {
    console.log('Done!');
})
.catch(err => {
    console.error(err);
});