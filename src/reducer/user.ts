// src/features/users/userSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { IUser } from "../shared/types";

const initialState: IUser = {
  bitrix_id: '',
  id: -1,
  name: '',
  user: {
    is_manager: false,
    is_company: false,
    is_drug_store: false,
    is_drug_store_group_owner: false,
    username: ''
  },
}

export const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    getUser: (state, action: PayloadAction<IUser>) => {
      return state = action.payload;
      // console.log('state: ', state);
    },
  },
});

export const { getUser } =
  userSlice.actions;

export const userSelector = (state: RootState) => {
  console.log('stateL ', state);
  return state.userReducer;
};
export default userSlice.reducer;