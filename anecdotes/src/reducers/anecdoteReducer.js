import { createSlice } from '@reduxjs/toolkit';
import anecdoteService from '../services/anecdotes';

const anecdotesAtStart = [
	'If it hurts, do it more often',
	'Adding manpower to a late software project makes it later!',
	'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
	'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
	'Premature optimization is the root of all evil.',
	'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
];

const getId = () => (100000 * Math.random()).toFixed(0);

const asObject = (anecdote) => {
	return {
		content: anecdote,
		id: getId(),
		votes: 0,
	};
};

const initialState = anecdotesAtStart.map(asObject);

const anecdoteSlice = createSlice({
	name: 'anecdotes',
	initialState,
	reducers: {
		voteAnecdote(state, action) {
			const id = action.payload.id;
			const newAnecdote = action.payload;
			return state.map((a) => (a.id === id ? newAnecdote : a));
		},
		addAnecdoteHelper(state, action) {
			state.push(action.payload);
		},
		setAnecdotes(state, action) {
			return action.payload;
		},
	},
});

export const { voteAnecdote, addAnecdoteHelper, setAnecdotes } = anecdoteSlice.actions;

export const initializeAnecdotes = () => {
	return async (dispatch) => {
		const response = await anecdoteService.getAll();
		dispatch(setAnecdotes(response));
	};
};

export const createAnecdote = (content) => {
	return async (dispatch) => {
		const response = await anecdoteService.createNew(content);
		dispatch(addAnecdoteHelper(response));
	};
};

export const saveVote = (id, anecdote) => {
	return async (dispatch) => {
		const newAnecdote = {
			...anecdote,
			votes: anecdote.votes + 1,
		};
		const response = await anecdoteService.update(id, newAnecdote);
		dispatch(voteAnecdote(response));
	};
};

export default anecdoteSlice.reducer;

// const reducer = (state = initialState, action) => {
// 	// console.log('state now: ', state);
// 	// console.log('action', action);
// 	switch (action.type) {
// 		case 'VOTE': {
// 			const id = action.payload.id;
// 			const anecdote = state.find((a) => a.id === id);
// 			const newAnecdote = {
// 				...anecdote,
// 				votes: anecdote.votes + 1,
// 			};
// 			return state.map((a) => (a.id === id ? newAnecdote : a));
// 		}
// 		case 'NEW_ANECDOTE': {
// 			const newAnecdote = asObject(action.payload.content);
// 			return state.concat(newAnecdote);
// 		}
// 		default:
// 			return state;
// 	}
// };

// export const voteAnecdote = (id) => {
// 	return {
// 		type: 'VOTE',
// 		payload: {
// 			id,
// 		},
// 	};
// };

// export const addAnecdoteHelper = (content) => {
// 	return {
// 		type: 'NEW_ANECDOTE',
// 		payload: {
// 			content,
// 		},
// 	};
// };
