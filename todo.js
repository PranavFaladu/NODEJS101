// const url = require("url")

// let x = new URL("https://www.pranavfaladu.com:123")

// console.log(`host: ${x.hostname}`)
// console.log(`protocol: ${x.protocol}`)
// console.log(`port: ${x.port}`)

const fs = require('fs');
const path = require('path');

// Database file path
const DB_FILE = path.join(__dirname, 'todos.json');

// Ensure database file exists
if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify([], null, 2));
}

// Helper functions
const loadTodos = () => {
    try {
        return JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
    } catch (error) {
        console.error('Error reading database:', error.message);
        return [];
    }
};

const saveTodos = (todos) => {
    try {
        fs.writeFileSync(DB_FILE, JSON.stringify(todos, null, 2));
        return true;
    } catch (error) {
        console.error('Error saving database:', error.message);
        return false;
    }
};

const generateId = (todos) => {
    const maxId = todos.reduce((max, todo) => Math.max(max, todo.id), 0);
    return maxId + 1;
};

// Command handlers
const commands = {
    list() {
        const todos = loadTodos();
        if (todos.length === 0) {
            console.log('No todos found.');
            return;
        }
        
        console.log('\nYour TODOs:\n');
        todos.forEach(todo => {
            const status = todo.completed ? '✓' : '☐';
            console.log(`${todo.id}. [${status}] ${todo.title}`);
            if (todo.description) {
                console.log(`   Description: ${todo.description}`);
            }
        });
    },

    add(title, description = '') {
        if (!title) {
            console.error('Title is required!');
            return;
        }

        const todos = loadTodos();
        const newTodo = {
            id: generateId(todos),
            title,
            description,
            completed: false,
            createdAt: new Date().toISOString()
        };

        todos.push(newTodo);
        if (saveTodos(todos)) {
            console.log(`Added todo: ${title}`);
        }
    },

    complete(id) {
        if (!id) {
            console.error('Todo ID is required!');
            return;
        }

        const todos = loadTodos();
        const todoIndex = todos.findIndex(t => t.id === parseInt(id));
        
        if (todoIndex === -1) {
            console.error('Todo not found!');
            return;
        }

        todos[todoIndex].completed = true;
        if (saveTodos(todos)) {
            console.log(`Marked todo #${id} as completed`);
        }
    },

    delete(id) {
        if (!id) {
            console.error('Todo ID is required!');
            return;
        }

        const todos = loadTodos();
        const todoIndex = todos.findIndex(t => t.id === parseInt(id));
        
        if (todoIndex === -1) {
            console.error('Todo not found!');
            return;
        }

        todos.splice(todoIndex, 1);
        if (saveTodos(todos)) {
            console.log(`Deleted todo #${id}`);
        }
    },

    help() {
        console.log(`
Todo App Commands:
  list                          Show all todos
  add <title> [description]     Add a new todo
  complete <id>                 Mark a todo as completed
  delete <id>                   Delete a todo
  help                          Show this help message
        `);
    }
};

// Main program
function main() {
    const args = process.argv.slice(2);
    const command = args[0] || 'help';

    switch (command.toLowerCase()) {
        case 'list':
            commands.list();
            break;

        case 'add':
            const title = args[1];
            const description = args.slice(2).join(' ');
            commands.add(title, description);
            break;

        case 'complete':
            commands.complete(args[1]);
            break;

        case 'delete':
            commands.delete(args[1]);
            break;

        case 'help':
            commands.help();
            break;

        default:
            console.error('Unknown command. Use "help" to see available commands.');
            break;
    }
}

// Run the program
main();