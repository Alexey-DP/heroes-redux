import { createSlice, createAsyncThunk, createEntityAdapter, createSelector } from "@reduxjs/toolkit";
import { useHttp } from '../../hooks/http.hook';

const herpesAdaprer = createEntityAdapter();

const initialState = herpesAdaprer.getInitialState({
    heroesLoadingStatus: 'idle'
});

export const fetchHeroes = createAsyncThunk(
    'heroes/fetchHeroes',
    () => {
        const {request} = useHttp();
        return request("http://localhost:3001/heroes");
    }
);

const heroesSlice = createSlice({
    name: 'heroes',
    initialState,
    reducers: {
        addNewHero: (state, action) => {
            herpesAdaprer.addOne(state, action.payload);
        },

        deleteHero: (state, action) => {
            herpesAdaprer.removeOne(state, action.payload);
        }
    },
    extraReducers: builder => {
        builder
            .addCase(fetchHeroes.pending, state => {
                state.heroesLoadingStatus = 'loading';
            })
            .addCase(fetchHeroes.fulfilled, (state, action) => {
                state.heroesLoadingStatus = 'idle';
                herpesAdaprer.setAll(state, action.payload);
            })
            .addCase(fetchHeroes.rejected, state => {
                state.heroesLoadingStatus = 'error';
            })
            .addDefaultCase(() => {})
    }
});

const {actions, reducer} = heroesSlice;

export default reducer;

const { selectAll } = herpesAdaprer.getSelectors(state => state.heroes);

export const filteredHeroesSelector = createSelector(
    state => state.filters.activeFilter,
    selectAll,
    (filter, heroes) => {
        if (filter === 'all') {
            return heroes;
        } else {
            return heroes.filter(hero => hero.element === filter);
        }
    }
);

export const {
    addNewHero,
    deleteHero
} = actions;