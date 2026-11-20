import { Provider, useDispatch, useSelector } from 'react-redux';
import { configureStore, createSlice } from '@reduxjs/toolkit';

const todosSlice = createSlice({
    name: 'todos',
    initialState: [{ id: 0, text: "defaultTodo", done: false }],
    reducers: {
        addTodo: (state, action) => {
            state.push({
                id: Date.now(),
                text: action.payload,
                done: false
            });
        },
        toggleTodo: (state, action) => {
            const todo = state.find(todo => todo.id === action.payload);
            if (todo) { todo.done = !todo.done; }
            else console.log("NIe istnieje")
        },
        removeTodo: (state, action) => {
            return state.filter(todo => todo.id !== action.payload);
        }
    },
});

const { addTodo, toggleTodo, removeTodo } = todosSlice.actions;
const store = configureStore({
    reducer: {
        todos: todosSlice.reducer
    }
});

function TodoList() {
    const todos = useSelector(state => state.todos);
    const dispatch = useDispatch();

    return (<>
        <button onClick={() => dispatch(addTodo("newTodo"))}> Dodaj </button>

        <ul>
            {todos.map(todo => (
                <li key={todo.id}>
                    <button onClick={() => dispatch(toggleTodo(todo.id))}> Czy Zrobione: {todo.done ? "Tak" : "Nie"} </button> - {todo.text}
        
                    <button onClick={() => dispatch(removeTodo(todo.id))}> Usuń </button>
                </li>
            ))}
        </ul>
    </>);
}

function Zadanie2() {
    return (
        <Provider store={store}>
            <TodoList />
        </Provider>
    );
}

export default Zadanie2;
