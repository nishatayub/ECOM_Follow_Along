import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    email: ''
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setEmail: (state, action) => {
            state.email = action.payload;
        }
    }
});

export const { setEmail } = userSlice.actions;
export default userSlice.reducer;
